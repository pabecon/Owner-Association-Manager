import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const roleEnum = ["super_admin", "admin", "manager", "owner", "tenant"] as const;
export type UserRole = typeof roleEnum[number];

export const federations = pgTable("federations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  streetType: text("street_type"),
  streetName: text("street_name"),
  streetNumber: text("street_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  county: text("county"),
  sector: text("sector"),
  phone: text("phone"),
  email: text("email"),
  presidentName: text("president_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const associations = pgTable("associations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  federationId: varchar("federation_id").references(() => federations.id),
  name: text("name").notNull(),
  description: text("description"),
  cui: text("cui"),
  address: text("address"),
  streetType: text("street_type"),
  streetName: text("street_name"),
  streetNumber: text("street_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  county: text("county"),
  sector: text("sector"),
  presidentName: text("president_name"),
  presidentPhone: text("president_phone"),
  presidentEmail: text("president_email"),
  adminName: text("admin_name"),
  adminPhone: text("admin_phone"),
  adminEmail: text("admin_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  associationId: varchar("association_id").notNull().references(() => associations.id),
  name: text("name").notNull(),
  address: text("address"),
  totalApartments: integer("total_apartments"),
  floors: integer("floors"),
});

export const staircases = pgTable("staircases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id),
  name: text("name").notNull(),
  floors: integer("floors"),
  apartmentsPerFloor: integer("apartments_per_floor"),
  elevators: integer("elevators").default(0),
});

export const unitTypeEnum = ["apartment", "box", "parking"] as const;
export type UnitType = typeof unitTypeEnum[number];

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  apartment: "Apartament",
  box: "Box",
  parking: "Loc Parcare",
};

export const apartments = pgTable("apartments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staircaseId: varchar("staircase_id").notNull().references(() => staircases.id),
  unitType: text("unit_type").notNull().default("apartment"),
  number: text("number").notNull(),
  floor: integer("floor").notNull(),
  surface: numeric("surface", { precision: 8, scale: 2 }),
  builtSurface: numeric("built_surface", { precision: 8, scale: 2 }),
  rooms: integer("rooms"),
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  residents: integer("residents").default(1),
});

export const unitRooms = pgTable("unit_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apartmentId: varchar("apartment_id").notNull().references(() => apartments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  surface: numeric("surface", { precision: 8, scale: 2 }),
  terraceSurface: numeric("terrace_surface", { precision: 8, scale: 2 }),
  sortOrder: integer("sort_order").default(0),
});

export const meterTypeEnum = ["water", "electricity", "gas"] as const;
export type MeterType = typeof meterTypeEnum[number];

export const METER_TYPE_LABELS: Record<MeterType, string> = {
  water: "Apă",
  electricity: "Electricitate",
  gas: "Gaz",
};

export const meterScopeEnum = ["apartment", "association", "building", "staircase", "floor"] as const;
export type MeterScope = typeof meterScopeEnum[number];

export const METER_SCOPE_LABELS: Record<MeterScope, string> = {
  apartment: "Apartament",
  association: "Asociatie",
  building: "Bloc",
  staircase: "Scara",
  floor: "Etaj",
};

export const meterPlacementEnum = ["exterior", "interior"] as const;
export type MeterPlacement = typeof meterPlacementEnum[number];

export const METER_PLACEMENT_LABELS: Record<MeterPlacement, string> = {
  exterior: "Exterior",
  interior: "Interior",
};

