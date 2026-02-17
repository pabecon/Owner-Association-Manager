import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBuildingSchema, insertApartmentSchema, insertExpenseSchema, insertPaymentSchema, insertAnnouncementSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Buildings
  app.get("/api/buildings", async (_req, res) => {
    const data = await storage.getBuildings();
    res.json(data);
  });

  app.post("/api/buildings", async (req, res) => {
    const parsed = insertBuildingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const building = await storage.createBuilding(parsed.data);
    res.json(building);
  });

  // Apartments
  app.get("/api/apartments", async (_req, res) => {
    const data = await storage.getApartments();
    res.json(data);
  });

  app.post("/api/apartments", async (req, res) => {
    const parsed = insertApartmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const apartment = await storage.createApartment(parsed.data);
    res.json(apartment);
  });

  // Expenses
  app.get("/api/expenses", async (_req, res) => {
    const data = await storage.getExpenses();
    res.json(data);
  });

  app.post("/api/expenses", async (req, res) => {
    const parsed = insertExpenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const expense = await storage.createExpense(parsed.data);
    res.json(expense);
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    await storage.deleteExpense(req.params.id);
    res.json({ ok: true });
  });

  // Payments
  app.get("/api/payments", async (_req, res) => {
    const data = await storage.getPayments();
    res.json(data);
  });

  app.post("/api/payments", async (req, res) => {
    const parsed = insertPaymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const payment = await storage.createPayment(parsed.data);
    res.json(payment);
  });

  app.patch("/api/payments/:id", async (req, res) => {
    const { status, paidDate } = req.body;
    const updateData: Record<string, any> = {};
    if (status && (status === "paid" || status === "pending")) {
      updateData.status = status;
    }
    if (paidDate !== undefined) {
      updateData.paidDate = paidDate;
    }
    const payment = await storage.updatePayment(req.params.id, updateData);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  });

  // Announcements
  app.get("/api/announcements", async (_req, res) => {
    const data = await storage.getAnnouncements();
    res.json(data);
  });

  app.post("/api/announcements", async (req, res) => {
    const parsed = insertAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const announcement = await storage.createAnnouncement(parsed.data);
    res.json(announcement);
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    await storage.deleteAnnouncement(req.params.id);
    res.json({ ok: true });
  });

  return httpServer;
}
