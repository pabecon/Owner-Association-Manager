import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Network, Users, Building2, ArrowUpDown, Layers, Home, ChevronRight,
  MapPin, Phone, Mail, User, FileText, Car, Package, Plus
} from "lucide-react";
import { DocumentManager } from "@/components/document-manager";
import { AddEntityDialog } from "@/components/add-entity-dialog";
import type { Federation, Association, Building, Staircase, Apartment } from "@shared/schema";
import { UNIT_TYPE_LABELS, type UnitType } from "@shared/schema";

interface BreadcrumbItem {
  label: string;
  level: string;
  id?: string;
}

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Package,
  parking: Car,
};

export default function Explorer() {
  const [selectedFederation, setSelectedFederation] = useState<Federation | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedStaircase, setSelectedStaircase] = useState<Staircase | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [showIndependent, setShowIndependent] = useState(false);

  const { data: federations, isLoading: loadingFed } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });
  const { data: associations, isLoading: loadingAssoc } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: buildings, isLoading: loadingBld } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: staircases, isLoading: loadingSt } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });
  const { data: apartments, isLoading: loadingApt } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Explorator", level: "root" }];
  if (showIndependent) {
    breadcrumbs.push({ label: "Asociatii Independente", level: "independent" });
  }
  if (selectedFederation) {
    breadcrumbs.push({ label: selectedFederation.name, level: "federation", id: selectedFederation.id });
  }
  if (selectedAssociation) {
    breadcrumbs.push({ label: selectedAssociation.name, level: "association", id: selectedAssociation.id });
  }
  if (selectedBuilding) {
    breadcrumbs.push({ label: selectedBuilding.name, level: "building", id: selectedBuilding.id });
  }
  if (selectedStaircase) {
    breadcrumbs.push({ label: selectedStaircase.name, level: "staircase", id: selectedStaircase.id });
  }
  if (selectedFloor !== null) {
    breadcrumbs.push({ label: selectedFloor < 0 ? `Subsol ${Math.abs(selectedFloor)}` : selectedFloor === 0 ? "Parter" : `Etaj ${selectedFloor}`, level: "floor" });
  }

  const handleBreadcrumbClick = (index: number) => {
    const item = breadcrumbs[index];
    if (item.level === "root") {
      setSelectedFederation(null);
      setSelectedAssociation(null);
      setSelectedBuilding(null);
      setSelectedStaircase(null);
      setSelectedFloor(null);
      setShowIndependent(false);
    } else if (item.level === "independent") {
      setSelectedAssociation(null);
      setSelectedBuilding(null);
      setSelectedStaircase(null);
      setSelectedFloor(null);
    } else if (item.level === "federation") {
      setSelectedAssociation(null);
      setSelectedBuilding(null);
      setSelectedStaircase(null);
      setSelectedFloor(null);
    } else if (item.level === "association") {
      setSelectedBuilding(null);
      setSelectedStaircase(null);
      setSelectedFloor(null);
    } else if (item.level === "building") {
      setSelectedStaircase(null);
      setSelectedFloor(null);
    } else if (item.level === "staircase") {
      setSelectedFloor(null);
    }
  };

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addLevel, setAddLevel] = useState<"federation" | "association" | "building" | "staircase" | "apartment">("federation");
  const [addParentId, setAddParentId] = useState<string | undefined>();
  const [addParentName, setAddParentName] = useState<string | undefined>();

  const openAdd = useCallback((level: "federation" | "association" | "building" | "staircase" | "apartment", parentId?: string, parentName?: string) => {
    setAddLevel(level);
    setAddParentId(parentId);
    setAddParentName(parentName);
    setAddDialogOpen(true);
  }, []);

  const independentAssociations = associations?.filter(a => !a.federationId) || [];

  const currentAssociations = selectedFederation
    ? associations?.filter(a => a.federationId === selectedFederation.id) || []
    : showIndependent ? independentAssociations : [];

  const currentBuildings = selectedAssociation
    ? buildings?.filter(b => b.associationId === selectedAssociation.id) || []
    : [];

  const currentStaircases = selectedBuilding
    ? staircases?.filter(s => s.buildingId === selectedBuilding.id) || []
    : [];

  const currentApartments = selectedStaircase
    ? apartments?.filter(a => a.staircaseId === selectedStaircase.id) || []
    : [];

  const floors = Array.from(new Set(currentApartments.map(a => a.floor))).sort((a, b) => b - a);

  const floorUnits = selectedFloor !== null
    ? currentApartments.filter(a => a.floor === selectedFloor)
    : [];

  const getFloorLabel = (floor: number) => {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  };

  const getFloorUnitSummary = (floor: number) => {
    const units = currentApartments.filter(a => a.floor === floor);
    const apts = units.filter(u => (u.unitType || "apartment") === "apartment").length;
    const boxes = units.filter(u => u.unitType === "box").length;
    const parking = units.filter(u => u.unitType === "parking").length;
    const parts: string[] = [];
    if (apts > 0) parts.push(`${apts} ap.`);
    if (boxes > 0) parts.push(`${boxes} boxe`);
    if (parking > 0) parts.push(`${parking} parcare`);
    return parts.join(", ");
  };

  const isLoading = loadingFed || loadingAssoc || loadingBld || loadingSt || loadingApt;

  const currentLevel = selectedFloor !== null ? "floor"
    : selectedStaircase ? "staircase"
    : selectedBuilding ? "building"
    : selectedAssociation ? "association"
    : selectedFederation ? "federation"
    : showIndependent ? "independent"
    : "root";

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight" data-testid="text-explorer-title">Explorator Ierarhie</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Navigheaza prin structura completa a administrarii</p>
        </div>

        <div className="flex items-center gap-1 flex-wrap text-sm" data-testid="breadcrumb-nav">
          {breadcrumbs.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(i)}
                className={i === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
                }
                data-testid={`breadcrumb-${item.level}`}
              >
                {item.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <Card key={i}><CardContent className="p-3 space-y-3"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-full" /></CardContent></Card>
              ))}
            </div>
          ) : (
            <>
              {currentLevel === "root" && (
                <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openAdd("federation")} data-testid="button-explorer-add-federation">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Federatie
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openAdd("association")} data-testid="button-explorer-add-association">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Asociatie
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {federations?.map(fed => (
                    <Card
                      key={fed.id}
                      className="cursor-pointer hover-elevate"
                      onClick={() => { setSelectedFederation(fed); setShowIndependent(false); }}
                      data-testid={`explorer-federation-${fed.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                            <Network className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{fed.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Federatie</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </div>
                        {fed.description && <p className="text-sm text-muted-foreground line-clamp-2">{fed.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {associations?.filter(a => a.federationId === fed.id).length || 0} asociatii
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {independentAssociations.length > 0 && (
                    <Card
                      className="cursor-pointer hover-elevate"
                      onClick={() => setShowIndependent(true)}
                      data-testid="explorer-independent"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted shrink-0">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">Asociatii Independente</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Fara federatie</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {independentAssociations.length} asociatii
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>
                </div>
              )}

              {(currentLevel === "federation" || currentLevel === "independent") && (
                <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openAdd("association", selectedFederation?.id, selectedFederation?.name)} data-testid="button-explorer-add-association-ctx">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Asociatie
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentAssociations.map(assoc => (
                    <Card
                      key={assoc.id}
                      className="cursor-pointer hover-elevate"
                      onClick={() => setSelectedAssociation(assoc)}
                      data-testid={`explorer-association-${assoc.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{assoc.name}</p>
                            {assoc.cui && <p className="text-xs text-muted-foreground mt-0.5">CUI: {assoc.cui}</p>}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </div>
                        {assoc.address && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{assoc.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {buildings?.filter(b => b.associationId === assoc.id).length || 0} blocuri
                          </Badge>
                          {assoc.presidentName && (
                            <Badge variant="outline" className="text-xs">
                              <User className="w-3 h-3 mr-1" />{assoc.presidentName}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {currentAssociations.length === 0 && (
                    <Card><CardContent className="flex flex-col items-center justify-center py-8">
                      <Users className="w-10 h-10 text-muted-foreground/30 mb-2" />
                      <p className="text-muted-foreground text-sm">Nicio asociatie in aceasta categorie</p>
                    </CardContent></Card>
                  )}
                </div>
                </div>
              )}

              {currentLevel === "association" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openAdd("building", selectedAssociation?.id, selectedAssociation?.name)} data-testid="button-explorer-add-building-ctx">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />Bloc
                    </Button>
                  </div>
                  {selectedAssociation && (
                    <Card>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          {selectedAssociation.cui && (
                            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span>CUI: {selectedAssociation.cui}</span></div>
                          )}
                          {selectedAssociation.address && (
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span className="truncate">{selectedAssociation.address}</span></div>
                          )}
                          {selectedAssociation.presidentName && (
                            <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span>Pres.: {selectedAssociation.presidentName}</span></div>
                          )}
                          {selectedAssociation.presidentPhone && (
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span>{selectedAssociation.presidentPhone}</span></div>
                          )}
                          {selectedAssociation.adminName && (
                            <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span>Admin: {selectedAssociation.adminName}</span></div>
                          )}
                          {selectedAssociation.adminPhone && (
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span>{selectedAssociation.adminPhone}</span></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentBuildings.map(bld => (
                      <Card
                        key={bld.id}
                        className="cursor-pointer hover-elevate"
                        onClick={() => setSelectedBuilding(bld)}
                        data-testid={`explorer-building-${bld.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{bld.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="w-3 h-3" /><span className="truncate">{bld.address}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs"><Layers className="w-3 h-3 mr-1" />{bld.floors} etaje</Badge>
                            <Badge variant="secondary" className="text-xs">{bld.totalApartments} unitati</Badge>
                            <Badge variant="outline" className="text-xs">
                              {staircases?.filter(s => s.buildingId === bld.id).length || 0} scari
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {currentBuildings.length === 0 && (
                      <Card><CardContent className="flex flex-col items-center justify-center py-8">
                        <Building2 className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground text-sm">Niciun bloc in aceasta asociatie</p>
                      </CardContent></Card>
                    )}
                  </div>
                </div>
              )}

              {currentLevel === "building" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openAdd("staircase", selectedBuilding?.id, selectedBuilding?.name)} data-testid="button-explorer-add-staircase-ctx">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />Scara
                    </Button>
                  </div>
                  {selectedBuilding && (
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{selectedBuilding.address}</span></div>
                          <Badge variant="secondary" className="text-xs"><Layers className="w-3 h-3 mr-1" />{selectedBuilding.floors} etaje</Badge>
                          <Badge variant="secondary" className="text-xs">{selectedBuilding.totalApartments} unitati</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentStaircases.map(st => {
                      const stApts = apartments?.filter(a => a.staircaseId === st.id) || [];
                      const stFloors = Array.from(new Set(stApts.map(a => a.floor)));
                      return (
                        <Card
                          key={st.id}
                          className="cursor-pointer hover-elevate"
                          onClick={() => setSelectedStaircase(st)}
                          data-testid={`explorer-staircase-${st.id}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                                <ArrowUpDown className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold">{st.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{st.floors} etaje, {st.apartmentsPerFloor} unit./etaj</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">{stApts.length} unitati</Badge>
                              <Badge variant="outline" className="text-xs">{stFloors.length} plante populate</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {currentStaircases.length === 0 && (
                      <Card><CardContent className="flex flex-col items-center justify-center py-8">
                        <ArrowUpDown className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground text-sm">Nicio scara in acest bloc</p>
                      </CardContent></Card>
                    )}
                  </div>
                </div>
              )}

              {currentLevel === "staircase" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openAdd("apartment", selectedStaircase?.id, selectedStaircase?.name)} data-testid="button-explorer-add-apartment-ctx">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />Unitate
                    </Button>
                  </div>
                  {selectedStaircase && (
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          <Badge variant="secondary" className="text-xs"><Layers className="w-3 h-3 mr-1" />{selectedStaircase.floors} etaje</Badge>
                          <Badge variant="secondary" className="text-xs">{selectedStaircase.apartmentsPerFloor} unit./etaj</Badge>
                          <Badge variant="outline" className="text-xs">{currentApartments.length} unitati totale</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {floors.map(floor => {
                      const floorLabel = getFloorLabel(floor);
                      const summary = getFloorUnitSummary(floor);
                      const isNeg = floor < 0;
                      return (
                        <Card
                          key={floor}
                          className="cursor-pointer hover-elevate"
                          onClick={() => setSelectedFloor(floor)}
                          data-testid={`explorer-floor-${floor}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-md shrink-0 ${isNeg ? "bg-muted" : "bg-primary/10"}`}>
                                <Layers className={`w-5 h-5 ${isNeg ? "text-muted-foreground" : "text-primary"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold">{floorLabel}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{summary}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {floors.length === 0 && (
                      <Card><CardContent className="flex flex-col items-center justify-center py-8">
                        <Layers className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground text-sm">Nicio unitate in aceasta scara</p>
                      </CardContent></Card>
                    )}
                  </div>
                </div>
              )}

              {currentLevel === "floor" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {floorUnits.map(unit => {
                      const uType = (unit.unitType || "apartment") as UnitType;
                      const UIcon = UNIT_TYPE_ICONS[uType] || Home;
                      const typeLabel = UNIT_TYPE_LABELS[uType] || "Apartament";
                      return (
                        <Card key={unit.id} data-testid={`explorer-unit-${unit.id}`}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                                <UIcon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold">{typeLabel} {unit.number}</p>
                                {unit.surface && <p className="text-xs text-muted-foreground mt-0.5">{unit.surface} mp</p>}
                              </div>
                            </div>
                            {unit.ownerName && (
                              <div className="flex items-center gap-2 text-sm mb-1">
                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{unit.ownerName}</span>
                              </div>
                            )}
                            {unit.ownerPhone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{unit.ownerPhone}</span>
                              </div>
                            )}
                            {unit.ownerEmail && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate">{unit.ownerEmail}</span>
                              </div>
                            )}
                            <div className="pt-2 border-t mt-2">
                              <DocumentManager entityType="apartment" entityId={unit.id} title="Documente" compact />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {floorUnits.length === 0 && (
                      <Card><CardContent className="flex flex-col items-center justify-center py-8">
                        <Home className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground text-sm">Nicio unitate pe acest nivel</p>
                      </CardContent></Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AddEntityDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        level={addLevel}
        parentId={addParentId}
        parentName={addParentName}
        federations={federations}
        associations={associations}
        buildings={buildings}
        staircases={staircases}
      />
    </div>
  );
}
