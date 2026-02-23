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
      <div className="my-3 overflow-auto max-h-[400px]">
        <table className="w-full text-xs border-collapse border border-border">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              {section.tableData.headers.map((header, i) => (
                <th key={i} className="border border-border px-2 py-1.5 text-left font-semibold bg-muted">
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
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0" />
          <h1 className="text-sm font-bold" data-testid="text-gdpr-title">GDPR</h1>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">Politici de protectie a datelor cu caracter personal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-4xl mx-auto space-y-3">
          {GDPR_DOCUMENTS.map((doc) => (
            <Link key={doc.id} href={`/gdpr/${doc.id}`}>
              <Card className="p-2 px-3 cursor-pointer hover-elevate active-elevate-2" data-testid={`card-gdpr-${doc.id}`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <h2 className="text-xs font-semibold truncate" data-testid={`text-gdpr-title-${doc.id}`}>{doc.title}</h2>
                  <span className="text-[10px] text-muted-foreground ml-auto shrink-0" data-testid={`text-gdpr-date-${doc.id}`}>{doc.lastUpdated}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
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
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold" data-testid="text-gdpr-doc-title">{selectedDoc.title}</h1>
            <Badge variant="outline" className="text-[10px]" data-testid="badge-gdpr-date">{selectedDoc.lastUpdated}</Badge>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <Link href={selectedId === "politica-cookies" ? "/gdpr/politica-prelucrare-date" : "/gdpr/politica-cookies"} data-testid="link-gdpr-other">
              <ChevronRight className="w-3.5 h-3.5 mr-1 rotate-180" />
              {selectedId === "politica-cookies" ? "Prelucrare Date" : "Cookies"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
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
