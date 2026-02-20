import { supabase } from "./supabase";

const JUDETE_MAP: Record<string, string> = {
  "AB": "Alba", "AR": "Arad", "AG": "Argeș", "BC": "Bacău", "BH": "Bihor",
  "BN": "Bistrița-Năsăud", "BT": "Botoșani", "BR": "Brăila", "BV": "Brașov",
  "B": "București", "BZ": "Buzău", "CL": "Călărași", "CS": "Caraș-Severin",
  "CJ": "Cluj", "CT": "Constanța", "CV": "Covasna", "DB": "Dâmbovița",
  "DJ": "Dolj", "GL": "Galați", "GR": "Giurgiu", "GJ": "Gorj",
  "HR": "Harghita", "HD": "Hunedoara", "IL": "Ialomița", "IS": "Iași",
  "IF": "Ilfov", "MM": "Maramureș", "MH": "Mehedinți", "MS": "Mureș",
  "NT": "Neamț", "OT": "Olt", "PH": "Prahova", "SM": "Satu Mare",
  "SJ": "Sălaj", "SB": "Sibiu", "SV": "Suceava", "TR": "Teleorman",
  "TM": "Timiș", "TL": "Tulcea", "VL": "Vâlcea", "VS": "Vaslui",
  "VN": "Vrancea", "-": "București"
};

const ROMANIAN_BANKS = [
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Banca Nationala a Romaniei (BNR)", swift: "NBROROBU", iban_cod: "NBRO", telefon: "+40 21 312 43 75" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Banca Transilvania S.A.", swift: "BTRLRO22", iban_cod: "BTRL", telefon: "+40 264 407 150" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Banca Comercială Română (BCR) - Erste Group", swift: "RNCBROBU", iban_cod: "RNCB", telefon: "+40 21 407 42 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "BRD - Groupe Société Générale", swift: "BRDEROBU", iban_cod: "BRDE", telefon: "+40 21 302 61 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "CEC Bank S.A.", swift: "CECEROBU", iban_cod: "CECE", telefon: "+40 21 311 11 19" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Raiffeisen Bank Romania S.A.", swift: "RZBRROBU", iban_cod: "RZBR", telefon: "+40 21 306 10 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "UniCredit Bank S.A.", swift: "BACXROBU", iban_cod: "BACX", telefon: "+40 21 200 20 20" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "ING Bank N.V. - Sucursala București", swift: "INGBROBU", iban_cod: "INGB", telefon: "+40 31 406 41 04" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Alpha Bank Romania S.A.", swift: "BUCRROBU", iban_cod: "BUCR", telefon: "+40 21 207 56 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "OTP Bank Romania S.A.", swift: "OTPVROBU", iban_cod: "OTPV", telefon: "+40 21 307 57 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Banca Comercială Intesa Sanpaolo Romania S.A.", swift: "WBANROBU", iban_cod: "WBAN", telefon: "+40 21 405 70 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "EximBank - Banca Românească de Export-Import S.A.", swift: "EXROROBU", iban_cod: "EXRO", telefon: "+40 21 405 31 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Garanti BBVA Romania S.A.", swift: "UGBIROBU", iban_cod: "UGBI", telefon: "+40 21 208 92 60" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "First Bank S.A.", swift: "PIRBROBU", iban_cod: "PIRB", telefon: "+40 21 303 64 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Libra Internet Bank S.A.", swift: "BRELROBU", iban_cod: "BREL", telefon: "+40 21 208 65 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Vista Bank (Romania) S.A.", swift: "MILOROBU", iban_cod: "MILO", telefon: "+40 21 206 69 69" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "TechVentures Bank S.A.", swift: "TVBKROBU", iban_cod: "TVBK", telefon: "+40 21 310 10 10" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Patria Bank S.A.", swift: "TABOROBU", iban_cod: "PABA", telefon: "+40 21 315 68 50" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Credit Europe Bank (Romania) S.A.", swift: "FNNBROBU", iban_cod: "FNNB", telefon: "+40 21 406 29 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "BCR Banca pentru Locuințe S.A.", swift: "BFHBROBU", iban_cod: "BFHB", telefon: "+40 21 310 01 80" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Porsche Bank Romania S.A.", swift: "PORLROBU", iban_cod: "PORL", telefon: "+40 21 209 10 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "BNP Paribas Personal Finance - Sucursala București", swift: "ABOROBU", iban_cod: "ABOR", telefon: "+40 21 311 12 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "ProCredit Bank S.A.", swift: "MICLROBU", iban_cod: "MICL", telefon: "+40 21 201 60 00" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Idea Bank S.A.", swift: "ROMGROBU", iban_cod: "ROMG", telefon: "+40 374 600 600" },
  { tara: "România", cod_bancar_tara: "RO", nume_banca: "Banca Centrală Cooperatistă CREDITCOOP", swift: "CRCEROBU", iban_cod: "CRCE", telefon: "+40 21 313 61 57" },
];

