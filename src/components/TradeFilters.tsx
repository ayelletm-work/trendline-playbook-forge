import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { Filter, Calendar } from 'lucide-react';
import { TradeFilters } from '../types/trade';

interface TradeFiltersProps {
  filters: TradeFilters;
  onFiltersChange: (filters: TradeFilters) => void;
  setupTypes: string[];
  availableTags: string[];
}

const TradeFiltersComponent: React.FC<TradeFiltersProps> = ({
  filters,
  onFiltersChange,
  setupTypes,
  availableTags
}) => {
  const handleSetupTypeChange = (setupType: string) => {
    onFiltersChange({ ...filters, setupType });
  };

  const handleOutcomeChange = (outcome: string) => {
    onFiltersChange({ ...filters, outcome });
  };

  const handleTagsChange = (tags: string[]) => {
    onFiltersChange({ ...filters, tags });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Filter className="animate-pulse-slow" size={20} color="#3b82f6" />
        <Typography variant="h6" fontWeight="bold">
          Filter Trades
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Setup Type</InputLabel>
            <Select
              value={filters.setupType || 'all'}
              label="Setup Type"
              onChange={(e) => handleSetupTypeChange(e.target.value)}
            >
              <MenuItem value="all">All Setup Types</MenuItem>
              {setupTypes.map((setupType) => (
                <MenuItem key={setupType} value={setupType}>
                  {setupType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Outcome</InputLabel>
            <Select
              value={filters.outcome || 'all'}
              label="Outcome"
              onChange={(e) => handleOutcomeChange(e.target.value)}
            >
              <MenuItem value="all">All Outcomes</MenuItem>
              <MenuItem value="Win">Win</MenuItem>
              <MenuItem value="Loss">Loss</MenuItem>
              <MenuItem value="Breakeven">Breakeven</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={filters.tags}
              onChange={(e) => handleTagsChange(e.target.value as string[])}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 150px', minWidth: 150, position: 'relative' }}>
          <Calendar size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleDateChange('dateFrom', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                paddingLeft: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              } 
            }}
          />
        </Box>

        <Box sx={{ flex: '1 1 150px', minWidth: 150, position: 'relative' }}>
          <Calendar size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleDateChange('dateTo', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                paddingLeft: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              } 
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TradeFiltersComponent;