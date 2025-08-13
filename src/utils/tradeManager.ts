import { HistoricalTrade, TradeFilters, TradeStatistics } from '../types/trade';
import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';

const TRADES_STORAGE_KEY = 'historical-trades';

export const saveHistoricalTrade = (trade: HistoricalTrade): void => {
  const trades = getHistoricalTrades();
  const updatedTrades = [trade, ...trades];
  saveToLocalStorage(TRADES_STORAGE_KEY, updatedTrades);
};

export const getHistoricalTrades = (): HistoricalTrade[] => {
  return loadFromLocalStorage(TRADES_STORAGE_KEY, []);
};

export const updateHistoricalTrade = (tradeId: string, updates: Partial<HistoricalTrade>): void => {
  const trades = getHistoricalTrades();
  const updatedTrades = trades.map(trade => 
    trade.id === tradeId ? { ...trade, ...updates } : trade
  );
  saveToLocalStorage(TRADES_STORAGE_KEY, updatedTrades);
};

export const deleteHistoricalTrade = (tradeId: string): void => {
  const trades = getHistoricalTrades();
  const filteredTrades = trades.filter(trade => trade.id !== tradeId);
  saveToLocalStorage(TRADES_STORAGE_KEY, filteredTrades);
};

export const filterTrades = (trades: HistoricalTrade[], filters: TradeFilters): HistoricalTrade[] => {
  return trades.filter(trade => {
    if (filters.setupType && filters.setupType !== 'all' && trade.setupType !== filters.setupType) {
      return false;
    }
    
    if (filters.outcome && filters.outcome !== 'all' && trade.outcome !== filters.outcome) {
      return false;
    }
    
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => trade.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    if (filters.dateFrom) {
      const tradeDate = new Date(trade.date);
      const fromDate = new Date(filters.dateFrom);
      if (tradeDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const tradeDate = new Date(trade.date);
      const toDate = new Date(filters.dateTo);
      if (tradeDate > toDate) return false;
    }
    
    return true;
  });
};

export const calculateStatistics = (trades: HistoricalTrade[]): TradeStatistics => {
  const completedTrades = trades.filter(trade => trade.outcome !== 'Pending');
  const totalTrades = completedTrades.length;
  
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      averageRR: 0,
      grade: 'No-trade',
      gradeColor: 'error'
    };
  }
  
  const winningTrades = completedTrades.filter(trade => trade.outcome === 'Win');
  const winRate = (winningTrades.length / totalTrades) * 100;
  
  const averageRR = completedTrades.reduce((sum, trade) => sum + trade.rrRatio, 0) / totalTrades;
  
  let grade: 'A++' | 'A' | 'B' | 'No-trade' = 'No-trade';
  let gradeColor: 'success' | 'warning' | 'error' = 'error';
  
  if (winRate >= 70 && averageRR >= 2.5) {
    grade = 'A++';
    gradeColor = 'success';
  } else if (winRate >= 60 && averageRR >= 2.0) {
    grade = 'A';
    gradeColor = 'success';
  } else if (winRate >= 50 && averageRR >= 1.5) {
    grade = 'B';
    gradeColor = 'warning';
  }
  
  return {
    totalTrades,
    winRate: Math.round(winRate * 100) / 100,
    averageRR: Math.round(averageRR * 100) / 100,
    grade,
    gradeColor
  };
};

export const getUniqueSetupTypes = (trades: HistoricalTrade[]): string[] => {
  const setupTypes = trades.map(trade => trade.setupType);
  return Array.from(new Set(setupTypes)).sort();
};

export const getUniqueTags = (trades: HistoricalTrade[]): string[] => {
  const allTags = trades.flatMap(trade => trade.tags);
  return Array.from(new Set(allTags)).sort();
};