import { db } from "./db";
import { buildings, apartments, expenses, payments, announcements, federations } from "@shared/schema";

export async function seedDatabase() {
  const existingBuildings = await db.select().from(buildings);
  if (existingBuildings.length > 0) return;

  console.log("Seeding database with initial data...");

  const [fed1] = await db.insert(federations).values({
    name: "Federatia Asociatiilor Sector 2",
    description: "Federatia asociatiilor de proprietari din Sectorul 2, Bucuresti",
  }).returning();

  const [bloc1] = await db.insert(buildings).values({
    federationId: fed1.id,
    name: "Bloc A1",
    address: "Str. Mihai Eminescu nr. 45, Sector 2, Bucuresti",
    totalApartments: 20,
    floors: 10,
    adminName: "Maria Ionescu",
    adminPhone: "0721 345 678",
    adminEmail: "maria.ionescu@email.ro",
  }).returning();

  const [bloc2] = await db.insert(buildings).values({
    federationId: fed1.id,
    name: "Bloc B3",
    address: "Bd. Unirii nr. 12, Sector 3, Bucuresti",
    totalApartments: 16,
    floors: 8,
    adminName: "Andrei Popescu",
    adminPhone: "0732 456 789",
    adminEmail: "andrei.popescu@email.ro",
  }).returning();

  const aptData = [
    { buildingId: bloc1.id, number: "1", floor: 0, surface: "45.50", rooms: 2, ownerName: "Ion Popescu", ownerPhone: "0745 123 456", ownerEmail: "ion.popescu@email.ro", residents: 2 },
    { buildingId: bloc1.id, number: "2", floor: 0, surface: "52.00", rooms: 2, ownerName: "Ana Georgescu", ownerPhone: "0756 234 567", ownerEmail: "ana.g@email.ro", residents: 3 },
    { buildingId: bloc1.id, number: "3", floor: 1, surface: "68.30", rooms: 3, ownerName: "Vasile Dumitrescu", ownerPhone: "0767 345 678", ownerEmail: null, residents: 4 },
    { buildingId: bloc1.id, number: "4", floor: 1, surface: "45.50", rooms: 2, ownerName: "Elena Stanescu", ownerPhone: "0778 456 789", ownerEmail: "elena.s@email.ro", residents: 1 },
    { buildingId: bloc1.id, number: "5", floor: 2, surface: "72.00", rooms: 3, ownerName: "Cristian Marinescu", ownerPhone: "0789 567 890", ownerEmail: null, residents: 5 },
    { buildingId: bloc1.id, number: "6", floor: 2, surface: "45.50", rooms: 2, ownerName: null, ownerPhone: null, ownerEmail: null, residents: 1 },
    { buildingId: bloc2.id, number: "1", floor: 0, surface: "55.00", rooms: 2, ownerName: "Mihai Radu", ownerPhone: "0721 111 222", ownerEmail: "mihai.r@email.ro", residents: 2 },
    { buildingId: bloc2.id, number: "2", floor: 0, surface: "60.00", rooms: 3, ownerName: "Gabriela Popa", ownerPhone: "0732 222 333", ownerEmail: null, residents: 3 },
    { buildingId: bloc2.id, number: "3", floor: 1, surface: "48.00", rooms: 2, ownerName: "Stefan Voicu", ownerPhone: "0743 333 444", ownerEmail: "stefan.v@email.ro", residents: 1 },
    { buildingId: bloc2.id, number: "4", floor: 1, surface: "75.00", rooms: 4, ownerName: "Laura Munteanu", ownerPhone: "0754 444 555", ownerEmail: "laura.m@email.ro", residents: 4 },
  ];

  const insertedApts = await db.insert(apartments).values(aptData).returning();

  const expenseData = [
    { buildingId: bloc1.id, category: "Apa", description: "Consum apa rece + calda", amount: "2450.00", month: "Ianuarie", year: 2026, splitMethod: "residents" },
    { buildingId: bloc1.id, category: "Gaze", description: "Incalzire centrala", amount: "4200.00", month: "Ianuarie", year: 2026, splitMethod: "surface" },
    { buildingId: bloc1.id, category: "Curatenie", description: "Servicii curatenie scara", amount: "800.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc1.id, category: "Iluminat", description: "Energie electrica parti comune", amount: "350.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc1.id, category: "Lift", description: "Mentenanta lift", amount: "600.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc1.id, category: "Fond Rulment", description: "Fond rulment lunar", amount: "1200.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc1.id, category: "Reparatii", description: "Reparatie conducta subsol", amount: "1500.00", month: "Februarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc2.id, category: "Apa", description: "Consum apa rece", amount: "1800.00", month: "Ianuarie", year: 2026, splitMethod: "residents" },
    { buildingId: bloc2.id, category: "Gunoi", description: "Ridicare gunoi menajer", amount: "400.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
    { buildingId: bloc2.id, category: "Curatenie", description: "Curatenie casa scarii", amount: "650.00", month: "Ianuarie", year: 2026, splitMethod: "equal" },
  ];

  await db.insert(expenses).values(expenseData);

  const paymentData = [
    { apartmentId: insertedApts[0].id, amount: "350.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-15", status: "paid", receiptNumber: "CH-001" },
    { apartmentId: insertedApts[1].id, amount: "420.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-18", status: "paid", receiptNumber: "CH-002" },
    { apartmentId: insertedApts[2].id, amount: "510.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
    { apartmentId: insertedApts[3].id, amount: "280.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-20", status: "paid", receiptNumber: "CH-003" },
    { apartmentId: insertedApts[4].id, amount: "580.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
    { apartmentId: insertedApts[6].id, amount: "320.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-12", status: "paid", receiptNumber: "CH-101" },
    { apartmentId: insertedApts[7].id, amount: "380.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
    { apartmentId: insertedApts[8].id, amount: "250.00", month: "Ianuarie", year: 2026, paidDate: "2026-01-22", status: "paid", receiptNumber: "CH-102" },
    { apartmentId: insertedApts[9].id, amount: "490.00", month: "Ianuarie", year: 2026, paidDate: null, status: "pending", receiptNumber: null },
  ];

  await db.insert(payments).values(paymentData);

  const announcementData = [
    { buildingId: bloc1.id, title: "Sedinta Generala a Asociatiei", content: "Va invitam la sedinta generala a asociatiei de proprietari care va avea loc in data de 15 Martie 2026, ora 18:00, in holul blocului. Ordinea de zi: aprobarea bugetului, alegerea comitetului si discutarea lucrarilor de renovare.", priority: "important" },
    { buildingId: bloc1.id, title: "Oprire apa calda - lucrari de mentenanta", content: "Va informam ca in data de 25 Februarie 2026, intre orele 08:00 - 16:00, se vor efectua lucrari de mentenanta la instalatia de apa calda. Va rugam sa va aprovizionati cu apa.", priority: "urgent" },
    { buildingId: bloc1.id, title: "Program curatenie scara", content: "Noul program de curatenie a scarii va incepe din luna Martie. Curatenia se va efectua in fiecare zi de Luni si Joi.", priority: "normal" },
    { buildingId: bloc2.id, title: "Dezinsectie si deratizare", content: "Serviciul de dezinsectie si deratizare va avea loc in data de 10 Martie 2026. Va rugam sa asigurati accesul in apartamente.", priority: "important" },
  ];

  await db.insert(announcements).values(announcementData);

  console.log("Database seeded successfully!");
}
