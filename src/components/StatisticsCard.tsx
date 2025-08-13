import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { TrendingUp, Target, Award } from 'lucide-react';
import { TradeStatistics } from '../types/trade';

interface StatisticsCardProps {
  statistics: TradeStatistics;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
  const getGradeIcon = () => {
    switch (statistics.grade) {
      case 'A++':
      case 'A':
        return <Award className="animate-bounce-subtle" size={32} />;
      case 'B':
        return <Target size={32} />;
      default:
        return <TrendingUp size={32} />;
    }
  };

  const getGradientBackground = () => {
    switch (statistics.gradeColor) {
      case 'success':
        return 'var(--gradient-success)';
      case 'warning':
        return 'var(--gradient-warning)';
      default:
        return 'var(--gradient-accent)';
    }
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        background: getGradientBackground(),
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--shadow-large)'
        }
      }}
      className="animate-scale-in"
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Playbook Performance
          </Typography>
          {getGradeIcon()}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" className="animate-pulse-slow">
              {statistics.winRate}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Win Rate
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold">
              {statistics.averageRR}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Avg R:R
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold">
              {statistics.totalTrades}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Trades
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight="medium">
            Playbook Grade:
          </Typography>
          <Chip
            label={statistics.grade}
            size="medium"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              padding: '8px 16px',
              height: 'auto',
              '& .MuiChip-label': {
                padding: '8px 12px'
              }
            }}
          />
        </Box>

        {statistics.totalTrades === 0 && (
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.9, textAlign: 'center' }}>
            No trades match the current filters. Start adding trades to see your performance metrics.
          </Typography>
        )}

        {statistics.grade === 'No-trade' && statistics.totalTrades > 0 && (
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.9, textAlign: 'center' }}>
            This setup needs improvement. Consider refining your strategy or avoiding this pattern.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;