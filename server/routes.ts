import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loadUserContext, requirePermission, requireRole, type AuthenticatedRequest } from "./middleware";
import type { RequestHandler } from "express";
import {
  insertBuildingSchema, insertApartmentSchema, insertExpenseSchema,
  insertPaymentSchema, insertAnnouncementSchema, insertUserRoleSchema,
  insertFederationSchema, insertAssociationSchema, insertStaircaseSchema,
  insertDocumentSchema, insertMeterSchema, insertMeterReadingSchema,
  insertFundSchema, insertFundCategorySchema,
  insertContractSchema, insertContractTemplateSchema,
  insertPlatformUserSchema, insertUserActivityLogSchema,
  ROLE_HIERARCHY, type UserRole,
} from "@shared/schema";
import { users, appSettings, platformUsers, userActivityLog, associations, buildings, staircases, apartments } from "@shared/schema";
import { db } from "./db";
import { eq, inArray, desc } from "drizzle-orm";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

function isInBuildingScope(req: AuthenticatedRequest, buildingId: string): boolean {
  if (req.permissions?.viewAllBuildings) return true;
  return (req.accessibleBuildingIds || []).includes(buildingId);
}

function isInApartmentScope(req: AuthenticatedRequest, apartmentId: string): boolean {
  if (req.permissions?.viewAllApartments) return true;
  return (req.accessibleApartmentIds || []).includes(apartmentId);
}

