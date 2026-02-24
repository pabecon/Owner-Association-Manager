import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Federation, Association, Building, Staircase } from "@shared/schema";
import { UNIT_TYPE_LABELS } from "@shared/schema";
import { AddressFields, composeAddress, isBucharestCity } from "@/components/address-fields";
import {
  Upload, FileText, Image, File, Loader2, X, Plus, Trash2
} from "lucide-react";

type EntityLevel = "federation" | "association" | "building" | "staircase" | "apartment";

interface PendingFile {
  file: File;
  customName: string;
  description: string;
}

interface RoomEntry {
  name: string;
  surface: string;
}

interface AddEntityDialogProps {
  onClose: () => void;
  level: EntityLevel;
  parentId?: string;
  parentName?: string;
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

const LEVEL_QUERY_KEYS: Record<EntityLevel, string> = {
  federation: "/api/federations",
  association: "/api/associations",
  building: "/api/buildings",
  staircase: "/api/staircases",
  apartment: "/api/apartments",
};

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType === "application/pdf") return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AddEntityDialog({
  onClose,
  level,
  parentId,
  parentName,
  federations,
  associations,
  buildings,
  staircases,
}: AddEntityDialogProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    onError: (error) => {
      toast({ title: "Eroare la incarcare fisier", description: error.message, variant: "destructive" });
    },
  });

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [fileDescription, setFileDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [roomEntries, setRoomEntries] = useState<RoomEntry[]>([]);

  const resetForm = useCallback(() => {
    setFormData({});
    setPendingFiles([]);
    setFileDescription("");
    setRoomEntries([]);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const updateField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: PendingFile[] = Array.from(files).map(f => ({
      file: f,
      customName: f.name.replace(/\.[^/.]+$/, ""),
      description: fileDescription,
    }));
    setPendingFiles(prev => [...prev, ...newFiles]);
    setFileDescription("");
  }, [fileDescription]);

  const removeFile = useCallback((index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFileName = useCallback((index: number, name: string) => {
    setPendingFiles(prev => prev.map((f, i) => i === index ? { ...f, customName: name } : f));
  }, []);

  const updateFileDescription = useCallback((index: number, desc: string) => {
    setPendingFiles(prev => prev.map((f, i) => i === index ? { ...f, description: desc } : f));
  }, []);

  const handleSubmit = useCallback(async () => {
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
          federationId: parentId || formData.federationId || null,
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
        };
      } else if (level === "building") {
        if (!formData.name?.trim() || !formData.address?.trim()) {
          toast({ title: "Numele si adresa sunt obligatorii", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        const assocId = parentId || formData.associationId;
        if (!assocId) {
          toast({ title: "Asociatia este obligatorie", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          associationId: assocId,
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
        const bldId = parentId || formData.buildingId;
        if (!bldId) {
          toast({ title: "Blocul este obligatoriu", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        body = {
          name: formData.name,
          buildingId: bldId,
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
        const stId = parentId || formData.staircaseId;
        if (!stId) {
          toast({ title: "Scara este obligatorie", variant: "destructive" });
          setIsSaving(false);
          return;
        }
        const validRooms = roomEntries.filter(r => r.name.trim());
        body = {
          staircaseId: stId,
          unitType: formData.unitType || "apartment",
          number: formData.number,
          floor: Number(formData.floor || "0"),
          surface: formData.surface || null,
          builtSurface: formData.builtSurface || null,
          rooms: validRooms.length > 0 ? validRooms.length : (formData.rooms ? Number(formData.rooms) : null),
          ownerName: formData.ownerName || null,
          ownerPhone: formData.ownerPhone || null,
          ownerEmail: formData.ownerEmail || null,
          residents: formData.residents ? Number(formData.residents) : 1,
        };
      }

      const res = await apiRequest("POST", LEVEL_ENDPOINTS[level], body);
      const created = await res.json();

      if (level === "apartment" && created.id && roomEntries.filter(r => r.name.trim()).length > 0) {
        await apiRequest("POST", "/api/unit-rooms", {
          apartmentId: created.id,
          rooms: roomEntries.filter(r => r.name.trim()).map(r => ({
            name: r.name.trim(),
            surface: r.surface || null,
          })),
        });
      }

      if (pendingFiles.length > 0 && created.id) {
        const entityType = level === "apartment" ? "apartment" : level;
        for (const pf of pendingFiles) {
          const uploadResult = await uploadFile(pf.file);
          if (uploadResult) {
            const ext = pf.file.name.includes(".") ? pf.file.name.substring(pf.file.name.lastIndexOf(".")) : "";
            const displayName = pf.customName?.trim() ? pf.customName.trim() + ext : pf.file.name;
            await apiRequest("POST", "/api/documents", {
              entityType,
              entityId: created.id,
              floorNumber: null,
              fileName: displayName,
              originalName: displayName,
              mimeType: pf.file.type || "application/octet-stream",
              size: pf.file.size,
              objectPath: uploadResult.objectPath,
              description: pf.description || null,
            });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: [LEVEL_QUERY_KEYS[level]] });
      toast({ title: `${LEVEL_LABELS[level]} adaugat(a) cu succes` });
      handleClose();
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [level, formData, parentId, pendingFiles, roomEntries, uploadFile, handleClose, toast]);

  const renderFields = () => {
    switch (level) {
      case "federation":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="fed-name">Nume *</Label>
              <Input id="fed-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele federatiei" data-testid="input-entity-name" />
            </div>
            <div>
              <Label htmlFor="fed-desc">Descriere</Label>
              <Textarea id="fed-desc" value={formData.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="Descriere" data-testid="input-entity-description" />
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
              idPrefix="fed-"
            />
            <div>
              <Label htmlFor="fed-phone">Telefon</Label>
              <Input id="fed-phone" value={formData.phone || ""} onChange={e => updateField("phone", e.target.value)} placeholder="Telefon" data-testid="input-entity-phone" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fed-email">Email</Label>
                <Input id="fed-email" value={formData.email || ""} onChange={e => updateField("email", e.target.value)} placeholder="Email" data-testid="input-entity-email" />
              </div>
              <div>
                <Label htmlFor="fed-pres">Presedinte</Label>
                <Input id="fed-pres" value={formData.presidentName || ""} onChange={e => updateField("presidentName", e.target.value)} placeholder="Presedinte" data-testid="input-entity-president" />
              </div>
            </div>
          </div>
        );

      case "association":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="assoc-name">Nume *</Label>
              <Input id="assoc-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele asociatiei" data-testid="input-entity-name" />
            </div>
            {!parentId && federations && (
              <div>
                <Label>Federatie (optional)</Label>
                <Select value={formData.federationId || "_none"} onValueChange={v => updateField("federationId", v === "_none" ? "" : v)}>
                  <SelectTrigger data-testid="select-federation">
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
              <Label htmlFor="assoc-cui">CUI</Label>
              <Input id="assoc-cui" value={formData.cui || ""} onChange={e => updateField("cui", e.target.value)} placeholder="CUI" data-testid="input-entity-cui" />
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
              idPrefix="assoc-"
            />
            <div>
              <Label htmlFor="assoc-desc">Descriere</Label>
              <Textarea id="assoc-desc" value={formData.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="Descriere" data-testid="input-entity-description" />
            </div>
          </div>
        );

      case "building":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="bld-name">Nume *</Label>
              <Input id="bld-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Numele blocului" data-testid="input-entity-name" />
            </div>
            <div>
              <Label htmlFor="bld-addr">Adresa *</Label>
              <Input id="bld-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="input-entity-address" />
            </div>
            {!parentId && associations && (
              <div>
                <Label>Asociatie *</Label>
                <Select value={formData.associationId || ""} onValueChange={v => updateField("associationId", v)}>
                  <SelectTrigger data-testid="select-association">
                    <SelectValue placeholder="Selecteaza asociatia" />
                  </SelectTrigger>
                  <SelectContent>
                    {associations.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bld-floors">Etaje</Label>
                <Input id="bld-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="input-entity-floors" />
              </div>
              <div>
                <Label htmlFor="bld-apts">Total Apartamente</Label>
                <Input id="bld-apts" type="number" value={formData.totalApartments || ""} onChange={e => updateField("totalApartments", e.target.value)} placeholder="Nr. total" data-testid="input-entity-total-apartments" />
              </div>
            </div>
          </div>
        );

      case "staircase":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="st-name">Nume *</Label>
              <Input id="st-name" value={formData.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="Ex: Scara A" data-testid="input-entity-name" />
            </div>
            {!parentId && buildings && (
              <div>
                <Label>Bloc *</Label>
                <Select value={formData.buildingId || ""} onValueChange={v => updateField("buildingId", v)}>
                  <SelectTrigger data-testid="select-building">
                    <SelectValue placeholder="Selecteaza blocul" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="st-floors">Etaje</Label>
                <Input id="st-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="input-entity-floors" />
              </div>
              <div>
                <Label htmlFor="st-apf">Apartamente/Etaj</Label>
                <Input id="st-apf" type="number" value={formData.apartmentsPerFloor || ""} onChange={e => updateField("apartmentsPerFloor", e.target.value)} placeholder="Nr." data-testid="input-entity-apts-floor" />
              </div>
              <div>
                <Label htmlFor="st-elevators">Ascensoare</Label>
                <Input id="st-elevators" type="number" value={formData.elevators || ""} onChange={e => updateField("elevators", e.target.value)} placeholder="0" data-testid="input-entity-elevators" />
              </div>
            </div>
          </div>
        );

      case "apartment": {
        const selectedAssocId = formData.associationId || "";
        const filteredBuildings = (buildings || []).filter(b => !selectedAssocId || b.associationId === selectedAssocId);
        const selectedBuildingId = formData.buildingId || "";
        const filteredStaircases = (staircases || []).filter(s => !selectedBuildingId || s.buildingId === selectedBuildingId);

        return (
          <div className="space-y-3">
            {!parentId && (
              <>
                <div>
                  <Label>Asociatie *</Label>
                  <Select value={selectedAssocId} onValueChange={v => { updateField("associationId", v); updateField("buildingId", ""); updateField("staircaseId", ""); }}>
                    <SelectTrigger data-testid="select-apt-association">
                      <SelectValue placeholder="Selecteaza asociatia" />
                    </SelectTrigger>
                    <SelectContent>
                      {(associations || []).map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedAssocId && (
                  <div>
                    <Label>Bloc *</Label>
                    <Select value={selectedBuildingId} onValueChange={v => { updateField("buildingId", v); updateField("staircaseId", ""); }}>
                      <SelectTrigger data-testid="select-apt-building">
                        <SelectValue placeholder="Selecteaza blocul" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBuildings.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name} - {b.address}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedBuildingId && (
                  <div>
                    <Label>Scara *</Label>
                    <Select value={formData.staircaseId || ""} onValueChange={v => updateField("staircaseId", v)}>
                      <SelectTrigger data-testid="select-apt-staircase">
                        <SelectValue placeholder="Selecteaza scara" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStaircases.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="apt-num">Numar *</Label>
                <Input id="apt-num" value={formData.number || ""} onChange={e => updateField("number", e.target.value)} placeholder="Ex: 1, B1, P1" data-testid="input-entity-number" />
              </div>
              <div>
                <Label>Tip Unitate</Label>
                <Select value={formData.unitType || "apartment"} onValueChange={v => updateField("unitType", v)}>
                  <SelectTrigger data-testid="select-unit-type">
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
                <Label htmlFor="apt-floor">Etaj *</Label>
                <Input id="apt-floor" type="number" value={formData.floor || "0"} onChange={e => updateField("floor", e.target.value)} placeholder="0" data-testid="input-entity-floor" />
              </div>
              <div>
                <Label htmlFor="apt-surface">Suprafata Utila (mp)</Label>
                <Input id="apt-surface" value={formData.surface || ""} onChange={e => updateField("surface", e.target.value)} placeholder="mp" data-testid="input-entity-surface" />
              </div>
              <div>
                <Label htmlFor="apt-built">Suprafata Construita (mp)</Label>
                <Input id="apt-built" value={formData.builtSurface || ""} onChange={e => updateField("builtSurface", e.target.value)} placeholder="mp" data-testid="input-entity-built-surface" />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label className="text-sm font-medium">Camere</Label>
                <Button size="sm" variant="outline" onClick={() => setRoomEntries(prev => [...prev, { name: "", surface: "" }])} data-testid="button-add-room">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />Camera
                </Button>
              </div>
              {roomEntries.length === 0 && (
                <p className="text-xs text-muted-foreground">Adauga camere pentru a introduce suprafata utila pe camera</p>
              )}
              {roomEntries.map((room, idx) => (
                <div key={idx} className="flex items-center gap-2" data-testid={`room-entry-${idx}`}>
                  <Input
                    className="flex-1 text-sm"
                    placeholder={`Camera ${idx + 1} (ex: Living, Dormitor)`}
                    value={room.name}
                    onChange={e => setRoomEntries(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r))}
                    data-testid={`input-room-name-${idx}`}
                  />
                  <Input
                    className="w-24 text-sm"
                    placeholder="mp"
                    value={room.surface}
                    onChange={e => setRoomEntries(prev => prev.map((r, i) => i === idx ? { ...r, surface: e.target.value } : r))}
                    data-testid={`input-room-surface-${idx}`}
                  />
                  <Button size="icon" variant="ghost" onClick={() => setRoomEntries(prev => prev.filter((_, i) => i !== idx))} data-testid={`button-remove-room-${idx}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              {roomEntries.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {roomEntries.filter(r => r.name.trim()).length} camere definite
                  {roomEntries.some(r => r.surface) && (
                    <> - Suprafata totala: {roomEntries.reduce((s, r) => s + (parseFloat(r.surface) || 0), 0).toFixed(2)} mp</>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="apt-owner">Proprietar</Label>
                <Input id="apt-owner" value={formData.ownerName || ""} onChange={e => updateField("ownerName", e.target.value)} placeholder="Nume" data-testid="input-entity-owner" />
              </div>
              <div>
                <Label htmlFor="apt-phone">Telefon</Label>
                <Input id="apt-phone" value={formData.ownerPhone || ""} onChange={e => updateField("ownerPhone", e.target.value)} placeholder="Telefon" data-testid="input-entity-owner-phone" />
              </div>
              <div>
                <Label htmlFor="apt-email">Email</Label>
                <Input id="apt-email" value={formData.ownerEmail || ""} onChange={e => updateField("ownerEmail", e.target.value)} placeholder="Email" data-testid="input-entity-owner-email" />
              </div>
            </div>
            <div>
              <Label htmlFor="apt-residents">Nr. Persoane</Label>
              <Input id="apt-residents" type="number" value={formData.residents || "1"} onChange={e => updateField("residents", e.target.value)} placeholder="1" data-testid="input-entity-residents" />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="add-entity-panel">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 shrink-0">
        <div>
          <h2 className="text-sm font-semibold" data-testid="text-add-entity-title">Adauga {LEVEL_LABELS[level]}</h2>
          <p className="text-[11px] text-muted-foreground">
            {parentName ? `In: ${parentName}` : `Completeaza datele pentru ${LEVEL_LABELS[level].toLowerCase()} noua`}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} data-testid="button-close-entity-panel">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {renderFields()}

          <div className="pt-3 border-t space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label className="text-sm font-medium">Documente Atasate</Label>
              {pendingFiles.length > 0 && (
                <Badge variant="secondary" className="text-xs">{pendingFiles.length} fisier(e)</Badge>
              )}
            </div>

            {pendingFiles.length > 0 && (
              <div className="space-y-2">
                {pendingFiles.map((pf, idx) => {
                  const Icon = getFileIcon(pf.file.type);
                  return (
                    <div key={idx} className="px-3 py-2 rounded-md bg-muted/50 space-y-1.5" data-testid={`pending-file-${idx}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{pf.file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">({formatFileSize(pf.file.size)})</span>
                        <div className="flex-1" />
                        <Button size="icon" variant="ghost" onClick={() => removeFile(idx)} data-testid={`button-remove-file-${idx}`}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Input
                        className="text-sm"
                        placeholder="Nume document..."
                        value={pf.customName}
                        onChange={e => updateFileName(idx, e.target.value)}
                        data-testid={`input-file-name-${idx}`}
                      />
                      <Input
                        className="text-xs"
                        placeholder="Descriere (optional)..."
                        value={pf.description}
                        onChange={e => updateFileDescription(idx, e.target.value)}
                        data-testid={`input-file-desc-${idx}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={e => addFiles(e.target.files)}
                  data-testid="input-file-upload"
                />
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/30 cursor-pointer hover-elevate text-sm text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span>Adauga fisiere (imagini, PDF, documente)</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end gap-2 px-4 py-2 border-t shrink-0 bg-background">
        <Button variant="outline" onClick={handleClose} disabled={isSaving || isUploading} data-testid="button-cancel-entity">
          Anuleaza
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || isUploading} data-testid="button-save-entity">
          {(isSaving || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salveaza
        </Button>
      </div>
    </div>
  );
}
