import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import type { Expense, Building } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Receipt, Search, Trash2 } from "lucide-react";
import { z } from "zod";

const categories = [
  "Intretinere",
  "Reparatii",
  "Curatenie",
  "Iluminat",
  "Lift",
  "Apa",
  "Gaze",
  "Fond Rulment",
  "Fond Reparatii",
  "Gunoi",
  "Altele",
];

const months = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

const formSchema = insertExpenseSchema.extend({
  description: z.string().min(1, "Descrierea este obligatorie"),
  amount: z.string().min(1, "Suma este obligatorie"),
  year: z.coerce.number().min(2020).max(2030),
});

export default function Expenses() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: expenses, isLoading } = useQuery<Expense[]>({ queryKey: ["/api/expenses"] });
  const { data: buildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      category: "Intretinere",
      description: "",
      amount: "",
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
      splitMethod: "equal",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/expenses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      setOpen(false);
      form.reset();
      toast({ title: "Cheltuiala adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({ title: "Cheltuiala stearsa" });
    },
  });

  const filtered = expenses?.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalAmount = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-expenses-title">Cheltuieli</h1>
          <p className="text-muted-foreground text-sm mt-1">Inregistreaza si urmareste cheltuielile</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-expense">
              <Plus className="w-4 h-4 mr-2" />
              Adauga Cheltuiala
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cheltuiala Noua</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <FormField control={form.control} name="buildingId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloc</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-expense-building">
                          <SelectValue placeholder="Selecteaza blocul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings?.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-expense-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriere</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: Reparatie instalatie apa" data-testid="input-expense-description" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suma (RON)</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: 1500.00" data-testid="input-expense-amount" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="month" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luna</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-expense-month">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem>
                      <FormLabel>An</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-expense-year" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="splitMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metoda Repartizare</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "equal"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-split-method">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="equal">In mod egal</SelectItem>
                        <SelectItem value="surface">Dupa suprafata</SelectItem>
                        <SelectItem value="residents">Dupa nr. persoane</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-expense">
                  {createMutation.isPending ? "Se salveaza..." : "Salveaza Cheltuiala"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cauta cheltuieli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-expenses"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          Total: {totalAmount.toLocaleString("ro-RO")} RON
        </Badge>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Nicio cheltuiala gasita</p>
            <p className="text-sm text-muted-foreground mt-1">Adauga prima cheltuiala pentru a incepe</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Perioada</TableHead>
                    <TableHead>Repartizare</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((exp) => (
                    <TableRow key={exp.id} data-testid={`row-expense-table-${exp.id}`}>
                      <TableCell className="font-medium">{exp.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{exp.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{exp.month} {exp.year}</TableCell>
                      <TableCell className="text-muted-foreground text-sm capitalize">
                        {exp.splitMethod === "equal" ? "Egal" : exp.splitMethod === "surface" ? "Suprafata" : "Persoane"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{Number(exp.amount).toLocaleString("ro-RO")} RON</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(exp.id)}
                          data-testid={`button-delete-expense-${exp.id}`}
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
  );
}
