import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { JournalData, defaultJournalData } from '../utils/journalGenerator';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

interface JournalFormProps {
  onDataChange: (data: JournalData) => void;
  onReset: () => void;
}

const predefinedTags = [
  'Patience', 'Risk Management', 'Technical Analysis', 'Fundamental Analysis',
  'Emotional Control', 'Discipline', 'Market Structure', 'Volume Analysis',
  'Trend Following', 'Counter Trend', 'Breakout', 'Pullback', 'Support/Resistance',
  'Momentum', 'Reversal', 'Continuation', 'News Trading', 'Session Trading'
];

const JournalForm: React.FC<JournalFormProps> = ({ onDataChange, onReset }) => {
  const [formData, setFormData] = useState<JournalData>(() =>
    loadFromLocalStorage('journal-form-data', defaultJournalData)
  );

  useEffect(() => {
    saveToLocalStorage('journal-form-data', formData);
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (field: keyof JournalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'bullets' | 'positives' | 'negatives') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'bullets' | 'positives' | 'negatives', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'bullets' | 'positives' | 'negatives', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const resetForm = () => {
    setFormData(defaultJournalData);
    onReset();
  };

  const renderArrayInput = (
    field: 'bullets' | 'positives' | 'negatives',
    label: string,
    emoji: string
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          {emoji} {label}
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => addArrayItem(field)}
          variant="outlined"
        >
          Add
        </Button>
      </Box>
      {formData[field].map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={item}
            onChange={(e) => updateArrayItem(field, index, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
            sx={{ mr: 1 }}
          />
          <IconButton
            size="small"
            onClick={() => removeArrayItem(field, index)}
            color="error"
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Journal Entry Form
        </Typography>
        <Button variant="outlined" onClick={resetForm} size="small">
          Reset Journal
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Session"
            value={formData.session}
            onChange={(e) => handleInputChange('session', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 100%', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Setup Type"
            value={formData.setupType}
            onChange={(e) => handleInputChange('setupType', e.target.value)}
            size="small"
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        {renderArrayInput('bullets', 'Bullets', '📍')}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Side</InputLabel>
            <Select
              value={formData.side}
              label="Side"
              onChange={(e) => handleInputChange('side', e.target.value)}
            >
              <MenuItem value="LONG">LONG</MenuItem>
              <MenuItem value="SHORT">SHORT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Entry"
            value={formData.entry}
            onChange={(e) => handleInputChange('entry', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Stop Loss"
            value={formData.stopLoss}
            onChange={(e) => handleInputChange('stopLoss', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="TP1"
            value={formData.takeProfit1}
            onChange={(e) => handleInputChange('takeProfit1', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="TP2"
            value={formData.takeProfit2}
            onChange={(e) => handleInputChange('takeProfit2', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Contracts"
            value={formData.contracts}
            onChange={(e) => handleInputChange('contracts', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Risk"
            value={formData.risk}
            onChange={(e) => handleInputChange('risk', e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Reward Potential"
            value={formData.rewardPotential}
            onChange={(e) => handleInputChange('rewardPotential', e.target.value)}
            size="small"
          />
        </Box>
      </Box>

      {renderArrayInput('positives', 'Positives', '✅')}
      {renderArrayInput('negatives', 'Negatives', '❌')}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          🧠 Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {predefinedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => toggleTag(tag)}
              color={formData.tags.includes(tag) ? 'primary' : 'default'}
              variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default JournalForm;