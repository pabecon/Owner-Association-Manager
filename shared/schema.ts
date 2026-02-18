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
  cotaDeTva: text("cota_de_tva").notNull(),
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
