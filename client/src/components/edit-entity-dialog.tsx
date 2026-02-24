import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Federation, Association, Building, Staircase, Apartment, UnitRoom } from "@shared/schema";
import { UNIT_TYPE_LABELS } from "@shared/schema";
import { Loader2, Plus, Trash2, Building2, ArrowUpDown, Users, Network, X } from "lucide-react";
import { AddressFields, composeAddress, isBucharestCity } from "@/components/address-fields";

type EntityLevel = "federation" | "association" | "building" | "staircase" | "apartment";

interface EditEntityDialogProps {
  open: boolean;
  onClose: () => void;
  level: EntityLevel;
  entity: any;
  federations?: Federation[];
  associations?: Association[];
  buildings?: Building[];
  staircases?: Staircase[];
}

const LEVEL_LABELS: Record<EntityLevel, string> = {
  federation: "Federatie",
  association: "Asociatie",
  building: "Bloc",
  staircase: "Scara",
  apartment: "Unitate",
};

const LEVEL_ENDPOINTS: Record<EntityLevel, string> = {
  federation: "/api/federations",
  association: "/api/associations",
  building: "/api/buildings",
  staircase: "/api/staircases",
  apartment: "/api/apartments",
};

interface RoomEntry {
  id?: string;
  name: string;
  surface: string;
}

