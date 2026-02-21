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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAssociationSchema } from "@shared/schema";
import type { Association, Federation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Users, Search, Trash2, MapPin, User, Phone, Mail, Network, FileText } from "lucide-react";
import { z } from "zod";

const formSchema = insertAssociationSchema.extend({
  name: z.string().min(1, "Numele este obligatoriu"),
});

export default function Associations() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: associations, isLoading } = useQuery<Association[]>({ queryKey: ["/api/associations"] });
  const { data: federations } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      federationId: null,
      name: "",
      description: "",
      cui: "",
      address: "",
      presidentName: "",
      presidentPhone: "",
      presidentEmail: "",
      adminName: "",
      adminPhone: "",
      adminEmail: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = { ...data, federationId: data.federationId || null };
      const res = await apiRequest("POST", "/api/associations", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      setOpen(false);
      form.reset();
      toast({ title: "Asociatie adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/associations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/associations"] });
      toast({ title: "Asociatie stearsa" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const getFederationName = (fedId: string | null) => {
    if (!fedId) return null;
    const fed = federations?.find(f => f.id === fedId);
    return fed?.name || null;
  };

  const filtered = associations?.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase()) ||
    a.cui?.toLowerCase().includes(search.toLowerCase()) ||
    a.presidentName?.toLowerCase().includes(search.toLowerCase()) ||
    false
  ) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-associations-title">Asociatii</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gestioneaza asociatiile de proprietari</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-association">
                <Plus className="w-4 h-4 mr-2" />
                Adauga Asociatie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Asociatie Noua</DialogTitle>
                <DialogDescription>Completeaza datele asociatiei de proprietari</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <FormField control={form.control} name="federationId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Federatie (optional)</FormLabel>
                      <Select onValueChange={(v) => field.onChange(v === "__none__" ? null : v)} defaultValue={field.value || "__none__"}>
                        <FormControl>
                          <SelectTrigger data-testid="select-association-federation">
                            <SelectValue placeholder="Fara federatie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">Independenta (fara federatie)</SelectItem>
                          {federations?.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Asociatie</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: Asociatia Bloc A1-A3" data-testid="input-association-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="cui" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CUI (Cod Unic Identificare)</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} placeholder="ex: RO12345678" data-testid="input-association-cui" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresa</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} placeholder="ex: Str. Exemplu nr. 10" data-testid="input-association-address" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descriere</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} rows={2} placeholder="Descriere optionala..." data-testid="input-association-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Presedinte</p>
                    <div className="space-y-3">
                      <FormField control={form.control} name="presidentName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume Presedinte</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} placeholder="Ion Popescu" data-testid="input-president-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="presidentPhone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl><Input {...field} value={field.value || ""} placeholder="07xx..." data-testid="input-president-phone" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="presidentEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input {...field} value={field.value || ""} placeholder="email@..." data-testid="input-president-email" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Administrator</p>
                    <div className="space-y-3">
                      <FormField control={form.control} name="adminName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume Administrator</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} placeholder="Ana Ionescu" data-testid="input-admin-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="adminPhone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl><Input {...field} value={field.value || ""} placeholder="07xx..." data-testid="input-admin-phone" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="adminEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input {...field} value={field.value || ""} placeholder="email@..." data-testid="input-admin-email" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-association">
                    {createMutation.isPending ? "Se salveaza..." : "Salveaza Asociatie"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cauta dupa nume, CUI sau presedinte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-associations"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-3 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Nicio asociatie gasita</p>
              <p className="text-sm text-muted-foreground mt-0.5">Adauga prima asociatie pentru a incepe</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((assoc) => {
              const fedName = getFederationName(assoc.federationId);
              return (
                <Card key={assoc.id} className="hover-elevate" data-testid={`card-association-${assoc.id}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold" data-testid={`text-association-name-${assoc.id}`}>{assoc.name}</p>
                          {assoc.cui && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <FileText className="w-3 h-3" />
                              <span>CUI: {assoc.cui}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(assoc.id)}
                        data-testid={`button-delete-association-${assoc.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    {assoc.address && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{assoc.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {fedName ? (
                        <Badge variant="outline" className="text-xs">
                          <Network className="w-3 h-3 mr-1" />
                          {fedName}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Independenta</Badge>
                      )}
                    </div>
                    {(assoc.presidentName || assoc.adminName) && (
                      <div className="space-y-1.5 pt-2 border-t">
                        {assoc.presidentName && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Presedinte: {assoc.presidentName}</span>
                          </div>
                        )}
                        {assoc.presidentPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{assoc.presidentPhone}</span>
                          </div>
                        )}
                        {assoc.adminName && (
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Admin: {assoc.adminName}</span>
                          </div>
                        )}
                        {assoc.adminPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{assoc.adminPhone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
