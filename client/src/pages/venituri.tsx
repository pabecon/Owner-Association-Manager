import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import type { ProformaInvoice, Contract, Association } from "@shared/schema";
import { INVOICE_STATUS_LABELS } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function InvoicePreview({ invoice, onClose }: { invoice: ProformaInvoice; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Factura ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #111; font-size: 13px; }
        .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #1a56db; padding-bottom: 16px; }
        .header-left h1 { font-size: 22px; color: #1a56db; margin: 0 0 4px 0; }
        .header-left p { margin: 2px 0; color: #666; font-size: 12px; }
        .header-right { text-align: right; }
        .header-right .inv-num { font-size: 18px; font-weight: bold; color: #1a56db; }
        .header-right .status { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: 4px; }
        .status-estimada { background: #fef3c7; color: #92400e; }
        .status-proforma { background: #dbeafe; color: #1e40af; }
        .status-factura_final { background: #d1fae5; color: #065f46; }
        .status-platita { background: #d1fae5; color: #065f46; }
        .status-anulata { background: #fee2e2; color: #991b1b; }
        .parties { display: flex; gap: 30px; margin-bottom: 20px; }
        .party { flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; }
        .party h3 { font-size: 11px; color: #6b7280; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .party p { margin: 2px 0; font-size: 13px; }
        .party .name { font-weight: 600; font-size: 14px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .details-table th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 11px; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
        .details-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .details-table .amount { text-align: right; font-weight: 600; }
        .total-row { background: #eff6ff; }
        .total-row td { font-weight: 700; font-size: 14px; color: #1a56db; }
        .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
        .footer-section { text-align: center; flex: 1; }
        .footer-section h4 { font-size: 11px; color: #6b7280; margin: 0 0 30px 0; }
        .footer-section .sig-line { border-top: 1px solid #d1d5db; width: 150px; margin: 0 auto; padding-top: 4px; font-size: 11px; color: #9ca3af; }
        .concept { background: #f9fafb; padding: 10px; border-radius: 6px; margin-bottom: 16px; }
        .concept h3 { font-size: 11px; color: #6b7280; margin: 0 0 4px 0; text-transform: uppercase; }
        .concept p { margin: 0; font-size: 13px; }
        @media print { body { padding: 0; } .invoice-container { border: none; } }
      </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const statusClass = `status status-${invoice.status}`;

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={handlePrint} data-testid="button-print-invoice">
          Tipareste / PDF
        </Button>
      </div>
      <div ref={printRef} className="bg-white text-black rounded-lg" data-testid="invoice-preview-content">
        <div className="invoice-container">
          <div className="header">
            <div className="header-left">
              <h1>FACTURA</h1>
              <p>Data emitere: {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString("ro-RO") : "-"}</p>
              <p>Data scadenta: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("ro-RO") : "-"}</p>
            </div>
            <div className="header-right">
              <div className="inv-num">Nr. {invoice.invoiceNumber}</div>
              <div className={statusClass}>{INVOICE_STATUS_LABELS[invoice.status] || invoice.status}</div>
            </div>
          </div>

          <div className="parties">
            <div className="party">
              <h3>Prestator (Furnizor)</h3>
              <p className="name">{invoice.prestatorName || "N/A"}</p>
            </div>
            <div className="party">
              <h3>Beneficiar (Client)</h3>
              <p className="name">{invoice.associationName || "N/A"}</p>
            </div>
          </div>

          {invoice.concept && (
            <div className="concept">
              <h3>Conceptul facturii</h3>
              <p>{invoice.concept}</p>
            </div>
          )}

          <table className="details-table">
            <thead>
              <tr>
                <th>Descriere</th>
                <th>Cantitate</th>
                <th>Pret unitar</th>
                <th className="amount">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.concept || "Prestare servicii administrare"}</td>
                <td>{invoice.numberOfUnits || 1}</td>
                <td>{invoice.pricePerUnit ? parseFloat(invoice.pricePerUnit).toLocaleString("ro-RO", { minimumFractionDigits: 2 }) : parseFloat(invoice.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {invoice.currency}</td>
                <td className="amount">{parseFloat(invoice.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {invoice.currency}</td>
              </tr>
              <tr className="total-row">
                <td colSpan={3}>TOTAL</td>
                <td className="amount">{parseFloat(invoice.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {invoice.currency}</td>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            <div className="footer-section">
              <h4>Prestator</h4>
              <div className="sig-line">Semnatura si stampila</div>
            </div>
            <div className="footer-section">
              <h4>Beneficiar</h4>
              <div className="sig-line">Semnatura si stampila</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FacturiPage() {
  const [selectedContract, setSelectedContract] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<ProformaInvoice | null>(null);
  const { toast } = useToast();

  const { data: contracts, isLoading: loadingContracts } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  const { data: associations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const invoiceQueryKey = selectedContract && selectedContract !== "all"
    ? `/api/proforma-invoices?contractId=${selectedContract}`
    : "/api/proforma-invoices";

  const { data: invoices, isLoading: loadingInvoices } = useQuery<ProformaInvoice[]>({
    queryKey: [invoiceQueryKey],
  });

  const isLoading = loadingContracts || loadingInvoices;

  const totalEstimada = invoices?.filter(i => i.status === "estimada").length || 0;
  const totalProforma = invoices?.filter(i => i.status === "proforma").length || 0;
  const totalFinal = invoices?.filter(i => i.status === "factura_final").length || 0;
  const totalPlatite = invoices?.filter(i => i.status === "platita").length || 0;
  const totalSum = invoices?.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || "0"), 0) || 0;

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "platita": return "default";
      case "factura_final": return "default";
      case "proforma": return "secondary";
      case "anulata": return "destructive";
      default: return "outline";
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/proforma-invoices", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [invoiceQueryKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/proforma-invoices"] });
      setAddOpen(false);
      toast({ title: "Factura creata cu succes" });
    },
    onError: (err: any) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/proforma-invoices/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [invoiceQueryKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/proforma-invoices"] });
      toast({ title: "Status actualizat" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/proforma-invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [invoiceQueryKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/proforma-invoices"] });
      toast({ title: "Factura stearsa" });
    },
  });

  const [form, setForm] = useState({
    concept: "Prestare servicii in administrarea asociatiei de proprietari",
    associationId: "",
    associationName: "",
    prestatorName: "",
    totalAmount: "",
    currency: "RON",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    numberOfUnits: "",
    pricePerUnit: "",
    status: "estimada",
  });

  const handleAssociationChange = (assocId: string) => {
    const assoc = associations?.find(a => a.id === assocId);
    setForm(prev => ({
      ...prev,
      associationId: assocId,
      associationName: assoc?.name || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      concept: form.concept,
      associationId: form.associationId || undefined,
      associationName: form.associationName || undefined,
      prestatorName: form.prestatorName || undefined,
      totalAmount: form.totalAmount,
      currency: form.currency,
      issueDate: form.issueDate,
      dueDate: form.dueDate || undefined,
      numberOfUnits: form.numberOfUnits ? parseInt(form.numberOfUnits) : undefined,
      pricePerUnit: form.pricePerUnit || undefined,
      status: form.status,
    });
  };

  return (
    <div className="flex flex-col h-full" data-testid="page-facturi">
      <div className="p-3 pb-0 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold" data-testid="text-facturi-title">Facturi</h1>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Facturi manuale si auto-generate din contracte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger className="h-7 text-xs" data-testid="select-contract-filter">
                  <SelectValue placeholder="Filtreaza dupa contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate facturile</SelectItem>
                  {contracts?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.serie}-{c.numar} | {c.prestatorName || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="button-add-invoice">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Adauga factura
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Factura noua</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Asociatie (Beneficiar)</Label>
                      <Select value={form.associationId} onValueChange={handleAssociationChange}>
                        <SelectTrigger className="h-8 text-xs" data-testid="select-invoice-association">
                          <SelectValue placeholder="Selecteaza..." />
                        </SelectTrigger>
                        <SelectContent>
                          {associations?.map(a => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Prestator (Furnizor)</Label>
                      <Input className="h-8 text-xs" value={form.prestatorName} onChange={e => setForm(p => ({ ...p, prestatorName: e.target.value }))} data-testid="input-invoice-prestator" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Concept factura</Label>
                    <Textarea className="text-xs min-h-[60px]" value={form.concept} onChange={e => setForm(p => ({ ...p, concept: e.target.value }))} data-testid="input-invoice-concept" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Total</Label>
                      <Input type="number" step="0.01" className="h-8 text-xs" value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))} required data-testid="input-invoice-total" />
                    </div>
                    <div>
                      <Label className="text-xs">Moneda</Label>
                      <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
                        <SelectTrigger className="h-8 text-xs" data-testid="select-invoice-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RON">RON</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Status</Label>
                      <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                        <SelectTrigger className="h-8 text-xs" data-testid="select-invoice-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estimada">Estimada</SelectItem>
                          <SelectItem value="proforma">Proforma</SelectItem>
                          <SelectItem value="factura_final">Factura Final</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Nr. imobile</Label>
                      <Input type="number" className="h-8 text-xs" value={form.numberOfUnits} onChange={e => setForm(p => ({ ...p, numberOfUnits: e.target.value }))} data-testid="input-invoice-units" />
                    </div>
                    <div>
                      <Label className="text-xs">Pret/imobil</Label>
                      <Input type="number" step="0.01" className="h-8 text-xs" value={form.pricePerUnit} onChange={e => setForm(p => ({ ...p, pricePerUnit: e.target.value }))} data-testid="input-invoice-price-unit" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Data emitere</Label>
                      <Input type="date" className="h-8 text-xs" value={form.issueDate} onChange={e => setForm(p => ({ ...p, issueDate: e.target.value }))} required data-testid="input-invoice-issue-date" />
                    </div>
                    <div>
                      <Label className="text-xs">Data scadenta</Label>
                      <Input type="date" className="h-8 text-xs" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} data-testid="input-invoice-due-date" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={createMutation.isPending} data-testid="button-submit-invoice">
                      {createMutation.isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      Salveaza
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">Total: <span className="font-semibold text-foreground" data-testid="text-total-invoices">{invoices?.length || 0}</span></span>
          <span>·</span>
          <span className="text-muted-foreground">Estimate: <span className="font-semibold text-amber-600">{totalEstimada}</span></span>
          <span>·</span>
          <span className="text-muted-foreground">Proforma: <span className="font-semibold text-blue-600">{totalProforma}</span></span>
          <span>·</span>
          <span className="text-muted-foreground">Finale: <span className="font-semibold text-green-700">{totalFinal}</span></span>
          <span>·</span>
          <span className="text-muted-foreground">Platite: <span className="font-semibold text-green-600">{totalPlatite}</span></span>
          <span>·</span>
          <span className="text-muted-foreground">Valoare: <span className="font-semibold text-foreground" data-testid="text-total-sum">{totalSum.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {invoices?.[0]?.currency || "RON"}</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {previewInvoice ? (
          <div>
            <Button size="sm" variant="outline" className="mb-2" onClick={() => setPreviewInvoice(null)} data-testid="button-back-from-preview">
              ← Inapoi la lista
            </Button>
            <InvoicePreview invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !invoices?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <FileText className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm">Nu exista facturi</p>
              <p className="text-xs mt-1">Adaugati o factura manuala sau creati un contract pentru generare automata</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="sticky-table-container overflow-auto max-h-[calc(100vh-160px)]">
                <Table className="compact-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">Nr.</TableHead>
                      <TableHead>Concept</TableHead>
                      <TableHead>Asociatie</TableHead>
                      <TableHead>Prestator</TableHead>
                      <TableHead className="text-right">Imob.</TableHead>
                      <TableHead className="text-right">Pret/Imob.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Emitere</TableHead>
                      <TableHead>Scadenta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                        <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={inv.concept || undefined}>{inv.concept || "-"}</TableCell>
                        <TableCell>{inv.associationName || "-"}</TableCell>
                        <TableCell>{inv.prestatorName || "-"}</TableCell>
                        <TableCell className="text-right">{inv.numberOfUnits || "-"}</TableCell>
                        <TableCell className="text-right">
                          {inv.pricePerUnit ? parseFloat(inv.pricePerUnit).toLocaleString("ro-RO", { minimumFractionDigits: 2 }) : "-"} {inv.pricePerUnit ? inv.currency : ""}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {parseFloat(inv.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {inv.currency}
                        </TableCell>
                        <TableCell>{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString("ro-RO") : "-"}</TableCell>
                        <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("ro-RO") : "-"}</TableCell>
                        <TableCell>
                          <Select value={inv.status} onValueChange={(val) => updateStatusMutation.mutate({ id: inv.id, status: val })}>
                            <SelectTrigger className="h-5 text-[10px] px-1 w-auto min-w-[80px] border-0 bg-transparent" data-testid={`select-status-${inv.id}`}>
                              <Badge variant={getStatusVariant(inv.status)} className="text-[9px] px-1">
                                {INVOICE_STATUS_LABELS[inv.status] || inv.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="estimada">Estimada</SelectItem>
                              <SelectItem value="proforma">Proforma</SelectItem>
                              <SelectItem value="factura_final">Factura Final</SelectItem>
                              <SelectItem value="platita">Platita</SelectItem>
                              <SelectItem value="anulata">Anulata</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => setPreviewInvoice(inv)} data-testid={`button-preview-${inv.id}`}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            {inv.isManual && (
                              <Button size="icon" variant="ghost" className="w-5 h-5 text-destructive" onClick={() => deleteMutation.mutate(inv.id)} data-testid={`button-delete-${inv.id}`}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
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
