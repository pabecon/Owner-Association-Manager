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
import { insertBuildingSchema } from "@shared/schema";
import type { Building, Association } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Building2, Search, Trash2, MapPin, Layers, Users } from "lucide-react";
import { DocumentManager } from "@/components/document-manager";
import { z } from "zod";

const formSchema = insertBuildingSchema.extend({
  name: z.string().min(1, "Numele blocului este obligatoriu"),
  address: z.string().min(1, "Adresa este obligatorie"),
  associationId: z.string().min(1, "Asociatia este obligatorie"),
  totalApartments: z.coerce.number().min(1, "Numarul de apartamente trebuie sa fie minim 1"),
  floors: z.coerce.number().min(1, "Numarul de etaje trebuie sa fie minim 1"),
});

export default function Buildings() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: buildings, isLoading } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });
  const { data: associations } = useQuery<Association[]>({ queryKey: ["/api/associations"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associationId: "",
      name: "",
      address: "",
      totalApartments: 1,
      floors: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/buildings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      setOpen(false);
      form.reset();
      toast({ title: "Bloc adaugat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/buildings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      toast({ title: "Bloc sters" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const getAssociationName = (assocId: string) => {
    const a = associations?.find(a => a.id === assocId);
    return a?.name || "-";
  };

  const filtered = buildings?.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase()) ||
    getAssociationName(b.associationId).toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-buildings-title">Blocuri</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestioneaza blocurile din asociatii</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-building">
              <Plus className="w-4 h-4 mr-2" />
              Adauga Bloc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bloc Nou</DialogTitle>
              <DialogDescription>Adauga un bloc nou la o asociatie</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <FormField control={form.control} name="associationId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asociatie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-building-association">
                          <SelectValue placeholder="Selecteaza asociatia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {associations?.map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume Bloc</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: Bloc A1" data-testid="input-building-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresa</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: Str. Exemplu nr. 10" data-testid="input-building-address" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="totalApartments" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nr. Apartamente</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-building-apartments" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="floors" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nr. Etaje</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-building-floors" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-building">
                  {createMutation.isPending ? "Se salveaza..." : "Salveaza Bloc"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cauta dupa nume, adresa sau asociatie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-buildings"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-6 w-32" />
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
            <Building2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Niciun bloc gasit</p>
            <p className="text-sm text-muted-foreground mt-1">Adauga primul bloc pentru a incepe</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((bld) => (
            <Card key={bld.id} className="hover-elevate" data-testid={`card-building-${bld.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold" data-testid={`text-building-name-${bld.id}`}>{bld.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{bld.address}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(bld.id)}
                    data-testid={`button-delete-building-${bld.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    {bld.floors} etaje
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {bld.totalApartments} apartamente
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {getAssociationName(bld.associationId)}
                  </Badge>
                </div>
                <div className="pt-3 border-t">
                  <DocumentManager entityType="building" entityId={bld.id} title="Planuri / Documente Bloc" compact />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
