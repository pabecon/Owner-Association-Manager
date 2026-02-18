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
  insertSchema: z.ZodTypeAny;
  columns: ListColumn[];
}

export const referenceListConfigs: Record<string, ReferenceListConfig> = {
  "atribute-fiscale": {
    key: "atribute-fiscale",
    label: "Atribute Fiscale",
    table: listaAtributeFiscale,
    insertSchema: insertListaAtributeFiscaleSchema,
    columns: [
      { key: "atributFiscal", label: "Atribut Fiscal", required: true },
      { key: "explicatie", label: "Explicatie", required: false },
    ],
  },
  "banca": {
    key: "banca",
    label: "Banci",
    table: listaBanca,
    insertSchema: insertListaBancaSchema,
    columns: [
      { key: "tara", label: "Tara", required: true },
      { key: "codBancarTara", label: "Cod Bancar Tara", required: true },
      { key: "numeBanca", label: "Nume Banca", required: true },
      { key: "swift", label: "SWIFT", required: true },
      { key: "ibanCod", label: "IBAN Cod", required: true },
      { key: "telefon", label: "Telefon", required: false },
    ],
  },
  "banci-conturi": {
    key: "banci-conturi",
    label: "Conturi Bancare",
    table: listaBanciConturi,
    insertSchema: insertListaBanciConturiSchema,
    columns: [
      { key: "idCont", label: "ID Cont", required: true },
      { key: "numeCont", label: "Nume Cont", required: true },
      { key: "banca", label: "Banca", required: true },
      { key: "iban", label: "IBAN", required: true },
      { key: "titular", label: "Titular", required: true },
      { key: "valuta", label: "Valuta", required: true },
      { key: "tip", label: "Tip", required: true },
      { key: "posesor", label: "Posesor", required: true },
    ],
  },
  "conexiune-bancare": {
    key: "conexiune-bancare",
    label: "Conexiuni Bancare",
    table: listaConexiuneBancare,
    insertSchema: insertListaConexiuneBancareSchema,
    columns: [
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
    ],
  },
  "conturi-toshl": {
    key: "conturi-toshl",
    label: "Conturi Toshl",
    table: listaConturiToshl,
    insertSchema: insertListaConturiToshlSchema,
    columns: [
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
    ],
  },
  "cota-tva": {
    key: "cota-tva",
    label: "Cote TVA",
    table: listaCotaTva,
    insertSchema: insertListaCotaTvaSchema,
    columns: [
      { key: "cotaDeTva", label: "Cota de TVA", required: true },
    ],
  },
  "curs-valutar-bnr": {
    key: "curs-valutar-bnr",
    label: "Curs Valutar BNR",
    table: listaCursValutarBnr,
    insertSchema: insertListaCursValutarBnrSchema,
    columns: [
      { key: "dataInceput", label: "Data Inceput", required: true },
      { key: "dataSfarsit", label: "Data Sfarsit", required: true },
      { key: "moneda", label: "Moneda", required: true },
      { key: "curs", label: "Curs", required: true },
    ],
  },
  "oras-judet": {
    key: "oras-judet",
    label: "Orase si Judete",
    table: listaOrasJudet,
    insertSchema: insertListaOrasJudetSchema,
    columns: [
      { key: "tara", label: "Tara", required: true },
      { key: "comuna", label: "Comuna", required: true },
      { key: "oras", label: "Oras", required: true },
      { key: "judet", label: "Judet", required: true },
      { key: "concatenate", label: "Concatenare", required: false },
      { key: "uid", label: "UID", required: false },
    ],
  },
  "prefix-telefon": {
    key: "prefix-telefon",
    label: "Prefixe Telefonice",
    table: listaPrefixTelefon,
    insertSchema: insertListaPrefixTelefonSchema,
    columns: [
      { key: "tara", label: "Tara", required: true },
      { key: "prefix", label: "Prefix", required: true },
    ],
  },
  "sector-bucuresti": {
    key: "sector-bucuresti",
    label: "Sectoare Bucuresti",
    table: listaSectorBucuresti,
    insertSchema: insertListaSectorBucurestiSchema,
    columns: [
      { key: "sector", label: "Sector", required: true },
    ],
  },
  "serie-ci": {
    key: "serie-ci",
    label: "Serii CI",
    table: listaSerieCi,
    insertSchema: insertListaSerieCiSchema,
    columns: [
      { key: "judet", label: "Judet", required: true },
      { key: "serieCi", label: "Serie CI", required: true },
    ],
  },
  "tari": {
    key: "tari",
    label: "Tari",
    table: listaTari,
    insertSchema: insertListaTariSchema,
    columns: [
      { key: "tara", label: "Tara", required: true },
    ],
  },
  "tip-drumuri": {
    key: "tip-drumuri",
    label: "Tipuri Drumuri",
    table: listaTipDrumuri,
    insertSchema: insertListaTipDrumuriSchema,
    columns: [
      { key: "tipDrum", label: "Tip Drum", required: true },
    ],
  },
  "tip-factura": {
    key: "tip-factura",
    label: "Tipuri Factura E-Factura",
    table: listaTipFactura,
    insertSchema: insertListaTipFacturaSchema,
    columns: [
      { key: "codTipFactura", label: "Cod Tip Factura", required: true },
      { key: "tipFactura", label: "Tip Factura", required: true },
    ],
  },
  "tip-moneda": {
    key: "tip-moneda",
    label: "Tipuri Moneda",
    table: listaTipMoneda,
    insertSchema: insertListaTipMonedaSchema,
    columns: [
      { key: "tipMoneda", label: "Tip Moneda", required: true },
    ],
  },
  "tva-partener-anaf": {
    key: "tva-partener-anaf",
    label: "TVA Parteneri ANAF",
    table: listaTvaPartenerAnaf,
    insertSchema: insertListaTvaPartenerAnafSchema,
    columns: [
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
    ],
  },
  "unitate-masura": {
    key: "unitate-masura",
    label: "Unitati de Masura",
    table: listaUnitateMasura,
    insertSchema: insertListaUnitateMasuraSchema,
    columns: [
      { key: "categorie", label: "Categorie", required: false },
      { key: "singular", label: "Singular", required: true },
      { key: "plural", label: "Plural", required: true },
      { key: "simbol", label: "Simbol", required: false },
    ],
  },
};

export const referenceListKeys = Object.keys(referenceListConfigs);
