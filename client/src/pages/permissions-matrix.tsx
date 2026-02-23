import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Check, X, Lock, Eye, Users, Building2, Receipt, FileText, BarChart3, Megaphone, Pencil, Plus, Save, Loader2 } from "lucide-react";
import {
  roleEnum, type UserRole,
  ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_CREATED_BY, ROLE_SCOPE_LABELS,
  ROLE_HIERARCHY, PERMISSION_MATRIX, type PermissionMatrixEntry,
} from "@shared/schema";

const ACCESS_LEVELS = ["full", "scoped", "own", "none"] as const;
type AccessLevel = typeof ACCESS_LEVELS[number];

const ACCESS_LABELS: Record<string, { label: string; color: string; icon: typeof Check }> = {
  full: { label: "Total", color: "text-green-600 dark:text-green-400", icon: Check },
  scoped: { label: "Limitat", color: "text-blue-600 dark:text-blue-400", icon: Eye },
  own: { label: "Propriu", color: "text-amber-600 dark:text-amber-400", icon: Lock },
  none: { label: "Interzis", color: "text-muted-foreground/40", icon: X },
};

const CATEGORY_ICONS: Record<string, typeof Shield> = {
  hierarchy: Building2,
  financial: Receipt,
  users: Users,
  content: Megaphone,
  documents: FileText,
  reports: BarChart3,
};

interface CustomRolesData {
  roles: { key: string; label: string; description: string; createdBy: string; scopeLabel: string; level: number }[];
  roleLabels: Record<string, string>;
  roleDescriptions: Record<string, string>;
  roleCreatedBy: Record<string, string>;
  roleScopeLabels: Record<string, string>;
  roleHierarchy: Record<string, number>;
}

