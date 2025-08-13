import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { BarChart } from 'lucide-react';

interface TimeframeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const timeframes = [
  { value: '', label: 'Select Timeframe' },
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: '1M', label: '1 Month' },
];

const TimeframeSelect: React.FC<TimeframeSelectProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  // Ensure value is never undefined
  const safeValue = value || '';

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="timeframe-label">
        Timeframe
      </InputLabel>
      <Select
        labelId="timeframe-label"
        value={safeValue}
        onChange={handleChange}
        label="Timeframe"
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 'var(--shadow-medium)',
            },
          },
        }}
      >
        {timeframes.map((timeframe) => (
          <MenuItem key={timeframe.value} value={timeframe.value}>
            {timeframe.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TimeframeSelect;