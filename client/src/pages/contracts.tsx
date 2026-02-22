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
import { FileText, Plus, Trash2, ChevronDown, ChevronRight, Upload, Calendar, Clock, ExternalLink, Building2, Hash, Pencil } from "lucide-react";
import type { Contract, Association, ContractStatus, Apartment, Building, Staircase } from "@shared/schema";
import { CONTRACT_STATUS_LABELS } from "@shared/schema";

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
  clientId: z.string().min(1, "Asociatia este obligatorie"),
  prestatorName: z.string().optional(),
  prestatorCui: z.string().optional(),
  prestatorAddress: z.string().optional(),
  prestatorRegistruComert: z.string().optional(),
  prestatorRepresentative: z.string().optional(),
  signingDate: z.string().optional(),
  startDate: z.string().min(1, "Data inceput este obligatorie"),
  durationValue: z.coerce.number().min(1, "Cantitatea este obligatorie"),
  durationUnit: z.string().min(1, "Unitatea de masura este obligatorie"),
  endDate: z.string().min(1, "Data sfarsit este obligatorie"),
  autoRenewalNoticeDays: z.coerce.number().optional(),
  pricePerUnit: z.string().min(1, "Pretul per imobil este obligatoriu"),
  currency: z.string().min(1, "Divisa este obligatorie"),
  invoiceDay: z.coerce.number().optional(),
  paymentTermDays: z.coerce.number().optional(),
  jurisdiction: z.string().optional(),
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
    start.setTime(start.getTime() + durationValue * 3600000);
  } else if (unitLower.includes("minut")) {
    start.setTime(start.getTime() + durationValue * 60000);
  } else if (unitLower.includes("secund")) {
    start.setTime(start.getTime() + durationValue * 1000);
  } else {
    start.setMonth(start.getMonth() + durationValue);
  }

  return start.toISOString().split("T")[0];
}

