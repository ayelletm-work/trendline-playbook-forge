import { HistoricalTrade } from '../types/trade';

export const exportTradesToCSV = (trades: HistoricalTrade[], filename: string = 'trading-history'): void => {
  if (trades.length === 0) {
    alert('No trades to export');
    return;
  }

  const headers = [
    'Date',
    'Setup Type',
    'Side',
    'Entry',
    'Stop Loss',
    'Take Profit 1',
    'Take Profit 2',
    'Outcome',
    'R:R Ratio',
    'Tags',
    'Notes',
    'Created At'
  ];

  const csvContent = [
    headers.join(','),
    ...trades.map(trade => [
      `"${trade.date}"`,
      `"${trade.setupType}"`,
      `"${trade.side}"`,
      `"${trade.entry}"`,
      `"${trade.stopLoss}"`,
      `"${trade.takeProfit1}"`,
      `"${trade.takeProfit2}"`,
      `"${trade.outcome}"`,
      trade.rrRatio.toString(),
      `"${trade.tags.join('; ')}"`,
      `"${trade.notes || ''}"`,
      `"${trade.createdAt}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};