const ROMANIAN_CITIES = [
  { nume: "Abrud", judet: "AB" }, { nume: "Adjud", judet: "VN" }, { nume: "Agnita", judet: "SB" },
  { nume: "Aiud", judet: "AB" }, { nume: "Alba Iulia", judet: "AB" }, { nume: "Aleșd", judet: "BH" },
  { nume: "Alexandria", judet: "TR" }, { nume: "Amara", judet: "IL" }, { nume: "Anina", judet: "CS" },
  { nume: "Aninoasa", judet: "HD" }, { nume: "Arad", judet: "AR" }, { nume: "Ardud", judet: "SM" },
  { nume: "Avrig", judet: "SB" }, { nume: "Azuga", judet: "PH" }, { nume: "Babadag", judet: "TL" },
  { nume: "Băbeni", judet: "VL" }, { nume: "Bacău", judet: "BC" }, { nume: "Baia de Aramă", judet: "MH" },
  { nume: "Baia de Arieș", judet: "AB" }, { nume: "Baia Mare", judet: "MM" }, { nume: "Baia Sprie", judet: "MM" },
  { nume: "Băicoi", judet: "PH" }, { nume: "Băile Govora", judet: "VL" }, { nume: "Băile Herculane", judet: "CS" },
  { nume: "Băile Olănești", judet: "VL" }, { nume: "Băilești", judet: "DJ" }, { nume: "Băile Tușnad", judet: "HR" },
  { nume: "Bălan", judet: "HR" }, { nume: "Bălcești", judet: "VL" }, { nume: "Balș", judet: "OT" },
  { nume: "Baneasa", judet: "CT" }, { nume: "Baraolt", judet: "CV" }, { nume: "Bârlad", judet: "VS" },
  { nume: "Bechet", judet: "DJ" }, { nume: "Beclean", judet: "BN" }, { nume: "Beiuș", judet: "BH" },
  { nume: "Berbești", judet: "VL" }, { nume: "Berești", judet: "GL" }, { nume: "Bicaz", judet: "NT" },
  { nume: "Bistrița", judet: "BN" }, { nume: "Blaj", judet: "AB" }, { nume: "Bocșa", judet: "CS" },
  { nume: "Boldești-Scăeni", judet: "PH" }, { nume: "Bolintin-Vale", judet: "GR" }, { nume: "Borșa", judet: "MM" },
  { nume: "Borsec", judet: "HR" }, { nume: "Botoșani", judet: "BT" }, { nume: "Brad", judet: "HD" },
  { nume: "Brăgadiru", judet: "IF" }, { nume: "Brăila", judet: "BR" }, { nume: "Brașov", judet: "BV" },
  { nume: "Breaza", judet: "PH" }, { nume: "Brezoi", judet: "VL" }, { nume: "Broșteni", judet: "SV" },
  { nume: "Bucecea", judet: "BT" }, { nume: "București", judet: "-" }, { nume: "Budești", judet: "CL" },
  { nume: "Buftea", judet: "IF" }, { nume: "Buhuși", judet: "BC" }, { nume: "Bumbești-Jiu", judet: "GJ" },
  { nume: "Bușteni", judet: "PH" }, { nume: "Buzău", judet: "BZ" }, { nume: "Buziaș", judet: "TM" },
  { nume: "Cajvana", judet: "SV" }, { nume: "Calafat", judet: "DJ" }, { nume: "Călan", judet: "HD" },
  { nume: "Călărași", judet: "CL" }, { nume: "Călimănești", judet: "VL" }, { nume: "Câmpeni", judet: "AB" },
  { nume: "Câmpia Turzii", judet: "CJ" }, { nume: "Câmpina", judet: "PH" }, { nume: "Câmpulung", judet: "AG" },
  { nume: "Câmpulung Moldovenesc", judet: "SV" }, { nume: "Caracal", judet: "OT" }, { nume: "Caransebeș", judet: "CS" },
  { nume: "Carei", judet: "SM" }, { nume: "Cavnic", judet: "MM" }, { nume: "Căzănești", judet: "IL" },
  { nume: "Cehu Silvaniei", judet: "SJ" }, { nume: "Cernavodă", judet: "CT" }, { nume: "Chișineu-Criș", judet: "AR" },
  { nume: "Chitila", judet: "IF" }, { nume: "Ciacova", judet: "TM" }, { nume: "Cisnădie", judet: "SB" },
  { nume: "Cluj-Napoca", judet: "CJ" }, { nume: "Codlea", judet: "BV" }, { nume: "Comănești", judet: "BC" },
  { nume: "Comarnic", judet: "PH" }, { nume: "Constanța", judet: "CT" }, { nume: "Copșa Mică", judet: "SB" },
  { nume: "Corabia", judet: "OT" }, { nume: "Costești", judet: "AG" }, { nume: "Covasna", judet: "CV" },
  { nume: "Craiova", judet: "DJ" }, { nume: "Cristuru Secuiesc", judet: "HR" }, { nume: "Cugir", judet: "AB" },
  { nume: "Curtea de Argeș", judet: "AG" }, { nume: "Curtici", judet: "AR" }, { nume: "Dăbuleni", judet: "DJ" },
  { nume: "Darabani", judet: "BT" }, { nume: "Dărmănești", judet: "BC" }, { nume: "Dej", judet: "CJ" },
  { nume: "Deta", judet: "TM" }, { nume: "Deva", judet: "HD" }, { nume: "Dolhasca", judet: "SV" },
  { nume: "Dorohoi", judet: "BT" }, { nume: "Drăgănești-Olt", judet: "OT" }, { nume: "Drăgășani", judet: "VL" },
  { nume: "Dragomirești", judet: "MM" }, { nume: "Drobeta-Turnu Severin", judet: "MH" }, { nume: "Dumbrăveni", judet: "SB" },
  { nume: "Eforie", judet: "CT" }, { nume: "Făgăraș", judet: "BV" }, { nume: "Făget", judet: "TM" },
  { nume: "Fălticeni", judet: "SV" }, { nume: "Făurei", judet: "BR" }, { nume: "Fetești", judet: "IL" },
  { nume: "Fieni", judet: "DB" }, { nume: "Fierbinți-Târg", judet: "IL" }, { nume: "Filiași", judet: "DJ" },
  { nume: "Flămânzi", judet: "BT" }, { nume: "Focșani", judet: "VN" }, { nume: "Frasin", judet: "SV" },
  { nume: "Fundulea", judet: "CL" }, { nume: "Găești", judet: "DB" }, { nume: "Galați", judet: "GL" },
  { nume: "Gătaia", judet: "TM" }, { nume: "Geoagiu", judet: "HD" }, { nume: "Gheorgheni", judet: "HR" },
  { nume: "Gherla", judet: "CJ" }, { nume: "Ghimbav", judet: "BV" }, { nume: "Giurgiu", judet: "GR" },
  { nume: "Gura Humorului", judet: "SV" }, { nume: "Hârlău", judet: "IS" }, { nume: "Hârșova", judet: "CT" },
  { nume: "Hațeg", judet: "HD" }, { nume: "Horezu", judet: "VL" }, { nume: "Huedin", judet: "CJ" },
  { nume: "Hunedoara", judet: "HD" }, { nume: "Huși", judet: "VS" }, { nume: "Ianca", judet: "BR" },
  { nume: "Iași", judet: "IS" }, { nume: "Iernut", judet: "MS" }, { nume: "Ineu", judet: "AR" },
  { nume: "Însurăței", judet: "BR" }, { nume: "Întorsura Buzăului", judet: "CV" }, { nume: "Isaccea", judet: "TL" },
  { nume: "Jibou", judet: "SJ" }, { nume: "Jimbolia", judet: "TM" }, { nume: "Lehliu Gară", judet: "CL" },
  { nume: "Lipova", judet: "AR" }, { nume: "Liteni", judet: "SV" }, { nume: "Livada", judet: "SM" },
  { nume: "Luduș", judet: "MS" }, { nume: "Lugoj", judet: "TM" }, { nume: "Lupeni", judet: "HD" },
  { nume: "Măcin", judet: "TL" }, { nume: "Măgurele", judet: "IF" }, { nume: "Mangalia", judet: "CT" },
  { nume: "Mărășești", judet: "VN" }, { nume: "Marghita", judet: "BH" }, { nume: "Medgidia", judet: "CT" },
  { nume: "Mediaș", judet: "SB" }, { nume: "Miercurea Ciuc", judet: "HR" }, { nume: "Miercurea Nirajului", judet: "MS" },
  { nume: "Miercurea Sibiului", judet: "SB" }, { nume: "Mihăilești", judet: "GR" }, { nume: "Milișăuți", judet: "SV" },
  { nume: "Mioveni", judet: "AG" }, { nume: "Mizil", judet: "PH" }, { nume: "Moinești", judet: "BC" },
  { nume: "Moldova Nouă", judet: "CS" }, { nume: "Moreni", judet: "DB" }, { nume: "Motru", judet: "GJ" },
  { nume: "Murfatlar", judet: "CT" }, { nume: "Murgeni", judet: "VS" }, { nume: "Nădlac", judet: "AR" },
  { nume: "Năsăud", judet: "BN" }, { nume: "Năvodari", judet: "CT" }, { nume: "Negrești", judet: "VS" },
  { nume: "Negrești-Oaș", judet: "SM" }, { nume: "Negru Vodă", judet: "CT" }, { nume: "Nehoiu", judet: "BZ" },
  { nume: "Novaci", judet: "GJ" }, { nume: "Nucet", judet: "BH" }, { nume: "Ocna Mureș", judet: "AB" },
  { nume: "Ocna Sibiului", judet: "SB" }, { nume: "Ocnele Mari", judet: "VL" }, { nume: "Odobești", judet: "VN" },
  { nume: "Odorheiu Secuiesc", judet: "HR" }, { nume: "Oltenița", judet: "CL" }, { nume: "Onești", judet: "BC" },
  { nume: "Oradea", judet: "BH" }, { nume: "Orăștie", judet: "HD" }, { nume: "Oravița", judet: "CS" },
  { nume: "Orșova", judet: "MH" }, { nume: "Oțelu Roșu", judet: "CS" }, { nume: "Otopeni", judet: "IF" },
  { nume: "Ovidiu", judet: "CT" }, { nume: "Panciu", judet: "VN" }, { nume: "Pâncota", judet: "AR" },
  { nume: "Pantelimon", judet: "IF" }, { nume: "Pașcani", judet: "IS" }, { nume: "Pătârlagele", judet: "BZ" },
  { nume: "Pecica", judet: "AR" }, { nume: "Petrila", judet: "HD" }, { nume: "Petroșani", judet: "HD" },
  { nume: "Piatra-Olt", judet: "OT" }, { nume: "Piatra Neamț", judet: "NT" }, { nume: "Pitești", judet: "AG" },
  { nume: "Ploiești", judet: "PH" }, { nume: "Plopeni", judet: "PH" }, { nume: "Podu Iloaiei", judet: "IS" },
  { nume: "Pogoanele", judet: "BZ" }, { nume: "Popești-Leordeni", judet: "IF" }, { nume: "Potcoava", judet: "OT" },
  { nume: "Predeal", judet: "BV" }, { nume: "Pucioasa", judet: "DB" }, { nume: "Răcari", judet: "DB" },
  { nume: "Rădăuți", judet: "SV" }, { nume: "Râmnicu Sărat", judet: "BZ" }, { nume: "Râmnicu Vâlcea", judet: "VL" },
  { nume: "Râșnov", judet: "BV" }, { nume: "Recaș", judet: "TM" }, { nume: "Reghin", judet: "MS" },
  { nume: "Reșița", judet: "CS" }, { nume: "Roman", judet: "NT" }, { nume: "Roșiorii de Vede", judet: "TR" },
  { nume: "Rovinari", judet: "GJ" }, { nume: "Roznov", judet: "NT" }, { nume: "Rupea", judet: "BV" },
  { nume: "Săcele", judet: "BV" }, { nume: "Săcueni", judet: "BH" }, { nume: "Salcea", judet: "SV" },
  { nume: "Săliște", judet: "SB" }, { nume: "Săliștea de Sus", judet: "MM" }, { nume: "Salonta", judet: "BH" },
  { nume: "Sângeorgiu de Pădure", judet: "MS" }, { nume: "Sângeorz-Băi", judet: "BN" },
  { nume: "Sânnicolau Mare", judet: "TM" }, { nume: "Sântana", judet: "AR" }, { nume: "Sărmașu", judet: "MS" },
  { nume: "Satu Mare", judet: "SM" }, { nume: "Săveni", judet: "BT" }, { nume: "Scornicești", judet: "OT" },
  { nume: "Sebeș", judet: "AB" }, { nume: "Sebiș", judet: "AR" }, { nume: "Sfântu Gheorghe", judet: "CV" },
  { nume: "Sibiu", judet: "SB" }, { nume: "Sighetu Marmației", judet: "MM" }, { nume: "Sighișoara", judet: "MS" },
  { nume: "Simeria", judet: "HD" }, { nume: "Sinaia", judet: "PH" }, { nume: "Slanic", judet: "PH" },
  { nume: "Slănic-Moldova", judet: "BC" }, { nume: "Slatina", judet: "OT" }, { nume: "Slobozia", judet: "IL" },
  { nume: "Solca", judet: "SV" }, { nume: "Sovata", judet: "MS" }, { nume: "Ștefănești", judet: "AG" },
  { nume: "Ștefănești", judet: "BT" }, { nume: "Strehaia", judet: "MH" }, { nume: "Suceava", judet: "SV" },
  { nume: "Sulina", judet: "TL" }, { nume: "Tălmaciu", judet: "SB" }, { nume: "Tandarei", judet: "IL" },
  { nume: "Târgoviște", judet: "DB" }, { nume: "Târgu Bujor", judet: "GL" }, { nume: "Târgu Cărbunești", judet: "GJ" },
  { nume: "Târgu Frumos", judet: "IS" }, { nume: "Târgu Jiu", judet: "GJ" }, { nume: "Târgu Lăpuș", judet: "MM" },
  { nume: "Târgu Mureș", judet: "MS" }, { nume: "Târgu Neamț", judet: "NT" }, { nume: "Târgu Ocna", judet: "BC" },
  { nume: "Târgu Secuiesc", judet: "CV" }, { nume: "Târnăveni", judet: "MS" }, { nume: "Tășnad", judet: "SM" },
  { nume: "Techirghiol", judet: "CT" }, { nume: "Teiuș", judet: "AB" }, { nume: "Timișoara", judet: "TM" },
  { nume: "Tismana", judet: "GJ" }, { nume: "Toplița", judet: "HR" }, { nume: "Topoloveni", judet: "AG" },
  { nume: "Tulcea", judet: "TL" }, { nume: "Turda", judet: "CJ" }, { nume: "Turnu Măgurele", judet: "TR" },
  { nume: "Turceni", judet: "GJ" }, { nume: "Uricani", judet: "HD" }, { nume: "Urlați", judet: "PH" },
  { nume: "Urziceni", judet: "IL" }, { nume: "Vadu Crișului", judet: "BH" }, { nume: "Vălenii de Munte", judet: "PH" },
  { nume: "Vanju Mare", judet: "MH" }, { nume: "Vașcău", judet: "BH" }, { nume: "Vaslui", judet: "VS" },
  { nume: "Vatra Dornei", judet: "SV" }, { nume: "Vicovu de Sus", judet: "SV" }, { nume: "Victoria", judet: "BV" },
  { nume: "Videle", judet: "TR" }, { nume: "Vișeu de Sus", judet: "MM" }, { nume: "Vlăhița", judet: "HR" },
  { nume: "Voluntari", judet: "IF" }, { nume: "Vulcan", judet: "HD" }, { nume: "Zalău", judet: "SJ" },
  { nume: "Zărnești", judet: "BV" }, { nume: "Zimnicea", judet: "TR" }, { nume: "Zlatna", judet: "AB" },
];

