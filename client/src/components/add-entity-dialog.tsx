import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Federation, Association, Building, Staircase } from "@shared/schema";
import { UNIT_TYPE_LABELS } from "@shared/schema";
import {
  Upload, FileText, Image, File, Loader2, X
} from "lucide-react";

type EntityLevel = "federation" | "association" | "building" | "staircase" | "apartment";

interface PendingFile {
  file: File;
  customName: string;
  description: string;
}

interface AddEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  open,
  onOpenChange,
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

  const resetForm = useCallback(() => {
    setFormData({});
    setPendingFiles([]);
    setFileDescription("");
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

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
          federationId: parentId || formData.federationId || null,
          description: formData.description || null,
          cui: formData.cui || null,
          address: formData.address || null,
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
        body = {
          staircaseId: stId,
          unitType: formData.unitType || "apartment",
          number: formData.number,
          floor: Number(formData.floor || "0"),
          surface: formData.surface || null,
          rooms: formData.rooms ? Number(formData.rooms) : null,
          ownerName: formData.ownerName || null,
          ownerPhone: formData.ownerPhone || null,
          ownerEmail: formData.ownerEmail || null,
          residents: formData.residents ? Number(formData.residents) : 1,
        };
      }

      const res = await apiRequest("POST", LEVEL_ENDPOINTS[level], body);
      const created = await res.json();

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
  }, [level, formData, parentId, pendingFiles, uploadFile, handleClose, toast]);

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fed-addr">Adresa</Label>
                <Input id="fed-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="input-entity-address" />
              </div>
              <div>
                <Label htmlFor="fed-phone">Telefon</Label>
                <Input id="fed-phone" value={formData.phone || ""} onChange={e => updateField("phone", e.target.value)} placeholder="Telefon" data-testid="input-entity-phone" />
              </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="assoc-cui">CUI</Label>
                <Input id="assoc-cui" value={formData.cui || ""} onChange={e => updateField("cui", e.target.value)} placeholder="CUI" data-testid="input-entity-cui" />
              </div>
              <div>
                <Label htmlFor="assoc-addr">Adresa</Label>
                <Input id="assoc-addr" value={formData.address || ""} onChange={e => updateField("address", e.target.value)} placeholder="Adresa" data-testid="input-entity-address" />
              </div>
            </div>
            <div>
              <Label htmlFor="assoc-desc">Descriere</Label>
              <Textarea id="assoc-desc" value={formData.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="Descriere" data-testid="input-entity-description" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="assoc-pn">Presedinte</Label>
                <Input id="assoc-pn" value={formData.presidentName || ""} onChange={e => updateField("presidentName", e.target.value)} placeholder="Nume" data-testid="input-entity-president" />
              </div>
              <div>
                <Label htmlFor="assoc-pp">Tel. Presedinte</Label>
                <Input id="assoc-pp" value={formData.presidentPhone || ""} onChange={e => updateField("presidentPhone", e.target.value)} placeholder="Telefon" data-testid="input-entity-president-phone" />
              </div>
              <div>
                <Label htmlFor="assoc-pe">Email Presedinte</Label>
                <Input id="assoc-pe" value={formData.presidentEmail || ""} onChange={e => updateField("presidentEmail", e.target.value)} placeholder="Email" data-testid="input-entity-president-email" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="assoc-an">Administrator</Label>
                <Input id="assoc-an" value={formData.adminName || ""} onChange={e => updateField("adminName", e.target.value)} placeholder="Nume" data-testid="input-entity-admin" />
              </div>
              <div>
                <Label htmlFor="assoc-ap">Tel. Admin</Label>
                <Input id="assoc-ap" value={formData.adminPhone || ""} onChange={e => updateField("adminPhone", e.target.value)} placeholder="Telefon" data-testid="input-entity-admin-phone" />
              </div>
              <div>
                <Label htmlFor="assoc-ae">Email Admin</Label>
                <Input id="assoc-ae" value={formData.adminEmail || ""} onChange={e => updateField("adminEmail", e.target.value)} placeholder="Email" data-testid="input-entity-admin-email" />
              </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="st-floors">Etaje</Label>
                <Input id="st-floors" type="number" value={formData.floors || ""} onChange={e => updateField("floors", e.target.value)} placeholder="Nr. etaje" data-testid="input-entity-floors" />
              </div>
              <div>
                <Label htmlFor="st-apf">Apartamente/Etaj</Label>
                <Input id="st-apf" type="number" value={formData.apartmentsPerFloor || ""} onChange={e => updateField("apartmentsPerFloor", e.target.value)} placeholder="Nr." data-testid="input-entity-apts-floor" />
              </div>
            </div>
          </div>
        );

      case "apartment":
        return (
          <div className="space-y-3">
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
            {!parentId && staircases && (
              <div>
                <Label>Scara *</Label>
                <Select value={formData.staircaseId || ""} onValueChange={v => updateField("staircaseId", v)}>
                  <SelectTrigger data-testid="select-staircase">
                    <SelectValue placeholder="Selecteaza scara" />
                  </SelectTrigger>
                  <SelectContent>
                    {staircases.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="apt-floor">Etaj *</Label>
                <Input id="apt-floor" type="number" value={formData.floor || "0"} onChange={e => updateField("floor", e.target.value)} placeholder="0" data-testid="input-entity-floor" />
              </div>
              <div>
                <Label htmlFor="apt-surface">Suprafata (mp)</Label>
                <Input id="apt-surface" value={formData.surface || ""} onChange={e => updateField("surface", e.target.value)} placeholder="mp" data-testid="input-entity-surface" />
              </div>
              <div>
                <Label htmlFor="apt-rooms">Camere</Label>
                <Input id="apt-rooms" type="number" value={formData.rooms || ""} onChange={e => updateField("rooms", e.target.value)} placeholder="Nr." data-testid="input-entity-rooms" />
              </div>
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
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-add-entity-title">
            Adauga {LEVEL_LABELS[level]}
          </DialogTitle>
          <DialogDescription>
            {parentName ? `In: ${parentName}` : `Completeaza datele pentru ${LEVEL_LABELS[level].toLowerCase()} noua`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isSaving || isUploading} data-testid="button-cancel-entity">
              Anuleaza
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving || isUploading} data-testid="button-save-entity">
              {(isSaving || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salveaza
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