function isInFederationScope(req: AuthenticatedRequest, federationId: string): boolean {
  if (req.permissions?.viewAllBuildings) return true;
  return (req.accessibleFederationIds || []).includes(federationId);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const noAuthBypass: RequestHandler = (req, res, next) => {
    if (!(req as any).user) {
      (req as any).user = { claims: { sub: "default-admin" } };
    }
    next();
  };
  const auth = [noAuthBypass, loadUserContext];

  app.get("/api/me/roles", ...auth, async (req: AuthenticatedRequest, res) => {
    res.json({
      userId: req.userId,
      roles: req.userRoles,
      highestRole: req.highestRole,
      permissions: req.permissions,
      accessibleBuildingIds: req.accessibleBuildingIds,
      accessibleApartmentIds: req.accessibleApartmentIds,
      accessibleFederationIds: req.accessibleFederationIds,
    });
  });

  // Federations
  app.get("/api/federations", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllBuildings) {
      const data = await storage.getFederations();
      return res.json(data);
    }
    const fedIds = req.accessibleFederationIds || [];
    if (fedIds.length === 0) return res.json([]);
    const allFeds = await storage.getFederations();
    return res.json(allFeds.filter(f => fedIds.includes(f.id)));
  });

  app.post("/api/federations", ...auth, requireRole("super_admin"), async (req, res) => {
    const parsed = insertFederationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const federation = await storage.createFederation(parsed.data);
    res.json(federation);
  });

  app.patch("/api/federations/:id", ...auth, requireRole("super_admin"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getFederation(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Federatia nu a fost gasita" });
    const parsed = insertFederationSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.name !== undefined && !parsed.data.name.trim()) {
      return res.status(400).json({ message: "Numele este obligatoriu" });
    }
    const updated = await storage.updateFederation(req.params.id as string, parsed.data);
    res.json(updated);
  });

  app.delete("/api/federations/:id", ...auth, requireRole("super_admin"), async (req, res) => {
    await storage.deleteFederation(req.params.id as string);
    res.json({ success: true });
  });

  // Associations
  app.get("/api/associations", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllBuildings) {
      const data = await storage.getAssociations();
      return res.json(data);
    }
    return res.json([]);
  });

  app.post("/api/associations", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertAssociationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.federationId && !isInFederationScope(req, parsed.data.federationId)) {
      return res.status(403).json({ message: "Nu aveti acces la aceasta federatie" });
    }
    const association = await storage.createAssociation(parsed.data);
    res.json(association);
  });

  app.patch("/api/associations/:id", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getAssociation(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Asociatia nu a fost gasita" });
    if (existing.federationId && !isInFederationScope(req, existing.federationId)) {
      return res.status(403).json({ message: "Nu aveti acces la aceasta asociatie" });
    }
    const parsed = insertAssociationSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.name !== undefined && !parsed.data.name.trim()) {
      return res.status(400).json({ message: "Numele este obligatoriu" });
    }
    if (parsed.data.federationId && !isInFederationScope(req, parsed.data.federationId)) {
      return res.status(403).json({ message: "Nu aveti acces la federatia destinatie" });
    }
    const updated = await storage.updateAssociation(req.params.id as string, parsed.data);
    res.json(updated);
  });

  app.delete("/api/associations/:id", ...auth, requirePermission("manageBuildings"), async (req, res) => {
    await storage.deleteAssociation(req.params.id as string);
    res.json({ success: true });
  });

  // Buildings
  app.get("/api/buildings", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllBuildings) {
      const data = await storage.getBuildings();
      return res.json(data);
    }
    const ids = req.accessibleBuildingIds || [];
    if (ids.length === 0) return res.json([]);
    const data = await storage.getBuildingsByIds(ids);
    res.json(data);
  });

  app.post("/api/buildings", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertBuildingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const building = await storage.createBuilding(parsed.data);
    res.json(building);
  });

  app.patch("/api/buildings/:id", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getBuilding(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Blocul nu a fost gasit" });
    if (!isInBuildingScope(req, existing.id)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const parsed = insertBuildingSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.name !== undefined && !parsed.data.name.trim()) {
      return res.status(400).json({ message: "Numele este obligatoriu" });
    }
    const { associationId, ...updateFields } = parsed.data;
    const updated = await storage.updateBuilding(req.params.id as string, updateFields);
    res.json(updated);
  });

  app.delete("/api/buildings/:id", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const id = req.params.id as string;
    const building = await storage.getBuilding(id);
    if (!building) return res.status(404).json({ message: "Blocul nu a fost gasit" });
    if (!isInBuildingScope(req, building.id)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    await storage.deleteBuilding(id);
    res.json({ success: true });
  });

  // Staircases
  app.get("/api/staircases", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllBuildings) {
      const data = await storage.getStaircases();
      return res.json(data);
    }
    return res.json([]);
  });

  app.post("/api/staircases", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertStaircaseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (!isInBuildingScope(req, parsed.data.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const staircase = await storage.createStaircase(parsed.data);
    res.json(staircase);
  });

  app.patch("/api/staircases/:id", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getStaircase(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Scara nu a fost gasita" });
    if (!isInBuildingScope(req, existing.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const parsed = insertStaircaseSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.name !== undefined && !parsed.data.name.trim()) {
      return res.status(400).json({ message: "Numele este obligatoriu" });
    }
    const { buildingId, ...updateFields } = parsed.data;
    const updated = await storage.updateStaircase(req.params.id as string, updateFields);
    res.json(updated);
  });

  app.delete("/api/staircases/:id", ...auth, requirePermission("manageBuildings"), async (req: AuthenticatedRequest, res) => {
    const staircase = await storage.getStaircase(req.params.id as string);
    if (!staircase) return res.status(404).json({ message: "Scara nu a fost gasita" });
    if (!isInBuildingScope(req, staircase.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    await storage.deleteStaircase(req.params.id as string);
    res.json({ success: true });
  });

  // Apartments
  app.get("/api/apartments", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllApartments) {
      const data = await storage.getApartments();
      return res.json(data);
    }
    const aptIds = req.accessibleApartmentIds || [];
    if (aptIds.length > 0) {
      const data = await storage.getApartmentsByIds(aptIds);
      return res.json(data);
    }
    return res.json([]);
  });

  app.post("/api/apartments", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertApartmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const staircase = await storage.getStaircase(parsed.data.staircaseId);
    if (!staircase) return res.status(404).json({ message: "Scara nu a fost gasita" });
    if (!isInBuildingScope(req, staircase.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const apartment = await storage.createApartment(parsed.data);
    res.json(apartment);
  });

  app.get("/api/apartments/:id", ...auth, async (req: AuthenticatedRequest, res) => {
    const apt = await storage.getApartment(req.params.id as string);
    if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      if (!isInApartmentScope(req, apt.id)) {
        return res.status(403).json({ message: "Nu aveti acces" });
      }
    }
    res.json(apt);
  });

  app.patch("/api/apartments/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getApartment(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(existing.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      if (!isInApartmentScope(req, existing.id)) {
        return res.status(403).json({ message: "Nu aveti acces" });
      }
    }
    const parsed = insertApartmentSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.number !== undefined && !parsed.data.number.trim()) {
      return res.status(400).json({ message: "Numarul este obligatoriu" });
    }
    const { staircaseId, ...updateFields } = parsed.data;
    const updated = await storage.updateApartment(req.params.id as string, updateFields);
    res.json(updated);
  });

  // Unit Rooms
  app.get("/api/unit-rooms/:apartmentId", ...auth, async (req: AuthenticatedRequest, res) => {
    const apt = await storage.getApartment(req.params.apartmentId as string);
    if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      if (!isInApartmentScope(req, apt.id)) {
        return res.status(403).json({ message: "Nu aveti acces" });
      }
    }
    const rooms = await storage.getUnitRoomsByApartment(req.params.apartmentId as string);
    res.json(rooms);
  });

  app.post("/api/unit-rooms", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const { apartmentId, rooms } = req.body;
    if (!apartmentId || !Array.isArray(rooms)) {
      return res.status(400).json({ message: "apartmentId si rooms sunt obligatorii" });
    }
    const apt = await storage.getApartment(apartmentId);
    if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    await storage.deleteUnitRoomsByApartment(apartmentId);
    const created = [];
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (typeof room.name !== "string" || !room.name.trim()) continue;
      const r = await storage.createUnitRoom({
        apartmentId,
        name: room.name.trim(),
        surface: room.surface ? String(room.surface) : null,
        sortOrder: i,
      });
      created.push(r);
    }
    res.json(created);
  });

  app.delete("/api/unit-rooms/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    await storage.deleteUnitRoom(req.params.id as string);
    res.json({ success: true });
  });

  // Meters
  app.get("/api/meters/:apartmentId", ...auth, async (req: AuthenticatedRequest, res) => {
    const apt = await storage.getApartment(req.params.apartmentId as string);
    if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      if (!isInApartmentScope(req, apt.id)) {
        return res.status(403).json({ message: "Nu aveti acces" });
      }
    }
    const metersList = await storage.getMetersByApartment(req.params.apartmentId as string);
    res.json(metersList);
  });

  app.post("/api/meters", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertMeterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const scopeType = parsed.data.scopeType || "apartment";
    if (scopeType === "apartment") {
      if (!parsed.data.apartmentId) return res.status(400).json({ message: "apartmentId este obligatoriu pentru contoare de apartament" });
      const apt = await storage.getApartment(parsed.data.apartmentId);
      if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
        return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
      }
    }
    const meter = await storage.createMeter(parsed.data);
    res.json(meter);
  });

  app.patch("/api/meters/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const meter = await storage.getMeter(req.params.id as string);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    if (meter.apartmentId) {
      const apt = await storage.getApartment(meter.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
          if (!isInApartmentScope(req, apt.id)) {
            return res.status(403).json({ message: "Nu aveti acces" });
          }
        }
      }
    }
    const { chamberLocation, serialNumber, meterNumber, isActive } = req.body;
    const updateData: Record<string, any> = {};
    if (chamberLocation !== undefined) updateData.chamberLocation = chamberLocation;
    if (serialNumber !== undefined) updateData.serialNumber = serialNumber;
    if (meterNumber !== undefined) updateData.meterNumber = meterNumber;
    if (isActive !== undefined) updateData.isActive = isActive;
    const updated = await storage.updateMeter(req.params.id as string, updateData);
    if (!updated) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    res.json(updated);
  });

  app.delete("/api/meters/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const meter = await storage.getMeter(req.params.id as string);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    if (meter.apartmentId) {
      const apt = await storage.getApartment(meter.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
          if (!isInApartmentScope(req, apt.id)) {
            return res.status(403).json({ message: "Nu aveti acces" });
          }
        }
      }
    }
    await storage.deleteMeter(req.params.id as string);
    res.json({ ok: true });
  });

  app.get("/api/common-meters", ...auth, async (req: AuthenticatedRequest, res) => {
    const { associationId, buildingId, staircaseId, floor } = req.query;
    if (!associationId) return res.status(400).json({ message: "associationId este obligatoriu" });
    const scope: any = { associationId: associationId as string };
    if (buildingId) scope.buildingId = buildingId as string;
    if (staircaseId) scope.staircaseId = staircaseId as string;
    if (floor !== undefined && floor !== "") scope.floor = Number(floor);
    const metersList = await storage.getMetersByScope(scope);
    res.json(metersList);
  });

  // Meter Readings
  app.get("/api/meter-readings/:meterId", ...auth, async (req: AuthenticatedRequest, res) => {
    const meter = await storage.getMeter(req.params.meterId as string);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    if (meter.apartmentId) {
      const apt = await storage.getApartment(meter.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
          if (!isInApartmentScope(req, apt.id)) {
            return res.status(403).json({ message: "Nu aveti acces" });
          }
        }
      }
    }
    const readings = await storage.getMeterReadings(req.params.meterId as string);
    res.json(readings);
  });

  app.post("/api/meter-readings", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertMeterReadingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const meter = await storage.getMeter(parsed.data.meterId);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    if (meter.apartmentId) {
      const apt = await storage.getApartment(meter.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (staircase && !isInBuildingScope(req, staircase.buildingId)) {
          return res.status(403).json({ message: "Nu aveti acces" });
        }
      }
    }

    const latestReading = await storage.getLatestMeterReading(parsed.data.meterId);
    const newValue = Number(parsed.data.readingValue);

    const prevValue = latestReading ? Number(latestReading.readingValue) : Number(meter.initialReading);
    if (newValue < prevValue) {
      return res.status(400).json({ message: `Valoarea citirii (${newValue}) nu poate fi mai mica decat citirea anterioara (${prevValue})` });
    }

    let consumption: string;
    let accumulated: string;

    if (latestReading) {
      consumption = String(newValue - Number(latestReading.readingValue));
      const prevAccumulated = Number(latestReading.accumulatedConsumption || "0");
      accumulated = String(prevAccumulated + (newValue - Number(latestReading.readingValue)));
    } else {
      consumption = String(newValue - Number(meter.initialReading));
      accumulated = consumption;
    }

    const reading = await storage.createMeterReading({
      ...parsed.data,
      consumption,
      accumulatedConsumption: accumulated,
    });
    res.json(reading);
  });

  app.delete("/api/meter-readings/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const reading = await storage.getMeterReading(req.params.id as string);
    if (!reading) return res.status(404).json({ message: "Citirea nu a fost gasita" });
    const meter = await storage.getMeter(reading.meterId);
    if (meter && meter.apartmentId) {
      const apt = await storage.getApartment(meter.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (staircase && !isInBuildingScope(req, staircase.buildingId)) {
          return res.status(403).json({ message: "Nu aveti acces" });
        }
      }
    }
    await storage.deleteMeterReading(req.params.id as string);
    res.json({ ok: true });
  });

  // Expenses
  app.get("/api/expenses", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllExpenses) {
      const data = await storage.getExpenses();
      return res.json(data);
    }
    const buildingIds = req.accessibleBuildingIds || [];
    if (buildingIds.length === 0) return res.json([]);
    const data = await storage.getExpensesByBuildingIds(buildingIds);
    res.json(data);
  });

  app.post("/api/expenses", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertExpenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (!isInBuildingScope(req, parsed.data.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const expense = await storage.createExpense(parsed.data);
    res.json(expense);
  });

  app.delete("/api/expenses/:id", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const expense = await storage.getExpenseById(req.params.id as string);
    if (!expense) return res.status(404).json({ message: "Cheltuiala nu a fost gasita" });
    if (!isInBuildingScope(req, expense.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    await storage.deleteExpense(req.params.id as string);
    res.json({ ok: true });
  });

  // Payments
  app.get("/api/payments", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllPayments) {
      const data = await storage.getPayments();
      return res.json(data);
    }
    const aptIds = req.accessibleApartmentIds || [];
    if (aptIds.length > 0) {
      const data = await storage.getPaymentsByApartmentIds(aptIds);
      return res.json(data);
    }
    return res.json([]);
  });

  app.post("/api/payments", ...auth, requirePermission("managePayments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertPaymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const apt = await storage.getApartment(parsed.data.apartmentId);
    if (!apt) return res.status(404).json({ message: "Apartamentul nu a fost gasit" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const payment = await storage.createPayment(parsed.data);
    res.json(payment);
  });

  app.patch("/api/payments/:id", ...auth, requirePermission("managePayments"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getPaymentById(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Plata nu a fost gasita" });
    const apt = await storage.getApartment(existing.apartmentId);
    if (apt) {
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (staircase && !isInBuildingScope(req, staircase.buildingId)) {
        return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
      }
    }
    const { status, paidDate } = req.body;
    const updateData: Record<string, any> = {};
    if (status && (status === "paid" || status === "pending")) {
      updateData.status = status;
    }
    if (paidDate !== undefined) {
      updateData.paidDate = paidDate;
    }
    const payment = await storage.updatePayment(req.params.id as string, updateData);
    if (!payment) return res.status(404).json({ message: "Plata nu a fost gasita" });
    res.json(payment);
  });

  // Announcements
  app.get("/api/announcements", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllAnnouncements) {
      const data = await storage.getAnnouncements();
      return res.json(data);
    }
    const buildingIds = req.accessibleBuildingIds || [];
    if (buildingIds.length === 0) return res.json([]);
    const data = await storage.getAnnouncementsByBuildingIds(buildingIds);
    res.json(data);
  });

  app.post("/api/announcements", ...auth, requirePermission("manageAnnouncements"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (parsed.data.buildingId && !isInBuildingScope(req, parsed.data.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const announcement = await storage.createAnnouncement(parsed.data);
    res.json(announcement);
  });

  app.delete("/api/announcements/:id", ...auth, requirePermission("manageAnnouncements"), async (req: AuthenticatedRequest, res) => {
    const ann = await storage.getAnnouncementById(req.params.id as string);
    if (!ann) return res.status(404).json({ message: "Anuntul nu a fost gasit" });
    if (ann.buildingId && !isInBuildingScope(req, ann.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    await storage.deleteAnnouncement(req.params.id as string);
    res.json({ ok: true });
  });

  // User Role Management
  app.get("/api/users", ...auth, requirePermission("viewUserManagement"), async (req: AuthenticatedRequest, res) => {
    const allRoles = req.permissions?.manageUsers
      ? await storage.getAllUserRoles()
      : await getUserRolesInScope(req);

    const userIds = Array.from(new Set(allRoles.map(r => r.userId)));
    if (userIds.length === 0) return res.json([]);

    const usersData = await db.select().from(users).where(inArray(users.id, userIds));
    const enriched = usersData.map(u => ({
      ...u,
      roles: allRoles.filter(r => r.userId === u.id),
    }));
    res.json(enriched);
  });

  app.get("/api/user-roles", ...auth, requirePermission("viewUserManagement"), async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.manageUsers) {
      const data = await storage.getAllUserRoles();
      return res.json(data);
    }
    const roles = await getUserRolesInScope(req);
    res.json(roles);
  });

  app.post("/api/user-roles", ...auth, async (req: AuthenticatedRequest, res) => {
    const parsed = insertUserRoleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

    const newRole = parsed.data.role as UserRole;
    const currentRole = req.highestRole as UserRole;

    if (currentRole === "super_admin") {
    } else if (currentRole === "admin") {
      if (!["manager", "owner", "tenant"].includes(newRole)) {
        return res.status(403).json({ message: "Nu puteti asigna acest rol" });
      }
    } else if (currentRole === "owner") {
      if (newRole !== "tenant") {
        return res.status(403).json({ message: "Puteti doar sa adaugati chiriasi" });
      }
    } else {
      return res.status(403).json({ message: "Nu aveti permisiunea de a asigna roluri" });
    }

    const roleData = {
      ...parsed.data,
      assignedBy: req.userId,
    };

    const role = await storage.createUserRole(roleData);
    res.json(role);
  });

  app.delete("/api/user-roles/:id", ...auth, async (req: AuthenticatedRequest, res) => {
    if (!req.permissions?.manageUsers && !req.permissions?.manageManagers && !req.permissions?.manageTenants) {
      return res.status(403).json({ message: "Nu aveti permisiunea necesara" });
    }
    await storage.deleteUserRole(req.params.id as string);
    res.json({ ok: true });
  });

  app.get("/api/users/search", ...auth, async (req: AuthenticatedRequest, res) => {
    const email = req.query.email as string;
    if (!email) return res.json([]);
    const allUsers = await db.select().from(users);
    const filtered = allUsers.filter(u => u.email?.toLowerCase().includes(email.toLowerCase()));
    res.json(filtered.slice(0, 10));
  });

  // Reference Lists (Supabase)
  const { referenceListConfigs, mapRowFromSupabase, mapRowToSupabase } = await import("./reference-lists");
  const { supabase } = await import("./supabase");
  const { SUPABASE_TABLE_SQL } = await import("./supabase-init");

  app.get("/api/supabase/setup-sql", ...auth, requireRole("super_admin"), async (_req, res) => {
    res.json({ sql: SUPABASE_TABLE_SQL });
  });

  app.get("/api/supabase/status", ...auth, async (_req, res) => {
    const results: Record<string, { ok: boolean; error?: string; count?: number }> = {};
    for (const [key, config] of Object.entries(referenceListConfigs)) {
      const { data, error } = await supabase.from(config.supabaseTable).select("id", { count: "exact", head: true });
      if (error) {
        results[key] = { ok: false, error: error.message };
      } else {
        results[key] = { ok: true };
      }
    }
    const allOk = Object.values(results).every(r => r.ok);
    res.json({ connected: allOk, tables: results });
  });

  for (const [key, config] of Object.entries(referenceListConfigs)) {
    const basePath = `/api/liste/${key}`;

    app.get(basePath, ...auth, async (_req, res) => {
      try {
        let allData: any[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;
        let supabaseOk = false;
        try {
          while (hasMore) {
            const { data: page, error: pageError } = await supabase
              .from(config.supabaseTable)
              .select("*")
              .range(from, from + pageSize - 1);
            if (pageError) throw new Error(pageError.message);
            allData = allData.concat(page || []);
            if (!page || page.length < pageSize) {
              hasMore = false;
            } else {
              from += pageSize;
            }
          }
          supabaseOk = true;
        } catch (supErr: any) {
          console.warn(`Supabase fallback for ${config.supabaseTable}: ${supErr.message}`);
        }
        if (supabaseOk && allData.length > 0) {
          const mapped = allData.map(mapRowFromSupabase);
          res.json(mapped);
        } else {
          const localData = await db.select().from(config.table);
          res.json(localData);
        }
      } catch (err: any) {
        console.error(`GET ${config.supabaseTable}:`, err.message);
        res.status(500).json({ message: err.message });
      }
    });

    app.post(basePath, ...auth, requireRole("admin"), async (req, res) => {
      const parsed = config.insertSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: (parsed as any).error.message });
      try {
        const supabaseData = mapRowToSupabase((parsed as any).data, config.columnMap);
        const { data, error } = await supabase.from(config.supabaseTable).insert(supabaseData).select().single();
        if (error) {
          console.warn(`Supabase POST fallback for ${config.supabaseTable}: ${error.message}`);
          const [localRow] = await db.insert(config.table).values((parsed as any).data).returning();
          return res.json(localRow);
        }
        res.json(mapRowFromSupabase(data));
      } catch (err: any) {
        console.error(`POST ${config.supabaseTable}:`, err.message);
        res.status(500).json({ message: err.message });
      }
    });

    app.patch(`${basePath}/:id`, ...auth, requireRole("admin"), async (req, res) => {
      try {
        const supabaseData = mapRowToSupabase(req.body, config.columnMap);
        const { data, error } = await supabase.from(config.supabaseTable).update(supabaseData).eq("id", req.params.id).select().single();
        if (error) {
          console.warn(`Supabase PATCH fallback for ${config.supabaseTable}: ${error.message}`);
          const [localRow] = await db.update(config.table).set(req.body).where(eq((config.table as any).id, req.params.id)).returning();
          return res.json(localRow);
        }
        res.json(mapRowFromSupabase(data));
      } catch (err: any) {
        console.error(`PATCH ${config.supabaseTable}:`, err.message);
        res.status(500).json({ message: err.message });
      }
    });

    app.delete(`${basePath}/:id`, ...auth, requireRole("admin"), async (req, res) => {
      try {
        const { error } = await supabase.from(config.supabaseTable).delete().eq("id", req.params.id);
        if (error) {
          console.warn(`Supabase DELETE fallback for ${config.supabaseTable}: ${error.message}`);
          await db.delete(config.table).where(eq((config.table as any).id, req.params.id));
          return res.json({ ok: true });
        }
        res.json({ ok: true });
      } catch (err: any) {
        console.error(`DELETE ${config.supabaseTable}:`, err.message);
        res.status(500).json({ message: err.message });
      }
    });
  }

  app.get("/api/liste-config", ...auth, async (_req, res) => {
    const { referenceListConfigs } = await import("./reference-lists");
    const configs = Object.entries(referenceListConfigs).map(([key, config]) => ({
      key: config.key,
      label: config.label,
      columns: config.columns,
    }));
    res.json(configs);
  });

  registerObjectStorageRoutes(app);

  // ── Hierarchy Stats ────────────────────────────────────
  app.get("/api/hierarchy-stats", ...auth, async (_req: AuthenticatedRequest, res) => {
    const stats = await storage.getHierarchyStats();
    res.json(stats);
  });

  // ── Funds ──────────────────────────────────────────────
  app.get("/api/funds", ...auth, async (req: AuthenticatedRequest, res) => {
    const associationId = String(req.query.associationId || "");
    if (!associationId) return res.status(400).json({ message: "associationId required" });
    const result = await storage.getFundsByAssociation(associationId);
    res.json(result);
  });

  app.post("/api/funds", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertFundSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const fund = await storage.createFund(parsed.data);
    res.json(fund);
  });

  app.patch("/api/funds/:id", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const fund = await storage.updateFund(String(req.params.id), req.body);
    if (!fund) return res.status(404).json({ message: "Fund not found" });
    res.json(fund);
  });

  app.delete("/api/funds/:id", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    await storage.deleteFund(String(req.params.id));
    res.json({ ok: true });
  });

  // ── Fund Categories ───────────────────────────────────
  app.get("/api/fund-categories", ...auth, async (req: AuthenticatedRequest, res) => {
    const fundId = String(req.query.fundId || "");
    if (!fundId) return res.status(400).json({ message: "fundId required" });
    const result = await storage.getFundCategories(fundId);
    res.json(result);
  });

  app.post("/api/fund-categories", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertFundCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const cat = await storage.createFundCategory(parsed.data);
    res.json(cat);
  });

  app.patch("/api/fund-categories/:id", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    const cat = await storage.updateFundCategory(String(req.params.id), req.body);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  });

  app.delete("/api/fund-categories/:id", ...auth, requirePermission("manageExpenses"), async (req: AuthenticatedRequest, res) => {
    await storage.deleteFundCategory(String(req.params.id));
    res.json({ ok: true });
  });

  app.get("/api/documents/:entityType/:entityId", ...auth, async (req, res) => {
    const entityType = req.params.entityType as string;
    const entityId = req.params.entityId as string;
    const floorNumber = req.query.floorNumber as string | undefined;
    if (entityType === "floor" && floorNumber !== undefined) {
      const docs = await storage.getDocumentsByFloor(entityId, Number(floorNumber));
      return res.json(docs);
    }
    const docs = await storage.getDocumentsByEntity(entityType, entityId);
    res.json(docs);
  });

  app.post("/api/documents", ...auth, async (req, res) => {
    const parsed = insertDocumentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const doc = await storage.createDocument(parsed.data);
    res.json(doc);
  });

  app.delete("/api/documents/:id", ...auth, async (req, res) => {
    await storage.deleteDocument(req.params.id as string);
    res.json({ ok: true });
  });

  app.post("/api/import-excel", ...auth, requireRole("admin") as RequestHandler, async (req, res) => {
    try {
      const multer = (await import("multer")).default;
      const XLSX = await import("xlsx");
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

      upload.single("file")(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "Eroare la incarcarea fisierului" });

        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: "Niciun fisier incarcat" });

        const associationName = req.body.associationName;
        if (!associationName) return res.status(400).json({ message: "Numele asociatiei este obligatoriu" });

        try {
          const workbook = XLSX.read(file.buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          if (rows.length === 0) return res.status(400).json({ message: "Fisierul Excel este gol" });

          const headers = Object.keys(rows[0]);
          const findHeader = (candidates: string[]) =>
            headers.find(h => candidates.some(c => h.toLowerCase().trim().includes(c.toLowerCase())));

          const tipCol = findHeader(["tip", "type", "tip imobil", "tip unitate"]);
          const blocCol = findHeader(["bloc", "block", "building", "imobil", "cladire"]);
          const scaraCol = findHeader(["scara", "staircase", "intrare", "tronson"]);
          const etajCol = findHeader(["etaj", "floor", "nivel", "planta"]);
          const nrCol = findHeader(["numar", "nr", "number", "apartament", "unitate", "nr."]);
          const camereCol = findHeader(["camere", "rooms", "nr camere", "nr. camere"]);
          const suprafataCol = findHeader(["suprafata", "supraf", "surface", "mp", "suprafata utila", "suprafata totala"]);

          if (!blocCol) return res.status(400).json({ message: "Nu s-a gasit coloana pentru Bloc. Verificati headerele Excel.", headers });

          const typeMap: Record<string, string> = {
            "apartament": "apartment", "apartment": "apartment", "apt": "apartment", "ap": "apartment",
            "box": "box", "boxa": "box", "depozit": "box", "magazie": "box",
            "parking": "parking", "parcare": "parking", "loc parcare": "parking", "par": "parking", "garaj": "parking",
            "comercial": "apartment", "espacio comercial": "apartment", "spatiu comercial": "apartment",
          };

          const association = await storage.createAssociation({
            name: associationName,
            cui: req.body.cui || undefined,
            address: req.body.address || undefined,
            federationId: req.body.federationId || undefined,
          });

          const buildingMap = new Map<string, any>();
          const staircaseMap = new Map<string, any>();
          let unitCount = 0;
          const roomRows: { apartmentId: string; rooms: { name: string; surface: string }[] }[] = [];

          for (const row of rows) {
            const blocName = String(row[blocCol] || "").trim();
            if (!blocName) continue;

            const scaraName = scaraCol ? String(row[scaraCol] || "").trim() : "Scara 1";
            const etaj = etajCol ? parseInt(String(row[etajCol] || "0")) || 0 : 0;
            const tip = tipCol ? String(row[tipCol] || "").trim().toLowerCase() : "apartament";
            const unitType = typeMap[tip] || "apartment";
            const unitNumber = nrCol ? String(row[nrCol] || "").trim() : String(unitCount + 1);
            const nrCamere = camereCol ? parseInt(String(row[camereCol] || "0")) || 0 : 0;
            const suprafata = suprafataCol ? String(row[suprafataCol] || "").trim() : "";

            if (!buildingMap.has(blocName)) {
              const building = await storage.createBuilding({
                name: blocName,
                address: blocName,
                associationId: association.id,
              });
              buildingMap.set(blocName, building);
            }
            const building = buildingMap.get(blocName);

            const staircaseKey = `${blocName}|${scaraName || "Scara 1"}`;
            if (!staircaseMap.has(staircaseKey)) {
              const staircase = await storage.createStaircase({
                name: scaraName || "Scara 1",
                buildingId: building.id,
              });
              staircaseMap.set(staircaseKey, staircase);
            }
            const staircase = staircaseMap.get(staircaseKey);

            const apartment = await storage.createApartment({
              staircaseId: staircase.id,
              unitType,
              number: unitNumber || String(unitCount + 1),
              floor: etaj,
              surface: suprafata || undefined,
              rooms: nrCamere || undefined,
            });

            const roomCols = headers.filter(h => {
              const lower = h.toLowerCase();
              return lower.includes("camera") || lower.includes("room") || lower.includes("suprafata camera");
            });

            const roomNameCols = headers.filter(h => {
              const lower = h.toLowerCase();
              return (lower.includes("nr") && lower.includes("camera")) || lower.includes("nr. camera") || lower.includes("nombre camera");
            });
            const roomSurfaceCols = headers.filter(h => {
              const lower = h.toLowerCase();
              return (lower.includes("suprafata") && lower.includes("camera")) || lower.includes("sup. camera");
            });

            if (roomNameCols.length > 0) {
              for (let ri = 0; ri < roomNameCols.length; ri++) {
                const roomName = String(row[roomNameCols[ri]] || "").trim();
                const roomSurface = ri < roomSurfaceCols.length ? String(row[roomSurfaceCols[ri]] || "").trim() : "";
                if (roomName) {
                  await storage.createUnitRoom({
                    apartmentId: apartment.id,
                    name: roomName,
                    surface: roomSurface || undefined,
                    sortOrder: ri,
                  });
                }
              }
            }

            unitCount++;
          }

          res.json({
            message: "Import finalizat cu succes",
            associationId: association.id,
            associationName: association.name,
            stats: {
              buildings: buildingMap.size,
              staircases: staircaseMap.size,
              units: unitCount,
            },
          });
        } catch (parseError: any) {
          console.error("Excel parse error:", parseError);
          res.status(400).json({ message: `Eroare la procesarea fisierului: ${parseError.message}` });
        }
      });
    } catch (error: any) {
      console.error("Import error:", error);
      res.status(500).json({ message: "Eroare interna la import" });
    }
  });

  app.post("/api/import-excel/preview", ...auth, requireRole("admin") as RequestHandler, async (req, res) => {
    try {
      const multer = (await import("multer")).default;
      const XLSX = await import("xlsx");
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

      upload.single("file")(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "Eroare la incarcarea fisierului" });

        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: "Niciun fisier incarcat" });

        try {
          const workbook = XLSX.read(file.buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
          const preview = rows.slice(0, 20);

          const findHeader = (candidates: string[]) =>
            headers.find(h => candidates.some(c => h.toLowerCase().trim().includes(c.toLowerCase())));

          const blocCol = findHeader(["bloc", "block", "building", "imobil", "cladire"]);
          const scaraCol = findHeader(["scara", "staircase", "intrare", "tronson"]);
          const tipCol = findHeader(["tip", "type", "tip imobil", "tip unitate"]);

          const buildings = new Set<string>();
          const staircases = new Set<string>();
          rows.forEach(row => {
            if (blocCol && row[blocCol]) buildings.add(String(row[blocCol]).trim());
            if (scaraCol && row[scaraCol]) staircases.add(String(row[scaraCol]).trim());
          });

          res.json({
            headers,
            totalRows: rows.length,
            preview,
            detectedColumns: {
              tip: tipCol || null,
              bloc: blocCol || null,
              scara: scaraCol || null,
            },
            summary: {
              buildings: buildings.size,
              staircases: staircases.size,
              units: rows.length,
            },
          });
        } catch (parseError: any) {
          res.status(400).json({ message: `Eroare la procesarea fisierului: ${parseError.message}` });
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Eroare interna" });
    }
  });

  // App Settings (permission matrix overrides)
  app.get("/api/settings/:key", ...auth, async (req: AuthenticatedRequest, res) => {
    const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, req.params.key));
    if (!setting) return res.json(null);
    try {
      res.json(JSON.parse(setting.value));
    } catch {
      res.json(setting.value);
    }
  });

  app.put("/api/settings/:key", ...auth, requireRole("super_admin"), async (req: AuthenticatedRequest, res) => {
    const value = JSON.stringify(req.body.value);
    await db.insert(appSettings).values({ key: req.params.key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } });
    res.json({ success: true });
  });

  // Platform Users
  app.get("/api/platform-users", ...auth, async (req: AuthenticatedRequest, res) => {
    try {
      const allUsers = await db.select().from(platformUsers).orderBy(platformUsers.lastName, platformUsers.firstName);
      const allAssocs = await db.select().from(associations);
      const allBuilds = await db.select().from(buildings);
      const allStairs = await db.select().from(staircases);
      const allApts = await db.select().from(apartments);

      const enriched = allUsers.map(u => ({
        ...u,
        associationName: allAssocs.find(a => a.id === u.associationId)?.name || null,
        buildingName: allBuilds.find(b => b.id === u.buildingId)?.name || null,
        staircaseName: allStairs.find(s => s.id === u.staircaseId)?.name || null,
        apartmentNumber: allApts.find(a => a.id === u.apartmentId)?.number || null,
        apartmentFloor: allApts.find(a => a.id === u.apartmentId)?.floor ?? null,
      }));
      res.json(enriched);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/platform-users/:id", ...auth, async (req: AuthenticatedRequest, res) => {
    try {
      const [user] = await db.select().from(platformUsers).where(eq(platformUsers.id, req.params.id));
      if (!user) return res.status(404).json({ message: "Utilizatorul nu a fost gasit" });

      const activities = await db.select().from(userActivityLog)
        .where(eq(userActivityLog.platformUserId, req.params.id))
        .orderBy(desc(userActivityLog.createdAt));

      const assoc = user.associationId ? (await db.select().from(associations).where(eq(associations.id, user.associationId)))[0] : null;
      const build = user.buildingId ? (await db.select().from(buildings).where(eq(buildings.id, user.buildingId)))[0] : null;
      const stair = user.staircaseId ? (await db.select().from(staircases).where(eq(staircases.id, user.staircaseId)))[0] : null;
      const apt = user.apartmentId ? (await db.select().from(apartments).where(eq(apartments.id, user.apartmentId)))[0] : null;

      res.json({
        ...user,
        associationName: assoc?.name || null,
        buildingName: build?.name || null,
        staircaseName: stair?.name || null,
        apartmentNumber: apt?.number || null,
        apartmentFloor: apt?.floor ?? null,
        activities,
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/platform-users", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = insertPlatformUserSchema.parse(req.body);
      const [created] = await db.insert(platformUsers).values(parsed).returning();

      await db.insert(userActivityLog).values({
        platformUserId: created.id,
        action: "Creare cont",
        details: `Cont creat cu rolul ${parsed.userRole}`,
        performedBy: req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ""}`.trim() : "Super Admin",
      });

      res.json(created);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.patch("/api/platform-users/:id", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    try {
      const [existing] = await db.select().from(platformUsers).where(eq(platformUsers.id, req.params.id));
      if (!existing) return res.status(404).json({ message: "Utilizatorul nu a fost gasit" });

      const updates = req.body;
      const performer = req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ""}`.trim() : "Super Admin";
      const changes: string[] = [];

      if (updates.isActive !== undefined && updates.isActive !== existing.isActive) {
        if (!updates.isActive) {
          updates.deactivatedAt = new Date();
          changes.push("Dezactivare cont");
        } else {
          updates.deactivatedAt = null;
          changes.push("Reactivare cont");
        }
      }
      if (updates.firstName && updates.firstName !== existing.firstName) changes.push(`Nume schimbat: ${existing.firstName} -> ${updates.firstName}`);
      if (updates.lastName && updates.lastName !== existing.lastName) changes.push(`Prenume schimbat: ${existing.lastName} -> ${updates.lastName}`);
      if (updates.username && updates.username !== existing.username) changes.push(`Username schimbat: ${existing.username} -> ${updates.username}`);
      if (updates.password && updates.password !== existing.password) changes.push("Parola schimbata");
      if (updates.userRole && updates.userRole !== existing.userRole) changes.push(`Rol schimbat: ${existing.userRole} -> ${updates.userRole}`);
      if (updates.email !== undefined && updates.email !== existing.email) changes.push(`Email schimbat`);
      if (updates.phone !== undefined && updates.phone !== existing.phone) changes.push(`Telefon schimbat`);
      if (updates.associationId !== undefined && updates.associationId !== existing.associationId) changes.push("Asociatie schimbata");
      if (updates.buildingId !== undefined && updates.buildingId !== existing.buildingId) changes.push("Bloc schimbat");
      if (updates.staircaseId !== undefined && updates.staircaseId !== existing.staircaseId) changes.push("Scara schimbata");
      if (updates.apartmentId !== undefined && updates.apartmentId !== existing.apartmentId) changes.push("Unitate schimbata");

      const [updated] = await db.update(platformUsers).set(updates).where(eq(platformUsers.id, req.params.id)).returning();

      if (changes.length > 0) {
        await db.insert(userActivityLog).values({
          platformUserId: req.params.id,
          action: "Editare cont",
          details: changes.join("; "),
          performedBy: performer,
        });
      }

      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.delete("/api/platform-users/:id", ...auth, requireRole("super_admin"), async (req: AuthenticatedRequest, res) => {
    try {
      await db.delete(platformUsers).where(eq(platformUsers.id, req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/platform-users/:id/activities", ...auth, async (req: AuthenticatedRequest, res) => {
    try {
      const activities = await db.select().from(userActivityLog)
        .where(eq(userActivityLog.platformUserId, req.params.id))
        .orderBy(desc(userActivityLog.createdAt));
      res.json(activities);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Contracts
  app.get("/api/contracts", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const data = await storage.getContracts();
    res.json(data);
  });

  app.get("/api/contracts/:id", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const contract = await storage.getContract(req.params.id as string);
    if (!contract) return res.status(404).json({ message: "Contractul nu a fost gasit" });
    res.json(contract);
  });

  app.post("/api/contracts", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertContractSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const contract = await storage.createContract(parsed.data);
    res.json(contract);
  });

  app.patch("/api/contracts/:id", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getContract(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Contractul nu a fost gasit" });
    const parsed = insertContractSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const updated = await storage.updateContract(req.params.id as string, parsed.data);
    res.json(updated);
  });

  app.delete("/api/contracts/:id", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getContract(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Contractul nu a fost gasit" });
    await storage.deleteContract(req.params.id as string);
    res.json({ success: true });
  });

  // Contract Templates
  app.get("/api/contract-templates", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const data = await storage.getContractTemplates();
    res.json(data);
  });

  app.post("/api/contract-templates", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertContractTemplateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const template = await storage.createContractTemplate(parsed.data);
    res.json(template);
  });

  app.delete("/api/contract-templates/:id", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getContractTemplate(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Sablonul nu a fost gasit" });
    await storage.deleteContractTemplate(req.params.id as string);
    res.json({ success: true });
  });

  // Contract file upload
  app.post("/api/contracts/:id/upload", ...auth, requireRole("admin"), async (req: AuthenticatedRequest, res) => {
    const contract = await storage.getContract(req.params.id as string);
    if (!contract) return res.status(404).json({ message: "Contractul nu a fost gasit" });
    try {
      const multer = (await import("multer")).default;
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
      upload.single("file")(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "Eroare la incarcarea fisierului" });
        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: "Niciun fisier incarcat" });
        const { Client } = await import("@replit/object-storage");
        const client = new Client();
        const path = `.private/contracts/${contract.id}/${file.originalname}`;
        await client.uploadFromBytes(path, file.buffer);
        const updated = await storage.updateContract(contract.id, {
          documentPath: path,
          documentName: file.originalname,
        });
        res.json(updated);
      });
    } catch (error: any) {
      res.status(500).json({ message: "Eroare interna" });
    }
  });

  return httpServer;
}

async function getUserRolesInScope(req: AuthenticatedRequest) {
  const buildingIds = req.accessibleBuildingIds || [];
  const fedIds = req.accessibleFederationIds || [];

  const allRoles = await storage.getAllUserRoles();
  return allRoles.filter(r => {
    if (r.buildingId && buildingIds.includes(r.buildingId)) return true;
    if (r.federationId && fedIds.includes(r.federationId)) return true;
    return false;
  });
}