export const meters = pgTable("meters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apartmentId: varchar("apartment_id").references(() => apartments.id, { onDelete: "cascade" }),
  associationId: varchar("association_id").references(() => associations.id, { onDelete: "cascade" }),
  buildingId: varchar("building_id").references(() => buildings.id, { onDelete: "cascade" }),
  staircaseId: varchar("staircase_id").references(() => staircases.id, { onDelete: "cascade" }),
  floor: integer("floor"),
  scopeType: text("scope_type").notNull().default("apartment"),
  meterType: text("meter_type").notNull(),
  placement: text("placement").default("interior"),
  serialNumber: text("serial_number").notNull(),
  meterNumber: text("meter_number").notNull(),
  chamberLocation: text("chamber_location"),
  installDate: date("install_date").notNull(),
  initialReading: numeric("initial_reading", { precision: 12, scale: 3 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readingTypeEnum = ["regularizat", "estimat"] as const;
export type ReadingType = typeof readingTypeEnum[number];

export const READING_TYPE_LABELS: Record<ReadingType, string> = {
  regularizat: "Regularizat",
  estimat: "Estimat",
};

export const meterReadings = pgTable("meter_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  meterId: varchar("meter_id").notNull().references(() => meters.id, { onDelete: "cascade" }),
  readingDate: date("reading_date").notNull(),
  readingValue: numeric("reading_value", { precision: 12, scale: 3 }).notNull(),
  consumption: numeric("consumption", { precision: 12, scale: 3 }),
  accumulatedConsumption: numeric("accumulated_consumption", { precision: 12, scale: 3 }),
  readingType: text("reading_type").notNull().default("regularizat"),
  readingPhotoPath: text("reading_photo_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const estimationModelEnum = ["model_1", "model_2", "model_3"] as const;
export type EstimationModel = typeof estimationModelEnum[number];

export const ESTIMATION_MODEL_LABELS: Record<EstimationModel, string> = {
  model_1: "Model 1 - Istoric individual (10+ citiri)",
  model_2: "Model 2 - Media apartamente similare",
  model_3: "Model 3 - Consum mediu pe tip apartament",
};

export const estimationConfigs = pgTable("estimation_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  associationId: varchar("association_id").notNull().references(() => associations.id, { onDelete: "cascade" }),
  meterType: text("meter_type").notNull(),
  modelType: text("model_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  percentIncrease: numeric("percent_increase", { precision: 5, scale: 2 }).default("0"),
  defaultDailyConsumption: numeric("default_daily_consumption", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
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

export const fundTypeEnum = ["intretinere", "rulment", "penalizari", "custom"] as const;
export type FundType = typeof fundTypeEnum[number];

export const FUND_TYPE_LABELS: Record<FundType, string> = {
  intretinere: "Fond de Intretinere",
  rulment: "Fond de Rulment",
  penalizari: "Fond de Penalizari",
  custom: "Fond Personalizat",
};

export const FUND_TYPE_DESCRIPTIONS: Record<FundType, string> = {
  intretinere: "Se alimenteaza din cheltuielile curente ale asociatiei: apa, energie, curatenie, securitate, administrare, ascensor, salarii etc.",
  rulment: "Contributie unica per proprietar, mentinuta ca rezerva pentru acoperirea dezechilibrelor de cash-flow.",
  penalizari: "Se alimenteaza din penalizarile aplicate proprietarilor pentru intarzieri la plata, servind la acoperirea penalizarilor catre furnizori.",
  custom: "Fond personalizat definit de asociatie.",
};

export const funds = pgTable("funds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  associationId: varchar("association_id").notNull().references(() => associations.id),
  name: text("name").notNull(),
  fundType: text("fund_type").notNull().default("custom"),
  description: text("description"),
  bankName: text("bank_name"),
  bankAccount: text("bank_account"),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }).default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fundCategories = pgTable("fund_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fundId: varchar("fund_id").notNull().references(() => funds.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  budgetAmount: numeric("budget_amount", { precision: 12, scale: 2 }),
  currentAmount: numeric("current_amount", { precision: 12, scale: 2 }).default("0"),
  sortOrder: integer("sort_order").default(0),
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

export const entityTypeEnum = ["federation", "association", "building", "staircase", "floor", "apartment"] as const;
export type EntityType = typeof entityTypeEnum[number];

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  floorNumber: integer("floor_number"),
  documentType: text("document_type"),
  documentDate: timestamp("document_date"),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  objectPath: text("object_path").notNull(),
  fileData: text("file_data"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const contractClientTypeEnum = ["federation", "association"] as const;
export type ContractClientType = typeof contractClientTypeEnum[number];

export const CONTRACT_CLIENT_TYPE_LABELS: Record<ContractClientType, string> = {
  federation: "Federatie",
  association: "Asociatie",
};

export const contractStatusEnum = ["draft", "active", "expired", "terminated"] as const;
export type ContractStatus = typeof contractStatusEnum[number];

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Ciorna",
  active: "Activ",
  expired: "Expirat",
  terminated: "Reziliat",
};

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serie: text("serie").notNull().default("AL"),
  numar: text("numar").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  clientType: text("client_type").notNull(),
  clientId: varchar("client_id").notNull(),
  prestatorName: text("prestator_name"),
  prestatorCui: text("prestator_cui"),
  prestatorAddress: text("prestator_address"),
  prestatorRegistruComert: text("prestator_registru_comert"),
  prestatorRepresentative: text("prestator_representative"),
  signingDate: date("signing_date"),
  startDate: date("start_date").notNull(),
  durationValue: integer("duration_value").notNull(),
  durationUnit: text("duration_unit").notNull(),
  endDate: date("end_date").notNull(),
  autoRenewalNoticeDays: integer("auto_renewal_notice_days"),
  numberOfUnits: integer("number_of_units"),
  pricePerUnit: numeric("price_per_unit", { precision: 12, scale: 2 }),
  totalMonthly: numeric("total_monthly", { precision: 12, scale: 2 }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RON"),
  invoiceDay: integer("invoice_day"),
  paymentTermDays: integer("payment_term_days"),
  jurisdiction: text("jurisdiction"),
  status: text("status").notNull().default("active"),
  documentPath: text("document_path"),
  documentName: text("document_name"),
  templateId: varchar("template_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contractTemplates = pgTable("contract_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  documentPath: text("document_path"),
  documentName: text("document_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contractChapterCatalog = pgTable("contract_chapter_catalog", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templateChapters = pgTable("template_chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => contractTemplates.id, { onDelete: "cascade" }),
  chapterCatalogId: varchar("chapter_catalog_id").references(() => contractChapterCatalog.id),
  customName: text("custom_name"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templateArticles = pgTable("template_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateChapterId: varchar("template_chapter_id").notNull().references(() => templateChapters.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proformaInvoices = pgTable("proforma_invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id"),
  invoiceNumber: integer("invoice_number").notNull(),
  month: integer("month"),
  year: integer("year"),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date"),
  numberOfUnits: integer("number_of_units"),
  pricePerUnit: numeric("price_per_unit", { precision: 12, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RON"),
  status: text("status").notNull().default("estimada"),
  associationId: varchar("association_id"),
  associationName: text("association_name"),
  prestatorName: text("prestator_name"),
  concept: text("concept"),
  isManual: boolean("is_manual").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  estimada: "Estimada",
  proforma: "Proforma",
  factura_final: "Factura Final",
  platita: "Platita",
  anulata: "Anulata",
};

export const PROFORMA_STATUS_LABELS = INVOICE_STATUS_LABELS;

export const insertContractSchema = createInsertSchema(contracts).omit({ id: true, createdAt: true });
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export const insertContractTemplateSchema = createInsertSchema(contractTemplates).omit({ id: true, createdAt: true });
export type InsertContractTemplate = z.infer<typeof insertContractTemplateSchema>;
export type ContractTemplate = typeof contractTemplates.$inferSelect;

export const insertChapterCatalogSchema = createInsertSchema(contractChapterCatalog).omit({ id: true, createdAt: true });
export type InsertChapterCatalog = z.infer<typeof insertChapterCatalogSchema>;
export type ChapterCatalog = typeof contractChapterCatalog.$inferSelect;

export const insertTemplateChapterSchema = createInsertSchema(templateChapters).omit({ id: true, createdAt: true });
export type InsertTemplateChapter = z.infer<typeof insertTemplateChapterSchema>;
export type TemplateChapter = typeof templateChapters.$inferSelect;

export const insertTemplateArticleSchema = createInsertSchema(templateArticles).omit({ id: true, createdAt: true });
export type InsertTemplateArticle = z.infer<typeof insertTemplateArticleSchema>;
export type TemplateArticle = typeof templateArticles.$inferSelect;

export const insertProformaInvoiceSchema = createInsertSchema(proformaInvoices).omit({ id: true, createdAt: true });
export type InsertProformaInvoice = z.infer<typeof insertProformaInvoiceSchema>;
export type ProformaInvoice = typeof proformaInvoices.$inferSelect;

export const insertFederationSchema = createInsertSchema(federations).omit({ id: true, createdAt: true });
export const insertAssociationSchema = createInsertSchema(associations).omit({ id: true, createdAt: true });
export const insertBuildingSchema = createInsertSchema(buildings).omit({ id: true });
export const insertStaircaseSchema = createInsertSchema(staircases).omit({ id: true });
export const insertApartmentSchema = createInsertSchema(apartments).omit({ id: true });
export const insertUnitRoomSchema = createInsertSchema(unitRooms).omit({ id: true });
export const insertMeterSchema = createInsertSchema(meters).omit({ id: true, createdAt: true });
export const insertMeterReadingSchema = createInsertSchema(meterReadings).omit({ id: true, createdAt: true });
export const insertEstimationConfigSchema = createInsertSchema(estimationConfigs).omit({ id: true, createdAt: true });
export const insertFundSchema = createInsertSchema(funds).omit({ id: true, createdAt: true });
export const insertFundCategorySchema = createInsertSchema(fundCategories).omit({ id: true, createdAt: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ id: true, createdAt: true });

export type InsertFederation = z.infer<typeof insertFederationSchema>;
export type Federation = typeof federations.$inferSelect;
export type InsertAssociation = z.infer<typeof insertAssociationSchema>;
export type Association = typeof associations.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Building = typeof buildings.$inferSelect;
export type InsertStaircase = z.infer<typeof insertStaircaseSchema>;
export type Staircase = typeof staircases.$inferSelect;
export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type Apartment = typeof apartments.$inferSelect;
export type InsertUnitRoom = z.infer<typeof insertUnitRoomSchema>;
export type UnitRoom = typeof unitRooms.$inferSelect;
export type InsertMeter = z.infer<typeof insertMeterSchema>;
export type Meter = typeof meters.$inferSelect;
export type InsertMeterReading = z.infer<typeof insertMeterReadingSchema>;
export type MeterReading = typeof meterReadings.$inferSelect;
export type InsertEstimationConfig = z.infer<typeof insertEstimationConfigSchema>;
export type EstimationConfig = typeof estimationConfigs.$inferSelect;
export type InsertFund = z.infer<typeof insertFundSchema>;
export type Fund = typeof funds.$inferSelect;
export type InsertFundCategory = z.infer<typeof insertFundCategorySchema>;
export type FundCategory = typeof fundCategories.$inferSelect;
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
  admin: "Gestor Super Admin",
  manager: "Administrator",
  owner: "Proprietar",
  tenant: "Chirias",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: "Acces absolut la toata platforma. Doar proprietarul platformei.",
  admin: "Creat de Super Admin. Drepturi configurabile la nivel de federatie/asociatie.",
  manager: "Administrator de federatie sau asociatie. Gestioneaza blocuri si scari.",
  owner: "Proprietar de imobil. Poate vedea datele proprii si crea chiriasi.",
  tenant: "Chirias. Acces doar la datele proprii, doar citire.",
};

export const ROLE_CREATED_BY: Record<UserRole, string> = {
  super_admin: "Sistem (unic)",
  admin: "Super Administrator",
  manager: "Super Admin / Gestor Super Admin",
  owner: "Super Admin / Gestor / Administrator",
  tenant: "Proprietar",
};

export const ROLE_SCOPE_LABELS: Record<UserRole, string> = {
  super_admin: "Platforma intreaga",
  admin: "Federatii / Asociatii atribuite",
  manager: "Federatii / Asociatii atribuite",
  owner: "Imobilul propriu",
  tenant: "Unitatea inchiriata",
};

export interface PermissionMatrixEntry {
  key: string;
  label: string;
  category: "hierarchy" | "financial" | "users" | "content" | "reports" | "documents";
  categoryLabel: string;
  roles: Record<UserRole, "full" | "scoped" | "own" | "none">;
}

export const PERMISSION_MATRIX: PermissionMatrixEntry[] = [
  { key: "create_federation", label: "Creare federatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "full", manager: "none", owner: "none", tenant: "none" } },
  { key: "edit_federation", label: "Editare federatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "none", owner: "none", tenant: "none" } },
  { key: "delete_federation", label: "Stergere federatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_association", label: "Creare asociatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "full", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_association", label: "Editare asociatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "delete_association", label: "Stergere asociatii", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_building", label: "Creare blocuri", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_building", label: "Editare blocuri", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "delete_building", label: "Stergere blocuri", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_staircase", label: "Creare scari", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_staircase", label: "Editare scari", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "delete_staircase", label: "Stergere scari", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_unit", label: "Creare unitati (apart./box/parcare)", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_unit", label: "Editare unitati", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "none" } },
  { key: "delete_unit", label: "Stergere unitati", category: "hierarchy", categoryLabel: "Ierarhie", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },

  { key: "view_all_expenses", label: "Vizualizare toate cheltuielile", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "view_own_expenses", label: "Vizualizare cheltuieli proprii", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "create_expense", label: "Creare cheltuieli", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_expense", label: "Editare cheltuieli", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "delete_expense", label: "Stergere cheltuieli", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "view_all_payments", label: "Vizualizare toate platile", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "view_own_payments", label: "Vizualizare plati proprii", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "register_payment", label: "Inregistrare plati", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_payment", label: "Editare/Confirmare plati", category: "financial", categoryLabel: "Financiar", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },

  { key: "create_gestor", label: "Creare Gestori Super Admin", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_admin", label: "Creare Administratori", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "full", manager: "none", owner: "none", tenant: "none" } },
  { key: "create_owner", label: "Creare Proprietari", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "create_tenant", label: "Creare Chiriasi", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "none" } },
  { key: "assign_roles", label: "Atribuire roluri", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "scoped", manager: "none", owner: "none", tenant: "none" } },
  { key: "remove_roles", label: "Revocare roluri", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "scoped", manager: "none", owner: "none", tenant: "none" } },
  { key: "view_user_list", label: "Vizualizare lista utilizatori", category: "users", categoryLabel: "Gestionare Utilizatori", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },

  { key: "create_announcement", label: "Creare anunturi", category: "content", categoryLabel: "Continut", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "edit_announcement", label: "Editare anunturi", category: "content", categoryLabel: "Continut", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "delete_announcement", label: "Stergere anunturi", category: "content", categoryLabel: "Continut", roles: { super_admin: "full", admin: "none", manager: "none", owner: "none", tenant: "none" } },
  { key: "view_announcements", label: "Vizualizare anunturi", category: "content", categoryLabel: "Continut", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },

  { key: "upload_documents", label: "Incarcare documente", category: "documents", categoryLabel: "Documente", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "none" } },
  { key: "view_documents", label: "Vizualizare documente", category: "documents", categoryLabel: "Documente", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "delete_documents", label: "Stergere documente", category: "documents", categoryLabel: "Documente", roles: { super_admin: "full", admin: "scoped", manager: "none", owner: "none", tenant: "none" } },
  { key: "manage_reference_lists", label: "Gestionare liste generale", category: "documents", categoryLabel: "Documente", roles: { super_admin: "full", admin: "full", manager: "none", owner: "none", tenant: "none" } },

  { key: "view_dashboard", label: "Vizualizare panou principal", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "view_explorer", label: "Explorator ierarhie", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "view_infographic", label: "Infografie arbore", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "view_financial_reports", label: "Rapoarte financiare complete", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "none", tenant: "none" } },
  { key: "view_own_financial", label: "Rapoarte financiare proprii", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "own" } },
  { key: "export_data", label: "Export date (CSV/PDF)", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "scoped", manager: "scoped", owner: "own", tenant: "none" } },
  { key: "view_permissions_matrix", label: "Vizualizare matrice permisiuni", category: "reports", categoryLabel: "Rapoarte / Vizualizare", roles: { super_admin: "full", admin: "full", manager: "none", owner: "none", tenant: "none" } },
];

export const appSettings = pgTable("app_settings", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const platformUserRoleEnum = ["owner", "tenant"] as const;
export type PlatformUserRole = typeof platformUserRoleEnum[number];

export const PLATFORM_USER_ROLE_LABELS: Record<PlatformUserRole, string> = {
  owner: "Proprietar",
  tenant: "Chirias",
};

export const platformUsers = pgTable("platform_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  userRole: text("user_role").notNull().default("owner"),
  associationId: varchar("association_id").references(() => associations.id),
  buildingId: varchar("building_id").references(() => buildings.id),
  staircaseId: varchar("staircase_id").references(() => staircases.id),
  apartmentId: varchar("apartment_id").references(() => apartments.id),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  deactivatedAt: timestamp("deactivated_at"),
});

export const userActivityLog = pgTable("user_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformUserId: varchar("platform_user_id").notNull().references(() => platformUsers.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  details: text("details"),
  performedBy: text("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlatformUserSchema = createInsertSchema(platformUsers).omit({ id: true, createdAt: true, deactivatedAt: true });
export type InsertPlatformUser = z.infer<typeof insertPlatformUserSchema>;
export type PlatformUser = typeof platformUsers.$inferSelect;

export const insertUserActivityLogSchema = createInsertSchema(userActivityLog).omit({ id: true, createdAt: true });
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type UserActivityLog = typeof userActivityLog.$inferSelect;

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

export const listaAtributeFiscale = pgTable("lista_atribute_fiscale", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  atributFiscal: text("atribut_fiscal").notNull(),
  explicatie: text("explicatie"),
});

export const listaBanca = pgTable("lista_banca", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tara: text("tara").notNull(),
  codBancarTara: text("cod_bancar_tara").notNull(),
  numeBanca: text("nume_banca").notNull(),
  swift: text("swift").notNull(),
  ibanCod: text("iban_cod").notNull(),
  telefon: text("telefon"),
});

export const listaBanciConturi = pgTable("lista_banci_conturi", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  idCont: text("id_cont").notNull(),
  numeCont: text("nume_cont").notNull(),
  banca: text("banca").notNull(),
  iban: text("iban").notNull(),
  titular: text("titular").notNull(),
  valuta: text("valuta").notNull(),
  tip: text("tip").notNull(),
  posesor: text("posesor").notNull(),
});

export const listaConexiuneBancare = pgTable("lista_conexiune_bancare", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  idConexiune: text("id_conexiune").notNull(),
  numeInstitutie: text("nume_institutie").notNull(),
  status: text("status").notNull(),
  provider: text("provider").notNull(),
  tipConexiune: text("tip_conexiune").notNull(),
  dataUltimulRefresh: text("data_ultimul_refresh"),
  expiraConsimtamant: text("expira_consimtamant"),
  autoRefresh: text("auto_refresh"),
  nrConturi: text("nr_conturi"),
  idUriConturi: text("id_uri_conturi"),
  mesajEroare: text("mesaj_eroare"),
});

export const listaConturiToshl = pgTable("lista_conturi_toshl", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  idCont: text("id_cont").notNull(),
  numeContToshl: text("nume_cont_toshl").notNull(),
  banca: text("banca").notNull(),
  iban: text("iban").notNull(),
  titular: text("titular").notNull(),
  tipCont: text("tip_cont").notNull(),
  posesor: text("posesor").notNull(),
  sold: text("sold"),
  valuta: text("valuta").notNull(),
  status: text("status").notNull(),
  tipContToshl: text("tip_cont_toshl"),
  ultimaActualizare: text("ultima_actualizare"),
  sursaDate: text("sursa_date"),
});

export const listaCotaTva = pgTable("lista_cota_tva", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  numeCota: text("nume_cota").notNull(),
  dataInceput: text("data_inceput"),
  dataSfarsit: text("data_sfarsit"),
  cotaDeTva: text("cota_de_tva").notNull(),
  categorii: text("categorii"),
});

export const listaCursValutarBnr = pgTable("lista_curs_valutar_bnr", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dataInceput: text("data_inceput").notNull(),
  dataSfarsit: text("data_sfarsit").notNull(),
  moneda: text("moneda").notNull(),
  curs: text("curs").notNull(),
});

export const listaOrasJudet = pgTable("lista_oras_judet", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tara: text("tara").notNull(),
  comuna: text("comuna").notNull(),
  oras: text("oras").notNull(),
  judet: text("judet").notNull(),
  concatenate: text("concatenate"),
  uid: text("uid"),
});

export const listaPrefixTelefon = pgTable("lista_prefix_telefon", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tara: text("tara").notNull(),
  prefix: text("prefix").notNull(),
});

export const listaSectorBucuresti = pgTable("lista_sector_bucuresti", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sector: text("sector").notNull(),
});

export const listaSerieCi = pgTable("lista_serie_ci", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  judet: text("judet").notNull(),
  serieCi: text("serie_ci").notNull(),
});

