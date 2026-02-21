import {
  type Building, type InsertBuilding,
  type Apartment, type InsertApartment,
  type Expense, type InsertExpense,
  type Payment, type InsertPayment,
  type Announcement, type InsertAnnouncement,
  type Federation, type InsertFederation,
  type Association, type InsertAssociation,
  type Staircase, type InsertStaircase,
  type UserRoleRecord, type InsertUserRole,
  type Document, type InsertDocument,
  type UnitRoom, type InsertUnitRoom,
  type Meter, type InsertMeter,
  type MeterReading, type InsertMeterReading,
  buildings, apartments, expenses, payments, announcements,
  federations, associations, staircases, userRoles, documents, unitRooms,
  meters, meterReadings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export interface IStorage {
  getFederations(): Promise<Federation[]>;
  getFederation(id: string): Promise<Federation | undefined>;
  createFederation(data: InsertFederation): Promise<Federation>;
  deleteFederation(id: string): Promise<void>;

  getAssociations(): Promise<Association[]>;
  getAssociationsByFederation(federationId: string): Promise<Association[]>;
  getAssociation(id: string): Promise<Association | undefined>;
  createAssociation(data: InsertAssociation): Promise<Association>;
  deleteAssociation(id: string): Promise<void>;

  getBuildings(): Promise<Building[]>;
  getBuildingsByIds(ids: string[]): Promise<Building[]>;
  getBuildingsByAssociation(associationId: string): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(data: InsertBuilding): Promise<Building>;
  deleteBuilding(id: string): Promise<void>;

  getStaircases(): Promise<Staircase[]>;
  getStaircasesByBuilding(buildingId: string): Promise<Staircase[]>;
  getStaircase(id: string): Promise<Staircase | undefined>;
  createStaircase(data: InsertStaircase): Promise<Staircase>;
  deleteStaircase(id: string): Promise<void>;

  getApartments(): Promise<Apartment[]>;
  getApartmentsByStaircase(staircaseId: string): Promise<Apartment[]>;
  getApartmentsByIds(ids: string[]): Promise<Apartment[]>;
  getApartmentsByStaircaseIds(staircaseIds: string[]): Promise<Apartment[]>;
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

  getUnitRoomsByApartment(apartmentId: string): Promise<UnitRoom[]>;
  createUnitRoom(data: InsertUnitRoom): Promise<UnitRoom>;
  deleteUnitRoom(id: string): Promise<void>;
  deleteUnitRoomsByApartment(apartmentId: string): Promise<void>;

  getMetersByApartment(apartmentId: string): Promise<Meter[]>;
  getMeter(id: string): Promise<Meter | undefined>;
  createMeter(data: InsertMeter): Promise<Meter>;
  updateMeter(id: string, data: Partial<InsertMeter>): Promise<Meter | undefined>;
  deleteMeter(id: string): Promise<void>;
  deactivateMeter(id: string): Promise<Meter | undefined>;

  getMeterReadings(meterId: string): Promise<MeterReading[]>;
  getMeterReading(id: string): Promise<MeterReading | undefined>;
  getLatestMeterReading(meterId: string): Promise<MeterReading | undefined>;
  createMeterReading(data: InsertMeterReading): Promise<MeterReading>;
  deleteMeterReading(id: string): Promise<void>;

  getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]>;
  getDocumentsByFloor(staircaseId: string, floorNumber: number): Promise<Document[]>;
  createDocument(data: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  getDocument(id: string): Promise<Document | undefined>;

  getRefListAll(table: PgTableWithColumns<any>): Promise<any[]>;
  createRefListItem(table: PgTableWithColumns<any>, data: any): Promise<any>;
  deleteRefListItem(table: PgTableWithColumns<any>, id: string): Promise<void>;
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

  async deleteFederation(id: string): Promise<void> {
    await db.delete(federations).where(eq(federations.id, id));
  }

  async getAssociations(): Promise<Association[]> {
    return db.select().from(associations);
  }

  async getAssociationsByFederation(federationId: string): Promise<Association[]> {
    return db.select().from(associations).where(eq(associations.federationId, federationId));
  }

  async getAssociation(id: string): Promise<Association | undefined> {
    const [association] = await db.select().from(associations).where(eq(associations.id, id));
    return association;
  }

  async createAssociation(data: InsertAssociation): Promise<Association> {
    const [association] = await db.insert(associations).values(data).returning();
    return association;
  }

  async deleteAssociation(id: string): Promise<void> {
    await db.delete(associations).where(eq(associations.id, id));
  }

  async getBuildings(): Promise<Building[]> {
    return db.select().from(buildings);
  }

  async getBuildingsByIds(ids: string[]): Promise<Building[]> {
    if (ids.length === 0) return [];
    return db.select().from(buildings).where(inArray(buildings.id, ids));
  }

  async getBuildingsByAssociation(associationId: string): Promise<Building[]> {
    return db.select().from(buildings).where(eq(buildings.associationId, associationId));
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    const [building] = await db.select().from(buildings).where(eq(buildings.id, id));
    return building;
  }

  async createBuilding(data: InsertBuilding): Promise<Building> {
    const [building] = await db.insert(buildings).values(data).returning();
    return building;
  }

  async deleteBuilding(id: string): Promise<void> {
    await db.delete(buildings).where(eq(buildings.id, id));
  }

  async getStaircases(): Promise<Staircase[]> {
    return db.select().from(staircases);
  }

  async getStaircasesByBuilding(buildingId: string): Promise<Staircase[]> {
    return db.select().from(staircases).where(eq(staircases.buildingId, buildingId));
  }

  async getStaircase(id: string): Promise<Staircase | undefined> {
    const [staircase] = await db.select().from(staircases).where(eq(staircases.id, id));
    return staircase;
  }

  async createStaircase(data: InsertStaircase): Promise<Staircase> {
    const [staircase] = await db.insert(staircases).values(data).returning();
    return staircase;
  }

  async deleteStaircase(id: string): Promise<void> {
    await db.delete(staircases).where(eq(staircases.id, id));
  }

  async getApartments(): Promise<Apartment[]> {
    return db.select().from(apartments);
  }

  async getApartmentsByStaircase(staircaseId: string): Promise<Apartment[]> {
    return db.select().from(apartments).where(eq(apartments.staircaseId, staircaseId));
  }

  async getApartmentsByIds(ids: string[]): Promise<Apartment[]> {
    if (ids.length === 0) return [];
    return db.select().from(apartments).where(inArray(apartments.id, ids));
  }

  async getApartmentsByStaircaseIds(staircaseIds: string[]): Promise<Apartment[]> {
    if (staircaseIds.length === 0) return [];
    return db.select().from(apartments).where(inArray(apartments.staircaseId, staircaseIds));
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

  async getUnitRoomsByApartment(apartmentId: string): Promise<UnitRoom[]> {
    return db.select().from(unitRooms).where(eq(unitRooms.apartmentId, apartmentId));
  }

  async createUnitRoom(data: InsertUnitRoom): Promise<UnitRoom> {
    const [room] = await db.insert(unitRooms).values(data).returning();
    return room;
  }

  async deleteUnitRoom(id: string): Promise<void> {
    await db.delete(unitRooms).where(eq(unitRooms.id, id));
  }

  async deleteUnitRoomsByApartment(apartmentId: string): Promise<void> {
    await db.delete(unitRooms).where(eq(unitRooms.apartmentId, apartmentId));
  }

  async getMetersByApartment(apartmentId: string): Promise<Meter[]> {
    return db.select().from(meters).where(eq(meters.apartmentId, apartmentId)).orderBy(desc(meters.createdAt));
  }

  async getMeter(id: string): Promise<Meter | undefined> {
    const [meter] = await db.select().from(meters).where(eq(meters.id, id));
    return meter;
  }

  async createMeter(data: InsertMeter): Promise<Meter> {
    const [meter] = await db.insert(meters).values(data).returning();
    return meter;
  }

  async updateMeter(id: string, data: Partial<InsertMeter>): Promise<Meter | undefined> {
    const [meter] = await db.update(meters).set(data).where(eq(meters.id, id)).returning();
    return meter;
  }

  async deleteMeter(id: string): Promise<void> {
    await db.delete(meters).where(eq(meters.id, id));
  }

  async deactivateMeter(id: string): Promise<Meter | undefined> {
    const [meter] = await db.update(meters).set({ isActive: false }).where(eq(meters.id, id)).returning();
    return meter;
  }

  async getMeterReading(id: string): Promise<MeterReading | undefined> {
    const [reading] = await db.select().from(meterReadings).where(eq(meterReadings.id, id));
    return reading;
  }

  async getMeterReadings(meterId: string): Promise<MeterReading[]> {
    return db.select().from(meterReadings).where(eq(meterReadings.meterId, meterId)).orderBy(desc(meterReadings.readingDate));
  }

  async getLatestMeterReading(meterId: string): Promise<MeterReading | undefined> {
    const [reading] = await db.select().from(meterReadings).where(eq(meterReadings.meterId, meterId)).orderBy(desc(meterReadings.readingDate)).limit(1);
    return reading;
  }

  async createMeterReading(data: InsertMeterReading): Promise<MeterReading> {
    const [reading] = await db.insert(meterReadings).values(data).returning();
    return reading;
  }

  async deleteMeterReading(id: string): Promise<void> {
    await db.delete(meterReadings).where(eq(meterReadings.id, id));
  }

  async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
    return db.select().from(documents).where(and(eq(documents.entityType, entityType), eq(documents.entityId, entityId))).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByFloor(staircaseId: string, floorNumber: number): Promise<Document[]> {
    return db.select().from(documents).where(and(eq(documents.entityType, "floor"), eq(documents.entityId, staircaseId), eq(documents.floorNumber, floorNumber))).orderBy(desc(documents.createdAt));
  }

  async createDocument(data: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(data).returning();
    return doc;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async getRefListAll(table: PgTableWithColumns<any>): Promise<any[]> {
    return db.select().from(table);
  }

  async createRefListItem(table: PgTableWithColumns<any>, data: any): Promise<any> {
    const [item] = await db.insert(table).values(data).returning();
    return item;
  }

  async deleteRefListItem(table: PgTableWithColumns<any>, id: string): Promise<void> {
    await db.delete(table).where(eq(table.id, id));
  }
}

export const storage = new DatabaseStorage();
