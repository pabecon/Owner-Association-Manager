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
import { Users, UserPlus, ArrowLeft, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
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

export function UsersSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });

  const highestRole = roleInfo?.highestRole;

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n?.[0]?.toUpperCase())
    .join("");

  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Utilizator" : "";

  const isListActive = location === "/lista-utilizatori";
  const isDetailActive = location.startsWith("/utilizator/");

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold tracking-tight truncate" data-testid="text-users-sidebar-title">
              Gestiune Utilizatori
            </span>
            <span className="text-xs text-muted-foreground">Administrare platforma</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">Navigare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-active={isListActive || isDetailActive}
                  className={`h-8 text-sm cursor-pointer ${isListActive || isDetailActive ? "bg-sidebar-accent" : ""}`}
                  data-testid="link-users-list"
                >
                  <Link href="/lista-utilizatori">
                    <Users className="w-4 h-4" />
                    <span>Lista Utilizatori</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              <span className="text-xs font-medium truncate" data-testid="text-users-sidebar-username">{displayName}</span>
              {highestRole && (
                <Badge variant="secondary" className="w-fit mt-0.5 text-[10px]" data-testid="badge-users-sidebar-role">
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
