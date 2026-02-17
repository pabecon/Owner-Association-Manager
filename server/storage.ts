import {
  type Building, type InsertBuilding,
  type Apartment, type InsertApartment,
  type Expense, type InsertExpense,
  type Payment, type InsertPayment,
  type Announcement, type InsertAnnouncement,
  buildings, apartments, expenses, payments, announcements,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getBuildings(): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(data: InsertBuilding): Promise<Building>;

  getApartments(): Promise<Apartment[]>;
  getApartmentsByBuilding(buildingId: string): Promise<Apartment[]>;
  getApartment(id: string): Promise<Apartment | undefined>;
  createApartment(data: InsertApartment): Promise<Apartment>;

  getExpenses(): Promise<Expense[]>;
  getExpensesByBuilding(buildingId: string): Promise<Expense[]>;
  createExpense(data: InsertExpense): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;

  getPayments(): Promise<Payment[]>;
  getPaymentsByApartment(apartmentId: string): Promise<Payment[]>;
  createPayment(data: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined>;

  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByBuilding(buildingId: string): Promise<Announcement[]>;
  createAnnouncement(data: InsertAnnouncement): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getBuildings(): Promise<Building[]> {
    return db.select().from(buildings);
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    const [building] = await db.select().from(buildings).where(eq(buildings.id, id));
    return building;
  }

  async createBuilding(data: InsertBuilding): Promise<Building> {
    const [building] = await db.insert(buildings).values(data).returning();
    return building;
  }

  async getApartments(): Promise<Apartment[]> {
    return db.select().from(apartments);
  }

  async getApartmentsByBuilding(buildingId: string): Promise<Apartment[]> {
    return db.select().from(apartments).where(eq(apartments.buildingId, buildingId));
  }

  async getApartment(id: string): Promise<Apartment | undefined> {
    const [apartment] = await db.select().from(apartments).where(eq(apartments.id, id));
    return apartment;
  }

  async createApartment(data: InsertApartment): Promise<Apartment> {
    const [apartment] = await db.insert(apartments).values(data).returning();
    return apartment;
  }

  async getExpenses(): Promise<Expense[]> {
    return db.select().from(expenses).orderBy(desc(expenses.createdAt));
  }

  async getExpensesByBuilding(buildingId: string): Promise<Expense[]> {
    return db.select().from(expenses).where(eq(expenses.buildingId, buildingId)).orderBy(desc(expenses.createdAt));
  }

  async createExpense(data: InsertExpense): Promise<Expense> {
    const [expense] = await db.insert(expenses).values(data).returning();
    return expense;
  }

  async deleteExpense(id: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async getPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.year));
  }

  async getPaymentsByApartment(apartmentId: string): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.apartmentId, apartmentId));
  }

  async createPayment(data: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(data).returning();
    return payment;
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return payment;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementsByBuilding(buildingId: string): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.buildingId, buildingId)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(data: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(data).returning();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }
}

export const storage = new DatabaseStorage();
