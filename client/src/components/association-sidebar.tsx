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
import { Building2, Home, ArrowUpDown, Receipt, Wallet, Megaphone, User, ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE_LABELS, type UserRole } from "@shared/schema";
import type { Association } from "@shared/schema";

interface RoleInfo {
  highestRole: string;
  permissions: Record<string, boolean>;
  roles: { role: string }[];
}

interface AssociationSidebarProps {
  associationId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AssociationSidebar({ associationId, activeTab, onTabChange }: AssociationSidebarProps) {
  const { user } = useAuth();

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });
  const { data: associations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const association = associations?.find(a => a.id === associationId);
  const highestRole = roleInfo?.highestRole;

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n?.[0]?.toUpperCase())
    .join("");

  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Utilizator" : "";

  const menuItems = [
    { id: "imobiliar", label: "Imobiliar", icon: Building2 },
    { id: "financiar", label: "Financiar", icon: Receipt },
    { id: "contact", label: "Contact", icon: User },
    { id: "anunturi", label: "Anunturi", icon: Megaphone },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold tracking-tight truncate" data-testid="text-assoc-sidebar-name">
              {association?.name || "Asociatie"}
            </span>
            {association?.cui && (
              <span className="text-xs text-muted-foreground">CUI: {association.cui}</span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">Administrare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    data-active={activeTab === item.id}
                    className={`h-8 text-sm cursor-pointer ${activeTab === item.id ? "bg-sidebar-accent" : ""}`}
                    onClick={() => onTabChange(item.id)}
                    data-testid={`link-assoc-${item.id}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-8 text-sm">
              <Link href="/" data-testid="link-back-superadmin">
                <ArrowLeft className="w-4 h-4" />
                <span>Super Administrator</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {user && (
          <div className="flex items-center gap-3 border-t pt-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-xs">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium truncate" data-testid="text-assoc-sidebar-username">{displayName}</span>
              {highestRole && (
                <Badge variant="secondary" className="w-fit mt-0.5 text-[10px]" data-testid="badge-assoc-sidebar-role">
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
