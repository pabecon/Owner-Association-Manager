import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowDown } from "lucide-react";
import {
  roleEnum, type UserRole,
  ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_CREATED_BY, ROLE_SCOPE_LABELS,
  ROLE_HIERARCHY,
} from "@shared/schema";

export default function RoluriPage() {
  const roles = [...roleEnum];

  return (
    <div className="flex flex-col h-full" data-testid="page-roluri">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-bold" data-testid="text-roluri-title">Roluri Utilizatori</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="max-w-4xl mx-auto space-y-3">
          {roles.map((role, index) => {
            const level = ROLE_HIERARCHY[role];
            return (
              <div key={role}>
                <Card data-testid={`card-role-${role}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {ROLE_LABELS[role]}
                      </CardTitle>
                      <Badge variant="secondary" data-testid={`badge-level-${role}`}>
                        Nivel {level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground whitespace-nowrap">Creat de:</span>
                        <span className="font-medium">{ROLE_CREATED_BY[role]}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground whitespace-nowrap">Domeniu:</span>
                        <span className="font-medium">{ROLE_SCOPE_LABELS[role]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < roles.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            );
          })}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Reguli de Creare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
