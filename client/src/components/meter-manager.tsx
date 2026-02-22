import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Meter, MeterReading, MeterType } from "@shared/schema";
import { METER_TYPE_LABELS, meterTypeEnum } from "@shared/schema";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Gauge, Plus, Trash2, ChevronDown, ChevronRight, CalendarIcon,
  Droplets, Zap, Flame, History, AlertCircle
} from "lucide-react";

const METER_TYPE_ICONS: Record<string, any> = {
  water: Droplets,
  electricity: Zap,
  gas: Flame,
};

const METER_TYPE_COLORS: Record<string, string> = {
  water: "text-blue-500",
  electricity: "text-yellow-500",
  gas: "text-orange-500",
};

const METER_TYPE_BG: Record<string, string> = {
  water: "bg-blue-50 dark:bg-blue-950",
  electricity: "bg-yellow-50 dark:bg-yellow-950",
  gas: "bg-orange-50 dark:bg-orange-950",
};

interface MeterManagerProps {
  apartmentId: string;
  compact?: boolean;
}

export function MeterManager({ apartmentId, compact = false }: MeterManagerProps) {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [readingDialogOpen, setReadingDialogOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [expandedMeters, setExpandedMeters] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: metersList = [], isLoading } = useQuery<Meter[]>({
    queryKey: ["/api/meters", apartmentId],
    queryFn: () => fetch(`/api/meters/${apartmentId}`).then(r => r.json()),
  });

  const activeMeters = metersList.filter(m => m.isActive);
  const inactiveMeters = metersList.filter(m => !m.isActive);

  const waterCount = activeMeters.filter(m => m.meterType === "water").length;
  const elecCount = activeMeters.filter(m => m.meterType === "electricity").length;
  const gasCount = activeMeters.filter(m => m.meterType === "gas").length;

  const summary = [
    waterCount > 0 ? `${waterCount} apă` : null,
    elecCount > 0 ? `${elecCount} elec.` : null,
    gasCount > 0 ? `${gasCount} gaz` : null,
  ].filter(Boolean).join(", ");

  if (compact) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer group" data-testid={`meter-toggle-${apartmentId}`}>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Contoare</span>
              {activeMeters.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0" data-testid={`meter-count-${apartmentId}`}>
                  {activeMeters.length}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {summary && <span className="text-[10px] text-muted-foreground">{summary}</span>}
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-2">
            {activeMeters.length === 0 && !isLoading && (
              <p className="text-[11px] text-muted-foreground">Niciun contor inregistrat</p>
            )}
            {activeMeters.map(meter => (
              <MeterCard
                key={meter.id}
                meter={meter}
                expanded={expandedMeters[meter.id] || false}
                onToggle={() => setExpandedMeters(prev => ({ ...prev, [meter.id]: !prev[meter.id] }))}
                onAddReading={() => { setSelectedMeter(meter); setReadingDialogOpen(true); }}
                onDeactivate={() => handleDeactivate(meter.id)}
              />
            ))}
            {inactiveMeters.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">
                  {inactiveMeters.length} contor(e) inactiv(e)
                </summary>
                <div className="mt-1 space-y-1">
                  {inactiveMeters.map(meter => (
                    <MeterCard
                      key={meter.id}
                      meter={meter}
                      expanded={expandedMeters[meter.id] || false}
                      onToggle={() => setExpandedMeters(prev => ({ ...prev, [meter.id]: !prev[meter.id] }))}
                      inactive
                    />
                  ))}
                </div>
              </details>
            )}
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-xs"
              onClick={() => setAddDialogOpen(true)}
              data-testid={`meter-add-btn-${apartmentId}`}
            >
              <Plus className="w-3 h-3 mr-1" />Adauga contor
            </Button>
          </div>
        </CollapsibleContent>

        <AddMeterDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          apartmentId={apartmentId}
        />

        {selectedMeter && (
          <AddReadingDialog
            open={readingDialogOpen}
            onOpenChange={setReadingDialogOpen}
            meter={selectedMeter}
          />
        )}
      </Collapsible>
    );
  }

  return null;

  function handleDeactivate(meterId: string) {
    apiRequest("PATCH", `/api/meters/${meterId}`, { isActive: false })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/meters", apartmentId] });
        toast({ title: "Contor dezactivat" });
      })
      .catch(() => {
        toast({ title: "Eroare", variant: "destructive" });
      });
  }
}

