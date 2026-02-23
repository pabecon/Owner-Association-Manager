import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFederationSchema } from "@shared/schema";
import type { Federation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Network, Search, Trash2, Calendar } from "lucide-react";
import { z } from "zod";

const formSchema = insertFederationSchema.extend({
  name: z.string().min(1, "Numele este obligatoriu"),
});

export default function Federations() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: federations, isLoading } = useQuery<Federation[]>({ queryKey: ["/api/federations"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/federations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/federations"] });
      setOpen(false);
      form.reset();
      toast({ title: "Federatie adaugata cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/federations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/federations"] });
      toast({ title: "Federatie stearsa" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const filtered = federations?.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description?.toLowerCase().includes(search.toLowerCase()) ||
    false
  ) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 space-y-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight" data-testid="text-federations-title">Federatii</h1>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{filtered.length} federatii</span>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-6 px-2 text-[10px]" data-testid="button-add-federation">
                <Plus className="w-3 h-3 mr-0.5" />
                Adauga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Federatie Noua</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Federatie</FormLabel>
                      <FormControl><Input {...field} placeholder="ex: Federatia Blocurilor Sector 3" data-testid="input-federation-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descriere</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} rows={3} placeholder="Descriere optionala..." data-testid="input-federation-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-federation">
                    {createMutation.isPending ? "Se salveaza..." : "Salveaza Federatie"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cauta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs"
            data-testid="input-search-federations"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        {isLoading ? (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-2 p-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Network className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Nicio federatie gasita</p>
              <p className="text-sm text-muted-foreground mt-0.5">Adauga prima federatie pentru a incepe</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="sticky-table-container overflow-auto max-h-[calc(100vh-120px)]">
                <Table className="compact-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nume</TableHead>
                      <TableHead>Descriere</TableHead>
                      <TableHead>Creat</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((fed) => (
                      <TableRow key={fed.id} data-testid={`row-federation-${fed.id}`}>
                        <TableCell className="font-medium">{fed.name}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[250px] truncate" title={fed.description || undefined}>{fed.description || "-"}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {fed.createdAt ? new Date(fed.createdAt).toLocaleDateString("ro-RO") : "-"}
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => deleteMutation.mutate(fed.id)} data-testid={`button-delete-federation-${fed.id}`}>
                            <Trash2 className="w-3 h-3 text-muted-foreground" />
                          </Button>
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
