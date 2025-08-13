import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { TrendingUp } from 'lucide-react';

interface InstrumentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const instruments = [
  { value: '', label: 'Select Instrument' },
  { value: 'MES', label: 'Micro E-mini S&P 500 (MES)' },
  { value: 'MNQ', label: 'Micro E-mini Nasdaq-100 (MNQ)' },
  { value: 'MYM', label: 'Micro E-mini Dow (MYM)' },
  { value: 'M2K', label: 'Micro E-mini Russell 2000 (M2K)' },
  { value: 'MCL', label: 'Micro WTI Crude Oil (MCL)' },
  { value: 'MGC', label: 'Micro Gold (MGC)' },
  { value: 'SIL', label: 'Micro Silver (SIL)' },
  { value: 'M6E', label: 'Micro EUR/USD (M6E)' },
  { value: 'M6B', label: 'Micro GBP/USD (M6B)' },
  { value: 'M6J', label: 'Micro JPY/USD (M6J)' },
  { value: 'M6C', label: 'Micro CAD/USD (M6C)' },
  { value: 'M6A', label: 'Micro AUD/USD (M6A)' },
  { value: 'M6S', label: 'Micro CHF/USD (M6S)' },
  { value: 'MBT', label: 'Micro Bitcoin (MBT)' },
  { value: 'MET', label: 'Micro Ether (MET)' },
];

const InstrumentSelect: React.FC<InstrumentSelectProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  // Ensure value is never undefined
  const safeValue = value || '';

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="instrument-label">
        Instrument
      </InputLabel>
      <Select
        labelId="instrument-label"
        value={safeValue}
        onChange={handleChange}
        label="Instrument"
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
        {instruments.map((instrument) => (
          <MenuItem key={instrument.value} value={instrument.value}>
            {instrument.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default InstrumentSelect;