import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Check, X, Lock, Eye, Users, Building2, Receipt, FileText, BarChart3, Megaphone } from "lucide-react";
import {
  roleEnum, type UserRole,
  ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_CREATED_BY, ROLE_SCOPE_LABELS,
  ROLE_HIERARCHY, PERMISSION_MATRIX, type PermissionMatrixEntry,
} from "@shared/schema";

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

function AccessCell({ access, permKey, role }: { access: "full" | "scoped" | "own" | "none"; permKey: string; role: string }) {
  const config = ACCESS_LABELS[access];
  const Icon = config.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-center" data-testid={`cell-${permKey}-${role}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{config.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function PermissionsMatrix() {
  const roles = [...roleEnum];
  const categories = Array.from(new Set(PERMISSION_MATRIX.map(p => p.category)));

  const groupedPermissions: Record<string, PermissionMatrixEntry[]> = {};
  for (const entry of PERMISSION_MATRIX) {
    if (!groupedPermissions[entry.category]) {
      groupedPermissions[entry.category] = [];
    }
    groupedPermissions[entry.category].push(entry);
  }

  return (
    <div className="flex flex-col h-full" data-testid="page-permissions-matrix">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold" data-testid="text-permissions-title">Matrice Permisiuni</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {roles.map((role) => (
              <Card key={role} data-testid={`card-role-${role}`}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs" data-testid={`badge-role-level-${role}`}>
                      Nivel {ROLE_HIERARCHY[role]}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold" data-testid={`text-role-name-${role}`}>{ROLE_LABELS[role]}</h3>
                  <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                  <div className="pt-1 border-t space-y-1">
                    <div className="text-[11px]">
                      <span className="text-muted-foreground">Creat de: </span>
                      <span className="font-medium">{ROLE_CREATED_BY[role]}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-muted-foreground">Domeniu: </span>
                      <span className="font-medium">{ROLE_SCOPE_LABELS[role]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tabel Complet Permisiuni</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-permissions-matrix">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium text-muted-foreground min-w-[250px]">Actiune / Raport</th>
                      {roles.map((role) => (
                        <th key={role} className="text-center p-2 font-medium min-w-[100px]" data-testid={`th-role-${role}`}>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs">{ROLE_LABELS[role]}</span>
                            <Badge variant="outline" className="text-[10px]">N{ROLE_HIERARCHY[role]}</Badge>
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
                          <td colSpan={roles.length + 1} className="p-1.5 px-2">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{categoryLabel}</span>
                            </div>
                          </td>
                        </tr>
                        {entries.map((entry) => (
                          <tr key={entry.key} className="border-b last:border-b-0" data-testid={`row-perm-${entry.key}`}>
                            <td className="p-1.5 px-2 text-sm">{entry.label}</td>
                            {roles.map((role) => (
                              <td key={role} className="p-1.5 text-center">
                                <AccessCell access={entry.roles[role]} permKey={entry.key} role={role} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    );
                  })}
                </table>
              </div>
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
    </div>
  );
}
