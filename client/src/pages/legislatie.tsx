import { useRoute, Link } from "wouter";
import { useCallback, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEGISLATION_ITEMS } from "@/lib/legislation-data";
import { LAW_114_1996_CONTENT, type LawSection } from "@/lib/law-content-114-1996";
import { Scale, ExternalLink, FileText, BookOpen, ListOrdered, Search, X, ChevronRight } from "lucide-react";

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
  const chapters = sections.filter(s => (s.type === "chapter" || s.type === "annexa") && s.id);
  if (chapters.length === 0) return null;

  return (
    <Card className="p-3 mb-3" data-testid="card-law-toc">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <ListOrdered className="w-4 h-4 text-muted-foreground shrink-0" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Cuprins</h2>
      </div>
      <div className="space-y-0">
        {chapters.map((ch) => {
          const { number, description } = parseChapterInfo(ch.title || "");
          const articleCount = ch.children?.filter(c => c.type === "article").length || 0;
          return (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.id!)}
              className="w-full text-left rounded-md px-3 py-1 hover-elevate active-elevate-2 flex items-center gap-3"
              data-testid={`link-toc-${ch.id}`}
            >
              <span className="text-xs font-semibold text-muted-foreground shrink-0 min-w-[90px]">{number}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm">{description}</span>
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

function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sectionMatchesSearch(section: LawSection, term: string): boolean {
  const norm = normalizeText(term);
  if (section.title && normalizeText(section.title).includes(norm)) return true;
  if (section.content && normalizeText(section.content).includes(norm)) return true;
  if (section.items?.some(item => normalizeText(item).includes(norm))) return true;
  if (section.tableData) {
    if (section.tableData.headers.some(h => normalizeText(h).includes(norm))) return true;
    if (section.tableData.rows.some(row => row.some(cell => normalizeText(cell).includes(norm)))) return true;
  }
  if (section.children?.some(child => sectionMatchesSearch(child, term))) return true;
  return false;
}

function highlightText(text: string, term: string) {
  if (!term || term.length < 2) return text;
  const normTerm = normalizeText(term);
  const normText = normalizeText(text);
  const parts: { start: number; end: number }[] = [];
  let idx = 0;
  while (idx < normText.length) {
    const found = normText.indexOf(normTerm, idx);
    if (found === -1) break;
    parts.push({ start: found, end: found + term.length });
    idx = found + 1;
  }
  if (parts.length === 0) return text;

  const result: (string | JSX.Element)[] = [];
  let lastEnd = 0;
  parts.forEach((p, i) => {
    if (p.start > lastEnd) result.push(text.substring(lastEnd, p.start));
    result.push(
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5">{text.substring(p.start, p.end)}</mark>
    );
    lastEnd = p.end;
  });
  if (lastEnd < text.length) result.push(text.substring(lastEnd));
  return <>{result}</>;
}

function LawSectionRenderer({ section, depth = 0, searchTerm = "" }: { section: LawSection; depth?: number; searchTerm?: string }) {
  if (section.type === "chapter") {
    const matches = searchTerm ? sectionMatchesSearch(section, searchTerm) : true;
    if (!matches) return null;
    return (
      <div className="mb-6" id={section.id} data-testid={`section-${section.id}`}>
        <div className="flex items-center gap-3 mb-3 pb-2 border-b">
          <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />
          <h2 className="text-base font-bold uppercase tracking-wide">{searchTerm ? highlightText(section.title || "", searchTerm) : section.title}</h2>
        </div>
        {section.children?.map((child, i) => (
          <LawSectionRenderer key={i} section={child} depth={depth + 1} searchTerm={searchTerm} />
        ))}
      </div>
    );
  }

  if (section.type === "article") {
    const matches = searchTerm ? sectionMatchesSearch(section, searchTerm) : true;
    if (!matches) return null;
    return (
      <div className="mb-4 pl-4" id={section.id} data-testid={`article-${section.id}`}>
        <h3 className="text-sm font-semibold mb-1">{searchTerm ? highlightText(section.title || "", searchTerm) : section.title}</h3>
        {section.content && (
          <p className="text-sm leading-relaxed text-foreground mb-1.5">{searchTerm ? highlightText(section.content, searchTerm) : section.content}</p>
        )}
        {section.items && section.items.length > 0 && (
          <div className="ml-4 space-y-1">
            {section.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-muted-foreground shrink-0 mt-0.5">-</span>
                <span>{searchTerm ? highlightText(item, searchTerm) : item}</span>
              </div>
            ))}
          </div>
        )}
        {section.children?.map((child, i) => (
          <LawSectionRenderer key={i} section={child} depth={depth + 1} searchTerm={searchTerm} />
        ))}
      </div>
    );
  }

  if (section.type === "note") {
    const matches = searchTerm ? sectionMatchesSearch(section, searchTerm) : true;
    if (!matches) return null;
    return (
      <div className="mt-2 ml-4 px-3 py-2 rounded-md bg-muted text-xs text-muted-foreground italic" data-testid="law-note">
        {searchTerm ? highlightText(section.content || "", searchTerm) : section.content}
      </div>
    );
  }

  if (section.type === "annexa") {
    const matches = searchTerm ? sectionMatchesSearch(section, searchTerm) : true;
    if (!matches) return null;
    return (
      <div className="mb-6 mt-8" id={section.id} data-testid={`section-${section.id}`}>
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-primary/30">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <h2 className="text-base font-bold uppercase tracking-wide">{searchTerm ? highlightText(section.title || "", searchTerm) : section.title}</h2>
        </div>
        {section.children?.map((child, i) => (
          <LawSectionRenderer key={i} section={child} depth={depth + 1} searchTerm={searchTerm} />
        ))}
      </div>
    );
  }

  if (section.type === "table" && section.tableData) {
    return (
      <div className="my-2 ml-4 overflow-x-auto" data-testid="law-table">
        <table className="w-full text-xs border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              {section.tableData.headers.map((header, i) => (
                <th key={i} className="border border-border px-2 py-1 text-left font-semibold whitespace-nowrap">
                  {searchTerm ? highlightText(header, searchTerm) : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.tableData.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "" : "bg-muted/50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`border border-border px-2 py-1 ${ci === 0 ? "font-medium" : "text-center"}`}>
                    {searchTerm ? highlightText(cell, searchTerm) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section.type === "paragraph") {
    const matches = searchTerm ? (section.content && normalizeText(section.content).includes(normalizeText(searchTerm))) : true;
    if (!matches) return null;
    return (
      <p className="text-sm leading-relaxed mb-3">{searchTerm ? highlightText(section.content || "", searchTerm) : section.content}</p>
    );
  }

  return null;
}

function countMatches(sections: LawSection[], term: string): number {
  let count = 0;
  for (const s of sections) {
    if (s.type === "article" && sectionMatchesSearch(s, term)) count++;
    if (s.children) count += countMatches(s.children, term);
  }
  return count;
}

function getMatchingArticles(sections: LawSection[], term: string, chapterTitle?: string): { article: string; chapter: string; snippet: string }[] {
  const results: { article: string; chapter: string; snippet: string }[] = [];
  const norm = normalizeText(term);
  for (const s of sections) {
    const chapName = s.type === "chapter" ? (s.title || "") : (chapterTitle || "");
    if (s.type === "article" && sectionMatchesSearch(s, term)) {
      let snippet = "";
      const allText = [s.content || "", ...(s.items || [])].join(" ");
      const normAll = normalizeText(allText);
      const pos = normAll.indexOf(norm);
      if (pos !== -1) {
        const start = Math.max(0, pos - 40);
        const end = Math.min(allText.length, pos + term.length + 60);
        snippet = (start > 0 ? "..." : "") + allText.substring(start, end) + (end < allText.length ? "..." : "");
      }
      results.push({ article: s.title || "", chapter: chapName, snippet });
    }
    if (s.children) {
      results.push(...getMatchingArticles(s.children, term, chapName));
    }
  }
  return results;
}

interface GlobalSearchResult {
  lawId: string;
  lawTitle: string;
  status: "in_vigoare" | "abrogata";
  matchCount: number;
  matches: { article: string; chapter: string; snippet: string }[];
}

function globalSearch(term: string): GlobalSearchResult[] {
  const results: GlobalSearchResult[] = [];
  for (const [lawId, content] of Object.entries(LAW_CONTENT_MAP)) {
    const law = LEGISLATION_ITEMS.find(l => l.id === lawId);
    if (!law) continue;
    const articles = getMatchingArticles(content, term);
    if (articles.length > 0) {
      results.push({
        lawId,
        lawTitle: law.shortTitle,
        status: law.status,
        matchCount: articles.length,
        matches: articles.slice(0, 10),
      });
    }
  }
  return results;
}

function GlobalSearchView() {
  const [globalTerm, setGlobalTerm] = useState("");

  const searchResults = useMemo(() => {
    if (globalTerm.length < 2) return [];
    return globalSearch(globalTerm);
  }, [globalTerm]);

  const totalMatches = searchResults.reduce((sum, r) => sum + r.matchCount, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <h1 className="text-lg font-bold" data-testid="text-legislatie-title">Legislatie</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Cautati in toate actele normative disponibile</p>
          </div>
        </div>

        <div className="relative" data-testid="global-search-container">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Cautati in toate legile (ex: locuinta, proprietar, asociatie)..."
            value={globalTerm}
            onChange={(e) => setGlobalTerm(e.target.value)}
            className="pl-9 pr-24"
            data-testid="input-global-search"
          />
          {globalTerm.length >= 2 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground" data-testid="text-global-search-count">
                {totalMatches} {totalMatches === 1 ? "rezultat" : "rezultate"} in {searchResults.length} {searchResults.length === 1 ? "lege" : "legi"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setGlobalTerm("")}
                data-testid="button-clear-global-search"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-4xl mx-auto">
          {globalTerm.length >= 2 && searchResults.length === 0 && (
            <Card className="p-3">
              <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
                <Search className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium" data-testid="text-global-no-results">Niciun rezultat gasit</p>
                <p className="text-xs mt-0.5">Incercati alt termen de cautare.</p>
              </div>
            </Card>
          )}

          {globalTerm.length >= 2 && searchResults.length > 0 && (
            <div className="space-y-3" data-testid="global-search-results">
              {searchResults.map((result) => (
                <Card key={result.lawId} className="p-3" data-testid={`card-global-result-${result.lawId}`}>
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-3 pb-2 border-b">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-bold">{result.lawTitle}</span>
                      <Badge variant={result.status === "in_vigoare" ? "default" : "secondary"}>
                        {result.status === "in_vigoare" ? "In vigoare" : "Abrogata"}
                      </Badge>
                      <Badge variant="outline">{result.matchCount} {result.matchCount === 1 ? "articol" : "articole"}</Badge>
                    </div>
                    <Link href={`/legislatie/${result.lawId}`}>
                      <Button variant="outline" size="sm" data-testid={`button-open-law-${result.lawId}`}>
                        Deschide legea
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {result.matches.map((match, idx) => (
                      <div key={idx} className="pl-3 border-l-2 border-muted" data-testid={`result-match-${result.lawId}-${idx}`}>
                        <p className="text-xs font-semibold mb-0.5">{match.article}</p>
                        {match.chapter && (
                          <p className="text-xs text-muted-foreground mb-1">{match.chapter}</p>
                        )}
                        {match.snippet && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {highlightText(match.snippet, globalTerm)}
                          </p>
                        )}
                      </div>
                    ))}
                    {result.matchCount > 10 && (
                      <p className="text-xs text-muted-foreground pl-3 italic">
                        ...si alte {result.matchCount - 10} articole
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {globalTerm.length < 2 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Scale className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1" data-testid="text-legislatie-placeholder">Selectati un act normativ</p>
              <p className="text-sm">Alegeti o lege din meniul Legislatie din bara laterala sau cautati in toate legile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Legislatie() {
  const [, params] = useRoute("/legislatie/:lawId");
  const selectedId = params?.lawId || null;
  const selectedLaw = selectedId ? LEGISLATION_ITEMS.find(l => l.id === selectedId) : null;
  const lawContent = selectedId ? LAW_CONTENT_MAP[selectedId] : null;
  const [searchTerm, setSearchTerm] = useState("");

  const matchCount = useMemo(() => {
    if (!lawContent || searchTerm.length < 2) return 0;
    return countMatches(lawContent, searchTerm);
  }, [lawContent, searchTerm]);

  const scrollToChapter = useCallback((chapterId: string) => {
    const el = document.getElementById(chapterId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!selectedLaw) {
    return <GlobalSearchView />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg font-bold" data-testid="text-selected-law-title">{selectedLaw.shortTitle}</h1>
              <Badge
                variant={selectedLaw.status === "in_vigoare" ? "default" : "secondary"}
                data-testid="badge-selected-law-status"
              >
                {selectedLaw.status === "in_vigoare" ? "In vigoare" : "Abrogata"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-selected-law-full-title">{selectedLaw.fullTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{selectedLaw.publishedIn}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={selectedLaw.url} target="_blank" rel="noopener noreferrer" data-testid="link-law-external">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Legislatie.just.ro
            </a>
          </Button>
        </div>

        {lawContent && (
          <div className="relative" data-testid="search-law-container">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Cautati in textul legii..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-20"
              data-testid="input-search-law"
            />
            {searchTerm.length >= 2 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground" data-testid="text-search-count">
                  {matchCount} {matchCount === 1 ? "rezultat" : "rezultate"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSearchTerm("")}
                  data-testid="button-clear-search"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-4xl mx-auto">
          {lawContent && (
            <LawTableOfContents sections={lawContent} onNavigate={scrollToChapter} />
          )}

          {lawContent ? (
            <Card className="p-3" data-testid="card-law-content">
              {searchTerm.length >= 2 && matchCount === 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
                  <Search className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">Niciun rezultat gasit</p>
                  <p className="text-xs mt-0.5">Incercati alt termen de cautare.</p>
                </div>
              )}
              {lawContent.map((section, i) => (
                <LawSectionRenderer key={i} section={section} searchTerm={searchTerm.length >= 2 ? searchTerm : ""} />
              ))}
              <div className="mt-6 pt-3 border-t flex items-center justify-between gap-3 flex-wrap">
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
            <Card className="p-3">
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
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
    </div>
  );
}
