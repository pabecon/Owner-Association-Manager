import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2, Eye, EyeOff, User, MapPin, Info, Clock } from "lucide-react";
import type { Association, Building, Staircase, Apartment } from "@shared/schema";
import { PLATFORM_USER_ROLE_LABELS } from "@shared/schema";

interface PlatformUserActivity {
  id: string;
  platformUserId: string;
  action: string;
  details: string | null;
  performedBy: string | null;
  createdAt: string;
}

interface PlatformUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string | null;
  phone: string | null;
  userRole: string;
  associationId: string | null;
  buildingId: string | null;
  staircaseId: string | null;
  apartmentId: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  deactivatedAt: string | null;
  associationName: string | null;
  buildingName: string | null;
  staircaseName: string | null;
  apartmentNumber: string | null;
  apartmentFloor: number | null;
  activities: PlatformUserActivity[];
}

const editUserSchema = z.object({
  firstName: z.string().min(1, "Prenumele este obligatoriu"),
  lastName: z.string().min(1, "Numele este obligatoriu"),
  username: z.string().min(3, "Minim 3 caractere"),
  password: z.string().min(4, "Minim 4 caractere"),
  email: z.string().email("Email invalid").or(z.literal("")).optional(),
  phone: z.string().optional(),
  userRole: z.string().min(1, "Rolul este obligatoriu"),
  associationId: z.string().optional(),
  buildingId: z.string().optional(),
  staircaseId: z.string().optional(),
  apartmentId: z.string().optional(),
  isActive: z.boolean(),
});

