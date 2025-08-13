export interface HistoricalTrade {
  id: string;
  date: string;
  setupType: string;
  side: 'LONG' | 'SHORT';
  entry: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  outcome: 'Win' | 'Loss' | 'Breakeven' | 'Pending';
  rrRatio: number;
  tags: string[];
  createdAt: string;
  notes?: string;
}

export interface TradeFilters {
  setupType: string;
  tags: string[];
  outcome: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TradeStatistics {
  totalTrades: number;
  winRate: number;
  averageRR: number;
  grade: 'A++' | 'A' | 'B' | 'No-trade';
  gradeColor: 'success' | 'warning' | 'error';
}