import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Home, Box, Car, User, Phone, Mail, Ruler, DoorOpen, Layers, MapPin, FileText, CreditCard, Megaphone, Building2, Save, ExternalLink, Pencil, X, Upload, Trash2, Download, File, Image } from "lucide-react";
import { UNIT_TYPE_LABELS, type UnitType, type Apartment, type Staircase, type Building, type Association, type UnitRoom, type Meter, type Document } from "@shared/schema";

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Box,
  parking: Car,
};

const METER_TYPE_LABELS: Record<string, string> = {
  water: "Apa",
  electricity: "Electricitate",
  gas: "Gaz",
};

type UnitTab = "general" | "camere" | "contoare" | "documente" | "plati" | "anunturi";

const TABS: { key: UnitTab; label: string; icon: any }[] = [
  { key: "general", label: "Informatii", icon: Ruler },
  { key: "camere", label: "Inf. Imobiliara", icon: DoorOpen },
  { key: "contoare", label: "Contoare", icon: Layers },
  { key: "documente", label: "Documente", icon: FileText },
  { key: "plati", label: "Plati", icon: CreditCard },
  { key: "anunturi", label: "Anunturi", icon: Megaphone },
];

const editUnitSchema = z.object({
  unitType: z.string().min(1),
  number: z.string().min(1, "Numarul este obligatoriu"),
  floor: z.coerce.number(),
  surface: z.string().optional(),
  builtSurface: z.string().optional(),
  rooms: z.coerce.number().optional(),
  residents: z.coerce.number().optional(),
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().optional(),
});

type EditUnitValues = z.infer<typeof editUnitSchema>;

