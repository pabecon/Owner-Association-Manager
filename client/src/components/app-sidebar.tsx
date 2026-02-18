import { useState } from "react";
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
import { Building2, LayoutDashboard, Home, Receipt, CreditCard, Megaphone, Users, Shield, List, ChevronDown, ChevronRight } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  manager: "Gestor",
  owner: "Proprietar",
  tenant: "Chirias",
};

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
  const [listsOpen, setListsOpen] = useState(() => location.startsWith("/liste-generale"));
  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });
  const { data: listConfigs } = useQuery<ListConfig[]>({
    queryKey: ["/api/liste-config"],
  });

  const perms = roleInfo?.permissions || {};
  const highestRole = roleInfo?.highestRole;

  const menuItems = [
    { title: "Panou Principal", url: "/", icon: LayoutDashboard, visible: true },
    { title: "Apartamente", url: "/apartments", icon: Home, visible: !!perms.viewAllApartments || !!perms.viewOwnApartment },
    { title: "Cheltuieli", url: "/expenses", icon: Receipt, visible: !!perms.viewAllExpenses || !!perms.viewOwnExpenses },
    { title: "Plati", url: "/payments", icon: CreditCard, visible: !!perms.viewAllPayments || !!perms.viewOwnPayments },
    { title: "Anunturi", url: "/announcements", icon: Megaphone, visible: !!perms.viewAllAnnouncements || !!perms.viewOwnAnnouncements },
    { title: "Utilizatori", url: "/users", icon: Users, visible: !!perms.viewUserManagement },
  ];

  const visibleItems = menuItems.filter((item) => item.visible);

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
          <SidebarGroupLabel>Navigare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive} className={isActive ? "bg-sidebar-accent" : ""}>
                      <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer select-none flex items-center justify-between gap-2"
            onClick={() => setListsOpen(!listsOpen)}
            data-testid="button-toggle-liste-generale"
          >
            <span>Liste Generale</span>
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
                  {ROLE_LABELS[highestRole] || highestRole}
                </Badge>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
