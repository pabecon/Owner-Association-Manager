import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Federation, Association, Building, Staircase, Apartment } from "@shared/schema";
import { UNIT_TYPE_LABELS } from "@shared/schema";
import { Loader2 } from "lucide-react";

type EntityLevel = "federation" | "association" | "building" | "staircase" | "apartment";

interface EditEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: EntityLevel;
  entity: any;
  federations?: Federation[];
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

export function EditEntityDialog({
  open,
  onOpenChange,
  level,
  entity,
  federations,
}: EditEntityDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && entity) {
      const data: Record<string, string> = {};
      if (level === "federation") {
        data.name = entity.name || "";
        data.description = entity.description || "";
        data.address = entity.address || "";
        data.phone = entity.phone || "";
        data.email = entity.email || "";
        data.presidentName = entity.presidentName || "";
      } else if (level === "association") {
        data.name = entity.name || "";
        data.description = entity.description || "";
        data.cui = entity.cui || "";
        data.address = entity.address || "";
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

  const updateField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

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
          address: formData.address || null,
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
          address: formData.address || null,
          federationId: formData.federationId || null,
          presidentName: formData.presidentName || null,
          presidentPhone: formData.presidentPhone || null,
          presidentEmail: formData.presidentEmail || null,
          adminName: formData.adminName || null,
          adminPhone: formData.adminPhone || null,
          adminEmail: formData.adminEmail || null,
        };
      } else if (level === "building") {
        if (!formData.name?.trim() || !formData.address?.trim()) {
          toast({ title: "Numele si adresa sunt obligatorii", variant: "destructive" });
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

      queryClient.invalidateQueries({ queryKey: ["/api/federations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: `${LEVEL_LABELS[level]} actualizat(a) cu succes` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [level, formData, entity, onOpenChange, toast]);

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-fed-addr">Adresa</Label>
                <Input id="edit-fed-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="edit-input-address" />
              </div>
              <div>
                <Label htmlFor="edit-fed-phone">Telefon</Label>
                <Input id="edit-fed-phone" value={formData.phone || ""} onChange={e => updateField("phone", e.target.value)} placeholder="Telefon" data-testid="edit-input-phone" />
              </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-assoc-cui">CUI</Label>
                <Input id="edit-assoc-cui" value={formData.cui || ""} onChange={e => updateField("cui", e.target.value)} placeholder="CUI" data-testid="edit-input-cui" />
              </div>
              <div>
                <Label htmlFor="edit-assoc-addr">Adresa</Label>
                <Input id="edit-assoc-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="edit-input-address" />
              </div>
            </div>
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
              <Label htmlFor="edit-bld-addr">Adresa *</Label>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-st-floors">Etaje</Label>
                <Input id="edit-st-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="edit-input-floors" />
              </div>
              <div>
                <Label htmlFor="edit-st-apf">Apartamente/Etaj</Label>
                <Input id="edit-st-apf" type="number" value={formData.apartmentsPerFloor || ""} onChange={e => updateField("apartmentsPerFloor", e.target.value)} placeholder="Nr." data-testid="edit-input-apts-floor" />
              </div>
            </div>
          </div>
        );

      case "apartment":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-apt-floor">Etaj</Label>
                <Input id="edit-apt-floor" type="number" value={formData.floor || "0"} onChange={e => updateField("floor", e.target.value)} data-testid="edit-input-floor" />
              </div>
              <div>
                <Label htmlFor="edit-apt-surface">Suprafata Utila (mp)</Label>
                <Input id="edit-apt-surface" type="number" step="0.01" value={formData.surface || ""} onChange={e => updateField("surface", e.target.value)} data-testid="edit-input-surface" />
              </div>
              <div>
                <Label htmlFor="edit-apt-built">Suprafata Construita (mp)</Label>
                <Input id="edit-apt-built" type="number" step="0.01" value={formData.builtSurface || ""} onChange={e => updateField("builtSurface", e.target.value)} data-testid="edit-input-built-surface" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-apt-rooms">Camere</Label>
                <Input id="edit-apt-rooms" type="number" value={formData.rooms || ""} onChange={e => updateField("rooms", e.target.value)} data-testid="edit-input-rooms" />
              </div>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="edit-entity-dialog">
        <DialogHeader>
          <DialogTitle data-testid="edit-dialog-title">Editeaza {LEVEL_LABELS[level]}</DialogTitle>
          <DialogDescription>Modificati datele si salvati</DialogDescription>
        </DialogHeader>
        {renderFields()}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="edit-btn-cancel">Anuleaza</Button>
          <Button onClick={handleSubmit} disabled={isSaving} data-testid="edit-btn-save">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salveaza
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
