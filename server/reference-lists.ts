import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { z } from "zod";
import {
  listaAtributeFiscale, listaBanca, listaBanciConturi, listaConexiuneBancare,
  listaConturiToshl, listaCotaTva, listaCursValutarBnr, listaOrasJudet,
  listaPrefixTelefon, listaSectorBucuresti, listaSerieCi, listaTari,
  listaTipDrumuri, listaTipFactura, listaTipMoneda, listaTvaPartenerAnaf,
  listaUnitateMasura,
  insertListaAtributeFiscaleSchema, insertListaBancaSchema, insertListaBanciConturiSchema,
  insertListaConexiuneBancareSchema, insertListaConturiToshlSchema, insertListaCotaTvaSchema,
  insertListaCursValutarBnrSchema, insertListaOrasJudetSchema, insertListaPrefixTelefonSchema,
  insertListaSectorBucurestiSchema, insertListaSerieCiSchema, insertListaTariSchema,
  insertListaTipDrumuriSchema, insertListaTipFacturaSchema, insertListaTipMonedaSchema,
  insertListaTvaPartenerAnafSchema, insertListaUnitateMasuraSchema,
} from "@shared/schema";

export interface ListColumn {
  key: string;
  label: string;
  required: boolean;
}

export interface ReferenceListConfig {
  key: string;
  label: string;
  table: PgTableWithColumns<any>;
  supabaseTable: string;
  insertSchema: z.ZodTypeAny;
  columns: ListColumn[];
  columnMap: Record<string, string>;
}

function buildColumnMap(columns: ListColumn[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const col of columns) {
    map[col.key] = camelToSnake(col.key);
  }
  return map;
}

function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function mapRowFromSupabase(row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    result[snakeToCamel(key)] = value;
  }
  return result;
}

export function mapRowToSupabase(row: Record<string, any>, columnMap: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [camelKey, snakeKey] of Object.entries(columnMap)) {
    if (row[camelKey] !== undefined) {
      result[snakeKey] = row[camelKey];
    }
  }
  return result;
}

const atributeFiscaleColumns: ListColumn[] = [
  { key: "atributFiscal", label: "Atribut Fiscal", required: true },
  { key: "explicatie", label: "Explicatie", required: false },
];

const bancaColumns: ListColumn[] = [
  { key: "tara", label: "Tara", required: true },
  { key: "codBancarTara", label: "Cod Bancar Tara", required: true },
  { key: "numeBanca", label: "Nume Banca", required: true },
  { key: "swift", label: "SWIFT", required: true },
  { key: "ibanCod", label: "IBAN Cod", required: true },
  { key: "telefon", label: "Telefon", required: false },
];

const banciConturiColumns: ListColumn[] = [
  { key: "idCont", label: "ID Cont", required: true },
  { key: "numeCont", label: "Nume Cont", required: true },
  { key: "banca", label: "Banca", required: true },
  { key: "iban", label: "IBAN", required: true },
  { key: "titular", label: "Titular", required: true },
  { key: "valuta", label: "Valuta", required: true },
  { key: "tip", label: "Tip", required: true },
  { key: "posesor", label: "Posesor", required: true },
];

const conexiuneBancareColumns: ListColumn[] = [
  { key: "idConexiune", label: "ID Conexiune", required: true },
  { key: "numeInstitutie", label: "Nume Institutie", required: true },
  { key: "status", label: "Status", required: true },
  { key: "provider", label: "Provider", required: true },
  { key: "tipConexiune", label: "Tip Conexiune", required: true },
  { key: "dataUltimulRefresh", label: "Data Ultimul Refresh", required: false },
  { key: "expiraConsimtamant", label: "Expira Consimtamant", required: false },
  { key: "autoRefresh", label: "Auto Refresh", required: false },
  { key: "nrConturi", label: "Nr. Conturi", required: false },
  { key: "idUriConturi", label: "ID-uri Conturi", required: false },
  { key: "mesajEroare", label: "Mesaj Eroare", required: false },
];

