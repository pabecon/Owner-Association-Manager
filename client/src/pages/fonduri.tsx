import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFundSchema, insertFundCategorySchema, FUND_TYPE_LABELS, FUND_TYPE_DESCRIPTIONS, fundTypeEnum } from "@shared/schema";
import type { Fund, FundCategory, Association } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Wallet, ChevronDown, ChevronRight, Trash2, Pencil, Landmark, ListTree, Banknote } from "lucide-react";
import { z } from "zod";

const fundFormSchema = insertFundSchema.extend({
  name: z.string().min(1, "Numele este obligatoriu"),
  associationId: z.string().min(1, "Asociatia este obligatorie"),
});

const categoryFormSchema = insertFundCategorySchema.extend({
  name: z.string().min(1, "Numele este obligatoriu"),
  fundId: z.string().min(1),
});

function FundCategoryManager({ fund }: { fund: Fund }) {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery<FundCategory[]>({
    queryKey: ["/api/fund-categories", fund.id],
    queryFn: async () => {
      const res = await fetch(`/api/fund-categories?fundId=${fund.id}`);
      return res.json();
    },
  });

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { fundId: fund.id, name: "", description: "", budgetAmount: "", currentAmount: "0", sortOrder: 0 },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      const res = await apiRequest("POST", "/api/fund-categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund-categories", fund.id] });
      setAddOpen(false);
      form.reset({ fundId: fund.id, name: "", description: "", budgetAmount: "", currentAmount: "0", sortOrder: 0 });
      toast({ title: "Categorie adaugata" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/fund-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fund-categories", fund.id] });
      toast({ title: "Categorie stearsa" });
    },
  });

  const totalBudget = categories?.reduce((s, c) => s + Number(c.budgetAmount || 0), 0) || 0;
  const totalCurrent = categories?.reduce((s, c) => s + Number(c.currentAmount || 0), 0) || 0;

  return (
    <div className="mt-3 pl-4 border-l-2 border-muted space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Categorii ({categories?.length || 0})</span>
          {totalBudget > 0 && (
            <Badge variant="outline" className="text-xs">
              Buget: {totalBudget.toLocaleString("ro-RO")} RON
            </Badge>
          )}
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-6 text-xs" data-testid={`button-add-category-${fund.id}`}>
              <Plus className="w-3 h-3 mr-1" /> Categorie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Categorie Noua</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-3">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume Categorie</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: Apa calda" data-testid="input-category-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriere</FormLabel>
                    <FormControl><Textarea {...field} value={field.value || ""} placeholder="Detalii categorie..." rows={2} data-testid="input-category-description" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="budgetAmount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buget Alocat (RON)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="ex: 5000.00" data-testid="input-category-budget" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordine Afisare</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-category-sort" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-category">
                  {createMutation.isPending ? "Se salveaza..." : "Adauga Categorie"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {[1, 2].map(i => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-1">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-muted/30 hover:bg-muted/50 text-sm" data-testid={`row-category-${cat.id}`}>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">{cat.name}</span>
                {cat.description && <span className="text-xs text-muted-foreground ml-2">{cat.description}</span>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {cat.budgetAmount && (
                  <Badge variant="secondary" className="text-xs">
                    {Number(cat.currentAmount || 0).toLocaleString("ro-RO")} / {Number(cat.budgetAmount).toLocaleString("ro-RO")} RON
                  </Badge>
                )}
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteMutation.mutate(cat.id)} data-testid={`button-delete-category-${cat.id}`}>
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">Nicio categorie definita</p>
      )}
    </div>
  );
}

