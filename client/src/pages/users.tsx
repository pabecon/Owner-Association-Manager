import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Trash2, Search, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Building, Federation } from "@shared/schema";
import { useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  manager: "Gestor",
  owner: "Proprietar",
  tenant: "Chirias",
};

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  super_admin: "destructive",
  admin: "default",
  manager: "secondary",
  owner: "outline",
  tenant: "outline",
};

interface UserWithRoles {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  roles: {
    id: string;
    role: string;
    buildingId: string | null;
    federationId: string | null;
    apartmentId: string | null;
  }[];
}

interface RoleInfo {
  highestRole: string;
  permissions: Record<string, boolean>;
}

const assignRoleSchema = z.object({
  userId: z.string().min(1, "Selectati un utilizator"),
  role: z.string().min(1, "Selectati un rol"),
  federationId: z.string().optional(),
  buildingId: z.string().optional(),
  apartmentId: z.string().optional(),
});

type AssignRoleForm = z.infer<typeof assignRoleSchema>;

export default function UsersPage() {
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: usersData, isLoading } = useQuery<UserWithRoles[]>({
    queryKey: ["/api/users"],
  });

  const { data: roleInfo } = useQuery<RoleInfo>({
    queryKey: ["/api/me/roles"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const { data: federations } = useQuery<Federation[]>({
    queryKey: ["/api/federations"],
  });

  const { data: searchResults } = useQuery<{ id: string; email: string; firstName: string; lastName: string }[]>({
    queryKey: ["/api/users/search", searchEmail],
    queryFn: async () => {
      if (!searchEmail || searchEmail.length < 2) return [];
      const res = await fetch(`/api/users/search?email=${encodeURIComponent(searchEmail)}`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: searchEmail.length >= 2,
  });

  const form = useForm<AssignRoleForm>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: "",
      role: "",
      federationId: "",
      buildingId: "",
      apartmentId: "",
    },
  });

  const assignRole = useMutation({
    mutationFn: async (data: AssignRoleForm) => {
      const body: Record<string, string> = {
        userId: data.userId,
        role: data.role,
      };
      if (data.federationId) body.federationId = data.federationId;
      if (data.buildingId) body.buildingId = data.buildingId;
      if (data.apartmentId) body.apartmentId = data.apartmentId;
      await apiRequest("POST", "/api/user-roles", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-roles"] });
      toast({ title: "Rol asignat cu succes" });
      form.reset();
      setSearchEmail("");
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      await apiRequest("DELETE", `/api/user-roles/${roleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-roles"] });
      toast({ title: "Rol sters cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const canManage = roleInfo?.permissions?.manageUsers || roleInfo?.permissions?.manageManagers || roleInfo?.permissions?.manageTenants;
  const myHighestRole = roleInfo?.highestRole;

  const availableRoles = (() => {
    if (myHighestRole === "super_admin") return ["super_admin", "admin", "manager", "owner", "tenant"];
    if (myHighestRole === "admin") return ["manager", "owner", "tenant"];
    if (myHighestRole === "owner") return ["tenant"];
    return [];
  })();

  const selectedRole = form.watch("role");

  const getScopeLabel = (role: { buildingId: string | null; federationId: string | null; apartmentId: string | null }) => {
    if (role.federationId) {
      const fed = federations?.find((f) => f.id === role.federationId);
      return fed?.name || "Federatie";
    }
    if (role.buildingId) {
      const bld = buildings?.find((b) => b.id === role.buildingId);
      return bld?.name || "Bloc";
    }
    if (role.apartmentId) {
      return `Apt. ${role.apartmentId.slice(0, 8)}`;
    }
    return "Global";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-sm font-bold tracking-tight" data-testid="text-users-title">Gestionare Utilizatori</h1>
          {canManage && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-assign-role">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Asigneaza Rol
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asigneaza Rol Utilizator</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => assignRole.mutate(data))} className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel>Cauta utilizator dupa email</FormLabel>
                      <Input
                        placeholder="email@exemplu.ro"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        data-testid="input-search-user"
                      />
                      {searchResults && searchResults.length > 0 && (
                        <div className="border rounded-md max-h-40 overflow-y-auto">
                          {searchResults.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              className="flex items-center gap-2 w-full p-2 text-left text-sm hover-elevate"
                              onClick={() => {
                                form.setValue("userId", u.id);
                                setSearchEmail(u.email || "");
                              }}
                              data-testid={`button-select-user-${u.id}`}
                            >
                              <span className="font-medium">{u.firstName} {u.lastName}</span>
                              <span className="text-muted-foreground text-xs">{u.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {form.watch("userId") && (
                        <p className="text-xs text-muted-foreground">Utilizator selectat: {searchEmail}</p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rol</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-role">
                                <SelectValue placeholder="Selectati rolul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableRoles.map((r) => (
                                <SelectItem key={r} value={r} data-testid={`option-role-${r}`}>
                                  {ROLE_LABELS[r]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(selectedRole === "admin" || selectedRole === "manager") && federations && federations.length > 0 && (
                      <FormField
                        control={form.control}
                        name="federationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Federatie (optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-federation">
                                  <SelectValue placeholder="Selectati federatia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {federations.map((f) => (
                                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {(selectedRole === "manager" || selectedRole === "owner" || selectedRole === "tenant") && buildings && buildings.length > 0 && (
                      <FormField
                        control={form.control}
                        name="buildingId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bloc (optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-building">
                                  <SelectValue placeholder="Selectati blocul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {buildings.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Anuleaza</Button>
                      </DialogClose>
                      <Button type="submit" disabled={assignRole.isPending} data-testid="button-submit-role">
                        {assignRole.isPending ? "Se salveaza..." : "Salveaza"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !usersData || usersData.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-users">Nu exista utilizatori cu roluri asignate</p>
                  {canManage && (
                    <p className="text-xs text-muted-foreground mt-0.5">Folositi butonul "Asigneaza Rol" pentru a adauga utilizatori</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {usersData.map((u) => {
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "Necunoscut";
                const initials = [u.firstName, u.lastName]
                  .filter(Boolean)
                  .map((n) => n?.[0]?.toUpperCase())
                  .join("");

                return (
                  <Card key={u.id} data-testid={`card-user-${u.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={u.profileImageUrl || undefined} alt={name} />
                          <AvatarFallback className="text-xs">{initials || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" data-testid={`text-user-name-${u.id}`}>{name}</p>
                          {u.email && <p className="text-xs text-muted-foreground" data-testid={`text-user-email-${u.id}`}>{u.email}</p>}
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            {u.roles.map((r) => (
                              <div key={r.id} className="flex items-center gap-1">
                                <Badge variant={ROLE_VARIANTS[r.role] || "secondary"} data-testid={`badge-role-${r.id}`}>
                                  <Shield className="w-3 h-3 mr-1" />
                                  {ROLE_LABELS[r.role] || r.role}
                                  {(r.buildingId || r.federationId || r.apartmentId) && (
                                    <span className="ml-1 opacity-75">({getScopeLabel(r)})</span>
                                  )}
                                </Badge>
                                {canManage && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6"
                                    onClick={() => deleteRole.mutate(r.id)}
                                    disabled={deleteRole.isPending}
                                    data-testid={`button-delete-role-${r.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