const conturiToshlColumns: ListColumn[] = [
  { key: "idCont", label: "ID Cont", required: true },
  { key: "numeContToshl", label: "Nume Cont", required: true },
  { key: "banca", label: "Banca", required: true },
  { key: "iban", label: "IBAN", required: true },
  { key: "titular", label: "Titular", required: true },
  { key: "tipCont", label: "Tip Cont", required: true },
  { key: "posesor", label: "Posesor", required: true },
  { key: "sold", label: "Sold", required: false },
  { key: "valuta", label: "Valuta", required: true },
  { key: "status", label: "Status", required: true },
  { key: "tipContToshl", label: "Tip Cont Toshl", required: false },
  { key: "ultimaActualizare", label: "Ultima Actualizare", required: false },
  { key: "sursaDate", label: "Sursa Date", required: false },
];

const cotaTvaColumns: ListColumn[] = [
  { key: "numeCota", label: "Nume Cota", required: true },
  { key: "cotaDeTva", label: "Cota de TVA (%)", required: true },
  { key: "dataInceput", label: "Data Inceput", required: false },
  { key: "dataSfarsit", label: "Data Sfarsit", required: false },
];

const cursValutarBnrColumns: ListColumn[] = [
  { key: "dataInceput", label: "Data Inceput", required: true },
  { key: "dataSfarsit", label: "Data Sfarsit", required: true },
  { key: "moneda", label: "Moneda", required: true },
  { key: "curs", label: "Curs", required: true },
];

const orasJudetColumns: ListColumn[] = [
  { key: "tara", label: "Tara", required: true },
  { key: "comuna", label: "Comuna", required: true },
  { key: "oras", label: "Oras", required: true },
  { key: "judet", label: "Judet", required: true },
  { key: "concatenate", label: "Concatenare", required: false },
  { key: "uid", label: "UID", required: false },
];

const prefixTelefonColumns: ListColumn[] = [
  { key: "tara", label: "Tara", required: true },
  { key: "prefix", label: "Prefix", required: true },
];

const sectorBucurestiColumns: ListColumn[] = [
  { key: "sector", label: "Sector", required: true },
];

const serieCiColumns: ListColumn[] = [
  { key: "judet", label: "Judet", required: true },
  { key: "serieCi", label: "Serie CI", required: true },
];

const tariColumns: ListColumn[] = [
  { key: "tara", label: "Tara", required: true },
];

const tipDrumuriColumns: ListColumn[] = [
  { key: "tipDrum", label: "Tip Drum", required: true },
];

const tipFacturaColumns: ListColumn[] = [
  { key: "codTipFactura", label: "Cod Tip Factura", required: true },
  { key: "tipFactura", label: "Tip Factura", required: true },
];

const tipMonedaColumns: ListColumn[] = [
  { key: "tipMoneda", label: "Tip Moneda", required: true },
];

