import { supabase } from "./supabase";

const KNOWN_CITIES = new Set([
  "Abrud","Adjud","Agnita","Aiud","Alba Iulia","Alesd","Alexandria","Amara","Anina",
  "Aninoasa","Arad","Ardud","Avrig","Azuga","Babadag","Babeni","Bacau","Baia de Arama",
  "Baia de Aries","Baia Mare","Baia Sprie","Baicoi","Baile Govora","Baile Herculane",
  "Baile Olanesti","Bailesti","Baile Tusnad","Balan","Balcesti","Bals","Baneasa",
  "Baraolt","Barlad","Bechet","Beclean","Beius","Berbesti","Beresti","Bicaz","Bistrita",
  "Blaj","Bocsa","Boldesti-Scaeni","Bolintin-Vale","Borsa","Borsec","Botosani","Brad",
  "Bragadiru","Braila","Brasov","Breaza","Brezoi","Brosteni","Bucecea","Bucuresti",
  "Budesti","Buftea","Buhusi","Bumbesti-Jiu","Busteni","Buzau","Buzias","Cajvana",
  "Calafat","Calan","Calarasi","Calimanesti","Campeni","Campia Turzii","Campina",
  "Campulung","Campulung Moldovenesc","Caracal","Caransebes","Carei","Cavnic",
  "Cazanesti","Cehu Silvaniei","Cernavoda","Chisineu-Cris","Chitila","Ciacova",
  "Cisnadie","Cluj-Napoca","Codlea","Comanesti","Comarnic","Constanta","Copsa Mica",
  "Corabia","Costesti","Covasna","Craiova","Cristuru Secuiesc","Cugir","Curtea de Arges",
  "Curtici","Dabuleni","Darabani","Darmanesti","Dej","Deta","Deva","Dolhasca","Dorohoi",
  "Draganesti-Olt","Dragasani","Dragomiresti","Drobeta-Turnu Severin","Dumbraveni",
  "Eforie","Fagaras","Faget","Falticeni","Faurei","Fetesti","Fieni","Fierbinti-Targ",
  "Filiasi","Flamanzi","Focsani","Frasin","Fundulea","Gaesti","Galati","Gataia",
  "Geoagiu","Gheorgheni","Gherla","Ghimbav","Giurgiu","Gura Humorului","Harlau",
  "Harsova","Hateg","Horezu","Huedin","Hunedoara","Husi","Ianca","Iasi","Iernut",
  "Ineu","Insuratei","Intorsura Buzaului","Isaccea","Jibou","Jimbolia","Lehliu Gara",
  "Lipova","Liteni","Livada","Ludus","Lugoj","Lupeni","Macin","Magurele","Mangalia",
  "Marasesti","Marghita","Medgidia","Medias","Miercurea Ciuc","Miercurea Nirajului",
  "Miercurea Sibiului","Mihailesti","Milisauti","Mioveni","Mizil","Moinesti",
  "Moldova Noua","Moreni","Motru","Murfatlar","Murgeni","Nadlac","Nasaud","Navodari",
  "Negresti","Negresti-Oas","Negru Voda","Nehoiu","Novaci","Nucet","Ocna Mures",
  "Ocna Sibiului","Ocnele Mari","Odobesti","Odorheiu Secuiesc","Oltenita","Onesti",
  "Oradea","Orastie","Oravita","Orsova","Otelu Rosu","Otopeni","Ovidiu","Panciu",
  "Pancota","Pantelimon","Pascani","Patarlagele","Pecica","Petrila","Petrosani",
  "Piatra-Olt","Piatra Neamt","Pitesti","Ploiesti","Plopeni","Podu Iloaiei",
  "Pogoanele","Popesti-Leordeni","Potcoava","Predeal","Pucioasa","Racari","Radauti",
  "Ramnicu Sarat","Ramnicu Valcea","Rasnov","Recas","Reghin","Resita","Roman",
  "Rosiorii de Vede","Rovinari","Roznov","Rupea","Sacele","Sacueni","Salcea",
  "Saliste","Salistea de Sus","Salonta","Sangeorgiu de Padure","Sangeorz-Bai",
  "Sannicolau Mare","Santana","Sarmasu","Satu Mare","Saveni","Scornicesti","Sebes",
  "Sebis","Sfantu Gheorghe","Sibiu","Sighetu Marmatiei","Sighisoara","Simeria",
  "Sinaia","Slanic","Slanic-Moldova","Slatina","Slobozia","Solca","Sovata","Stefanesti",
  "Strehaia","Suceava","Sulina","Talmaciu","Tandarei","Targoviste","Targu Bujor",
  "Targu Carbunesti","Targu Frumos","Targu Jiu","Targu Lapus","Targu Mures",
  "Targu Neamt","Targu Ocna","Targu Secuiesc","Tarnaveni","Tasnad","Techirghiol",
  "Teius","Timisoara","Tismana","Toplita","Topoloveni","Tulcea","Turda",
  "Turnu Magurele","Turceni","Uricani","Urlati","Urziceni","Vadu Crisului",
  "Valenii de Munte","Vanju Mare","Vascau","Vaslui","Vatra Dornei","Vicovu de Sus",
  "Victoria","Videle","Viseu de Sus","Vlahita","Voluntari","Vulcan","Zalau",
  "Zarnesti","Zimnicea","Zlatna"
]);

