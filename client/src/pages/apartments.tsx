import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApartmentSchema, UNIT_TYPE_LABELS, type UnitType } from "@shared/schema";
import type { Apartment, Building, Staircase } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Home, User, Phone, Mail, Search, Layers, ArrowUpDown, Building2, Car, Package } from "lucide-react";
import { z } from "zod";

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Package,
  parking: Car,
};

const formSchema = insertApartmentSchema.extend({
  number: z.string().min(1, "Numarul unitatii este obligatoriu"),
  staircaseId: z.string().min(1, "Scara este obligatorie"),
  unitType: z.string().default("apartment"),
  floor: z.coerce.number(),
  surface: z.string().optional(),
  rooms: z.coerce.number().optional(),
  residents: z.coerce.number().min(0).optional(),
});

export default function Apartments() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const { toast } = useToast();

  const { data: apartments, isLoading } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });
  const { data: buildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: staircases } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });

  const filteredStaircases = selectedBuilding
    ? staircases?.filter(s => s.buildingId === selectedBuilding)
    : staircases;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staircaseId: "",
      unitType: "apartment",
      number: "",
      floor: 0,
      surface: "",
      rooms: 1,
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      residents: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/apartments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apartments"] });
      setOpen(false);
      form.reset();
      setSelectedBuilding("");
      toast({ title: "Apartament adaugat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const getStaircaseInfo = (staircaseId: string) => {
    const s = staircases?.find(s => s.id === staircaseId);
    if (!s) return { staircase: null, building: null };
    const b = buildings?.find(b => b.id === s.buildingId);
    return { staircase: s, building: b };
  };

  const filtered = apartments?.filter(a =>
    a.number.toLowerCase().includes(search.toLowerCase()) ||
    a.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    false
  ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-apartments-title">Unitati</h1>
          <p className="text-muted-foreground text-sm mt-1">Apartamente, boxe si locuri de parcare</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedBuilding(""); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-apartment">
              <Plus className="w-4 h-4 mr-2" />
              Adauga Unitate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Unitate Noua</DialogTitle>
              <DialogDescription>Adauga o unitate (apartament, box sau loc parcare)</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Bloc (filtru)</label>
                  <Select onValueChange={(v) => { setSelectedBuilding(v === "__all__" ? "" : v); form.setValue("staircaseId", ""); }} value={selectedBuilding || "__all__"}>
                    <SelectTrigger data-testid="select-filter-building" className="mt-1.5">
                      <SelectValue placeholder="Toate blocurile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Toate blocurile</SelectItem>
                      {buildings?.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormField control={form.control} name="staircaseId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scara</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-staircase">
                          <SelectValue placeholder="Selecteaza scara" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredStaircases?.map(s => {
                          const b = buildings?.find(b => b.id === s.buildingId);
                          return (
                            <SelectItem key={s.id} value={s.id}>{b ? `${b.name} - ${s.name}` : s.name}</SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="unitType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip Unitate</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "apartment"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-unit-type">
                          <SelectValue placeholder="Selecteaza tipul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartament</SelectItem>
                        <SelectItem value="box">Box / Trastera</SelectItem>
                        <SelectItem value="parking">Loc Parcare</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="number" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numar</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: 12, B1, P3" data-testid="input-apt-number" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="floor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etaj (negativ = subsol)</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-apt-floor" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="surface" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suprafata (mp)</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: 52.5" data-testid="input-apt-surface" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="rooms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camere</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-apt-rooms" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="ownerName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume Proprietar</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="Ion Popescu" data-testid="input-owner-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} placeholder="07xx..." data-testid="input-owner-phone" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ownerEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} placeholder="email@..." data-testid="input-owner-email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="residents" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nr. Persoane</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-residents" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-apartment">
                  {createMutation.isPending ? "Se salveaza..." : "Salveaza Unitate"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cauta dupa numar sau proprietar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-apartments"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Home className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Niciun apartament gasit</p>
            <p className="text-sm text-muted-foreground mt-1">Adauga primul apartament pentru a incepe</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((apt) => {
            const { staircase, building } = getStaircaseInfo(apt.staircaseId);
            return (
              <Card key={apt.id} className="hover-elevate" data-testid={`card-apartment-${apt.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const uType = (apt.unitType || "apartment") as UnitType;
                        const UIcon = UNIT_TYPE_ICONS[uType] || Home;
                        const typeLabel = UNIT_TYPE_LABELS[uType] || "Apartament";
                        return (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                              <UIcon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-lg font-bold">{typeLabel} {apt.number}</span>
                          </>
                        );
                      })()}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      {apt.floor < 0 ? `Subsol ${Math.abs(apt.floor)}` : apt.floor === 0 ? "Parter" : `Etaj ${apt.floor}`}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
                    {building && (
                      <Badge variant="outline" className="text-xs">
                        <Building2 className="w-3 h-3 mr-1" />
                        {building.name}
                      </Badge>
                    )}
                    {staircase && (
                      <Badge variant="outline" className="text-xs">
                        <ArrowUpDown className="w-3 h-3 mr-1" />
                        {staircase.name}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {apt.ownerName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{apt.ownerName}</span>
                      </div>
                    )}
                    {apt.ownerPhone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{apt.ownerPhone}</span>
                      </div>
                    )}
                    {apt.ownerEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{apt.ownerEmail}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
                    {apt.surface && <span>{apt.surface} mp</span>}
                    {apt.rooms && <span>{apt.rooms} camere</span>}
                    {apt.residents && <span>{apt.residents} {Number(apt.residents) === 1 ? "persoana" : "persoane"}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
