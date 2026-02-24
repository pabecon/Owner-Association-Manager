import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
  Upload, FileText, Image, File, Loader2, X, Plus, Trash2
} from "lucide-react";

type WizardLevel = "building" | "staircase" | "floor" | "unit";

interface PendingFile {
  file: File;
  customName: string;
  description: string;
}

interface BatchItem {
  name: string;
  unitType?: string;
  floorNum?: number;
  files: PendingFile[];
}

interface BatchCreateDialogProps {
  onClose: () => void;
  level: WizardLevel;
  parentId: string;
  parentName: string;
  staircaseId?: string;
  floorNumber?: number;
  parentAddress?: string;
}

const LEVEL_CONFIG: Record<WizardLevel, { title: string; itemLabel: string; pluralLabel: string; countLabel: string }> = {
  building: { title: "Adauga Blocuri", itemLabel: "Bloc", pluralLabel: "blocuri", countLabel: "Cate blocuri are aceasta asociatie?" },
  staircase: { title: "Adauga Scari", itemLabel: "Scara", pluralLabel: "scari", countLabel: "Cate scari are acest bloc?" },
  floor: { title: "Adauga Etaje", itemLabel: "Etaj", pluralLabel: "etaje", countLabel: "Cate etaje are aceasta scara?" },
  unit: { title: "Adauga Unitati", itemLabel: "Unitate", pluralLabel: "unitati", countLabel: "Cate unitati are acest etaj?" },
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

export function BatchCreateDialog({
  onClose,
  level,
  parentId,
  parentName,
  staircaseId,
  floorNumber,
  parentAddress,
}: BatchCreateDialogProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    onError: (error) => {
      toast({ title: "Eroare la incarcare fisier", description: error.message, variant: "destructive" });
    },
  });

  const { data: tipImobilItems } = useQuery<any[]>({
    queryKey: ['/api/liste', 'tip-imobil'],
    queryFn: () => fetch('/api/liste/tip-imobil').then(r => r.json()),
    enabled: level === "unit",
  });

  const [step, setStep] = useState<"count" | "details">("count");
  const [count, setCount] = useState("");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const config = LEVEL_CONFIG[level];

  const resetForm = useCallback(() => {
    setStep("count");
    setCount("");
    setItems([]);
    setIsSaving(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSetCount = useCallback(() => {
    const n = parseInt(count);
    if (!n || n < 1 || n > 50) {
      toast({ title: "Introdu un numar valid (1-50)", variant: "destructive" });
      return;
    }
    const newItems: BatchItem[] = [];
    if (level === "building") {
      for (let i = 0; i < n; i++) {
        newItems.push({ name: `Bloc ${i + 1}`, files: [] });
      }
    } else if (level === "staircase") {
      for (let i = 0; i < n; i++) {
        newItems.push({ name: `Scara ${String.fromCharCode(65 + i)}`, files: [] });
      }
    } else if (level === "floor") {
      for (let i = 0; i < n; i++) {
        newItems.push({ name: i === 0 ? "Parter" : `Etaj ${i}`, files: [], floorNum: i });
      }
    } else if (level === "unit") {
      const defaultType = tipImobilItems?.[0]?.nume || "Apartament";
      for (let i = 0; i < n; i++) {
        newItems.push({ name: `${i + 1}`, unitType: defaultType, files: [] });
      }
    }
    setItems(newItems);
    setStep("details");
  }, [count, level, toast, tipImobilItems]);

  const updateItemName = useCallback((idx: number, name: string) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, name } : item));
  }, []);

  const updateItemType = useCallback((idx: number, unitType: string) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, unitType } : item));
  }, []);

  const addFileToItem = useCallback((idx: number, files: FileList | null) => {
    if (!files) return;
    const newFiles: PendingFile[] = Array.from(files).map(f => ({
      file: f,
      customName: f.name.replace(/\.[^/.]+$/, ""),
      description: "",
    }));
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, files: [...item.files, ...newFiles] } : item));
  }, []);

  const removeFileFromItem = useCallback((itemIdx: number, fileIdx: number) => {
    setItems(prev => prev.map((item, i) => i === itemIdx ? { ...item, files: item.files.filter((_, fi) => fi !== fileIdx) } : item));
  }, []);

  const handleSubmit = useCallback(async () => {
    const validItems = items.filter(item => item.name.trim());
    if (validItems.length === 0) {
      toast({ title: "Adauga cel putin un element", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      for (const item of validItems) {
        let body: Record<string, any> = {};
        let endpoint = "";
        let entityType = "";

        if (level === "building") {
          endpoint = "/api/buildings";
          entityType = "building";
          body = {
            name: item.name,
            associationId: parentId,
            address: parentAddress || undefined,
          };
        } else if (level === "staircase") {
          endpoint = "/api/staircases";
          entityType = "staircase";
          body = {
            name: item.name,
            buildingId: parentId,
          };
        } else if (level === "floor") {
          endpoint = "";
          entityType = "floor";
        } else if (level === "unit") {
          endpoint = "/api/apartments";
          entityType = "apartment";
          body = {
            staircaseId: staircaseId || parentId,
            unitType: item.unitType || "apartment",
            number: item.name,
            floor: floorNumber ?? 0,
          };
        }

        if (level === "floor") {
          if (item.files.length > 0) {
            const floorNum = item.floorNum ?? 0;
            for (const pf of item.files) {
              const uploadResult = await uploadFile(pf.file);
              if (uploadResult) {
                const ext = pf.file.name.includes(".") ? pf.file.name.substring(pf.file.name.lastIndexOf(".")) : "";
                const displayName = pf.customName?.trim() ? pf.customName.trim() + ext : pf.file.name;
                await apiRequest("POST", "/api/documents", {
                  entityType: "staircase",
                  entityId: staircaseId || parentId,
                  floorNumber: floorNum,
                  fileName: displayName,
                  originalName: displayName,
                  mimeType: pf.file.type || "application/octet-stream",
                  size: pf.file.size,
                  objectPath: uploadResult.objectPath,
                  description: pf.description || item.name,
                });
              }
            }
          }
          continue;
        }

        const res = await apiRequest("POST", endpoint, body);
        const created = await res.json();

        if (item.files.length > 0 && created.id) {
          for (const pf of item.files) {
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
      }

      if (level === "floor") {
        const maxFloor = Math.max(...validItems.map(item => item.floorNum ?? 0), 0);
        try {
          await apiRequest("PATCH", `/api/staircases/${staircaseId || parentId}`, { floors: maxFloor });
        } catch {}
        queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });

      toast({ title: `${validItems.length} ${config.pluralLabel} adaugate cu succes` });
      handleClose();
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [items, level, parentId, staircaseId, floorNumber, parentAddress, uploadFile, handleClose, toast, config]);

  return (
    <div className="flex flex-col h-full" data-testid="batch-create-panel">
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-muted/30 shrink-0">
        <div>
          <h2 className="text-sm font-semibold" data-testid="text-batch-title">{config.title}</h2>
          <p className="text-[11px] text-muted-foreground">in {parentName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} data-testid="button-batch-close">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {step === "count" && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm">{config.countLabel}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={count}
                    onChange={e => setCount(e.target.value)}
                    placeholder="Nr."
                    className="w-24"
                    autoFocus
                    data-testid="input-batch-count"
                    onKeyDown={e => { if (e.key === "Enter") handleSetCount(); }}
                  />
                  <Button onClick={handleSetCount} data-testid="button-batch-next">
                    Continua
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-3">
              {level === "building" && parentAddress && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                  Adresa: {parentAddress}
                </div>
              )}

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="border rounded-md p-2 space-y-1.5" data-testid={`batch-item-${idx}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground w-5 shrink-0 text-center">{idx + 1}</span>

                      {level === "floor" ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="text-xs font-medium" data-testid={`label-batch-floor-${idx}`}>{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">(adauga plan etaj daca ai)</span>
                        </div>
                      ) : level === "unit" ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <Select value={item.unitType || tipImobilItems?.[0]?.nume || "Apartament"} onValueChange={v => updateItemType(idx, v)}>
                            <SelectTrigger className="w-28 h-7 text-xs" data-testid={`select-batch-type-${idx}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(tipImobilItems || []).map((tip: any) => (
                                <SelectItem key={tip.id} value={tip.nume}>{tip.nume}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={item.name}
                            onChange={e => updateItemName(idx, e.target.value)}
                            placeholder="Nr."
                            className="flex-1 h-7 text-xs"
                            data-testid={`input-batch-name-${idx}`}
                          />
                        </div>
                      ) : (
                        <Input
                          value={item.name}
                          onChange={e => updateItemName(idx, e.target.value)}
                          placeholder={`Nume ${config.itemLabel.toLowerCase()}`}
                          className="flex-1 h-7 text-xs"
                          data-testid={`input-batch-name-${idx}`}
                        />
                      )}

                      <label className="shrink-0">
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          className="hidden"
                          onChange={e => addFileToItem(idx, e.target.files)}
                          data-testid={`input-batch-file-${idx}`}
                        />
                        <Button size="icon" variant="ghost" className="w-6 h-6" asChild>
                          <span><Upload className="w-3 h-3" /></span>
                        </Button>
                      </label>

                      {level !== "floor" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 text-destructive"
                          onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                          data-testid={`button-remove-batch-${idx}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {item.files.length > 0 && (
                      <div className="pl-5 space-y-1">
                        {item.files.map((pf, fi) => {
                          const FIcon = getFileIcon(pf.file.type);
                          return (
                            <div key={fi} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <FIcon className="w-3 h-3 shrink-0" />
                              <span className="truncate">{pf.file.name}</span>
                              <span className="shrink-0">({formatFileSize(pf.file.size)})</span>
                              <Button size="icon" variant="ghost" className="w-4 h-4 shrink-0" onClick={() => removeFileFromItem(idx, fi)}>
                                <X className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {level !== "floor" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    const newItem: BatchItem = level === "unit"
                      ? { name: `${items.length + 1}`, unitType: tipImobilItems?.[0]?.nume || "Apartament", files: [] }
                      : { name: "", files: [] };
                    setItems(prev => [...prev, newItem]);
                  }}
                  data-testid="button-add-batch-item"
                >
                  <Plus className="w-3 h-3 mr-0.5" /> Adauga {config.itemLabel.toLowerCase()}
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end gap-2 px-4 py-2 border-t shrink-0 bg-background">
        {step === "details" && (
          <Button variant="outline" size="sm" onClick={() => setStep("count")} disabled={isSaving || isUploading} data-testid="button-batch-back">
            Inapoi
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleClose} disabled={isSaving || isUploading} data-testid="button-batch-cancel">
          Anuleaza
        </Button>
        {step === "details" && (
          <Button size="sm" onClick={handleSubmit} disabled={isSaving || isUploading} data-testid="button-batch-save">
            {(isSaving || isUploading) && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            Salveaza {items.filter(i => i.name.trim()).length} {config.pluralLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
