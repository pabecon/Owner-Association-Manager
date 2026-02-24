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
import { ArrowLeft, Home, Box, Car, User, Phone, Mail, Ruler, DoorOpen, Layers, MapPin, FileText, CreditCard, Megaphone, Building2, Save, ExternalLink, Pencil, X, Upload, Trash2, Download, File, Image, Plus, Droplets, Zap, Flame, Calendar as CalendarIcon, History, ClipboardPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { type Apartment, type Staircase, type Building, type Association, type UnitRoom, type Meter, type MeterReading, type Document, METER_PLACEMENT_LABELS, type MeterPlacement, meterPlacementEnum } from "@shared/schema";

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Box,
  parking: Car,
  apartament: Home,
  "spatiu comercial": Building2,
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
    enabled: !!unitId && (activeTab === "camere" || activeTab === "contoare"),
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

  const { data: tipImobilItems } = useQuery<any[]>({
    queryKey: ['/api/liste', 'tip-imobil'],
    queryFn: () => fetch('/api/liste/tip-imobil').then(r => r.json()),
  });

  const staircase = allStaircases?.find(s => s.id === unit?.staircaseId);
  const building = allBuildings?.find(b => b.id === staircase?.buildingId);
  const association = allAssociations?.find(a => a.id === building?.associationId);
  const unitMeters = meters || [];

  const form = useForm<EditUnitValues>({
    resolver: zodResolver(editUnitSchema),
    defaultValues: {
      unitType: "Apartament",
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
        unitType: unit.unitType || "Apartament",
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

  const typeLabel = unit.unitType || "Apartament";
  const iconKey = typeLabel.toLowerCase();
  const UIcon = UNIT_TYPE_ICONS[iconKey] || Home;

  function getFloorLabel(floor: number) {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  }

  function handleCancel() {
    if (unit) {
      form.reset({
        unitType: unit.unitType || "Apartament",
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
                                  {(tipImobilItems || []).map((tip: any) => (
                                    <SelectItem key={tip.id} value={tip.nume}>{tip.nume}</SelectItem>
                                  ))}
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
          <UnitRoomsTab unitId={unitId} rooms={rooms || []} unit={unit} />
        )}

        {activeTab === "contoare" && unitId && (
          <UnitMetersTab unitId={unitId} meters={unitMeters} rooms={rooms || []} />
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

function UnitRoomsTab({ unitId, rooms: initialRooms, unit }: { unitId: string; rooms: UnitRoom[]; unit?: Apartment }) {
  const { toast } = useToast();
  const [editingRooms, setEditingRooms] = useState<{ name: string; surface: string; terraceSurface: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [builtSurface, setBuiltSurface] = useState("");

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

  useEffect(() => {
    setBuiltSurface(unit?.builtSurface?.toString() || "");
  }, [unit?.builtSurface]);

  const surfaceSum = editingRooms.reduce((sum, r) => sum + (parseFloat(r.surface) || 0), 0);
  const terraceSum = editingRooms.reduce((sum, r) => sum + (parseFloat(r.terraceSurface) || 0), 0);

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
      const builtVal = parseFloat(builtSurface);
      await apiRequest("PATCH", `/api/apartments/${unitId}`, {
        surface: totalUseful > 0 ? totalUseful.toFixed(2) : null,
        builtSurface: builtVal > 0 ? builtVal.toFixed(2) : null,
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
    setBuiltSurface(unit?.builtSurface?.toString() || "");
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
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={builtSurface}
                        onChange={e => setBuiltSurface(e.target.value)}
                        placeholder="m²"
                        className="h-6 text-xs w-24 text-right font-bold"
                        data-testid="input-built-surface-total"
                      />
                      <span className="text-[10px] text-muted-foreground">m²</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold" data-testid="text-built-surface-total">{builtSurface && parseFloat(builtSurface) > 0 ? `${parseFloat(builtSurface).toFixed(2)} m²` : "-"}</span>
                  )}
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
  const [docType, setDocType] = useState("");
  const [docDate, setDocDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);

  const { data: docs, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", "apartment", unitId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/apartment/${unitId}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const { data: tipDocumentItems } = useQuery<any[]>({
    queryKey: ['/api/liste', 'tip-document'],
    queryFn: () => fetch('/api/liste/tip-document').then(r => r.json()),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", "apartment");
      formData.append("entityId", unitId);
      if (docDescription.trim()) formData.append("description", docDescription.trim());
      if (docType) formData.append("documentType", docType);
      if (docDate) {
        const y = docDate.getFullYear();
        const m = String(docDate.getMonth() + 1).padStart(2, "0");
        const d = String(docDate.getDate()).padStart(2, "0");
        formData.append("documentDate", `${y}-${m}-${d}`);
      }
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", "apartment", unitId] });
      setDocDescription("");
      setDocType("");
      setDocDate(undefined);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Document salvat cu succes" });
    },
    onError: () => { toast({ title: "Eroare la salvarea documentului", variant: "destructive" }); },
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
    if (file) setSelectedFile(file);
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast({ title: "Selecteaza un fisier", variant: "destructive" });
      return;
    }
    if (!docType) {
      toast({ title: "Selecteaza tipul documentului", variant: "destructive" });
      return;
    }
    if (!docDate) {
      toast({ title: "Selecteaza data documentului", variant: "destructive" });
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isImage = (mime: string) => mime.startsWith("image/");
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const groupedDocs = (docs || []).reduce<Record<string, Document[]>>((acc, doc) => {
    const type = doc.documentType || "Fara tip";
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedDocs).sort(([a], [b]) => {
    if (a === "Fara tip") return 1;
    if (b === "Fara tip") return -1;
    return a.localeCompare(b, "ro");
  });

  return (
    <div className="space-y-2 max-w-4xl">
      <h2 className="text-sm font-semibold">Documente</h2>
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="w-44 h-7 text-xs" data-testid="select-doc-type">
                  <SelectValue placeholder="Tip document *" />
                </SelectTrigger>
                <SelectContent>
                  {(tipDocumentItems || []).map((tip: any) => (
                    <SelectItem key={tip.id} value={tip.nume}>{tip.nume}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-40 h-7 text-xs justify-start text-left font-normal ${!docDate ? "text-muted-foreground" : ""}`}
                    data-testid="button-doc-date"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {docDate ? format(docDate, "dd.MM.yyyy") : "Data document *"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={docDate}
                    onSelect={(date) => { setDocDate(date); setCalendarOpen(false); }}
                    locale={ro}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Denumire document (optional)"
                value={docDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocDescription(e.target.value)}
                className="flex-1 h-7 text-xs min-w-[150px]"
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
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-select-file"
              >
                <Upload className="w-3 h-3 mr-0.5" />
                Alege fisier
              </Button>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <File className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span className="text-xs flex-1 truncate" data-testid="text-selected-file">{selectedFile.name}</span>
                <span className="text-[10px] text-muted-foreground">{formatSize(selectedFile.size)}</span>
                <Button variant="ghost" size="icon" className="w-5 h-5" onClick={handleClearFile} data-testid="button-clear-file">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                size="sm"
                className="h-7 px-3 text-[11px]"
                disabled={uploadMutation.isPending || !selectedFile || !docType || !docDate}
                onClick={handleSave}
                data-testid="button-save-doc"
              >
                <Save className="w-3 h-3 mr-0.5" />
                {uploadMutation.isPending ? "Se salveaza..." : "Salveaza document"}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : sortedGroups.length > 0 ? (
            <div className="space-y-3">
              {sortedGroups.map(([groupType, groupDocs]) => (
                <div key={groupType} data-testid={`doc-group-${groupType}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{groupType}</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{groupDocs.length}</Badge>
                  </div>
                  <div className="space-y-1 ml-5">
                    {groupDocs.map(doc => (
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
                              {(doc as any).documentDate && ` — ${format(new Date((doc as any).documentDate), "dd.MM.yyyy")}`}
                              {!(doc as any).documentDate && doc.createdAt && ` — ${format(new Date(doc.createdAt), "dd.MM.yyyy")}`}
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

const METER_TYPE_ICONS: Record<string, any> = {
  water: Droplets,
  electricity: Zap,
  gas: Flame,
};

type MeterFormData = {
  meterType: string;
  placement: string;
  chamberLocation: string;
  serialNumber: string;
  meterNumber: string;
  installDate: string;
  initialReading: string;
};

const emptyMeterForm: MeterFormData = { meterType: "", placement: "interior", chamberLocation: "", serialNumber: "", meterNumber: "", installDate: "", initialReading: "0" };

function MeterDatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-7 text-[11px] w-full justify-start text-left font-normal px-2 ${!value ? "text-muted-foreground" : ""}`}
          data-testid="button-meter-install-date"
        >
          <CalendarIcon className="mr-1 h-3 w-3 shrink-0" />
          {dateValue ? format(dateValue, "dd.MM.yyyy") : "Data inst."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, "0");
              const d = String(date.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${d}`);
            }
            setOpen(false);
          }}
          locale={ro}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function MeterFormRow({ data, onChange, rooms, isNew }: { data: MeterFormData; onChange: (d: MeterFormData) => void; rooms: string[]; isNew?: boolean }) {
  const upd = (field: keyof MeterFormData, val: string) => {
    const next = { ...data, [field]: val };
    if (field === "placement" && val === "exterior") next.chamberLocation = "";
    onChange(next);
  };
  return (
    <div className="grid grid-cols-[90px_80px_80px_1fr_1fr_120px_70px] gap-1.5 items-center" data-testid="meter-form-row">
      <Select value={data.meterType} onValueChange={v => upd("meterType", v)}>
        <SelectTrigger className="h-7 text-[11px]" data-testid="select-meter-type">
          <SelectValue placeholder="Tip..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="water">Apa</SelectItem>
          <SelectItem value="electricity">Electric.</SelectItem>
          <SelectItem value="gas">Gaz</SelectItem>
        </SelectContent>
      </Select>
      <Select value={data.placement} onValueChange={v => upd("placement", v)}>
        <SelectTrigger className="h-7 text-[11px]" data-testid="select-meter-placement">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="interior">Interior</SelectItem>
          <SelectItem value="exterior">Exterior</SelectItem>
        </SelectContent>
      </Select>
      {data.placement === "interior" ? (
        <Select value={data.chamberLocation} onValueChange={v => upd("chamberLocation", v)}>
          <SelectTrigger className="h-7 text-[11px]" data-testid="select-meter-room">
            <SelectValue placeholder="Camera..." />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : (
        <div />
      )}
      <Input value={data.serialNumber} onChange={e => upd("serialNumber", e.target.value)} placeholder="Serie" className="h-7 text-[11px]" data-testid="input-meter-serial" />
      <Input value={data.meterNumber} onChange={e => upd("meterNumber", e.target.value)} placeholder="Nr. contor" className="h-7 text-[11px]" data-testid="input-meter-number" />
      <MeterDatePicker value={data.installDate} onChange={v => upd("installDate", v)} />
      <Input type="number" step="0.001" value={data.initialReading} onChange={e => upd("initialReading", e.target.value)} placeholder="Index" className="h-7 text-[11px]" data-testid="input-meter-initial-reading" />
    </div>
  );
}

function MeterReadingInlineForm({ meterId, meter, onClose }: { meterId: string; meter: Meter; onClose: () => void }) {
  const { toast } = useToast();
  const [readingDate, setReadingDate] = useState("");
  const [readingValue, setReadingValue] = useState("");
  const [dateOpen, setDateOpen] = useState(false);

  const addReadingMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meter-readings", {
        meterId,
        readingDate,
        readingValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meter-readings", meterId] });
      queryClient.invalidateQueries({ queryKey: ["/api/meters", meter.apartmentId] });
      toast({ title: "Citire adaugata cu succes" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const dateValue = readingDate ? new Date(readingDate) : undefined;

  return (
    <div className="border rounded-md p-2 bg-muted/30 space-y-2" data-testid={`reading-form-${meterId}`}>
      <div className="text-[10px] font-medium text-muted-foreground">Adauga citire contor</div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-[9px] text-muted-foreground block mb-0.5">Data citirii</label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-7 text-[11px] w-full justify-start text-left font-normal px-2 ${!readingDate ? "text-muted-foreground" : ""}`}
                data-testid={`button-reading-date-${meterId}`}
              >
                <CalendarIcon className="mr-1 h-3 w-3 shrink-0" />
                {dateValue ? format(dateValue, "dd.MM.yyyy") : "Selecteaza data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, "0");
                    const d = String(date.getDate()).padStart(2, "0");
                    setReadingDate(`${y}-${m}-${d}`);
                  }
                  setDateOpen(false);
                }}
                locale={ro}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1">
          <label className="text-[9px] text-muted-foreground block mb-0.5">Valoare index</label>
          <Input
            type="number"
            step="0.001"
            className="h-7 text-[11px]"
            placeholder="ex: 1234.567"
            value={readingValue}
            onChange={(e) => setReadingValue(e.target.value)}
            data-testid={`input-reading-value-${meterId}`}
          />
        </div>
        <Button
          size="sm"
          className="h-7 px-2 text-[10px]"
          onClick={() => addReadingMutation.mutate()}
          disabled={!readingDate || !readingValue || addReadingMutation.isPending}
          data-testid={`button-save-reading-${meterId}`}
        >
          <Save className="w-3 h-3 mr-0.5" />{addReadingMutation.isPending ? "..." : "Salveaza"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-[10px]"
          onClick={onClose}
          data-testid={`button-cancel-reading-${meterId}`}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function MeterReadingHistory({ meterId }: { meterId: string }) {
  const { data: readings, isLoading } = useQuery<MeterReading[]>({
    queryKey: ["/api/meter-readings", meterId],
  });

  if (isLoading) return <Skeleton className="h-12 w-full" />;
  if (!readings || readings.length === 0) {
    return (
      <div className="border rounded-md p-2 bg-muted/20" data-testid={`history-empty-${meterId}`}>
        <p className="text-[10px] text-muted-foreground text-center py-1">Nicio citire inregistrata</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 bg-muted/20 space-y-1" data-testid={`history-panel-${meterId}`}>
      <div className="text-[10px] font-medium text-muted-foreground mb-1">Istoric citiri</div>
      <div className="grid grid-cols-[100px_90px_90px_90px] gap-1 text-[9px] text-muted-foreground font-medium border-b pb-0.5">
        <span>Data</span>
        <span className="text-right">Index</span>
        <span className="text-right">Consum</span>
        <span className="text-right">Total acum.</span>
      </div>
      {readings.map((r) => (
        <div
          key={r.id}
          className="grid grid-cols-[100px_90px_90px_90px] gap-1 text-[11px] items-center py-0.5 border-b border-muted last:border-0"
          data-testid={`history-row-${r.id}`}
        >
          <span className="text-muted-foreground">{r.readingDate ? format(new Date(r.readingDate), "dd.MM.yyyy") : "-"}</span>
          <span className="text-right font-medium tabular-nums">{Number(r.readingValue).toFixed(3)}</span>
          <span className="text-right tabular-nums text-primary font-medium">
            {r.consumption != null ? Number(r.consumption).toFixed(3) : "-"}
          </span>
          <span className="text-right tabular-nums text-muted-foreground">
            {r.accumulatedConsumption != null ? Number(r.accumulatedConsumption).toFixed(3) : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}

function UnitMetersTab({ unitId, meters, rooms }: { unitId: string; meters: Meter[]; rooms: UnitRoom[] }) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newData, setNewData] = useState<MeterFormData>({ ...emptyMeterForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MeterFormData>({ ...emptyMeterForm });
  const [addReadingId, setAddReadingId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);

  const roomNames = rooms.map(r => r.name).filter(Boolean);

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meters", {
        apartmentId: unitId,
        scopeType: "apartment",
        meterType: newData.meterType,
        placement: newData.placement,
        chamberLocation: newData.placement === "interior" ? newData.chamberLocation : null,
        serialNumber: newData.serialNumber,
        meterNumber: newData.meterNumber,
        installDate: newData.installDate,
        initialReading: newData.initialReading || "0",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters", unitId] });
      toast({ title: "Contorul a fost creat" });
      setShowForm(false);
      setNewData({ ...emptyMeterForm });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (meterId: string) => {
      await apiRequest("PATCH", `/api/meters/${meterId}`, {
        meterType: editData.meterType,
        placement: editData.placement,
        chamberLocation: editData.placement === "interior" ? editData.chamberLocation : null,
        serialNumber: editData.serialNumber,
        meterNumber: editData.meterNumber,
        installDate: editData.installDate,
        initialReading: editData.initialReading || "0",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters", unitId] });
      toast({ title: "Contorul a fost actualizat" });
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (meterId: string) => {
      await apiRequest("DELETE", `/api/meters/${meterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters", unitId] });
      toast({ title: "Contorul a fost sters" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const startEdit = (meter: Meter) => {
    setEditingId(meter.id);
    setAddReadingId(null);
    setHistoryId(null);
    setEditData({
      meterType: meter.meterType,
      placement: (meter as any).placement || "interior",
      chamberLocation: meter.chamberLocation || "",
      serialNumber: meter.serialNumber,
      meterNumber: meter.meterNumber,
      installDate: meter.installDate,
      initialReading: meter.initialReading?.toString() || "0",
    });
  };

  const toggleAddReading = (meterId: string) => {
    setAddReadingId(addReadingId === meterId ? null : meterId);
    setEditingId(null);
  };

  const toggleHistory = (meterId: string) => {
    setHistoryId(historyId === meterId ? null : meterId);
  };

  const isNewValid = newData.meterType && newData.serialNumber.trim() && newData.meterNumber.trim() && newData.installDate &&
    (newData.placement === "exterior" || (newData.placement === "interior" && newData.chamberLocation));

  const isEditValid = editData.meterType && editData.serialNumber.trim() && editData.meterNumber.trim() && editData.installDate &&
    (editData.placement === "exterior" || (editData.placement === "interior" && editData.chamberLocation));

  return (
    <div className="space-y-2 max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Contoare ({meters.length})</h2>
        {!showForm && (
          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => { setShowForm(true); setEditingId(null); }} data-testid="button-add-meter">
            <Plus className="w-3 h-3 mr-0.5" />Adauga Contor
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-2 space-y-1">
          <div className="grid grid-cols-[90px_80px_80px_1fr_1fr_100px_70px_auto] gap-1.5 text-[9px] text-muted-foreground font-medium px-0.5">
            <span>Tip</span>
            <span>Amplasare</span>
            <span>Camera</span>
            <span>Serie</span>
            <span>Nr. contor</span>
            <span>Data inst.</span>
            <span>Index</span>
            <span className="w-24"></span>
          </div>

          {meters.map(meter => {
            const MeterIcon = METER_TYPE_ICONS[meter.meterType] || Layers;
            if (editingId === meter.id) {
              return (
                <div key={meter.id} className="space-y-1" data-testid={`meter-edit-${meter.id}`}>
                  <MeterFormRow data={editData} onChange={setEditData} rooms={roomNames} />
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" className="h-5 px-2 text-[10px]" onClick={() => setEditingId(null)} data-testid="button-cancel-edit-meter">
                      <X className="w-3 h-3 mr-0.5" />Anul.
                    </Button>
                    <Button size="sm" className="h-5 px-2 text-[10px]" onClick={() => updateMutation.mutate(meter.id)} disabled={!isEditValid || updateMutation.isPending} data-testid="button-save-edit-meter">
                      <Save className="w-3 h-3 mr-0.5" />{updateMutation.isPending ? "..." : "Salv."}
                    </Button>
                  </div>
                </div>
              );
            }
            return (
              <div key={meter.id} className="space-y-1" data-testid={`meter-card-${meter.id}`}>
                <div className="grid grid-cols-[90px_80px_80px_1fr_1fr_100px_70px_auto] gap-1.5 items-center py-0.5">
                  <div className="flex items-center gap-1 text-[11px]">
                    <MeterIcon className="w-3 h-3 text-primary shrink-0" />
                    <span className="font-medium truncate">{METER_TYPE_LABELS[meter.meterType] || meter.meterType}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate">{METER_PLACEMENT_LABELS[(meter as any).placement as MeterPlacement] || (meter as any).placement || "-"}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{meter.chamberLocation || "-"}</span>
                  <span className="text-[11px] font-medium truncate">{meter.serialNumber}</span>
                  <span className="text-[11px] font-medium truncate">{meter.meterNumber}</span>
                  <span className="text-[11px] text-muted-foreground">{meter.installDate ? format(new Date(meter.installDate), "dd.MM.yyyy") : "-"}</span>
                  <span className="text-[11px] font-medium">{meter.initialReading}</span>
                  <div className="flex items-center gap-0.5 w-24 justify-end">
                    <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => startEdit(meter)} title="Editeaza contor" data-testid={`button-edit-meter-${meter.id}`}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className={`w-5 h-5 ${addReadingId === meter.id ? "bg-primary/10 text-primary" : ""}`} onClick={() => toggleAddReading(meter.id)} title="Adauga citire" data-testid={`button-add-reading-${meter.id}`}>
                      <ClipboardPlus className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className={`w-5 h-5 ${historyId === meter.id ? "bg-primary/10 text-primary" : ""}`} onClick={() => toggleHistory(meter.id)} title="Istoric citiri" data-testid={`button-history-${meter.id}`}>
                      <History className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-5 h-5 text-destructive" onClick={() => deleteMutation.mutate(meter.id)} title="Sterge contor" data-testid={`button-delete-meter-${meter.id}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {addReadingId === meter.id && (
                  <MeterReadingInlineForm meterId={meter.id} meter={meter} onClose={() => setAddReadingId(null)} />
                )}

                {historyId === meter.id && (
                  <MeterReadingHistory meterId={meter.id} />
                )}
              </div>
            );
          })}

          {showForm && (
            <div className="space-y-1 border-t pt-1.5" data-testid="meter-form">
              <MeterFormRow data={newData} onChange={setNewData} rooms={roomNames} isNew />
              <div className="flex justify-end gap-1">
                <Button variant="outline" size="sm" className="h-5 px-2 text-[10px]" onClick={() => { setShowForm(false); setNewData({ ...emptyMeterForm }); }} data-testid="button-cancel-meter">
                  <X className="w-3 h-3 mr-0.5" />Anul.
                </Button>
                <Button size="sm" className="h-5 px-2 text-[10px]" onClick={() => createMutation.mutate()} disabled={!isNewValid || createMutation.isPending} data-testid="button-save-meter">
                  <Save className="w-3 h-3 mr-0.5" />{createMutation.isPending ? "..." : "Salv."}
                </Button>
              </div>
            </div>
          )}

          {meters.length === 0 && !showForm && (
            <p className="text-xs text-muted-foreground text-center py-3">Niciun contor inregistrat</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
