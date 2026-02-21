import { useState, type ComponentType } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Building2, LayoutDashboard, Home, Receipt, CreditCard, Search,
  Megaphone, Users, Shield, List, ChevronDown, ChevronRight,
  Network, ArrowUpDown, FolderTree, GitBranch, Table2, Landmark, Scale
} from "lucide-react";
import { LEGISLATION_ITEMS } from "@/lib/legislation-data";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ROLE_LABELS, type UserRole } from "@shared/schema";

interface RoleInfo {
  highestRole: string;
  permissions: Record<string, boolean>;
  roles: { role: string }[];
}

interface ListConfig {
  key: string;
  label: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  visible: boolean;
}

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const imobiliarPaths = ["/explorer", "/hierarchy-tree", "/federations", "/associations", "/buildings", "/staircases", "/apartments"];
  const financiarPaths = ["/expenses", "/payments"];
  const adminPaths = ["/announcements", "/users", "/permissions-matrix"];

  const [imobiliarOpen, setImobiliarOpen] = useState(() => imobiliarPaths.some(p => location.startsWith(p)));
  const [financiarOpen, setFinanciarOpen] = useState(() => financiarPaths.some(p => location.startsWith(p)));
  const [adminOpen, setAdminOpen] = useState(() => adminPaths.some(p => location.startsWith(p)));
  const [listsOpen, setListsOpen] = useState(() => location.startsWith("/liste-generale"));
  const [legislatieOpen, setLegistatieOpen] = useState(() => location.startsWith("/legislatie"));

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });
  const { data: listConfigs } = useQuery<ListConfig[]>({
    queryKey: ["/api/liste-config"],
  });

  const perms = roleInfo?.permissions || {};
  const highestRole = roleInfo?.highestRole;

  const imobiliarItems: NavItem[] = [
    { title: "Explorator", url: "/explorer", icon: FolderTree, visible: true },
    { title: "Infografie", url: "/hierarchy-tree", icon: GitBranch, visible: true },
    { title: "Federatii", url: "/federations", icon: Network, visible: !!perms.viewAllBuildings || !!perms.manageBuildings },
    { title: "Asociatii", url: "/associations", icon: Users, visible: !!perms.viewAllBuildings || !!perms.manageBuildings },
    { title: "Blocuri", url: "/buildings", icon: Building2, visible: !!perms.viewAllBuildings || !!perms.manageBuildings },
    { title: "Scari", url: "/staircases", icon: ArrowUpDown, visible: !!perms.viewAllBuildings || !!perms.manageBuildings },
    { title: "Unitati", url: "/apartments", icon: Home, visible: !!perms.viewAllApartments || !!perms.viewOwnApartment },
  ];

  const financiarItems: NavItem[] = [
    { title: "Cheltuieli", url: "/expenses", icon: Receipt, visible: !!perms.viewAllExpenses || !!perms.viewOwnExpenses },
    { title: "Plati", url: "/payments", icon: CreditCard, visible: !!perms.viewAllPayments || !!perms.viewOwnPayments },
  ];

  const adminItems: NavItem[] = [
    { title: "Anunturi", url: "/announcements", icon: Megaphone, visible: !!perms.viewAllAnnouncements || !!perms.viewOwnAnnouncements },
    { title: "Utilizatori", url: "/users", icon: Users, visible: !!perms.viewUserManagement },
    { title: "Matrice Permisiuni", url: "/permissions-matrix", icon: Table2, visible: !!perms.viewUserManagement || !!perms.manageUsers },
  ];

  const renderMenuItem = (item: NavItem) => {
    const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild data-active={isActive} className={`h-7 text-xs ${isActive ? "bg-sidebar-accent" : ""}`}>
          <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderCollapsibleGroup = (
    label: string,
    icon: ComponentType<{ className?: string }>,
    items: NavItem[],
    isOpen: boolean,
    toggle: () => void,
    testId: string,
  ) => {
    const visibleItems = items.filter(i => i.visible);
    if (visibleItems.length === 0) return null;
    const Icon = icon;
    return (
      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel
          className="cursor-pointer select-none flex items-center justify-between gap-1.5 h-6 text-xs"
          onClick={toggle}
          data-testid={testId}
        >
          <span className="flex items-center gap-1">
            <Icon className="w-3 h-3" />
            {label}
          </span>
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </SidebarGroupLabel>
        {isOpen && (
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    );
  };

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
              {renderMenuItem({ title: "Panou Principal", url: "/", icon: LayoutDashboard, visible: true })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {renderCollapsibleGroup(
          "Management Imobiliar",
          Landmark,
          imobiliarItems,
          imobiliarOpen,
          () => setImobiliarOpen(!imobiliarOpen),
          "button-toggle-imobiliar",
        )}

        {renderCollapsibleGroup(
          "Financiar",
          Receipt,
          financiarItems,
          financiarOpen,
          () => setFinanciarOpen(!financiarOpen),
          "button-toggle-financiar",
        )}

        {renderCollapsibleGroup(
          "Administrare",
          Shield,
          adminItems,
          adminOpen,
          () => setAdminOpen(!adminOpen),
          "button-toggle-administrare",
        )}

        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer select-none flex items-center justify-between gap-2"
            onClick={() => setLegistatieOpen(!legislatieOpen)}
            data-testid="button-toggle-legislatie"
          >
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Legislatie
            </span>
            {legislatieOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </SidebarGroupLabel>
          {legislatieOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild data-active={location === "/legislatie"} className={location === "/legislatie" ? "bg-sidebar-accent" : ""}>
                    <Link href="/legislatie" data-testid="link-nav-legislatie-search">
                      <Search className="w-4 h-4 shrink-0" />
                      <span className="text-xs flex-1 truncate">Cautare in legi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {LEGISLATION_ITEMS.map((law) => {
                  const url = `/legislatie/${law.id}`;
                  const isActive = location === url;
                  return (
                    <SidebarMenuItem key={law.id}>
                      <SidebarMenuButton asChild data-active={isActive} className={isActive ? "bg-sidebar-accent" : ""}>
                        <Link href={url} data-testid={`link-nav-law-${law.id}`}>
                          <Scale className="w-4 h-4 shrink-0" />
                          <span className="text-xs flex-1 truncate">{law.shortTitle}</span>
                          <Badge
                            variant={law.status === "in_vigoare" ? "default" : "secondary"}
                            className="text-[9px] px-1 py-0 shrink-0 no-default-hover-elevate no-default-active-elevate"
                            data-testid={`badge-nav-law-${law.id}`}
                          >
                            {law.status === "in_vigoare" ? "Vigoare" : "Abrogata"}
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer select-none flex items-center justify-between gap-2"
            onClick={() => setListsOpen(!listsOpen)}
            data-testid="button-toggle-liste-generale"
          >
            <span className="flex items-center gap-1.5">
              <List className="w-3.5 h-3.5" />
              Liste Generale
            </span>
            {listsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </SidebarGroupLabel>
          {listsOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                {(listConfigs || []).map((config) => {
                  const url = `/liste-generale/${config.key}`;
                  const isActive = location === url;
                  return (
                    <SidebarMenuItem key={config.key}>
                      <SidebarMenuButton asChild data-active={isActive} className={isActive ? "bg-sidebar-accent" : ""}>
                        <Link href={url} data-testid={`link-nav-lista-${config.key}`}>
                          <List className="w-4 h-4" />
                          <span className="text-xs">{config.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
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
