import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Home, Network, Users, ArrowUpDown, Layers, Car, Package, ExternalLink, MapPin, FileText, User, Phone } from "lucide-react";
import type { Federation, Association } from "@shared/schema";
import { Link } from "wouter";

interface HierarchyStat {
  association_id: string;
  buildings_count: string;
  staircases_count: string;
  units_count: string;
  apartments_count: string;
  boxes_count: string;
  parking_count: string;
  max_floors: number;
}

export default function Dashboard() {
  const { data: federations, isLoading: loadingFeds } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });
  const { data: associations, isLoading: loadingAssocs } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: stats, isLoading: loadingStats } = useQuery<HierarchyStat[]>({ queryKey: ["/api/hierarchy-stats"] });

  const loading = loadingFeds || loadingAssocs || loadingStats;

  const getStats = (assocId: string): HierarchyStat | undefined => {
    return stats?.find(s => s.association_id === assocId);
  };

  const getFederationName = (fedId: string | null) => {
    if (!fedId) return null;
    return federations?.find(f => f.id === fedId)?.name || null;
  };

  const groupedByFederation = () => {
    if (!associations) return { independent: [], grouped: {} as Record<string, { federation: Federation; associations: Association[] }> };
    const independent: Association[] = [];
    const grouped: Record<string, { federation: Federation; associations: Association[] }> = {};

    associations.forEach(a => {
      if (!a.federationId) {
        independent.push(a);
      } else {
        const fed = federations?.find(f => f.id === a.federationId);
        if (!fed) {
          independent.push(a);
        } else {
          if (!grouped[a.federationId]) {
            grouped[a.federationId] = { federation: fed, associations: [] };
          }
          grouped[a.federationId].associations.push(a);
        }
      }
    });

    return { independent, grouped };
  };

  const { independent, grouped } = groupedByFederation();

  const totalBuildings = stats?.reduce((sum, s) => sum + Number(s.buildings_count), 0) || 0;
  const totalUnits = stats?.reduce((sum, s) => sum + Number(s.units_count), 0) || 0;
  const totalAssociations = associations?.length || 0;
  const totalFederations = federations?.length || 0;

  const renderAssociationCard = (assoc: Association) => {
    const s = getStats(assoc.id);
    const buildings = Number(s?.buildings_count || 0);
    const staircases = Number(s?.staircases_count || 0);
    const apartments = Number(s?.apartments_count || 0);
    const boxes = Number(s?.boxes_count || 0);
    const parking = Number(s?.parking_count || 0);
    const floors = Number(s?.max_floors || 0);
    const totalUnits = apartments + boxes + parking;

    return (
      <Link key={assoc.id} href={`/asociatie/${assoc.id}`} className="block">
        <Card className="hover-elevate cursor-pointer transition-all" data-testid={`card-dashboard-association-${assoc.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" data-testid={`text-dashboard-assoc-name-${assoc.id}`}>{assoc.name}</p>
                  {assoc.cui && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <FileText className="w-3 h-3" />
                      <span>CUI: {assoc.cui}</span>
                    </div>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            </div>

            {assoc.address && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{assoc.address}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg font-bold" data-testid={`text-buildings-count-${assoc.id}`}>{buildings}</p>
                <p className="text-[10px] text-muted-foreground">Blocuri</p>
              </div>
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg font-bold" data-testid={`text-staircases-count-${assoc.id}`}>{staircases}</p>
                <p className="text-[10px] text-muted-foreground">Scari</p>
              </div>
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg font-bold" data-testid={`text-units-count-${assoc.id}`}>{totalUnits}</p>
                <p className="text-[10px] text-muted-foreground">Unitati</p>
              </div>
            </div>

            {totalUnits > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {apartments > 0 && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Home className="w-3 h-3" />
                    {apartments} apt.
                  </Badge>
                )}
                {boxes > 0 && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Package className="w-3 h-3" />
                    {boxes} boxe
                  </Badge>
                )}
                {parking > 0 && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Car className="w-3 h-3" />
                    {parking} parking
                  </Badge>
                )}
                {floors > 0 && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Layers className="w-3 h-3" />
                    {floors} etaje
                  </Badge>
                )}
              </div>
            )}

            {(assoc.presidentName || assoc.adminName) && (
              <div className="pt-2 border-t space-y-1">
                {assoc.presidentName && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Presedinte: <span className="text-foreground">{assoc.presidentName}</span></span>
                  </div>
                )}
                {assoc.adminName && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Admin: <span className="text-foreground">{assoc.adminName}</span></span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight" data-testid="text-dashboard-title">Panou Super Admin</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Vizualizare generala a tuturor federatiilor si asociatiilor</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Federatii</p>
                    <p className="text-xl font-bold" data-testid="text-total-federations">{loading ? "..." : totalFederations}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                    <Network className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Asociatii</p>
                    <p className="text-xl font-bold" data-testid="text-total-associations">{loading ? "..." : totalAssociations}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Blocuri</p>
                    <p className="text-xl font-bold" data-testid="text-total-buildings">{loading ? "..." : totalBuildings}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Unitati</p>
                    <p className="text-xl font-bold" data-testid="text-total-units">{loading ? "..." : totalUnits}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                    <Home className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[1, 2].map(j => (
                        <Skeleton key={j} className="h-48 w-full rounded-lg" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(grouped).map(({ federation, associations: fedAssocs }) => (
                <div key={federation.id} data-testid={`section-federation-${federation.id}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Network className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold">{federation.name}</h2>
                    <Badge variant="secondary" className="text-[10px]">{fedAssocs.length} asociatii</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fedAssocs.map(renderAssociationCard)}
                  </div>
                </div>
              ))}

              {independent.length > 0 && (
                <div data-testid="section-independent-associations">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Asociatii Independente</h2>
                    <Badge variant="outline" className="text-[10px]">{independent.length} asociatii</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {independent.map(renderAssociationCard)}
                  </div>
                </div>
              )}

              {totalAssociations === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">Nicio asociatie inregistrata</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Adauga asociatii din meniul Management Imobiliar</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
