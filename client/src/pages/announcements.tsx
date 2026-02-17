import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnnouncementSchema } from "@shared/schema";
import type { Announcement, Building } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Megaphone, AlertCircle, Info, Trash2, Calendar } from "lucide-react";
import { z } from "zod";

const formSchema = insertAnnouncementSchema.extend({
  title: z.string().min(1, "Titlul este obligatoriu"),
  content: z.string().min(1, "Continutul este obligatoriu"),
});

export default function Announcements() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: announcements, isLoading } = useQuery<Announcement[]>({ queryKey: ["/api/announcements"] });
  const { data: buildings } = useQuery<Building[]>({ queryKey: ["/api/buildings"] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      title: "",
      content: "",
      priority: "normal",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/announcements", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setOpen(false);
      form.reset();
      toast({ title: "Anunt publicat cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({ title: "Anunt sters" });
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-announcements-title">Anunturi</h1>
          <p className="text-muted-foreground text-sm mt-1">Comunica informatii importante proprietarilor</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-announcement">
              <Plus className="w-4 h-4 mr-2" />
              Anunt Nou
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Anunt Nou</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <FormField control={form.control} name="buildingId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloc</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-announcement-building">
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
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titlu</FormLabel>
                    <FormControl><Input {...field} placeholder="ex: Sedinta asociatie" data-testid="input-announcement-title" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Continut</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Detalii anunt..." data-testid="input-announcement-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioritate</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "normal"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-announcement-priority">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-announcement">
                  {createMutation.isPending ? "Se publica..." : "Publica Anunt"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (!announcements || announcements.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Niciun anunt momentan</p>
            <p className="text-sm text-muted-foreground mt-1">Publica primul anunt pentru a incepe</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} data-testid={`card-announcement-detail-${ann.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {ann.priority === "urgent" ? (
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-destructive/10">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        </div>
                      ) : ann.priority === "important" ? (
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500/10 dark:bg-amber-400/10">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{ann.title}</h3>
                        {ann.priority === "urgent" && (
                          <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                        )}
                        {ann.priority === "important" && (
                          <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-[10px]">Important</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ann.content}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(ann.id)}
                    data-testid={`button-delete-announcement-${ann.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
