import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { TrendingUp } from 'lucide-react';

interface InstrumentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const instruments = [
  { value: '', label: 'Select Instrument' },
  { value: 'EURUSD', label: 'EUR/USD' },
  { value: 'GBPUSD', label: 'GBP/USD' },
  { value: 'USDJPY', label: 'USD/JPY' },
  { value: 'USDCHF', label: 'USD/CHF' },
  { value: 'AUDUSD', label: 'AUD/USD' },
  { value: 'USDCAD', label: 'USD/CAD' },
  { value: 'NZDUSD', label: 'NZD/USD' },
  { value: 'EURGBP', label: 'EUR/GBP' },
  { value: 'EURJPY', label: 'EUR/JPY' },
  { value: 'GBPJPY', label: 'GBP/JPY' },
  { value: 'XAUUSD', label: 'Gold (XAU/USD)' },
  { value: 'XAGUSD', label: 'Silver (XAG/USD)' },
  { value: 'US30', label: 'Dow Jones 30' },
  { value: 'US500', label: 'S&P 500' },
  { value: 'NAS100', label: 'NASDAQ 100' },
  { value: 'GER30', label: 'DAX 30' },
  { value: 'UK100', label: 'FTSE 100' },
  { value: 'JPN225', label: 'Nikkei 225' },
  { value: 'BTCUSD', label: 'Bitcoin' },
  { value: 'ETHUSD', label: 'Ethereum' },
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
        <TrendingUp size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
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