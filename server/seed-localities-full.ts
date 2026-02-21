import { supabase } from "./supabase";
import * as fs from "fs";

async function main() {
  console.log("=== Replacing lista_oras_judet with full dataset ===\n");

  const raw: any[] = JSON.parse(fs.readFileSync("/tmp/localities-full.json", "utf8"));
  const rows = raw.map(r => ({
    tara: (r.tara || "").trim(),
    comuna: (r.comuna || "").trim(),
    oras: (r.oras || "").trim(),
    judet: (r.judet || "").trim(),
    concatenate: (r.concatenate || "").trim(),
    uid: (r.uid || "").replace(/\r/g, "").trim(),
  }));
  console.log(`Parsed ${rows.length} localities from file.`);

  console.log("Deleting all existing rows...");
  let deleted = 0;
  while (true) {
    const { data, error } = await supabase
      .from("lista_oras_judet")
      .select("id")
      .limit(1000);
    if (error) { console.error("Error fetching for delete:", error.message); break; }
    if (!data || data.length === 0) break;
    const ids = data.map((r: any) => r.id);
    const { error: delErr } = await supabase
      .from("lista_oras_judet")
      .delete()
      .in("id", ids);
    if (delErr) { console.error("Error deleting:", delErr.message); break; }
    deleted += ids.length;
    console.log(`  Deleted ${deleted} rows so far...`);
  }
  console.log(`Total deleted: ${deleted}\n`);

  console.log("Inserting new data...");
  const batchSize = 100;
  let inserted = 0;
  let errors = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.from("lista_oras_judet").insert(batch).select("id");
    if (error) {
      console.error(`Error inserting batch ${i}-${i + batch.length}:`, error.message);
      errors++;
    } else {
      inserted += (data?.length || 0);
    }
    if ((i + batchSize) % 2000 === 0 || i + batchSize >= rows.length) {
      console.log(`  Progress: ${Math.min(i + batchSize, rows.length)}/${rows.length} (inserted: ${inserted})`);
    }
  }
  console.log(`\nInserted: ${inserted}`);
  console.log(`Errors: ${errors}`);
  console.log("=== Complete ===");
}

main().catch(console.error);
