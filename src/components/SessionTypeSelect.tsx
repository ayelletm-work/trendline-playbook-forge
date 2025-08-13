import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Clock } from 'lucide-react';

interface SessionTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const sessionTypes = [
  { value: '', label: 'Select Session Type' },
  { value: 'london', label: 'London Session' },
  { value: 'new-york', label: 'New York Session' },
  { value: 'tokyo', label: 'Tokyo Session' },
  { value: 'sydney', label: 'Sydney Session' },
  { value: 'london-new-york', label: 'London-NY Overlap' },
  { value: 'tokyo-london', label: 'Tokyo-London Overlap' },
  { value: 'weekend', label: 'Weekend Analysis' },
  { value: 'pre-market', label: 'Pre-Market' },
  { value: 'after-hours', label: 'After Hours' },
];

const SessionTypeSelect: React.FC<SessionTypeSelectProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="session-type-label">
        <Clock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Session Type
      </InputLabel>
      <Select
        labelId="session-type-label"
        value={value}
        onChange={handleChange}
        label="Session Type"
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
        {sessionTypes.map((session) => (
          <MenuItem key={session.value} value={session.value}>
            {session.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SessionTypeSelect;