import { db } from "./db";
import { buildings, apartments, expenses, payments, announcements, federations, associations, staircases, userRoles } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function seedDatabase() {
  const existingAdminRole = await db.select().from(userRoles)
    .where(and(eq(userRoles.userId, "default-admin"), eq(userRoles.role, "super_admin")));
  if (existingAdminRole.length === 0) {
    await db.insert(userRoles).values({
      userId: "default-admin",
      role: "super_admin",
    });
    console.log("Default super_admin role created.");
  }

  const existingBuildings = await db.select().from(buildings);
  if (existingBuildings.length > 0) return;

  console.log("Seeding database with initial data...");

  const [fed1] = await db.insert(federations).values({
    name: "Federatia Asociatiilor Sector 2",
    description: "Federatia asociatiilor de proprietari din Sectorul 2, Bucuresti",
    address: "Bd. Unirii nr. 10, Sector 2, Bucuresti",
    phone: "021 345 6789",
    email: "federatie.s2@email.ro",
    presidentName: "Ion Georgescu",
  }).returning();

  const [assoc1] = await db.insert(associations).values({
    federationId: fed1.id,
    name: "Asociatia Bloc A1-A3",
    description: "Asociatia de proprietari pentru blocurile A1, A2 si A3",
    cui: "RO12345678",
    address: "Str. Mihai Eminescu nr. 45, Sector 2, Bucuresti",
    presidentName: "Maria Ionescu",
    presidentPhone: "0721 345 678",
    presidentEmail: "maria.ionescu@email.ro",
    adminName: "Elena Popescu",
    adminPhone: "0732 111 222",
    adminEmail: "elena.popescu@email.ro",
  }).returning();

  const [assoc2] = await db.insert(associations).values({
    federationId: fed1.id,
    name: "Asociatia Bloc B1-B2",
    description: "Asociatia de proprietari pentru blocurile B1 si B2",
    cui: "RO87654321",
    address: "Bd. Unirii nr. 12, Sector 3, Bucuresti",
    presidentName: "Andrei Popescu",
    presidentPhone: "0732 456 789",
    presidentEmail: "andrei.popescu@email.ro",
    adminName: "Cristina Marin",
    adminPhone: "0743 222 333",
    adminEmail: "cristina.marin@email.ro",
  }).returning();

  const [assoc3] = await db.insert(associations).values({
    name: "Asociatia Independenta Rezidential",
    description: "Asociatie independenta, fara federatie",
    cui: "RO11223344",
    address: "Str. Libertatii nr. 5, Sector 4, Bucuresti",
    presidentName: "Stefan Voicu",
    presidentPhone: "0743 333 444",
    presidentEmail: "stefan.v@email.ro",
  }).returning();

  const [bloc1] = await db.insert(buildings).values({
    associationId: assoc1.id,
    name: "Bloc A1",
    address: "Str. Mihai Eminescu nr. 45, Sector 2, Bucuresti",
    totalApartments: 20,
    floors: 10,
  }).returning();

  const [bloc2] = await db.insert(buildings).values({
    associationId: assoc2.id,
    name: "Bloc B3",
    address: "Bd. Unirii nr. 12, Sector 3, Bucuresti",
    totalApartments: 16,
    floors: 8,
  }).returning();

  const [bloc3] = await db.insert(buildings).values({
    associationId: assoc3.id,
    name: "Bloc Rezidential C1",
    address: "Str. Libertatii nr. 5, Sector 4, Bucuresti",
    totalApartments: 12,
    floors: 4,
  }).returning();

  const [scaraA1] = await db.insert(staircases).values({
    buildingId: bloc1.id,
    name: "Scara A",
    floors: 10,
    apartmentsPerFloor: 2,
  }).returning();

  const [scaraB1] = await db.insert(staircases).values({
    buildingId: bloc1.id,
    name: "Scara B",
    floors: 10,
    apartmentsPerFloor: 2,
  }).returning();

  const [scaraA2] = await db.insert(staircases).values({
    buildingId: bloc2.id,
    name: "Scara 1",
    floors: 8,
    apartmentsPerFloor: 2,
  }).returning();

  const [scaraC1] = await db.insert(staircases).values({
    buildingId: bloc3.id,
    name: "Scara A",
    floors: 4,
    apartmentsPerFloor: 3,
  }).returning();

  const aptData = [
    { staircaseId: scaraA1.id, number: "1", floor: 0, surface: "45.50", rooms: 2, ownerName: "Ion Popescu", ownerPhone: "0745 123 456", ownerEmail: "ion.popescu@email.ro", residents: 2 },
    { staircaseId: scaraA1.id, number: "2", floor: 0, surface: "52.00", rooms: 2, ownerName: "Ana Georgescu", ownerPhone: "0756 234 567", ownerEmail: "ana.g@email.ro", residents: 3 },
    { staircaseId: scaraA1.id, number: "3", floor: 1, surface: "68.30", rooms: 3, ownerName: "Vasile Dumitrescu", ownerPhone: "0767 345 678", ownerEmail: null, residents: 4 },
    { staircaseId: scaraA1.id, number: "4", floor: 1, surface: "45.50", rooms: 2, ownerName: "Elena Stanescu", ownerPhone: "0778 456 789", ownerEmail: "elena.s@email.ro", residents: 1 },
    { staircaseId: scaraB1.id, number: "5", floor: 2, surface: "72.00", rooms: 3, ownerName: "Cristian Marinescu", ownerPhone: "0789 567 890", ownerEmail: null, residents: 5 },
    { staircaseId: scaraB1.id, number: "6", floor: 2, surface: "45.50", rooms: 2, ownerName: null, ownerPhone: null, ownerEmail: null, residents: 1 },
    { staircaseId: scaraA2.id, number: "1", floor: 0, surface: "55.00", rooms: 2, ownerName: "Mihai Radu", ownerPhone: "0721 111 222", ownerEmail: "mihai.r@email.ro", residents: 2 },
    { staircaseId: scaraA2.id, number: "2", floor: 0, surface: "60.00", rooms: 3, ownerName: "Gabriela Popa", ownerPhone: "0732 222 333", ownerEmail: null, residents: 3 },
    { staircaseId: scaraC1.id, number: "1", floor: 0, surface: "48.00", rooms: 2, ownerName: "Stefan Voicu", ownerPhone: "0743 333 444", ownerEmail: "stefan.v@email.ro", residents: 1 },
    { staircaseId: scaraC1.id, number: "2", floor: 1, surface: "75.00", rooms: 4, ownerName: "Laura Munteanu", ownerPhone: "0754 444 555", ownerEmail: "laura.m@email.ro", residents: 4 },
  ];

  const insertedApts = await db.insert(apartments).values(aptData).returning();

  const expenseData = [
    { buildingId: bloc1.id, category: "Apa", description: "Consum apa rece + calda", amount: "2450.00", month: "Ianuarie", year: 2026, splitMethod: "residents" },
    { buildingId: bloc1.id, category: "Gaze", description: "Incalzire centrala", amount: "4200.00", month: "Ianuarie", year: 2026, splitMethod: "surface" },
    { buildingId: bloc1.id, category: "Curatenie", description: "Servicii curatenie scara", amount: "800.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc2.id, category: "Apa", description: "Consum apa rece", amount: "1800.00", month: "Ianuarie", year: 2026, splitMethod: "residents" },
    { buildingId: bloc2.id, category: "Gunoi", description: "Ridicare gunoi menajer", amount: "400.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
  ];

  await db.insert(expenses).values(expenseData);

  const paymentData = [
    { apartmentId: insertedApts[0].id, amount: "350.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-15", status: "paid", receiptNumber: "CH-001" },
    { apartmentId: insertedApts[1].id, amount: "420.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-18", status: "paid", receiptNumber: "CH-002" },
    { apartmentId: insertedApts[2].id, amount: "510.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
    { apartmentId: insertedApts[6].id, amount: "320.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-12", status: "paid", receiptNumber: "CH-101" },
    { apartmentId: insertedApts[7].id, amount: "380.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
  ];

  await db.insert(payments).values(paymentData);

  const announcementData = [
    { buildingId: bloc1.id, title: "Sedinta Generala a Asociatiei", content: "Va invitam la sedinta generala a asociatiei de proprietari.", priority: "important" },
    { buildingId: bloc1.id, title: "Oprire apa calda", content: "Lucrari de mentenanta la instalatia de apa calda.", priority: "urgent" },
    { buildingId: bloc2.id, title: "Dezinsectie si deratizare", content: "Serviciul de dezinsectie va avea loc in 10 Martie.", priority: "important" },
  ];

  await db.insert(announcements).values(announcementData);

  console.log("Database seeded successfully!");
}
