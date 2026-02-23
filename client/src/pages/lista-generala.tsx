import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, Trash2, List, Pencil, ChevronDown, ChevronRight, FolderPlus, Tag } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse } from "date-fns";

interface ListColumn {
  key: string;
  label: string;
  required: boolean;
}

interface ListConfig {
  key: string;
  label: string;
  columns: ListColumn[];
}

function CategoryGroupedView({ items, listKey, config }: { items: Record<string, string>[]; listKey: string; config: ListConfig }) {
  const { toast } = useToast();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [addUnitCategory, setAddUnitCategory] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Record<string, string> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [renameCategoryOpen, setRenameCategoryOpen] = useState(false);
  const [renameCategoryOld, setRenameCategoryOld] = useState("");
  const [renameCategoryNew, setRenameCategoryNew] = useState("");
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState("");
  const [search, setSearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const addForm = useForm<Record<string, string>>({ defaultValues: {} });
  const editForm = useForm<Record<string, string>>({ defaultValues: {} });

  const categories = Array.from(new Set(items.map(i => i.categorie || "Necategorizat"))).sort();

  const filtered = items.filter(item => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return Object.values(item).some(v => typeof v === "string" && v.toLowerCase().includes(lower));
  });

  const groupedByCategory: Record<string, Record<string, string>[]> = {};
  for (const item of filtered) {
    const cat = item.categorie || "Necategorizat";
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(item);
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", `/api/liste/${listKey}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setAddUnitOpen(false);
      setAddCategoryOpen(false);
      addForm.reset();
      toast({ title: "Unitate adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const { id, ...body } = data;
      const res = await apiRequest("PATCH", `/api/liste/${listKey}/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setEditOpen(false);
      setEditTarget(null);
      toast({ title: "Unitate actualizata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/liste/${listKey}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      toast({ title: "Unitate stearsa" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare la stergere", description: error.message, variant: "destructive" });
    },
  });

  const renameCategoryMutation = useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
      const categoryItems = items.filter(i => (i.categorie || "Necategorizat") === oldName);
      for (const item of categoryItems) {
        await apiRequest("PATCH", `/api/liste/${listKey}/${item.id}`, { categorie: newName });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setRenameCategoryOpen(false);
      toast({ title: "Categorie redenumita cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const categoryItems = items.filter(i => (i.categorie || "Necategorizat") === categoryName);
      for (const item of categoryItems) {
        await apiRequest("DELETE", `/api/liste/${listKey}/${item.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setDeleteCategoryOpen(false);
      toast({ title: "Categorie stearsa cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare la stergere", description: error.message, variant: "destructive" });
    },
  });

  const handleOpenAddUnit = (category: string) => {
    setAddUnitCategory(category);
    addForm.reset({ categorie: category, singular: "", plural: "", simbol: "" });
    setAddUnitOpen(true);
  };

  const handleOpenAddCategory = () => {
    setNewCategoryName("");
    setAddCategoryOpen(true);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Eroare", description: "Numele categoriei este obligatoriu", variant: "destructive" });
      return;
    }
    if (categories.includes(newCategoryName.trim())) {
      toast({ title: "Eroare", description: "Categoria exista deja", variant: "destructive" });
      return;
    }
    setAddCategoryOpen(false);
    handleOpenAddUnit(newCategoryName.trim());
  };

  const handleEditClick = (item: Record<string, string>) => {
    editForm.reset({
      id: item.id,
      categorie: item.categorie || "",
      singular: item.singular || "",
      plural: item.plural || "",
      simbol: item.simbol || "",
    });
    setEditTarget(item);
    setEditOpen(true);
  };

  const handleRenameCategory = (cat: string) => {
    setRenameCategoryOld(cat);
    setRenameCategoryNew(cat);
    setRenameCategoryOpen(true);
  };

  const handleDeleteCategory = (cat: string) => {
    setDeleteCategoryTarget(cat);
    setDeleteCategoryOpen(true);
  };

  const nonCategorieColumns = config.columns.filter(c => c.key !== "categorie");

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight" data-testid="text-list-title">
              {config.label}
            </h1>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Unitati de masura grupate pe categorii</span>
          </div>
          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={handleOpenAddCategory} data-testid="button-add-category">
            <FolderPlus className="w-3 h-3 mr-0.5" />
            Categorie
          </Button>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cauta unitati..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs"
            data-testid="input-search-list"
          />
        </div>
      </div>

      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Categorie Noua</DialogTitle>
            <DialogDescription>Introduceti numele categoriei (ex: Timp, Distanta, Greutate)</DialogDescription>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Numele categoriei"
            data-testid="input-new-category-name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>Anuleaza</Button>
            <Button onClick={handleCreateCategory} data-testid="button-confirm-new-category">Continua</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adauga Unitate de Masura</DialogTitle>
            <DialogDescription>Categorie: <span className="font-semibold">{addUnitCategory}</span></DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit((data) => {
                if (!data.singular?.trim() || !data.plural?.trim()) {
                  toast({ title: "Eroare", description: "Singular si Plural sunt obligatorii", variant: "destructive" });
                  return;
                }
                createMutation.mutate({ ...data, categorie: addUnitCategory });
              })} className="space-y-4">
              <FormField
                control={addForm.control}
                name="singular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Singular <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Metru" data-testid="input-add-singular" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="plural"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plural <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Metri" data-testid="input-add-plural" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="simbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Simbol</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: m" data-testid="input-add-simbol" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-unit">
                {createMutation.isPending ? "Se salveaza..." : "Salveaza"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editeaza Unitate de Masura</DialogTitle>
            <DialogDescription>Modificati campurile dorite si salvati.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => {
                if (!data.singular?.trim() || !data.plural?.trim()) {
                  toast({ title: "Eroare", description: "Singular si Plural sunt obligatorii", variant: "destructive" });
                  return;
                }
                editMutation.mutate({ ...data, id: editTarget?.id || "" });
              })} className="space-y-4">
              <FormField
                control={editForm.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-category">
                          <SelectValue placeholder="Selectati categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="singular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Singular <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Singular" data-testid="input-edit-singular" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="plural"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plural <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Plural" data-testid="input-edit-plural" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="simbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Simbol</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Simbol" data-testid="input-edit-simbol" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={editMutation.isPending} data-testid="button-submit-edit">
                {editMutation.isPending ? "Se salveaza..." : "Salveaza"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={renameCategoryOpen} onOpenChange={setRenameCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Redenumeste Categoria</DialogTitle>
            <DialogDescription>Categoria "{renameCategoryOld}" va fi redenumita pentru toate unitatile din ea.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameCategoryNew}
            onChange={(e) => setRenameCategoryNew(e.target.value)}
            placeholder="Noul nume"
            data-testid="input-rename-category"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameCategoryOpen(false)}>Anuleaza</Button>
            <Button
              onClick={() => renameCategoryMutation.mutate({ oldName: renameCategoryOld, newName: renameCategoryNew })}
              disabled={renameCategoryMutation.isPending || !renameCategoryNew.trim()}
              data-testid="button-confirm-rename-category"
            >
              {renameCategoryMutation.isPending ? "Se salveaza..." : "Redenumeste"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sterge Categoria</DialogTitle>
            <DialogDescription>
              Sunteti sigur ca doriti sa stergeti categoria "{deleteCategoryTarget}" si toate unitatile din ea ({items.filter(i => (i.categorie || "Necategorizat") === deleteCategoryTarget).length} unitati)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategoryOpen(false)}>Anuleaza</Button>
            <Button
              variant="destructive"
              onClick={() => deleteCategoryMutation.mutate(deleteCategoryTarget)}
              disabled={deleteCategoryMutation.isPending}
              data-testid="button-confirm-delete-category"
            >
              {deleteCategoryMutation.isPending ? "Se sterge..." : "Sterge Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare stergere</DialogTitle>
            <DialogDescription>Sunteti sigur ca doriti sa stergeti aceasta unitate de masura?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Anuleaza</Button>
            <Button variant="destructive" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete">
              {deleteMutation.isPending ? "Se sterge..." : "Sterge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-y-auto p-3 pt-3 space-y-2">
        {Object.keys(groupedByCategory).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Tag className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Nicio unitate de masura gasita</p>
              <p className="text-sm text-muted-foreground mt-0.5">Creati o categorie noua pentru a incepe</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedByCategory).sort(([a], [b]) => a.localeCompare(b)).map(([category, catItems]) => {
            const isExpanded = expandedCategories.has(category);
            return (
              <Card key={category} data-testid={`card-category-${category}`}>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 flex-1 text-left"
                      onClick={() => toggleCategory(category)}
                      data-testid={`button-toggle-category-${category}`}
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="font-semibold text-xs">{category}</span>
                      <Badge variant="secondary" className="text-[10px]">{catItems.length}</Badge>
                    </button>
                    <div className="flex items-center gap-0.5">
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => handleOpenAddUnit(category)} data-testid={`button-add-unit-${category}`}>
                        <Plus className="w-3 h-3 mr-0.5" />Adauga
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRenameCategory(category)} data-testid={`button-rename-category-${category}`} title="Redenumeste categoria">
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteCategory(category)} data-testid={`button-delete-category-${category}`} title="Sterge categoria">
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="overflow-auto max-h-[300px]">
                      <Table className="compact-table">
                        <TableHeader>
                          <TableRow>
                            {nonCategorieColumns.map(col => (
                              <TableHead key={col.key}>{col.label}</TableHead>
                            ))}
                            <TableHead className="w-16"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catItems.map((item) => (
                            <TableRow key={item.id} data-testid={`row-unit-${item.id}`}>
                              {nonCategorieColumns.map(col => (
                                <TableCell key={col.key}>{item[col.key] || ""}</TableCell>
                              ))}
                              <TableCell>
                                <div className="flex items-center gap-0.5">
                                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditClick(item)} data-testid={`button-edit-unit-${item.id}`}>
                                    <Pencil className="w-3 h-3 text-muted-foreground" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setDeleteTarget(item.id); setDeleteDialogOpen(true); }} data-testid={`button-delete-unit-${item.id}`}>
                                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function ListaGenerala() {
  const [, params] = useRoute("/liste-generale/:listKey");
  const listKey = params?.listKey;

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Record<string, string> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: allConfigs, isLoading: isLoadingConfig } = useQuery<ListConfig[]>({
    queryKey: ["/api/liste-config"],
  });

  const config = allConfigs?.find((c) => c.key === listKey);

  const { data: items, isLoading: isLoadingData } = useQuery<Record<string, string>[]>({
    queryKey: ["/api/liste", listKey],
    enabled: !!listKey && !!config,
  });

  const form = useForm<Record<string, string>>({
    defaultValues: {},
  });

  const editForm = useForm<Record<string, string>>({
    defaultValues: {},
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", `/api/liste/${listKey}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setOpen(false);
      form.reset();
      toast({ title: "Inregistrare adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const { id, ...body } = data;
      const res = await apiRequest("PATCH", `/api/liste/${listKey}/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setEditOpen(false);
      setEditTarget(null);
      toast({ title: "Inregistrare actualizata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/liste/${listKey}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liste", listKey] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      toast({ title: "Inregistrare stearsa" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare la stergere", description: error.message, variant: "destructive" });
    },
  });

  const handleEditClick = (item: Record<string, string>) => {
    const defaults: Record<string, string> = { id: item.id };
    if (config) {
      config.columns.forEach((col) => {
        defaults[col.key] = item[col.key] || "";
      });
    }
    editForm.reset(defaults);
    setEditTarget(item);
    setEditOpen(true);
  };

  const handleEditSubmit = (data: Record<string, string>) => {
    editMutation.mutate({ ...data, id: editTarget?.id || "" });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget);
    }
  };

  const handleOpenAdd = () => {
    const defaults: Record<string, string> = {};
    if (config) {
      config.columns.forEach((col) => {
        defaults[col.key] = "";
      });
    }
    form.reset(defaults);
    setOpen(true);
  };

  const handleSubmit = (data: Record<string, string>) => {
    if (config) {
      const hasError = config.columns.some((col) => col.required && !data[col.key]?.trim());
      if (hasError) {
        toast({ title: "Eroare", description: "Completati toate campurile obligatorii", variant: "destructive" });
        return;
      }
    }
    createMutation.mutate(data);
  };

  const filtered =
    items?.filter((item) => {
      if (!search) return true;
      const lowerSearch = search.toLowerCase();
      return Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lowerSearch)
      );
    }) || [];

  const isLoading = isLoadingConfig || isLoadingData;
  const columns = config?.columns || [];
  const label = config?.label || listKey || "Lista";

  if (!listKey) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <List className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium" data-testid="text-no-list-selected">
                Selectati o lista din meniu
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (listKey === "unitate-masura" && config && items) {
    return <CategoryGroupedView items={items} listKey={listKey} config={config} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight" data-testid="text-list-title">
              {label}
            </h1>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Gestioneaza inregistrarile din lista</span>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-6 px-2 text-[10px]" onClick={handleOpenAdd} data-testid="button-add-item">
                <Plus className="w-3 h-3 mr-0.5" />
                Adauga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adauga inregistrare</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {columns.map((col) => {
                    const isDateField = col.key.toLowerCase().startsWith("data") || col.key === "expiraConsimtamant" || col.key === "ultimaActualizare";
                    return (
                      <FormField
                        key={col.key}
                        control={form.control}
                        name={col.key}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {col.label}
                              {col.required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                            <FormControl>
                              {isDateField ? (
                                <DatePicker
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  placeholder={col.label}
                                  data-testid={`input-field-${col.key}`}
                                />
                              ) : (
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder={col.label}
                                  data-testid={`input-field-${col.key}`}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-item"
                  >
                    {createMutation.isPending ? "Se salveaza..." : "Salveaza"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cauta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs"
            data-testid="input-search-list"
          />
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editeaza inregistrare</DialogTitle>
            <DialogDescription>Modificati campurile dorite si salvati.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              {columns.map((col) => {
                const isDateField = col.key.toLowerCase().startsWith("data") || col.key === "expiraConsimtamant" || col.key === "ultimaActualizare";
                return (
                  <FormField
                    key={col.key}
                    control={editForm.control}
                    name={col.key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {col.label}
                          {col.required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                        <FormControl>
                          {isDateField ? (
                            <DatePicker
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder={col.label}
                              data-testid={`input-edit-${col.key}`}
                            />
                          ) : (
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder={col.label}
                              data-testid={`input-edit-${col.key}`}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              <Button
                type="submit"
                className="w-full"
                disabled={editMutation.isPending}
                data-testid="button-submit-edit"
              >
                {editMutation.isPending ? "Se salveaza..." : "Salveaza"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare stergere</DialogTitle>
            <DialogDescription>
              Sunteti sigur ca doriti sa stergeti aceasta inregistrare? Aceasta actiune nu poate fi anulata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Anuleaza
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Se sterge..." : "Sterge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <List className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium" data-testid="text-empty-list">
                Nicio inregistrare gasita
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Adaugati prima inregistrare pentru a incepe
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[calc(100vh-120px)] sticky-table-container">
                <Table className="compact-table">
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col.key} data-testid={`header-${col.key}`}>
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item, index) => (
                      <TableRow key={item.id || index} data-testid={`row-list-item-${item.id || index}`}>
                        {columns.map((col) => {
                          const val = item[col.key];
                          let display = val || "";
                          const isDateCol = col.key.toLowerCase().startsWith("data") || col.key === "expiraConsimtamant" || col.key === "ultimaActualizare";
                          if (isDateCol && val && typeof val === "string") {
                            try {
                              const parsed = parse(val, "yyyy-MM-dd", new Date());
                              if (!isNaN(parsed.getTime())) {
                                display = format(parsed, "dd.MM.yyyy");
                              }
                            } catch {}
                          }
                          if ((col.key === "cotaDeTva" || col.key === "cota_de_tva") && val) {
                            const num = parseFloat(val);
                            display = !isNaN(num) ? (num < 1 ? `${(num * 100).toFixed(0)}%` : `${num}%`) : val;
                          }
                          return (
                            <TableCell key={col.key}>
                              {display}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditClick(item)} data-testid={`button-edit-item-${item.id || index}`}>
                              <Pencil className="w-3 h-3 text-muted-foreground" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteClick(item.id || String(index))} data-testid={`button-delete-item-${item.id || index}`}>
                              <Trash2 className="w-3 h-3 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
