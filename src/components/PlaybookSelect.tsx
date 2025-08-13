import React, { useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent, 
  Box, 
  Typography, 
  Rating,
  Chip,
  Divider
} from '@mui/material';
import { BookOpen, Star } from 'lucide-react';

interface PlaybookData {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  defaultGrade: number;
}

interface PlaybookSelectProps {
  value: string;
  onPlaybookChange: (playbook: PlaybookData | null) => void;
  onGradeChange: (grade: number) => void;
  grade: number;
}

const playbooks: PlaybookData[] = [
  {
    id: '',
    name: 'Select Playbook',
    description: '',
    bullets: [],
    defaultGrade: 0,
  },
  {
    id: 'trendline-bounce',
    name: 'Trendline Bounce Setup',
    description: 'Price bounces off a respected trendline with confluence',
    bullets: [
      'Identify clear trendline with at least 3 touches',
      'Wait for price to approach trendline',
      'Look for reversal candlestick patterns',
      'Confirm with volume increase on bounce',
      'Set stop loss below trendline',
      'Target previous swing high/low',
    ],
    defaultGrade: 4,
  },
  {
    id: 'breakout-retest',
    name: 'Breakout & Retest',
    description: 'Price breaks key level and retests for continuation',
    bullets: [
      'Identify strong resistance/support level',
      'Wait for decisive break with volume',
      'Look for retest of broken level',
      'Confirm rejection at retest level',
      'Enter on continuation signal',
      'Set stop below/above retest level',
    ],
    defaultGrade: 5,
  },
  {
    id: 'support-resistance-reversal',
    name: 'Support/Resistance Reversal',
    description: 'Price reverses at key support or resistance zones',
    bullets: [
      'Identify key S/R zones on higher timeframes',
      'Wait for price to reach zone',
      'Look for rejection candles',
      'Confirm with RSI divergence',
      'Enter on reversal confirmation',
      'Set tight stop beyond S/R zone',
    ],
    defaultGrade: 4,
  },
  {
    id: 'momentum-continuation',
    name: 'Momentum Continuation',
    description: 'Riding strong momentum after brief consolidation',
    bullets: [
      'Identify strong trend direction',
      'Wait for brief consolidation/pullback',
      'Look for continuation patterns',
      'Confirm momentum with indicators',
      'Enter on breakout from consolidation',
      'Trail stop to protect profits',
    ],
    defaultGrade: 3,
  },
];

const PlaybookSelect: React.FC<PlaybookSelectProps> = ({ 
  value, 
  onPlaybookChange, 
  onGradeChange,
  grade 
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookData | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    const playbookId = event.target.value;
    const playbook = playbooks.find(p => p.id === playbookId) || null;
    
    setSelectedPlaybook(playbook);
    onPlaybookChange(playbook);
    
    if (playbook && playbook.defaultGrade > 0) {
      onGradeChange(playbook.defaultGrade);
    }
  };

  const handleGradeChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      onGradeChange(newValue);
    }
  };

  return (
    <Box>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="playbook-label">
          <BookOpen size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Playbook Strategy
        </InputLabel>
        <Select
          labelId="playbook-label"
          value={value}
          onChange={handleChange}
          label="Playbook Strategy"
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
          {playbooks.map((playbook) => (
            <MenuItem key={playbook.id} value={playbook.id}>
              {playbook.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedPlaybook && selectedPlaybook.id && (
        <Box sx={{ mt: 3, p: 3, borderRadius: 2, background: 'var(--gradient-accent)' }} className="animate-fade-in">
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpen size={20} />
            {selectedPlaybook.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedPlaybook.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="subtitle2">Playbook Grade:</Typography>
            <Rating
              value={grade}
              onChange={handleGradeChange}
              max={5}
              icon={<Star size={20} />}
              emptyIcon={<Star size={20} />}
              sx={{
                '& .MuiRating-icon': {
                  color: '#ffc107',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#e0e0e0',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              ({grade}/5)
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Setup Checklist:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedPlaybook.bullets.map((bullet, index) => (
              <Chip
                key={index}
                label={bullet}
                variant="outlined"
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: 'auto',
                  padding: '8px 4px',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    textAlign: 'left',
                  },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    transform: 'scale(1.02)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlaybookSelect;