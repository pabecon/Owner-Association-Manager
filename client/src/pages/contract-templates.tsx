import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2, Download, Upload, File, FileSpreadsheet, FileIcon } from "lucide-react";
import type { ContractTemplate } from "@shared/schema";

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return <FileText className="w-8 h-8 text-red-500" />;
  if (["doc", "docx", "odt"].includes(ext)) return <FileIcon className="w-8 h-8 text-blue-500" />;
  if (["xls", "xlsx"].includes(ext)) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
  return <File className="w-8 h-8 text-muted-foreground" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ContractTemplatesPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: templates, isLoading } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contract-templates"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/contract-templates/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Eroare la incarcare");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
      toast({ title: "Sablon incarcat cu succes" });
      resetForm();
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contract-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
      toast({ title: "Sablon sters cu succes" });
      setDeleteId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  function resetForm() {
    setAddOpen(false);
    setName("");
    setDescription("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    if (!selectedFile) {
      toast({ title: "Selectati un fisier", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Introduceti un nume pentru sablon", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    uploadMutation.mutate(formData);
  }

  function handleDownload(template: ContractTemplate) {
    window.open(`/api/contract-templates/${template.id}/download`, "_blank");
  }

  const templateToDelete = deleteId ? templates?.find(t => t.id === deleteId) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <h1 className="text-sm font-bold" data-testid="text-templates-title">Sabloane Contracte</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Sabloane de documente pentru contractele de administrare</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)} data-testid="button-add-template">
            <Plus className="w-4 h-4" />
            Adauga Sablon
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : !templates?.length ? (
          <Card className="p-8 text-center" data-testid="text-no-templates">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nu exista sabloane de contracte.</p>
            <p className="text-xs text-muted-foreground mt-1">Adaugati un sablon pentru a incepe.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {templates.map(template => (
              <Card key={template.id} className="p-3" data-testid={`card-template-${template.id}`}>
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {getFileIcon(template.documentName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate" data-testid={`text-template-name-${template.id}`}>
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2" data-testid={`text-template-desc-${template.id}`}>
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted-foreground" data-testid={`text-template-file-${template.id}`}>
                        {template.documentName}
                      </span>
                      {template.createdAt && (
                        <span className="text-[11px] text-muted-foreground">
                          · {new Date(template.createdAt).toLocaleDateString("ro-RO")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(template)}
                      data-testid={`button-download-template-${template.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(template.id)}
                      data-testid={`button-delete-template-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={(val) => { if (!val) resetForm(); else setAddOpen(true); }}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-add-template">
          <DialogHeader>
            <DialogTitle>Adauga Sablon Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nume sablon *</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Contract administrare standard"
                data-testid="input-template-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Descriere</Label>
              <Textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descriere optionala a sablonului..."
                rows={2}
                data-testid="input-template-description"
              />
            </div>
            <div className="space-y-2">
              <Label>Document *</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone-template-file"
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    {getFileIcon(selectedFile.name)}
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Click pentru a selecta un fisier</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">PDF, DOC, DOCX, ODT, XLS, XLSX (max 20MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.odt,.xls,.xlsx,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                data-testid="input-template-file"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm} data-testid="button-cancel-template">
              Anuleaza
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={uploadMutation.isPending || !name.trim() || !selectedFile}
              data-testid="button-submit-template"
            >
              {uploadMutation.isPending ? "Se incarca..." : "Incarca Sablon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(val) => { if (!val) setDeleteId(null); }}>
        <AlertDialogContent data-testid="dialog-delete-template">
          <AlertDialogHeader>
            <AlertDialogTitle>Stergere sablon</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteti sigur ca doriti sa stergeti sablonul "{templateToDelete?.name}"? Aceasta actiune este ireversibila.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-template">Anuleaza</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-template"
            >
              {deleteMutation.isPending ? "Se sterge..." : "Sterge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