function FundCard({ fund, onDelete }: { fund: Fund; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const typeLabel = FUND_TYPE_LABELS[fund.fundType as keyof typeof FUND_TYPE_LABELS] || fund.name;
  const typeDesc = FUND_TYPE_DESCRIPTIONS[fund.fundType as keyof typeof FUND_TYPE_DESCRIPTIONS] || "";

  const typeBadgeColor = {
    intretinere: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    rulment: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    penalizari: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    custom: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  }[fund.fundType] || "bg-gray-100 text-gray-800";

  return (
    <Card className="overflow-hidden" data-testid={`card-fund-${fund.id}`}>
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">
                  {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-sm">{fund.name}</CardTitle>
                    <Badge className={`text-xs ${typeBadgeColor}`}>{typeLabel}</Badge>
                    {!fund.isActive && <Badge variant="outline" className="text-xs">Inactiv</Badge>}
                  </div>
                  {fund.description && <CardDescription className="text-xs mt-0.5">{fund.description}</CardDescription>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold">{Number(fund.currentBalance || 0).toLocaleString("ro-RO")} RON</div>
                  <div className="text-xs text-muted-foreground">Sold curent</div>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(fund.id); }} data-testid={`button-delete-fund-${fund.id}`}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            {fund.bankAccount && (
              <div className="flex items-center gap-1.5 mt-1.5 ml-7">
                <Landmark className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{fund.bankName ? `${fund.bankName} — ` : ""}{fund.bankAccount}</span>
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-3 pt-0">
            {typeDesc && <p className="text-xs text-muted-foreground mb-2 italic">{typeDesc}</p>}
            <FundCategoryManager fund={fund} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function Fonduri() {
  const [selectedAssociation, setSelectedAssociation] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: associations } = useQuery<Association[]>({ queryKey: ["/api/associations"] });

  const effectiveAssocId = selectedAssociation || associations?.[0]?.id || "";

  const { data: fundsList, isLoading } = useQuery<Fund[]>({
    queryKey: ["/api/funds", effectiveAssocId],
    queryFn: async () => {
      if (!effectiveAssocId) return [];
      const res = await fetch(`/api/funds?associationId=${effectiveAssocId}`);
      return res.json();
    },
    enabled: !!effectiveAssocId,
  });

  const form = useForm<z.infer<typeof fundFormSchema>>({
    resolver: zodResolver(fundFormSchema),
    defaultValues: {
      associationId: effectiveAssocId,
      name: "",
      fundType: "custom",
      description: "",
      bankName: "",
      bankAccount: "",
      currentBalance: "0",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof fundFormSchema>) => {
      const res = await apiRequest("POST", "/api/funds", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funds", effectiveAssocId] });
      setAddOpen(false);
      form.reset({ associationId: effectiveAssocId, name: "", fundType: "custom", description: "", bankName: "", bankAccount: "", currentBalance: "0", isActive: true });
      toast({ title: "Fond creat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/funds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funds", effectiveAssocId] });
      toast({ title: "Fond sters" });
    },
  });

  const handleFundTypeChange = (val: string) => {
    form.setValue("fundType", val);
    if (val !== "custom") {
      const label = FUND_TYPE_LABELS[val as keyof typeof FUND_TYPE_LABELS];
      form.setValue("name", label);
    }
  };

  const totalBalance = fundsList?.reduce((s, f) => s + Number(f.currentBalance || 0), 0) || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-funds-title">Fonduri</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gestioneaza fondurile asociatiei</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={effectiveAssocId} onValueChange={(val) => setSelectedAssociation(val)}>
              <SelectTrigger className="w-[220px] h-8 text-xs" data-testid="select-association-filter">
                <SelectValue placeholder="Selecteaza asociatia" />
              </SelectTrigger>
              <SelectContent>
                {associations?.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={!effectiveAssocId} data-testid="button-add-fund">
                  <Plus className="w-4 h-4 mr-1" />
                  Fond Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Fond Nou</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((d) => createMutation.mutate({ ...d, associationId: effectiveAssocId }))} className="space-y-4">
                    <FormField control={form.control} name="fundType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tip Fond</FormLabel>
                        <Select value={field.value} onValueChange={handleFundTypeChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fund-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fundTypeEnum.map(t => (
                              <SelectItem key={t} value={t}>{FUND_TYPE_LABELS[t]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume Fond</FormLabel>
                        <FormControl><Input {...field} placeholder="ex: Fond Special Renovari" data-testid="input-fund-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere</FormLabel>
                        <FormControl><Textarea {...field} value={field.value || ""} placeholder="Detalii fond..." rows={2} data-testid="input-fund-description" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="bankName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banca</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} placeholder="ex: BRD" data-testid="input-fund-bank-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bankAccount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cont Bancar (IBAN)</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} placeholder="RO..." data-testid="input-fund-bank-account" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="currentBalance" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sold Initial (RON)</FormLabel>
                        <FormControl><Input {...field} value={field.value || "0"} placeholder="0.00" data-testid="input-fund-balance" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-fund">
                      {createMutation.isPending ? "Se salveaza..." : "Creeaza Fond"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {fundsList && fundsList.length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              <Banknote className="w-3.5 h-3.5 mr-1" />
              Total Solduri: {totalBalance.toLocaleString("ro-RO")} RON
            </Badge>
            <Badge variant="outline" className="text-sm">
              {fundsList.length} {fundsList.length === 1 ? "fond" : "fonduri"}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3 space-y-3">
        {!effectiveAssocId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Wallet className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Selecteaza o asociatie</p>
              <p className="text-sm text-muted-foreground mt-0.5">Alege asociatia pentru a vedea fondurile</p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : !fundsList || fundsList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Wallet className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Niciun fond definit</p>
              <p className="text-sm text-muted-foreground mt-0.5">Creeaza fondurile asociatiei (intretinere, rulment, penalizari)</p>
            </CardContent>
          </Card>
        ) : (
          fundsList.map(fund => (
            <FundCard key={fund.id} fund={fund} onDelete={(id) => deleteMutation.mutate(id)} />
          ))
        )}
      </div>
    </div>
  );
}