const tvaPartenerAnafColumns: ListColumn[] = [
  { key: "cui", label: "CUI", required: true },
  { key: "dataInterogarii", label: "Data Interogarii", required: false },
  { key: "denumirePartener", label: "Denumire Partener", required: false },
  { key: "adresaPartener", label: "Adresa Partener", required: false },
  { key: "nrRegistruComertului", label: "Nr. Registru Comertului", required: false },
  { key: "telefon", label: "Telefon", required: false },
  { key: "fax", label: "Fax", required: false },
  { key: "codPostal", label: "Cod Postal", required: false },
  { key: "actAutorizare", label: "Act Autorizare", required: false },
  { key: "stareInregistrare", label: "Stare Inregistrare", required: false },
  { key: "dataInregistrare", label: "Data Inregistrare", required: false },
  { key: "codCaen", label: "Cod CAEN", required: false },
  { key: "iban", label: "IBAN", required: false },
  { key: "statusRoEFactura", label: "Status RO E-Factura", required: false },
  { key: "organFiscalCompetent", label: "Organ Fiscal Competent", required: false },
  { key: "formaDeProprietate", label: "Forma de Proprietate", required: false },
  { key: "formaOrganizare", label: "Forma Organizare", required: false },
  { key: "formaJuridica", label: "Forma Juridica", required: false },
  { key: "scpTva", label: "SCP TVA", required: false },
  { key: "periodeTva", label: "Perioade TVA", required: false },
  { key: "dataInceputScpTva", label: "Data Inceput SCP TVA", required: false },
  { key: "dataSfarsitScpTva", label: "Data Sfarsit SCP TVA", required: false },
  { key: "dataAnulariiImpScpTva", label: "Data Anularii SCP TVA", required: false },
  { key: "mesajScpTva", label: "Mesaj SCP TVA", required: false },
  { key: "dataInceputTvaIncasare", label: "Data Inceput TVA Incasare", required: false },
  { key: "dataSfarsitTvaIncasare", label: "Data Sfarsit TVA Incasare", required: false },
  { key: "dataActualizareTvaIncasare", label: "Data Actualizare TVA Incasare", required: false },
  { key: "dataPublicareTvaIncasare", label: "Data Publicare TVA Incasare", required: false },
  { key: "tipActualizareTvaIncasare", label: "Tip Actualizare TVA Incasare", required: false },
  { key: "statusTvaIncasare", label: "Status TVA Incasare", required: false },
  { key: "dataInactivare", label: "Data Inactivare", required: false },
  { key: "dataReactivare", label: "Data Reactivare", required: false },
  { key: "dataPublicare", label: "Data Publicare", required: false },
  { key: "dataRadiere", label: "Data Radiere", required: false },
  { key: "statusInactivi", label: "Status Inactivi", required: false },
  { key: "dataInceputSplitTva", label: "Data Inceput Split TVA", required: false },
  { key: "dataAnulareSplitTva", label: "Data Anulare Split TVA", required: false },
];

const unitateMasuraColumns: ListColumn[] = [
  { key: "categorie", label: "Categorie", required: false },
  { key: "singular", label: "Singular", required: true },
  { key: "plural", label: "Plural", required: true },
  { key: "simbol", label: "Simbol", required: false },
];

