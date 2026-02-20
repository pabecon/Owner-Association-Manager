import { supabase } from "./supabase";

const COTA_TVA = [
  { cota_de_tva: "0.19" },
  { cota_de_tva: "0.0" },
  { cota_de_tva: "0.24" },
  { cota_de_tva: "0.21" },
];

const PREFIX_TELEFON = [
  { tara: "GRECIA", prefix: "30" },
  { tara: "OLANDA/TARILE DE JOS", prefix: "31" },
  { tara: "BELGIA", prefix: "32" },
  { tara: "FRANTA", prefix: "33" },
  { tara: "SPANIA", prefix: "34" },
  { tara: "PORTUGALIA", prefix: "351" },
  { tara: "LUXEMBURG", prefix: "352" },
  { tara: "IRLANDA", prefix: "353" },
  { tara: "ISLANDA", prefix: "354" },
  { tara: "ALBANIA", prefix: "355" },
  { tara: "MALTA", prefix: "356" },
  { tara: "CIPRU", prefix: "357" },
  { tara: "FINLANDA", prefix: "358" },
  { tara: "BULGARIA", prefix: "359" },
  { tara: "UNGARIA", prefix: "36" },
  { tara: "LITUANIA", prefix: "370" },
  { tara: "LETONIA", prefix: "371" },
  { tara: "ESTONIA", prefix: "372" },
  { tara: "REP. MOLDOVA", prefix: "373" },
  { tara: "BELARUS", prefix: "375" },
  { tara: "ANDORRA", prefix: "376" },
  { tara: "MONACO", prefix: "377" },
  { tara: "SAN MARINO", prefix: "378" },
  { tara: "UCRAINA", prefix: "380" },
  { tara: "SERBIA", prefix: "381" },
  { tara: "MUNTENEGRU", prefix: "382" },
  { tara: "KOSOVO", prefix: "383" },
  { tara: "CROATIA", prefix: "385" },
  { tara: "SLOVENIA", prefix: "386" },
  { tara: "BOSNIA SI HERTEGOVINA", prefix: "387" },
  { tara: "MACEDONIA DE NORD", prefix: "389" },
  { tara: "ITALIA", prefix: "39" },
  { tara: "ROMANIA", prefix: "40" },
  { tara: "LIECHTENSTEIN", prefix: "41" },
  { tara: "ELVETIA", prefix: "41" },
  { tara: "CEHIA", prefix: "420" },
  { tara: "SLOVACIA", prefix: "421" },
  { tara: "AUSTRIA", prefix: "43" },
  { tara: "MAREA BRITANIE", prefix: "44" },
  { tara: "DANEMARCA", prefix: "45" },
  { tara: "SUEDIA", prefix: "46" },
  { tara: "NORVEGIA", prefix: "47" },
  { tara: "POLONIA", prefix: "48" },
  { tara: "GERMANIA", prefix: "49" },
  { tara: "RUSIA", prefix: "7" },
  { tara: "TURCIA", prefix: "90" },
];

const SECTOR_BUCURESTI = [
  { sector: "Sector 1" },
  { sector: "Sector 2" },
  { sector: "Sector 3" },
  { sector: "Sector 4" },
  { sector: "Sector 5" },
  { sector: "Sector 6" },
];

const SERIE_CI = [
  { judet: "Alba", serie_ci: "AX" },
  { judet: "Arad", serie_ci: "AR" },
  { judet: "Arad", serie_ci: "ZR" },
  { judet: "Arges", serie_ci: "AZ" },
  { judet: "Arges", serie_ci: "AS" },
  { judet: "Bacau", serie_ci: "XC" },
  { judet: "Bacau", serie_ci: "ZC" },
  { judet: "Bihor", serie_ci: "ZH" },
  { judet: "Bihor", serie_ci: "XH" },
  { judet: "Bistrita-Nasaud", serie_ci: "XB" },
  { judet: "Botosani", serie_ci: "XT" },
  { judet: "Braila", serie_ci: "XR" },
  { judet: "Brasov", serie_ci: "BV" },
  { judet: "Brasov", serie_ci: "ZV" },
  { judet: "Bucuresti", serie_ci: "RX" },
  { judet: "Bucuresti", serie_ci: "RD" },
  { judet: "Bucuresti", serie_ci: "DR" },
  { judet: "Bucuresti", serie_ci: "DT" },
  { judet: "Bucuresti", serie_ci: "DP" },
  { judet: "Bucuresti", serie_ci: "RK" },
  { judet: "Bucuresti", serie_ci: "RT" },
  { judet: "Bucuresti", serie_ci: "RZ" },
  { judet: "Bucuresti", serie_ci: "RR" },
  { judet: "Bucuresti", serie_ci: "DX" },
  { judet: "Buzau", serie_ci: "XZ" },
  { judet: "Buzau", serie_ci: "ZB" },
  { judet: "Calarasi", serie_ci: "KL" },
  { judet: "Caras-Severin", serie_ci: "KS" },
  { judet: "Cluj", serie_ci: "KX" },
  { judet: "Cluj", serie_ci: "CJ" },
  { judet: "Constanta", serie_ci: "KZ" },
  { judet: "Constanta", serie_ci: "KT" },
  { judet: "Covasna", serie_ci: "KV" },
  { judet: "Dambovita", serie_ci: "ZD" },
  { judet: "Dambovita", serie_ci: "DD" },
  { judet: "Dolj", serie_ci: "DX" },
  { judet: "Dolj", serie_ci: "DZ" },
  { judet: "Galati", serie_ci: "ZL" },
  { judet: "Galati", serie_ci: "GL" },
  { judet: "Giurgiu", serie_ci: "GG" },
  { judet: "Gorj", serie_ci: "GZ" },
  { judet: "Harghita", serie_ci: "HR" },
  { judet: "Hunedoara", serie_ci: "XD" },
  { judet: "Hunedoara", serie_ci: "HD" },
  { judet: "Ialomita", serie_ci: "SZ" },
  { judet: "Iasi", serie_ci: "IZ" },
  { judet: "Iasi", serie_ci: "MX" },
  { judet: "Iasi", serie_ci: "MZ" },
  { judet: "Ilfov", serie_ci: "IF" },
  { judet: "Maramures", serie_ci: "XM" },
  { judet: "Maramures", serie_ci: "MM" },
  { judet: "Mehedinti", serie_ci: "MH" },
  { judet: "Mures", serie_ci: "MS" },
  { judet: "Mures", serie_ci: "XS" },
  { judet: "Neamt", serie_ci: "NT" },
  { judet: "Neamt", serie_ci: "ZN" },
  { judet: "Olt", serie_ci: "OT" },
  { judet: "Prahova", serie_ci: "PH" },
  { judet: "Prahova", serie_ci: "PX" },
  { judet: "Satu Mare", serie_ci: "SM" },
  { judet: "Salaj", serie_ci: "SX" },
  { judet: "Sibiu", serie_ci: "SB" },
  { judet: "Suceava", serie_ci: "SV" },
  { judet: "Suceava", serie_ci: "XV" },
  { judet: "Teleorman", serie_ci: "TR" },
  { judet: "Timis", serie_ci: "TM" },
  { judet: "Timis", serie_ci: "TZ" },
  { judet: "Tulcea", serie_ci: "TL" },
  { judet: "Valcea", serie_ci: "VL" },
  { judet: "Vaslui", serie_ci: "VS" },
  { judet: "Vrancea", serie_ci: "VN" },
];