export const listaTari = pgTable("lista_tari", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tara: text("tara").notNull(),
});

export const listaTipDrumuri = pgTable("lista_tip_drumuri", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipDrum: text("tip_drum").notNull(),
});

export const listaTipFactura = pgTable("lista_tip_factura", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codTipFactura: text("cod_tip_factura").notNull(),
  tipFactura: text("tip_factura").notNull(),
});

export const listaTipMoneda = pgTable("lista_tip_moneda", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipMoneda: text("tip_moneda").notNull(),
});

export const listaTvaPartenerAnaf = pgTable("lista_tva_partener_anaf", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cui: text("cui").notNull(),
  dataInterogarii: text("data_interogarii"),
  denumirePartener: text("denumire_partener"),
  adresaPartener: text("adresa_partener"),
  nrRegistruComertului: text("nr_registru_comertului"),
  telefon: text("telefon"),
  fax: text("fax"),
  codPostal: text("cod_postal"),
  actAutorizare: text("act_autorizare"),
  stareInregistrare: text("stare_inregistrare"),
  dataInregistrare: text("data_inregistrare"),
  codCaen: text("cod_caen"),
  iban: text("iban"),
  statusRoEFactura: text("status_ro_e_factura"),
  organFiscalCompetent: text("organ_fiscal_competent"),
  formaDeProprietate: text("forma_de_proprietate"),
  formaOrganizare: text("forma_organizare"),
  formaJuridica: text("forma_juridica"),
  scpTva: text("scp_tva"),
  periodeTva: text("perioade_tva"),
  dataInceputScpTva: text("data_inceput_scp_tva"),
  dataSfarsitScpTva: text("data_sfarsit_scp_tva"),
  dataAnulariiImpScpTva: text("data_anularii_imp_scp_tva"),
  mesajScpTva: text("mesaj_scp_tva"),
  dataInceputTvaIncasare: text("data_inceput_tva_incasare"),
  dataSfarsitTvaIncasare: text("data_sfarsit_tva_incasare"),
  dataActualizareTvaIncasare: text("data_actualizare_tva_incasare"),
  dataPublicareTvaIncasare: text("data_publicare_tva_incasare"),
  tipActualizareTvaIncasare: text("tip_actualizare_tva_incasare"),
  statusTvaIncasare: text("status_tva_incasare"),
  dataInactivare: text("data_inactivare"),
  dataReactivare: text("data_reactivare"),
  dataPublicare: text("data_publicare"),
  dataRadiere: text("data_radiere"),
  statusInactivi: text("status_inactivi"),
  dataInceputSplitTva: text("data_inceput_split_tva"),
  dataAnulareSplitTva: text("data_anulare_split_tva"),
});

