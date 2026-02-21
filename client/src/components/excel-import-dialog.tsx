import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Building2, ArrowUpDown, Home, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Federation } from "@shared/schema";

interface PreviewData {
  headers: string[];
  totalRows: number;
  preview: Record<string, any>[];
  detectedColumns: { tip: string | null; bloc: string | null; scara: string | null };
  summary: { buildings: number; staircases: number; units: number };
}

interface ImportResult {
  message: string;
  associationId: string;
  associationName: string;
  stats: { buildings: number; staircases: number; units: number };
}

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcelImportDialog({ open, onOpenChange }: ExcelImportDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [associationName, setAssociationName] = useState("");
  const [cui, setCui] = useState("");
  const [address, setAddress] = useState("");
  const [federationId, setFederationId] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "config" | "done">("upload");

  const { data: federations } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });

  const previewMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/import-excel/preview", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Eroare la previzualizare");
      }
      return res.json() as Promise<PreviewData>;
    },
    onSuccess: (data) => {
      setPreview(data);
      setStep("preview");
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Niciun fisier selectat");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("associationName", associationName);
      if (cui) formData.append("cui", cui);
      if (address) formData.append("address", address);
      if (federationId && federationId !== "none") formData.append("federationId", federationId);
      const res = await fetch("/api/import-excel", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Eroare la import");
      }
      return res.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: "Import finalizat cu succes!" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare la import", description: error.message, variant: "destructive" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    previewMutation.mutate(selectedFile);
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setAssociationName("");
    setCui("");
    setAddress("");
    setFederationId("");
    setResult(null);
    setStep("upload");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import Asociatie din Excel
          </DialogTitle>
          <DialogDescription>
            Incarcati un fisier Excel pentru a crea automat o asociatie cu blocuri, scari si unitati.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-excel"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-excel-file"
              />
              {previewMutation.isPending ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Se proceseaza fisierul...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Click pentru a selecta fisierul Excel</p>
                  <p className="text-xs text-muted-foreground">Formate acceptate: .xlsx, .xls, .csv</p>
                </div>
              )}
            </div>

            <Card>
              <CardContent className="p-3">
                <p className="text-xs font-medium mb-2">Coloanele acceptate in Excel:</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <span>• <strong>Tip</strong> - Apartament / Box / Parking</span>
                  <span>• <strong>Bloc</strong> - Numele blocului *</span>
                  <span>• <strong>Scara</strong> - Scara / intrarea</span>
                  <span>• <strong>Etaj</strong> - Numarul etajului</span>
                  <span>• <strong>Nr / Numar</strong> - Numarul unitatii</span>
                  <span>• <strong>Camere</strong> - Nr. camere</span>
                  <span>• <strong>Suprafata</strong> - Suprafata utila (mp)</span>
                  <span>• <strong>Nr. Camera / Suprafata Camera</strong> - Detalii camere</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "preview" && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">{file?.name}</span>
                <Badge variant="secondary">{preview.totalRows} randuri</Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <Building2 className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold" data-testid="text-preview-buildings">{preview.summary.buildings}</p>
                  <p className="text-xs text-muted-foreground">Blocuri</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <ArrowUpDown className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold" data-testid="text-preview-staircases">{preview.summary.staircases}</p>
                  <p className="text-xs text-muted-foreground">Scari</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <Home className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold" data-testid="text-preview-units">{preview.summary.units}</p>
                  <p className="text-xs text-muted-foreground">Unitati</p>
                </CardContent>
              </Card>
            </div>

            {preview.detectedColumns && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Coloane detectate:</span>
                {preview.detectedColumns.tip && <Badge variant="outline" className="text-[10px]">Tip: {preview.detectedColumns.tip}</Badge>}
                {preview.detectedColumns.bloc && <Badge variant="outline" className="text-[10px]">Bloc: {preview.detectedColumns.bloc}</Badge>}
                {preview.detectedColumns.scara && <Badge variant="outline" className="text-[10px]">Scara: {preview.detectedColumns.scara}</Badge>}
              </div>
            )}

            <div className="overflow-x-auto max-h-[200px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {preview.headers.map(h => (
                      <TableHead key={h} className="text-xs whitespace-nowrap py-1">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.preview.slice(0, 10).map((row, idx) => (
                    <TableRow key={idx}>
                      {preview.headers.map(h => (
                        <TableCell key={h} className="text-xs py-1 whitespace-nowrap">{String(row[h] ?? "")}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setStep("upload"); setFile(null); setPreview(null); }} data-testid="button-back-upload">
                Inapoi
              </Button>
              <Button onClick={() => setStep("config")} data-testid="button-continue-config">
                Continua
              </Button>
            </div>
          </div>
        )}

        {step === "config" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Numele Asociatiei *</Label>
                <Input
                  value={associationName}
                  onChange={e => setAssociationName(e.target.value)}
                  placeholder="ex: Asociatia Bloc A1-A3"
                  data-testid="input-import-assoc-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">CUI</Label>
                  <Input
                    value={cui}
                    onChange={e => setCui(e.target.value)}
                    placeholder="ex: RO12345678"
                    data-testid="input-import-cui"
                  />
                </div>
                <div>
                  <Label className="text-sm">Adresa</Label>
                  <Input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="ex: Str. Exemplu nr. 1"
                    data-testid="input-import-address"
                  />
                </div>
              </div>
              {federations && federations.length > 0 && (
                <div>
                  <Label className="text-sm">Federatie (optional)</Label>
                  <Select value={federationId} onValueChange={setFederationId}>
                    <SelectTrigger data-testid="select-import-federation">
                      <SelectValue placeholder="Fara federatie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Fara federatie</SelectItem>
                      {federations.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {preview && (
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Se vor crea:</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span><strong>{preview.summary.buildings}</strong> blocuri</span>
                    <span><strong>{preview.summary.staircases}</strong> scari</span>
                    <span><strong>{preview.summary.units}</strong> unitati</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep("preview")} data-testid="button-back-preview">
                Inapoi
              </Button>
              <Button
                onClick={() => importMutation.mutate()}
                disabled={!associationName.trim() || importMutation.isPending}
                data-testid="button-start-import"
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Import in curs...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    Importa Asociatia
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && result && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <p className="text-lg font-bold">Import finalizat!</p>
              <p className="text-sm text-muted-foreground">Asociatia <strong>{result.associationName}</strong> a fost creata cu succes.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">{result.stats.buildings}</p>
                  <p className="text-xs text-muted-foreground">Blocuri create</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">{result.stats.staircases}</p>
                  <p className="text-xs text-muted-foreground">Scari create</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">{result.stats.units}</p>
                  <p className="text-xs text-muted-foreground">Unitati create</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleClose} data-testid="button-close-import">
                Inchide
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
