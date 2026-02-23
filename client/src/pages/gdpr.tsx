import { useRoute, Link, Redirect } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GDPR_DOCUMENTS, type GdprSection } from "@/lib/gdpr-data";
import { ShieldCheck, FileText, ChevronRight } from "lucide-react";

function GdprSectionRenderer({ section }: { section: GdprSection }) {
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

function GdprIndex() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <h1 className="text-lg font-bold" data-testid="text-gdpr-title">GDPR</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Politici de protectie a datelor cu caracter personal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-4xl mx-auto space-y-3">
          {GDPR_DOCUMENTS.map((doc) => (
            <Link key={doc.id} href={`/gdpr/${doc.id}`}>
              <Card className="p-4 cursor-pointer hover-elevate active-elevate-2" data-testid={`card-gdpr-${doc.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold truncate" data-testid={`text-gdpr-title-${doc.id}`}>{doc.title}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-gdpr-date-${doc.id}`}>Ultima actualizare: {doc.lastUpdated}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Gdpr() {
  const [, params] = useRoute("/gdpr/:docId");
  const selectedId = params?.docId || null;
  const selectedDoc = selectedId ? GDPR_DOCUMENTS.find(d => d.id === selectedId) : null;

  if (!selectedDoc) {
    return <Redirect to="/gdpr/politica-cookies" />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg font-bold" data-testid="text-gdpr-doc-title">{selectedDoc.title}</h1>
              <Badge variant="outline" data-testid="badge-gdpr-date">
                {selectedDoc.lastUpdated}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={selectedId === "politica-cookies" ? "/gdpr/politica-prelucrare-date" : "/gdpr/politica-cookies"} data-testid="link-gdpr-other">
              <ChevronRight className="w-4 h-4 mr-1.5 rotate-180" />
              {selectedId === "politica-cookies" ? "Politica de Prelucrare Date" : "Politica de Cookies"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4" data-testid="card-gdpr-content">
            {selectedDoc.sections.map((section, i) => (
              <GdprSectionRenderer key={i} section={section} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
