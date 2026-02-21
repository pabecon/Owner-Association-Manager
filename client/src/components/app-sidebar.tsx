import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Building2, GitBranch, Shield } from "lucide-react";
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

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });

  const highestRole = roleInfo?.highestRole;

  const isActive = location === "/";

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
                <SidebarMenuButton asChild data-active={isActive} className={`h-8 text-sm ${isActive ? "bg-sidebar-accent" : ""}`}>
                  <Link href="/" data-testid="link-nav-infografie">
                    <GitBranch className="w-4 h-4" />
                    <span>Infografie</span>
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
