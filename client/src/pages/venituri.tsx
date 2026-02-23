import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileText, Receipt } from "lucide-react";
import { useState } from "react";
import type { ProformaInvoice, Contract } from "@shared/schema";
import { PROFORMA_STATUS_LABELS } from "@shared/schema";

const MONTH_NAMES = [
  "", "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

export default function VenituriPage() {
  const [selectedContract, setSelectedContract] = useState<string>("all");

  const { data: contracts, isLoading: loadingContracts } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  const invoiceQueryKey = selectedContract && selectedContract !== "all"
    ? `/api/proforma-invoices?contractId=${selectedContract}`
    : "/api/proforma-invoices";

  const { data: invoices, isLoading: loadingInvoices } = useQuery<ProformaInvoice[]>({
    queryKey: [invoiceQueryKey],
  });

  const isLoading = loadingContracts || loadingInvoices;

  const totalEmise = invoices?.filter(i => i.status === "emisa").length || 0;
  const totalPlatite = invoices?.filter(i => i.status === "platita").length || 0;
  const totalSum = invoices?.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || "0"), 0) || 0;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "platita": return "default";
      case "anulata": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="h-full overflow-auto p-3" data-testid="page-venituri">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" data-testid="text-venituri-title">Venituri - Facturi Proforma</h1>
            <p className="text-xs text-muted-foreground">Facturi proforma generate automat din contractele de administrare</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Card>
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">Total Facturi</div>
              <div className="text-base font-bold" data-testid="text-total-invoices">{invoices?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">Emise</div>
              <div className="text-base font-bold text-amber-600" data-testid="text-emise-count">{totalEmise}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">Platite</div>
              <div className="text-base font-bold text-green-600" data-testid="text-platite-count">{totalPlatite}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">Valoare Totala</div>
              <div className="text-base font-bold" data-testid="text-total-sum">
                {totalSum.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {invoices?.[0]?.currency || "RON"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Facturi Proforma
              </CardTitle>
              <div className="w-72">
                <Select value={selectedContract} onValueChange={setSelectedContract}>
                  <SelectTrigger data-testid="select-contract-filter">
                    <SelectValue placeholder="Filtreaza dupa contract" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate contractele</SelectItem>
                    {contracts?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.serie}-{c.numar} | {c.prestatorName || "N/A"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : !invoices?.length ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <FileText className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">Nu exista facturi proforma</p>
                <p className="text-xs mt-1">Facturile se genereaza automat la crearea unui contract</p>
              </div>
            ) : (
              <div className="sticky-table-container overflow-auto max-h-[60vh]">
                <Table className="compact-table">
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-16">Nr.</TableHead>
                      <TableHead>Luna</TableHead>
                      <TableHead>Asociatie</TableHead>
                      <TableHead>Prestator</TableHead>
                      <TableHead className="text-right">Nr. Imobile</TableHead>
                      <TableHead className="text-right">Pret/Imobil</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Data Emitere</TableHead>
                      <TableHead>Scadenta</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                        <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell>{MONTH_NAMES[inv.month]} {inv.year}</TableCell>
                        <TableCell>{inv.associationName || "-"}</TableCell>
                        <TableCell>{inv.prestatorName || "-"}</TableCell>
                        <TableCell className="text-right">{inv.numberOfUnits || "-"}</TableCell>
                        <TableCell className="text-right">
                          {inv.pricePerUnit ? parseFloat(inv.pricePerUnit).toLocaleString("ro-RO", { minimumFractionDigits: 2 }) : "-"} {inv.currency}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {parseFloat(inv.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {inv.currency}
                        </TableCell>
                        <TableCell>{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString("ro-RO") : "-"}</TableCell>
                        <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("ro-RO") : "-"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(inv.status)} data-testid={`badge-status-${inv.id}`}>
                            {PROFORMA_STATUS_LABELS[inv.status] || inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
