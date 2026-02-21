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
  ROLE_HIERARCHY, type UserRole,
} from "@shared/schema";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq, inArray } from "drizzle-orm";
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
    const apt = await storage.getApartment(parsed.data.apartmentId);
    if (!apt) return res.status(404).json({ message: "Unitatea nu a fost gasita" });
    const staircase = await storage.getStaircase(apt.staircaseId);
    if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const meter = await storage.createMeter(parsed.data);
    res.json(meter);
  });

  app.patch("/api/meters/:id", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const meter = await storage.getMeter(req.params.id as string);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    const apt = await storage.getApartment(meter.apartmentId);
    if (apt) {
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
        if (!isInApartmentScope(req, apt.id)) {
          return res.status(403).json({ message: "Nu aveti acces" });
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
    const apt = await storage.getApartment(meter.apartmentId);
    if (apt) {
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
        if (!isInApartmentScope(req, apt.id)) {
          return res.status(403).json({ message: "Nu aveti acces" });
        }
      }
    }
    await storage.deleteMeter(req.params.id as string);
    res.json({ ok: true });
  });

  // Meter Readings
  app.get("/api/meter-readings/:meterId", ...auth, async (req: AuthenticatedRequest, res) => {
    const meter = await storage.getMeter(req.params.meterId as string);
    if (!meter) return res.status(404).json({ message: "Contorul nu a fost gasit" });
    const apt = await storage.getApartment(meter.apartmentId);
    if (apt) {
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (!staircase || !isInBuildingScope(req, staircase.buildingId)) {
        if (!isInApartmentScope(req, apt.id)) {
          return res.status(403).json({ message: "Nu aveti acces" });
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
    const apt = await storage.getApartment(meter.apartmentId);
    if (apt) {
      const staircase = await storage.getStaircase(apt.staircaseId);
      if (staircase && !isInBuildingScope(req, staircase.buildingId)) {
        return res.status(403).json({ message: "Nu aveti acces" });
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
    if (meter) {
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
