import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JURIDIC_CATEGORIES, type JuridicSection } from "@/lib/juridic-data";
import { Gavel, FileText, FolderOpen, ChevronRight } from "lucide-react";

function JuridicSectionRenderer({ section }: { section: JuridicSection }) {
  if (section.type === "heading") {
    return (
      <div className="mt-6 mb-3 first:mt-0">
        <h2 className="text-base font-bold border-b pb-1.5">{section.title}</h2>
      </div>
    );
  }

  if (section.type === "subheading") {
    return (
      <div className="mt-4 mb-2">
        <h3 className="text-sm font-semibold">{section.title}</h3>
        {section.content && (
          <p className="text-sm leading-relaxed mt-1 text-foreground">{section.content}</p>
        )}
      </div>
    );
  }

  if (section.type === "paragraph") {
    return (
      <p className="text-sm leading-relaxed mb-3 text-foreground">{section.content}</p>
    );
  }

  if (section.type === "list" && section.items) {
    return (
      <div className="ml-4 mb-3 space-y-1">
        {section.items.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="text-muted-foreground shrink-0 mt-0.5">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "numbered-list" && section.items) {
    return (
      <div className="ml-2 mb-3 space-y-2">
        {section.items.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="text-muted-foreground shrink-0 mt-0.5 font-semibold min-w-[24px]">{i + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "table" && section.tableData) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              {section.tableData.headers.map((header, i) => (
                <th key={i} className="border border-border px-2 py-1.5 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.tableData.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "" : "bg-muted/50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-border px-2 py-1.5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function JuridicIndex() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center gap-3">
          <Gavel className="w-5 h-5 text-muted-foreground shrink-0" />
          <h1 className="text-sm font-bold" data-testid="text-juridic-title">Juridic</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-4xl mx-auto space-y-4">
          {JURIDIC_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                <h2 className="text-sm font-bold" data-testid={`text-juridic-cat-${cat.id}`}>{cat.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-3 ml-6">{cat.description}</p>
              <div className="space-y-2">
                {cat.documents.map((doc) => (
                  <Link key={doc.id} href={`/juridic/${cat.id}/${doc.id}`}>
                    <Card className="p-3 cursor-pointer hover-elevate active-elevate-2" data-testid={`card-juridic-${doc.id}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold truncate" data-testid={`text-juridic-title-${doc.id}`}>{doc.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Juridic() {
  const [, params] = useRoute("/juridic/:catId/:docId");
  const catId = params?.catId || null;
  const docId = params?.docId || null;

  const selectedCat = catId ? JURIDIC_CATEGORIES.find(c => c.id === catId) : null;
  const selectedDoc = selectedCat && docId ? selectedCat.documents.find(d => d.id === docId) : null;

  if (!selectedDoc || !selectedCat) {
    return <JuridicIndex />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold" data-testid="text-juridic-doc-title">{selectedDoc.title}</h1>
            <Badge variant="outline" data-testid="badge-juridic-cat">
              {selectedCat.title}
            </Badge>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/juridic" data-testid="link-juridic-back">
              <ChevronRight className="w-4 h-4 mr-1.5 rotate-180" />
              Înapoi la Juridic
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4" data-testid="card-juridic-content">
            {selectedDoc.sections.map((section, i) => (
              <JuridicSectionRenderer key={i} section={section} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
