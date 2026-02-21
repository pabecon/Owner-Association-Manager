import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Network, Users, Building2, ArrowUpDown, Layers, Home, Car, Package, ChevronDown, ChevronRight, Plus, ExternalLink, List, Scale, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import type { Federation, Association, Building, Staircase, Apartment } from "@shared/schema";
import { UNIT_TYPE_LABELS, type UnitType } from "@shared/schema";
import { AddEntityDialog } from "@/components/add-entity-dialog";
import { ExcelImportDialog } from "@/components/excel-import-dialog";
import { LEGISLATION_ITEMS } from "@/lib/legislation-data";

interface ListConfig {
  key: string;
  label: string;
}

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Package,
  parking: Car,
};

interface StatBadge {
  label: string;
  icon?: any;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

interface TreeNodeProps {
  label: string;
  icon: any;
  children?: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  stats?: StatBadge[];
  level: number;
  defaultOpen?: boolean;
  isLeaf?: boolean;
  subtitle?: string;
  onAdd?: () => void;
  onPortal?: () => void;
}

function TreeNode({ label, icon: Icon, children, badge, badgeVariant = "secondary", stats, level, defaultOpen = false, isLeaf = false, subtitle, onAdd, onPortal }: TreeNodeProps) {
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isLeaf ? "text-muted-foreground" : "font-medium"} truncate`}>{label}</span>
            {subtitle && <span className="text-xs text-muted-foreground hidden sm:inline">{subtitle}</span>}
          </div>
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {stats.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <Badge key={i} variant={s.variant || "outline"} className="text-[9px] py-0 gap-0.5">
                    {SIcon && <SIcon className="w-2.5 h-2.5" />}
                    {s.label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        {badge && <Badge variant={badgeVariant} className="text-[10px] shrink-0">{badge}</Badge>}
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
  const { data: listConfigs } = useQuery<ListConfig[]>({ queryKey: ["/api/liste-config"] });

  const [addDialog, setAddDialog] = useState<AddDialogState>({ open: false, level: "federation" });
  const [importOpen, setImportOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);
  const [legislatieOpen, setLegistatieOpen] = useState(false);

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

  const getAssocStats = (assocId: string): StatBadge[] => {
    const assocBlds = buildings?.filter(b => b.associationId === assocId) || [];
    const bldIds = assocBlds.map(b => b.id);
    const assocSts = staircases?.filter(s => bldIds.includes(s.buildingId)) || [];
    const stIds = assocSts.map(s => s.id);
    const assocApts = apartments?.filter(a => stIds.includes(a.staircaseId)) || [];
    const aptCount = assocApts.filter(a => !a.unitType || a.unitType === "apartment").length;
    const boxCount = assocApts.filter(a => a.unitType === "box").length;
    const parkCount = assocApts.filter(a => a.unitType === "parking").length;
    const stats: StatBadge[] = [];
    if (assocBlds.length > 0) stats.push({ label: `${assocBlds.length} blocuri`, icon: Building2, variant: "secondary" });
    if (assocSts.length > 0) stats.push({ label: `${assocSts.length} scari`, icon: ArrowUpDown, variant: "outline" });
    if (aptCount > 0) stats.push({ label: `${aptCount} apt.`, icon: Home, variant: "outline" });
    if (boxCount > 0) stats.push({ label: `${boxCount} boxe`, icon: Package, variant: "outline" });
    if (parkCount > 0) stats.push({ label: `${parkCount} parking`, icon: Car, variant: "outline" });
    return stats;
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
            <Button size="sm" onClick={() => setImportOpen(true)} data-testid="button-import-excel">
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />Import Excel
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
                          stats={getAssocStats(assoc.id)}
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
                        stats={getAssocStats(assoc.id)}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <Collapsible open={listsOpen} onOpenChange={setListsOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <List className="w-4 h-4 text-primary" />
                        Liste Generale
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{listConfigs?.length || 0} liste</Badge>
                        {listsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {(listConfigs || []).map(config => (
                        <Link key={config.key} href={`/liste-generale/${config.key}`}>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors text-xs" data-testid={`link-lista-${config.key}`}>
                            <List className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate">{config.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <Card>
              <Collapsible open={legislatieOpen} onOpenChange={setLegistatieOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-primary" />
                        Legislatie
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{LEGISLATION_ITEMS.length} legi</Badge>
                        {legislatieOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {LEGISLATION_ITEMS.map(law => (
                        <Link key={law.id} href={`/legislatie/${law.id}`}>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors text-xs" data-testid={`link-law-${law.id}`}>
                            <Scale className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="flex-1 truncate">{law.shortTitle}</span>
                            <Badge
                              variant={law.status === "in_vigoare" ? "default" : "secondary"}
                              className="text-[9px] px-1 py-0 shrink-0"
                            >
                              {law.status === "in_vigoare" ? "Vigoare" : "Abrogata"}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
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

      <ExcelImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
