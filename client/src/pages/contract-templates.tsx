import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Plus, Trash2, Download, Upload, File, FileSpreadsheet, FileIcon,
  ChevronDown, ChevronRight, GripVertical, Pencil, Save, X, Database,
  BookOpen, ArrowUp, ArrowDown, Eye
} from "lucide-react";
import type { ContractTemplate, ChapterCatalog, TemplateChapter, TemplateArticle } from "@shared/schema";

interface FieldRef {
  key: string;
  label: string;
}

interface FieldCategory {
  category: string;
  fields: FieldRef[];
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return <FileText className="w-8 h-8 text-red-500" />;
  if (["doc", "docx", "odt"].includes(ext)) return <FileIcon className="w-8 h-8 text-blue-500" />;
  if (["xls", "xlsx"].includes(ext)) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
  return <File className="w-8 h-8 text-muted-foreground" />;
}

function FieldReferencePicker({ onInsert }: { onInsert: (field: FieldRef) => void }) {
  const { data: fieldCategories } = useQuery<FieldCategory[]>({
    queryKey: ["/api/contract-field-references"],
  });

  return (
    <div className="w-72 max-h-80 overflow-y-auto" data-testid="field-reference-picker">
      <div className="p-2 border-b">
        <p className="text-xs font-semibold text-muted-foreground">Inserează câmp din baza de date</p>
      </div>
      {fieldCategories?.map((cat) => (
        <Collapsible key={cat.category} defaultOpen={false}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 hover:bg-accent text-sm font-medium">
            <ChevronRight className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-90" />
            <Database className="w-3 h-3 text-muted-foreground" />
            {cat.category}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {cat.fields.map((field) => (
              <button
                key={field.key}
                className="w-full text-left px-6 py-1.5 text-xs hover:bg-accent/50 transition-colors"
                onClick={() => onInsert(field)}
                data-testid={`field-ref-${field.key}`}
              >
                {field.label}
                <span className="text-muted-foreground ml-1">({`{{${field.key}}}`})</span>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

function ArticleContentDisplay({ content }: { content: string }) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const fieldKey = part.slice(2, -2);
          return (
            <Badge key={i} variant="secondary" className="mx-0.5 text-[10px] py-0 px-1 font-mono">
              {fieldKey}
            </Badge>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function ArticleEditor({
  article,
  onSave,
  onCancel,
}: {
  article?: TemplateArticle;
  onSave: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertField = useCallback((field: FieldRef) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + `{{${field.key}}}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const placeholder = `{{${field.key}}}`;
    const newContent = content.substring(0, start) + placeholder + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPos = start + placeholder.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }, [content]);

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-background" data-testid="article-editor">
      <div className="space-y-1.5">
        <Label className="text-xs">Titlu articol</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ex: Articolul 1 - Obiectul contractului"
          className="text-sm h-8"
          data-testid="input-article-title"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Conținut</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1" data-testid="button-insert-field">
                <Database className="w-3 h-3" />
                Inserează Câmp
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="end">
              <FieldReferencePicker onInsert={handleInsertField} />
            </PopoverContent>
          </Popover>
        </div>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conținutul articolului... Folosiți butonul 'Inserează Câmp' pentru a adăuga referințe la baza de date."
          rows={4}
          className="text-sm font-mono"
          data-testid="input-article-content"
        />
        {content && content.includes("{{") && (
          <div className="p-2 bg-muted/50 rounded text-xs">
            <span className="text-muted-foreground font-medium">Previzualizare: </span>
            <ArticleContentDisplay content={content} />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-xs" data-testid="button-cancel-article">
          <X className="w-3 h-3 mr-1" />
          Anulează
        </Button>
        <Button size="sm" onClick={() => onSave({ title, content })} className="h-7 text-xs" data-testid="button-save-article">
          <Save className="w-3 h-3 mr-1" />
          Salvează
        </Button>
      </div>
    </div>
  );
}

function ChapterSection({
  chapter,
  chapterName,
  templateId,
  index,
  totalChapters,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  chapter: TemplateChapter;
  chapterName: string;
  templateId: string;
  index: number;
  totalChapters: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [addingArticle, setAddingArticle] = useState(false);

  const { data: articles, isLoading: articlesLoading } = useQuery<TemplateArticle[]>({
    queryKey: ["/api/template-chapters", chapter.id, "articles"],
    queryFn: async () => {
      const res = await fetch(`/api/template-chapters/${chapter.id}/articles`, { credentials: "include" });
      if (!res.ok) throw new Error("Eroare la încărcarea articolelor");
      return res.json();
    },
    enabled: isOpen,
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiRequest("POST", `/api/template-chapters/${chapter.id}/articles`, {
        ...data,
        orderIndex: (articles?.length || 0),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/template-chapters", chapter.id, "articles"] });
      setAddingArticle(false);
      toast({ title: "Articol adăugat" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string } }) =>
      apiRequest("PATCH", `/api/template-articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/template-chapters", chapter.id, "articles"] });
      setEditingArticleId(null);
      toast({ title: "Articol actualizat" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/template-articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/template-chapters", chapter.id, "articles"] });
      toast({ title: "Articol șters" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="border rounded-lg" data-testid={`chapter-section-${chapter.id}`}>
      <div className="flex items-center gap-2 p-2 bg-muted/30">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
        <button
          className="flex items-center gap-1.5 flex-1 text-left"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`button-toggle-chapter-${chapter.id}`}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <BookOpen className="w-4 h-4 text-primary/70" />
          <span className="text-sm font-medium">{chapterName}</span>
          {articles && <Badge variant="outline" className="text-[10px] ml-1">{articles.length} art.</Badge>}
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp} disabled={index === 0} data-testid={`button-move-up-${chapter.id}`}>
            <ArrowUp className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown} disabled={index === totalChapters - 1} data-testid={`button-move-down-${chapter.id}`}>
            <ArrowDown className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete} data-testid={`button-delete-chapter-${chapter.id}`}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="p-3 space-y-2">
          {articlesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              {articles?.map((article, artIndex) => (
                <div key={article.id}>
                  {editingArticleId === article.id ? (
                    <ArticleEditor
                      article={article}
                      onSave={(data) => updateArticleMutation.mutate({ id: article.id, data })}
                      onCancel={() => setEditingArticleId(null)}
                    />
                  ) : (
                    <div className="flex items-start gap-2 p-2 rounded border bg-background hover:bg-accent/30 transition-colors" data-testid={`article-item-${article.id}`}>
                      <span className="text-xs text-muted-foreground font-mono shrink-0 mt-0.5">{artIndex + 1}.</span>
                      <div className="flex-1 min-w-0">
                        {article.title && (
                          <p className="text-xs font-semibold truncate">{article.title}</p>
                        )}
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          <ArticleContentDisplay content={article.content} />
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingArticleId(article.id)}
                          data-testid={`button-edit-article-${article.id}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deleteArticleMutation.mutate(article.id)}
                          data-testid={`button-delete-article-${article.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {addingArticle ? (
                <ArticleEditor
                  onSave={(data) => createArticleMutation.mutate(data)}
                  onCancel={() => setAddingArticle(false)}
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-xs gap-1"
                  onClick={() => setAddingArticle(true)}
                  data-testid={`button-add-article-${chapter.id}`}
                >
                  <Plus className="w-3 h-3" />
                  Adaugă Articol
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TemplateBuilder({
  template,
  onClose,
  onCreated,
}: {
  template?: ContractTemplate;
  onClose: () => void;
  onCreated?: (t: ContractTemplate) => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [customChapterName, setCustomChapterName] = useState("");
  const [newCatalogName, setNewCatalogName] = useState("");

  const isEditing = !!template;

  const { data: catalog } = useQuery<ChapterCatalog[]>({
    queryKey: ["/api/contract-chapter-catalog"],
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery<TemplateChapter[]>({
    queryKey: ["/api/contract-templates", template?.id, "chapters"],
    queryFn: async () => {
      const res = await fetch(`/api/contract-templates/${template!.id}/chapters`, { credentials: "include" });
      if (!res.ok) throw new Error("Eroare");
      return res.json();
    },
    enabled: !!template?.id,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/contract-templates", {
        name: name.trim(),
        description: description.trim() || null,
        documentPath: null,
        documentName: null,
      });
      return await res.json() as ContractTemplate;
    },
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
      toast({ title: "Șablon creat cu succes. Adăugați capitole." });
      if (onCreated) onCreated(newTemplate);
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const addChapterMutation = useMutation({
    mutationFn: async (data: { chapterCatalogId?: string; customName?: string }) => {
      const currentChapters = chapters || [];
      return apiRequest("POST", `/api/contract-templates/${template!.id}/chapters`, {
        chapterCatalogId: data.chapterCatalogId || null,
        customName: data.customName || null,
        orderIndex: currentChapters.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates", template?.id, "chapters"] });
      setAddChapterOpen(false);
      setSelectedCatalogId("");
      setCustomChapterName("");
      toast({ title: "Capitol adăugat" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/template-chapters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates", template?.id, "chapters"] });
      toast({ title: "Capitol șters" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (order: string[]) =>
      apiRequest("PUT", `/api/contract-templates/${template!.id}/chapters/reorder`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates", template?.id, "chapters"] });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const createCatalogEntryMutation = useMutation({
    mutationFn: (data: { name: string }) => apiRequest("POST", "/api/contract-chapter-catalog", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-chapter-catalog"] });
      setNewCatalogName("");
      toast({ title: "Capitol nou adăugat în catalog" });
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const handleMoveChapter = (idx: number, direction: "up" | "down") => {
    if (!chapters) return;
    const newOrder = [...chapters.map(c => c.id)];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    reorderMutation.mutate(newOrder);
  };

  const getChapterName = (chapter: TemplateChapter): string => {
    if (chapter.customName) return chapter.customName;
    if (chapter.chapterCatalogId && catalog) {
      const cat = catalog.find(c => c.id === chapter.chapterCatalogId);
      if (cat) return cat.name;
    }
    return "Capitol fără nume";
  };

  const handleAddChapter = () => {
    if (selectedCatalogId) {
      addChapterMutation.mutate({ chapterCatalogId: selectedCatalogId });
    } else if (customChapterName.trim()) {
      addChapterMutation.mutate({ customName: customChapterName.trim() });
    }
  };

  if (!isEditing) {
    return (
      <Card className="p-4 space-y-4" data-testid="template-builder-new">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Creează Șablon Nou
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} data-testid="button-close-builder">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Introduceți numele și descrierea șablonului. După salvare, puteți adăuga capitole și articole.
        </p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nume șablon *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Contract administrare standard"
              className="text-sm"
              data-testid="input-builder-template-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Descriere</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descriere opțională..."
              rows={2}
              className="text-sm"
              data-testid="input-builder-template-desc"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} data-testid="button-cancel-new-template">
            Anulează
          </Button>
          <Button
            size="sm"
            onClick={() => createTemplateMutation.mutate()}
            disabled={!name.trim() || createTemplateMutation.isPending}
            data-testid="button-save-new-template"
          >
            {createTemplateMutation.isPending ? "Se salvează..." : "Salvează și Continuă"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4" data-testid="template-builder-edit">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Editare Șablon: {template.name}
        </h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} data-testid="button-close-builder">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capitole</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setAddChapterOpen(true)}
            data-testid="button-add-chapter"
          >
            <Plus className="w-3 h-3" />
            Adaugă Capitol
          </Button>
        </div>

        {chaptersLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !chapters?.length ? (
          <div className="text-center py-6 text-muted-foreground" data-testid="text-no-chapters">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Nu există capitole. Adăugați capitole din catalogul disponibil.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter, idx) => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                chapterName={getChapterName(chapter)}
                templateId={template.id}
                index={idx}
                totalChapters={chapters.length}
                onMoveUp={() => handleMoveChapter(idx, "up")}
                onMoveDown={() => handleMoveChapter(idx, "down")}
                onDelete={() => deleteChapterMutation.mutate(chapter.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-add-chapter">
          <DialogHeader>
            <DialogTitle>Adaugă Capitol</DialogTitle>
            <DialogDescription>Selectați un capitol din catalog sau creați unul nou.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Selectează din catalog</Label>
              <Select value={selectedCatalogId} onValueChange={(val) => { setSelectedCatalogId(val); setCustomChapterName(""); }}>
                <SelectTrigger data-testid="select-catalog-chapter">
                  <SelectValue placeholder="Alege un capitol..." />
                </SelectTrigger>
                <SelectContent>
                  {catalog?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">sau</span>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Nume capitol personalizat</Label>
              <Input
                value={customChapterName}
                onChange={(e) => { setCustomChapterName(e.target.value); setSelectedCatalogId(""); }}
                placeholder="ex: Dispoziții Tranzitorii"
                className="text-sm"
                data-testid="input-custom-chapter-name"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Adaugă un capitol nou în catalog</Label>
              <div className="flex gap-2">
                <Input
                  value={newCatalogName}
                  onChange={(e) => setNewCatalogName(e.target.value)}
                  placeholder="Nume capitol nou..."
                  className="text-sm flex-1"
                  data-testid="input-new-catalog-entry"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => newCatalogName.trim() && createCatalogEntryMutation.mutate({ name: newCatalogName.trim() })}
                  disabled={!newCatalogName.trim() || createCatalogEntryMutation.isPending}
                  data-testid="button-add-catalog-entry"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddChapterOpen(false)} data-testid="button-cancel-add-chapter">
              Anulează
            </Button>
            <Button
              onClick={handleAddChapter}
              disabled={(!selectedCatalogId && !customChapterName.trim()) || addChapterMutation.isPending}
              data-testid="button-confirm-add-chapter"
            >
              {addChapterMutation.isPending ? "Se adaugă..." : "Adaugă"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function ContractTemplatesPage() {
  const { toast } = useToast();
  const [builderMode, setBuilderMode] = useState<"none" | "new" | "edit">("none");
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addFileOpen, setAddFileOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
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
        throw new Error(err.message || "Eroare la încărcare");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
      toast({ title: "Șablon încărcat cu succes" });
      resetFileForm();
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contract-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
      toast({ title: "Șablon șters cu succes" });
      setDeleteId(null);
      if (editingTemplate?.id === deleteId) {
        setBuilderMode("none");
        setEditingTemplate(null);
      }
    },
    onError: (err: Error) => {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    },
  });

  function resetFileForm() {
    setAddFileOpen(false);
    setFileName("");
    setFileDescription("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileSubmit() {
    if (!selectedFile || !fileName.trim()) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", fileName.trim());
    formData.append("description", fileDescription.trim());
    uploadMutation.mutate(formData);
  }

  function handleEditTemplate(template: ContractTemplate) {
    setEditingTemplate(template);
    setBuilderMode("edit");
  }

  function handleNewTemplate() {
    setEditingTemplate(null);
    setBuilderMode("new");
  }

  const templateToDelete = deleteId ? templates?.find(t => t.id === deleteId) : null;

  const structuredTemplates = templates?.filter(t => !t.documentPath) || [];
  const fileTemplates = templates?.filter(t => !!t.documentPath) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <h1 className="text-sm font-bold" data-testid="text-templates-title">Șabloane Contracte</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Modele structurate și documente pentru contracte de administrare</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5" onClick={handleNewTemplate} data-testid="button-add-template">
              <Plus className="w-4 h-4" />
              Creează Șablon
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAddFileOpen(true)} data-testid="button-upload-file-template">
              <Upload className="w-4 h-4" />
              Încarcă Document
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : !templates?.length && builderMode === "none" ? (
          <Card className="p-8 text-center" data-testid="text-no-templates">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nu există șabloane de contracte.</p>
            <p className="text-xs text-muted-foreground mt-1">Creați un șablon structurat sau încărcați un document.</p>
          </Card>
        ) : (
          <>
            {structuredTemplates.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Șabloane Structurate</h2>
                {structuredTemplates.map(template => (
                  <Card
                    key={template.id}
                    className={`p-3 cursor-pointer transition-colors ${editingTemplate?.id === template.id ? 'ring-2 ring-primary' : 'hover:bg-accent/30'}`}
                    onClick={() => handleEditTemplate(template)}
                    data-testid={`card-template-${template.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-primary/70 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate" data-testid={`text-template-name-${template.id}`}>
                          {template.name}
                        </h3>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2" data-testid={`text-template-desc-${template.id}`}>
                            {template.description}
                          </p>
                        )}
                        {template.createdAt && (
                          <span className="text-[11px] text-muted-foreground">
                            Creat: {new Date(template.createdAt).toLocaleDateString("ro-RO")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); handleEditTemplate(template); }}
                          data-testid={`button-edit-template-${template.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteId(template.id); }}
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

            {fileTemplates.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Documente Încărcate</h2>
                {fileTemplates.map(template => (
                  <Card key={template.id} className="p-3" data-testid={`card-template-${template.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {getFileIcon(template.documentName || "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate" data-testid={`text-template-name-${template.id}`}>
                          {template.name}
                        </h3>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-muted-foreground">{template.documentName}</span>
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
                          onClick={() => window.open(`/api/contract-templates/${template.id}/download`, "_blank")}
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
          </>
        )}

        {builderMode !== "none" && (
          <>
            <Separator />
            <TemplateBuilder
              template={builderMode === "edit" ? editingTemplate! : undefined}
              onClose={() => {
                setBuilderMode("none");
                setEditingTemplate(null);
                queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
              }}
              onCreated={(newTemplate) => {
                setEditingTemplate(newTemplate);
                setBuilderMode("edit");
                queryClient.invalidateQueries({ queryKey: ["/api/contract-templates"] });
              }}
            />
          </>
        )}
      </div>

      <Dialog open={addFileOpen} onOpenChange={(val) => { if (!val) resetFileForm(); else setAddFileOpen(true); }}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-upload-file-template">
          <DialogHeader>
            <DialogTitle>Încarcă Document Șablon</DialogTitle>
            <DialogDescription>Încărcați un document (PDF, DOC, DOCX) ca șablon de contract.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="file-template-name">Nume șablon *</Label>
              <Input
                id="file-template-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="ex: Contract administrare standard"
                data-testid="input-file-template-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-template-description">Descriere</Label>
              <Textarea
                id="file-template-description"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Descriere opțională..."
                rows={2}
                data-testid="input-file-template-description"
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
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Click pentru a selecta un fișier</p>
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
            <Button variant="outline" onClick={resetFileForm} data-testid="button-cancel-file-template">
              Anulează
            </Button>
            <Button
              onClick={handleFileSubmit}
              disabled={uploadMutation.isPending || !fileName.trim() || !selectedFile}
              data-testid="button-submit-file-template"
            >
              {uploadMutation.isPending ? "Se încarcă..." : "Încarcă"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(val) => { if (!val) setDeleteId(null); }}>
        <AlertDialogContent data-testid="dialog-delete-template">
          <AlertDialogHeader>
            <AlertDialogTitle>Ștergere șablon</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteți sigur că doriți să ștergeți șablonul "{templateToDelete?.name}"? Această acțiune este ireversibilă.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-template">Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-template"
            >
              {deleteMutation.isPending ? "Se șterge..." : "Șterge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
