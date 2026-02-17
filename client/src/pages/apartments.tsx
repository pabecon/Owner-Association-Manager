import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApartmentSchema } from "@shared/schema";
import type { Apartment, Building } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Home, User, Phone, Mail, Search, Layers } from "lucide-react";
import { z } from "zod";

const formSchema = insertApartmentSchema.extend({
  number: z.string().min(1, "Numarul apartamentului este obligatoriu"),
  floor: z.coerce.number().min(0, "Etajul trebuie sa fie pozitiv"),
  surface: z.string().optional(),
  rooms: z.coerce.number().optional(),
  residents: z.coerce.number().min(1).optional(),
});

export default function Apartments() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: apartments, isLoading } = useQuery<Apartment[]>({ queryKey: ["/api/apartments"] });
  const { data: buildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
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
      toast({ title: "Apartament adaugat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const filtered = apartments?.filter(a =>
    a.number.toLowerCase().includes(search.toLowerCase()) ||
    a.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    ""
  ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-apartments-title">Apartamente</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestioneaza apartamentele din bloc</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-apartment">
              <Plus className="w-4 h-4 mr-2" />
              Adauga Apartament
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apartament Nou</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <FormField control={form.control} name="buildingId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloc</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-building">
                          <SelectValue placeholder="Selecteaza blocul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings?.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="number" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numar Apartament</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: 12" data-testid="input-apt-number" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="floor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etaj</FormLabel>
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
                  {createMutation.isPending ? "Se salveaza..." : "Salveaza Apartament"}
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
                <div className="flex items-center justify-between">
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
          {filtered.map((apt) => (
            <Card key={apt.id} className="hover-elevate" data-testid={`card-apartment-${apt.id}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                      <Home className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-lg font-bold">Ap. {apt.number}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    Etaj {apt.floor}
                  </Badge>
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
          ))}
        </div>
      )}
    </div>
  );
}