const roleFormSchema = z.object({
  key: z.string().min(1, "Cheia este obligatorie").regex(/^[a-z_]+$/, "Doar litere mici si underscore"),
  label: z.string().min(1, "Eticheta este obligatorie"),
  description: z.string().min(1, "Descrierea este obligatorie"),
  createdBy: z.string().min(1, "Creat de este obligatoriu"),
  scopeLabel: z.string().min(1, "Domeniul este obligatoriu"),
  level: z.coerce.number().min(0, "Minim 0").max(10, "Maxim 10"),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

function nextAccessLevel(current: AccessLevel): AccessLevel {
  const idx = ACCESS_LEVELS.indexOf(current);
  return ACCESS_LEVELS[(idx + 1) % ACCESS_LEVELS.length];
}

function AccessCell({
  access,
  permKey,
  role,
  onClick,
}: {
  access: AccessLevel;
  permKey: string;
  role: string;
  onClick: () => void;
}) {
  const config = ACCESS_LABELS[access];
  const Icon = config.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center w-full h-full cursor-pointer rounded-md p-1 transition-colors hover-elevate"
          onClick={onClick}
          data-testid={`cell-${permKey}-${role}`}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{config.label} (click pentru schimbare)</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function PermissionsMatrix() {
  const { toast } = useToast();

  const { data: savedMatrix } = useQuery<PermissionMatrixEntry[] | null>({
    queryKey: ["/api/settings/permission-matrix"],
  });

  const { data: savedRoles } = useQuery<CustomRolesData | null>({
    queryKey: ["/api/settings/custom-roles"],
  });

  const [matrix, setMatrix] = useState<PermissionMatrixEntry[]>([]);
  const [roleLabels, setRoleLabels] = useState<Record<string, string>>({});
  const [roleDescriptions, setRoleDescriptions] = useState<Record<string, string>>({});
  const [roleCreatedBy, setRoleCreatedBy] = useState<Record<string, string>>({});
  const [roleScopeLabels, setRoleScopeLabels] = useState<Record<string, string>>({});
  const [roleHierarchy, setRoleHierarchy] = useState<Record<string, number>>({});
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [editRoleDialog, setEditRoleDialog] = useState<string | null>(null);
  const [addRoleDialog, setAddRoleDialog] = useState(false);

  useEffect(() => {
    if (initialized) return;
    if (savedMatrix === undefined || savedRoles === undefined) return;

    const baseLabels: Record<string, string> = { ...ROLE_LABELS };
    const baseDescs: Record<string, string> = { ...ROLE_DESCRIPTIONS };
    const baseCreated: Record<string, string> = { ...ROLE_CREATED_BY };
    const baseScope: Record<string, string> = { ...ROLE_SCOPE_LABELS };
    const baseHierarchy: Record<string, number> = { ...ROLE_HIERARCHY };
    let baseRoles = [...roleEnum] as string[];

    if (savedRoles) {
      Object.assign(baseLabels, savedRoles.roleLabels);
      Object.assign(baseDescs, savedRoles.roleDescriptions);
      Object.assign(baseCreated, savedRoles.roleCreatedBy);
      Object.assign(baseScope, savedRoles.roleScopeLabels);
      Object.assign(baseHierarchy, savedRoles.roleHierarchy);
      for (const r of savedRoles.roles) {
        if (!baseRoles.includes(r.key)) {
          baseRoles.push(r.key);
        }
      }
    }

    const baseMatrix = savedMatrix || [...PERMISSION_MATRIX];
    const finalMatrix = baseMatrix.map((entry) => {
      const roles: Record<string, AccessLevel> = {};
      for (const r of baseRoles) {
        roles[r] = (entry.roles as Record<string, AccessLevel>)[r] || "none";
      }
      return { ...entry, roles } as PermissionMatrixEntry;
    });

    setRoleLabels(baseLabels);
    setRoleDescriptions(baseDescs);
    setRoleCreatedBy(baseCreated);
    setRoleScopeLabels(baseScope);
    setRoleHierarchy(baseHierarchy);
    setAllRoles(baseRoles);
    setMatrix(finalMatrix);
    setInitialized(true);
  }, [savedMatrix, savedRoles, initialized]);

  const handleCellClick = useCallback((permKey: string, role: string) => {
    setMatrix((prev) =>
      prev.map((entry) => {
        if (entry.key !== permKey) return entry;
        const currentAccess = (entry.roles as Record<string, AccessLevel>)[role] || "none";
        const newAccess = nextAccessLevel(currentAccess);
        return {
          ...entry,
          roles: { ...entry.roles, [role]: newAccess },
        } as PermissionMatrixEntry;
      })
    );
    setHasChanges(true);
  }, []);

  const saveMatrixMutation = useMutation({
    mutationFn: async () => {
      const customRoleEntries = allRoles
        .filter((r) => !(roleEnum as readonly string[]).includes(r))
        .map((key) => ({
          key,
          label: roleLabels[key] || key,
          description: roleDescriptions[key] || "",
          createdBy: roleCreatedBy[key] || "",
          scopeLabel: roleScopeLabels[key] || "",
          level: roleHierarchy[key] || 0,
        }));

      const customRolesPayload: CustomRolesData = {
        roles: customRoleEntries,
        roleLabels: { ...roleLabels },
        roleDescriptions: { ...roleDescriptions },
        roleCreatedBy: { ...roleCreatedBy },
        roleScopeLabels: { ...roleScopeLabels },
        roleHierarchy: { ...roleHierarchy },
      };

      await Promise.all([
        apiRequest("PUT", "/api/settings/permission-matrix", { value: matrix }),
        apiRequest("PUT", "/api/settings/custom-roles", { value: customRolesPayload }),
      ]);
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/settings/permission-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/custom-roles"] });
      toast({ title: "Salvat", description: "Modificarile au fost salvate cu succes." });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const editForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema.omit({ key: true })),
    defaultValues: { key: "", label: "", description: "", createdBy: "", scopeLabel: "", level: 1 },
  });

  const addForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema.extend({
      key: z.string().min(1, "Cheia este obligatorie").regex(/^[a-z_]+$/, "Doar litere mici si underscore")
        .refine((val) => !allRoles.includes(val), "Aceasta cheie exista deja"),
    })),
    defaultValues: { key: "", label: "", description: "", createdBy: "", scopeLabel: "", level: 1 },
  });

  useEffect(() => {
    if (editRoleDialog) {
      editForm.reset({
        key: editRoleDialog,
        label: roleLabels[editRoleDialog] || "",
        description: roleDescriptions[editRoleDialog] || "",
        createdBy: roleCreatedBy[editRoleDialog] || "",
        scopeLabel: roleScopeLabels[editRoleDialog] || "",
        level: roleHierarchy[editRoleDialog] || 1,
      });
    }
  }, [editRoleDialog, roleLabels, roleDescriptions, roleCreatedBy, roleScopeLabels, roleHierarchy, editForm]);

  useEffect(() => {
    if (addRoleDialog) {
      addForm.reset({ key: "", label: "", description: "", createdBy: "", scopeLabel: "", level: 1 });
    }
  }, [addRoleDialog, addForm]);

  const handleEditRoleSave = (values: RoleFormValues) => {
    const key = editRoleDialog!;
    setRoleLabels((prev) => ({ ...prev, [key]: values.label }));
    setRoleDescriptions((prev) => ({ ...prev, [key]: values.description }));
    setRoleCreatedBy((prev) => ({ ...prev, [key]: values.createdBy }));
    setRoleScopeLabels((prev) => ({ ...prev, [key]: values.scopeLabel }));
    setRoleHierarchy((prev) => ({ ...prev, [key]: values.level }));
    setHasChanges(true);
    setEditRoleDialog(null);
  };

  const handleAddRole = (values: RoleFormValues) => {
    setAllRoles((prev) => [...prev, values.key]);
    setRoleLabels((prev) => ({ ...prev, [values.key]: values.label }));
    setRoleDescriptions((prev) => ({ ...prev, [values.key]: values.description }));
    setRoleCreatedBy((prev) => ({ ...prev, [values.key]: values.createdBy }));
    setRoleScopeLabels((prev) => ({ ...prev, [values.key]: values.scopeLabel }));
    setRoleHierarchy((prev) => ({ ...prev, [values.key]: values.level }));
    setMatrix((prev) =>
      prev.map((entry) => ({
        ...entry,
        roles: { ...entry.roles, [values.key]: "none" as const },
      })) as PermissionMatrixEntry[]
    );
    setHasChanges(true);
    setAddRoleDialog(false);
  };

  const categories = Array.from(new Set(matrix.map((p) => p.category)));
  const groupedPermissions: Record<string, PermissionMatrixEntry[]> = {};
  for (const entry of matrix) {
    if (!groupedPermissions[entry.category]) {
      groupedPermissions[entry.category] = [];
    }
    groupedPermissions[entry.category].push(entry);
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full" data-testid="page-permissions-loading">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="page-permissions-matrix">
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-sm font-bold" data-testid="text-permissions-title">Matrice Permisiuni</h1>
          <div className="ml-auto flex items-center gap-1 flex-wrap">
            <Button
              variant="outline"
              className="h-6 px-2 text-[10px]"
              onClick={() => setAddRoleDialog(true)}
              data-testid="button-add-role"
            >
              <Plus className="w-3 h-3 mr-0.5" />
              Rol
            </Button>
            <Button
              className="h-6 px-2 text-[10px]"
              onClick={() => saveMatrixMutation.mutate()}
              disabled={!hasChanges || saveMatrixMutation.isPending}
              data-testid="button-save-changes"
            >
              {saveMatrixMutation.isPending ? (
                <Loader2 className="w-3 h-3 mr-0.5 animate-spin" />
              ) : (
                <Save className="w-3 h-3 mr-0.5" />
              )}
              Salveaza
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
            {allRoles.map((role) => (
              <Card key={role} data-testid={`card-role-${role}`}>
                <CardContent className="p-2 space-y-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-[9px] px-1 py-0" data-testid={`badge-role-level-${role}`}>
                      N{roleHierarchy[role] ?? 0}
                    </Badge>
                    <span className="text-[11px] font-semibold truncate flex-1" data-testid={`text-role-name-${role}`}>
                      {roleLabels[role] || role}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-5 h-5"
                      onClick={() => setEditRoleDialog(role)}
                      data-testid={`button-edit-role-${role}`}
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight truncate">{roleDescriptions[role] || ""}</p>
                  <div className="text-[9px] text-muted-foreground">
                    {roleCreatedBy[role] || "-"} · {roleScopeLabels[role] || "-"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground">Legenda:</span>
            {Object.entries(ACCESS_LABELS).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  <span>{config.label}</span>
                </div>
              );
            })}
          </div>

          <Card className="flex flex-col min-h-0 max-h-[60vh]">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-base">Tabel Complet Permisiuni</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto min-h-0 flex-1">
              <table className="w-full text-sm" data-testid="table-permissions-matrix">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground min-w-[250px] bg-background">Actiune / Raport</th>
                    {allRoles.map((role) => (
                      <th key={role} className="text-center p-2 font-medium min-w-[100px] bg-background" data-testid={`th-role-${role}`}>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">{roleLabels[role] || role}</span>
                          <Badge variant="outline" className="text-[10px]">N{roleHierarchy[role] ?? 0}</Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                  {categories.map((category) => {
                    const entries = groupedPermissions[category] || [];
                    const categoryLabel = entries[0]?.categoryLabel || category;
                    const CategoryIcon = CATEGORY_ICONS[category] || Shield;
                    return (
                      <tbody key={category}>
                        <tr className="bg-muted/50">
                          <td colSpan={allRoles.length + 1} className="p-1.5 px-2">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{categoryLabel}</span>
                            </div>
                          </td>
                        </tr>
                        {entries.map((entry) => (
                          <tr key={entry.key} className="border-b last:border-b-0" data-testid={`row-perm-${entry.key}`}>
                            <td className="p-1.5 px-2 text-sm">{entry.label}</td>
                            {allRoles.map((role) => (
                              <td key={role} className="p-1.5 text-center">
                                <AccessCell
                                  access={((entry.roles as Record<string, AccessLevel>)[role] || "none") as AccessLevel}
                                  permKey={entry.key}
                                  role={role}
                                  onClick={() => handleCellClick(entry.key, role)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    );
                  })}
                </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ierarhia de Creare Utilizatori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Cine poate crea pe cine?</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] shrink-0">N5</Badge>
                      <span><strong>Super Admin</strong> creeaza Gestori Super Admin, Administratori, Proprietari</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] shrink-0">N4</Badge>
                      <span><strong>Gestor Super Admin</strong> creeaza Administratori, Proprietari (in domeniul atribuit)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] shrink-0">N3</Badge>
                      <span><strong>Administrator</strong> creeaza Proprietari (in domeniul atribuit)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] shrink-0">N2</Badge>
                      <span><strong>Proprietar</strong> creeaza Chiriasi (pentru unitatea proprie)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] shrink-0">N1</Badge>
                      <span><strong>Chirias</strong> nu poate crea utilizatori</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tipuri de acces</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span><strong>Total</strong> - Acces complet, fara restrictii de domeniu</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Limitat</strong> - Doar in federatiile/asociatiile/blocurile atribuite</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Propriu</strong> - Doar datele proprii (unitatea/apartamentul propriu)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      <span><strong>Interzis</strong> - Fara acces la aceasta functionalitate</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!editRoleDialog} onOpenChange={(open) => !open && setEditRoleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editare Rol: {editRoleDialog ? (roleLabels[editRoleDialog] || editRoleDialog) : ""}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditRoleSave)} className="space-y-3">
              <FormField
                control={editForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eticheta</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-role-label" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriere</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-edit-role-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creat de</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-role-createdBy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="scopeLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domeniu</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-role-scopeLabel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Ierarhie</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} data-testid="input-edit-role-level" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditRoleDialog(null)} data-testid="button-edit-role-cancel">
                  Anuleaza
                </Button>
                <Button type="submit" data-testid="button-edit-role-save">
                  Salveaza
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={addRoleDialog} onOpenChange={setAddRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adauga Rol Nou</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddRole)} className="space-y-3">
              <FormField
                control={addForm.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cheie (unica)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: supervisor" data-testid="input-add-role-key" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eticheta</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-add-role-label" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriere</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-add-role-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creat de</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-add-role-createdBy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="scopeLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domeniu</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-add-role-scopeLabel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Ierarhie</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} data-testid="input-add-role-level" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddRoleDialog(false)} data-testid="button-add-role-cancel">
                  Anuleaza
                </Button>
                <Button type="submit" data-testid="button-add-role-save">
                  Adauga
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
