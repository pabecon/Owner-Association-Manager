import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Home, Receipt, CreditCard, Megaphone, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Building, Apartment, Expense, Payment, Announcement } from "@shared/schema";

function StatCard({ title, value, subtitle, icon: Icon, loading }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: buildings, isLoading: loadingBuildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: apartments, isLoading: loadingApartments } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });
  const { data: expenses, isLoading: loadingExpenses } = useQuery<Expense[]>({ queryKey: ["/api/expenses"] });
  const { data: payments, isLoading: loadingPayments } = useQuery<Payment[]>({ queryKey: ["/api/payments"] });
  const { data: announcements, isLoading: loadingAnnouncements } = useQuery<Announcement[]>({ queryKey: ["/api/announcements"] });

  const loading = loadingBuildings || loadingApartments || loadingExpenses || loadingPayments || loadingAnnouncements;

  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const totalPaid = payments?.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const pendingPayments = payments?.filter(p => p.status === "pending").length || 0;
  const collectionRate = totalExpenses > 0 ? Math.round((totalPaid / totalExpenses) * 100) : 0;

  const recentAnnouncements = announcements?.slice(0, 3) || [];
  const recentExpenses = expenses?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">Panou Principal</h1>
        <p className="text-muted-foreground text-sm mt-1">Sumar general al asociatiei de proprietari</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blocuri"
          value={buildings?.length || 0}
          subtitle="Inregistrate"
          icon={Building2}
          loading={loading}
        />
        <StatCard
          title="Apartamente"
          value={apartments?.length || 0}
          subtitle={`${apartments?.filter(a => a.ownerName).length || 0} cu proprietar`}
          icon={Home}
          loading={loading}
        />
        <StatCard
          title="Cheltuieli Luna"
          value={`${totalExpenses.toLocaleString("ro-RO")} RON`}
          subtitle="Total inregistrat"
          icon={Receipt}
          loading={loading}
        />
        <StatCard
          title="Rata Incasare"
          value={`${collectionRate}%`}
          subtitle={`${pendingPayments} plati in asteptare`}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Anunturi Recente</CardTitle>
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Megaphone className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Niciun anunt momentan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex items-start gap-3" data-testid={`card-announcement-${ann.id}`}>
                    <div className="mt-0.5">
                      {ann.priority === "urgent" ? (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">{ann.title}</p>
                        {ann.priority === "urgent" && (
                          <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString("ro-RO") : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Cheltuieli Recente</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : recentExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Nicio cheltuiala inregistrata</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between gap-2" data-testid={`row-expense-${exp.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{exp.description}</p>
                      <p className="text-xs text-muted-foreground">{exp.category} - {exp.month}/{exp.year}</p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">{Number(exp.amount).toLocaleString("ro-RO")} RON</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">Status Plati</CardTitle>
          <CreditCard className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${collectionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Incasat: <span className="font-medium text-foreground">{totalPaid.toLocaleString("ro-RO")} RON</span></span>
                <span className="text-muted-foreground">Total: <span className="font-medium text-foreground">{totalExpenses.toLocaleString("ro-RO")} RON</span></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
