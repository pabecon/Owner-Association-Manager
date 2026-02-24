import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Database, Calendar, TrendingUp, Filter } from "lucide-react";
import { format } from "date-fns";

interface BnrStatus {
  lastDate: string | null;
  totalCount: number;
  currencies: string[];
}

interface BnrRate {
  id: string;
  dataInceput: string;
  dataSfarsit: string;
  moneda: string;
  curs: string;
}

const MAIN_CURRENCIES = ["EUR", "USD", "GBP", "CHF"];

function formatDateRo(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return format(date, "dd.MM.yyyy");
  } catch {
    return dateStr;
  }
}

function buildRatesUrl(currency: string, effectiveDate: string | null): string {
  const params = new URLSearchParams();
  if (currency !== "all") params.set("moneda", currency);
  if (effectiveDate) {
    params.set("dataInceput", effectiveDate);
    params.set("dataSfarsit", effectiveDate);
  }
  params.set("limit", "2000");
  return `/api/bnr/rates?${params}`;
}

export default function CursValutarBnrPage() {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("latest");

  const { data: status, isLoading: statusLoading } = useQuery<BnrStatus>({
    queryKey: ["/api/bnr/status"],
  });

  const { data: dates } = useQuery<string[]>({
    queryKey: ["/api/bnr/dates"],
  });

  const effectiveDate = selectedDate === "latest" && dates?.length ? dates[0] : selectedDate !== "latest" ? selectedDate : null;

  const ratesUrl = buildRatesUrl(selectedCurrency, effectiveDate);
  const { data: rates, isLoading: ratesLoading } = useQuery<BnrRate[]>({
    queryKey: [ratesUrl],
    enabled: !!effectiveDate,
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bnr/sync");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bnr/status"] });
      queryClient.invalidateQueries({ predicate: (query) => String(query.queryKey[0]).startsWith("/api/bnr/rates") });
      queryClient.invalidateQueries({ queryKey: ["/api/bnr/dates"] });
      toast({ title: data.count > 0 ? `${data.count} cursuri noi adaugate (${data.date})` : `Cursurile sunt deja actualizate (${data.date})` });
    },
    onError: () => toast({ title: "Eroare la sincronizare", variant: "destructive" }),
  });

  const historicalMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bnr/sync-historical", { fromYear: 2005, toYear: new Date().getFullYear() });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bnr/status"] });
      queryClient.invalidateQueries({ predicate: (query) => String(query.queryKey[0]).startsWith("/api/bnr/rates") });
      queryClient.invalidateQueries({ queryKey: ["/api/bnr/dates"] });
      toast({ title: `Import complet: ${data.totalInserted} cursuri din ${data.yearsProcessed} ani` });
    },
    onError: () => toast({ title: "Eroare la importul istoric", variant: "destructive" }),
  });

  const ratesByDate: Record<string, BnrRate[]> = {};
  if (rates) {
    for (const rate of rates) {
      if (!ratesByDate[rate.dataInceput]) ratesByDate[rate.dataInceput] = [];
      ratesByDate[rate.dataInceput].push(rate);
    }
  }
  const sortedDates = Object.keys(ratesByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-4 space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold" data-testid="text-page-title">Curs Valutar BNR</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            data-testid="button-sync-today"
          >
            <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            {syncMutation.isPending ? "Se sincronizeaza..." : "Sincronizeaza azi"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => historicalMutation.mutate()}
            disabled={historicalMutation.isPending}
            data-testid="button-sync-historical"
          >
            <Download className={`w-4 h-4 ${historicalMutation.isPending ? "animate-spin" : ""}`} />
            {historicalMutation.isPending ? "Se importa..." : "Import istoric (2005+)"}
          </Button>
        </div>
      </div>

      {statusLoading ? (
        <Skeleton className="h-16 w-full" data-testid="skeleton-status" />
      ) : status ? (
        <div className="grid grid-cols-3 gap-3">
          <Card data-testid="card-total-count">
            <CardContent className="p-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total inregistrari</p>
                <p className="text-sm font-semibold" data-testid="text-total-count">{status.totalCount.toLocaleString("ro-RO")}</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-last-date">
            <CardContent className="p-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ultima data</p>
                <p className="text-sm font-semibold" data-testid="text-last-date">{status.lastDate ? formatDateRo(status.lastDate) : "Niciuna"}</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-currencies">
            <CardContent className="p-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Monede</p>
                <p className="text-sm font-semibold" data-testid="text-currencies-count">{status.currencies.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card data-testid="card-filters">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filtre
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-44" data-testid="select-date-filter">
                <SelectValue placeholder="Selecteaza data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest" data-testid="select-date-latest">Ultima data</SelectItem>
                {(dates || []).map((d) => (
                  <SelectItem key={d} value={d} data-testid={`select-date-${d}`}>{formatDateRo(d)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-44" data-testid="select-currency-filter">
                <SelectValue placeholder="Toate monedele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-testid="select-currency-all">Toate monedele</SelectItem>
                {(status?.currencies || []).map((c) => (
                  <SelectItem key={c} value={c} data-testid={`select-currency-${c}`}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {effectiveDate && (
              <Badge variant="secondary" data-testid="badge-effective-date">
                {formatDateRo(effectiveDate)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {ratesLoading ? (
        <Skeleton className="h-48 w-full" data-testid="skeleton-rates" />
      ) : sortedDates.length === 0 ? (
        <Card data-testid="card-empty-state">
          <CardContent className="p-6 text-center text-sm text-muted-foreground" data-testid="text-empty-message">
            {status?.totalCount === 0
              ? "Nu exista cursuri BNR. Apasa \"Import istoric (2005+)\" pentru a incarca datele."
              : "Nu s-au gasit cursuri pentru filtrele selectate."}
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((dateStr) => {
          const dateRates = ratesByDate[dateStr];
          const mainRates = dateRates.filter((r) => MAIN_CURRENCIES.includes(r.moneda));
          const otherRates = dateRates.filter((r) => !MAIN_CURRENCIES.includes(r.moneda));

          return (
            <Card key={dateStr} data-testid={`card-rates-${dateStr}`}>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" data-testid={`text-date-header-${dateStr}`}>
                  Curs BNR din {formatDateRo(dateStr)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {mainRates.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {mainRates.map((r) => (
                      <div key={r.id} className="bg-primary/5 rounded-md p-2 text-center" data-testid={`card-rate-${r.moneda}-${dateStr}`}>
                        <p className="text-xs font-semibold text-primary" data-testid={`text-currency-${r.moneda}-${dateStr}`}>{r.moneda}</p>
                        <p className="text-lg font-bold" data-testid={`text-rate-${r.moneda}-${dateStr}`}>{r.curs}</p>
                        <p className="text-xs text-muted-foreground">RON</p>
                      </div>
                    ))}
                  </div>
                )}
                {otherRates.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs" data-testid={`table-rates-${dateStr}`}>
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 px-2 font-medium text-muted-foreground">Moneda</th>
                          <th className="text-right py-1 px-2 font-medium text-muted-foreground">Curs (RON)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {otherRates.map((r) => (
                          <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50" data-testid={`row-rate-${r.moneda}-${dateStr}`}>
                            <td className="py-1 px-2 font-medium" data-testid={`text-currency-other-${r.moneda}-${dateStr}`}>{r.moneda}</td>
                            <td className="py-1 px-2 text-right tabular-nums" data-testid={`text-rate-other-${r.moneda}-${dateStr}`}>{r.curs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      <Card data-testid="card-source-info">
        <CardContent className="p-3 text-xs text-muted-foreground" data-testid="text-source-info">
          Sursa: Banca Nationala a Romaniei (bnr.ro) | Sincronizare automata zilnica la ora 14:00 (ora Romaniei)
        </CardContent>
      </Card>
    </div>
  );
}