export const listaUnitateMasura = pgTable("lista_unitate_masura", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categorie: text("categorie"),
  singular: text("singular").notNull(),
  plural: text("plural").notNull(),
  simbol: text("simbol"),
});

export const listaTipCamera = pgTable("lista_tip_camera", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nume: text("nume").notNull(),
  descriere: text("descriere"),
});

export const listaTipImobil = pgTable("lista_tip_imobil", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nume: text("nume").notNull(),
  descriere: text("descriere"),
});

export const listaTipDocument = pgTable("lista_tip_document", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nume: text("nume").notNull(),
  descriere: text("descriere"),
});

export const insertListaAtributeFiscaleSchema = createInsertSchema(listaAtributeFiscale).omit({ id: true });
export const insertListaBancaSchema = createInsertSchema(listaBanca).omit({ id: true });
export const insertListaBanciConturiSchema = createInsertSchema(listaBanciConturi).omit({ id: true });
export const insertListaConexiuneBancareSchema = createInsertSchema(listaConexiuneBancare).omit({ id: true });
export const insertListaConturiToshlSchema = createInsertSchema(listaConturiToshl).omit({ id: true });
export const insertListaCotaTvaSchema = createInsertSchema(listaCotaTva).omit({ id: true });
export const insertListaCursValutarBnrSchema = createInsertSchema(listaCursValutarBnr).omit({ id: true });
export const insertListaOrasJudetSchema = createInsertSchema(listaOrasJudet).omit({ id: true });
export const insertListaPrefixTelefonSchema = createInsertSchema(listaPrefixTelefon).omit({ id: true });
export const insertListaSectorBucurestiSchema = createInsertSchema(listaSectorBucuresti).omit({ id: true });
export const insertListaSerieCiSchema = createInsertSchema(listaSerieCi).omit({ id: true });
export const insertListaTariSchema = createInsertSchema(listaTari).omit({ id: true });
export const insertListaTipDrumuriSchema = createInsertSchema(listaTipDrumuri).omit({ id: true });
export const insertListaTipFacturaSchema = createInsertSchema(listaTipFactura).omit({ id: true });
export const insertListaTipMonedaSchema = createInsertSchema(listaTipMoneda).omit({ id: true });
export const insertListaTvaPartenerAnafSchema = createInsertSchema(listaTvaPartenerAnaf).omit({ id: true });
export const insertListaUnitateMasuraSchema = createInsertSchema(listaUnitateMasura).omit({ id: true });
export const insertListaTipCameraSchema = createInsertSchema(listaTipCamera).omit({ id: true });
export const insertListaTipImobilSchema = createInsertSchema(listaTipImobil).omit({ id: true });
export const insertListaTipDocumentSchema = createInsertSchema(listaTipDocument).omit({ id: true });