const TARI = [
  { tara: "ALBANIA" },
  { tara: "ANDORRA" },
  { tara: "AUSTRIA" },
  { tara: "BELARUS" },
  { tara: "BELGIA" },
  { tara: "BOSNIA SI HERTEGOVINA" },
  { tara: "BULGARIA" },
  { tara: "CHINA" },
  { tara: "CIPRU" },
  { tara: "CROATIA" },
  { tara: "DANEMARCA" },
  { tara: "ELVETIA" },
  { tara: "ESTONIA" },
  { tara: "FINLANDA" },
  { tara: "FRANTA" },
  { tara: "GERMANIA" },
  { tara: "GRECIA" },
  { tara: "INDONEZIA" },
  { tara: "IRLANDA" },
  { tara: "ISLANDA" },
  { tara: "ITALIA" },
  { tara: "JAPONIA" },
  { tara: "LETONIA" },
  { tara: "LIECHTENSTEIN" },
  { tara: "LITUANIA" },
  { tara: "LUXEMBURG" },
  { tara: "MACEDONIA" },
  { tara: "MADAGASCAR" },
  { tara: "MALAEZIA" },
  { tara: "MALTA" },
  { tara: "MONACO" },
  { tara: "MUNTENEGRU" },
  { tara: "NORVEGIA" },
  { tara: "OLANDA (TARILE DE JOS)" },
  { tara: "POLONIA" },
  { tara: "PORTUGALIA" },
  { tara: "REGATUL UNIT" },
  { tara: "REPUBLICA CEHA" },
  { tara: "REPUBLICA MOLDOVA" },
  { tara: "ROMANIA" },
  { tara: "RUSIA" },
  { tara: "SAN MARINO" },
  { tara: "SERBIA" },
  { tara: "SLOVACIA" },
  { tara: "SLOVENIA" },
  { tara: "SPANIA" },
  { tara: "SUEDIA" },
  { tara: "TURCIA" },
  { tara: "UCRAINA" },
  { tara: "UNGARIA" },
  { tara: "VATICAN" },
];

async function clearAndInsert(table: string, data: any[], label: string) {
  console.log(`Seeding ${label} (${data.length} rows)...`);
  const { error: delError } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) console.log(`  Clear ${table} (may be empty):`, delError.message);

  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { data: result, error } = await supabase.from(table).insert(batch).select();
    if (error) {
      console.error(`  Error inserting ${table} batch ${i}:`, error.message);
    } else {
      inserted += (result?.length || 0);
    }
  }
  console.log(`  Inserted ${inserted} ${label}.`);
  return inserted;
}

async function main() {
  console.log("=== Seeding 5 New Reference Lists into Supabase ===\n");

  await clearAndInsert("lista_cota_tva", COTA_TVA, "Cote TVA");
  await clearAndInsert("lista_prefix_telefon", PREFIX_TELEFON, "Prefixe Telefonice");
  await clearAndInsert("lista_sector_bucuresti", SECTOR_BUCURESTI, "Sectoare Bucuresti");
  await clearAndInsert("lista_serie_ci", SERIE_CI, "Serii CI");
  await clearAndInsert("lista_tari", TARI, "Tari");

  console.log("\n=== Seeding Complete ===");
}

main().catch(console.error);
