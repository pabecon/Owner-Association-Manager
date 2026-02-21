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
import { insertPaymentSchema } from "@shared/schema";
import type { Payment, Apartment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, CreditCard, Search, CheckCircle2, Clock, Filter } from "lucide-react";
import { z } from "zod";

const months = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

const formSchema = insertPaymentSchema.extend({
  amount: z.string().min(1, "Suma este obligatorie"),
  year: z.coerce.number().min(2020).max(2030),
});

export default function Payments() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: payments, isLoading } = useQuery<Payment[]>({ queryKey: ["/api/payments"] });
  const { data: apartments } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apartmentId: "",
      amount: "",
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
      status: "pending",
      paidDate: null,
      receiptNumber: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/payments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setOpen(false);
      form.reset();
      toast({ title: "Plata inregistrata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/payments/${id}`, {
        status: "paid",
        paidDate: new Date().toISOString().split("T")[0],
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Plata marcata ca achitata" });
    },
  });

  const getApartmentLabel = (aptId: string) => {
    const apt = apartments?.find(a => a.id === aptId);
    return apt ? `Ap. ${apt.number}${apt.ownerName ? ` - ${apt.ownerName}` : ""}` : aptId;
  };

  const filtered = payments?.filter(p => {
    const matchesSearch = getApartmentLabel(p.apartmentId).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const totalPending = filtered.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
  const totalPaid = filtered.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-payments-title">Plati</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Urmareste platile proprietarilor</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-payment">
                <Plus className="w-4 h-4 mr-2" />
                Inregistreaza Plata
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Plata Noua</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <FormField control={form.control} name="apartmentId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartament</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-apartment">
                            <SelectValue placeholder="Selecteaza apartamentul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {apartments?.map(a => (
                            <SelectItem key={a.id} value={a.id}>Ap. {a.number}{a.ownerName ? ` - ${a.ownerName}` : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suma (RON)</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: 350.00" data-testid="input-payment-amount" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="month" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luna</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-payment-month">
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
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-payment-year" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">In asteptare</SelectItem>
                          <SelectItem value="paid">Achitata</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="receiptNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nr. Chitanta</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} placeholder="ex: CH-001" data-testid="input-receipt-number" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-payment">
                    {createMutation.isPending ? "Se salveaza..." : "Salveaza Plata"}
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
              placeholder="Cauta dupa apartament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-payments"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {["all", "pending", "paid"].map(s => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
                data-testid={`button-filter-${s}`}
              >
                {s === "all" ? "Toate" : s === "pending" ? "In asteptare" : "Achitate"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-amber-500/10 dark:bg-amber-400/10">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Asteptare</p>
                  <p className="text-lg font-bold">{totalPending.toLocaleString("ro-RO")} RON</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achitate</p>
                  <p className="text-lg font-bold">{totalPaid.toLocaleString("ro-RO")} RON</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-2 p-3">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Nicio plata gasita</p>
                <p className="text-sm text-muted-foreground mt-0.5">Inregistreaza prima plata pentru a incepe</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-1">Apartament</TableHead>
                        <TableHead className="py-1">Perioada</TableHead>
                        <TableHead className="py-1">Nr. Chitanta</TableHead>
                        <TableHead className="py-1">Status</TableHead>
                        <TableHead className="text-right py-1">Suma</TableHead>
                        <TableHead className="w-28 py-1"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((pay) => (
                        <TableRow key={pay.id} data-testid={`row-payment-${pay.id}`}>
                          <TableCell className="font-medium text-sm py-1">{getApartmentLabel(pay.apartmentId)}</TableCell>
                          <TableCell className="text-muted-foreground text-sm py-1">{pay.month} {pay.year}</TableCell>
                          <TableCell className="text-muted-foreground text-sm py-1">{pay.receiptNumber || "-"}</TableCell>
                          <TableCell className="py-1">
                            {pay.status === "paid" ? (
                              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Achitata
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                In asteptare
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm py-1">{Number(pay.amount).toLocaleString("ro-RO")} RON</TableCell>
                          <TableCell className="py-1">
                            {pay.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markPaidMutation.mutate(pay.id)}
                                disabled={markPaidMutation.isPending}
                                data-testid={`button-mark-paid-${pay.id}`}
                              >
                                Confirma
                              </Button>
                            )}
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
    </div>
  );
}