export type InsertListaAtributeFiscale = z.infer<typeof insertListaAtributeFiscaleSchema>;
export type ListaAtributeFiscale = typeof listaAtributeFiscale.$inferSelect;
export type InsertListaBanca = z.infer<typeof insertListaBancaSchema>;
export type ListaBanca = typeof listaBanca.$inferSelect;
export type InsertListaBanciConturi = z.infer<typeof insertListaBanciConturiSchema>;
export type ListaBanciConturi = typeof listaBanciConturi.$inferSelect;
export type InsertListaConexiuneBancare = z.infer<typeof insertListaConexiuneBancareSchema>;
export type ListaConexiuneBancare = typeof listaConexiuneBancare.$inferSelect;
export type InsertListaConturiToshl = z.infer<typeof insertListaConturiToshlSchema>;
export type ListaConturiToshl = typeof listaConturiToshl.$inferSelect;
export type InsertListaCotaTva = z.infer<typeof insertListaCotaTvaSchema>;
export type ListaCotaTva = typeof listaCotaTva.$inferSelect;
export type InsertListaCursValutarBnr = z.infer<typeof insertListaCursValutarBnrSchema>;
export type ListaCursValutarBnr = typeof listaCursValutarBnr.$inferSelect;
export type InsertListaOrasJudet = z.infer<typeof insertListaOrasJudetSchema>;
export type ListaOrasJudet = typeof listaOrasJudet.$inferSelect;
export type InsertListaPrefixTelefon = z.infer<typeof insertListaPrefixTelefonSchema>;
export type ListaPrefixTelefon = typeof listaPrefixTelefon.$inferSelect;
export type InsertListaSectorBucuresti = z.infer<typeof insertListaSectorBucurestiSchema>;
export type ListaSectorBucuresti = typeof listaSectorBucuresti.$inferSelect;
export type InsertListaSerieCi = z.infer<typeof insertListaSerieCiSchema>;
export type ListaSerieCi = typeof listaSerieCi.$inferSelect;
export type InsertListaTari = z.infer<typeof insertListaTariSchema>;
export type ListaTari = typeof listaTari.$inferSelect;
export type InsertListaTipDrumuri = z.infer<typeof insertListaTipDrumuriSchema>;
export type ListaTipDrumuri = typeof listaTipDrumuri.$inferSelect;
export type InsertListaTipFactura = z.infer<typeof insertListaTipFacturaSchema>;
export type ListaTipFactura = typeof listaTipFactura.$inferSelect;
export type InsertListaTipMoneda = z.infer<typeof insertListaTipMonedaSchema>;
export type ListaTipMoneda = typeof listaTipMoneda.$inferSelect;
export type InsertListaTvaPartenerAnaf = z.infer<typeof insertListaTvaPartenerAnafSchema>;
export type ListaTvaPartenerAnaf = typeof listaTvaPartenerAnaf.$inferSelect;
export type InsertListaUnitateMasura = z.infer<typeof insertListaUnitateMasuraSchema>;
export type ListaUnitateMasura = typeof listaUnitateMasura.$inferSelect;
export type InsertListaTipCamera = z.infer<typeof insertListaTipCameraSchema>;
export type ListaTipCamera = typeof listaTipCamera.$inferSelect;
export type InsertListaTipImobil = z.infer<typeof insertListaTipImobilSchema>;
export type ListaTipImobil = typeof listaTipImobil.$inferSelect;
export type InsertListaTipDocument = z.infer<typeof insertListaTipDocumentSchema>;
export type ListaTipDocument = typeof listaTipDocument.$inferSelect;
