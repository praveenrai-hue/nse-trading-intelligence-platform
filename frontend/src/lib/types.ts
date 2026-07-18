export interface ScanRow {
  symbol: string;
  spot_price: number | null;
  bullish_score: number;
  bearish_score: number;
  confidence_score: number;
  structure_score: number;
  liquidity_score: number;
  smart_money_score: number;
  direction: "Bullish" | "Bearish" | "Neutral";
  structure_bias: string;
  reasons: string[];
}

export interface ScanResponse {
  generated_at: string;
  results: ScanRow[];
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StructurePoint {
  type: string;
  price: number;
  index: number;
  time: string | null;
}

export interface StructureShift {
  type: string;
  direction: string;
  price: number;
  index: number;
  time: string | null;
}

export interface LiquidityZone {
  type: string;
  price: number;
  direction: string | null;
  index: number;
  time: string | null;
}

export interface Zone {
  top: number;
  bottom: number;
  direction: string;
  index: number;
  time: string | null;
  filled: boolean;
}

export interface BreakoutZone {
  type: string;
  direction: string | null;
  level: number | null;
  range_high: number | null;
  range_low: number | null;
  strength: number | null;
  index: number;
  time: string | null;
}

export interface SmartMoney {
  symbol: string;
  structure: { symbol: string; trend: string; swing_points: StructurePoint[]; shifts: StructureShift[] };
  liquidity: { symbol: string; zones: LiquidityZone[] };
  fair_value_gaps: Zone[];
  order_blocks: Zone[];
  volume_imbalances: Zone[];
  breakouts: BreakoutZone[];
  structure_score: number;
  liquidity_score: number;
  smart_money_score: number;
  structure_bias: string;
}

export interface OIAnalysis {
  symbol: string;
  call_writing_strikes: number[];
  put_writing_strikes: number[];
  atm_strike: number | null;
  atm_oi_concentration: number;
  buildups: {
    strike: number;
    option_type: string;
    buildup_type: string;
    oi_change: number;
    price_change_percent: number;
  }[];
}

export interface PCR {
  symbol: string;
  pcr_oi: number;
  pcr_volume: number;
  put_oi_total: number;
  call_oi_total: number;
  sentiment: string;
}

export interface MaxPain {
  symbol: string;
  max_pain_level: number;
  spot_price: number | null;
  direction: string;
}
