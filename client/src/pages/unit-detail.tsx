import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Home, Box, Car, User, Phone, Mail, Ruler, DoorOpen, Users, Building2, Layers, MapPin } from "lucide-react";
import { UNIT_TYPE_LABELS, type UnitType, type Apartment, type Staircase, type Building, type Association, type UnitRoom, type Meter, type MeterReading } from "@shared/schema";

const UNIT_TYPE_ICONS: Record<string, any> = {
  apartment: Home,
  box: Box,
  parking: Car,
};

const METER_TYPE_LABELS: Record<string, string> = {
  water: "Apa",
  electricity: "Electricitate",
  gas: "Gaz",
};

export default function UnitDetail() {
  const [, params] = useRoute("/unitate/:id");
  const unitId = params?.id;

  const { data: unit, isLoading: unitLoading } = useQuery<Apartment>({
    queryKey: ["/api/apartments", unitId],
    enabled: !!unitId,
  });

  const { data: rooms } = useQuery<UnitRoom[]>({
    queryKey: ["/api/unit-rooms", unitId],
    enabled: !!unitId,
  });

  const { data: meters } = useQuery<Meter[]>({
    queryKey: ["/api/meters"],
    enabled: !!unitId,
  });

  const { data: allStaircases } = useQuery<Staircase[]>({
    queryKey: ["/api/staircases"],
  });

  const { data: allBuildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const { data: allAssociations } = useQuery<Association[]>({
    queryKey: ["/api/associations"],
  });

  const staircase = allStaircases?.find(s => s.id === unit?.staircaseId);
  const building = allBuildings?.find(b => b.id === staircase?.buildingId);
  const association = allAssociations?.find(a => a.id === building?.associationId);
  const unitMeters = meters?.filter(m => m.apartmentId === unitId) || [];

  if (unitLoading) {
    return (
      <div className="p-6 space-y-4 overflow-y-auto h-full">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Unitatea nu a fost gasita.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inapoi la Infografie
          </Button>
        </Link>
      </div>
    );
  }

  const uType = (unit.unitType || "apartment") as UnitType;
  const UIcon = UNIT_TYPE_ICONS[uType] || Home;
  const typeLabel = UNIT_TYPE_LABELS[uType] || "Apartament";

  function getFloorLabel(floor: number) {
    if (floor < 0) return `Subsol ${Math.abs(floor)}`;
    if (floor === 0) return "Parter";
    return `Etaj ${floor}`;
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/">
          <Button variant="outline" size="sm" data-testid="button-back-infografie">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Infografie
          </Button>
        </Link>
        {association && (
          <Link href={`/asociatie/${association.id}`}>
            <Button variant="outline" size="sm" data-testid="button-back-association">
              <Building2 className="w-4 h-4 mr-1.5" />
              {association.name}
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <UIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold" data-testid="text-unit-title">
            {typeLabel} {unit.number}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {building && <span>{building.name}</span>}
            {staircase && <span>/ {staircase.name}</span>}
            <span>/ {getFloorLabel(unit.floor)}</span>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto" data-testid="badge-unit-type">{typeLabel}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              Informatii Generale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tip</span>
              <span className="font-medium" data-testid="text-unit-type">{typeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Numar</span>
              <span className="font-medium" data-testid="text-unit-number">{unit.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Etaj</span>
              <span className="font-medium">{getFloorLabel(unit.floor)}</span>
            </div>
            {unit.surface && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suprafata utila</span>
                <span className="font-medium">{unit.surface} m²</span>
              </div>
            )}
            {unit.builtSurface && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suprafata construita</span>
                <span className="font-medium">{unit.builtSurface} m²</span>
              </div>
            )}
            {unit.rooms && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nr. Camere</span>
                <span className="font-medium">{unit.rooms}</span>
              </div>
            )}
            {unit.residents !== null && unit.residents !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nr. Rezidenti</span>
                <span className="font-medium">{unit.residents}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Proprietar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {unit.ownerName ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium" data-testid="text-owner-name">{unit.ownerName}</span>
                </div>
                {unit.ownerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{unit.ownerPhone}</span>
                  </div>
                )}
                {unit.ownerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{unit.ownerEmail}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic">Niciun proprietar inregistrat</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Locatie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {association && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asociatia</span>
                <span className="font-medium">{association.name}</span>
              </div>
            )}
            {building && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bloc</span>
                <span className="font-medium">{building.name}</span>
              </div>
            )}
            {staircase && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scara</span>
                <span className="font-medium">{staircase.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Etaj</span>
              <span className="font-medium">{getFloorLabel(unit.floor)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {rooms && rooms.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-primary" />
              Camere
              <Badge variant="secondary" className="text-[10px]">{rooms.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {rooms.map(room => (
                <div key={room.id} className="border rounded-md p-2 text-center text-sm" data-testid={`room-card-${room.id}`}>
                  <p className="font-medium truncate">{room.name}</p>
                  {room.surface && (
                    <p className="text-[10px] text-muted-foreground">{room.surface} m²</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {unitMeters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Contoare
              <Badge variant="secondary" className="text-[10px]">{unitMeters.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unitMeters.map(meter => (
                <div key={meter.id} className="flex items-center gap-3 border rounded-md p-3 text-sm" data-testid={`meter-card-${meter.id}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{METER_TYPE_LABELS[meter.meterType] || meter.meterType}</span>
                      <Badge variant={meter.isActive ? "default" : "secondary"} className="text-[9px]">
                        {meter.isActive ? "Activ" : "Inactiv"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Serie: {meter.serialNumber} | Nr: {meter.meterNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
