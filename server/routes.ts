import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loadUserContext, requirePermission, requireRole, type AuthenticatedRequest } from "./middleware";
import type { RequestHandler } from "express";
import {
  insertBuildingSchema, insertApartmentSchema, insertExpenseSchema,
  insertPaymentSchema, insertAnnouncementSchema, insertUserRoleSchema,
  insertFederationSchema, ROLE_HIERARCHY, type UserRole,
} from "@shared/schema";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq, inArray } from "drizzle-orm";

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

  // Current user role info
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
    // Only show accessible federations
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
    if (parsed.data.federationId && !isInFederationScope(req, parsed.data.federationId)) {
      return res.status(403).json({ message: "Nu aveti acces la aceasta federatie" });
    }
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

  // Apartments
  app.get("/api/apartments", ...auth, async (req: AuthenticatedRequest, res) => {
    if (req.permissions?.viewAllApartments) {
      const data = await storage.getApartments();
      return res.json(data);
    }
    // Owner/tenant: show only assigned apartments
    const aptIds = req.accessibleApartmentIds || [];
    const buildingIds = req.accessibleBuildingIds || [];

    if (req.highestRole === "owner" || req.highestRole === "tenant") {
      if (aptIds.length > 0) {
        const data = await storage.getApartmentsByIds(aptIds);
        return res.json(data);
      }
      return res.json([]);
    }
    // Admin/manager: show by building
    if (buildingIds.length > 0) {
      const data = await storage.getApartmentsByBuildingIds(buildingIds);
      return res.json(data);
    }
    return res.json([]);
  });

  app.post("/api/apartments", ...auth, requirePermission("manageApartments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertApartmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    if (!isInBuildingScope(req, parsed.data.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const apartment = await storage.createApartment(parsed.data);
    res.json(apartment);
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
    // Get payments for accessible apartments
    const aptIds = req.accessibleApartmentIds || [];
    const buildingIds = req.accessibleBuildingIds || [];

    if (req.highestRole === "owner" || req.highestRole === "tenant") {
      if (aptIds.length > 0) {
        const data = await storage.getPaymentsByApartmentIds(aptIds);
        return res.json(data);
      }
      return res.json([]);
    }
    // Admin/manager: all payments in their buildings
    if (buildingIds.length > 0) {
      const allApts = await storage.getApartmentsByBuildingIds(buildingIds);
      const allAptIds = allApts.map(a => a.id);
      if (allAptIds.length > 0) {
        const data = await storage.getPaymentsByApartmentIds(allAptIds);
        return res.json(data);
      }
    }
    return res.json([]);
  });

  app.post("/api/payments", ...auth, requirePermission("managePayments"), async (req: AuthenticatedRequest, res) => {
    const parsed = insertPaymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const apt = await storage.getApartment(parsed.data.apartmentId);
    if (!apt) return res.status(404).json({ message: "Apartamentul nu a fost gasit" });
    if (!isInBuildingScope(req, apt.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
    }
    const payment = await storage.createPayment(parsed.data);
    res.json(payment);
  });

  app.patch("/api/payments/:id", ...auth, requirePermission("managePayments"), async (req: AuthenticatedRequest, res) => {
    const existing = await storage.getPaymentById(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Plata nu a fost gasita" });
    const apt = await storage.getApartment(existing.apartmentId);
    if (apt && !isInBuildingScope(req, apt.buildingId)) {
      return res.status(403).json({ message: "Nu aveti acces la acest bloc" });
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

    // Check permission hierarchy
    if (currentRole === "super_admin") {
      // Can assign any role
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

  // Search users by email (for assigning roles)
  app.get("/api/users/search", ...auth, async (req: AuthenticatedRequest, res) => {
    const email = req.query.email as string;
    if (!email) return res.json([]);
    const allUsers = await db.select().from(users);
    const filtered = allUsers.filter(u => u.email?.toLowerCase().includes(email.toLowerCase()));
    res.json(filtered.slice(0, 10));
  });

  // Reference Lists - Generic CRUD routes
  const { referenceListConfigs } = await import("./reference-lists");
  for (const [key, config] of Object.entries(referenceListConfigs)) {
    const basePath = `/api/liste/${key}`;

    app.get(basePath, ...auth, async (_req, res) => {
      const data = await storage.getRefListAll(config.table);
      res.json(data);
    });

    app.post(basePath, ...auth, requireRole("admin"), async (req, res) => {
      const parsed = config.insertSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: (parsed as any).error.message });
      const item = await storage.createRefListItem(config.table, (parsed as any).data);
      res.json(item);
    });

    app.delete(`${basePath}/:id`, ...auth, requireRole("admin"), async (req, res) => {
      await storage.deleteRefListItem(config.table, req.params.id as string);
      res.json({ ok: true });
    });
  }

  // Reference list config endpoint for frontend
  app.get("/api/liste-config", ...auth, async (_req, res) => {
    const { referenceListConfigs } = await import("./reference-lists");
    const configs = Object.entries(referenceListConfigs).map(([key, config]) => ({
      key: config.key,
      label: config.label,
      columns: config.columns,
    }));
    res.json(configs);
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
