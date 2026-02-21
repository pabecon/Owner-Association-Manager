import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, Users, Building2, ArrowUpDown, Layers, Home, Car, Package, ChevronDown, ChevronRight, Plus, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import type { Federation, Association, Building, Staircase, Apartment } from "@shared/schema";
import { UNIT_TYPE_LABELS, type UnitType } from "@shared/schema";
import { AddEntityDialog } from "@/components/add-entity-dialog";

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
  onAdd?: () => void;
  onPortal?: () => void;
}

function TreeNode({ label, icon: Icon, children, badge, badgeVariant = "secondary", level, defaultOpen = false, isLeaf = false, subtitle, onAdd, onPortal }: TreeNodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!children;
  const indentPx = level * 24;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md group ${hasChildren && !isLeaf ? "cursor-pointer hover-elevate" : ""}`}
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
        {onPortal && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 invisible group-hover:visible"
            onClick={e => { e.stopPropagation(); onPortal(); }}
            data-testid={`button-portal-${label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Deschide
          </Button>
        )}
        {onAdd && (
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 shrink-0 invisible group-hover:visible"
            onClick={e => { e.stopPropagation(); onAdd(); }}
            data-testid={`button-add-in-${label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        )}
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

type EntityLevel = "federation" | "association" | "building" | "staircase" | "apartment";

interface AddDialogState {
  open: boolean;
  level: EntityLevel;
  parentId?: string;
  parentName?: string;
}

export default function HierarchyTree() {
  const [, navigate] = useLocation();
  const { data: federations, isLoading: lf } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });
  const { data: associations, isLoading: la } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: buildings, isLoading: lb } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: staircases, isLoading: ls } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });
  const { data: apartments, isLoading: lap } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });

  const [addDialog, setAddDialog] = useState<AddDialogState>({ open: false, level: "federation" });

  const isLoading = lf || la || lb || ls || lap;

  const independentAssociations = associations?.filter(a => !a.federationId) || [];

  const totalFed = federations?.length || 0;
  const totalAssoc = associations?.length || 0;
  const totalBld = buildings?.length || 0;
  const totalSt = staircases?.length || 0;
  const totalAptOnly = apartments?.filter(a => (a.unitType || "apartment") === "apartment").length || 0;
  const totalBoxes = apartments?.filter(a => a.unitType === "box").length || 0;
  const totalParking = apartments?.filter(a => a.unitType === "parking").length || 0;

  const openAdd = (level: EntityLevel, parentId?: string, parentName?: string) => {
    setAddDialog({ open: true, level, parentId, parentName });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 pb-0 space-y-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Infografie Ierarhie</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Vizualizare arborescenta completa</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 pt-3">
          <Card><CardContent className="p-3 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </CardContent></Card>
        </div>
      </div>
    );
  }

  const renderBuildingSubtree = (bld: Building) => {
    const bldSts = staircases?.filter(s => s.buildingId === bld.id) || [];
    return (
      <TreeNode
        key={bld.id}
        label={bld.name}
        icon={Building2}
        level={2}
        badge={`${bldSts.length} scari`}
        subtitle={bld.address || undefined}
        onAdd={() => openAdd("staircase", bld.id, bld.name)}
      >
        {bldSts.map(st => {
          const stApts = apartments?.filter(a => a.staircaseId === st.id) || [];
          const stFloors = Array.from(new Set(stApts.map(a => a.floor))).sort((a, b) => b - a);
          return (
            <TreeNode
              key={st.id}
              label={st.name}
              icon={ArrowUpDown}
              level={3}
              badge={`${stApts.length} unitati`}
              onAdd={() => openAdd("apartment", st.id, st.name)}
            >
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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-tree-title">Infografie Ierarhie</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Vizualizare arborescenta completa a structurii</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => openAdd("federation")} data-testid="button-add-federation">
              <Plus className="w-4 h-4 mr-1.5" />Federatie
            </Button>
            <Button size="sm" variant="outline" onClick={() => openAdd("association")} data-testid="button-add-association">
              <Plus className="w-4 h-4 mr-1.5" />Asociatie
            </Button>
            <Button size="sm" variant="outline" onClick={() => openAdd("building")} data-testid="button-add-building">
              <Plus className="w-4 h-4 mr-1.5" />Bloc
            </Button>
            <Button size="sm" variant="outline" onClick={() => openAdd("staircase")} data-testid="button-add-staircase">
              <Plus className="w-4 h-4 mr-1.5" />Scara
            </Button>
            <Button size="sm" variant="outline" onClick={() => openAdd("apartment")} data-testid="button-add-apartment">
              <Plus className="w-4 h-4 mr-1.5" />Unitate
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-5xl mx-auto space-y-3">
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
                  <TreeNode
                    key={fed.id}
                    label={fed.name}
                    icon={Network}
                    level={0}
                    badge={`${fedAssocs.length} asociatii`}
                    defaultOpen={true}
                    onAdd={() => openAdd("association", fed.id, fed.name)}
                  >
                    {fedAssocs.map(assoc => {
                      const assocBlds = buildings?.filter(b => b.associationId === assoc.id) || [];
                      return (
                        <TreeNode
                          key={assoc.id}
                          label={assoc.name}
                          icon={Users}
                          level={1}
                          badge={`${assocBlds.length} blocuri`}
                          subtitle={assoc.cui ? `CUI: ${assoc.cui}` : undefined}
                          onAdd={() => openAdd("building", assoc.id, assoc.name)}
                          onPortal={() => navigate(`/asociatie/${assoc.id}`)}
                        >
                          {assocBlds.map(bld => renderBuildingSubtree(bld))}
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
                      <TreeNode
                        key={assoc.id}
                        label={assoc.name}
                        icon={Users}
                        level={1}
                        badge={`${assocBlds.length} blocuri`}
                        subtitle={assoc.cui ? `CUI: ${assoc.cui}` : undefined}
                        onAdd={() => openAdd("building", assoc.id, assoc.name)}
                        onPortal={() => navigate(`/asociatie/${assoc.id}`)}
                      >
                        {assocBlds.map(bld => renderBuildingSubtree(bld))}
                      </TreeNode>
                    );
                  })}
                </TreeNode>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddEntityDialog
        open={addDialog.open}
        onOpenChange={open => setAddDialog(prev => ({ ...prev, open }))}
        level={addDialog.level}
        parentId={addDialog.parentId}
        parentName={addDialog.parentName}
        federations={federations}
        associations={associations}
        buildings={buildings}
        staircases={staircases}
      />
    </div>
  );
}