function MeterCard({
  meter,
  expanded,
  onToggle,
  onAddReading,
  onDeactivate,
  inactive,
}: {
  meter: Meter;
  expanded: boolean;
  onToggle: () => void;
  onAddReading?: () => void;
  onDeactivate?: () => void;
  inactive?: boolean;
}) {
  const MIcon = METER_TYPE_ICONS[meter.meterType] || Gauge;
  const colorClass = METER_TYPE_COLORS[meter.meterType] || "text-muted-foreground";
  const bgClass = METER_TYPE_BG[meter.meterType] || "bg-muted";
  const typeLabel = METER_TYPE_LABELS[meter.meterType as MeterType] || meter.meterType;

  const { data: readings = [] } = useQuery<MeterReading[]>({
    queryKey: ["/api/meter-readings", meter.id],
    queryFn: () => fetch(`/api/meter-readings/${meter.id}`).then(r => r.json()),
    enabled: expanded,
  });

  const latestReading = readings.length > 0 ? readings[0] : null;

  return (
    <div className={`border rounded-md text-xs ${inactive ? "opacity-60" : ""}`} data-testid={`meter-card-${meter.id}`}>
      <div
        className={`flex items-center gap-2 p-2 cursor-pointer ${bgClass} rounded-t-md`}
        onClick={onToggle}
        data-testid={`meter-header-${meter.id}`}
      >
        <MIcon className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{typeLabel}</span>
            <span className="text-muted-foreground">#{meter.meterNumber}</span>
            {inactive && <Badge variant="outline" className="text-[9px] px-1 py-0">Inactiv</Badge>}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Serie: {meter.serialNumber}
            {meter.chamberLocation && ` | Camera: ${meter.chamberLocation}`}
          </div>
        </div>
        {latestReading && (
          <div className="text-right shrink-0">
            <div className="font-mono font-medium">{Number(latestReading.readingValue).toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">{latestReading.readingDate}</div>
          </div>
        )}
        {expanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
      </div>

      {expanded && (
        <div className="p-2 space-y-2">
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <div><span className="text-muted-foreground">Data instalarii:</span> {meter.installDate}</div>
            <div><span className="text-muted-foreground">Citire initiala:</span> {Number(meter.initialReading).toFixed(1)}</div>
            {meter.chamberLocation && <div className="col-span-2"><span className="text-muted-foreground">Camera:</span> {meter.chamberLocation}</div>}
          </div>

          {readings.length > 0 && (
            <div className="border rounded overflow-hidden">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-1 text-left font-medium">Data</th>
                    <th className="p-1 text-right font-medium">Citire</th>
                    <th className="p-1 text-right font-medium">Consum</th>
                    <th className="p-1 text-right font-medium">Acumulat</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? "" : "bg-muted/20"} data-testid={`reading-row-${r.id}`}>
                      <td className="p-1">{r.readingDate}</td>
                      <td className="p-1 text-right font-mono">{Number(r.readingValue).toFixed(1)}</td>
                      <td className="p-1 text-right font-mono">{r.consumption ? Number(r.consumption).toFixed(1) : "-"}</td>
                      <td className="p-1 text-right font-mono">{r.accumulatedConsumption ? Number(r.accumulatedConsumption).toFixed(1) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {readings.length === 0 && (
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Nicio citire inregistrata
            </div>
          )}

          {!inactive && (
            <div className="flex gap-1">
              {onAddReading && (
                <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1" onClick={onAddReading} data-testid={`meter-add-reading-${meter.id}`}>
                  <Plus className="w-3 h-3 mr-1" />Citire noua
                </Button>
              )}
              {onDeactivate && (
                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive" onClick={onDeactivate} data-testid={`meter-deactivate-${meter.id}`}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddMeterDialog({
  open,
  onOpenChange,
  apartmentId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
}) {
  const { toast } = useToast();
  const [meterType, setMeterType] = useState<string>("water");
  const [serialNumber, setSerialNumber] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [chamberLocation, setChamberLocation] = useState("");
  const [installDate, setInstallDate] = useState(new Date().toISOString().split("T")[0]);
  const [initialReading, setInitialReading] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setMeterType("water");
    setSerialNumber("");
    setMeterNumber("");
    setChamberLocation("");
    setInstallDate(new Date().toISOString().split("T")[0]);
    setInitialReading("0");
  };

  const handleSave = async () => {
    if (!serialNumber.trim() || !meterNumber.trim()) {
      toast({ title: "Completati seria si numarul contorului", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/meters", {
        apartmentId,
        meterType,
        serialNumber: serialNumber.trim(),
        meterNumber: meterNumber.trim(),
        chamberLocation: chamberLocation.trim() || null,
        installDate,
        initialReading: String(Number(initialReading) || 0),
        isActive: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meters", apartmentId] });
      toast({ title: "Contor adaugat cu succes" });
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Eroare la adaugare contor", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Adauga contor</DialogTitle>
          <DialogDescription className="text-xs">Completati datele contorului nou</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Tip contor</Label>
            <Select value={meterType} onValueChange={setMeterType}>
              <SelectTrigger className="h-8 text-xs" data-testid="select-meter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meterTypeEnum.map(t => (
                  <SelectItem key={t} value={t}>{METER_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Serie contor</Label>
              <Input className="h-8 text-xs" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="Ex: ABC123" data-testid="input-meter-serial" />
            </div>
            <div>
              <Label className="text-xs">Numar contor</Label>
              <Input className="h-8 text-xs" value={meterNumber} onChange={e => setMeterNumber(e.target.value)} placeholder="Ex: 00456" data-testid="input-meter-number" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Camera (localizare)</Label>
            <Input className="h-8 text-xs" value={chamberLocation} onChange={e => setChamberLocation(e.target.value)} placeholder="Ex: Subsol, Camera 3" data-testid="input-meter-chamber" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Data instalarii</Label>
              <DatePicker value={installDate} onChange={setInstallDate} placeholder="Data instalare" className="h-8 text-xs" data-testid="datepicker-meter-install-date" />
            </div>
            <div>
              <Label className="text-xs">Citire initiala</Label>
              <Input type="number" step="0.001" className="h-8 text-xs" value={initialReading} onChange={e => setInitialReading(e.target.value)} data-testid="input-meter-initial-reading" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} data-testid="btn-meter-cancel">Anuleaza</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} data-testid="btn-meter-save">
              {isSaving ? "Se salveaza..." : "Salveaza"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddReadingDialog({
  open,
  onOpenChange,
  meter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meter: Meter;
}) {
  const { toast } = useToast();
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split("T")[0]);
  const [readingValue, setReadingValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const typeLabel = METER_TYPE_LABELS[meter.meterType as MeterType] || meter.meterType;

  const handleSave = async () => {
    if (!readingValue || Number(readingValue) < 0) {
      toast({ title: "Introduceti o valoare valida", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/meter-readings", {
        meterId: meter.id,
        readingDate,
        readingValue: String(Number(readingValue)),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meter-readings", meter.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/meters", meter.apartmentId] });
      toast({ title: "Citire inregistrata" });
      setReadingValue("");
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Citire noua - {typeLabel} #{meter.meterNumber}</DialogTitle>
          <DialogDescription className="text-xs">Serie: {meter.serialNumber}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Data citirii</Label>
            <DatePicker value={readingDate} onChange={setReadingDate} placeholder="Data citirii" className="h-8 text-xs" data-testid="datepicker-reading-date" />
          </div>
          <div>
            <Label className="text-xs">Valoare citire</Label>
            <Input type="number" step="0.001" className="h-8 text-xs" value={readingValue} onChange={e => setReadingValue(e.target.value)} placeholder="Ex: 1234.5" data-testid="input-reading-value" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} data-testid="btn-reading-cancel">Anuleaza</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} data-testid="btn-reading-save">
              {isSaving ? "Se salveaza..." : "Salveaza"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
