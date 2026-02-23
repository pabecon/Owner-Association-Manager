import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Building2, GitBranch, Shield, List, Scale, ChevronDown, ChevronRight, Users, FileText, Gavel, Grid3X3, ShieldCheck, Wallet, Receipt, Landmark, Calculator, MapPin, CreditCard, Ruler } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE_LABELS, type UserRole } from "@shared/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LEGISLATION_ITEMS } from "@/lib/legislation-data";

interface RoleInfo {
  highestRole: string;
  permissions: Record<string, boolean>;
  roles: { role: string }[];
}

interface ListConfig {
  key: string;
  label: string;
}

const LIST_CATEGORIES: { label: string; icon: typeof Wallet; keys: string[] }[] = [
  {
    label: "Financiare",
    icon: Wallet,
    keys: ["banca", "banci-conturi", "conexiune-bancare", "conturi-toshl", "tip-moneda", "curs-valutar-bnr"],
  },
  {
    label: "Fiscale",
    icon: Calculator,
    keys: ["atribute-fiscale", "cota-tva", "tva-partener-anaf", "tip-factura"],
  },
  {
    label: "Geografice",
    icon: MapPin,
    keys: ["tari", "oras-judet", "sector-bucuresti", "prefix-telefon", "tip-drumuri"],
  },
  {
    label: "Identificare",
    icon: CreditCard,
    keys: ["serie-ci"],
  },
  {
    label: "Unitati de Masura",
    icon: Ruler,
    keys: ["unitate-masura"],
  },
  {
    label: "Imobiliar",
    icon: Building2,
    keys: ["tip-camera"],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [listsOpen, setListsOpen] = useState<boolean | null>(null);
  const [listSubCats, setListSubCats] = useState<Set<string>>(new Set());
  const [legislatieOpen, setLegistatieOpen] = useState<boolean | null>(null);
  const [juridicOpen, setJuridicOpen] = useState<boolean | null>(null);
  const [usersOpen, setUsersOpen] = useState<boolean | null>(null);
  const [gdprOpen, setGdprOpen] = useState<boolean | null>(null);
  const [financiarOpen, setFinanciarOpen] = useState<boolean | null>(null);

  const toggleListSubCat = (cat: string) => {
    setListSubCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });

  const { data: listConfigs } = useQuery<ListConfig[]>({
    queryKey: ["/api/liste-config"],
  });

  const allCategorizedKeys = LIST_CATEGORIES.flatMap(c => c.keys);
  const uncategorizedConfigs = listConfigs?.filter(c => !allCategorizedKeys.includes(c.key)) || [];

  const activeListCategory = LIST_CATEGORIES.find(cat =>
    cat.keys.some(k => location === `/liste-generale/${k}`)
  )?.label || (uncategorizedConfigs.some(c => location === `/liste-generale/${c.key}`) ? "__altele__" : undefined);

  const highestRole = roleInfo?.highestRole;

  const isInfografieActive = location === "/";
  const isListeActive = location.startsWith("/liste-generale");
  const isLegistatieActive = location.startsWith("/legislatie");
  const isJuridicActive = location.startsWith("/contracte") || location.startsWith("/sabloane-contracte");
  const isUsersSection = location === "/matrice-permisiuni" || location === "/lista-utilizatori" || location.startsWith("/utilizator/");
  const isFinanciarActive = location === "/facturi";
  const isGdprActive = location.startsWith("/gdpr");

  const isListsExpanded = listsOpen !== null ? listsOpen : isListeActive;
  const isLegislatieExpanded = legislatieOpen !== null ? legislatieOpen : isLegistatieActive;
  const isJuridicExpanded = juridicOpen !== null ? juridicOpen : isJuridicActive;
  const isUsersExpanded = usersOpen !== null ? usersOpen : isUsersSection;
  const isFinanciarExpanded = financiarOpen !== null ? financiarOpen : isFinanciarActive;
  const isGdprExpanded = gdprOpen !== null ? gdprOpen : isGdprActive;

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n?.[0]?.toUpperCase())
    .join("");

  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Utilizator" : "";

  return (
    <Sidebar>
      <SidebarHeader className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-primary">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight" data-testid="text-app-name">AdminBloc</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Asociatie Proprietari</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isInfografieActive} className={`h-7 text-[12px] ${isInfografieActive ? "bg-sidebar-accent" : ""}`}>
                  <Link href="/" data-testid="link-nav-infografie">
                    <GitBranch className="w-4 h-4" />
                    <span>Infografie</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={isListsExpanded} onOpenChange={(val) => setListsOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isListeActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-liste-generale">
                      <List className="w-4 h-4" />
                      <span className="flex-1">Liste Generale</span>
                      {isListsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {LIST_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isCatExpanded = listSubCats.has(cat.label) || activeListCategory === cat.label;
                        const catConfigs = listConfigs?.filter(c => cat.keys.includes(c.key)) || [];
                        if (catConfigs.length === 0) return null;
                        return (
                          <SidebarMenuSubItem key={cat.label}>
                            <button
                              type="button"
                              className={`flex items-center gap-1 w-full px-2 py-0.5 rounded-md text-[11px] leading-none font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${activeListCategory === cat.label ? "text-sidebar-accent-foreground" : ""}`}
                              onClick={() => toggleListSubCat(cat.label)}
                              data-testid={`button-list-cat-${cat.label}`}
                            >
                              <Icon className="w-3 h-3 shrink-0" />
                              <span className="flex-1 text-left truncate">{cat.label}</span>
                              {isCatExpanded ? <ChevronDown className="w-2.5 h-2.5 shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 shrink-0" />}
                            </button>
                            {isCatExpanded && (
                              <ul className="ml-3 border-l border-sidebar-border pl-2 mt-0.5 mb-0.5 flex flex-col gap-0">
                                {catConfigs.map((config) => {
                                  const isSubActive = location === `/liste-generale/${config.key}`;
                                  return (
                                    <li key={config.key}>
                                      <Link
                                        href={`/liste-generale/${config.key}`}
                                        className={`block px-2 py-px rounded text-[11px] leading-none truncate hover:bg-sidebar-accent ${isSubActive ? "bg-sidebar-accent font-medium" : "text-muted-foreground"}`}
                                        data-testid={`link-list-${config.key}`}
                                      >
                                        {config.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </SidebarMenuSubItem>
                        );
                      })}
                      {uncategorizedConfigs.length > 0 && (
                        <SidebarMenuSubItem>
                          <button
                            type="button"
                            className={`flex items-center gap-1 w-full px-2 py-0.5 rounded-md text-[11px] leading-none font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${activeListCategory === "__altele__" ? "text-sidebar-accent-foreground" : ""}`}
                            onClick={() => toggleListSubCat("__altele__")}
                            data-testid="button-list-cat-altele"
                          >
                            <List className="w-3 h-3 shrink-0" />
                            <span className="flex-1 text-left truncate">Altele</span>
                            {(listSubCats.has("__altele__") || activeListCategory === "__altele__") ? <ChevronDown className="w-2.5 h-2.5 shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 shrink-0" />}
                          </button>
                          {(listSubCats.has("__altele__") || activeListCategory === "__altele__") && (
                            <ul className="ml-3 border-l border-sidebar-border pl-2 mt-0.5 mb-0.5 flex flex-col gap-0">
                              {uncategorizedConfigs.map((config) => {
                                const isSubActive = location === `/liste-generale/${config.key}`;
                                return (
                                  <li key={config.key}>
                                    <Link
                                      href={`/liste-generale/${config.key}`}
                                      className={`block px-2 py-px rounded text-[11px] leading-none truncate hover:bg-sidebar-accent ${isSubActive ? "bg-sidebar-accent font-medium" : "text-muted-foreground"}`}
                                      data-testid={`link-list-${config.key}`}
                                    >
                                      {config.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isLegislatieExpanded} onOpenChange={(val) => setLegistatieOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isLegistatieActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-legislatie">
                      <Scale className="w-4 h-4" />
                      <span className="flex-1">Legislatie</span>
                      {isLegislatieExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {LEGISLATION_ITEMS.map((law) => {
                        const isSubActive = location === `/legislatie/${law.id}`;
                        return (
                          <SidebarMenuSubItem key={law.id}>
                            <SidebarMenuSubButton asChild data-active={isSubActive} className={isSubActive ? "bg-sidebar-accent" : ""}>
                              <Link href={`/legislatie/${law.id}`} data-testid={`link-law-sidebar-${law.id}`}>
                                <span className="truncate">{law.shortTitle}</span>
                                <Badge
                                  variant={law.status === "in_vigoare" ? "default" : "secondary"}
                                  className="text-[9px] px-1 py-0 shrink-0 ml-auto"
                                >
                                  {law.status === "in_vigoare" ? "V" : "A"}
                                </Badge>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isJuridicExpanded} onOpenChange={(val) => setJuridicOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isJuridicActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-juridic">
                      <Gavel className="w-4 h-4" />
                      <span className="flex-1">Juridic</span>
                      {isJuridicExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/contracte"} className={location === "/contracte" ? "bg-sidebar-accent" : ""}>
                          <Link href="/contracte" data-testid="link-nav-contracte">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Contracte</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/sabloane-contracte"} className={location === "/sabloane-contracte" ? "bg-sidebar-accent" : ""}>
                          <Link href="/sabloane-contracte" data-testid="link-nav-templates">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Sabloane</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isUsersExpanded} onOpenChange={(val) => setUsersOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isUsersSection ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-utilizatori">
                      <Users className="w-4 h-4" />
                      <span className="flex-1">Utilizatori</span>
                      {isUsersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/lista-utilizatori"} className={location === "/lista-utilizatori" ? "bg-sidebar-accent" : ""}>
                          <Link href="/lista-utilizatori" data-testid="link-nav-lista-utilizatori">
                            <Users className="w-3.5 h-3.5" />
                            <span>Lista Utilizatori</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/matrice-permisiuni"} className={location === "/matrice-permisiuni" ? "bg-sidebar-accent" : ""}>
                          <Link href="/matrice-permisiuni" data-testid="link-nav-permissions-matrix">
                            <Grid3X3 className="w-3.5 h-3.5" />
                            <span>Matrice Permisiuni</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isFinanciarExpanded} onOpenChange={(val) => setFinanciarOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isFinanciarActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-financiar">
                      <Wallet className="w-4 h-4" />
                      <span className="flex-1">Financiar</span>
                      {isFinanciarExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/facturi"} className={location === "/facturi" ? "bg-sidebar-accent" : ""}>
                          <Link href="/facturi" data-testid="link-nav-facturi">
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Facturi</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isGdprExpanded} onOpenChange={(val) => setGdprOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-7 text-[12px] ${isGdprActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-gdpr">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="flex-1">GDPR</span>
                      {isGdprExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/gdpr/politica-cookies" || location === "/gdpr"} className={location === "/gdpr/politica-cookies" || location === "/gdpr" ? "bg-sidebar-accent" : ""}>
                          <Link href="/gdpr/politica-cookies" data-testid="link-nav-gdpr-cookies">
                            <span>Politica de Cookies</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild data-active={location === "/gdpr/politica-prelucrare-date"} className={location === "/gdpr/politica-prelucrare-date" ? "bg-sidebar-accent" : ""}>
                          <Link href="/gdpr/politica-prelucrare-date" data-testid="link-nav-gdpr-prelucrare">
                            <span>Politica de Prelucrare Date</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 pt-2">
        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-medium truncate" data-testid="text-sidebar-username">{displayName}</span>
              {highestRole && (
                <Badge variant="secondary" className="w-fit text-[9px] py-0" data-testid="badge-sidebar-role">
                  <Shield className="w-2.5 h-2.5 mr-0.5" />
                  {ROLE_LABELS[highestRole as UserRole] || highestRole}
                </Badge>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
