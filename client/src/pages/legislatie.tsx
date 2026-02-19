import { useState } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LEGISLATION_ITEMS, type LegislationItem } from "@/lib/legislation-data";
import { Scale, ExternalLink, FileText, ChevronRight } from "lucide-react";

export default function Legislatie() {
  const [, params] = useRoute("/legislatie/:lawId");
  const selectedId = params?.lawId || null;
  const selectedLaw = selectedId ? LEGISLATION_ITEMS.find(l => l.id === selectedId) : null;

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold" data-testid="text-legislatie-title">Legislatie</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Normative relevante pentru asociatiile de proprietari</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {LEGISLATION_ITEMS.map((law) => {
              const isActive = selectedId === law.id;
              return (
                <a
                  key={law.id}
                  href={`/legislatie/${law.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, "", `/legislatie/${law.id}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className={`block rounded-md p-2.5 cursor-pointer transition-colors ${isActive ? "bg-sidebar-accent" : "hover-elevate"}`}
                  data-testid={`link-law-${law.id}`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium">{law.shortTitle}</span>
                        <Badge
                          variant={law.status === "in_vigoare" ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                          data-testid={`badge-law-status-${law.id}`}
                        >
                          {law.status === "in_vigoare" ? "In vigoare" : "Abrogata"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{law.fullTitle}</p>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />}
                  </div>
                </a>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedLaw ? (
          <div className="p-6 max-w-4xl">
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
            <Scale className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1" data-testid="text-legislatie-placeholder">Selectati un act normativ</p>
            <p className="text-sm">Alegeti din lista din stanga pentru a vedea detaliile si textul legii.</p>
          </div>
        )}
      </div>
    </div>
  );
}
