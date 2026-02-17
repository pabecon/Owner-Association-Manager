import { Building2, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Building2,
    title: "Administrare Blocuri",
    description: "Gestionati eficient blocurile, apartamentele si informatiile asociatiei.",
  },
  {
    icon: Users,
    title: "Roluri si Permisiuni",
    description: "Sistem complet de roluri: administrator, gestor, proprietar si chirias.",
  },
  {
    icon: BarChart3,
    title: "Cheltuieli si Plati",
    description: "Inregistrati cheltuielile si urmariti platile fiecarui apartament.",
  },
  {
    icon: Shield,
    title: "Acces Securizat",
    description: "Fiecare utilizator vede doar datele la care are acces conform rolului sau.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4 p-4 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight" data-testid="text-landing-logo">AdminBloc</span>
        </div>
        <Button asChild data-testid="button-login-header">
          <a href="/api/login">Autentificare</a>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" data-testid="text-landing-title">
            Platforma de Administrare
            <br />
            <span className="text-primary">Asociatii de Proprietari</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Gestionati blocurile, apartamentele, cheltuielile si platile asociatiei
            intr-un singur loc. Acces controlat pe roluri pentru fiecare utilizator.
          </p>
          <Button size="lg" asChild data-testid="button-login-hero">
            <a href="/api/login">Conecteaza-te</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" data-testid={`text-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="p-4 border-t text-center">
        <p className="text-xs text-muted-foreground">AdminBloc - Platforma de Administrare Asociatii de Proprietari</p>
      </footer>
    </div>
  );
}
