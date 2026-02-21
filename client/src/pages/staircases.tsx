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
import { insertStaircaseSchema } from "@shared/schema";
import type { Staircase, Building } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, Trash2, Layers, Building2, ArrowUpDown } from "lucide-react";
import { DocumentManager } from "@/components/document-manager";
import { z } from "zod";

const formSchema = insertStaircaseSchema.extend({
  name: z.string().min(1, "Numele scarii este obligatoriu"),
  buildingId: z.string().min(1, "Blocul este obligatoriu"),
  floors: z.coerce.number().min(1, "Numarul de etaje trebuie sa fie minim 1"),
  apartmentsPerFloor: z.coerce.number().min(1, "Numarul de apartamente pe etaj trebuie sa fie minim 1"),
});

export default function Staircases() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: staircases, isLoading } = useQuery<Staircase[]>({ queryKey: ["/api/staircases"] });
  const { data: buildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      name: "",
      floors: 1,
      apartmentsPerFloor: 2,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/staircases", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      setOpen(false);
      form.reset();
      toast({ title: "Scara adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/staircases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staircases"] });
      toast({ title: "Scara stearsa" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const getBuildingName = (buildingId: string) => {
    const b = buildings?.find(b => b.id === buildingId);
    return b?.name || "-";
  };

  const filtered = staircases?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    getBuildingName(s.buildingId).toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-staircases-title">Scari</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gestioneaza scarile din blocuri</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-staircase">
                <Plus className="w-4 h-4 mr-2" />
                Adauga Scara
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Scara Noua</DialogTitle>
                <DialogDescription>Adauga o scara noua la un bloc existent</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <FormField control={form.control} name="buildingId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloc</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-staircase-building">
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
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Scara</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: Scara A" data-testid="input-staircase-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="floors" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nr. Etaje</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-staircase-floors" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="apartmentsPerFloor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ap. / Etaj</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-staircase-apts-per-floor" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-staircase">
                    {createMutation.isPending ? "Se salveaza..." : "Salveaza Scara"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cauta dupa nume sau bloc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-staircases"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-3 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <ArrowUpDown className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Nicio scara gasita</p>
              <p className="text-sm text-muted-foreground mt-0.5">Adauga prima scara pentru a incepe</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((staircase) => (
              <Card key={staircase.id} className="hover-elevate" data-testid={`card-staircase-${staircase.id}`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0">
                        <ArrowUpDown className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold" data-testid={`text-staircase-name-${staircase.id}`}>{staircase.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{getBuildingName(staircase.buildingId)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(staircase.id)}
                      data-testid={`button-delete-staircase-${staircase.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      {staircase.floors} etaje
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {staircase.apartmentsPerFloor} ap./etaj
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ~{(staircase.floors || 0) * (staircase.apartmentsPerFloor || 0)} apartamente
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <DocumentManager entityType="staircase" entityId={staircase.id} title="Scheme / Planuri Scara" compact />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
