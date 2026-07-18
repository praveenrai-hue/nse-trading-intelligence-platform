import type {
  Candle,
  MaxPain,
  OIAnalysis,
  PCR,
  ScanResponse,
  ScanRow,
  SmartMoney,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PREFIX = `${API_URL}/api/v1`;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }
  return (await res.json()) as T;
}

export function getScan(): Promise<ScanResponse> {
  return get<ScanResponse>(`${PREFIX}/scan`);
}

export function getScanSymbol(symbol: string): Promise<ScanRow> {
  return get<ScanRow>(`${PREFIX}/scan/${symbol}`);
}

export function getSmartMoney(symbol: string): Promise<SmartMoney> {
  return get<SmartMoney>(`${PREFIX}/smart-money/${symbol}`);
}

export function getChart(symbol: string): Promise<Candle[]> {
  return get<Candle[]>(`${PREFIX}/market/chart/${symbol}`);
}

export function getOIAnalysis(symbol: string): Promise<OIAnalysis> {
  return get<OIAnalysis>(`${PREFIX}/options/${symbol}/oi-analysis`);
}

export function getPCR(symbol: string): Promise<PCR> {
  return get<PCR>(`${PREFIX}/options/${symbol}/pcr`);
}

export function getMaxPain(symbol: string): Promise<MaxPain> {
  return get<MaxPain>(`${PREFIX}/options/${symbol}/max-pain`);
}

export { API_URL };
