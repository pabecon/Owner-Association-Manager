import {
  type Building, type InsertBuilding,
  type Apartment, type InsertApartment,
  type Expense, type InsertExpense,
  type Payment, type InsertPayment,
  type Announcement, type InsertAnnouncement,
  type Federation, type InsertFederation,
  type UserRoleRecord, type InsertUserRole,
  buildings, apartments, expenses, payments, announcements,
  federations, userRoles,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray } from "drizzle-orm";

export interface IStorage {
  getFederations(): Promise<Federation[]>;
  getFederation(id: string): Promise<Federation | undefined>;
  createFederation(data: InsertFederation): Promise<Federation>;

  getBuildings(): Promise<Building[]>;
  getBuildingsByIds(ids: string[]): Promise<Building[]>;
  getBuildingsByFederation(federationId: string): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(data: InsertBuilding): Promise<Building>;

  getApartments(): Promise<Apartment[]>;
  getApartmentsByBuilding(buildingId: string): Promise<Apartment[]>;
  getApartmentsByIds(ids: string[]): Promise<Apartment[]>;
  getApartmentsByBuildingIds(buildingIds: string[]): Promise<Apartment[]>;
  getApartment(id: string): Promise<Apartment | undefined>;
  createApartment(data: InsertApartment): Promise<Apartment>;

  getExpenses(): Promise<Expense[]>;
  getExpensesByBuildingIds(buildingIds: string[]): Promise<Expense[]>;
  getExpenseById(id: string): Promise<Expense | undefined>;
  createExpense(data: InsertExpense): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;

  getPayments(): Promise<Payment[]>;
  getPaymentsByApartmentIds(apartmentIds: string[]): Promise<Payment[]>;
  getPaymentById(id: string): Promise<Payment | undefined>;
  createPayment(data: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined>;

  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByBuildingIds(buildingIds: string[]): Promise<Announcement[]>;
  getAnnouncementById(id: string): Promise<Announcement | undefined>;
  createAnnouncement(data: InsertAnnouncement): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;

  getUserRoles(userId: string): Promise<UserRoleRecord[]>;
  getAllUserRoles(): Promise<UserRoleRecord[]>;
  getUserRolesByScope(scope: { federationId?: string; buildingId?: string }): Promise<UserRoleRecord[]>;
  createUserRole(data: InsertUserRole): Promise<UserRoleRecord>;
  deleteUserRole(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFederations(): Promise<Federation[]> {
    return db.select().from(federations);
  }

  async getFederation(id: string): Promise<Federation | undefined> {
    const [federation] = await db.select().from(federations).where(eq(federations.id, id));
    return federation;
  }

  async createFederation(data: InsertFederation): Promise<Federation> {
    const [federation] = await db.insert(federations).values(data).returning();
    return federation;
  }

  async getBuildings(): Promise<Building[]> {
    return db.select().from(buildings);
  }

  async getBuildingsByIds(ids: string[]): Promise<Building[]> {
    if (ids.length === 0) return [];
    return db.select().from(buildings).where(inArray(buildings.id, ids));
  }

  async getBuildingsByFederation(federationId: string): Promise<Building[]> {
    return db.select().from(buildings).where(eq(buildings.federationId, federationId));
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

  async getApartmentsByIds(ids: string[]): Promise<Apartment[]> {
    if (ids.length === 0) return [];
    return db.select().from(apartments).where(inArray(apartments.id, ids));
  }

  async getApartmentsByBuildingIds(buildingIds: string[]): Promise<Apartment[]> {
    if (buildingIds.length === 0) return [];
    return db.select().from(apartments).where(inArray(apartments.buildingId, buildingIds));
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

  async getExpensesByBuildingIds(buildingIds: string[]): Promise<Expense[]> {
    if (buildingIds.length === 0) return [];
    return db.select().from(expenses).where(inArray(expenses.buildingId, buildingIds)).orderBy(desc(expenses.createdAt));
  }

  async getExpenseById(id: string): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
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

  async getPaymentsByApartmentIds(apartmentIds: string[]): Promise<Payment[]> {
    if (apartmentIds.length === 0) return [];
    return db.select().from(payments).where(inArray(payments.apartmentId, apartmentIds)).orderBy(desc(payments.year));
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
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

  async getAnnouncementsByBuildingIds(buildingIds: string[]): Promise<Announcement[]> {
    if (buildingIds.length === 0) return [];
    return db.select().from(announcements).where(inArray(announcements.buildingId, buildingIds)).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementById(id: string): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async createAnnouncement(data: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(data).returning();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async getUserRoles(userId: string): Promise<UserRoleRecord[]> {
    return db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }

  async getAllUserRoles(): Promise<UserRoleRecord[]> {
    return db.select().from(userRoles);
  }

  async getUserRolesByScope(scope: { federationId?: string; buildingId?: string }): Promise<UserRoleRecord[]> {
    if (scope.federationId) {
      return db.select().from(userRoles).where(eq(userRoles.federationId, scope.federationId));
    }
    if (scope.buildingId) {
      return db.select().from(userRoles).where(eq(userRoles.buildingId, scope.buildingId));
    }
    return db.select().from(userRoles);
  }

  async createUserRole(data: InsertUserRole): Promise<UserRoleRecord> {
    const [role] = await db.insert(userRoles).values(data).returning();
    return role;
  }

  async deleteUserRole(id: string): Promise<void> {
    await db.delete(userRoles).where(eq(userRoles.id, id));
  }
}

export const storage = new DatabaseStorage();
