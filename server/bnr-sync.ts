import { db } from "./db";
import { listaCursValutarBnr } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { parseStringPromise } from "xml2js";

const BNR_CURRENT_URL = "https://www.bnr.ro/nbrfxrates.xml";
const BNR_YEARLY_URL = (year: number) =>
  `https://www.bnr.ro/files/xml/years/nbrfxrates${year}.xml`;

interface BnrRate {
  date: string;
  currency: string;
  rate: string;
  multiplier: number;
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function parseRatesFromXml(xmlData: any): BnrRate[] {
  const rates: BnrRate[] = [];
  const body = xmlData?.DataSet?.Body?.[0];
  if (!body) return rates;

  const cubes = body.Cube || [];
  for (const cube of cubes) {
    const date = cube?.$?.date;
    if (!date) continue;
    const rateElements = cube.Rate || [];
    for (const r of rateElements) {
      const currency = r?.$?.currency;
      const multiplier = r?.$?.multiplier ? parseInt(r.$.multiplier) : 1;
      const value = typeof r === "string" ? r : r._ || r;
      if (currency && value) {
        rates.push({
          date,
          currency,
          rate: String(value),
          multiplier,
        });
      }
    }
  }
  return rates;
}

async function insertRates(rates: BnrRate[]): Promise<number> {
  if (rates.length === 0) return 0;
  let inserted = 0;

  const batchSize = 500;
  for (let i = 0; i < rates.length; i += batchSize) {
    const batch = rates.slice(i, i + batchSize);
    const values = batch.map((r) => ({
      dataInceput: r.date,
      dataSfarsit: r.date,
      moneda: r.multiplier > 1 ? `${r.multiplier}${r.currency}` : r.currency,
      curs: r.rate,
    }));

    await db
      .insert(listaCursValutarBnr)
      .values(values)
      .onConflictDoNothing();
    inserted += batch.length;
  }
  return inserted;
}

export async function syncCurrentRates(): Promise<{
  date: string;
  count: number;
}> {
  const xml = await fetchXml(BNR_CURRENT_URL);
  const parsed = await parseStringPromise(xml);
  const rates = parseRatesFromXml(parsed);
  if (rates.length === 0) return { date: "", count: 0 };

  const existingForDate = await db
    .select({ id: listaCursValutarBnr.id })
    .from(listaCursValutarBnr)
    .where(eq(listaCursValutarBnr.dataInceput, rates[0].date))
    .limit(1);

  if (existingForDate.length > 0) {
    return { date: rates[0].date, count: 0 };
  }

  const count = await insertRates(rates);
  return { date: rates[0].date, count };
}

export async function syncYearRates(year: number): Promise<number> {
  const url = year === new Date().getFullYear() ? BNR_CURRENT_URL : BNR_YEARLY_URL(year);
  const xml = await fetchXml(url);
  const parsed = await parseStringPromise(xml);
  const rates = parseRatesFromXml(parsed);
  return insertRates(rates);
}

export async function syncHistoricalRates(
  fromYear: number,
  toYear: number,
  onProgress?: (year: number, total: number) => void
): Promise<{ totalInserted: number; yearsProcessed: number }> {
  let totalInserted = 0;
  let yearsProcessed = 0;
  const currentYear = new Date().getFullYear();

  for (let year = fromYear; year <= toYear; year++) {
    try {
      const count = await syncYearRates(year);
      totalInserted += count;
      yearsProcessed++;
      if (onProgress) onProgress(year, count);
      console.log(`[BNR Sync] Year ${year}: ${count} rates processed`);
    } catch (err) {
      console.error(`[BNR Sync] Error syncing year ${year}:`, err);
    }
  }

  if (toYear >= currentYear) {
    try {
      const result = await syncCurrentRates();
      totalInserted += result.count;
      console.log(`[BNR Sync] Current rates (${result.date}): ${result.count} new`);
    } catch (err) {
      console.error("[BNR Sync] Error syncing current rates:", err);
    }
  }

  return { totalInserted, yearsProcessed };
}

export async function getLastSyncDate(): Promise<string | null> {
  const result = await db
    .select({ maxDate: sql<string>`MAX(${listaCursValutarBnr.dataInceput})` })
    .from(listaCursValutarBnr);
  return result[0]?.maxDate || null;
}

export async function getTotalRatesCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(listaCursValutarBnr);
  return Number(result[0]?.count || 0);
}

export async function getAvailableCurrencies(): Promise<string[]> {
  const result = await db
    .selectDistinct({ moneda: listaCursValutarBnr.moneda })
    .from(listaCursValutarBnr)
    .orderBy(listaCursValutarBnr.moneda);
  return result.map((r) => r.moneda);
}

export function startDailySync() {
  const checkAndSync = () => {
    const now = new Date();
    const bucharestOffset = getBucharestOffset(now);
    const bucharestHour =
      (now.getUTCHours() + bucharestOffset + 24) % 24;
    const bucharestMinute = now.getUTCMinutes();

    if (bucharestHour === 14 && bucharestMinute === 0) {
      console.log("[BNR Sync] Daily sync triggered at 14:00 Bucharest time");
      syncCurrentRates()
        .then((result) => {
          console.log(
            `[BNR Sync] Daily sync complete: ${result.count} new rates for ${result.date}`
          );
        })
        .catch((err) => {
          console.error("[BNR Sync] Daily sync error:", err);
        });
    }
  };

  setInterval(checkAndSync, 60 * 1000);
  console.log("[BNR Sync] Daily sync scheduler started (14:00 Bucharest time)");
}

function getBucharestOffset(date: Date): number {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdOffset = Math.max(
    jan.getTimezoneOffset(),
    jul.getTimezoneOffset()
  );

  const lastSundayMarch = getLastSunday(date.getFullYear(), 2);
  const lastSundayOctober = getLastSunday(date.getFullYear(), 9);

  if (date >= lastSundayMarch && date < lastSundayOctober) {
    return 3;
  }
  return 2;
}

function getLastSunday(year: number, month: number): Date {
  const d = new Date(Date.UTC(year, month + 1, 0, 1, 0, 0));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}
