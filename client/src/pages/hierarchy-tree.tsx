import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, Users, Building2, ArrowUpDown, Layers, Home, Car, Package, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Federation, Association, Building, Staircase, Apartment } from "@shared/schema";
import { UNIT_TYPE_LABELS, type UnitType } from "@shared/schema";

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Package,
  parking: Car,
};

interface TreeNodeProps {
  label: string;
  icon: any;
  children?: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  level: number;
  defaultOpen?: boolean;
  isLeaf?: boolean;
  subtitle?: string;
}

function TreeNode({ label, icon: Icon, children, badge, badgeVariant = "secondary", level, defaultOpen = false, isLeaf = false, subtitle }: TreeNodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!children;
  const indentPx = level * 24;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md ${hasChildren && !isLeaf ? "cursor-pointer hover-elevate" : ""}`}
        style={{ paddingLeft: `${indentPx + 8}px` }}
        onClick={hasChildren && !isLeaf ? () => setOpen(!open) : undefined}
        data-testid={`tree-node-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {hasChildren && !isLeaf ? (
          open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <div className={`flex items-center justify-center w-6 h-6 rounded shrink-0 ${isLeaf ? "bg-muted" : "bg-primary/10"}`}>
          <Icon className={`w-3.5 h-3.5 ${isLeaf ? "text-muted-foreground" : "text-primary"}`} />
        </div>
        <span className={`text-sm ${isLeaf ? "text-muted-foreground" : "font-medium"} truncate`}>{label}</span>
        {subtitle && <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">{subtitle}</span>}
        {badge && <Badge variant={badgeVariant} className="text-[10px] ml-auto shrink-0">{badge}</Badge>}
      </div>
      {open && hasChildren && (
        <div className="border-l border-border ml-4" style={{ marginLeft: `${indentPx + 20}px` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function getFloorLabel(floor: number) {
  if (floor < 0) return `Subsol ${Math.abs(floor)}`;
  if (floor === 0) return "Parter";
  return `Etaj ${floor}`;
}

export default function HierarchyTree() {
  const { data: federations, isLoading: lf } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });
  const { data: associations, isLoading: la } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: buildings, isLoading: lb } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: staircases, isLoading: ls } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });
  const { data: apartments, isLoading: lap } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });

  const isLoading = lf || la || lb || ls || lap;

  const independentAssociations = associations?.filter(a => !a.federationId) || [];

  const totalFed = federations?.length || 0;
  const totalAssoc = associations?.length || 0;
  const totalBld = buildings?.length || 0;
  const totalSt = staircases?.length || 0;
  const totalApt = apartments?.length || 0;
  const totalAptOnly = apartments?.filter(a => (a.unitType || "apartment") === "apartment").length || 0;
  const totalBoxes = apartments?.filter(a => a.unitType === "box").length || 0;
  const totalParking = apartments?.filter(a => a.unitType === "parking").length || 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Infografie Ierarhie</h1>
          <p className="text-muted-foreground text-sm mt-1">Vizualizare arborescenta completa</p>
        </div>
        <Card><CardContent className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-tree-title">Infografie Ierarhie</h1>
        <p className="text-muted-foreground text-sm mt-1">Vizualizare arborescenta completa a structurii</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalFed}</p>
          <p className="text-xs text-muted-foreground">Federatii</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalAssoc}</p>
          <p className="text-xs text-muted-foreground">Asociatii</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalBld}</p>
          <p className="text-xs text-muted-foreground">Blocuri</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalSt}</p>
          <p className="text-xs text-muted-foreground">Scari</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalAptOnly}</p>
          <p className="text-xs text-muted-foreground">Apartamente</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-xl font-bold">{totalBoxes + totalParking}</p>
          <p className="text-xs text-muted-foreground">Boxe / Parcare</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Structura Completa</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-1 sm:px-4">
          {federations?.map(fed => {
            const fedAssocs = associations?.filter(a => a.federationId === fed.id) || [];
            return (
              <TreeNode key={fed.id} label={fed.name} icon={Network} level={0} badge={`${fedAssocs.length} asociatii`} defaultOpen={true}>
                {fedAssocs.map(assoc => {
                  const assocBlds = buildings?.filter(b => b.associationId === assoc.id) || [];
                  return (
                    <TreeNode key={assoc.id} label={assoc.name} icon={Users} level={1} badge={`${assocBlds.length} blocuri`} subtitle={assoc.cui ? `CUI: ${assoc.cui}` : undefined}>
                      {assocBlds.map(bld => {
                        const bldSts = staircases?.filter(s => s.buildingId === bld.id) || [];
                        return (
                          <TreeNode key={bld.id} label={bld.name} icon={Building2} level={2} badge={`${bldSts.length} scari`} subtitle={bld.address || undefined}>
                            {bldSts.map(st => {
                              const stApts = apartments?.filter(a => a.staircaseId === st.id) || [];
                              const stFloors = Array.from(new Set(stApts.map(a => a.floor))).sort((a, b) => b - a);
                              return (
                                <TreeNode key={st.id} label={st.name} icon={ArrowUpDown} level={3} badge={`${stApts.length} unitati`}>
                                  {stFloors.map(floor => {
                                    const floorUnits = stApts.filter(a => a.floor === floor);
                                    return (
                                      <TreeNode key={floor} label={getFloorLabel(floor)} icon={Layers} level={4} badge={`${floorUnits.length}`}>
                                        {floorUnits.map(unit => {
                                          const uType = (unit.unitType || "apartment") as UnitType;
                                          const UIcon = UNIT_TYPE_ICONS[uType] || Home;
                                          const typeLabel = UNIT_TYPE_LABELS[uType] || "Apt";
                                          return (
                                            <TreeNode
                                              key={unit.id}
                                              label={`${typeLabel} ${unit.number}`}
                                              icon={UIcon}
                                              level={5}
                                              isLeaf
                                              subtitle={unit.ownerName || undefined}
                                              badge={unit.surface ? `${unit.surface} mp` : undefined}
                                              badgeVariant="outline"
                                            />
                                          );
                                        })}
                                      </TreeNode>
                                    );
                                  })}
                                </TreeNode>
                              );
                            })}
                          </TreeNode>
                        );
                      })}
                    </TreeNode>
                  );
                })}
              </TreeNode>
            );
          })}

          {independentAssociations.length > 0 && (
            <TreeNode label="Asociatii Independente" icon={Users} level={0} badge={`${independentAssociations.length}`} defaultOpen={true}>
              {independentAssociations.map(assoc => {
                const assocBlds = buildings?.filter(b => b.associationId === assoc.id) || [];
                return (
                  <TreeNode key={assoc.id} label={assoc.name} icon={Users} level={1} badge={`${assocBlds.length} blocuri`} subtitle={assoc.cui ? `CUI: ${assoc.cui}` : undefined}>
                    {assocBlds.map(bld => {
                      const bldSts = staircases?.filter(s => s.buildingId === bld.id) || [];
                      return (
                        <TreeNode key={bld.id} label={bld.name} icon={Building2} level={2} badge={`${bldSts.length} scari`} subtitle={bld.address || undefined}>
                          {bldSts.map(st => {
                            const stApts = apartments?.filter(a => a.staircaseId === st.id) || [];
                            const stFloors = Array.from(new Set(stApts.map(a => a.floor))).sort((a, b) => b - a);
                            return (
                              <TreeNode key={st.id} label={st.name} icon={ArrowUpDown} level={3} badge={`${stApts.length} unitati`}>
                                {stFloors.map(floor => {
                                  const floorUnits = stApts.filter(a => a.floor === floor);
                                  return (
                                    <TreeNode key={floor} label={getFloorLabel(floor)} icon={Layers} level={4} badge={`${floorUnits.length}`}>
                                      {floorUnits.map(unit => {
                                        const uType = (unit.unitType || "apartment") as UnitType;
                                        const UIcon = UNIT_TYPE_ICONS[uType] || Home;
                                        const typeLabel = UNIT_TYPE_LABELS[uType] || "Apt";
                                        return (
                                          <TreeNode
                                            key={unit.id}
                                            label={`${typeLabel} ${unit.number}`}
                                            icon={UIcon}
                                            level={5}
                                            isLeaf
                                            subtitle={unit.ownerName || undefined}
                                            badge={unit.surface ? `${unit.surface} mp` : undefined}
                                            badgeVariant="outline"
                                          />
                                        );
                                      })}
                                    </TreeNode>
                                  );
                                })}
                              </TreeNode>
                            );
                          })}
                        </TreeNode>
                      );
                    })}
                  </TreeNode>
                );
              })}
            </TreeNode>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