function ContractFormDialog({
  open,
  onOpenChange,
  editContract,
  associations,
  buildings,
  staircases,
  apartments,
  currencies,
  timeUnits,
  nextNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editContract?: Contract | null;
  associations?: Association[];
  buildings?: Building[];
  staircases?: Staircase[];
  apartments?: Apartment[];
  currencies?: Currency[];
  timeUnits: UnitOfMeasure[];
  nextNumber?: { serie: string; numar: string };
}) {
  const { toast } = useToast();
  const isEditing = !!editContract;

  const getAssocUnitCount = (associationId: string): number => {
    if (!buildings || !staircases || !apartments) return 0;
    const assocBuildings = buildings.filter(b => b.associationId === associationId);
    const buildingIds = new Set(assocBuildings.map(b => b.id));
    const assocStaircases = staircases.filter(s => buildingIds.has(s.buildingId));
    const staircaseIds = new Set(assocStaircases.map(s => s.id));
    return apartments.filter(a => staircaseIds.has(a.staircaseId)).length;
  };

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: editContract?.name || "",
      description: editContract?.description || "",
      clientId: editContract?.clientId || "",
      prestatorName: editContract?.prestatorName || "",
      prestatorCui: editContract?.prestatorCui || "",
      prestatorAddress: editContract?.prestatorAddress || "",
      prestatorRegistruComert: editContract?.prestatorRegistruComert || "",
      prestatorRepresentative: editContract?.prestatorRepresentative || "",
      signingDate: editContract?.signingDate || "",
      startDate: editContract?.startDate || "",
      durationValue: editContract?.durationValue || 1,
      durationUnit: editContract?.durationUnit || "",
      endDate: editContract?.endDate || "",
      autoRenewalNoticeDays: editContract?.autoRenewalNoticeDays || undefined,
      pricePerUnit: editContract?.pricePerUnit || "",
      currency: editContract?.currency || "RON",
      invoiceDay: editContract?.invoiceDay || undefined,
      paymentTermDays: editContract?.paymentTermDays || undefined,
      jurisdiction: editContract?.jurisdiction || "",
      status: editContract?.status || "active",
    },
  });

  useEffect(() => {
    if (editContract) {
      form.reset({
        name: editContract.name || "",
        description: editContract.description || "",
        clientId: editContract.clientId || "",
        prestatorName: editContract.prestatorName || "",
        prestatorCui: editContract.prestatorCui || "",
        prestatorAddress: editContract.prestatorAddress || "",
        prestatorRegistruComert: editContract.prestatorRegistruComert || "",
        prestatorRepresentative: editContract.prestatorRepresentative || "",
        signingDate: editContract.signingDate || "",
        startDate: editContract.startDate || "",
        durationValue: editContract.durationValue || 1,
        durationUnit: editContract.durationUnit || "",
        endDate: editContract.endDate || "",
        autoRenewalNoticeDays: editContract.autoRenewalNoticeDays || undefined,
        pricePerUnit: editContract.pricePerUnit || "",
        currency: editContract.currency || "RON",
        invoiceDay: editContract.invoiceDay || undefined,
        paymentTermDays: editContract.paymentTermDays || undefined,
        jurisdiction: editContract.jurisdiction || "",
        status: editContract.status || "active",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        clientId: "",
        prestatorName: "",
        prestatorCui: "",
        prestatorAddress: "",
        prestatorRegistruComert: "",
        prestatorRepresentative: "",
        signingDate: "",
        startDate: "",
        durationValue: 1,
        durationUnit: "",
        endDate: "",
        autoRenewalNoticeDays: undefined,
        pricePerUnit: "",
        currency: "RON",
        invoiceDay: undefined,
        paymentTermDays: undefined,
        jurisdiction: "",
        status: "active",
      });
    }
  }, [editContract, form]);

  const watchClientId = form.watch("clientId");
  const watchStartDate = form.watch("startDate");
  const watchDurationValue = form.watch("durationValue");
  const watchDurationUnit = form.watch("durationUnit");
  const watchPricePerUnit = form.watch("pricePerUnit");

  const selectedUnitCount = watchClientId ? getAssocUnitCount(watchClientId) : 0;

  const totalMonthly = watchPricePerUnit && selectedUnitCount > 0
    ? (parseFloat(watchPricePerUnit) * selectedUnitCount).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (watchStartDate && watchDurationValue && watchDurationUnit) {
      const endDate = calculateEndDate(watchStartDate, watchDurationValue, watchDurationUnit);
      if (endDate) {
        form.setValue("endDate", endDate);
      }
    }
  }, [watchStartDate, watchDurationValue, watchDurationUnit, form]);

  useEffect(() => {
    if (watchClientId && !isEditing) {
      const assoc = associations?.find(a => a.id === watchClientId);
      if (assoc) {
        form.setValue("name", `Contract Administrare - ${assoc.name}`);
      }
    }
  }, [watchClientId, associations, form, isEditing]);

  const saveMutation = useMutation({
    mutationFn: async (data: ContractFormValues) => {
      const unitCount = getAssocUnitCount(data.clientId);
      const total = (parseFloat(data.pricePerUnit) * unitCount).toFixed(2);
      const body = {
        name: data.name,
        description: data.description || null,
        clientType: "association",
        clientId: data.clientId,
        prestatorName: data.prestatorName || null,
        prestatorCui: data.prestatorCui || null,
        prestatorAddress: data.prestatorAddress || null,
        prestatorRegistruComert: data.prestatorRegistruComert || null,
        prestatorRepresentative: data.prestatorRepresentative || null,
        signingDate: data.signingDate || null,
        startDate: data.startDate,
        durationValue: data.durationValue,
        durationUnit: data.durationUnit,
        endDate: data.endDate,
        autoRenewalNoticeDays: data.autoRenewalNoticeDays || null,
        numberOfUnits: unitCount,
        pricePerUnit: data.pricePerUnit,
        totalMonthly: total,
        amount: total,
        currency: data.currency,
        invoiceDay: data.invoiceDay || null,
        paymentTermDays: data.paymentTermDays || null,
        jurisdiction: data.jurisdiction || null,
        status: data.status,
      };

      if (isEditing && editContract) {
        const res = await apiRequest("PATCH", `/api/contracts/${editContract.id}`, body);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/contracts", body);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts/next-number"] });
      toast({ title: isEditing ? "Contract actualizat cu succes" : "Contract creat cu succes" });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editeaza Contract" : "Contract de Administrare Condominiu"}</DialogTitle>
          {isEditing && editContract ? (
            <p className="text-sm text-muted-foreground">
              Serie: <span className="font-mono font-semibold">{editContract.serie}</span> Nr: <span className="font-mono font-semibold">{editContract.numar}</span>
            </p>
          ) : nextNumber ? (
            <p className="text-sm text-muted-foreground">
              Serie: <span className="font-mono font-semibold">{nextNumber.serie}</span> Nr: <span className="font-mono font-semibold">{nextNumber.numar}</span>
            </p>
          ) : null}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">I. Prestator (Administrator)</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="prestatorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denumire Prestator</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Numele firmei de administrare" data-testid="input-prestator-name" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prestatorCui"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CUI</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CUI prestator" data-testid="input-prestator-cui" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="prestatorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sediu</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Adresa sediului prestator" data-testid="input-prestator-address" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="prestatorRegistruComert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nr. Registru Comertului</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="J40/XXXX/YYYY" data-testid="input-prestator-registru" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prestatorRepresentative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reprezentant</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Numele reprezentantului" data-testid="input-prestator-representative" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">II. Beneficiar (Asociatie)</h3>
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asociatie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-association">
                          <SelectValue placeholder="Selectati asociatia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {associations?.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.name}{a.cui ? ` (${a.cui})` : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchClientId && (() => {
                const assoc = associations?.find(a => a.id === watchClientId);
                if (!assoc) return null;
                return (
                  <div className="bg-muted/50 rounded-md p-2 text-xs space-y-1">
                    {assoc.address && <p><span className="text-muted-foreground">Sediu:</span> {assoc.address}</p>}
                    {assoc.cui && <p><span className="text-muted-foreground">CIF:</span> {assoc.cui}</p>}
                    {assoc.presidentName && <p><span className="text-muted-foreground">Presedinte:</span> {assoc.presidentName}</p>}
                    <p><span className="text-muted-foreground">Nr. Imobile:</span> <span className="font-semibold">{selectedUnitCount}</span></p>
                  </div>
                );
              })()}
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">III. Detalii Contract</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Denumire Contract</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contract de Administrare" data-testid="input-contract-name" />
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
                    <FormLabel>Obiectul Contractului</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descrierea serviciilor de administrare..." data-testid="input-contract-description" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">IV. Onorariu si Plata</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pret / Imobil / Luna</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min={0} {...field} placeholder="0.00" data-testid="input-price-per-unit" />
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
                <div>
                  <label className="text-sm font-medium">Total Lunar</label>
                  <div className="mt-2 h-9 flex items-center px-3 border rounded-md bg-muted/50 font-mono font-semibold text-sm" data-testid="text-total-monthly">
                    {totalMonthly} {form.watch("currency")}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{selectedUnitCount} imobile × {watchPricePerUnit || "0"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="invoiceDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zi Emitere Factura</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={31} {...field} value={field.value ?? ""} placeholder="Ex: 1" data-testid="input-invoice-day" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTermDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termen Plata (zile)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} value={field.value ?? ""} placeholder="Ex: 15" data-testid="input-payment-term" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">V. Durata si Date</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="signingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Semnare</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value || ""} onChange={field.onChange} placeholder="Data semnarii" data-testid="datepicker-signing-date" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inceput</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} placeholder="Data inceperii" data-testid="datepicker-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantitate</FormLabel>
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
                      <FormLabel>Unitate Masura</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-duration-unit">
                            <SelectValue placeholder="Selectati" />
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
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Sfarsit (calculata)</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} placeholder="Se calculeaza automat" data-testid="datepicker-end-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="autoRenewalNoticeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preaviz Reziliere (zile)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} value={field.value ?? ""} placeholder="Ex: 30" data-testid="input-renewal-notice" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="text-sm font-semibold text-primary">VI. Dispozitii Finale</h3>
              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdictie</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Bucuresti" data-testid="input-jurisdiction" />
                    </FormControl>
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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Anuleaza</Button>
              </DialogClose>
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-submit-contract">
                {saveMutation.isPending ? "Se salveaza..." : isEditing ? "Actualizeaza" : "Salveaza"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ContractsPage() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  const { data: associations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const { data: staircases } = useQuery<Staircase[]>({
    queryKey: ["/api/staircases"],
  });

  const { data: apartments } = useQuery<Apartment[]>({
    queryKey: ["/api/apartments"],
  });

  const { data: currencies } = useQuery<Currency[]>({
    queryKey: ["/api/liste", "tip-moneda"],
  });

  const { data: unitsOfMeasure } = useQuery<UnitOfMeasure[]>({
    queryKey: ["/api/liste", "unitate-masura"],
  });

  const { data: nextNumber } = useQuery<{ serie: string; numar: string }>({
    queryKey: ["/api/contracts/next-number"],
  });

  const timeUnits = unitsOfMeasure?.filter(
    (u) => u.categorie?.toLowerCase().includes("timp") || u.categorie?.toLowerCase().includes("time")
  ) || [];

  const deleteContract = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contracts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts/next-number"] });
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
    return associations?.find((a) => a.id === contract.clientId)?.name || "Asociatie necunoscuta";
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("ro-RO"); } catch { return d; }
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setEditDialogOpen(true);
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
            <p className="text-muted-foreground text-sm mt-0.5">Gestionarea contractelor de administrare cu asociatiile</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-add-contract">
            <Plus className="w-4 h-4 mr-2" />
            Adauga Contract
          </Button>
        </div>
      </div>

      <ContractFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        associations={associations}
        buildings={buildings}
        staircases={staircases}
        apartments={apartments}
        currencies={currencies}
        timeUnits={timeUnits}
        nextNumber={nextNumber}
      />

      <ContractFormDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingContract(null);
        }}
        editContract={editingContract}
        associations={associations}
        buildings={buildings}
        staircases={staircases}
        apartments={apartments}
        currencies={currencies}
        timeUnits={timeUnits}
      />

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
                            <div className="flex items-center gap-2">
                              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-mono text-xs text-muted-foreground">{contract.serie}-{contract.numar}</span>
                              <p className="text-sm font-semibold truncate" data-testid={`text-contract-name-${contract.id}`}>
                                {contract.name}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              <Building2 className="w-3 h-3 inline mr-1" />
                              {clientName}
                              {contract.numberOfUnits && <span className="ml-2">({contract.numberOfUnits} imobile)</span>}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <Badge variant={STATUS_VARIANTS[contract.status] || "secondary"} data-testid={`badge-status-${contract.id}`}>
                            {statusLabel}
                          </Badge>
                          {contract.totalMonthly && (
                            <span className="text-sm font-medium" data-testid={`text-total-${contract.id}`}>
                              {contract.totalMonthly} {contract.currency}/luna
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {contract.durationValue} {contract.durationUnit}
                        </span>
                        {contract.pricePerUnit && (
                          <span>{contract.pricePerUnit} {contract.currency}/imobil</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {contract.prestatorName && (
                              <div>
                                <span className="text-muted-foreground">Prestator:</span>
                                <p className="font-medium">{contract.prestatorName}</p>
                                {contract.prestatorCui && <p className="text-muted-foreground">CUI: {contract.prestatorCui}</p>}
                                {contract.prestatorAddress && <p className="text-muted-foreground">Sediu: {contract.prestatorAddress}</p>}
                                {contract.prestatorRegistruComert && <p className="text-muted-foreground">Reg. Com.: {contract.prestatorRegistruComert}</p>}
                                {contract.prestatorRepresentative && <p className="text-muted-foreground">Repr.: {contract.prestatorRepresentative}</p>}
                              </div>
                            )}
                            <div>
                              {contract.signingDate && <p><span className="text-muted-foreground">Data Semnare:</span> {formatDate(contract.signingDate)}</p>}
                              {contract.invoiceDay && <p><span className="text-muted-foreground">Zi Factura:</span> {contract.invoiceDay}</p>}
                              {contract.paymentTermDays && <p><span className="text-muted-foreground">Termen Plata:</span> {contract.paymentTermDays} zile</p>}
                              {contract.autoRenewalNoticeDays && <p><span className="text-muted-foreground">Preaviz:</span> {contract.autoRenewalNoticeDays} zile</p>}
                              {contract.jurisdiction && <p><span className="text-muted-foreground">Jurisdictie:</span> {contract.jurisdiction}</p>}
                            </div>
                          </div>

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
                              onClick={() => handleEditContract(contract)}
                              data-testid={`button-edit-contract-${contract.id}`}
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" />
                              Editeaza
                            </Button>

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
                                    Sunteti sigur ca doriti sa stergeti contractul "{contract.serie}-{contract.numar} {contract.name}"? Aceasta actiune nu poate fi anulata.
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