export const referenceListConfigs: Record<string, ReferenceListConfig> = {
  "atribute-fiscale": {
    key: "atribute-fiscale",
    label: "Atribute Fiscale",
    table: listaAtributeFiscale,
    supabaseTable: "lista_atribute_fiscale",
    insertSchema: insertListaAtributeFiscaleSchema,
    columns: atributeFiscaleColumns,
    columnMap: buildColumnMap(atributeFiscaleColumns),
  },
  "banca": {
    key: "banca",
    label: "Banci",
    table: listaBanca,
    supabaseTable: "lista_banca",
    insertSchema: insertListaBancaSchema,
    columns: bancaColumns,
    columnMap: buildColumnMap(bancaColumns),
  },
  "banci-conturi": {
    key: "banci-conturi",
    label: "Conturi Bancare",
    table: listaBanciConturi,
    supabaseTable: "lista_banci_conturi",
    insertSchema: insertListaBanciConturiSchema,
    columns: banciConturiColumns,
    columnMap: buildColumnMap(banciConturiColumns),
  },
  "conexiune-bancare": {
    key: "conexiune-bancare",
    label: "Conexiuni Bancare",
    table: listaConexiuneBancare,
    supabaseTable: "lista_conexiune_bancare",
    insertSchema: insertListaConexiuneBancareSchema,
    columns: conexiuneBancareColumns,
    columnMap: buildColumnMap(conexiuneBancareColumns),
  },
  "conturi-toshl": {
    key: "conturi-toshl",
    label: "Conturi Toshl",
    table: listaConturiToshl,
    supabaseTable: "lista_conturi_toshl",
    insertSchema: insertListaConturiToshlSchema,
    columns: conturiToshlColumns,
    columnMap: buildColumnMap(conturiToshlColumns),
  },
  "cota-tva": {
    key: "cota-tva",
    label: "Cote TVA",
    table: listaCotaTva,
    supabaseTable: "lista_cota_tva",
    insertSchema: insertListaCotaTvaSchema,
    columns: cotaTvaColumns,
    columnMap: buildColumnMap(cotaTvaColumns),
  },
  "curs-valutar-bnr": {
    key: "curs-valutar-bnr",
    label: "Curs Valutar BNR",
    table: listaCursValutarBnr,
    supabaseTable: "lista_curs_valutar_bnr",
    insertSchema: insertListaCursValutarBnrSchema,
    columns: cursValutarBnrColumns,
    columnMap: buildColumnMap(cursValutarBnrColumns),
  },
  "oras-judet": {
    key: "oras-judet",
    label: "Orase si Judete",
    table: listaOrasJudet,
    supabaseTable: "lista_oras_judet",
    insertSchema: insertListaOrasJudetSchema,
    columns: orasJudetColumns,
    columnMap: buildColumnMap(orasJudetColumns),
  },
  "prefix-telefon": {
    key: "prefix-telefon",
    label: "Prefixe Telefonice",
    table: listaPrefixTelefon,
    supabaseTable: "lista_prefix_telefon",
    insertSchema: insertListaPrefixTelefonSchema,
    columns: prefixTelefonColumns,
    columnMap: buildColumnMap(prefixTelefonColumns),
  },
  "sector-bucuresti": {
    key: "sector-bucuresti",
    label: "Sectoare Bucuresti",
    table: listaSectorBucuresti,
    supabaseTable: "lista_sector_bucuresti",
    insertSchema: insertListaSectorBucurestiSchema,
    columns: sectorBucurestiColumns,
    columnMap: buildColumnMap(sectorBucurestiColumns),
  },
  "serie-ci": {
    key: "serie-ci",
    label: "Serii CI",
    table: listaSerieCi,
    supabaseTable: "lista_serie_ci",
    insertSchema: insertListaSerieCiSchema,
    columns: serieCiColumns,
    columnMap: buildColumnMap(serieCiColumns),
  },
  "tari": {
    key: "tari",
    label: "Tari",
    table: listaTari,
    supabaseTable: "lista_tari",
    insertSchema: insertListaTariSchema,
    columns: tariColumns,
    columnMap: buildColumnMap(tariColumns),
  },
  "tip-drumuri": {
    key: "tip-drumuri",
    label: "Tipuri Drumuri",
    table: listaTipDrumuri,
    supabaseTable: "lista_tip_drumuri",
    insertSchema: insertListaTipDrumuriSchema,
    columns: tipDrumuriColumns,
    columnMap: buildColumnMap(tipDrumuriColumns),
  },
  "tip-factura": {
    key: "tip-factura",
    label: "Tipuri Factura E-Factura",
    table: listaTipFactura,
    supabaseTable: "lista_tip_factura",
    insertSchema: insertListaTipFacturaSchema,
    columns: tipFacturaColumns,
    columnMap: buildColumnMap(tipFacturaColumns),
  },
  "tip-moneda": {
    key: "tip-moneda",
    label: "Tipuri Moneda",
    table: listaTipMoneda,
    supabaseTable: "lista_tip_moneda",
    insertSchema: insertListaTipMonedaSchema,
    columns: tipMonedaColumns,
    columnMap: buildColumnMap(tipMonedaColumns),
  },
  "tva-partener-anaf": {
    key: "tva-partener-anaf",
    label: "TVA Parteneri ANAF",
    table: listaTvaPartenerAnaf,
    supabaseTable: "lista_tva_partener_anaf",
    insertSchema: insertListaTvaPartenerAnafSchema,
    columns: tvaPartenerAnafColumns,
    columnMap: buildColumnMap(tvaPartenerAnafColumns),
  },
  "unitate-masura": {
    key: "unitate-masura",
    label: "Unitati de Masura",
    table: listaUnitateMasura,
    supabaseTable: "lista_unitate_masura",
    insertSchema: insertListaUnitateMasuraSchema,
    columns: unitateMasuraColumns,
    columnMap: buildColumnMap(unitateMasuraColumns),
  },
};

export const referenceListKeys = Object.keys(referenceListConfigs);
