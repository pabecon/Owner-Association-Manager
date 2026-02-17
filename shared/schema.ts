import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const roleEnum = ["super_admin", "admin", "manager", "owner", "tenant"] as const;
export type UserRole = typeof roleEnum[number];

export const federations = pgTable("federations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  federationId: varchar("federation_id").references(() => federations.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  totalApartments: integer("total_apartments").notNull(),
  floors: integer("floors").notNull(),
  adminName: text("admin_name").notNull(),
  adminPhone: text("admin_phone"),
  adminEmail: text("admin_email"),
});

export const apartments = pgTable("apartments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id),
  number: text("number").notNull(),
  floor: integer("floor").notNull(),
  surface: numeric("surface", { precision: 8, scale: 2 }),
  rooms: integer("rooms"),
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  residents: integer("residents").default(1),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  splitMethod: text("split_method").notNull().default("equal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apartmentId: varchar("apartment_id").notNull().references(() => apartments.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  paidDate: date("paid_date"),
  status: text("status").notNull().default("pending"),
  receiptNumber: text("receipt_number"),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(),
  federationId: varchar("federation_id").references(() => federations.id),
  buildingId: varchar("building_id").references(() => buildings.id),
  apartmentId: varchar("apartment_id").references(() => apartments.id),
  assignedBy: varchar("assigned_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFederationSchema = createInsertSchema(federations).omit({ id: true, createdAt: true });
export const insertBuildingSchema = createInsertSchema(buildings).omit({ id: true });
export const insertApartmentSchema = createInsertSchema(apartments).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ id: true, createdAt: true });

export type InsertFederation = z.infer<typeof insertFederationSchema>;
export type Federation = typeof federations.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Building = typeof buildings.$inferSelect;
export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type Apartment = typeof apartments.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRoleRecord = typeof userRoles.$inferSelect;

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Administrator",
  admin: "Administrator",
  manager: "Gestor",
  owner: "Proprietar",
  tenant: "Chirias",
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  admin: 4,
  manager: 3,
  owner: 2,
  tenant: 1,
};

export interface PermissionSet {
  viewDashboard: boolean;
  viewAllBuildings: boolean;
  viewAssignedBuildings: boolean;
  manageBuildings: boolean;
  viewAllApartments: boolean;
  viewAssignedApartments: boolean;
  manageApartments: boolean;
  viewAllExpenses: boolean;
  viewAssignedExpenses: boolean;
  manageExpenses: boolean;
  viewAllPayments: boolean;
  viewOwnPayments: boolean;
  managePayments: boolean;
  viewAllAnnouncements: boolean;
  viewAssignedAnnouncements: boolean;
  manageAnnouncements: boolean;
  manageUsers: boolean;
  manageManagers: boolean;
  manageTenants: boolean;
  viewUserManagement: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionSet> = {
  super_admin: {
    viewDashboard: true,
    viewAllBuildings: true,
    viewAssignedBuildings: true,
    manageBuildings: true,
    viewAllApartments: true,
    viewAssignedApartments: true,
    manageApartments: true,
    viewAllExpenses: true,
    viewAssignedExpenses: true,
    manageExpenses: true,
    viewAllPayments: true,
    viewOwnPayments: true,
    managePayments: true,
    viewAllAnnouncements: true,
    viewAssignedAnnouncements: true,
    manageAnnouncements: true,
    manageUsers: true,
    manageManagers: true,
    manageTenants: true,
    viewUserManagement: true,
  },
  admin: {
    viewDashboard: true,
    viewAllBuildings: false,
    viewAssignedBuildings: true,
    manageBuildings: true,
    viewAllApartments: false,
    viewAssignedApartments: true,
    manageApartments: true,
    viewAllExpenses: false,
    viewAssignedExpenses: true,
    manageExpenses: true,
    viewAllPayments: false,
    viewOwnPayments: true,
    managePayments: true,
    viewAllAnnouncements: false,
    viewAssignedAnnouncements: true,
    manageAnnouncements: true,
    manageUsers: false,
    manageManagers: true,
    manageTenants: true,
    viewUserManagement: true,
  },
  manager: {
    viewDashboard: true,
    viewAllBuildings: false,
    viewAssignedBuildings: true,
    manageBuildings: false,
    viewAllApartments: false,
    viewAssignedApartments: true,
    manageApartments: false,
    viewAllExpenses: false,
    viewAssignedExpenses: true,
    manageExpenses: true,
    viewAllPayments: false,
    viewOwnPayments: true,
    managePayments: true,
    viewAllAnnouncements: false,
    viewAssignedAnnouncements: true,
    manageAnnouncements: true,
    manageUsers: false,
    manageManagers: false,
    manageTenants: false,
    viewUserManagement: false,
  },
  owner: {
    viewDashboard: true,
    viewAllBuildings: false,
    viewAssignedBuildings: true,
    manageBuildings: false,
    viewAllApartments: false,
    viewAssignedApartments: true,
    manageApartments: false,
    viewAllExpenses: false,
    viewAssignedExpenses: true,
    manageExpenses: false,
    viewAllPayments: false,
    viewOwnPayments: true,
    managePayments: false,
    viewAllAnnouncements: false,
    viewAssignedAnnouncements: true,
    manageAnnouncements: false,
    manageUsers: false,
    manageManagers: false,
    manageTenants: true,
    viewUserManagement: false,
  },
  tenant: {
    viewDashboard: true,
    viewAllBuildings: false,
    viewAssignedBuildings: true,
    manageBuildings: false,
    viewAllApartments: false,
    viewAssignedApartments: true,
    manageApartments: false,
    viewAllExpenses: false,
    viewAssignedExpenses: true,
    manageExpenses: false,
    viewAllPayments: false,
    viewOwnPayments: true,
    managePayments: false,
    viewAllAnnouncements: false,
    viewAssignedAnnouncements: true,
    manageAnnouncements: false,
    manageUsers: false,
    manageManagers: false,
    manageTenants: false,
    viewUserManagement: false,
  },
};
