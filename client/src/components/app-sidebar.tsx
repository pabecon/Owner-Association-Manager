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
import { Building2, GitBranch, Shield, List, Scale, ChevronDown, ChevronRight, Users, FileText, Gavel, Grid3X3, ShieldCheck } from "lucide-react";
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

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [listsOpen, setListsOpen] = useState<boolean | null>(null);
  const [legislatieOpen, setLegistatieOpen] = useState<boolean | null>(null);
  const [juridicOpen, setJuridicOpen] = useState<boolean | null>(null);
  const [usersOpen, setUsersOpen] = useState<boolean | null>(null);

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });

  const { data: listConfigs } = useQuery<ListConfig[]>({
    queryKey: ["/api/liste-config"],
  });

  const highestRole = roleInfo?.highestRole;

  const isInfografieActive = location === "/";
  const isListeActive = location.startsWith("/liste-generale");
  const isLegistatieActive = location.startsWith("/legislatie");
  const isJuridicActive = location.startsWith("/contracte");
  const isUsersSection = location === "/matrice-permisiuni" || location === "/lista-utilizatori" || location.startsWith("/utilizator/");
  const isGdprActive = location.startsWith("/gdpr");

  const isListsExpanded = listsOpen !== null ? listsOpen : isListeActive;
  const isLegislatieExpanded = legislatieOpen !== null ? legislatieOpen : isLegistatieActive;
  const isJuridicExpanded = juridicOpen !== null ? juridicOpen : isJuridicActive;
  const isUsersExpanded = usersOpen !== null ? usersOpen : isUsersSection;

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n?.[0]?.toUpperCase())
    .join("");

  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Utilizator" : "";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight" data-testid="text-app-name">AdminBloc</span>
            <span className="text-xs text-muted-foreground">Asociatie Proprietari</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isInfografieActive} className={`h-8 text-sm ${isInfografieActive ? "bg-sidebar-accent" : ""}`}>
                  <Link href="/" data-testid="link-nav-infografie">
                    <GitBranch className="w-4 h-4" />
                    <span>Infografie</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={isListsExpanded} onOpenChange={(val) => setListsOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-8 text-sm ${isListeActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-liste-generale">
                      <List className="w-4 h-4" />
                      <span className="flex-1">Liste Generale</span>
                      {isListsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {listConfigs?.map((config) => {
                        const isSubActive = location === `/liste-generale/${config.key}`;
                        return (
                          <SidebarMenuSubItem key={config.key}>
                            <SidebarMenuSubButton asChild data-active={isSubActive} className={isSubActive ? "bg-sidebar-accent" : ""}>
                              <Link href={`/liste-generale/${config.key}`} data-testid={`link-list-${config.key}`}>
                                <span className="truncate">{config.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isLegislatieExpanded} onOpenChange={(val) => setLegistatieOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-8 text-sm ${isLegistatieActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-legislatie">
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
                    <SidebarMenuButton className={`h-8 text-sm ${isJuridicActive ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-juridic">
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={isUsersExpanded} onOpenChange={(val) => setUsersOpen(val)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`h-8 text-sm ${isUsersSection ? "bg-sidebar-accent" : ""}`} data-testid="link-nav-utilizatori">
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

              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isGdprActive} className={`h-8 text-sm ${isGdprActive ? "bg-sidebar-accent" : ""}`}>
                  <Link href="/gdpr" data-testid="link-nav-gdpr">
                    <ShieldCheck className="w-4 h-4" />
                    <span>GDPR</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-xs">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium truncate" data-testid="text-sidebar-username">{displayName}</span>
              {highestRole && (
                <Badge variant="secondary" className="w-fit mt-0.5 text-[10px]" data-testid="badge-sidebar-role">
                  <Shield className="w-3 h-3 mr-1" />
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
