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
import { 
  Calendar, 
  Clock, 
  Target, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle,
  MinusCircle,
  Hash,
  FileText,
  DollarSign,
  Calculator,
  Save,
  Star
} from 'lucide-react';
import { JournalData, defaultJournalData } from '../utils/journalGenerator';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { HistoricalTrade } from '../types/trade';
import { saveHistoricalTrade } from '../utils/tradeManager';

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
  const [newTagInput, setNewTagInput] = useState('');
  const [isRiskManuallyEdited, setIsRiskManuallyEdited] = useState(false);

  useEffect(() => {
    saveToLocalStorage('journal-form-data', formData);
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (field: keyof JournalData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate risk when account balance changes
      if (field === 'accountBalance' && !isRiskManuallyEdited) {
        const balance = parseFloat(value) || 0;
        const calculatedRisk = balance * 0.02;
        newData.risk = `$${calculatedRisk.toFixed(2)}`;
      }
      
      return newData;
    });
  };

  const handleRiskChange = (value: string) => {
    setIsRiskManuallyEdited(true);
    setFormData(prev => ({ ...prev, risk: value }));
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

  const addCustomTag = () => {
    const trimmedTag = newTagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const calculateTradeScore = (): number => {
    let score = 0;
    
    // Base score for having essential fields filled
    if (formData.setupType.trim()) score += 0.5;
    if (formData.entry) score += 0.5;
    if (formData.stopLoss) score += 0.5;
    if (formData.takeProfit1) score += 0.5;
    
    // Calculate R:R ratio if all price fields are available
    const entry = parseFloat(formData.entry);
    const stopLoss = parseFloat(formData.stopLoss);
    const tp1 = parseFloat(formData.takeProfit1);
    
    if (entry && stopLoss && tp1) {
      const isLong = formData.side === 'LONG';
      const risk = isLong ? (entry - stopLoss) : (stopLoss - entry);
      const reward = isLong ? (tp1 - entry) : (entry - tp1);
      
      if (risk > 0 && reward > 0) {
        const rrRatio = reward / risk;
        
        // Score based on R:R ratio
        if (rrRatio >= 3) score += 1.5; // Excellent R:R
        else if (rrRatio >= 2) score += 1.2; // Good R:R
        else if (rrRatio >= 1.5) score += 1; // Acceptable R:R
        else if (rrRatio >= 1) score += 0.5; // Minimal R:R
      }
    }
    
    // Bonus points for thorough analysis
    if (formData.bullets.filter(b => b.trim()).length >= 3) score += 0.5;
    if (formData.positives.filter(p => p.trim()).length >= 2) score += 0.3;
    if (formData.negatives.filter(n => n.trim()).length >= 1) score += 0.2;
    if (formData.tags.length >= 3) score += 0.3;
    
    // Bonus for comprehensive setup
    if (formData.takeProfit2) score += 0.2;
    if (formData.contracts) score += 0.1;
    if (formData.rewardPotential) score += 0.1;
    
    return Math.min(5, Math.max(0, score));
  };

  const renderStarRating = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star 
            key={i} 
            size={20} 
            fill="#fbbf24" 
            color="#fbbf24" 
            className="animate-pulse-slow"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star 
            key={i} 
            size={20} 
            fill="url(#half-star)" 
            color="#fbbf24"
          />
        );
      } else {
        stars.push(
          <Star 
            key={i} 
            size={20} 
            fill="none" 
            color="#d1d5db"
          />
        );
      }
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <svg width="0" height="0">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
        </svg>
        {stars}
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({score.toFixed(1)}/5.0)
        </Typography>
      </Box>
    );
  };

  const resetForm = () => {
    setFormData(defaultJournalData);
    setIsRiskManuallyEdited(false);
    onReset();
  };

  const saveAsTrade = () => {
    const trade: HistoricalTrade = {
      id: Date.now().toString(),
      date: formData.date,
      setupType: formData.setupType,
      side: formData.side,
      entry: formData.entry,
      stopLoss: formData.stopLoss,
      takeProfit1: formData.takeProfit1,
      takeProfit2: formData.takeProfit2,
      outcome: 'Pending',
      rrRatio: 0,
      tags: formData.tags,
      createdAt: new Date().toISOString(),
      notes: `Bullets: ${formData.bullets.join(', ')}\nPositives: ${formData.positives.join(', ')}\nNegatives: ${formData.negatives.join(', ')}`
    };
    
    saveHistoricalTrade(trade);
    alert('Trade saved to history! You can update the outcome and R:R ratio in the Analyzer.');
  };

  const renderArrayInput = (
    field: 'bullets' | 'positives' | 'negatives',
    label: string,
    emoji: string,
    icon: React.ElementType
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          {React.createElement(icon, { size: 20, className: "animate-pulse-slow" })}
          <Typography variant="subtitle1">
            {emoji} {label}
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<PlusCircle size={16} />}
          onClick={() => addArrayItem(field)}
          variant="outlined"
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
            sx={{ 
              mr: 1,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 'var(--shadow-soft)'
                }
              }
            }}
          />
          <IconButton
            size="small"
            onClick={() => removeArrayItem(field, index)}
            color="error"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'rgba(239, 68, 68, 0.1)'
              }
            }}
          >
            <MinusCircle size={16} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

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
          background: 'var(--gradient-primary)',
        }
      }}
      className="animate-fade-in"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileText className="animate-pulse-slow" size={24} color="#3b82f6" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Journal Entry Form
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Save size={16} />}
            onClick={saveAsTrade} 
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
            Save as Trade
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetForm} 
            size="small"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 'var(--shadow-medium)'
              }
            }}
          >
            Reset Journal
          </Button>
        </Box>
      </Box>

      {/* Auto-scoring section */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star size={20} color="#fbbf24" className="animate-pulse-slow" />
            <Typography variant="subtitle1" fontWeight="medium">
              Trade Setup Score
            </Typography>
          </Box>
          {renderStarRating(calculateTradeScore())}
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Score based on R:R ratio, analysis depth, and setup completeness
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200, position: 'relative' }}>
          <Calendar size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="Date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                paddingLeft: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              } 
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200, position: 'relative' }}>
          <Clock size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <FormControl fullWidth size="small">
            <InputLabel sx={{ paddingLeft: '40px' }}>Session</InputLabel>
            <Select
              value={formData.session}
              onChange={(e) => handleInputChange('session', e.target.value)}
              label="Session"
              sx={{ 
                '& .MuiSelect-select': { 
                  paddingLeft: '40px'
                },
                '& .MuiOutlinedInput-root': { 
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 'var(--shadow-soft)' }
                } 
              }}
            >
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
              <MenuItem value="London">London</MenuItem>
              <MenuItem value="Tokyo">Tokyo</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 100%', minWidth: 200, position: 'relative' }}>
          <Target size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="Setup Type"
            value={formData.setupType}
            onChange={(e) => handleInputChange('setupType', e.target.value)}
            size="small"
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

      <Box sx={{ mt: 3 }}>
        {renderArrayInput('bullets', 'Bullets', '📍', Target)}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Side</InputLabel>
            <Select
              value={formData.side}
              label="Side"
              onChange={(e) => handleInputChange('side', e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              <MenuItem value="LONG">
                <ArrowUp size={16} color="#16a34a" />
                LONG
              </MenuItem>
              <MenuItem value="SHORT">
                <ArrowDown size={16} color="#dc2626" />
                SHORT
              </MenuItem>
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
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Stop Loss"
            value={formData.stopLoss}
            onChange={(e) => handleInputChange('stopLoss', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="TP1"
            value={formData.takeProfit1}
            onChange={(e) => handleInputChange('takeProfit1', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="TP2"
            value={formData.takeProfit2}
            onChange={(e) => handleInputChange('takeProfit2', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Contracts"
            value={formData.contracts}
            onChange={(e) => handleInputChange('contracts', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200, position: 'relative' }}>
          <DollarSign size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="Account Balance"
            value={formData.accountBalance}
            onChange={(e) => {
              handleInputChange('accountBalance', e.target.value);
              setIsRiskManuallyEdited(false); // Reset manual edit flag when balance changes
            }}
            size="small"
            type="number"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                paddingLeft: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              } 
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200, position: 'relative' }}>
          <Calculator size={20} style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, color: '#6b7280' }} />
          <TextField
            fullWidth
            label="Risk (2% Auto-calc)"
            value={formData.risk}
            onChange={(e) => handleRiskChange(e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                paddingLeft: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' },
                backgroundColor: isRiskManuallyEdited ? 'rgba(255, 193, 7, 0.1)' : 'rgba(34, 197, 94, 0.1)'
              } 
            }}
            helperText={isRiskManuallyEdited ? "Manually edited" : "Auto-calculated (2% of balance)"}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Reward Potential"
            value={formData.rewardPotential}
            onChange={(e) => handleInputChange('rewardPotential', e.target.value)}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 'var(--shadow-soft)' }
              }
            }}
          />
        </Box>
      </Box>

      {renderArrayInput('positives', 'Positives', '✅', Target)}
      {renderArrayInput('negatives', 'Negatives', '❌', Target)}

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Hash className="animate-pulse-slow" size={20} />
          <Typography variant="subtitle1">
            🧠 Tags
          </Typography>
        </Box>
        
        {/* Custom Tag Input */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Add custom tag..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            sx={{ flex: 1, maxWidth: 200 }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={addCustomTag}
            disabled={!newTagInput.trim()}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Add
          </Button>
        </Box>

        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Selected Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  color="primary"
                  variant="filled"
                  size="small"
                  sx={{
                    background: 'var(--gradient-primary)',
                    color: 'white'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Predefined Tags */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Quick Select:
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
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 'var(--shadow-soft)'
                  },
                  ...(formData.tags.includes(tag) && {
                    background: 'var(--gradient-primary)',
                    color: 'white'
                  })
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default JournalForm;