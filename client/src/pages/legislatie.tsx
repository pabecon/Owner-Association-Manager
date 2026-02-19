import { useRoute } from "wouter";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LEGISLATION_ITEMS } from "@/lib/legislation-data";
import { LAW_114_1996_CONTENT, type LawSection } from "@/lib/law-content-114-1996";
import { Scale, ExternalLink, FileText, BookOpen, ListOrdered } from "lucide-react";

const LAW_CONTENT_MAP: Record<string, LawSection[]> = {
  "legea-114-1996": LAW_114_1996_CONTENT,
};

function parseChapterInfo(title: string) {
  const dashIndex = title.indexOf(" - ");
  if (dashIndex === -1) return { number: title, description: "" };
  return {
    number: title.substring(0, dashIndex),
    description: title.substring(dashIndex + 3),
  };
}

function LawTableOfContents({ sections, onNavigate }: { sections: LawSection[]; onNavigate: (id: string) => void }) {
  const chapters = sections.filter(s => s.type === "chapter" && s.id);
  if (chapters.length === 0) return null;

  return (
    <Card className="p-5 mb-6" data-testid="card-law-toc">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <ListOrdered className="w-4 h-4 text-muted-foreground shrink-0" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Cuprins</h2>
      </div>
      <div className="space-y-1">
        {chapters.map((ch) => {
          const { number, description } = parseChapterInfo(ch.title || "");
          const articleCount = ch.children?.filter(c => c.type === "article").length || 0;
          return (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.id!)}
              className="w-full text-left rounded-md px-3 py-2 hover-elevate active-elevate-2 flex items-start gap-3 group"
              data-testid={`link-toc-${ch.id}`}
            >
              <span className="text-xs font-semibold text-muted-foreground shrink-0 mt-0.5 min-w-[90px]">{number}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{description}</span>
                {articleCount > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">({articleCount} {articleCount === 1 ? "articol" : "articole"})</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function LawSectionRenderer({ section, depth = 0 }: { section: LawSection; depth?: number }) {
  if (section.type === "chapter") {
    return (
      <div className="mb-8" id={section.id} data-testid={`section-${section.id}`}>
        <div className="flex items-center gap-3 mb-4 pb-2 border-b">
          <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />
          <h2 className="text-base font-bold uppercase tracking-wide">{section.title}</h2>
        </div>
        {section.children?.map((child, i) => (
          <LawSectionRenderer key={i} section={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (section.type === "article") {
    return (
      <div className="mb-5 pl-4" id={section.id} data-testid={`article-${section.id}`}>
        <h3 className="text-sm font-semibold mb-1.5">{section.title}</h3>
        {section.content && (
          <p className="text-sm leading-relaxed text-foreground mb-2">{section.content}</p>
        )}
        {section.items && section.items.length > 0 && (
          <div className="ml-4 space-y-1.5">
            {section.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-muted-foreground shrink-0 mt-0.5">-</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
        {section.children?.map((child, i) => (
          <LawSectionRenderer key={i} section={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (section.type === "note") {
    return (
      <div className="mt-2 ml-4 px-3 py-2 rounded-md bg-muted text-xs text-muted-foreground italic" data-testid="law-note">
        {section.content}
      </div>
    );
  }

  if (section.type === "paragraph") {
    return (
      <p className="text-sm leading-relaxed mb-4">{section.content}</p>
    );
  }

  return null;
}

export default function Legislatie() {
  const [, params] = useRoute("/legislatie/:lawId");
  const selectedId = params?.lawId || null;
  const selectedLaw = selectedId ? LEGISLATION_ITEMS.find(l => l.id === selectedId) : null;
  const lawContent = selectedId ? LAW_CONTENT_MAP[selectedId] : null;

  const scrollToChapter = useCallback((chapterId: string) => {
    const el = document.getElementById(chapterId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!selectedLaw) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
        <Scale className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium mb-1" data-testid="text-legislatie-placeholder">Selectati un act normativ</p>
        <p className="text-sm">Alegeti o lege din meniul Legislatie din bara laterala.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-xl font-bold" data-testid="text-selected-law-title">{selectedLaw.shortTitle}</h1>
              <Badge
                variant={selectedLaw.status === "in_vigoare" ? "default" : "secondary"}
                data-testid="badge-selected-law-status"
              >
                {selectedLaw.status === "in_vigoare" ? "In vigoare" : "Abrogata"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-selected-law-full-title">{selectedLaw.fullTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedLaw.publishedIn}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={selectedLaw.url} target="_blank" rel="noopener noreferrer" data-testid="link-law-external">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Legislatie.just.ro
            </a>
          </Button>
        </div>

        {lawContent && (
          <LawTableOfContents sections={lawContent} onNavigate={scrollToChapter} />
        )}

        {lawContent ? (
          <Card className="p-6" data-testid="card-law-content">
            {lawContent.map((section, i) => (
              <LawSectionRenderer key={i} section={section} />
            ))}
            <div className="mt-8 pt-4 border-t flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground">
                Text actualizat conform modificarilor ulterioare. Consultati textul oficial pentru versiunea completa.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={selectedLaw.url} target="_blank" rel="noopener noreferrer" data-testid="link-law-full-text">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Text oficial complet
                </a>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm font-medium mb-1">Textul legii va fi disponibil in curand</p>
              <p className="text-xs">Continutul va fi adaugat ulterior. Intre timp, puteti consulta textul oficial pe legislatie.just.ro.</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href={selectedLaw.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Deschide textul oficial
                </a>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
