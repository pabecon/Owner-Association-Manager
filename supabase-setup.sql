
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
  cota_de_tva text NOT NULL
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

ALTER TABLE lista_atribute_fiscale ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_atribute_fiscale" ON lista_atribute_fiscale
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_atribute_fiscale" ON lista_atribute_fiscale
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_atribute_fiscale" ON lista_atribute_fiscale
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_atribute_fiscale" ON lista_atribute_fiscale
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_banca ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_banca" ON lista_banca
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_banca" ON lista_banca
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_banca" ON lista_banca
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_banca" ON lista_banca
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_banci_conturi ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_banci_conturi" ON lista_banci_conturi
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_banci_conturi" ON lista_banci_conturi
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_banci_conturi" ON lista_banci_conturi
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_banci_conturi" ON lista_banci_conturi
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_conexiune_bancare ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_conexiune_bancare" ON lista_conexiune_bancare
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_conexiune_bancare" ON lista_conexiune_bancare
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_conexiune_bancare" ON lista_conexiune_bancare
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_conexiune_bancare" ON lista_conexiune_bancare
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_conturi_toshl ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_conturi_toshl" ON lista_conturi_toshl
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_conturi_toshl" ON lista_conturi_toshl
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_conturi_toshl" ON lista_conturi_toshl
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_conturi_toshl" ON lista_conturi_toshl
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_cota_tva ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_cota_tva" ON lista_cota_tva
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_cota_tva" ON lista_cota_tva
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_cota_tva" ON lista_cota_tva
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_cota_tva" ON lista_cota_tva
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_curs_valutar_bnr ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_curs_valutar_bnr" ON lista_curs_valutar_bnr
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_curs_valutar_bnr" ON lista_curs_valutar_bnr
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_curs_valutar_bnr" ON lista_curs_valutar_bnr
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_curs_valutar_bnr" ON lista_curs_valutar_bnr
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_oras_judet ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_oras_judet" ON lista_oras_judet
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_oras_judet" ON lista_oras_judet
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_oras_judet" ON lista_oras_judet
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_oras_judet" ON lista_oras_judet
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_prefix_telefon ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_prefix_telefon" ON lista_prefix_telefon
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_prefix_telefon" ON lista_prefix_telefon
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_prefix_telefon" ON lista_prefix_telefon
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_prefix_telefon" ON lista_prefix_telefon
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_sector_bucuresti ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_sector_bucuresti" ON lista_sector_bucuresti
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_sector_bucuresti" ON lista_sector_bucuresti
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_sector_bucuresti" ON lista_sector_bucuresti
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_sector_bucuresti" ON lista_sector_bucuresti
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_serie_ci ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_serie_ci" ON lista_serie_ci
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_serie_ci" ON lista_serie_ci
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_serie_ci" ON lista_serie_ci
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_serie_ci" ON lista_serie_ci
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_tari ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_tari" ON lista_tari
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_tari" ON lista_tari
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_tari" ON lista_tari
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_tari" ON lista_tari
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_tip_drumuri ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_tip_drumuri" ON lista_tip_drumuri
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_tip_drumuri" ON lista_tip_drumuri
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_tip_drumuri" ON lista_tip_drumuri
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_tip_drumuri" ON lista_tip_drumuri
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_tip_factura ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_tip_factura" ON lista_tip_factura
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_tip_factura" ON lista_tip_factura
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_tip_factura" ON lista_tip_factura
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_tip_factura" ON lista_tip_factura
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_tip_moneda ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_tip_moneda" ON lista_tip_moneda
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_tip_moneda" ON lista_tip_moneda
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_tip_moneda" ON lista_tip_moneda
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_tip_moneda" ON lista_tip_moneda
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_tva_partener_anaf ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_tva_partener_anaf" ON lista_tva_partener_anaf
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_tva_partener_anaf" ON lista_tva_partener_anaf
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_tva_partener_anaf" ON lista_tva_partener_anaf
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_tva_partener_anaf" ON lista_tva_partener_anaf
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE lista_unitate_masura ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select on lista_unitate_masura" ON lista_unitate_masura
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon insert on lista_unitate_masura" ON lista_unitate_masura
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon delete on lista_unitate_masura" ON lista_unitate_masura
  FOR DELETE TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon update on lista_unitate_masura" ON lista_unitate_masura
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

