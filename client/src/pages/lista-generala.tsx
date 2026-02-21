import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Plus, Search, Trash2, List } from "lucide-react";

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

export default function ListaGenerala() {
  const [, params] = useRoute("/liste-generale/:listKey");
  const listKey = params?.listKey;

  const [open, setOpen] = useState(false);
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-list-title">
              {label}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Gestioneaza inregistrarile din lista
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAdd} data-testid="button-add-item">
                <Plus className="w-4 h-4 mr-2" />
                Adauga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adauga inregistrare</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {columns.map((col) => (
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
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder={col.label}
                              data-testid={`input-field-${col.key}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cauta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-list"
            />
          </div>
        </div>
      </div>

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

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        {isLoading ? (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col.key} className="py-1" data-testid={`header-${col.key}`}>
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-12 py-1"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item, index) => (
                      <TableRow key={item.id || index} data-testid={`row-list-item-${item.id || index}`}>
                        {columns.map((col) => {
                          const val = item[col.key];
                          let display = val || "";
                          if ((col.key === "cotaDeTva" || col.key === "cota_de_tva") && val) {
                            const num = parseFloat(val);
                            display = !isNaN(num) ? (num < 1 ? `${(num * 100).toFixed(0)}%` : `${num}%`) : val;
                          }
                          return (
                            <TableCell key={col.key} className="text-sm py-1">
                              {display}
                            </TableCell>
                          );
                        })}
                        <TableCell className="py-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteClick(item.id || String(index))}
                            data-testid={`button-delete-item-${item.id || index}`}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
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
