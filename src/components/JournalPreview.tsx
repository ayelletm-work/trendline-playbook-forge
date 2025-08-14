import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { Eye, Copy, Download, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { JournalData, generateJournalText } from '../utils/journalGenerator';

interface JournalPreviewProps {
  journalData: JournalData;
}

const JournalPreview: React.FC<JournalPreviewProps> = ({ journalData }) => {
  const journalText = generateJournalText(journalData);

  // Calculate potential win/loss based on trade data
  const calculateTradeOutcome = () => {
    const entryPrice = parseFloat(journalData.entry);
    const stopLoss = parseFloat(journalData.stopLoss);
    const takeProfit1 = parseFloat(journalData.takeProfit1);
    const riskAmount = parseFloat(journalData.risk.replace(/[^0-9.-]/g, ''));
    
    if (!entryPrice || !stopLoss || !takeProfit1 || !riskAmount) {
      return { type: 'neutral', amount: 0, rrRatio: '0:0' };
    }

    const isLong = journalData.side === 'LONG';
    const riskDistance = Math.abs(entryPrice - stopLoss);
    const rewardDistance = Math.abs(takeProfit1 - entryPrice);
    const rrRatio = riskDistance > 0 ? (rewardDistance / riskDistance).toFixed(1) : '0';
    const potentialWin = (rewardDistance / riskDistance) * riskAmount;

    return {
      type: potentialWin > riskAmount ? 'win' : 'loss',
      amount: potentialWin,
      rrRatio: `${rrRatio}:1`,
      riskAmount
    };
  };

  const outcome = calculateTradeOutcome();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(journalText);
      // You could add a toast notification here
      console.log('Journal copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([journalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-${journalData.date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <Eye className="animate-pulse-slow" size={24} color="#16a34a" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Journal Preview
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Copy size={16} />}
            onClick={copyToClipboard}
            size="small"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                background: 'var(--gradient-primary)',
                color: 'white',
                borderColor: 'transparent'
              }
            }}
          >
            Copy
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={downloadAsFile}
            size="small"
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
            Download .txt
          </Button>
        </Box>
      </Box>

      {/* Trade Outcome Display */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: outcome.type === 'win' 
            ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
            : outcome.type === 'loss' 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #6b7280, #4b5563)',
          color: 'white',
          boxShadow: 'var(--shadow-medium)',
          animation: 'pulse 2s infinite'
        }}
      >
        {outcome.type === 'win' ? (
          <TrendingUp size={24} className="animate-bounce" />
        ) : outcome.type === 'loss' ? (
          <TrendingDown size={24} className="animate-bounce" />
        ) : (
          <Target size={24} className="animate-spin" />
        )}
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {outcome.type === 'win' ? '🎉 Potential Win!' : 
             outcome.type === 'loss' ? '⚠️ High Risk Trade' : 
             '📊 Trade Analysis'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {outcome.amount > 0 && (
              <>
                Risk: ${outcome.riskAmount?.toFixed(2)} | 
                Reward: ${outcome.amount.toFixed(2)} | 
                R:R {outcome.rrRatio}
              </>
            )}
            {outcome.amount === 0 && 'Complete trade details to see analysis'}
          </Typography>
        </Box>

        {outcome.type === 'win' && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <span>🚀</span>
            <span>💰</span>
            <span>⭐</span>
          </Box>
        )}
        {outcome.type === 'loss' && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <span>🛡️</span>
            <span>📉</span>
            <span>⚡</span>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          fontFamily: 'Titillium Web, sans-serif',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          maxHeight: '400px',
          overflow: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-medium)',
          '&:hover': {
            boxShadow: 'var(--shadow-large)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
        className="font-titillium"
      >
        {journalText}
      </Box>
    </Paper>
  );
};

export default JournalPreview;