type EditUserValues = z.infer<typeof editUserSchema>;

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UtilizatorDetail() {
  const [, params] = useRoute("/utilizator/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading } = useQuery<PlatformUserDetail>({
    queryKey: ["/api/platform-users", id],
    enabled: !!id,
  });

  const { data: associations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const { data: staircases } = useQuery<Staircase[]>({
    queryKey: ["/api/staircases"],
  });

  const { data: allApartments } = useQuery<Apartment[]>({
    queryKey: ["/api/apartments"],
  });

  const form = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      userRole: "owner",
      associationId: "",
      buildingId: "",
      staircaseId: "",
      apartmentId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        email: user.email || "",
        phone: user.phone || "",
        userRole: user.userRole,
        associationId: user.associationId || "",
        buildingId: user.buildingId || "",
        staircaseId: user.staircaseId || "",
        apartmentId: user.apartmentId || "",
        isActive: user.isActive,
      });
    }
  }, [user, form]);

  const watchAssociationId = form.watch("associationId");
  const watchBuildingId = form.watch("buildingId");
  const watchStaircaseId = form.watch("staircaseId");
  const watchIsActive = form.watch("isActive");

  const [prevAssociationId, setPrevAssociationId] = useState<string | undefined>(undefined);
  const [prevBuildingId, setPrevBuildingId] = useState<string | undefined>(undefined);
  const [prevStaircaseId, setPrevStaircaseId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (prevAssociationId !== undefined && watchAssociationId !== prevAssociationId) {
      form.setValue("buildingId", "");
      form.setValue("staircaseId", "");
      form.setValue("apartmentId", "");
    }
    setPrevAssociationId(watchAssociationId);
  }, [watchAssociationId]);

  useEffect(() => {
    if (prevBuildingId !== undefined && watchBuildingId !== prevBuildingId) {
      form.setValue("staircaseId", "");
      form.setValue("apartmentId", "");
    }
    setPrevBuildingId(watchBuildingId);
  }, [watchBuildingId]);

  useEffect(() => {
    if (prevStaircaseId !== undefined && watchStaircaseId !== prevStaircaseId) {
      form.setValue("apartmentId", "");
    }
    setPrevStaircaseId(watchStaircaseId);
  }, [watchStaircaseId]);

  const filteredBuildings = buildings?.filter((b) => b.associationId === watchAssociationId) || [];
  const filteredStaircases = staircases?.filter((s) => s.buildingId === watchBuildingId) || [];
  const filteredApartments = allApartments?.filter((a) => a.staircaseId === watchStaircaseId) || [];

  const updateUser = useMutation({
    mutationFn: async (data: EditUserValues) => {
      const body = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email || null,
        phone: data.phone || null,
        userRole: data.userRole,
        associationId: data.associationId || null,
        buildingId: data.buildingId || null,
        staircaseId: data.staircaseId || null,
        apartmentId: data.apartmentId || null,
        isActive: data.isActive,
      };
      const res = await apiRequest("PATCH", "/api/platform-users/" + id, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-users"] });
      toast({ title: "Utilizator actualizat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/platform-users/" + id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-users"] });
      toast({ title: "Utilizator sters cu succes" });
      setLocation("/lista-utilizatori");
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b">
          <Link href="/lista-utilizatori">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Inapoi la Lista Utilizatori
            </Button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground" data-testid="text-not-found">Utilizatorul nu a fost gasit.</p>
        </div>
      </div>
    );
  }

  const roleLabel = PLATFORM_USER_ROLE_LABELS[user.userRole as keyof typeof PLATFORM_USER_ROLE_LABELS] || user.userRole;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center gap-3 flex-wrap sticky top-0 z-40 bg-background">
        <Link href="/lista-utilizatori">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lista Utilizatori
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-user-name">
              {user.lastName} {user.firstName}
            </h1>
            <Badge variant="secondary" data-testid="badge-user-role">{roleLabel}</Badge>
            <Badge
              variant={user.isActive ? "default" : "destructive"}
              data-testid="badge-user-status"
            >
              {user.isActive ? "Activ" : "Inactiv"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={form.handleSubmit((data) => updateUser.mutate(data))}
              disabled={updateUser.isPending}
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateUser.isPending ? "Se salveaza..." : "Salveaza"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" data-testid="button-delete">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sterge
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmati stergerea</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sunteti sigur ca doriti sa stergeti utilizatorul {user.lastName} {user.firstName}? Aceasta actiune nu poate fi anulata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-delete">Anuleaza</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteUser.mutate()}
                    disabled={deleteUser.isPending}
                    data-testid="button-confirm-delete"
                  >
                    {deleteUser.isPending ? "Se sterge..." : "Sterge"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateUser.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Date Personale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nume de familie" data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prenume</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Prenume" data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Username" data-testid="input-username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parola</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Parola"
                                className="pr-10"
                                data-testid="input-password"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowPassword(!showPassword)}
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} placeholder="Email (optional)" data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Telefon (optional)" data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Locatie & Rol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-user-role">
                              <SelectValue placeholder="Selectati rolul" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">Proprietar</SelectItem>
                            <SelectItem value="tenant">Chirias</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-is-active"
                            />
                          </FormControl>
                          <Label>{field.value ? "Activ" : "Inactiv"}</Label>
                        </div>
                        {!watchIsActive && user.deactivatedAt && (
                          <p className="text-xs text-muted-foreground mt-1" data-testid="text-deactivated-at">
                            Dezactivat la: {formatDate(user.deactivatedAt)}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="associationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asociatie</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-association">
                              <SelectValue placeholder="Selectati asociatia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {associations?.map((a) => (
                              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloc</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={!watchAssociationId}>
                          <FormControl>
                            <SelectTrigger data-testid="select-building">
                              <SelectValue placeholder={watchAssociationId ? "Selectati blocul" : "Selectati asociatia intai"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredBuildings.map((b) => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staircaseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scara</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={!watchBuildingId}>
                          <FormControl>
                            <SelectTrigger data-testid="select-staircase">
                              <SelectValue placeholder={watchBuildingId ? "Selectati scara" : "Selectati blocul intai"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredStaircases.map((s) => (
                              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apartmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unitate</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={!watchStaircaseId}>
                          <FormControl>
                            <SelectTrigger data-testid="select-apartment">
                              <SelectValue placeholder={watchStaircaseId ? "Selectati unitatea" : "Selectati scara intai"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredApartments.map((a) => (
                              <SelectItem key={a.id} value={a.id}>Nr. {a.number}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Informatii
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Creat de</span>
                <p className="font-medium" data-testid="text-created-by">{user.createdBy || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data creare</span>
                <p className="font-medium" data-testid="text-created-at">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data dezactivare</span>
                <p className="font-medium" data-testid="text-deactivated-at-info">{formatDate(user.deactivatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.activities && user.activities.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Istoric Activitati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="activity-list">
                {user.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="relative pl-6 pb-4 border-l-2 border-muted last:border-l-0 last:pb-0"
                    data-testid={`activity-item-${activity.id}`}
                  >
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                    <p className="text-xs text-muted-foreground" data-testid={`activity-date-${activity.id}`}>
                      {formatDateShort(activity.createdAt)}
                    </p>
                    <p className="text-sm font-medium mt-0.5" data-testid={`activity-action-${activity.id}`}>
                      {activity.action}
                    </p>
                    {activity.details && (
                      <p className="text-sm text-muted-foreground mt-0.5" data-testid={`activity-details-${activity.id}`}>
                        {activity.details}
                      </p>
                    )}
                    {activity.performedBy && (
                      <p className="text-xs text-muted-foreground mt-0.5" data-testid={`activity-performed-by-${activity.id}`}>
                        De catre: {activity.performedBy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
