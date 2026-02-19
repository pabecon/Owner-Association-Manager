import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Document } from "@shared/schema";
import {
  Upload, FileText, Image, File, Trash2, Download, Loader2, Paperclip, X
} from "lucide-react";

interface DocumentManagerProps {
  entityType: string;
  entityId: string;
  floorNumber?: number;
  title?: string;
  compact?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType === "application/pdf") return FileText;
  return File;
}

function getMimeLabel(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Imagine";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("word") || mimeType.includes("document")) return "Document";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "Tabel";
  return "Fisier";
}

interface StagedFile {
  file: File;
  customName: string;
  description: string;
}

export function DocumentManager({ entityType, entityId, floorNumber, title, compact }: DocumentManagerProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const { toast } = useToast();

  const queryKey = floorNumber !== undefined
    ? ["/api/documents", entityType, entityId, { floorNumber }]
    : ["/api/documents", entityType, entityId];

  const fetchUrl = floorNumber !== undefined
    ? `/api/documents/${entityType}/${entityId}?floorNumber=${floorNumber}`
    : `/api/documents/${entityType}/${entityId}`;

  const { data: docs, isLoading } = useQuery<Document[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const { uploadFile, isUploading } = useUpload({
    onError: (error) => {
      toast({ title: "Eroare la incarcare", description: error.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { fileName: string; originalName: string; mimeType: string; size: number; objectPath: string; description: string }) => {
      const res = await apiRequest("POST", "/api/documents", {
        entityType,
        entityId,
        floorNumber: floorNumber ?? null,
        ...data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Document adaugat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      await apiRequest("DELETE", `/api/documents/${docId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Document sters" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const handleUpload = useCallback(async () => {
    if (stagedFiles.length === 0) return;

    for (const sf of stagedFiles) {
      const result = await uploadFile(sf.file);
      if (result) {
        const ext = sf.file.name.includes(".") ? sf.file.name.substring(sf.file.name.lastIndexOf(".")) : "";
        const displayName = sf.customName?.trim() ? sf.customName.trim() + ext : sf.file.name;
        await saveMutation.mutateAsync({
          fileName: displayName,
          originalName: displayName,
          mimeType: sf.file.type || "application/octet-stream",
          size: sf.file.size,
          objectPath: result.objectPath,
          description: sf.description,
        });
      }
    }

    setStagedFiles([]);
    setShowUploadDialog(false);
  }, [stagedFiles, uploadFile, saveMutation]);

  const docCount = docs?.length || 0;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{title || "Documente"}</span>
            {docCount > 0 && (
              <Badge variant="secondary" className="text-xs">{docCount}</Badge>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowUploadDialog(true)} data-testid={`button-upload-${entityType}-${entityId}`}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Incarca
          </Button>
        </div>

        {isLoading && <Skeleton className="h-8 w-full" />}

        {docs && docs.length > 0 && (
          <div className="space-y-1.5">
            {docs.map(doc => {
              const Icon = getFileIcon(doc.mimeType);
              return (
                <div key={doc.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-muted/50" data-testid={`doc-item-${doc.id}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs truncate">{doc.originalName}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatFileSize(doc.size)}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={doc.objectPath} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="h-6 w-6" data-testid={`button-download-doc-${doc.id}`}>
                        <Download className="w-3 h-3" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-doc-${doc.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <UploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          title={title || "Documente"}
          stagedFiles={stagedFiles}
          onStagedFilesChange={setStagedFiles}
          onUpload={handleUpload}
          isUploading={isUploading || saveMutation.isPending}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{title || "Documente"}</span>
            {docCount > 0 && (
              <Badge variant="secondary" className="text-xs">{docCount}</Badge>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowUploadDialog(true)} data-testid={`button-upload-${entityType}-${entityId}`}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Incarca Documente
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {docs && docs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Niciun document atasat</p>
        )}

        {docs && docs.length > 0 && (
          <div className="space-y-2">
            {docs.map(doc => {
              const Icon = getFileIcon(doc.mimeType);
              return (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/40" data-testid={`doc-item-${doc.id}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.originalName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getMimeLabel(doc.mimeType)}</span>
                        <span>{formatFileSize(doc.size)}</span>
                        {doc.description && <span>- {doc.description}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={doc.objectPath} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" data-testid={`button-download-doc-${doc.id}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-doc-${doc.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <UploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          title={title || "Documente"}
          stagedFiles={stagedFiles}
          onStagedFilesChange={setStagedFiles}
          onUpload={handleUpload}
          isUploading={isUploading || saveMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  title,
  stagedFiles,
  onStagedFilesChange,
  onUpload,
  isUploading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  stagedFiles: StagedFile[];
  onStagedFilesChange: (files: StagedFile[]) => void;
  onUpload: () => void;
  isUploading: boolean;
}) {
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: StagedFile[] = Array.from(files).map(f => ({
      file: f,
      customName: f.name.replace(/\.[^/.]+$/, ""),
      description: "",
    }));
    onStagedFilesChange([...stagedFiles, ...newFiles]);
  };

  const updateName = (idx: number, name: string) => {
    onStagedFilesChange(stagedFiles.map((sf, i) => i === idx ? { ...sf, customName: name } : sf));
  };

  const updateDescription = (idx: number, desc: string) => {
    onStagedFilesChange(stagedFiles.map((sf, i) => i === idx ? { ...sf, description: desc } : sf));
  };

  const removeFile = (idx: number) => {
    onStagedFilesChange(stagedFiles.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onStagedFilesChange([]); onOpenChange(v); }}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Incarca {title}</DialogTitle>
          <DialogDescription>Selecteaza fisierele pe care doresti sa le atasezi. Poti numi fiecare document.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {stagedFiles.length > 0 && (
            <div className="space-y-3">
              {stagedFiles.map((sf, idx) => {
                const Icon = getFileIcon(sf.file.type);
                return (
                  <div key={idx} className="px-3 py-2 rounded-md bg-muted/50 space-y-1.5" data-testid={`staged-file-${idx}`}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{sf.file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">({formatFileSize(sf.file.size)})</span>
                      <div className="flex-1" />
                      <Button size="icon" variant="ghost" onClick={() => removeFile(idx)} data-testid={`button-remove-staged-${idx}`}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Input
                      className="text-sm"
                      placeholder="Nume document..."
                      value={sf.customName}
                      onChange={e => updateName(idx, e.target.value)}
                      data-testid={`input-staged-name-${idx}`}
                    />
                    <Input
                      className="text-xs"
                      placeholder="Descriere (optional)..."
                      value={sf.description}
                      onChange={e => updateDescription(idx, e.target.value)}
                      data-testid={`input-staged-desc-${idx}`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              data-testid="input-file-upload"
            />
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/30 cursor-pointer hover-elevate text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              <span>Adauga fisiere (imagini, PDF, documente)</span>
            </div>
          </label>

          <Button
            className="w-full"
            onClick={onUpload}
            disabled={stagedFiles.length === 0 || isUploading}
            data-testid="button-confirm-upload"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Se incarca...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Incarca {stagedFiles.length > 0 ? `${stagedFiles.length} fisier(e)` : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
