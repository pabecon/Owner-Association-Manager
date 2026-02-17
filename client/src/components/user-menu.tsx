import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  manager: "Gestor",
  owner: "Proprietar",
  tenant: "Chirias",
};

export function UserMenu() {
  const { user, logout } = useAuth();
  const { data: roleInfo } = useQuery<{
    highestRole: string;
    roles: { role: string; buildingId?: string; federationId?: string; apartmentId?: string }[];
  }>({
    queryKey: ["/api/me/roles"],
  });

  if (!user) return null;

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n?.[0]?.toUpperCase())
    .join("");

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Utilizator";
  const roleLabel = roleInfo?.highestRole ? ROLE_LABELS[roleInfo.highestRole] || roleInfo.highestRole : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-user-menu">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
            <AvatarFallback className="text-[10px]">{initials || <User className="w-3 h-3" />}</AvatarFallback>
          </Avatar>
          <span className="text-sm hidden sm:inline">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-medium">{displayName}</span>
          {user.email && <span className="text-xs text-muted-foreground font-normal">{user.email}</span>}
          {roleLabel && (
            <Badge variant="secondary" className="w-fit mt-1" data-testid="badge-user-role">
              {roleLabel}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Deconectare
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
