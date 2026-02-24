import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UNIT_TYPE_LABELS } from "@shared/schema";
import type { Federation } from "@shared/schema";
import { AddressFields as AddressFieldsComponent, composeAddress } from "@/components/address-fields";
import {
  ChevronRight, ChevronLeft, Building2, ArrowUpDown, Layers, Home, Plus, Trash2, Loader2, Check
} from "lucide-react";

interface WizardUnit {
  number: string;
  unitType: string;
  floor: number;
}

interface WizardStaircase {
  name: string;
  floors: number;
  elevators: number;
  units: WizardUnit[];
}

interface WizardBuilding {
  name: string;
  staircases: WizardStaircase[];
}

interface AddressFields {
  streetType: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  county: string;
  sector: string;
}

interface AssociationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  federationId?: string;
  federations?: Federation[];
}

type WizardStep = "association" | "buildings" | "staircases" | "floors" | "units" | "summary";

const STEPS: WizardStep[] = ["association", "buildings", "staircases", "floors", "units", "summary"];
const STEP_LABELS: Record<WizardStep, string> = {
  association: "Asociatie",
  buildings: "Blocuri",
  staircases: "Scari",
  floors: "Etaje",
  units: "Unitati",
  summary: "Sumar",
};


export function AssociationWizard({ open, onOpenChange, federationId, federations }: AssociationWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>("association");
  const [isSaving, setIsSaving] = useState(false);

  const [assocName, setAssocName] = useState("");
  const [assocCui, setAssocCui] = useState("");
  const [assocFedId, setAssocFedId] = useState(federationId || "");
  const [addr, setAddr] = useState<AddressFields>({
    streetType: "", streetName: "", streetNumber: "",
    postalCode: "", city: "", county: "", sector: "",
  });

  const [buildingCount, setBuildingCount] = useState("");
  const [buildings, setBuildings] = useState<WizardBuilding[]>([]);
  const [currentBldIdx, setCurrentBldIdx] = useState(0);

  const stepIdx = STEPS.indexOf(step);

  useEffect(() => {
    if (open) {
      setAssocFedId(federationId || "");
    }
  }, [open, federationId]);

  const resetAll = useCallback(() => {
    setStep("association");
    setAssocName("");
    setAssocCui("");
    setAssocFedId(federationId || "");
    setAddr({ streetType: "", streetName: "", streetNumber: "", postalCode: "", city: "", county: "", sector: "" });
    setBuildingCount("");
    setBuildings([]);
    setCurrentBldIdx(0);
    setIsSaving(false);
  }, [federationId]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetAll, 200);
  };

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const updateAddr = (field: keyof AddressFields, value: string) => {
    setAddr(prev => ({ ...prev, [field]: value }));
  };

  const batchUpdateAddr = (updates: Partial<AddressFields>) => {
    setAddr(prev => ({ ...prev, ...updates }));
  };

  const canGoNext = (): boolean => {
    switch (step) {
      case "association":
        return !!assocName.trim();
      case "buildings":
        return buildings.length > 0 && buildings.every(b => b.name.trim());
      case "staircases":
        return buildings.every(b => b.staircases.length > 0 && b.staircases.every(s => s.name.trim()));
      case "floors":
        return buildings.every(b => b.staircases.every(s => s.floors >= 0));
      case "units":
        return true;
      default:
        return true;
    }
  };

  const handleBuildingCountConfirm = () => {
    const n = parseInt(buildingCount) || 0;
    if (n <= 0) return;
    setBuildings(Array.from({ length: n }, (_, i) => ({
      name: `Bloc ${i + 1}`,
      staircases: [],
    })));
  };

  const updateBuildingName = (idx: number, name: string) => {
    setBuildings(prev => prev.map((b, i) => i === idx ? { ...b, name } : b));
  };

  const setStaircaseCount = (bldIdx: number, countStr: string) => {
    const n = parseInt(countStr) || 0;
    if (n < 0) return;
    setBuildings(prev => prev.map((b, i) => {
      if (i !== bldIdx) return b;
      const existing = b.staircases;
      if (n > existing.length) {
        return {
          ...b,
          staircases: [
            ...existing,
            ...Array.from({ length: n - existing.length }, (_, j) => ({
              name: `Scara ${String.fromCharCode(65 + existing.length + j)}`,
              floors: 0,
              elevators: 0,
              units: [],
            })),
          ],
        };
      }
      return { ...b, staircases: existing.slice(0, n) };
    }));
  };

  const updateStaircaseName = (bldIdx: number, stIdx: number, name: string) => {
    setBuildings(prev => prev.map((b, i) => {
      if (i !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, j) => j === stIdx ? { ...s, name } : s),
      };
    }));
  };

  const updateStaircaseElevators = (bldIdx: number, stIdx: number, elevators: number) => {
    setBuildings(prev => prev.map((b, i) => {
      if (i !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, j) => j === stIdx ? { ...s, elevators: Math.max(0, elevators) } : s),
      };
    }));
  };

  const updateStaircaseFloors = (bldIdx: number, stIdx: number, floors: number) => {
    setBuildings(prev => prev.map((b, i) => {
      if (i !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, j) => {
          if (j !== stIdx) return s;
          const existingUnits = s.units.filter(u => u.floor <= floors && u.floor >= 0);
          return { ...s, floors, units: existingUnits };
        }),
      };
    }));
  };

  const setUnitsForFloor = (bldIdx: number, stIdx: number, floor: number, countStr: string) => {
    const n = parseInt(countStr) || 0;
    if (n < 0) return;
    setBuildings(prev => prev.map((b, bi) => {
      if (bi !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, si) => {
          if (si !== stIdx) return s;
          const otherUnits = s.units.filter(u => u.floor !== floor);
          const floorUnits = Array.from({ length: n }, (_, i) => ({
            number: `${floor === 0 ? "P" : floor}${String(i + 1).padStart(2, "0")}`,
            unitType: "apartment",
            floor,
          }));
          return { ...s, units: [...otherUnits, ...floorUnits] };
        }),
      };
    }));
  };

  const updateUnitNumber = (bldIdx: number, stIdx: number, floor: number, unitIdx: number, number: string) => {
    setBuildings(prev => prev.map((b, bi) => {
      if (bi !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, si) => {
          if (si !== stIdx) return s;
          const floorUnits = s.units.filter(u => u.floor === floor);
          const otherUnits = s.units.filter(u => u.floor !== floor);
          floorUnits[unitIdx] = { ...floorUnits[unitIdx], number };
          return { ...s, units: [...otherUnits, ...floorUnits] };
        }),
      };
    }));
  };

  const updateUnitType = (bldIdx: number, stIdx: number, floor: number, unitIdx: number, unitType: string) => {
    setBuildings(prev => prev.map((b, bi) => {
      if (bi !== bldIdx) return b;
      return {
        ...b,
        staircases: b.staircases.map((s, si) => {
          if (si !== stIdx) return s;
          const floorUnits = s.units.filter(u => u.floor === floor);
          const otherUnits = s.units.filter(u => u.floor !== floor);
          floorUnits[unitIdx] = { ...floorUnits[unitIdx], unitType };
          return { ...s, units: [...otherUnits, ...floorUnits] };
        }),
      };
    }));
  };

  const getTotalUnits = () => buildings.reduce((sum, b) => sum + b.staircases.reduce((s2, st) => s2 + st.units.length, 0), 0);
  const getTotalStaircases = () => buildings.reduce((sum, b) => sum + b.staircases.length, 0);
  const getTotalElevators = () => buildings.reduce((sum, b) => sum + b.staircases.reduce((s2, st) => s2 + (st.elevators || 0), 0), 0);

  const composedAddress = composeAddress(addr);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/association-wizard", {
        association: {
          name: assocName.trim(),
          address: composedAddress || null,
          streetType: addr.streetType || null,
          streetName: addr.streetName?.trim() || null,
          streetNumber: addr.streetNumber?.trim() || null,
          postalCode: addr.postalCode?.trim() || null,
          city: addr.city?.trim() || null,
          county: addr.county?.trim() || null,
          sector: addr.sector || null,
          cui: assocCui.trim() || null,
          federationId: assocFedId || null,
        },
        buildings: buildings.map(b => ({
          name: b.name,
          staircases: b.staircases.map(s => ({
            name: s.name,
            floors: s.floors,
            elevators: s.elevators || 0,
            units: s.units.map(u => ({
              number: u.number,
              unitType: u.unitType,
              floor: u.floor,
            })),
          })),
        })),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });

      toast({ title: "Asociatia a fost creata cu succes", description: `${buildings.length} blocuri, ${getTotalStaircases()} scari, ${getTotalUnits()} unitati` });
      handleClose();
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message || "Nu s-a putut crea asociatia", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const getFloorLabel = (floor: number) => {
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="wizard-dialog">
        <DialogHeader>
          <DialogTitle className="text-base" data-testid="wizard-title">Wizard Creare Asociatie</DialogTitle>
          <DialogDescription className="text-xs">
            Pasul {stepIdx + 1} din {STEPS.length}: {STEP_LABELS[step]}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1 mb-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                i < stepIdx ? "bg-primary text-primary-foreground" :
                i === stepIdx ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < stepIdx ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-4 h-0.5 ${i < stepIdx ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === "association" && (
          <div className="space-y-3" data-testid="step-association">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nume asociatie *</Label>
              <Input
                value={assocName}
                onChange={e => setAssocName(e.target.value)}
                placeholder="ex: Asociatia de Proprietari Bloc A1-A3"
                className="h-8 text-sm"
                data-testid="input-wizard-assoc-name"
              />
            </div>

            <AddressFieldsComponent
              values={addr}
              onChange={updateAddr}
              onBatchChange={batchUpdateAddr}
              idPrefix="wizard-"
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">CUI</Label>
              <Input
                value={assocCui}
                onChange={e => setAssocCui(e.target.value)}
                placeholder="ex: RO12345678"
                className="h-8 text-sm"
                data-testid="input-wizard-assoc-cui"
              />
            </div>

            {federations && federations.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Federatie (optional)</Label>
                <Select value={assocFedId || "__none__"} onValueChange={v => setAssocFedId(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="h-8 text-sm" data-testid="select-wizard-federation">
                    <SelectValue placeholder="Fara federatie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Fara federatie</SelectItem>
                    {federations.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === "buildings" && (
          <div className="space-y-3" data-testid="step-buildings">
            {buildings.length === 0 ? (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Cate blocuri are asociatia "{assocName}"?</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={buildingCount}
                    onChange={e => setBuildingCount(e.target.value)}
                    placeholder="Numar blocuri"
                    className="h-8 text-sm w-32"
                    data-testid="input-wizard-building-count"
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={handleBuildingCountConfirm}
                    disabled={!buildingCount || parseInt(buildingCount) <= 0}
                    data-testid="button-wizard-building-confirm"
                  >
                    Continua
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Denumire blocuri ({buildings.length})</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => { setBuildings([]); setBuildingCount(""); }}
                    data-testid="button-wizard-reset-buildings"
                  >
                    Schimba numarul
                  </Button>
                </div>
                {buildings.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <Input
                      value={b.name}
                      onChange={e => updateBuildingName(i, e.target.value)}
                      className="h-7 text-xs"
                      data-testid={`input-wizard-building-name-${i}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "staircases" && (
          <div className="space-y-3" data-testid="step-staircases">
            <Label className="text-xs font-medium">Cate scari si ascensoare are fiecare bloc?</Label>
            {buildings.map((b, bi) => (
              <Card key={bi} className="overflow-hidden">
                <CardContent className="p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-medium">{b.name}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Label className="text-[10px] text-muted-foreground">Scari:</Label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={b.staircases.length || ""}
                        onChange={e => setStaircaseCount(bi, e.target.value)}
                        className="h-6 text-xs w-16"
                        data-testid={`input-wizard-staircase-count-${bi}`}
                      />
                    </div>
                  </div>
                  {b.staircases.length > 0 && (
                    <div className="pl-5 space-y-1">
                      {b.staircases.map((s, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0" />
                          <Input
                            value={s.name}
                            onChange={e => updateStaircaseName(bi, si, e.target.value)}
                            className="h-6 text-xs flex-1"
                            data-testid={`input-wizard-staircase-name-${bi}-${si}`}
                          />
                          <Label className="text-[10px] text-muted-foreground whitespace-nowrap">Ascensoare:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={s.elevators.toString()}
                            onChange={e => updateStaircaseElevators(bi, si, parseInt(e.target.value) || 0)}
                            className="h-6 text-xs w-14"
                            data-testid={`input-wizard-elevators-${bi}-${si}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "floors" && (
          <div className="space-y-3" data-testid="step-floors">
            <Label className="text-xs font-medium">Cate etaje are fiecare scara? (parterul se adauga automat, 0 = doar parter)</Label>
            {buildings.map((b, bi) => (
              <Card key={bi} className="overflow-hidden">
                <CardContent className="p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-medium">{b.name}</span>
                  </div>
                  <div className="pl-5 space-y-1">
                    {b.staircases.map((s, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-xs w-24 truncate">{s.name}</span>
                        <Label className="text-[10px] text-muted-foreground">Etaje:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={s.floors.toString()}
                          onChange={e => updateStaircaseFloors(bi, si, Math.max(0, parseInt(e.target.value) || 0))}
                          className="h-6 text-xs w-16"
                          data-testid={`input-wizard-floors-${bi}-${si}`}
                        />
                        {s.floors > 0 && (
                          <Badge variant="outline" className="text-[9px] py-0 shrink-0">
                            Parter + {s.floors} etaje
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "units" && (
          <div className="space-y-3" data-testid="step-units">
            <Label className="text-xs font-medium">Cate unitati are fiecare etaj?</Label>
            {buildings.length > 1 && (
              <div className="flex items-center gap-1 flex-wrap">
                {buildings.map((b, bi) => (
                  <Button
                    key={bi}
                    variant={currentBldIdx === bi ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => setCurrentBldIdx(bi)}
                    data-testid={`button-wizard-unit-tab-${bi}`}
                  >
                    <Building2 className="w-3 h-3 mr-0.5" />{b.name}
                    {b.staircases.reduce((s, st) => s + st.units.length, 0) > 0 && (
                      <Badge variant="secondary" className="ml-1 text-[8px] py-0 px-1">
                        {b.staircases.reduce((s, st) => s + st.units.length, 0)}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {buildings[currentBldIdx] && (
              <div className="space-y-3">
                {buildings.length > 1 && (
                  <div className="text-xs font-medium text-primary flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {buildings[currentBldIdx].name}
                  </div>
                )}
                {buildings[currentBldIdx].staircases.map((st, si) => (
                  <Card key={`${currentBldIdx}-${si}`} className="overflow-hidden">
                    <CardContent className="p-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-medium">{st.name}</span>
                        <Badge variant="secondary" className="text-[9px] py-0">{st.units.length} unitati</Badge>
                      </div>
                      <div className="pl-5 space-y-2">
                        {Array.from({ length: (st.floors || 0) + 1 }, (_, f) => f).map(floor => {
                          const floorUnits = st.units.filter(u => u.floor === floor);
                          return (
                            <div key={floor} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Layers className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span className="text-[11px] font-medium w-16">{getFloorLabel(floor)}</span>
                                <Input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={floorUnits.length || ""}
                                  onChange={e => setUnitsForFloor(currentBldIdx, si, floor, e.target.value)}
                                  className="h-6 text-xs w-14"
                                  placeholder="0"
                                  data-testid={`input-wizard-unit-count-${currentBldIdx}-${si}-${floor}`}
                                />
                                <span className="text-[10px] text-muted-foreground">unitati</span>
                              </div>
                              {floorUnits.length > 0 && (
                                <div className="pl-8 grid grid-cols-2 sm:grid-cols-3 gap-1">
                                  {floorUnits.map((u, ui) => (
                                    <div key={ui} className="flex items-center gap-1">
                                      <Input
                                        value={u.number}
                                        onChange={e => updateUnitNumber(currentBldIdx, si, floor, ui, e.target.value)}
                                        className="h-6 text-[11px] flex-1"
                                        data-testid={`input-wizard-unit-number-${currentBldIdx}-${si}-${floor}-${ui}`}
                                      />
                                      <Select value={u.unitType} onValueChange={v => updateUnitType(currentBldIdx, si, floor, ui, v)}>
                                        <SelectTrigger className="h-6 text-[10px] w-20" data-testid={`select-wizard-unit-type-${currentBldIdx}-${si}-${floor}-${ui}`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.entries(UNIT_TYPE_LABELS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-3" data-testid="step-summary">
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="text-xs font-medium">Asociatia: {assocName}</div>
                {composedAddress && <div className="text-[11px] text-muted-foreground">Adresa: {composedAddress}</div>}
                {assocCui && <div className="text-[11px] text-muted-foreground">CUI: {assocCui}</div>}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]"><Building2 className="w-3 h-3 mr-0.5" />{buildings.length} blocuri</Badge>
                  <Badge variant="secondary" className="text-[10px]"><ArrowUpDown className="w-3 h-3 mr-0.5" />{getTotalStaircases()} scari</Badge>
                  <Badge variant="secondary" className="text-[10px]"><Home className="w-3 h-3 mr-0.5" />{getTotalUnits()} unitati</Badge>
                  {getTotalElevators() > 0 && (
                    <Badge variant="secondary" className="text-[10px]">{getTotalElevators()} ascensoare</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {buildings.map((b, bi) => (
              <Card key={bi} className="overflow-hidden">
                <CardContent className="p-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-medium">{b.name}</span>
                    <Badge variant="outline" className="text-[9px] py-0">{b.staircases.length} scari</Badge>
                  </div>
                  {b.staircases.map((s, si) => (
                    <div key={si} className="pl-5 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-[11px]">{s.name}</span>
                        <Badge variant="outline" className="text-[9px] py-0">
                          {s.floors} etaje, {s.units.length} unitati
                          {s.elevators > 0 && `, ${s.elevators} asc.`}
                        </Badge>
                      </div>
                      {s.units.length > 0 && (
                        <div className="pl-5 flex items-center gap-1 flex-wrap">
                          {s.units.map((u, ui) => (
                            <Badge key={ui} variant="outline" className="text-[9px] py-0">
                              {UNIT_TYPE_LABELS[u.unitType as keyof typeof UNIT_TYPE_LABELS] || "Apt"} {u.number}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={step === "association" ? handleClose : goBack}
            disabled={isSaving}
            data-testid="button-wizard-back"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
            {step === "association" ? "Anuleaza" : "Inapoi"}
          </Button>

          {step === "summary" ? (
            <Button
              size="sm"
              className="h-8"
              onClick={handleSave}
              disabled={isSaving}
              data-testid="button-wizard-save"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-0.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-0.5" />}
              {isSaving ? "Se creeaza..." : "Creeaza Asociatia"}
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-8"
              onClick={goNext}
              disabled={!canGoNext()}
              data-testid="button-wizard-next"
            >
              Continua
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
