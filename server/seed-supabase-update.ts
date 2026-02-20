import { supabase } from "./supabase";
import * as fs from "fs";

const TOSHL_ACCOUNTS = [
  { id_cont: "4623116", nume_cont_toshl: "Current Account for SMEs (Hybrid) (4)", banca: "ING", iban: "RO51INGB0000999911542217", titular: "SOFICON INFRASTRUCTURA", tip_cont: "PRINCIPAL", posesor: "Filip Margareta", sold: "450.6", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-01-31 23:24:55 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4623115", nume_cont_toshl: "Current Account for SMEs (Hybrid) (3)", banca: "ING", iban: "RO14INGB0000999911075440", titular: "REAL INVEST MANAGEMENT", tip_cont: "PRINCIPAL", posesor: "Filip Margareta", sold: "12382.89", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-16 23:21:16 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4623111", nume_cont_toshl: "Current Account for SMEs (Hybrid) (2)", banca: "ING", iban: "RO60INGB0000999911039886", titular: "COBALEST", tip_cont: "PRINCIPAL", posesor: "Filip Margareta", sold: "181064.56", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-12 23:34:03 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4623103", nume_cont_toshl: "Current Account for SMEs (Hybrid) (1)", banca: "ING", iban: "RO57INGB0000999911011519", titular: "MASTERTRANSPORT", tip_cont: "PRINCIPAL", posesor: "Raul Berge Vega", sold: "3152.75", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-17 14:50:49 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4623102", nume_cont_toshl: "Current Account for SMEs (3)", banca: "ING", iban: "RO30INGB0000999911011520", titular: "MASTERTRANSPORT", tip_cont: "PRINCIPAL", posesor: "Raul Berge Vega", sold: "18.21", valuta: "EUR", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-01-30 10:18:58 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4622858", nume_cont_toshl: "Current Account for SMEs (2)", banca: "ING", iban: "RO32INGB0000999911008769", titular: "PABECON", tip_cont: "PRINCIPAL", posesor: "Filip Margareta", sold: "15.76", valuta: "EUR", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-01-29 12:44:35 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4622857", nume_cont_toshl: "Current Account for SMEs (Hybrid)", banca: "ING", iban: "RO32INGB0000999911008768", titular: "PABECON", tip_cont: "PRINCIPAL", posesor: "Raul Berge Vega", sold: "408256.11", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-17 14:50:53 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4622856", nume_cont_toshl: "Current Account for SMEs (1)", banca: "ING", iban: "RO16INGB0000999911371545", titular: "PABECON", tip_cont: "SECUNDAR", posesor: "Raul Berge Vega", sold: "1493.79", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-16 23:21:20 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4622855", nume_cont_toshl: "Current Account for SMEs", banca: "ING", iban: "RO21INGB0000999911008772", titular: "PABECON", tip_cont: "SECUNDAR", posesor: "Filip Margareta", sold: "2631.98", valuta: "RON", status: "connected", tip_cont_toshl: "depository", ultima_actualizare: "2026-02-05 23:24:32 UTC", sursa_date: "BigQuery Map" },
  { id_cont: "4622826", nume_cont_toshl: "Cash", banca: "Manual/Cash", iban: "N/A", titular: "N/A", tip_cont: "", posesor: "", sold: "", valuta: "", status: "", tip_cont_toshl: "", ultima_actualizare: "", sursa_date: "" },
];

async function seedToshlAccounts() {
  console.log("Seeding Toshl accounts into Supabase...");

  const { error: delError } = await supabase.from("lista_conturi_toshl").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) console.log("Clear toshl (may be empty):", delError.message);

  const { data, error } = await supabase.from("lista_conturi_toshl").insert(TOSHL_ACCOUNTS).select();
  if (error) {
    console.error("Error inserting Toshl accounts:", error.message);
  } else {
    console.log(`Inserted ${data?.length || 0} Toshl accounts.`);
  }
}

async function seedCompleteLocalities() {
  console.log("Seeding complete Romanian localities (cities + communes) into Supabase...");

  const { error: delError } = await supabase.from("lista_oras_judet").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) console.log("Clear localities (may be empty):", delError.message);

  const rawData = fs.readFileSync("/tmp/all-localities.json", "utf8");
  const rows: any[] = JSON.parse(rawData);

  console.log(`Total localities to insert: ${rows.length}`);

  const batchSize = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.from("lista_oras_judet").insert(batch).select();
    if (error) {
      console.error(`Error inserting batch ${i}:`, error.message);
    } else {
      inserted += (data?.length || 0);
    }
  }
  console.log(`Inserted ${inserted} localities (cities + communes).`);
}

async function main() {
  console.log("=== Updating Supabase Reference Lists ===\n");
  await seedToshlAccounts();
  console.log("");
  await seedCompleteLocalities();
  console.log("\n=== Update Complete ===");
}

main().catch(console.error);