function normalize(name: string): string {
  return name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ș/gi, 's').replace(/ț/gi, 't').replace(/ă/gi, 'a').replace(/â/gi, 'a').replace(/î/gi, 'i')
    .replace(/ş/gi, 's').replace(/ţ/gi, 't')
    .replace(/\u200E/g, '')
    .toLowerCase().trim();
}

const normalizedCitySet = new Set(Array.from(KNOWN_CITIES).map(normalize));

function isCity(orasName: string): boolean {
  return normalizedCitySet.has(normalize(orasName));
}

async function main() {
  console.log("=== Fixing comuna field in lista_oras_judet ===\n");

  let allData: any[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data: page, error } = await supabase
      .from("lista_oras_judet")
      .select("*")
      .range(from, from + pageSize - 1);
    if (error) { console.error("Error fetching:", error.message); return; }
    allData = allData.concat(page || []);
    if (!page || page.length < pageSize) break;
    from += pageSize;
  }
  console.log(`Total entries: ${allData.length}`);

  const communeIds: string[] = [];
  const communeNames: string[] = [];
  let cityCount = 0;

  for (const row of allData) {
    const orasName = (row.oras || "").trim();
    if (!orasName) continue;
    if (isCity(orasName)) {
      cityCount++;
    } else {
      communeIds.push(row.id);
      communeNames.push(orasName);
    }
  }

  console.log(`Cities: ${cityCount}`);
  console.log(`Communes to update: ${communeIds.length}`);

  const batchSize = 50;
  let updated = 0;
  for (let i = 0; i < communeIds.length; i += batchSize) {
    const batchIds = communeIds.slice(i, i + batchSize);
    const batchNames = communeNames.slice(i, i + batchSize);
    
    const promises = batchIds.map((id, idx) =>
      supabase
        .from("lista_oras_judet")
        .update({ comuna: batchNames[idx] })
        .eq("id", id)
    );
    
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error(`Batch ${i}: ${errors.length} errors`);
      errors.forEach(e => console.error("  ", e.error?.message));
    }
    updated += batchIds.length - errors.length;
    
    if ((i + batchSize) % 500 === 0 || i + batchSize >= communeIds.length) {
      console.log(`  Progress: ${Math.min(i + batchSize, communeIds.length)}/${communeIds.length}`);
    }
  }

  console.log(`\nUpdated ${updated} communes with comuna field.`);
  console.log("=== Fix Complete ===");
}

main().catch(console.error);