function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function UnitDetail() {
  const [, params] = useRoute("/unitate/:id");
  const unitId = params?.id;
  const [activeTab, setActiveTab] = useState<UnitTab>("general");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: unit, isLoading: unitLoading } = useQuery<Apartment>({
    queryKey: ["/api/apartments", unitId],
    enabled: !!unitId,
  });

  const { data: rooms } = useQuery<UnitRoom[]>({
    queryKey: ["/api/unit-rooms", unitId],
    enabled: !!unitId && activeTab === "camere",
  });

  const { data: meters } = useQuery<Meter[]>({
    queryKey: ["/api/meters", unitId],
    enabled: !!unitId && (activeTab === "contoare" || activeTab === "general"),
  });

  const { data: allStaircases } = useQuery<Staircase[]>({
    queryKey: ["/api/staircases"],
  });

  const { data: allBuildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const { data: allAssociations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const staircase = allStaircases?.find(s => s.id === unit?.staircaseId);
  const building = allBuildings?.find(b => b.id === staircase?.buildingId);
  const association = allAssociations?.find(a => a.id === building?.associationId);
  const unitMeters = meters || [];

  const form = useForm<EditUnitValues>({
    resolver: zodResolver(editUnitSchema),
    defaultValues: {
      unitType: "apartment",
      number: "",
      floor: 0,
      surface: "",
      builtSurface: "",
      rooms: undefined,
      residents: undefined,
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
    },
  });

  useEffect(() => {
    if (unit) {
      form.reset({
        unitType: unit.unitType || "apartment",
        number: unit.number,
        floor: unit.floor,
        surface: unit.surface || "",
        builtSurface: unit.builtSurface || "",
        rooms: unit.rooms || undefined,
        residents: unit.residents ?? undefined,
        ownerName: unit.ownerName || "",
        ownerPhone: unit.ownerPhone || "",
        ownerEmail: unit.ownerEmail || "",
      });
    }
  }, [unit, form]);

  const updateUnit = useMutation({
    mutationFn: async (data: EditUnitValues) => {
      const body = {
        unitType: data.unitType,
        number: data.number,
        floor: data.floor,
        surface: data.surface || null,
        builtSurface: data.builtSurface || null,
        rooms: data.rooms || null,
        residents: data.residents ?? null,
        ownerName: data.ownerName || null,
        ownerPhone: data.ownerPhone || null,
        ownerEmail: data.ownerEmail || null,
      };
      const res = await apiRequest("PATCH", `/api/apartments/${unitId}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apartments", unitId] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: "Informatiile au fost salvate" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  if (unitLoading) {
    return (
      <div className="flex h-full">
        <div className="w-56 border-r p-3 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Unitatea nu a fost gasita.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inapoi la Infografie
          </Button>
        </Link>
      </div>
    );
  }

  const uType = (unit.unitType || "apartment") as UnitType;
  const UIcon = UNIT_TYPE_ICONS[uType] || Home;
  const typeLabel = UNIT_TYPE_LABELS[uType] || "Apartament";

  function getFloorLabel(floor: number) {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  }

  function handleCancel() {
    if (unit) {
      form.reset({
        unitType: unit.unitType || "apartment",
        number: unit.number,
        floor: unit.floor,
        surface: unit.surface || "",
        builtSurface: unit.builtSurface || "",
        rooms: unit.rooms || undefined,
        residents: unit.residents ?? undefined,
        ownerName: unit.ownerName || "",
        ownerPhone: unit.ownerPhone || "",
        ownerEmail: unit.ownerEmail || "",
      });
    }
    setIsEditing(false);
  }

  return (
    <div className="flex h-full">
      <div className="w-48 border-r flex flex-col shrink-0 bg-muted/30">
        <div className="p-2 border-b">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
              <UIcon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold truncate leading-tight" data-testid="text-unit-title">{typeLabel} {unit.number}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-none">
                {building?.name}{staircase ? ` / ${staircase.name}` : ""}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-1.5 space-y-px">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            let count: number | null = null;
            if (tab.key === "camere") count = rooms?.length || 0;
            if (tab.key === "contoare") count = unitMeters.length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 w-full px-2 py-1 rounded-md text-[12px] transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`tab-unit-${tab.key}`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {count !== null && count > 0 && (
                  <Badge variant="secondary" className="text-[9px] ml-auto px-1 py-0">{count}</Badge>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-1.5 border-t space-y-px">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-[11px] h-6" data-testid="button-back-infografie">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Infografie
            </Button>
          </Link>
          {association && (
            <Link href={`/asociatie/${association.id}`}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-[11px] h-6 truncate" data-testid="button-back-association">
                <Building2 className="w-3 h-3 mr-1 shrink-0" />
                <span className="truncate">{association.name}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2">
        {activeTab === "general" && (
          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Informatii Generale</h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setIsEditing(true)} data-testid="button-edit-unit">
                  <Pencil className="w-3 h-3 mr-0.5" />
                  Editeaza
                </Button>
              ) : (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={handleCancel} data-testid="button-cancel-edit">
                    <X className="w-3 h-3 mr-0.5" />
                    Anul.
                  </Button>
                  <Button size="sm" className="h-6 px-2 text-[10px]" onClick={form.handleSubmit((data) => updateUnit.mutate(data))} disabled={updateUnit.isPending} data-testid="button-save-unit">
                    <Save className="w-3 h-3 mr-0.5" />
                    {updateUnit.isPending ? "Salvare..." : "Salveaza"}
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => updateUnit.mutate(data))} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="text-xs flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-primary" />
                          Date Unitate
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 px-3 pb-3">
                        <FormField
                          control={form.control}
                          name="unitType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tip</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-unit-type">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="apartment">Apartament</SelectItem>
                                  <SelectItem value="box">Box</SelectItem>
                                  <SelectItem value="parking">Parking</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numar</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-unit-number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="floor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Etaj</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} data-testid="input-unit-floor" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="surface"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Suprafata utila (m²)</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-unit-surface" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="builtSurface"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Suprafata construita (m²)</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-unit-built-surface" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="rooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nr. Camere</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} value={field.value ?? ""} data-testid="input-unit-rooms" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="residents"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nr. Rezidenti</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} value={field.value ?? ""} data-testid="input-unit-residents" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="text-xs flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                          Proprietar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 px-3 pb-3">
                        <FormField
                          control={form.control}
                          name="ownerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nume Proprietar</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nume complet" data-testid="input-owner-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Telefon" data-testid="input-owner-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} placeholder="Email" data-testid="input-owner-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2 px-3 pt-3">
                      <CardTitle className="text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Locatie
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5 text-xs px-3 pb-3">
                      {association && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Asociatia</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{association.name}</span>
                            {association.address && (
                              <a
                                href={getGoogleMapsUrl(association.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                                title="Deschide in Google Maps"
                                data-testid="link-association-maps"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {building && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bloc</span>
                          <span className="font-medium">{building.name}</span>
                        </div>
                      )}
                      {staircase && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scara</span>
                          <span className="font-medium">{staircase.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Etaj</span>
                        <span className="font-medium">{getFloorLabel(unit.floor)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-primary" />
                      Date Unitate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-xs px-3 pb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip</span>
                      <span className="font-medium" data-testid="text-unit-type">{typeLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Numar</span>
                      <span className="font-medium" data-testid="text-unit-number">{unit.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Etaj</span>
                      <span className="font-medium">{getFloorLabel(unit.floor)}</span>
                    </div>
                    {unit.surface && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Suprafata utila</span>
                        <span className="font-medium">{unit.surface} m²</span>
                      </div>
                    )}
                    {unit.builtSurface && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Suprafata construita</span>
                        <span className="font-medium">{unit.builtSurface} m²</span>
                      </div>
                    )}
                    {unit.rooms && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nr. Camere</span>
                        <span className="font-medium">{unit.rooms}</span>
                      </div>
                    )}
                    {unit.residents !== null && unit.residents !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nr. Rezidenti</span>
                        <span className="font-medium">{unit.residents}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Proprietar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-xs px-3 pb-3">
                    {unit.ownerName ? (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-medium" data-testid="text-owner-name">{unit.ownerName}</span>
                        </div>
                        {unit.ownerPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{unit.ownerPhone}</span>
                          </div>
                        )}
                        {unit.ownerEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{unit.ownerEmail}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">Niciun proprietar inregistrat</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Locatie
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-xs px-3 pb-3">
                    {association && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Asociatia</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{association.name}</span>
                          {association.address && (
                            <a
                              href={getGoogleMapsUrl(association.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                              title="Deschide in Google Maps"
                              data-testid="link-association-maps"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {building && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bloc</span>
                        <span className="font-medium">{building.name}</span>
                      </div>
                    )}
                    {staircase && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scara</span>
                        <span className="font-medium">{staircase.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Etaj</span>
                      <span className="font-medium">{getFloorLabel(unit.floor)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "camere" && unitId && (
          <UnitRoomsTab unitId={unitId} rooms={rooms || []} />
        )}

        {activeTab === "contoare" && (
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-sm font-semibold">Contoare</h2>
            {unitMeters.length > 0 ? (
              <div className="space-y-2">
                {unitMeters.map(meter => (
                  <Card key={meter.id} data-testid={`meter-card-${meter.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{METER_TYPE_LABELS[meter.meterType] || meter.meterType}</span>
                            <Badge variant={meter.isActive ? "default" : "secondary"} className="text-[9px]">
                              {meter.isActive ? "Activ" : "Inactiv"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Serie: {meter.serialNumber} | Nr: {meter.meterNumber}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">Niciun contor inregistrat</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "documente" && unitId && (
          <UnitDocumentsTab unitId={unitId} />
        )}

        {activeTab === "plati" && (
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-sm font-semibold">Plati</h2>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">Nicio plata inregistrata</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "anunturi" && (
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-sm font-semibold">Anunturi</h2>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">Niciun anunt disponibil</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

interface RoomTypeItem {
  id: string;
  nume: string;
  descriere?: string;
}

function UnitRoomsTab({ unitId, rooms: initialRooms }: { unitId: string; rooms: UnitRoom[] }) {
  const { toast } = useToast();
  const [editingRooms, setEditingRooms] = useState<{ name: string; surface: string; terraceSurface: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const { data: roomTypes } = useQuery<RoomTypeItem[]>({
    queryKey: ["/api/liste", "tip-camera"],
  });

  useEffect(() => {
    if (initialRooms) {
      setEditingRooms(initialRooms.map(r => ({
        name: r.name,
        surface: r.surface?.toString() || "",
        terraceSurface: r.terraceSurface?.toString() || "",
      })));
    }
  }, [initialRooms]);

  const surfaceSum = editingRooms.reduce((sum, r) => sum + (parseFloat(r.surface) || 0), 0);
  const terraceSum = editingRooms.reduce((sum, r) => sum + (parseFloat(r.terraceSurface) || 0), 0);
  const totalBuiltSurface = surfaceSum + terraceSum;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validRooms = editingRooms.filter(r => r.name.trim());
      await apiRequest("POST", "/api/unit-rooms", {
        apartmentId: unitId,
        rooms: validRooms.map((r, i) => ({
          name: r.name,
          surface: r.surface ? parseFloat(r.surface) : null,
          terraceSurface: r.terraceSurface ? parseFloat(r.terraceSurface) : null,
          sortOrder: i,
        })),
      });
      const totalUseful = validRooms.reduce((sum, r) => sum + (parseFloat(r.surface) || 0), 0);
      const totalTerrace = validRooms.reduce((sum, r) => sum + (parseFloat(r.terraceSurface) || 0), 0);
      const totalBuilt = totalUseful + totalTerrace;
      await apiRequest("PATCH", `/api/apartments/${unitId}`, {
        surface: totalUseful > 0 ? totalUseful.toFixed(2) : null,
        builtSurface: totalBuilt > 0 ? totalBuilt.toFixed(2) : null,
        rooms: validRooms.length || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/unit-rooms", unitId] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments", unitId] });
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      toast({ title: "Camerele au fost salvate" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const addRoom = () => {
    setEditingRooms(prev => [...prev, { name: "", surface: "", terraceSurface: "" }]);
    if (!isEditing) setIsEditing(true);
  };

  const removeRoom = (idx: number) => {
    setEditingRooms(prev => prev.filter((_, i) => i !== idx));
  };

  const updateRoom = (idx: number, field: "name" | "surface" | "terraceSurface", value: string) => {
    setEditingRooms(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleCancel = () => {
    setEditingRooms(initialRooms.map(r => ({
      name: r.name,
      surface: r.surface?.toString() || "",
      terraceSurface: r.terraceSurface?.toString() || "",
    })));
    setIsEditing(false);
  };

  const roomTypeOptions = roomTypes?.map(rt => rt.nume) || [];

  return (
    <div className="space-y-2 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Camere ({editingRooms.length})</h2>
        <div className="flex items-center gap-1">
          {isEditing && (
            <>
              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={handleCancel} data-testid="button-cancel-rooms">
                <X className="w-3 h-3 mr-0.5" />Anuleaza
              </Button>
              <Button size="sm" className="h-6 px-2 text-[10px]" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-rooms">
                <Save className="w-3 h-3 mr-0.5" />{saveMutation.isPending ? "Salveaza..." : "Salveaza"}
              </Button>
            </>
          )}
          {!isEditing && (
            <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setIsEditing(true)} data-testid="button-edit-rooms">
              <Pencil className="w-3 h-3 mr-0.5" />Editeaza
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-3 space-y-2">
          {editingRooms.length > 0 ? (
            <>
              <div className="grid grid-cols-[auto_1fr_100px_100px_auto] gap-2 text-[10px] text-muted-foreground font-medium px-0.5">
                <span className="w-5">#</span>
                <span>Tip camera</span>
                <span>Sup. utila (m²)</span>
                <span>Terasa (m²)</span>
                <span className="w-6"></span>
              </div>
              {editingRooms.map((room, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_100px_100px_auto] gap-2 items-center" data-testid={`room-row-${i}`}>
                  <span className="text-[10px] text-muted-foreground w-5 text-center">{i + 1}</span>
                  {isEditing ? (
                    <>
                      <Select value={room.name} onValueChange={val => updateRoom(i, "name", val)}>
                        <SelectTrigger className="h-7 text-xs" data-testid={`select-room-type-${i}`}>
                          <SelectValue placeholder="Selecteaza tip..." />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypeOptions.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step="0.01"
                        value={room.surface}
                        onChange={e => updateRoom(i, "surface", e.target.value)}
                        placeholder="m²"
                        className="h-7 text-xs"
                        data-testid={`input-room-surface-${i}`}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={room.terraceSurface}
                        onChange={e => updateRoom(i, "terraceSurface", e.target.value)}
                        placeholder="m²"
                        className="h-7 text-xs"
                        data-testid={`input-room-terrace-${i}`}
                      />
                      <Button size="icon" variant="ghost" className="w-6 h-6 text-destructive" onClick={() => removeRoom(i)} data-testid={`button-remove-room-${i}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-medium truncate">{room.name}</span>
                      <span className="text-xs text-muted-foreground">{room.surface ? `${room.surface} m²` : "-"}</span>
                      <span className="text-xs text-muted-foreground">{room.terraceSurface ? `${room.terraceSurface} m²` : "-"}</span>
                      <span className="w-6" />
                    </>
                  )}
                </div>
              ))}
              <div className="border-t pt-1.5 mt-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Suprafata utila totala</span>
                  <span className="text-xs font-semibold" data-testid="text-room-surface-total">{surfaceSum > 0 ? `${surfaceSum.toFixed(2)} m²` : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Suprafata terasa totala</span>
                  <span className="text-xs font-semibold" data-testid="text-terrace-surface-total">{terraceSum > 0 ? `${terraceSum.toFixed(2)} m²` : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">Suprafata construita totala</span>
                  <span className="text-xs font-bold" data-testid="text-built-surface-total">{totalBuiltSurface > 0 ? `${totalBuiltSurface.toFixed(2)} m²` : "-"}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nicio camera inregistrata</p>
          )}

          {(isEditing || editingRooms.length === 0) && (
            <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={addRoom} data-testid="button-add-room">
              <DoorOpen className="w-3 h-3 mr-1" />Adauga Camera
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UnitDocumentsTab({ unitId }: { unitId: string }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docDescription, setDocDescription] = useState("");

  const { data: docs, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", "apartment", unitId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/apartment/${unitId}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", "apartment");
      formData.append("entityId", unitId);
      if (docDescription.trim()) formData.append("description", docDescription.trim());
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", "apartment", unitId] });
      setDocDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Document incarcat" });
    },
    onError: () => { toast({ title: "Eroare la incarcarea documentului", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/documents/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", "apartment", unitId] });
      toast({ title: "Document sters" });
    },
  });

  const handleFileSelect = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const isImage = (mime: string) => mime.startsWith("image/");
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2 max-w-4xl">
      <h2 className="text-sm font-semibold">Documente</h2>
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Input
              placeholder="Descriere (optional)"
              value={docDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocDescription(e.target.value)}
              className="flex-1 h-7 text-xs"
              data-testid="input-unit-doc-desc"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
              data-testid="input-unit-doc-file"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px]"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-upload-unit-doc"
            >
              <Upload className="w-3 h-3 mr-0.5" />
              {uploadMutation.isPending ? "Incarca..." : "Incarca"}
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : docs && docs.length > 0 ? (
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between gap-2 p-2 border rounded-md" data-testid={`unit-doc-${doc.id}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isImage(doc.mimeType) ? <Image className="w-4 h-4 shrink-0 text-muted-foreground" /> : <File className="w-4 h-4 shrink-0 text-muted-foreground" />}
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/api/documents/download/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate block"
                        data-testid={`link-unit-doc-${doc.id}`}
                      >
                        {doc.description || doc.originalName}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {doc.originalName} — {formatSize(doc.size)}
                        {doc.createdAt && ` — ${new Date(doc.createdAt).toLocaleDateString("ro-RO")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a href={`/api/documents/download/${doc.id}`} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" data-testid={`button-download-doc-${doc.id}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      data-testid={`button-delete-unit-doc-${doc.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Niciun document disponibil</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