export function EditEntityDialog({
  open,
  onClose,
  level,
  entity,
  federations,
  associations,
  buildings,
  staircases,
}: EditEntityDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [rooms, setRooms] = useState<RoomEntry[]>([]);

  const aptId = level === "apartment" && entity?.id ? entity.id : null;
  const { data: existingRooms } = useQuery<UnitRoom[]>({
    queryKey: ["/api/unit-rooms", aptId],
    enabled: !!aptId && open,
  });

  const hierarchyInfo = useMemo(() => {
    if (level !== "apartment" || !entity) return null;
    const staircase = staircases?.find(s => s.id === entity.staircaseId);
    const building = staircase ? buildings?.find(b => b.id === staircase.buildingId) : null;
    const association = building ? associations?.find(a => a.id === building.associationId) : null;
    const federation = association?.federationId ? federations?.find(f => f.id === association.federationId) : null;
    return { staircase, building, association, federation };
  }, [level, entity, staircases, buildings, associations, federations]);

  const roomsSurfaceSum = useMemo(() => {
    return rooms.reduce((sum, r) => sum + (parseFloat(r.surface) || 0), 0);
  }, [rooms]);

  useEffect(() => {
    if (open && entity) {
      const data: Record<string, string> = {};
      if (level === "federation") {
        data.name = entity.name || "";
        data.description = entity.description || "";
        data.address = entity.address || "";
        data.streetType = entity.streetType || "";
        data.streetName = entity.streetName || "";
        data.streetNumber = entity.streetNumber || "";
        data.postalCode = entity.postalCode || "";
        data.city = entity.city || "";
        data.county = entity.county || "";
        data.sector = entity.sector || "";
        data.phone = entity.phone || "";
        data.email = entity.email || "";
        data.presidentName = entity.presidentName || "";
      } else if (level === "association") {
        data.name = entity.name || "";
        data.description = entity.description || "";
        data.cui = entity.cui || "";
        data.address = entity.address || "";
        data.streetType = entity.streetType || "";
        data.streetName = entity.streetName || "";
        data.streetNumber = entity.streetNumber || "";
        data.postalCode = entity.postalCode || "";
        data.city = entity.city || "";
        data.county = entity.county || "";
        data.sector = entity.sector || "";
        data.federationId = entity.federationId || "";
        data.presidentName = entity.presidentName || "";
        data.presidentPhone = entity.presidentPhone || "";
        data.presidentEmail = entity.presidentEmail || "";
        data.adminName = entity.adminName || "";
        data.adminPhone = entity.adminPhone || "";
        data.adminEmail = entity.adminEmail || "";
      } else if (level === "building") {
        data.name = entity.name || "";
        data.address = entity.address || "";
        data.totalApartments = entity.totalApartments?.toString() || "";
        data.floors = entity.floors?.toString() || "";
      } else if (level === "staircase") {
        data.name = entity.name || "";
        data.floors = entity.floors?.toString() || "";
        data.apartmentsPerFloor = entity.apartmentsPerFloor?.toString() || "";
        data.elevators = entity.elevators?.toString() || "";
      } else if (level === "apartment") {
        data.unitType = entity.unitType || "apartment";
        data.number = entity.number || "";
        data.floor = entity.floor?.toString() || "0";
        data.surface = entity.surface || "";
        data.builtSurface = entity.builtSurface || "";
        data.rooms = entity.rooms?.toString() || "";
        data.ownerName = entity.ownerName || "";
        data.ownerPhone = entity.ownerPhone || "";
        data.ownerEmail = entity.ownerEmail || "";
        data.residents = entity.residents?.toString() || "1";
      }
      setFormData(data);
    }
  }, [open, entity, level]);

  useEffect(() => {
    if (existingRooms && open && level === "apartment") {
      setRooms(existingRooms.map(r => ({
        id: r.id,
        name: r.name,
        surface: r.surface?.toString() || "",
      })));
    }
  }, [existingRooms, open, level]);

  const updateField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, { name: `Camera ${prev.length + 1}`, surface: "" }]);
  }, []);

  const updateRoom = useCallback((index: number, field: "name" | "surface", value: string) => {
    setRooms(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  }, []);

  const removeRoom = useCallback((index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    if (level === "apartment") {
      if (rooms.length > 0) {
        const sum = rooms.reduce((s, r) => s + (parseFloat(r.surface) || 0), 0);
        setFormData(prev => ({
          ...prev,
          surface: sum > 0 ? sum.toFixed(2) : prev.surface,
          rooms: rooms.length.toString(),
        }));
      }
    }
  }, [rooms, level]);

  const handleSubmit = useCallback(async () => {
    if (!entity) return;
    setIsSaving(true);
    try {
      let body: Record<string, any> = {};

      if (level === "federation") {
        if (!formData.name?.trim()) {
          toast({ title: "Numele este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          description: formData.description || null,
          address: composeAddress(formData) || formData.address || null,
          streetType: formData.streetType || null,
          streetName: formData.streetName || null,
          streetNumber: formData.streetNumber || null,
          postalCode: formData.postalCode || null,
          city: formData.city || null,
          county: formData.county || null,
          sector: formData.sector || null,
          phone: formData.phone || null,
          email: formData.email || null,
          presidentName: formData.presidentName || null,
        };
      } else if (level === "association") {
        if (!formData.name?.trim()) {
          toast({ title: "Numele este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          description: formData.description || null,
          cui: formData.cui || null,
          address: composeAddress(formData) || formData.address || null,
          streetType: formData.streetType || null,
          streetName: formData.streetName || null,
          streetNumber: formData.streetNumber || null,
          postalCode: formData.postalCode || null,
          city: formData.city || null,
          county: formData.county || null,
          sector: formData.sector || null,
          federationId: formData.federationId || null,
          presidentName: formData.presidentName || null,
          presidentPhone: formData.presidentPhone || null,
          presidentEmail: formData.presidentEmail || null,
          adminName: formData.adminName || null,
          adminPhone: formData.adminPhone || null,
          adminEmail: formData.adminEmail || null,
        };
      } else if (level === "building") {
        if (!formData.name?.trim()) {
          toast({ title: "Numele este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          address: formData.address,
          totalApartments: formData.totalApartments ? Number(formData.totalApartments) : null,
          floors: formData.floors ? Number(formData.floors) : null,
        };
      } else if (level === "staircase") {
        if (!formData.name?.trim()) {
          toast({ title: "Numele este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          floors: formData.floors ? Number(formData.floors) : null,
          apartmentsPerFloor: formData.apartmentsPerFloor ? Number(formData.apartmentsPerFloor) : null,
          elevators: formData.elevators ? Number(formData.elevators) : 0,
        };
      } else if (level === "apartment") {
        if (!formData.number?.trim()) {
          toast({ title: "Numarul este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          unitType: formData.unitType || "apartment",
          number: formData.number,
          floor: Number(formData.floor || "0"),
          surface: formData.surface || null,
          builtSurface: formData.builtSurface || null,
          rooms: formData.rooms ? Number(formData.rooms) : null,
          ownerName: formData.ownerName || null,
          ownerPhone: formData.ownerPhone || null,
          ownerEmail: formData.ownerEmail || null,
          residents: formData.residents ? Number(formData.residents) : 1,
        };
      }

      await apiRequest("PATCH", `${LEVEL_ENDPOINTS[level]}/${entity.id}`, body);

      if (level === "apartment" && entity.id) {
        const roomsToSave = rooms.filter(r => r.name.trim());
        await apiRequest("POST", "/api/unit-rooms", {
          apartmentId: entity.id,
          rooms: roomsToSave.map((r, i) => ({
            name: r.name,
            surface: r.surface ? parseFloat(r.surface) : null,
            sortOrder: i,
          })),
        });
        queryClient.invalidateQueries({ queryKey: ["/api/unit-rooms", entity.id] });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/federations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: `${LEVEL_LABELS[level]} actualizat(a) cu succes` });
      onClose();
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [level, formData, entity, rooms, onClose, toast]);

  const renderFields = () => {
    switch (level) {
      case "federation":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="edit-fed-name">Nume *</Label>
              <Input id="edit-fed-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele federatiei" data-testid="edit-input-name" />
            </div>
            <div>
              <Label htmlFor="edit-fed-desc">Descriere</Label>
              <Textarea id="edit-fed-desc" value={formData.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="Descriere" data-testid="edit-input-description" />
            </div>
            <AddressFields
              values={{
                streetType: formData.streetType || "",
                streetName: formData.streetName || "",
                streetNumber: formData.streetNumber || "",
                city: formData.city || "",
                county: formData.county || "",
                sector: formData.sector || "",
                postalCode: formData.postalCode || "",
              }}
              onChange={(field, value) => updateField(field, value)}
              idPrefix="edit-fed-"
            />
            <div>
              <Label htmlFor="edit-fed-phone">Telefon</Label>
              <Input id="edit-fed-phone" value={formData.phone || ""} onChange={e => updateField("phone", e.target.value)} placeholder="Telefon" data-testid="edit-input-phone" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-fed-email">Email</Label>
                <Input id="edit-fed-email" value={formData.email || ""} onChange={e => updateField("email", e.target.value)} placeholder="Email" data-testid="edit-input-email" />
              </div>
              <div>
                <Label htmlFor="edit-fed-pres">Presedinte</Label>
                <Input id="edit-fed-pres" value={formData.presidentName || ""} onChange={e => updateField("presidentName", e.target.value)} placeholder="Presedinte" data-testid="edit-input-president" />
              </div>
            </div>
          </div>
        );

      case "association":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="edit-assoc-name">Nume *</Label>
              <Input id="edit-assoc-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele asociatiei" data-testid="edit-input-name" />
            </div>
            {federations && (
              <div>
                <Label>Federatie (optional)</Label>
                <Select value={formData.federationId || "_none"} onValueChange={v => updateField("federationId", v === "_none" ? "" : v)}>
                  <SelectTrigger data-testid="edit-select-federation">
                    <SelectValue placeholder="Independenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Independenta</SelectItem>
                    {federations.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="edit-assoc-cui">CUI</Label>
              <Input id="edit-assoc-cui" value={formData.cui || ""} onChange={e => updateField("cui", e.target.value)} placeholder="CUI" data-testid="edit-input-cui" />
            </div>
            <AddressFields
              values={{
                streetType: formData.streetType || "",
                streetName: formData.streetName || "",
                streetNumber: formData.streetNumber || "",
                city: formData.city || "",
                county: formData.county || "",
                sector: formData.sector || "",
                postalCode: formData.postalCode || "",
              }}
              onChange={(field, value) => updateField(field, value)}
              idPrefix="edit-assoc-"
            />
            <div>
              <Label htmlFor="edit-assoc-desc">Descriere</Label>
              <Textarea id="edit-assoc-desc" value={formData.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="Descriere" data-testid="edit-input-description" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-assoc-pn">Presedinte</Label>
                <Input id="edit-assoc-pn" value={formData.presidentName || ""} onChange={e => updateField("presidentName", e.target.value)} placeholder="Nume" data-testid="edit-input-president" />
              </div>
              <div>
                <Label htmlFor="edit-assoc-pp">Tel. Presedinte</Label>
                <Input id="edit-assoc-pp" value={formData.presidentPhone || ""} onChange={e => updateField("presidentPhone", e.target.value)} placeholder="Telefon" data-testid="edit-input-president-phone" />
              </div>
              <div>
                <Label htmlFor="edit-assoc-pe">Email Presedinte</Label>
                <Input id="edit-assoc-pe" value={formData.presidentEmail || ""} onChange={e => updateField("presidentEmail", e.target.value)} placeholder="Email" data-testid="edit-input-president-email" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-assoc-an">Administrator</Label>
                <Input id="edit-assoc-an" value={formData.adminName || ""} onChange={e => updateField("adminName", e.target.value)} placeholder="Nume" data-testid="edit-input-admin" />
              </div>
              <div>
                <Label htmlFor="edit-assoc-ap">Tel. Admin</Label>
                <Input id="edit-assoc-ap" value={formData.adminPhone || ""} onChange={e => updateField("adminPhone", e.target.value)} placeholder="Telefon" data-testid="edit-input-admin-phone" />
              </div>
              <div>
                <Label htmlFor="edit-assoc-ae">Email Admin</Label>
                <Input id="edit-assoc-ae" value={formData.adminEmail || ""} onChange={e => updateField("adminEmail", e.target.value)} placeholder="Email" data-testid="edit-input-admin-email" />
              </div>
            </div>
          </div>
        );

      case "building":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="edit-bld-name">Nume *</Label>
              <Input id="edit-bld-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele blocului" data-testid="edit-input-name" />
            </div>
            <div>
              <Label htmlFor="edit-bld-addr">Adresa</Label>
              <Input id="edit-bld-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="edit-input-address" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-bld-floors">Etaje</Label>
                <Input id="edit-bld-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="edit-input-floors" />
              </div>
              <div>
                <Label htmlFor="edit-bld-apts">Total Apartamente</Label>
                <Input id="edit-bld-apts" type="number" value={formData.totalApartments || ""} onChange={e => updateField("totalApartments", e.target.value)} placeholder="Nr. total" data-testid="edit-input-total-apartments" />
              </div>
            </div>
          </div>
        );

      case "staircase":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="edit-st-name">Nume *</Label>
              <Input id="edit-st-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Ex: Scara A" data-testid="edit-input-name" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-st-floors">Etaje</Label>
                <Input id="edit-st-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="edit-input-floors" />
              </div>
              <div>
                <Label htmlFor="edit-st-apf">Apartamente/Etaj</Label>
                <Input id="edit-st-apf" type="number" value={formData.apartmentsPerFloor || ""} onChange={e => updateField("apartmentsPerFloor", e.target.value)} placeholder="Nr." data-testid="edit-input-apts-floor" />
              </div>
              <div>
                <Label htmlFor="edit-st-elevators">Ascensoare</Label>
                <Input id="edit-st-elevators" type="number" value={formData.elevators || ""} onChange={e => updateField("elevators", e.target.value)} placeholder="0" data-testid="edit-input-elevators" />
              </div>
            </div>
          </div>
        );

      case "apartment":
        return (
          <div className="space-y-3">
            {hierarchyInfo && (
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1 text-xs" data-testid="edit-unit-hierarchy">
                {hierarchyInfo.federation && (
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Federatie:</span>
                    <span className="font-medium">{hierarchyInfo.federation.name}</span>
                  </div>
                )}
                {hierarchyInfo.association && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Asociatie:</span>
                    <span className="font-medium">{hierarchyInfo.association.name}</span>
                  </div>
                )}
                {hierarchyInfo.building && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Bloc:</span>
                    <span className="font-medium">{hierarchyInfo.building.name}</span>
                  </div>
                )}
                {hierarchyInfo.staircase && (
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Scara:</span>
                    <span className="font-medium">{hierarchyInfo.staircase.name}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-apt-num">Numar *</Label>
                <Input id="edit-apt-num" value={formData.number || ""} onChange={e => updateField("number", e.target.value)} placeholder="Ex: 1, B1, P1" data-testid="edit-input-number" />
              </div>
              <div>
                <Label>Tip Unitate</Label>
                <Select value={formData.unitType || "apartment"} onValueChange={v => updateField("unitType", v)}>
                  <SelectTrigger data-testid="edit-select-unit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">{UNIT_TYPE_LABELS.apartment}</SelectItem>
                    <SelectItem value="box">{UNIT_TYPE_LABELS.box}</SelectItem>
                    <SelectItem value="parking">{UNIT_TYPE_LABELS.parking}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-apt-floor">Etaj</Label>
                <Input id="edit-apt-floor" type="number" value={formData.floor || "0"} onChange={e => updateField("floor", e.target.value)} data-testid="edit-input-floor" />
              </div>
            </div>

            <div className="border rounded-md p-2.5 space-y-2" data-testid="edit-rooms-section">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Camere ({rooms.length})</Label>
                <Button variant="outline" size="sm" onClick={addRoom} data-testid="edit-btn-add-room">
                  <Plus className="w-3 h-3 mr-1" /> Adauga Camera
                </Button>
              </div>
              {rooms.length > 0 && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[1fr_100px_28px] gap-2 text-xs text-muted-foreground px-0.5">
                    <span>Nume camera</span>
                    <span>Suprafata (mp)</span>
                    <span></span>
                  </div>
                  {rooms.map((room, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_28px] gap-2 items-center" data-testid={`edit-room-row-${i}`}>
                      <Input
                        value={room.name}
                        onChange={e => updateRoom(i, "name", e.target.value)}
                        placeholder={`Camera ${i + 1}`}
                        className="h-7 text-xs"
                        data-testid={`edit-room-name-${i}`}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={room.surface}
                        onChange={e => updateRoom(i, "surface", e.target.value)}
                        placeholder="mp"
                        className="h-7 text-xs"
                        data-testid={`edit-room-surface-${i}`}
                      />
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeRoom(i)} data-testid={`edit-room-delete-${i}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {rooms.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-1">Nicio camera adaugata. Apasati butonul pentru a adauga.</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-apt-surface">Suprafata Utila (mp)</Label>
                <Input
                  id="edit-apt-surface"
                  type="number"
                  step="0.01"
                  value={formData.surface || ""}
                  onChange={e => updateField("surface", e.target.value)}
                  readOnly={rooms.length > 0}
                  className={rooms.length > 0 ? "bg-muted" : ""}
                  data-testid="edit-input-surface"
                />
                {rooms.length > 0 && roomsSurfaceSum > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">Calculata din camere: {roomsSurfaceSum.toFixed(2)} mp</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-apt-built">Suprafata Construita (mp)</Label>
                <Input id="edit-apt-built" type="number" step="0.01" value={formData.builtSurface || ""} onChange={e => updateField("builtSurface", e.target.value)} data-testid="edit-input-built-surface" />
              </div>
              <div>
                <Label htmlFor="edit-apt-rooms-count">Nr. Camere</Label>
                <Input
                  id="edit-apt-rooms-count"
                  type="number"
                  value={formData.rooms || ""}
                  onChange={e => updateField("rooms", e.target.value)}
                  readOnly={rooms.length > 0}
                  className={rooms.length > 0 ? "bg-muted" : ""}
                  data-testid="edit-input-rooms"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-apt-res">Locatari</Label>
                <Input id="edit-apt-res" type="number" value={formData.residents || "1"} onChange={e => updateField("residents", e.target.value)} data-testid="edit-input-residents" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-apt-owner">Proprietar</Label>
                <Input id="edit-apt-owner" value={formData.ownerName || ""} onChange={e => updateField("ownerName", e.target.value)} placeholder="Nume" data-testid="edit-input-owner" />
              </div>
              <div>
                <Label htmlFor="edit-apt-ophone">Telefon Proprietar</Label>
                <Input id="edit-apt-ophone" value={formData.ownerPhone || ""} onChange={e => updateField("ownerPhone", e.target.value)} placeholder="Telefon" data-testid="edit-input-owner-phone" />
              </div>
              <div>
                <Label htmlFor="edit-apt-oemail">Email Proprietar</Label>
                <Input id="edit-apt-oemail" value={formData.ownerEmail || ""} onChange={e => updateField("ownerEmail", e.target.value)} placeholder="Email" data-testid="edit-input-owner-email" />
              </div>
            </div>
          </div>
        );
    }
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleDelete = useCallback(async () => {
    if (!entity) return;
    try {
      await apiRequest("DELETE", `${LEVEL_ENDPOINTS[level]}/${entity.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/federations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: `${LEVEL_LABELS[level]} sters(a) cu succes` });
      onClose();
    } catch (error: any) {
      toast({ title: "Eroare la stergere", description: error.message, variant: "destructive" });
    }
  }, [entity, level, onClose, toast]);

  return (
    <div className="flex flex-col h-full" data-testid="edit-entity-panel">
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-muted/30 shrink-0">
        <div>
          <h2 className="text-sm font-semibold" data-testid="edit-panel-title">Editare {LEVEL_LABELS[level]}</h2>
          <p className="text-[11px] text-muted-foreground">{entity?.name || entity?.number}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} data-testid="edit-btn-close">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {renderFields()}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between gap-2 px-4 py-2 border-t shrink-0 bg-background">
        <Button variant="destructive" size="sm" onClick={handleDelete} data-testid="edit-btn-delete">
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Sterge
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={isSaving} data-testid="edit-btn-save">
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salveaza
        </Button>
      </div>
    </div>
  );
}
