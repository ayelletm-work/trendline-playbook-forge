import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Trash2, History } from 'lucide-react';
import { HistoricalTrade } from '../types/trade';
import { updateHistoricalTrade, deleteHistoricalTrade } from '../utils/tradeManager';

interface TradeHistoryProps {
  trades: HistoricalTrade[];
  onTradeUpdate: () => void;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onTradeUpdate }) => {
  const [editingTrade, setEditingTrade] = useState<HistoricalTrade | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<HistoricalTrade>>({});

  const handleEditClick = (trade: HistoricalTrade) => {
    setEditingTrade(trade);
    setEditFormData({
      outcome: trade.outcome,
      rrRatio: trade.rrRatio,
      notes: trade.notes || ''
    });
  };

  const handleEditSave = () => {
    if (editingTrade && editFormData) {
      updateHistoricalTrade(editingTrade.id, editFormData);
      setEditingTrade(null);
      setEditFormData({});
      onTradeUpdate();
    }
  };

  const handleDelete = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteHistoricalTrade(tradeId);
      onTradeUpdate();
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Win':
        return 'success';
      case 'Loss':
        return 'error';
      case 'Breakeven':
        return 'default';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (trades.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <History size={48} color="#9ca3af" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          No trades found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Trades matching your filters will appear here
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'var(--gradient-primary)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Setup</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Side</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entry</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Outcome</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>R:R</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tags</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow 
                key={trade.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease'
                  } 
                }}
              >
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.setupType}</TableCell>
                <TableCell>
                  <Chip 
                    label={trade.side} 
                    size="small" 
                    color={trade.side === 'LONG' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>{trade.entry}</TableCell>
                <TableCell>
                  <Chip 
                    label={trade.outcome} 
                    size="small" 
                    color={getOutcomeColor(trade.outcome) as any}
                  />
                </TableCell>
                <TableCell>{trade.rrRatio.toFixed(2)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                    {trade.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                    {trade.tags.length > 2 && (
                      <Chip label={`+${trade.tags.length - 2}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick(trade)}
                    sx={{ mr: 1, '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(trade.id)}
                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editingTrade} onClose={() => setEditingTrade(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Trade</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Outcome</InputLabel>
              <Select
                value={editFormData.outcome || ''}
                label="Outcome"
                onChange={(e) => setEditFormData({ ...editFormData, outcome: e.target.value as any })}
              >
                <MenuItem value="Win">Win</MenuItem>
                <MenuItem value="Loss">Loss</MenuItem>
                <MenuItem value="Breakeven">Breakeven</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="R:R Ratio"
              type="number"
              value={editFormData.rrRatio || ''}
              onChange={(e) => setEditFormData({ ...editFormData, rrRatio: parseFloat(e.target.value) || 0 })}
              inputProps={{ step: 0.1, min: -10, max: 20 }}
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={editFormData.notes || ''}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              placeholder="Add any notes about this trade..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTrade(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TradeHistory;