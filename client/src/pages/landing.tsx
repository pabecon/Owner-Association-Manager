import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Building2,
  Shield,
  Users,
  BarChart3,
  FileText,
  Bell,
  Droplets,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

const FEATURES = [
  {
    icon: Building2,
    title: "Gestionare Imobiliara",
    description: "Structura completa: federatii, asociatii, blocuri, scari, etaje si unitati.",
  },
  {
    icon: CreditCard,
    title: "Financiar & Facturare",
    description: "Cheltuieli, plati, fonduri, facturi si curs valutar BNR actualizat zilnic.",
  },
  {
    icon: Droplets,
    title: "Contoare & Citiri",
    description: "Evidenta contoare comune si individuale, citiri cu diferentiale automate.",
  },
  {
    icon: Users,
    title: "Roluri & Permisiuni",
    description: "Super admin, administrator, manager, proprietar si chirias — fiecare cu acces personalizat.",
  },
  {
    icon: FileText,
    title: "Contracte & Documente",
    description: "Administrare contracte, sabloane, documente atasate si arhiva digitala.",
  },
  {
    icon: Bell,
    title: "Anunturi & Comunicare",
    description: "Anunturi pe bloc, scara sau asociatie cu prioritati si notificari.",
  },
  {
    icon: BarChart3,
    title: "Rapoarte & Statistici",
    description: "Vizualizare arborescenta, infografice si sumar financiar la fiecare nivel.",
  },
  {
    icon: ShieldCheck,
    title: "GDPR & Conformitate",
    description: "Politica cookies, protectia datelor si conformitate legala integrata.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight" data-testid="text-landing-logo">AdminBloc</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="button-header-login">
                <LogIn className="w-4 h-4 mr-1" />
                Autentificare
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" data-testid="button-header-register">
                <UserPlus className="w-4 h-4 mr-1" />
                Inregistrare
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6" data-testid="badge-landing-tagline">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Platforma completa pentru asociatii de proprietari
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" data-testid="text-landing-title">
            Administreaza asociatia ta <br className="hidden md:block" />
            <span className="text-primary">simplu si eficient</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-landing-subtitle">
            AdminBloc digitalizeaza complet gestiunea asociatiilor de proprietari din Romania: 
            imobile, cheltuieli, plati, contoare, contracte si comunicare — totul intr-un singur loc.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]" data-testid="button-hero-register">
                <UserPlus className="w-5 h-5 mr-2" />
                Creeaza cont gratuit
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]" data-testid="button-hero-login">
                <LogIn className="w-5 h-5 mr-2" />
                Autentificare
              </Button>
            </Link>
          </div>

          <div className="border rounded-lg p-4 bg-card max-w-2xl mx-auto" data-testid="card-dev-shortcuts">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Acces rapid (dezvoltare)</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/admin">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto" data-testid="button-dev-superadmin">
                  <Shield className="w-4 h-4 mr-1.5" />
                  Super Admin
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <Link href="/asociatie/2138d471-41b3-4fdd-88be-37e58b8870ad">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto" data-testid="button-dev-association">
                  <Users className="w-4 h-4 mr-1.5" />
                  Portal Asociatie
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <Link href="/unitate/de077844-34cc-446a-a938-20da0f6e5dba">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto" data-testid="button-dev-unit">
                  <Building2 className="w-4 h-4 mr-1.5" />
                  Proprietar Individual
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2" data-testid="text-features-title">Tot ce ai nevoie pentru administrarea asociatiei</h2>
            <p className="text-sm text-muted-foreground">Functionalitati complete, integrate si usor de folosit</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Card key={i} className="border bg-card hover:shadow-md transition-shadow" data-testid={`card-feature-${i}`}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2" data-testid="text-cta-title">Pregatit sa incepi?</h2>
          <p className="text-sm text-muted-foreground mb-6">Inregistreaza-te gratuit si incepe sa administrezi asociatia ta digital.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" data-testid="button-cta-register">
                <UserPlus className="w-5 h-5 mr-2" />
                Inregistrare gratuita
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" data-testid="button-cta-login">
                Autentificare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">AdminBloc</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/gdpr/politica-cookies" className="hover:text-foreground transition-colors" data-testid="link-footer-cookies">Politica Cookies</Link>
            <Link href="/gdpr/politica-confidentialitate" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">Confidentialitate</Link>
            <Link href="/gdpr/termeni-conditii" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">Termeni si Conditii</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
