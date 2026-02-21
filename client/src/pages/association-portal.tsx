import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, Home, ArrowUpDown, Layers, Car, Package, MapPin, User, Phone, Mail,
  FileText, ChevronLeft, Wallet, Receipt, CreditCard, Megaphone, ArrowDown
} from "lucide-react";
import type { Association, Building, Staircase, Apartment, Expense, Payment, Announcement, Fund } from "@shared/schema";

export default function AssociationPortal() {
  const [, params] = useRoute("/asociatie/:id");
  const associationId = params?.id;

  const { data: associations } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
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

  const loading = loadingBuildings || loadingStaircases || loadingApts;

  if (!association && !loadingBuildings) {
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

  const getFloorLabel = (floor: number) => {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  };

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
            <div className="flex items-center gap-2 flex-wrap">
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

          <Tabs defaultValue="buildings" className="w-full">
            <TabsList className="w-full justify-start" data-testid="portal-tabs">
              <TabsTrigger value="buildings" data-testid="tab-buildings">
                <Building2 className="w-3.5 h-3.5 mr-1.5" />Blocuri
              </TabsTrigger>
              <TabsTrigger value="finance" data-testid="tab-finance">
                <Receipt className="w-3.5 h-3.5 mr-1.5" />Financiar
              </TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact">
                <User className="w-3.5 h-3.5 mr-1.5" />Contact
              </TabsTrigger>
              <TabsTrigger value="announcements" data-testid="tab-announcements">
                <Megaphone className="w-3.5 h-3.5 mr-1.5" />Anunturi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buildings" className="mt-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
                </div>
              ) : assocBuildings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Building2 className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Niciun bloc inregistrat</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assocBuildings.map(building => {
                    const bldStaircases = assocStaircases.filter(s => s.buildingId === building.id);
                    const bldStaircaseIds = bldStaircases.map(s => s.id);
                    const bldApts = assocApartments.filter(a => bldStaircaseIds.includes(a.staircaseId));
                    const bldAptCount = bldApts.filter(a => !a.unitType || a.unitType === "apartment").length;
                    const bldBoxCount = bldApts.filter(a => a.unitType === "box").length;
                    const bldParkCount = bldApts.filter(a => a.unitType === "parking").length;

                    return (
                      <Card key={building.id} data-testid={`card-portal-building-${building.id}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            {building.name}
                          </CardTitle>
                          {building.address && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{building.address}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-1.5 rounded bg-muted/50">
                              <p className="text-sm font-bold">{bldStaircases.length}</p>
                              <p className="text-[10px] text-muted-foreground">Scari</p>
                            </div>
                            <div className="p-1.5 rounded bg-muted/50">
                              <p className="text-sm font-bold">{building.floors || 0}</p>
                              <p className="text-[10px] text-muted-foreground">Etaje</p>
                            </div>
                            <div className="p-1.5 rounded bg-muted/50">
                              <p className="text-sm font-bold">{bldApts.length}</p>
                              <p className="text-[10px] text-muted-foreground">Unitati</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
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
                          </div>

                          {bldStaircases.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                              <p className="text-xs font-medium text-muted-foreground">Scari:</p>
                              {bldStaircases.map(sc => {
                                const scApts = bldApts.filter(a => a.staircaseId === sc.id);
                                const floors = Array.from(new Set(scApts.map(a => a.floor))).sort((a, b) => b - a);
                                return (
                                  <div key={sc.id} className="pl-2 border-l-2 border-primary/20">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium flex items-center gap-1">
                                        <ArrowUpDown className="w-3 h-3" />{sc.name}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">{scApts.length} unitati</span>
                                    </div>
                                    {floors.length > 0 && (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {floors.map(fl => {
                                          const floorApts = scApts.filter(a => a.floor === fl);
                                          return (
                                            <Badge key={fl} variant="outline" className="text-[9px] gap-0.5 py-0">
                                              {fl < 0 ? (
                                                <ArrowDown className="w-2.5 h-2.5" />
                                              ) : (
                                                <Layers className="w-2.5 h-2.5" />
                                              )}
                                              {getFloorLabel(fl)} ({floorApts.length})
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="finance" className="mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
              </div>

              {funds && funds.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Fonduri Active
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {funds.map(fund => (
                      <Card key={fund.id} data-testid={`card-portal-fund-${fund.id}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{fund.name}</span>
                            {fund.isActive && <Badge variant="secondary" className="text-[10px]">Activ</Badge>}
                          </div>
                          {fund.bankAccount && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {fund.bankName} - {fund.bankAccount}
                            </p>
                          )}
                          <p className="text-lg font-bold">
                            {Number(fund.currentBalance || 0).toLocaleString("ro-RO")} RON
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

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

            <TabsContent value="announcements" className="mt-3">
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
