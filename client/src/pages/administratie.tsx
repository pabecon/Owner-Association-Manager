import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ClipboardList, FileCheck, UserCheck, Bell, Settings, Calendar,
  Building2, Users, Receipt, CreditCard, FileText, Megaphone
} from "lucide-react";

const adminSections = [
  {
    title: "Gestiune Proprietăți",
    description: "Administrarea blocurilor, scărilor și unităților",
    icon: Building2,
    url: "/explorer",
    badge: "Imobiliar",
  },
  {
    title: "Registru Proprietari",
    description: "Evidența proprietarilor și chirișilor",
    icon: Users,
    url: "/users",
    badge: "Utilizatori",
  },
  {
    title: "Cheltuieli și Întreținere",
    description: "Gestionarea cheltuielilor comune ale asociației",
    icon: Receipt,
    url: "/expenses",
    badge: "Financiar",
  },
  {
    title: "Plăți și Încasări",
    description: "Evidența plăților și încasărilor de la proprietari",
    icon: CreditCard,
    url: "/payments",
    badge: "Financiar",
  },
  {
    title: "Anunțuri",
    description: "Comunicări și anunțuri către proprietari",
    icon: Megaphone,
    url: "/announcements",
    badge: "Comunicare",
  },
  {
    title: "Documente Juridice",
    description: "Modele de documente și acte juridice",
    icon: FileText,
    url: "/juridic",
    badge: "Juridic",
  },
];

export default function Administratie() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-bold" data-testid="text-administratie-title">Administrație</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {adminSections.map((section) => (
            <Link key={section.url} href={section.url}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" data-testid={`card-admin-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardHeader className="p-3 pb-1">
                  <div className="flex items-center justify-between">
                    <section.icon className="w-5 h-5 text-primary" />
                    <Badge variant="secondary" className="text-[10px]">{section.badge}</Badge>
                  </div>
                  <CardTitle className="text-sm mt-2">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
