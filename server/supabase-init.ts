const TABLES = [
  'lista_atribute_fiscale', 'lista_banca', 'lista_banci_conturi',
  'lista_conexiune_bancare', 'lista_conturi_toshl', 'lista_cota_tva',
  'lista_curs_valutar_bnr', 'lista_oras_judet', 'lista_prefix_telefon',
  'lista_sector_bucuresti', 'lista_serie_ci', 'lista_tari',
  'lista_tip_drumuri', 'lista_tip_factura', 'lista_tip_moneda',
  'lista_tva_partener_anaf', 'lista_unitate_masura'
];

const TABLE_CREATE_SQL = `
-- =============================================
-- AdminBloc: Reference Lists Tables for Supabase
-- Run this SQL in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS lista_atribute_fiscale (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  atribut_fiscal text NOT NULL,
  explicatie text
);

CREATE TABLE IF NOT EXISTS lista_banca (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tara text NOT NULL,
  cod_bancar_tara text NOT NULL,
  nume_banca text NOT NULL,
  swift text NOT NULL,
  iban_cod text NOT NULL,
  telefon text
);

CREATE TABLE IF NOT EXISTS lista_banci_conturi (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  id_cont text NOT NULL,
  nume_cont text NOT NULL,
  banca text NOT NULL,
  iban text NOT NULL,
  titular text NOT NULL,
  valuta text NOT NULL,
  tip text NOT NULL,
  posesor text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_conexiune_bancare (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  id_conexiune text NOT NULL,
  nume_institutie text NOT NULL,
  status text NOT NULL,
  provider text NOT NULL,
  tip_conexiune text NOT NULL,
  data_ultimul_refresh text,
  expira_consimtamant text,
  auto_refresh text,
  nr_conturi text,
  id_uri_conturi text,
  mesaj_eroare text
);

CREATE TABLE IF NOT EXISTS lista_conturi_toshl (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  id_cont text NOT NULL,
  nume_cont_toshl text NOT NULL,
  banca text NOT NULL,
  iban text NOT NULL,
  titular text NOT NULL,
  tip_cont text NOT NULL,
  posesor text NOT NULL,
  sold text,
  valuta text NOT NULL,
  status text NOT NULL,
  tip_cont_toshl text,
  ultima_actualizare text,
  sursa_date text
);

CREATE TABLE IF NOT EXISTS lista_cota_tva (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nume_cota text NOT NULL,
  data_inceput text,
  data_sfarsit text,
  cota_de_tva text NOT NULL,
  categorii text
);

CREATE TABLE IF NOT EXISTS lista_curs_valutar_bnr (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  data_inceput text NOT NULL,
  data_sfarsit text NOT NULL,
  moneda text NOT NULL,
  curs text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_oras_judet (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tara text NOT NULL,
  comuna text NOT NULL,
  oras text NOT NULL,
  judet text NOT NULL,
  concatenate text,
  uid text
);

CREATE TABLE IF NOT EXISTS lista_prefix_telefon (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tara text NOT NULL,
  prefix text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_sector_bucuresti (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sector text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_serie_ci (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  judet text NOT NULL,
  serie_ci text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_tari (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tara text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_tip_drumuri (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tip_drum text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_tip_factura (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cod_tip_factura text NOT NULL,
  tip_factura text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_tip_moneda (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tip_moneda text NOT NULL
);

CREATE TABLE IF NOT EXISTS lista_tva_partener_anaf (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cui text NOT NULL,
  data_interogarii text,
  denumire_partener text,
  adresa_partener text,
  nr_registru_comertului text,
  telefon text,
  fax text,
  cod_postal text,
  act_autorizare text,
  stare_inregistrare text,
  data_inregistrare text,
  cod_caen text,
  iban text,
  status_ro_e_factura text,
  organ_fiscal_competent text,
  forma_de_proprietate text,
  forma_organizare text,
  forma_juridica text,
  scp_tva text,
  perioade_tva text,
  data_inceput_scp_tva text,
  data_sfarsit_scp_tva text,
  data_anularii_imp_scp_tva text,
  mesaj_scp_tva text,
  data_inceput_tva_incasare text,
  data_sfarsit_tva_incasare text,
  data_actualizare_tva_incasare text,
  data_publicare_tva_incasare text,
  tip_actualizare_tva_incasare text,
  status_tva_incasare text,
  data_inactivare text,
  data_reactivare text,
  data_publicare text,
  data_radiere text,
  status_inactivi text,
  data_inceput_split_tva text,
  data_anulare_split_tva text
);

CREATE TABLE IF NOT EXISTS lista_unitate_masura (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categorie text,
  singular text NOT NULL,
  plural text NOT NULL,
  simbol text
);

-- =============================================
-- Enable Row Level Security and create policies
-- =============================================
${TABLES.map(t => `
ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select on ${t}" ON ${t};
CREATE POLICY "Allow anon select on ${t}" ON ${t}
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon insert on ${t}" ON ${t};
CREATE POLICY "Allow anon insert on ${t}" ON ${t}
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete on ${t}" ON ${t};
CREATE POLICY "Allow anon delete on ${t}" ON ${t}
  FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon update on ${t}" ON ${t};
CREATE POLICY "Allow anon update on ${t}" ON ${t}
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
`).join('')}
`;

export const SUPABASE_TABLE_SQL = TABLE_CREATE_SQL;
export const SUPABASE_TABLES = TABLES;
