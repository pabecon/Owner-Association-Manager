import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2, Home, ArrowUpDown, Layers, Car, Package, MapPin, User, Phone, Mail,
  FileText, ChevronLeft, Wallet, Receipt, CreditCard, Megaphone, ArrowDown,
  ChevronDown, ChevronRight, Trash2, Plus, Banknote
} from "lucide-react";
import type { Association, Building, Staircase, Apartment, Expense, Payment, Announcement, Fund, FundCategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AssociationPortal() {
  const [, params] = useRoute("/asociatie/:id");
  const associationId = params?.id;
  const { toast } = useToast();

  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({});
  const [expandedStaircases, setExpandedStaircases] = useState<Record<string, boolean>>({});
  const [expandedFunds, setExpandedFunds] = useState<Record<string, boolean>>({});

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

  if (!association && !loadingAssocs) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Asociatia nu a fost gasita</h2>
        <Link href="/">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Inapoi la Panou
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-back-dashboard">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight truncate" data-testid="text-portal-title">
              {association?.name || <Skeleton className="h-6 w-48 inline-block" />}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {association?.cui && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" />CUI: {association.cui}
                </span>
              )}
              {association?.address && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{association.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            <Card>
              <CardContent className="p-2.5 text-center">
                <Building2 className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-buildings">{assocBuildings.length}</p>
                <p className="text-[10px] text-muted-foreground">Blocuri</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2.5 text-center">
                <ArrowUpDown className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-staircases">{assocStaircases.length}</p>
                <p className="text-[10px] text-muted-foreground">Scari</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2.5 text-center">
                <Home className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-apartments">{aptCount}</p>
                <p className="text-[10px] text-muted-foreground">Apartamente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2.5 text-center">
                <Package className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-boxes">{boxCount}</p>
                <p className="text-[10px] text-muted-foreground">Boxe</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2.5 text-center">
                <Car className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-parking">{parkingCount}</p>
                <p className="text-[10px] text-muted-foreground">Parking</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2.5 text-center">
                <Wallet className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold" data-testid="text-portal-funds">{funds?.length || 0}</p>
                <p className="text-[10px] text-muted-foreground">Fonduri</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="imobiliar" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1" data-testid="portal-tabs">
              <TabsTrigger value="imobiliar" data-testid="tab-imobiliar" className="text-xs">
                <Building2 className="w-3.5 h-3.5 mr-1" />Imobiliar
              </TabsTrigger>
              <TabsTrigger value="financiar" data-testid="tab-financiar" className="text-xs">
                <Receipt className="w-3.5 h-3.5 mr-1" />Financiar
              </TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact" className="text-xs">
                <User className="w-3.5 h-3.5 mr-1" />Contact
              </TabsTrigger>
              <TabsTrigger value="anunturi" data-testid="tab-anunturi" className="text-xs">
                <Megaphone className="w-3.5 h-3.5 mr-1" />Anunturi
              </TabsTrigger>
            </TabsList>

            {/* ═══ IMOBILIAR TAB ═══ */}
            <TabsContent value="imobiliar" className="mt-3">
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
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                                    {floorApts.map(apt => {
                                                      const UnitIcon = getUnitTypeIcon(apt.unitType);
                                                      return (
                                                        <div key={apt.id} className="flex items-center gap-2 p-1.5 rounded-md bg-background border text-xs" data-testid={`unit-card-${apt.id}`}>
                                                          <UnitIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                              <span className="font-medium">{getUnitTypeLabel(apt.unitType)} {apt.number}</span>
                                                            </div>
                                                            {apt.ownerName && (
                                                              <span className="text-muted-foreground truncate block">{apt.ownerName}</span>
                                                            )}
                                                          </div>
                                                          <div className="text-right shrink-0 text-muted-foreground">
                                                            {apt.surface && <span className="block text-[10px]">{apt.surface} m²</span>}
                                                            {apt.rooms && <span className="block text-[10px]">{apt.rooms} cam.</span>}
                                                          </div>
                                                        </div>
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
            </TabsContent>

            {/* ═══ FINANCIAR TAB ═══ */}
            <TabsContent value="financiar" className="mt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Total Cheltuieli</span>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-portal-total-expenses">{totalExpenses.toLocaleString("ro-RO")} RON</p>
                    <p className="text-[10px] text-muted-foreground">{assocExpenses.length} inregistrari</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-muted-foreground">Total Incasat</span>
                    </div>
                    <p className="text-lg font-bold text-green-600" data-testid="text-portal-total-paid">{totalPaid.toLocaleString("ro-RO")} RON</p>
                    <p className="text-[10px] text-muted-foreground">{assocPayments.filter(p => p.status === "paid").length} plati</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-muted-foreground">In Asteptare</span>
                    </div>
                    <p className="text-lg font-bold text-orange-500" data-testid="text-portal-pending">{pendingPayments}</p>
                    <p className="text-[10px] text-muted-foreground">plati neachitate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Rata Incasare</span>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-portal-collection-rate">{collectionRate}%</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${collectionRate}%` }} />
                    </div>
                  </CardContent>
                </Card>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Descriere</TableHead>
                            <TableHead className="text-xs">Categorie</TableHead>
                            <TableHead className="text-xs">Bloc</TableHead>
                            <TableHead className="text-xs">Luna/An</TableHead>
                            <TableHead className="text-xs text-right">Suma</TableHead>
                            <TableHead className="text-xs w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assocExpenses.slice(0, 20).map(exp => {
                            const bld = assocBuildings.find(b => b.id === exp.buildingId);
                            return (
                              <TableRow key={exp.id} data-testid={`row-portal-expense-${exp.id}`}>
                                <TableCell className="text-xs font-medium">{exp.description}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-[10px]">{exp.category}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{bld?.name || "-"}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{exp.month}/{exp.year}</TableCell>
                                <TableCell className="text-xs text-right font-medium">{Number(exp.amount).toLocaleString("ro-RO")} RON</TableCell>
                                <TableCell>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => deleteExpenseMutation.mutate(exp.id)}
                                    data-testid={`button-delete-expense-${exp.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Apartament</TableHead>
                            <TableHead className="text-xs">Luna/An</TableHead>
                            <TableHead className="text-xs text-right">Suma</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Chitanta</TableHead>
                            <TableHead className="text-xs w-20">Actiuni</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assocPayments.slice(0, 20).map(pay => {
                            const apt = apartments?.find(a => a.id === pay.apartmentId);
                            return (
                              <TableRow key={pay.id} data-testid={`row-portal-payment-${pay.id}`}>
                                <TableCell className="text-xs font-medium">
                                  {apt ? `${getUnitTypeLabel(apt.unitType)} ${apt.number}` : pay.apartmentId}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{pay.month}/{pay.year}</TableCell>
                                <TableCell className="text-xs text-right font-medium">{Number(pay.amount).toLocaleString("ro-RO")} RON</TableCell>
                                <TableCell>
                                  <Badge variant={pay.status === "paid" ? "default" : "secondary"} className="text-[10px]">
                                    {pay.status === "paid" ? "Platit" : "In asteptare"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{pay.receiptNumber || "-"}</TableCell>
                                <TableCell>
                                  {pay.status === "pending" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px]"
                                      onClick={() => updatePaymentMutation.mutate({ id: pay.id, status: "paid" })}
                                      data-testid={`button-mark-paid-${pay.id}`}
                                    >
                                      Confirma
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 text-[10px]"
                                      onClick={() => updatePaymentMutation.mutate({ id: pay.id, status: "pending" })}
                                      data-testid={`button-mark-pending-${pay.id}`}
                                    >
                                      Anuleaza
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      {assocPayments.length > 20 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Se afiseaza primele 20 din {assocPayments.length} plati
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* ═══ CONTACT TAB ═══ */}
            <TabsContent value="contact" className="mt-3">
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
            </TabsContent>

            {/* ═══ ANUNTURI TAB ═══ */}
            <TabsContent value="anunturi" className="mt-3">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Categorie</TableHead>
                    <TableHead className="text-xs text-right">Buget</TableHead>
                    <TableHead className="text-xs text-right">Realizat</TableHead>
                    <TableHead className="text-xs text-right">%</TableHead>
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
