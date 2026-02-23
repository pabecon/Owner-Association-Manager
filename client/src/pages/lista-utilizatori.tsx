import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Users, Plus, Search, ExternalLink, Power, Eye, EyeOff } from "lucide-react";
import type { Association, Building, Staircase, Apartment } from "@shared/schema";

interface PlatformUser {
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
}

const createUserSchema = z.object({
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

type CreateUserValues = z.infer<typeof createUserSchema>;

function formatFloor(floor: number | null | undefined): string {
  if (floor === null || floor === undefined) return "-";
  if (floor < 0) return `Subsol ${Math.abs(floor)}`;
  if (floor === 0) return "Parter";
  return `Etaj ${floor}`;
}

export default function ListaUtilizatoriPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: users, isLoading } = useQuery<PlatformUser[]>({
    queryKey: ["/api/platform-users"],
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

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      userRole: "",
      associationId: "",
      buildingId: "",
      staircaseId: "",
      apartmentId: "",
      isActive: true,
    },
  });

  const watchAssociationId = form.watch("associationId");
  const watchBuildingId = form.watch("buildingId");
  const watchStaircaseId = form.watch("staircaseId");

  useEffect(() => {
    form.setValue("buildingId", "");
    form.setValue("staircaseId", "");
    form.setValue("apartmentId", "");
  }, [watchAssociationId, form]);

  useEffect(() => {
    form.setValue("staircaseId", "");
    form.setValue("apartmentId", "");
  }, [watchBuildingId, form]);

  useEffect(() => {
    form.setValue("apartmentId", "");
  }, [watchStaircaseId, form]);

  const filteredBuildings = buildings?.filter((b) => b.associationId === watchAssociationId) || [];
  const filteredStaircases = staircases?.filter((s) => s.buildingId === watchBuildingId) || [];
  const filteredApartments = allApartments?.filter((a) => a.staircaseId === watchStaircaseId) || [];

  const createUser = useMutation({
    mutationFn: async (data: CreateUserValues) => {
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
      const res = await apiRequest("POST", "/api/platform-users", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-users"] });
      toast({ title: "Utilizator creat cu succes" });
      form.reset();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", "/api/platform-users/" + id, { isActive });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-users"] });
      toast({ title: variables.isActive ? "Utilizator activat" : "Utilizator dezactivat" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = users?.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${u.lastName} ${u.firstName}`.toLowerCase();
    return fullName.includes(q) || u.username.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-page-title">Lista Utilizatori</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gestionarea utilizatorilor platformei</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" />
                Adauga Utilizator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adauga Utilizator</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createUser.mutate(data))} className="space-y-4">
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
                              className="absolute right-0 top-0 h-full px-3"
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
                              <SelectItem key={a.id} value={a.id}>Nr. {a.number} - {formatFloor(a.floor)}</SelectItem>
                            ))}
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
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-is-active"
                          />
                        </FormControl>
                        <Label>Activ</Label>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Anuleaza</Button>
                    </DialogClose>
                    <Button type="submit" disabled={createUser.isPending} data-testid="button-submit-user">
                      {createUser.isPending ? "Se salveaza..." : "Salveaza"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cauta dupa nume sau username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-users"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        {isLoading ? (
          <Card>
            <CardContent className="p-3">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground" data-testid="text-no-users">
                  {searchQuery ? "Nu s-au gasit utilizatori care sa corespunda cautarii" : "Nu exista utilizatori inregistrati"}
                </p>
                {!searchQuery && (
                  <p className="text-xs text-muted-foreground mt-0.5">Folositi butonul "Adauga Utilizator" pentru a crea unul</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[calc(100vh-200px)] sticky-table-container">
                <Table className="compact-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Nume</TableHead>
                      <TableHead className="text-xs">Username</TableHead>
                      <TableHead className="text-xs">Rol</TableHead>
                      <TableHead className="text-xs">Asociatie</TableHead>
                      <TableHead className="text-xs">Bloc</TableHead>
                      <TableHead className="text-xs">Scara</TableHead>
                      <TableHead className="text-xs">Etaj</TableHead>
                      <TableHead className="text-xs">Unitate</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Actiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                        <TableCell className="font-medium" data-testid={`text-user-name-${user.id}`}>
                          {user.lastName} {user.firstName}
                        </TableCell>
                        <TableCell data-testid={`text-user-username-${user.id}`}>
                          {user.username}
                        </TableCell>
                        <TableCell data-testid={`text-user-role-${user.id}`}>
                          {user.userRole === "owner" ? "Proprietar" : "Chirias"}
                        </TableCell>
                        <TableCell data-testid={`text-user-association-${user.id}`}>
                          {user.associationName || "-"}
                        </TableCell>
                        <TableCell data-testid={`text-user-building-${user.id}`}>
                          {user.buildingName || "-"}
                        </TableCell>
                        <TableCell data-testid={`text-user-staircase-${user.id}`}>
                          {user.staircaseName || "-"}
                        </TableCell>
                        <TableCell data-testid={`text-user-floor-${user.id}`}>
                          {formatFloor(user.apartmentFloor)}
                        </TableCell>
                        <TableCell data-testid={`text-user-apartment-${user.id}`}>
                          {user.apartmentNumber || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className="text-xs"
                            data-testid={`badge-user-status-${user.id}`}
                          >
                            {user.isActive ? "Activ" : "Inactiv"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant={user.isActive ? "outline" : "default"}
                              onClick={() => toggleActive.mutate({ id: user.id, isActive: !user.isActive })}
                              disabled={toggleActive.isPending}
                              data-testid={`button-toggle-active-${user.id}`}
                              title={user.isActive ? "Dezactiveaza" : "Activeaza"}
                            >
                              <Power className="w-3 h-3 mr-1" />
                              {user.isActive ? "Dezactiveaza" : "Activeaza"}
                            </Button>
                            <Link href={`/utilizator/${user.id}`}>
                              <Button size="sm" variant="ghost" data-testid={`button-open-user-${user.id}`}>
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Deschide
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
