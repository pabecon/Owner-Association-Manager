import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AssociationSidebar } from "@/components/association-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Building2, Home, ArrowUpDown, Layers, Car, Package, MapPin, User, Phone, Mail,
  FileText, Wallet, Receipt, CreditCard, Megaphone, ArrowDown,
  ChevronDown, ChevronRight, Trash2, Plus, Banknote, ExternalLink,
  Gauge, DoorOpen, Calendar, Hash, Upload, Download, File, Image,
  BarChart3, Eye, EyeOff
} from "lucide-react";
import type { Association, Building, Staircase, Apartment, Expense, Payment, Announcement, Fund, FundCategory, UnitRoom, Meter, MeterType, MeterReading, Document } from "@shared/schema";
import { METER_TYPE_LABELS, meterTypeEnum, METER_SCOPE_LABELS } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AssociationPortal() {
  const [, params] = useRoute("/asociatie/:id");
  const associationId = params?.id;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("imobiliar");
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({});
  const [expandedStaircases, setExpandedStaircases] = useState<Record<string, boolean>>({});
  const [expandedFunds, setExpandedFunds] = useState<Record<string, boolean>>({});
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  const { data: associations, isLoading: loadingAssocs } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: buildings, isLoading: loadingBuildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: staircases, isLoading: loadingStaircases } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });
  const { data: apartments, isLoading: loadingApts } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });
  const { data: expenses } = useQuery<Expense[]>({ queryKey: ["/api/expenses"] });
  const { data: payments } = useQuery<Payment[]>({ queryKey: ["/api/payments"] });
  const { data: announcements } = useQuery<Announcement[]>({ queryKey: ["/api/announcements"] });
  const { data: funds } = useQuery<Fund[]>({
    queryKey: [`/api/funds?associationId=${associationId}`],
    enabled: !!associationId,
  });

  const association = associations?.find(a => a.id === associationId);
  const assocBuildings = buildings?.filter(b => b.associationId === associationId) || [];
  const buildingIds = assocBuildings.map(b => b.id);
  const assocStaircases = staircases?.filter(s => buildingIds.includes(s.buildingId)) || [];
  const staircaseIds = assocStaircases.map(s => s.id);
  const assocApartments = apartments?.filter(a => staircaseIds.includes(a.staircaseId)) || [];
  const assocExpenses = expenses?.filter(e => buildingIds.includes(e.buildingId)) || [];
  const assocPayments = payments?.filter(p => {
    const apt = apartments?.find(a => a.id === p.apartmentId);
    return apt && staircaseIds.includes(apt.staircaseId);
  }) || [];
  const assocAnnouncements = announcements?.filter(a => buildingIds.includes(a.buildingId || "")) || [];

  const aptCount = assocApartments.filter(a => !a.unitType || a.unitType === "apartment").length;
  const boxCount = assocApartments.filter(a => a.unitType === "box").length;
  const parkingCount = assocApartments.filter(a => a.unitType === "parking").length;

  const totalExpenses = assocExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPaid = assocPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingPayments = assocPayments.filter(p => p.status === "pending").length;
  const collectionRate = totalExpenses > 0 ? Math.round((totalPaid / totalExpenses) * 100) : 0;

  const loading = loadingBuildings || loadingStaircases || loadingApts;

  const toggleBuilding = (id: string) => setExpandedBuildings(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleStaircase = (id: string) => setExpandedStaircases(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFund = (id: string) => setExpandedFunds(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleUnit = (id: string) => setExpandedUnits(prev => ({ ...prev, [id]: !prev[id] }));

  const getFloorLabel = (floor: number) => {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  };

  const getUnitTypeIcon = (type: string | null) => {
    if (type === "box") return Package;
    if (type === "parking") return Car;
    return Home;
  };

  const getUnitTypeLabel = (type: string | null) => {
    if (type === "box") return "Box";
    if (type === "parking") return "Parking";
    return "Apartament";
  };

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/expenses/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({ title: "Cheltuiala stearsa" });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/payments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Status plata actualizat" });
    },
  });

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (!association && !loadingAssocs) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Asociatia nu a fost gasita</h2>
        <Link href="/">
          <Button variant="outline">Inapoi la Super Administrator</Button>
        </Link>
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AssociationSidebar associationId={associationId!} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-assoc-sidebar-toggle" />
            <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0 ml-2">
              <h1 className="text-sm font-semibold truncate" data-testid="text-portal-title">
                {association?.name || <Skeleton className="h-5 w-32 inline-block" />}
              </h1>
              {association?.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(association.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex hover:text-primary transition-colors"
                  title="Deschide in Google Maps"
                  data-testid="link-association-maps"
                >
                  <MapPin className="w-3 h-3" />{association.address}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
            <div className="max-w-7xl mx-auto space-y-2">

      <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-muted-foreground">Bloc.: <span className="font-semibold text-foreground" data-testid="text-portal-buildings">{assocBuildings.length}</span></span>
                <span>·</span>
                <span className="text-muted-foreground">Scari: <span className="font-semibold text-foreground" data-testid="text-portal-staircases">{assocStaircases.length}</span></span>
                <span>·</span>
                <span className="text-muted-foreground">Apt.: <span className="font-semibold text-foreground" data-testid="text-portal-apartments">{aptCount}</span></span>
                {boxCount > 0 && <><span>·</span><span className="text-muted-foreground">Boxe: <span className="font-semibold text-foreground" data-testid="text-portal-boxes">{boxCount}</span></span></>}
                {parkingCount > 0 && <><span>·</span><span className="text-muted-foreground">Park.: <span className="font-semibold text-foreground" data-testid="text-portal-parking">{parkingCount}</span></span></>}
                <span>·</span>
                <span className="text-muted-foreground">Fond.: <span className="font-semibold text-foreground" data-testid="text-portal-funds">{funds?.length || 0}</span></span>
              </div>

          {activeTab === "imobiliar" && (
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
                </div>
              ) : assocBuildings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Building2 className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Niciun bloc inregistrat in aceasta asociatie</p>
                    <p className="text-xs text-muted-foreground mt-1">Adauga blocuri din sectiunea Management Imobiliar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {assocBuildings.map(building => {
                    const bldStaircases = assocStaircases.filter(s => s.buildingId === building.id);
                    const bldStaircaseIds = bldStaircases.map(s => s.id);
                    const bldApts = assocApartments.filter(a => bldStaircaseIds.includes(a.staircaseId));
                    const bldAptCount = bldApts.filter(a => !a.unitType || a.unitType === "apartment").length;
                    const bldBoxCount = bldApts.filter(a => a.unitType === "box").length;
                    const bldParkCount = bldApts.filter(a => a.unitType === "parking").length;
                    const isExpanded = expandedBuildings[building.id];

                    return (
                      <Card key={building.id} data-testid={`card-portal-building-${building.id}`}>
                        <Collapsible open={isExpanded} onOpenChange={() => toggleBuilding(building.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg" data-testid={`trigger-building-${building.id}`}>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  {building.name}
                                  {building.address && (
                                    <span className="text-xs font-normal text-muted-foreground flex items-center gap-1 ml-2">
                                      <MapPin className="w-3 h-3" />{building.address}
                                    </span>
                                  )}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="text-[10px]">{bldStaircases.length} scari</Badge>
                                    <Badge variant="outline" className="text-[10px]">{bldApts.length} unitati</Badge>
                                  </div>
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {bldAptCount > 0 && (
                                  <Badge variant="secondary" className="text-[10px] gap-1">
                                    <Home className="w-3 h-3" />{bldAptCount} apt.
                                  </Badge>
                                )}
                                {bldBoxCount > 0 && (
                                  <Badge variant="outline" className="text-[10px] gap-1">
                                    <Package className="w-3 h-3" />{bldBoxCount} boxe
                                  </Badge>
                                )}
                                {bldParkCount > 0 && (
                                  <Badge variant="outline" className="text-[10px] gap-1">
                                    <Car className="w-3 h-3" />{bldParkCount} parking
                                  </Badge>
                                )}
                                {(building.floors || 0) > 0 && (
                                  <Badge variant="outline" className="text-[10px] gap-1">
                                    <Layers className="w-3 h-3" />{building.floors} etaje
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0 space-y-3">
                              <DocumentsSection entityType="building" entityId={building.id} />
                              {bldStaircases.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-2">Nicio scara inregistrata</p>
                              ) : (
                                bldStaircases.map(sc => {
                                  const scApts = bldApts.filter(a => a.staircaseId === sc.id);
                                  const floors = Array.from(new Set(scApts.map(a => a.floor))).sort((a, b) => b - a);
                                  const isScExpanded = expandedStaircases[sc.id];

                                  return (
                                    <Collapsible key={sc.id} open={isScExpanded} onOpenChange={() => toggleStaircase(sc.id)}>
                                      <CollapsibleTrigger asChild>
                                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`trigger-staircase-${sc.id}`}>
                                          <span className="text-xs font-medium flex items-center gap-1.5">
                                            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                                            {sc.name}
                                            <span className="text-muted-foreground">({scApts.length} unitati, {sc.floors || 0} etaje)</span>
                                          </span>
                                          {isScExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="ml-4 mt-2 space-y-2">
                                          <DocumentsSection entityType="staircase" entityId={sc.id} />
                                          {floors.length === 0 ? (
                                            <p className="text-xs text-muted-foreground py-1">Nicio unitate inregistrata</p>
                                          ) : (
                                            floors.map(fl => {
                                              const floorApts = scApts.filter(a => a.floor === fl).sort((a, b) => {
                                                const numA = parseInt(a.number) || 0;
                                                const numB = parseInt(b.number) || 0;
                                                return numA - numB;
                                              });
                                              return (
                                                <div key={fl} className="border-l-2 border-primary/20 pl-3">
                                                  <div className="flex items-center gap-1.5 mb-1.5">
                                                    {fl < 0 ? (
                                                      <ArrowDown className="w-3 h-3 text-muted-foreground" />
                                                    ) : (
                                                      <Layers className="w-3 h-3 text-muted-foreground" />
                                                    )}
                                                    <span className="text-xs font-medium">{getFloorLabel(fl)}</span>
                                                    <Badge variant="outline" className="text-[9px] py-0">{floorApts.length} unitati</Badge>
                                                  </div>
                                                  <DocumentsSection entityType="floor" entityId={sc.id} floorNumber={fl} />
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {floorApts.map(apt => {
                                                      const UnitIcon = getUnitTypeIcon(apt.unitType);
                                                      const isUnitExpanded = expandedUnits[apt.id];
                                                      return (
                                                        <Collapsible key={apt.id} open={isUnitExpanded} onOpenChange={() => toggleUnit(apt.id)}>
                                                          <div className={`rounded-md bg-background border text-xs ${isUnitExpanded ? 'w-full' : ''}`} data-testid={`unit-card-${apt.id}`}>
                                                            <CollapsibleTrigger asChild>
                                                              <div className="flex items-center gap-1.5 px-2 py-1 cursor-pointer group/unit whitespace-nowrap" data-testid={`trigger-unit-${apt.id}`}>
                                                                <UnitIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                                                                <span className="font-medium text-xs">{getUnitTypeLabel(apt.unitType)} {apt.number}</span>
                                                                {apt.ownerName && (
                                                                  <span className="text-muted-foreground text-[10px] truncate max-w-[120px]">{apt.ownerName}</span>
                                                                )}
                                                                {apt.surface && <span className="text-[10px] text-muted-foreground">{apt.surface} m²</span>}
                                                                {apt.rooms && <span className="text-[10px] text-muted-foreground">{apt.rooms} cam.</span>}
                                                                <Link href={`/unitate/${apt.id}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                                  <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] invisible group-hover/unit:visible shrink-0" data-testid={`button-open-unit-${apt.id}`}>
                                                                    <ExternalLink className="w-3 h-3" />
                                                                  </Button>
                                                                </Link>
                                                                {isUnitExpanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                                                              </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                              <UnitExpandedContent apartmentId={apt.id} />
                                                            </CollapsibleContent>
                                                          </div>
                                                        </Collapsible>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })
                              )}
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "contoare" && associationId && (
            <CommonMetersSection
              associationId={associationId}
              buildings={assocBuildings}
              staircases={assocStaircases}
              apartments={assocApartments}
            />
          )}

          {activeTab === "financiar" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-muted-foreground">Chelt.: <span className="font-semibold text-foreground" data-testid="text-portal-total-expenses">{totalExpenses.toLocaleString("ro-RO")} RON</span> <span className="text-[10px]">({assocExpenses.length})</span></span>
                <span>·</span>
                <span className="text-muted-foreground">Incas.: <span className="font-semibold text-green-600" data-testid="text-portal-total-paid">{totalPaid.toLocaleString("ro-RO")} RON</span></span>
                <span>·</span>
                <span className="text-muted-foreground">Astept.: <span className="font-semibold text-orange-500" data-testid="text-portal-pending">{pendingPayments}</span></span>
                <span>·</span>
                <span className="text-muted-foreground">Rata: <span className="font-semibold text-foreground" data-testid="text-portal-collection-rate">{collectionRate}%</span></span>
              </div>
              {/* Fonduri */}
              {funds && funds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    Fonduri ({funds.length})
                  </h3>
                  {funds.map(fund => {
                    const isFundExpanded = expandedFunds[fund.id];
                    return (
                      <FundCard key={fund.id} fund={fund} isExpanded={isFundExpanded} onToggle={() => toggleFund(fund.id)} />
                    );
                  })}
                </div>
              )}

              {/* Cheltuieli Table */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  Cheltuieli ({assocExpenses.length})
                </h3>
                {assocExpenses.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <Receipt className="w-8 h-8 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">Nicio cheltuiala inregistrata</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="sticky-table-container max-h-[400px]">
                        <Table className="compact-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descriere</TableHead>
                              <TableHead>Cat.</TableHead>
                              <TableHead>Bloc</TableHead>
                              <TableHead>Per.</TableHead>
                              <TableHead className="text-right">Suma</TableHead>
                              <TableHead className="w-8"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assocExpenses.slice(0, 20).map(exp => {
                              const bld = assocBuildings.find(b => b.id === exp.buildingId);
                              return (
                                <TableRow key={exp.id} data-testid={`row-portal-expense-${exp.id}`}>
                                  <TableCell className="font-medium max-w-[180px] truncate" title={exp.description}>{exp.description}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-[9px] px-1 py-0">{exp.category}</Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground whitespace-nowrap">{bld?.name || "-"}</TableCell>
                                  <TableCell className="text-muted-foreground whitespace-nowrap">{exp.month}/{exp.year}</TableCell>
                                  <TableCell className="text-right font-medium whitespace-nowrap">{Number(exp.amount).toLocaleString("ro-RO")} RON</TableCell>
                                  <TableCell>
                                    <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => deleteExpenseMutation.mutate(exp.id)} data-testid={`button-delete-expense-${exp.id}`}>
                                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      {assocExpenses.length > 20 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Se afiseaza primele 20 din {assocExpenses.length} cheltuieli
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Plati Table */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Plati ({assocPayments.length})
                </h3>
                {assocPayments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <CreditCard className="w-8 h-8 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">Nicio plata inregistrata</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="sticky-table-container max-h-[400px]">
                        <Table className="compact-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Apt.</TableHead>
                              <TableHead>Per.</TableHead>
                              <TableHead className="text-right">Suma</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Chit.</TableHead>
                              <TableHead className="w-16"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assocPayments.slice(0, 20).map(pay => {
                              const apt = apartments?.find(a => a.id === pay.apartmentId);
                              return (
                                <TableRow key={pay.id} data-testid={`row-portal-payment-${pay.id}`}>
                                  <TableCell className="font-medium whitespace-nowrap">
                                    {apt ? `${getUnitTypeLabel(apt.unitType)} ${apt.number}` : pay.apartmentId}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground whitespace-nowrap">{pay.month}/{pay.year}</TableCell>
                                  <TableCell className="text-right font-medium whitespace-nowrap">{Number(pay.amount).toLocaleString("ro-RO")} RON</TableCell>
                                  <TableCell>
                                    <Badge variant={pay.status === "paid" ? "default" : "secondary"} className="text-[9px] px-1 py-0">
                                      {pay.status === "paid" ? "Platit" : "Astept."}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{pay.receiptNumber || "-"}</TableCell>
                                  <TableCell>
                                    {pay.status === "pending" ? (
                                      <Button size="sm" variant="outline" className="h-5 px-1.5 text-[10px]" onClick={() => updatePaymentMutation.mutate({ id: pay.id, status: "paid" })} data-testid={`button-mark-paid-${pay.id}`}>
                                        Conf.
                                      </Button>
                                    ) : (
                                      <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px]" onClick={() => updatePaymentMutation.mutate({ id: pay.id, status: "pending" })} data-testid={`button-mark-pending-${pay.id}`}>
                                        Anul.
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      {assocPayments.length > 20 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Se afiseaza primele 20 din {assocPayments.length} plati
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {association?.presidentName && (
                  <Card data-testid="card-portal-president">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Presedinte
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm font-medium">{association.presidentName}</p>
                      {association.presidentPhone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{association.presidentPhone}</span>
                        </div>
                      )}
                      {association.presidentEmail && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{association.presidentEmail}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                {association?.adminName && (
                  <Card data-testid="card-portal-admin">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Administrator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm font-medium">{association.adminName}</p>
                      {association.adminPhone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{association.adminPhone}</span>
                        </div>
                      )}
                      {association.adminEmail && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{association.adminEmail}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                {!association?.presidentName && !association?.adminName && (
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <User className="w-10 h-10 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">Nicio informatie de contact disponibila</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "anunturi" && (
            <div>
              {assocAnnouncements.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Megaphone className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Niciun anunt pentru aceasta asociatie</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {assocAnnouncements.map(ann => (
                    <Card key={ann.id} data-testid={`card-portal-announcement-${ann.id}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-medium">{ann.title}</p>
                              {ann.priority === "urgent" && (
                                <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                              )}
                              {ann.priority === "important" && (
                                <Badge variant="secondary" className="text-[10px]">Important</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString("ro-RO") : ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function UnitExpandedContent({ apartmentId }: { apartmentId: string }) {
  const { toast } = useToast();
  const [roomName, setRoomName] = useState("");
  const [roomSurface, setRoomSurface] = useState("");
  const [meterType, setMeterType] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [initialReading, setInitialReading] = useState("");

  const { data: roomTypes } = useQuery<{ id: string; nume: string }[]>({
    queryKey: ["/api/liste/tip-camera"],
  });

  const { data: rooms, isLoading: loadingRooms } = useQuery<UnitRoom[]>({
    queryKey: ["/api/unit-rooms", apartmentId],
    queryFn: async () => {
      const res = await fetch(`/api/unit-rooms/${apartmentId}`);
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json();
    },
  });

  const { data: meters, isLoading: loadingMeters } = useQuery<Meter[]>({
    queryKey: ["/api/meters", apartmentId],
    queryFn: async () => {
      const res = await fetch(`/api/meters/${apartmentId}`);
      if (!res.ok) throw new Error("Failed to fetch meters");
      return res.json();
    },
  });

  const addRoomMutation = useMutation({
    mutationFn: async () => {
      const existingRooms = (rooms || []).map(r => ({ name: r.name, surface: r.surface }));
      const newRooms = [...existingRooms, { name: roomName.trim(), surface: roomSurface || null }];
      await apiRequest("POST", "/api/unit-rooms", { apartmentId, rooms: newRooms });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/unit-rooms", apartmentId] });
      setRoomName("");
      setRoomSurface("");
      toast({ title: "Camera adaugata" });
    },
    onError: () => { toast({ title: "Eroare la adaugare camera", variant: "destructive" }); },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/unit-rooms/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/unit-rooms", apartmentId] });
      toast({ title: "Camera stearsa" });
    },
  });

  const addMeterMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meters", {
        apartmentId,
        scopeType: "apartment",
        meterType,
        serialNumber,
        meterNumber,
        installDate,
        initialReading: initialReading || "0",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters", apartmentId] });
      setMeterType("");
      setSerialNumber("");
      setMeterNumber("");
      setInstallDate("");
      setInitialReading("");
      toast({ title: "Contor adaugat" });
    },
    onError: () => { toast({ title: "Eroare la adaugare contor", variant: "destructive" }); },
  });

  const deleteMeterMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/meters/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters", apartmentId] });
      toast({ title: "Contor sters" });
    },
  });

  return (
    <div className="border-t px-2 pb-2 pt-1.5 space-y-2">
      <div className="border-l-2 border-primary/20 pl-2 space-y-1">
        <div className="flex items-center gap-1">
          <DoorOpen className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold">Camere</span>
          <Badge variant="outline" className="text-[9px] py-0 ml-1">{rooms?.length || 0}</Badge>
        </div>
        {loadingRooms ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <>
            {rooms && rooms.length > 0 && (
              <div className="space-y-0.5">
                {rooms.map(room => (
                  <div key={room.id} className="flex items-center justify-between gap-1 text-[10px] py-0.5" data-testid={`room-item-${room.id}`}>
                    <span className="text-muted-foreground">{room.name}{room.surface ? ` — ${room.surface} m²` : ""}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteRoomMutation.mutate(room.id); }}
                      data-testid={`button-delete-room-${room.id}`}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1 mt-1">
              <Select value={roomName} onValueChange={setRoomName}>
                <SelectTrigger className="h-6 text-[10px] flex-1" data-testid={`select-room-type-${apartmentId}`}>
                  <SelectValue placeholder="Tip camera" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes && roomTypes.map(rt => (
                    <SelectItem key={rt.id} value={rt.nume}>{rt.nume}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="m²"
                value={roomSurface}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomSurface(e.target.value)}
                className="h-6 text-[10px] w-14"
                data-testid={`input-room-surface-${apartmentId}`}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-1.5"
                disabled={!roomName.trim() || addRoomMutation.isPending}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); addRoomMutation.mutate(); }}
                data-testid={`button-add-room-${apartmentId}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="border-l-2 border-primary/20 pl-2 space-y-1">
        <div className="flex items-center gap-1">
          <Gauge className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold">Contoare</span>
          <Badge variant="outline" className="text-[9px] py-0 ml-1">{meters?.length || 0}</Badge>
        </div>
        {loadingMeters ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <>
            {meters && meters.length > 0 && (
              <div className="space-y-0.5">
                {meters.map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-1 text-[10px] py-0.5" data-testid={`meter-item-${m.id}`}>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <Badge variant="secondary" className="text-[9px] py-0 shrink-0">{METER_TYPE_LABELS[m.meterType as MeterType] || m.meterType}</Badge>
                      <span className="text-muted-foreground truncate">
                        <Hash className="w-2.5 h-2.5 inline" />{m.serialNumber}
                        {m.meterNumber ? ` / ${m.meterNumber}` : ""}
                      </span>
                      {m.installDate && (
                        <span className="text-muted-foreground shrink-0">
                          <Calendar className="w-2.5 h-2.5 inline" />{m.installDate}
                        </span>
                      )}
                      <span className="text-muted-foreground shrink-0">init: {m.initialReading}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteMeterMutation.mutate(m.id); }}
                      data-testid={`button-delete-meter-${m.id}`}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1 flex-wrap mt-1">
              <Select value={meterType} onValueChange={setMeterType}>
                <SelectTrigger className="h-6 text-[10px] w-24" data-testid={`select-meter-type-${apartmentId}`}>
                  <SelectValue placeholder="Tip" />
                </SelectTrigger>
                <SelectContent>
                  {meterTypeEnum.map(t => (
                    <SelectItem key={t} value={t} data-testid={`option-meter-type-${t}`}>{METER_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Serie"
                value={serialNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerialNumber(e.target.value)}
                className="h-6 text-[10px] w-16"
                data-testid={`input-meter-serial-${apartmentId}`}
              />
              <Input
                placeholder="Nr."
                value={meterNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeterNumber(e.target.value)}
                className="h-6 text-[10px] w-14"
                data-testid={`input-meter-number-${apartmentId}`}
              />
              <DatePicker
                value={installDate}
                onChange={setInstallDate}
                placeholder="Data instalare"
                className="h-6 text-[10px] w-32"
                data-testid={`datepicker-meter-date-${apartmentId}`}
              />
              <Input
                placeholder="Citire"
                value={initialReading}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialReading(e.target.value)}
                className="h-6 text-[10px] w-14"
                data-testid={`input-meter-reading-${apartmentId}`}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-1.5"
                disabled={!meterType || !serialNumber.trim() || !meterNumber.trim() || !installDate || addMeterMutation.isPending}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); addMeterMutation.mutate(); }}
                data-testid={`button-add-meter-${apartmentId}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      <DocumentsSection entityType="apartment" entityId={apartmentId} />
    </div>
  );
}

function DocumentsSection({ entityType, entityId, floorNumber }: { entityType: string; entityId: string; floorNumber?: number }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docDescription, setDocDescription] = useState("");

  const queryKey = floorNumber !== undefined
    ? ["/api/documents", entityType, entityId, String(floorNumber)]
    : ["/api/documents", entityType, entityId];

  const { data: docs, isLoading } = useQuery<Document[]>({
    queryKey,
    queryFn: async () => {
      const url = floorNumber !== undefined
        ? `/api/documents/${entityType}/${entityId}?floorNumber=${floorNumber}`
        : `/api/documents/${entityType}/${entityId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", entityType);
      formData.append("entityId", entityId);
      if (docDescription.trim()) formData.append("description", docDescription.trim());
      if (floorNumber !== undefined) formData.append("floorNumber", String(floorNumber));
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDocDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Document incarcat" });
    },
    onError: () => { toast({ title: "Eroare la incarcarea documentului", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/documents/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Document sters" });
    },
  });

  const handleFileSelect = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const isImage = (mime: string) => mime.startsWith("image/");
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="border-l-2 border-primary/20 pl-2 space-y-1">
      <div className="flex items-center gap-1">
        <FileText className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-semibold">Documente</span>
        <Badge variant="outline" className="text-[9px] py-0 ml-1">{docs?.length || 0}</Badge>
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <>
          {docs && docs.length > 0 && (
            <div className="space-y-0.5">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between gap-1 text-[10px] py-0.5" data-testid={`doc-item-${doc.id}`}>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    {isImage(doc.mimeType) ? <Image className="w-2.5 h-2.5 shrink-0 text-muted-foreground" /> : <File className="w-2.5 h-2.5 shrink-0 text-muted-foreground" />}
                    <a
                      href={`/api/documents/download/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                      data-testid={`link-doc-${doc.id}`}
                    >
                      {doc.description || doc.originalName}
                    </a>
                    <span className="text-muted-foreground shrink-0">{formatSize(doc.size)}</span>
                    {doc.createdAt && (
                      <span className="text-muted-foreground shrink-0 text-[9px]">
                        {new Date(doc.createdAt).toLocaleDateString("ro-RO")}
                      </span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteMutation.mutate(doc.id); }}
                    data-testid={`button-delete-doc-${doc.id}`}
                  >
                    <Trash2 className="w-2.5 h-2.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 mt-1">
            <Input
              placeholder="Descriere document"
              value={docDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocDescription(e.target.value)}
              className="h-6 text-[10px] flex-1"
              data-testid={`input-doc-desc-${entityType}-${entityId}`}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
              data-testid={`input-doc-file-${entityType}-${entityId}`}
            />
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] px-1.5"
              disabled={uploadMutation.isPending}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              data-testid={`button-upload-doc-${entityType}-${entityId}`}
            >
              <Upload className="w-3 h-3 mr-0.5" />
              {uploadMutation.isPending ? "..." : "Incarca"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function CommonMeterAddForm({ scopeType, associationId, buildingId, staircaseId, floor }: {
  scopeType: string; associationId: string; buildingId?: string; staircaseId?: string; floor?: number;
}) {
  const { toast } = useToast();
  const [meterType, setMeterType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [initialReading, setInitialReading] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meters", {
        scopeType,
        associationId,
        buildingId: buildingId || null,
        staircaseId: staircaseId || null,
        floor: floor !== undefined ? floor : null,
        apartmentId: null,
        meterType,
        serialNumber,
        meterNumber,
        installDate,
        initialReading: initialReading || "0",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/common-meters") });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/consumption-differences") });
      setMeterType(""); setSerialNumber(""); setMeterNumber(""); setInstallDate(""); setInitialReading("");
      toast({ title: "Contor comun adaugat" });
    },
    onError: () => { toast({ title: "Eroare la adaugare contor", variant: "destructive" }); },
  });

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1.5">
      <Select value={meterType} onValueChange={setMeterType}>
        <SelectTrigger className="h-6 text-[10px] w-24" data-testid={`select-common-meter-type-${scopeType}`}>
          <SelectValue placeholder="Tip" />
        </SelectTrigger>
        <SelectContent>
          {meterTypeEnum.map(t => (
            <SelectItem key={t} value={t}>{METER_TYPE_LABELS[t]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input placeholder="Serie" value={serialNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerialNumber(e.target.value)} className="h-6 text-[10px] w-16" data-testid={`input-common-serial-${scopeType}`} />
      <Input placeholder="Nr." value={meterNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeterNumber(e.target.value)} className="h-6 text-[10px] w-14" data-testid={`input-common-number-${scopeType}`} />
      <DatePicker value={installDate} onChange={setInstallDate} placeholder="Data" className="h-6 text-[10px] w-32" data-testid={`datepicker-common-date-${scopeType}`} />
      <Input placeholder="Citire" value={initialReading} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialReading(e.target.value)} className="h-6 text-[10px] w-14" data-testid={`input-common-reading-${scopeType}`} />
      <Button
        size="sm" variant="outline" className="h-6 text-[10px] px-1.5"
        disabled={!meterType || !serialNumber.trim() || !meterNumber.trim() || !installDate || addMutation.isPending}
        onClick={() => addMutation.mutate()}
        data-testid={`button-add-common-meter-${scopeType}`}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}

function MeterReadingForm({ meterId, associationId }: { meterId: string; associationId: string }) {
  const { toast } = useToast();
  const [readingDate, setReadingDate] = useState("");
  const [readingValue, setReadingValue] = useState("");

  const addReadingMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meter-readings", {
        meterId,
        readingDate,
        readingValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meter-readings", meterId] });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/common-meters") });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/meters-with-readings") });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/consumption-differences") });
      setReadingDate(""); setReadingValue("");
      toast({ title: "Citire adaugata" });
    },
    onError: (err: any) => { toast({ title: err.message || "Eroare la adaugare citire", variant: "destructive" }); },
  });

  return (
    <div className="flex items-center gap-1 mt-1">
      <DatePicker value={readingDate} onChange={setReadingDate} placeholder="Data citire" className="h-6 text-[10px] w-28" data-testid={`datepicker-reading-${meterId}`} />
      <Input type="number" step="0.001" value={readingValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReadingValue(e.target.value)} placeholder="Index" className="h-6 text-[10px] w-20" data-testid={`input-reading-value-${meterId}`} />
      <Button size="sm" variant="outline" className="h-6 text-[10px] px-1.5" disabled={!readingDate || !readingValue || addReadingMutation.isPending} onClick={() => addReadingMutation.mutate()} data-testid={`button-add-reading-${meterId}`}>
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}

function MeterReadingsHistory({ meterId }: { meterId: string }) {
  const { toast } = useToast();
  const { data: readings } = useQuery<MeterReading[]>({
    queryKey: ["/api/meter-readings", meterId],
  });

  const deleteReadingMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/meter-readings/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meter-readings", meterId] });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/consumption-differences") });
      toast({ title: "Citire stearsa" });
    },
  });

  if (!readings || readings.length === 0) {
    return <p className="text-[9px] text-muted-foreground py-1">Nicio citire inregistrata</p>;
  }

  return (
    <div className="mt-1">
      <Table className="compact-table">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px] py-0.5 px-1">Data</TableHead>
            <TableHead className="text-[9px] py-0.5 px-1 text-right">Index</TableHead>
            <TableHead className="text-[9px] py-0.5 px-1 text-right">Consum</TableHead>
            <TableHead className="text-[9px] py-0.5 px-1 text-right">Acumulat</TableHead>
            <TableHead className="text-[9px] py-0.5 px-1 w-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map(r => (
            <TableRow key={r.id} data-testid={`row-reading-${r.id}`}>
              <TableCell className="text-[9px] py-0.5 px-1">{r.readingDate}</TableCell>
              <TableCell className="text-[9px] py-0.5 px-1 text-right tabular-nums">{r.readingValue}</TableCell>
              <TableCell className="text-[9px] py-0.5 px-1 text-right tabular-nums">{r.consumption || "-"}</TableCell>
              <TableCell className="text-[9px] py-0.5 px-1 text-right tabular-nums">{r.accumulatedConsumption || "-"}</TableCell>
              <TableCell className="py-0.5 px-1">
                <Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => deleteReadingMutation.mutate(r.id)} data-testid={`button-delete-reading-${r.id}`}>
                  <Trash2 className="w-2 h-2 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CommonMetersList({ meters, label, associationId }: { meters: Meter[]; label: string; associationId: string }) {
  const { toast } = useToast();
  const [expandedMeters, setExpandedMeters] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedMeters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/meters/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/common-meters") });
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/api/consumption-differences") });
      toast({ title: "Contor sters" });
    },
  });

  if (meters.length === 0) return null;

  return (
    <div className="space-y-1">
      {meters.map(m => {
        const isExpanded = expandedMeters.has(m.id);
        return (
          <div key={m.id} data-testid={`common-meter-${m.id}`}>
            <div className="flex items-center justify-between gap-1 text-[10px] py-0.5">
              <div className="flex items-center gap-1 flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpanded(m.id)} data-testid={`button-expand-meter-${m.id}`}>
                {isExpanded ? <ChevronDown className="w-2.5 h-2.5 shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 shrink-0" />}
                <Badge variant="secondary" className="text-[9px] py-0 shrink-0">{METER_TYPE_LABELS[m.meterType as MeterType] || m.meterType}</Badge>
                <span className="text-muted-foreground truncate">
                  <Hash className="w-2.5 h-2.5 inline" />{m.serialNumber} / {m.meterNumber}
                </span>
                {m.installDate && <span className="text-muted-foreground shrink-0"><Calendar className="w-2.5 h-2.5 inline" />{m.installDate}</span>}
                <span className="text-muted-foreground shrink-0">init: {m.initialReading}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => deleteMutation.mutate(m.id)} data-testid={`button-delete-common-meter-${m.id}`}>
                <Trash2 className="w-2.5 h-2.5 text-muted-foreground" />
              </Button>
            </div>
            {isExpanded && (
              <div className="ml-4 border-l-2 border-muted pl-2">
                <MeterReadingForm meterId={m.id} associationId={associationId} />
                <MeterReadingsHistory meterId={m.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ConsumptionDifferencesPanel({ associationId }: { associationId: string }) {
  const [selectedMeterType, setSelectedMeterType] = useState<string>("water");

  const diffUrl = `/api/consumption-differences?associationId=${associationId}&meterType=${selectedMeterType}`;
  const { data: diff, isLoading } = useQuery<any>({
    queryKey: [diffUrl],
    enabled: !!selectedMeterType,
  });

  return (
    <Card data-testid="card-consumption-differences">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Diferente Consum Ierarhice
          </CardTitle>
          <Select value={selectedMeterType} onValueChange={setSelectedMeterType}>
            <SelectTrigger className="w-32 h-7 text-xs" data-testid="select-diff-meter-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meterTypeEnum.map(t => (
                <SelectItem key={t} value={t} data-testid={`select-diff-type-${t}`}>{METER_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-20" />
        ) : !diff ? (
          <p className="text-xs text-muted-foreground">Selectati un tip de contor</p>
        ) : (
          <div className="space-y-3">
            {diff.association.meters.length > 0 && (
              <div className="bg-primary/5 rounded-md p-2" data-testid="diff-association">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Contor General Asociatie</span>
                  <span className="font-bold tabular-nums" data-testid="text-assoc-consumption">{diff.association.totalConsumption.toFixed(3)}</span>
                </div>
                {diff.exteriorCommonConsumption > 0 && (
                  <div className="flex items-center justify-between text-[10px] mt-1 text-orange-600 dark:text-orange-400">
                    <span>Consum zone comune exterioare</span>
                    <span className="font-bold tabular-nums" data-testid="text-exterior-common">{diff.exteriorCommonConsumption.toFixed(3)}</span>
                  </div>
                )}
              </div>
            )}

            {diff.buildings.map((bld: any) => (
              <div key={bld.buildingId} className="border rounded-md p-2 space-y-1" data-testid={`diff-building-${bld.buildingId}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{bld.buildingName || bld.buildingId}</span>
                  {bld.meters.length > 0 && (
                    <span className="font-bold tabular-nums">{bld.totalConsumption.toFixed(3)}</span>
                  )}
                </div>
                {bld.commonConsumption > 0 && (
                  <div className="flex items-center justify-between text-[10px] text-orange-600 dark:text-orange-400">
                    <span>Consum comun bloc</span>
                    <span className="font-bold tabular-nums">{bld.commonConsumption.toFixed(3)}</span>
                  </div>
                )}

                {bld.staircases.map((sc: any) => (
                  <div key={sc.staircaseId} className="border-l-2 border-muted pl-2 ml-1 space-y-0.5" data-testid={`diff-staircase-${sc.staircaseId}`}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium">{sc.staircaseName || "Scara"}</span>
                      {sc.meters.length > 0 && (
                        <span className="font-semibold tabular-nums">{sc.totalConsumption.toFixed(3)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Suma contoare apartamente ({sc.apartmentMeterCount})</span>
                      <span className="tabular-nums">{sc.apartmentsTotalConsumption.toFixed(3)}</span>
                    </div>
                    {sc.commonConsumption > 0 && (
                      <div className="flex items-center justify-between text-[10px] text-orange-600 dark:text-orange-400">
                        <span>Consum comun scara</span>
                        <span className="font-bold tabular-nums">{sc.commonConsumption.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {diff.association.meters.length === 0 && diff.buildings.length === 0 && (
              <p className="text-xs text-muted-foreground" data-testid="text-no-diff-data">
                Nu exista contoare cu citiri pentru {METER_TYPE_LABELS[selectedMeterType as MeterType]}. Adaugati contoare si citiri mai intai.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommonMetersSection({ associationId, buildings, staircases, apartments }: {
  associationId: string;
  buildings: Building[];
  staircases: Staircase[];
  apartments: Apartment[];
}) {
  const commonMetersUrl = `/api/common-meters?associationId=${associationId}`;
  const { data: commonMeters, isLoading } = useQuery<Meter[]>({
    queryKey: [commonMetersUrl],
  });

  const assocMeters = commonMeters?.filter(m => m.scopeType === "association") || [];
  const buildingMeters = (bldId: string) => commonMeters?.filter(m => m.scopeType === "building" && m.buildingId === bldId) || [];
  const staircaseMeters = (scId: string) => commonMeters?.filter(m => m.scopeType === "staircase" && m.staircaseId === scId) || [];
  const floorMeters = (scId: string, fl: number) => commonMeters?.filter(m => m.scopeType === "floor" && m.staircaseId === scId && m.floor === fl) || [];

  if (isLoading) {
    return <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>;
  }

  return (
    <div className="space-y-3">
      <Card data-testid="card-common-meters-association">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Contor General Asociatie
            <Badge variant="outline" className="text-[10px]">{assocMeters.length} contoare</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CommonMetersList meters={assocMeters} label="Asociatie" associationId={associationId} />
          <CommonMeterAddForm scopeType="association" associationId={associationId} />
        </CardContent>
      </Card>

      {buildings.map(bld => {
        const bldM = buildingMeters(bld.id);
        const bldScs = staircases.filter(s => s.buildingId === bld.id);

        return (
          <Card key={bld.id} data-testid={`card-common-meters-building-${bld.id}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                {bld.name}
                <Badge variant="outline" className="text-[10px]">{bldM.length} contoare bloc</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <CommonMetersList meters={bldM} label={bld.name} associationId={associationId} />
              <CommonMeterAddForm scopeType="building" associationId={associationId} buildingId={bld.id} />

              {bldScs.map(sc => {
                const scM = staircaseMeters(sc.id);
                const scApts = apartments.filter(a => a.staircaseId === sc.id);
                const floors = Array.from(new Set(scApts.map(a => a.floor))).sort((a, b) => b - a);

                return (
                  <div key={sc.id} className="border-l-2 border-primary/20 pl-3 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium">{sc.name}</span>
                      <Badge variant="outline" className="text-[9px] py-0">{scM.length} contoare</Badge>
                    </div>
                    <CommonMetersList meters={scM} label={sc.name} associationId={associationId} />
                    <CommonMeterAddForm scopeType="staircase" associationId={associationId} buildingId={bld.id} staircaseId={sc.id} />

                    {floors.map(fl => {
                      const flM = floorMeters(sc.id, fl);
                      return (
                        <div key={fl} className="border-l-2 border-muted pl-3 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-medium">{fl < 0 ? `Subsol ${Math.abs(fl)}` : fl === 0 ? "Parter" : `Etaj ${fl}`}</span>
                            <Badge variant="outline" className="text-[9px] py-0">{flM.length}</Badge>
                          </div>
                          <CommonMetersList meters={flM} label={`Etaj ${fl}`} associationId={associationId} />
                          <CommonMeterAddForm scopeType="floor" associationId={associationId} buildingId={bld.id} staircaseId={sc.id} floor={fl} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <ConsumptionDifferencesPanel associationId={associationId} />
    </div>
  );
}

function FundCard({ fund, isExpanded, onToggle }: { fund: Fund; isExpanded: boolean; onToggle: () => void }) {
  const { data: categories } = useQuery<FundCategory[]>({
    queryKey: [`/api/fund-categories?fundId=${fund.id}`],
  });

  const totalBudget = categories?.reduce((s, c) => s + Number(c.budgetAmount || 0), 0) || 0;
  const totalCurrent = categories?.reduce((s, c) => s + Number(c.currentAmount || 0), 0) || 0;

  return (
    <Card data-testid={`card-portal-fund-${fund.id}`}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                {fund.name}
                {fund.isActive && <Badge variant="secondary" className="text-[10px]">Activ</Badge>}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{Number(fund.currentBalance || 0).toLocaleString("ro-RO")} RON</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
            {fund.bankAccount && (
              <p className="text-xs text-muted-foreground">{fund.bankName} - {fund.bankAccount}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {!categories || categories.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">Nicio categorie definita</p>
            ) : (
              <Table className="compact-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Categorie</TableHead>
                    <TableHead className="text-right">Buget</TableHead>
                    <TableHead className="text-right">Realizat</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(cat => {
                    const budget = Number(cat.budgetAmount || 0);
                    const current = Number(cat.currentAmount || 0);
                    const pct = budget > 0 ? Math.round((current / budget) * 100) : 0;
                    return (
                      <TableRow key={cat.id}>
                        <TableCell className="text-xs font-medium">{cat.name}</TableCell>
                        <TableCell className="text-xs text-right">{budget.toLocaleString("ro-RO")} RON</TableCell>
                        <TableCell className="text-xs text-right">{current.toLocaleString("ro-RO")} RON</TableCell>
                        <TableCell className="text-xs text-right">
                          <Badge variant={pct >= 100 ? "destructive" : pct >= 75 ? "secondary" : "outline"} className="text-[10px]">
                            {pct}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="font-medium">
                    <TableCell className="text-xs">Total</TableCell>
                    <TableCell className="text-xs text-right">{totalBudget.toLocaleString("ro-RO")} RON</TableCell>
                    <TableCell className="text-xs text-right">{totalCurrent.toLocaleString("ro-RO")} RON</TableCell>
                    <TableCell className="text-xs text-right">
                      {totalBudget > 0 ? Math.round((totalCurrent / totalBudget) * 100) : 0}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