async function seedBanks() {
  console.log("Seeding Romanian banks into Supabase...");
  
  const { error: delError } = await supabase.from("lista_banca").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) console.log("Clear banks (may be empty):", delError.message);

  const batchSize = 20;
  let inserted = 0;
  for (let i = 0; i < ROMANIAN_BANKS.length; i += batchSize) {
    const batch = ROMANIAN_BANKS.slice(i, i + batchSize);
    const { data, error } = await supabase.from("lista_banca").insert(batch).select();
    if (error) {
      console.error(`Error inserting banks batch ${i}:`, error.message);
    } else {
      inserted += (data?.length || 0);
    }
  }
  console.log(`Inserted ${inserted} Romanian banks.`);
}

async function seedCities() {
  console.log("Seeding Romanian cities/counties into Supabase...");

  const { error: delError } = await supabase.from("lista_oras_judet").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) console.log("Clear cities (may be empty):", delError.message);

  const rows = ROMANIAN_CITIES.map(city => ({
    tara: "România",
    comuna: "",
    oras: city.nume,
    judet: JUDETE_MAP[city.judet] || city.judet,
    concatenate: `${city.nume}, ${JUDETE_MAP[city.judet] || city.judet}`,
    uid: city.judet
  }));

  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.from("lista_oras_judet").insert(batch).select();
    if (error) {
      console.error(`Error inserting cities batch ${i}:`, error.message);
    } else {
      inserted += (data?.length || 0);
    }
  }
  console.log(`Inserted ${inserted} Romanian cities.`);
}

async function main() {
  console.log("=== Seeding Supabase Reference Lists ===\n");
  await seedBanks();
  console.log("");
  await seedCities();
  console.log("\n=== Seeding Complete ===");
}

main().catch(console.error);
