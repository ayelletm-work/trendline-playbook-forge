import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { HistoricalTrade, TradeFilters } from '../types/trade';
import { 
  getHistoricalTrades, 
  filterTrades, 
  calculateStatistics, 
  getUniqueSetupTypes, 
  getUniqueTags 
} from '../utils/tradeManager';
import { exportTradesToCSV } from '../utils/csvExport';
import TradeFiltersComponent from './TradeFilters';
import StatisticsCard from './StatisticsCard';
import TradeHistory from './TradeHistory';

const Analyzer: React.FC = () => {
  const [trades, setTrades] = useState<HistoricalTrade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<HistoricalTrade[]>([]);
  const [filters, setFilters] = useState<TradeFilters>({
    setupType: 'all',
    tags: [],
    outcome: 'all'
  });
  const [tabValue, setTabValue] = useState(0);

  const loadTrades = () => {
    const allTrades = getHistoricalTrades();
    setTrades(allTrades);
  };

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    const filtered = filterTrades(trades, filters);
    setFilteredTrades(filtered);
  }, [trades, filters]);

  const handleFiltersChange = (newFilters: TradeFilters) => {
    setFilters(newFilters);
  };

  const handleExportCSV = () => {
    exportTradesToCSV(filteredTrades, 'trading-analysis');
  };

  const statistics = calculateStatistics(filteredTrades);
  const setupTypes = getUniqueSetupTypes(trades);
  const availableTags = getUniqueTags(trades);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        background: 'var(--gradient-accent)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--gradient-success)',
        }
      }}
      className="animate-fade-in"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart3 className="animate-pulse-slow" size={24} color="#16a34a" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Playbook Analyzer
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={handleExportCSV}
          size="small"
          disabled={filteredTrades.length === 0}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              background: 'var(--gradient-success)',
              color: 'white',
              borderColor: 'transparent'
            }
          }}
        >
          Export CSV
        </Button>
      </Box>

      <TradeFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        setupTypes={setupTypes}
        availableTags={availableTags}
      />

      <Box sx={{ mb: 3 }}>
        <StatisticsCard statistics={statistics} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={`Trade History (${filteredTrades.length})`} 
            icon={<TrendingUp size={16} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <TradeHistory 
          trades={filteredTrades} 
          onTradeUpdate={loadTrades}
        />
      )}

      {trades.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <BarChart3 size={48} color="#9ca3af" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No Trading History Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete some journal entries and save them as trades to start analyzing your performance.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Analyzer;