import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK_STREET_TYPES = [
  "Strada", "Bulevardul", "Aleea", "Calea", "Drumul", "Fundatura",
  "Intrarea", "Pasajul", "Piata", "Soseaua", "Splaiul", "Prelungirea",
];

const BUCHAREST_CITIES = ["bucuresti", "bucharest", "bucurești"];

export function isBucharestCity(city: string) {
  return BUCHAREST_CITIES.includes(city.toLowerCase().trim());
}

export function composeAddress(fields: {
  streetType?: string; streetName?: string; streetNumber?: string;
  city?: string; sector?: string; county?: string; postalCode?: string;
}): string {
  const parts: string[] = [];
  if (fields.streetType && fields.streetName) {
    parts.push(`${fields.streetType} ${fields.streetName}`);
  } else if (fields.streetName) {
    parts.push(fields.streetName);
  }
  if (fields.streetNumber) parts.push(`nr. ${fields.streetNumber}`);
  if (fields.city) parts.push(fields.city);
  if (fields.sector) parts.push(`Sector ${fields.sector}`);
  if (fields.county && !isBucharestCity(fields.city || "")) parts.push(`jud. ${fields.county}`);
  if (fields.postalCode && !isBucharestCity(fields.city || "")) parts.push(`cod ${fields.postalCode}`);
  return parts.join(", ");
}

interface OrasJudetEntry {
  id: string;
  oras: string;
  judet: string;
  comuna: string;
  concatenate?: string;
}

interface AddressFieldValues {
  streetType: string;
  streetName: string;
  streetNumber: string;
  city: string;
  county: string;
  sector: string;
  postalCode: string;
}

interface AddressFieldsProps {
  values: AddressFieldValues;
  onChange: (field: keyof AddressFieldValues, value: string) => void;
  onBatchChange?: (updates: Partial<AddressFieldValues>) => void;
  idPrefix?: string;
}

