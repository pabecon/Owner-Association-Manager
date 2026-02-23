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
import { Building2, Home, ArrowUpDown, Receipt, Wallet, Megaphone, User, ArrowLeft, Shield, Gauge } from "lucide-react";
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
    { id: "contoare", label: "Contoare Comune", icon: Gauge },
    { id: "financiar", label: "Financiar", icon: Receipt },
    { id: "contact", label: "Contact", icon: User },
    { id: "anunturi", label: "Anunturi", icon: Megaphone },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary shrink-0">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-semibold tracking-tight truncate leading-tight" data-testid="text-assoc-sidebar-name">
              {association?.name || "Asociatie"}
            </span>
            {association?.cui && (
              <span className="text-[10px] text-muted-foreground leading-none">CUI: {association.cui}</span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] leading-none px-2 py-1">Administrare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    data-active={activeTab === item.id}
                    className={`h-7 text-[12px] cursor-pointer ${activeTab === item.id ? "bg-sidebar-accent" : ""}`}
                    onClick={() => onTabChange(item.id)}
                    data-testid={`link-assoc-${item.id}`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-7 text-[12px]">
              <Link href="/" data-testid="link-back-superadmin">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Super Administrator</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {user && (
          <div className="flex items-center gap-2 border-t pt-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-medium truncate leading-tight" data-testid="text-assoc-sidebar-username">{displayName}</span>
              {highestRole && (
                <Badge variant="secondary" className="w-fit text-[9px] px-1 py-0" data-testid="badge-assoc-sidebar-role">
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
