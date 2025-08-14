import { instrumentPresets, defaultInstrument } from '../types/instruments';

export interface TradeCalculationInputs {
  side: 'LONG' | 'SHORT';
  contracts: number;
  entry: number;
  exit?: number;
  stopLoss?: number;
  profitTarget?: number;
  accountEquity?: number;
  highestInTrade?: number;
  lowestInTrade?: number;
  feesPerContract: number;
  instrumentSymbol: string;
  tickSize?: number;
  tickValue?: number;
  contractMultiplier?: number;
}

export interface TradeCalculationResults {
  points: number;
  ticks: number;
  ticksPerContract: number;
  totalTicks: number;
  grossPnl: number;
  feesTotal: number;
  netPnl: number;
  positionNotional: number;
  tradeRiskDollar?: number;
  plannedRMultiple?: number;
  realizedRMultiple?: number;
  roiPercent?: number;
  priceMFE?: number;
  priceMAE?: number;
  mfeTicks?: number;
  maeTicks?: number;
  mfeDollar?: number;
  maeDollar?: number;
  isOpen: boolean;
}

export interface ValidationWarning {
  type: 'warning' | 'error';
  message: string;
  field: string;
}

export function calculateTrade(inputs: TradeCalculationInputs): TradeCalculationResults {
  const instrument = instrumentPresets[inputs.instrumentSymbol] || instrumentPresets[defaultInstrument];
  
  const dir = inputs.side === 'LONG' ? 1 : -1;
  const ts = inputs.tickSize || instrument.tickSize;
  const tv = inputs.tickValue || instrument.tickValue;
  const qty = inputs.contracts;
  const entry = inputs.entry;
  const exit = inputs.exit || inputs.profitTarget;
  
  // Basic calculations
  const points = exit ? (exit - entry) * dir : 0;
  const ticks = points ? Math.round((points / ts) * 10) / 10 : 0;
  const ticksPerContract = ticks;
  const totalTicks = ticks * qty;
  const grossPnl = totalTicks * tv;
  const feesTotal = qty * inputs.feesPerContract;
  const netPnl = grossPnl - feesTotal;
  const positionNotional = entry * (inputs.contractMultiplier || instrument.contractMultiplier) * qty;
  
  // Risk calculations
  let tradeRiskDollar: number | undefined;
  let plannedRMultiple: number | undefined;
  let realizedRMultiple: number | undefined;
  
  if (inputs.stopLoss) {
    tradeRiskDollar = Math.abs(entry - inputs.stopLoss) / ts * tv * qty;
    
    if (inputs.profitTarget) {
      plannedRMultiple = Math.abs(inputs.profitTarget - entry) / Math.abs(entry - inputs.stopLoss);
    }
    
    if (inputs.exit && tradeRiskDollar > 0) {
      realizedRMultiple = netPnl / tradeRiskDollar;
    }
  }
  
  // ROI calculation
  let roiPercent: number | undefined;
  if (inputs.accountEquity && inputs.accountEquity > 0) {
    roiPercent = (netPnl / inputs.accountEquity) * 100;
  }
  
  // MAE/MFE calculations
  let priceMFE: number | undefined;
  let priceMAE: number | undefined;
  let mfeTicks: number | undefined;
  let maeTicks: number | undefined;
  let mfeDollar: number | undefined;
  let maeDollar: number | undefined;
  
  if (inputs.highestInTrade !== undefined && inputs.lowestInTrade !== undefined) {
    priceMFE = inputs.side === 'LONG' 
      ? (inputs.highestInTrade - entry) 
      : (entry - inputs.lowestInTrade);
    
    priceMAE = inputs.side === 'LONG'
      ? (entry - inputs.lowestInTrade)
      : (inputs.highestInTrade - entry);
    
    if (priceMFE > 0) {
      mfeTicks = priceMFE / ts;
      mfeDollar = mfeTicks * tv * qty;
    }
    
    if (priceMAE > 0) {
      maeTicks = priceMAE / ts;
      maeDollar = maeTicks * tv * qty;
    }
  }
  
  return {
    points,
    ticks,
    ticksPerContract,
    totalTicks,
    grossPnl,
    feesTotal,
    netPnl,
    positionNotional,
    tradeRiskDollar,
    plannedRMultiple,
    realizedRMultiple,
    roiPercent,
    priceMFE,
    priceMAE,
    mfeTicks,
    maeTicks,
    mfeDollar,
    maeDollar,
    isOpen: !inputs.exit
  };
}

export function validateTradeInputs(inputs: TradeCalculationInputs): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  
  if (inputs.side === 'LONG') {
    if (inputs.profitTarget && inputs.profitTarget < inputs.entry) {
      warnings.push({
        type: 'warning',
        message: 'For LONG trades, profit target should typically be above entry price',
        field: 'profitTarget'
      });
    }
    if (inputs.stopLoss && inputs.stopLoss > inputs.entry) {
      warnings.push({
        type: 'warning',
        message: 'For LONG trades, stop loss should typically be below entry price',
        field: 'stopLoss'
      });
    }
  } else if (inputs.side === 'SHORT') {
    if (inputs.profitTarget && inputs.profitTarget > inputs.entry) {
      warnings.push({
        type: 'warning',
        message: 'For SHORT trades, profit target should typically be below entry price',
        field: 'profitTarget'
      });
    }
    if (inputs.stopLoss && inputs.stopLoss < inputs.entry) {
      warnings.push({
        type: 'warning',
        message: 'For SHORT trades, stop loss should typically be above entry price',
        field: 'stopLoss'
      });
    }
  }
  
  if (inputs.contracts <= 0) {
    warnings.push({
      type: 'error',
      message: 'Contracts must be greater than 0',
      field: 'contracts'
    });
  }
  
  return warnings;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPrice(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatTicks(value: number): string {
  return value.toFixed(1);
}