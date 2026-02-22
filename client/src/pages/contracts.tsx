import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2, ChevronDown, ChevronRight, Upload, Calendar, Clock, ExternalLink } from "lucide-react";
import type { Contract, Federation, Association, ContractStatus, ContractTemplate } from "@shared/schema";
import { CONTRACT_STATUS_LABELS, CONTRACT_CLIENT_TYPE_LABELS } from "@shared/schema";

interface UnitOfMeasure {
  id: number;
  categorie: string;
  singular: string;
  plural: string;
  simbol: string;
}

interface Currency {
  id: number;
  tipMoneda: string;
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  active: "default",
  expired: "outline",
  terminated: "destructive",
};

const contractFormSchema = z.object({
  name: z.string().min(1, "Numele este obligatoriu"),
  description: z.string().optional(),
  clientType: z.string().min(1, "Tipul clientului este obligatoriu"),
  clientId: z.string().min(1, "Clientul este obligatoriu"),
  startDate: z.string().min(1, "Data inceput este obligatorie"),
  durationValue: z.coerce.number().min(1, "Durata este obligatorie"),
  durationUnit: z.string().min(1, "Unitatea de masura este obligatorie"),
  endDate: z.string().min(1, "Data sfarsit este obligatorie"),
  amount: z.string().min(1, "Importul este obligatoriu"),
  currency: z.string().min(1, "Divisa este obligatorie"),
  templateId: z.string().optional(),
  status: z.string().min(1, "Statusul este obligatoriu"),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

function calculateEndDate(startDate: string, durationValue: number, durationUnit: string): string {
  if (!startDate || !durationValue || !durationUnit) return "";
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return "";

  const unitLower = durationUnit.toLowerCase();
  if (unitLower.includes("an") || unitLower.includes("year")) {
    start.setFullYear(start.getFullYear() + durationValue);
  } else if (unitLower.includes("lun") || unitLower.includes("month")) {
    start.setMonth(start.getMonth() + durationValue);
  } else if (unitLower.includes("sapt") || unitLower.includes("week")) {
    start.setDate(start.getDate() + durationValue * 7);
  } else if (unitLower.includes("zi") || unitLower.includes("day")) {
    start.setDate(start.getDate() + durationValue);
  } else if (unitLower.includes("or") || unitLower.includes("hour")) {
    start.setHours(start.getHours() + durationValue);
  } else {
    start.setMonth(start.getMonth() + durationValue);
  }

  return start.toISOString().split("T")[0];
}

export default function ContractsPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  const { data: federations } = useQuery<Federation[]>({
    queryKey: ["/api/federations"],
  });

  const { data: associations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const { data: currencies } = useQuery<Currency[]>({
    queryKey: ["/api/liste", "tip-moneda"],
  });

  const { data: unitsOfMeasure } = useQuery<UnitOfMeasure[]>({
    queryKey: ["/api/liste", "unitate-masura"],
  });

  const { data: templates } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contract-templates"],
  });

  const timeUnits = unitsOfMeasure?.filter(
    (u) => u.categorie?.toLowerCase().includes("timp") || u.categorie?.toLowerCase().includes("time")
  ) || [];

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: "",
      description: "",
      clientType: "",
      clientId: "",
      startDate: "",
      durationValue: 1,
      durationUnit: "",
      endDate: "",
      amount: "",
      currency: "LEI",
      templateId: "",
      status: "active",
    },
  });

  const watchClientType = form.watch("clientType");
  const watchStartDate = form.watch("startDate");
  const watchDurationValue = form.watch("durationValue");
  const watchDurationUnit = form.watch("durationUnit");

  useEffect(() => {
    if (watchStartDate && watchDurationValue && watchDurationUnit) {
      const endDate = calculateEndDate(watchStartDate, watchDurationValue, watchDurationUnit);
      if (endDate) {
        form.setValue("endDate", endDate);
      }
    }
  }, [watchStartDate, watchDurationValue, watchDurationUnit, form]);

  useEffect(() => {
    form.setValue("clientId", "");
  }, [watchClientType, form]);

  const clientOptions = watchClientType === "federation" ? federations : watchClientType === "association" ? associations : [];

  const createContract = useMutation({
    mutationFn: async (data: ContractFormValues) => {
      const body = {
        name: data.name,
        description: data.description || null,
        clientType: data.clientType,
        clientId: data.clientId,
        startDate: data.startDate,
        durationValue: data.durationValue,
        durationUnit: data.durationUnit,
        endDate: data.endDate,
        amount: data.amount,
        currency: data.currency,
        templateId: data.templateId || null,
        status: data.status,
      };
      const res = await apiRequest("POST", "/api/contracts", body);
      return res.json();
    },
    onSuccess: (newContract: Contract) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Contract creat cu succes" });
      form.reset();
      setDialogOpen(false);
      setUploadingId(newContract.id);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const deleteContract = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contracts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Contract sters cu succes" });
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/contracts/${id}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Document incarcat cu succes" });
      setUploadingId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare la incarcare", description: error.message, variant: "destructive" });
    },
  });

  const handleFileUpload = (contractId: string) => {
    setUploadingId(contractId);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingId) {
      uploadDocument.mutate({ id: uploadingId, file });
    }
    e.target.value = "";
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getClientName = (contract: Contract) => {
    if (contract.clientType === "federation") {
      return federations?.find((f) => f.id === contract.clientId)?.name || "Federatie necunoscuta";
    }
    if (contract.clientType === "association") {
      return associations?.find((a) => a.id === contract.clientId)?.name || "Asociatie necunoscuta";
    }
    return "Necunoscut";
  };

  return (
    <div className="flex flex-col h-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
        data-testid="input-file-upload"
      />
      <div className="p-3 pb-0 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-contracts-title">Contracte</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gestionarea contractelor cu federatiile si asociatiile</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-contract">
                <Plus className="w-4 h-4 mr-2" />
                Adauga Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adauga Contract</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createContract.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Numele contractului" data-testid="input-contract-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Descriere (optional)" data-testid="input-contract-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip Client</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-client-type">
                                <SelectValue placeholder="Selectati tipul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="federation">Federatie</SelectItem>
                              <SelectItem value="association">Asociatie</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!watchClientType}>
                            <FormControl>
                              <SelectTrigger data-testid="select-client">
                                <SelectValue placeholder={watchClientType ? "Selectati clientul" : "Selectati tipul intai"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientOptions?.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Inceput</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={field.onChange} placeholder="Selectati data" data-testid="datepicker-start-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="durationValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durata</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-duration-value" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unitate</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-duration-unit">
                                <SelectValue placeholder="Unitate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeUnits.map((u) => (
                                <SelectItem key={u.id} value={u.singular}>{u.singular}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Sfarsit</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={field.onChange} placeholder="Selectati data" data-testid="datepicker-end-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Import</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min={0} {...field} placeholder="0.00" data-testid="input-amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Divisa</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-currency">
                                <SelectValue placeholder="Moneda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies?.map((c) => (
                                <SelectItem key={c.id} value={c.tipMoneda}>{c.tipMoneda}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sablon</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-template">
                              <SelectValue placeholder="Selectati sablon (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates?.map((t) => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-status">
                              <SelectValue placeholder="Selectati status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Ciorna</SelectItem>
                            <SelectItem value="active">Activ</SelectItem>
                            <SelectItem value="expired">Expirat</SelectItem>
                            <SelectItem value="terminated">Reziliat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Anuleaza</Button>
                    </DialogClose>
                    <Button type="submit" disabled={createContract.isPending} data-testid="button-submit-contract">
                      {createContract.isPending ? "Se salveaza..." : "Salveaza"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-3">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-72" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !contracts || contracts.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-contracts">Nu exista contracte inregistrate</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Folositi butonul "Adauga Contract" pentru a crea unul</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {contracts.map((contract) => {
                const isExpanded = expandedIds.has(contract.id);
                const clientName = getClientName(contract);
                const statusLabel = CONTRACT_STATUS_LABELS[contract.status as ContractStatus] || contract.status;
                const clientTypeLabel = CONTRACT_CLIENT_TYPE_LABELS[contract.clientType as keyof typeof CONTRACT_CLIENT_TYPE_LABELS] || contract.clientType;

                return (
                  <Card key={contract.id} data-testid={`card-contract-${contract.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          className="flex items-start gap-2 flex-1 min-w-0 text-left"
                          onClick={() => toggleExpand(contract.id)}
                          data-testid={`button-expand-contract-${contract.id}`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate" data-testid={`text-contract-name-${contract.id}`}>
                              {contract.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {clientTypeLabel}: {clientName}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <Badge variant={STATUS_VARIANTS[contract.status] || "secondary"} data-testid={`badge-status-${contract.id}`}>
                            {statusLabel}
                          </Badge>
                          <span className="text-sm font-medium" data-testid={`text-amount-${contract.id}`}>
                            {contract.amount} {contract.currency}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {contract.startDate} - {contract.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {contract.durationValue} {contract.durationUnit}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          {contract.description && (
                            <p className="text-sm text-muted-foreground" data-testid={`text-description-${contract.id}`}>
                              {contract.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 flex-wrap">
                            {contract.documentName ? (
                              <span className="flex items-center gap-1 text-sm">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span data-testid={`text-document-${contract.id}`}>{contract.documentName}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Niciun document atasat</span>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload(contract.id)}
                              disabled={uploadDocument.isPending}
                              data-testid={`button-upload-${contract.id}`}
                            >
                              <Upload className="w-3.5 h-3.5 mr-1" />
                              {uploadDocument.isPending && uploadingId === contract.id ? "Se incarca..." : "Incarca Document"}
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  data-testid={`button-delete-contract-${contract.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1 text-destructive" />
                                  Sterge
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmati stergerea</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sunteti sigur ca doriti sa stergeti contractul "{contract.name}"? Aceasta actiune nu poate fi anulata.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Anuleaza</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteContract.mutate(contract.id)}
                                    data-testid={`button-confirm-delete-${contract.id}`}
                                  >
                                    Sterge
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
    </div>
  );
}