function CityCombobox({ value, onChange, onSelectCity, idPrefix }: {
  value: string;
  onChange: (v: string) => void;
  onSelectCity: (entry: OrasJudetEntry) => void;
  idPrefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: orasJudetData } = useQuery<OrasJudetEntry[]>({
    queryKey: ["/api/liste/oras-judet"],
  });

  const filteredCities = useMemo(() => {
    if (!orasJudetData || !search || search.length < 2) return [];
    const s = search.toLowerCase();
    const seen = new Set<string>();
    return orasJudetData
      .filter(r => {
        const key = `${r.oras}-${r.judet}`;
        if (seen.has(key)) return false;
        if (r.oras.toLowerCase().includes(s)) {
          seen.add(key);
          return true;
        }
        return false;
      })
      .slice(0, 50);
  }, [orasJudetData, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={e => {
              onChange(e.target.value);
              setSearch(e.target.value);
              if (e.target.value.length >= 2 && !open) setOpen(true);
            }}
            onFocus={() => { if (value.length >= 2) { setSearch(value); setOpen(true); } }}
            placeholder="ex: Bucuresti"
            className="h-7 text-xs pr-6"
            data-testid={`${idPrefix || ""}input-city`}
          />
          <ChevronsUpDown className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cauta oras..."
            value={search}
            onValueChange={(v) => { setSearch(v); onChange(v); }}
            data-testid={`${idPrefix || ""}input-city-search`}
          />
          <CommandList>
            <CommandEmpty>{search.length < 2 ? "Scrie cel putin 2 caractere" : "Nu s-a gasit"}</CommandEmpty>
            {filteredCities.length > 0 && (
              <CommandGroup>
                {filteredCities.map(entry => (
                  <CommandItem
                    key={entry.id}
                    value={`${entry.oras}-${entry.judet}`}
                    onSelect={() => {
                      onSelectCity(entry);
                      setOpen(false);
                    }}
                    data-testid={`${idPrefix || ""}city-option-${entry.oras}`}
                  >
                    <Check className={cn("mr-2 h-3 w-3", value === entry.oras ? "opacity-100" : "opacity-0")} />
                    <span className="text-xs">{entry.oras} <span className="text-muted-foreground">({entry.judet})</span></span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CountyCombobox({ value, onChange, idPrefix }: {
  value: string;
  onChange: (v: string) => void;
  idPrefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: orasJudetData } = useQuery<OrasJudetEntry[]>({
    queryKey: ["/api/liste/oras-judet"],
  });

  const counties = useMemo(() => {
    if (!orasJudetData) return [];
    const seen = new Set<string>();
    return orasJudetData
      .map(r => r.judet)
      .filter(j => {
        if (!j || seen.has(j)) return false;
        seen.add(j);
        return true;
      })
      .sort();
  }, [orasJudetData]);

  const filtered = useMemo(() => {
    if (!search) return counties;
    const s = search.toLowerCase();
    return counties.filter(c => c.toLowerCase().includes(s));
  }, [counties, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            onChange={e => { onChange(e.target.value); setSearch(e.target.value); if (!open) setOpen(true); }}
            onFocus={() => { setSearch(value); setOpen(true); }}
            placeholder="ex: Ilfov"
            className="h-7 text-xs pr-6"
            data-testid={`${idPrefix || ""}input-county`}
          />
          <ChevronsUpDown className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cauta judet..."
            value={search}
            onValueChange={(v) => { setSearch(v); onChange(v); }}
            data-testid={`${idPrefix || ""}input-county-search`}
          />
          <CommandList>
            <CommandEmpty>Nu s-a gasit</CommandEmpty>
            <CommandGroup>
              {filtered.slice(0, 42).map(c => (
                <CommandItem
                  key={c}
                  value={c}
                  onSelect={() => { onChange(c); setOpen(false); }}
                  data-testid={`${idPrefix || ""}county-option-${c}`}
                >
                  <Check className={cn("mr-2 h-3 w-3", value === c ? "opacity-100" : "opacity-0")} />
                  <span className="text-xs">{c}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function AddressFields({ values, onChange, onBatchChange, idPrefix = "" }: AddressFieldsProps) {
  const { data: streetTypesData } = useQuery<any[]>({
    queryKey: ["/api/liste/tip-drumuri"],
  });

  const streetTypes: string[] = useMemo(() => {
    if (streetTypesData && streetTypesData.length > 0) {
      return streetTypesData
        .map((r: any) => typeof r === "string" ? r : (r.tipDrum || r.tip_drum || r.name || ""))
        .filter(Boolean);
    }
    return FALLBACK_STREET_TYPES;
  }, [streetTypesData]);

  const handleCitySelect = useCallback((entry: OrasJudetEntry) => {
    if (onBatchChange) {
      const isBuc = isBucharestCity(entry.oras);
      onBatchChange({
        city: entry.oras,
        county: isBuc ? "Bucuresti" : entry.judet,
        sector: isBuc ? values.sector : "",
        postalCode: isBuc ? "" : values.postalCode,
      });
    } else {
      onChange("city", entry.oras);
      const isBuc = isBucharestCity(entry.oras);
      onChange("county", isBuc ? "Bucuresti" : entry.judet);
      if (isBuc) {
        onChange("postalCode", "");
      } else {
        onChange("sector", "");
      }
    }
  }, [onChange, onBatchChange, values.sector, values.postalCode]);

  const handleCityManualChange = useCallback((v: string) => {
    onChange("city", v);
    if (isBucharestCity(v)) {
      onChange("county", "Bucuresti");
      onChange("postalCode", "");
    } else {
      onChange("sector", "");
    }
  }, [onChange]);

  const isBuc = isBucharestCity(values.city);
  const composed = composeAddress(values);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Adresa</Label>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <Label className="text-[10px] text-muted-foreground">Tip drum</Label>
          <Select value={values.streetType || "__none__"} onValueChange={v => onChange("streetType", v === "__none__" ? "" : v)}>
            <SelectTrigger className="h-7 text-xs" data-testid={`${idPrefix}select-street-type`}>
              <SelectValue placeholder="Selecteaza..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">-- Selecteaza --</SelectItem>
              {streetTypes.map(st => (
                <SelectItem key={st} value={st}>{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6">
          <Label className="text-[10px] text-muted-foreground">Nume strada</Label>
          <Input value={values.streetName} onChange={e => onChange("streetName", e.target.value)} placeholder="ex: Mihai Eminescu" className="h-7 text-xs" data-testid={`${idPrefix}input-street-name`} />
        </div>
        <div className="col-span-2">
          <Label className="text-[10px] text-muted-foreground">Nr.</Label>
          <Input value={values.streetNumber} onChange={e => onChange("streetNumber", e.target.value)} placeholder="10" className="h-7 text-xs" data-testid={`${idPrefix}input-street-number`} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <Label className="text-[10px] text-muted-foreground">Oras</Label>
          <CityCombobox
            value={values.city}
            onChange={handleCityManualChange}
            onSelectCity={handleCitySelect}
            idPrefix={idPrefix}
          />
        </div>
        {isBuc ? (
          <>
            <div className="col-span-4">
              <Label className="text-[10px] text-muted-foreground">Sector</Label>
              <Select value={values.sector || "__none__"} onValueChange={v => onChange("sector", v === "__none__" ? "" : v)}>
                <SelectTrigger className="h-7 text-xs" data-testid={`${idPrefix}select-sector`}>
                  <SelectValue placeholder="Sector..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">-- Sector --</SelectItem>
                  {["1", "2", "3", "4", "5", "6"].map(s => (
                    <SelectItem key={s} value={s}>Sector {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4" />
          </>
        ) : (
          <>
            <div className="col-span-4">
              <Label className="text-[10px] text-muted-foreground">Judet</Label>
              <CountyCombobox
                value={values.county}
                onChange={v => onChange("county", v)}
                idPrefix={idPrefix}
              />
            </div>
            <div className="col-span-4">
              <Label className="text-[10px] text-muted-foreground">Cod Postal</Label>
              <Input value={values.postalCode} onChange={e => onChange("postalCode", e.target.value)} placeholder="ex: 012345" className="h-7 text-xs" data-testid={`${idPrefix}input-postal-code`} />
            </div>
          </>
        )}
      </div>
      {composed && (
        <div className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded" data-testid={`${idPrefix}address-preview`}>
          {composed}
        </div>
      )}
    </div>
  );
}
