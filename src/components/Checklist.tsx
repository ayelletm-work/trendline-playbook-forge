import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Typography,
  LinearProgress,
  Button,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Shield, 
  CheckCircle, 
  BarChart3,
  Eye,
  Volume2 
} from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

interface Task {
  id: string;
  label: string;
  completed: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  tasks: Task[];
}

const sectionIcons = {
  'market-prep': BarChart3,
  'trendline-setup': TrendingUp,
  'confirmation-filters': Activity,
  'risk-targets': Shield,
};

const initialSections: ChecklistSection[] = [
  {
    id: 'market-prep',
    title: 'Market Prep & Chart Setup',
    tasks: [
      { id: 'news-check', label: 'Check high-impact news events', completed: false },
      { id: 'market-sentiment', label: 'Assess overall market sentiment', completed: false },
      { id: 'timeframe-analysis', label: 'Set up 4H and Daily charts', completed: false },
      { id: 'key-levels', label: 'Mark key support/resistance levels', completed: false },
    ],
  },
  {
    id: 'trendline-setup',
    title: 'Trendline Setup & Break',
    tasks: [
      { id: 'trendline-drawn', label: 'Draw trendline with minimum 3 touches', completed: false },
      { id: 'trend-validity', label: 'Confirm trendline validity and angle', completed: false },
      { id: 'break-confirmation', label: 'Wait for clean break with body close', completed: false },
      { id: 'volume-check', label: 'Confirm volume increase on break', completed: false },
    ],
  },
  {
    id: 'confirmation-filters',
    title: 'Confirmation Filters',
    tasks: [
      { id: 'sil-check', label: 'Check SIL (Support/Resistance) alignment', completed: false },
      { id: 'momentum-confirm', label: 'Confirm momentum indicators', completed: false },
      { id: 'price-action', label: 'Look for bullish/bearish price action', completed: false },
      { id: 'market-structure', label: 'Analyze overall market structure', completed: false },
    ],
  },
  {
    id: 'risk-targets',
    title: 'Risk, SL & Targets',
    tasks: [
      { id: 'stop-loss', label: 'Set stop loss below/above key level', completed: false },
      { id: 'risk-calculation', label: 'Calculate position size for 1-2% risk', completed: false },
      { id: 'tp1-set', label: 'Set TP1 at 1:1 or first resistance', completed: false },
      { id: 'tp2-set', label: 'Set TP2 at 2:1 or second resistance', completed: false },
      { id: 'trade-plan', label: 'Document complete trade plan', completed: false },
    ],
  },
];

const Checklist: React.FC = () => {
  const [sections, setSections] = useState<ChecklistSection[]>(() =>
    loadFromLocalStorage('checklist-sections', initialSections)
  );

  const [expanded, setExpanded] = useState<string[]>(['market-prep']);

  useEffect(() => {
    saveToLocalStorage('checklist-sections', sections);
  }, [sections]);

  const handleTaskChange = (sectionId: string, taskId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : section
      )
    );
  };

  const handleAccordionChange = (panel: string) => {
    setExpanded(prev =>
      prev.includes(panel)
        ? prev.filter(p => p !== panel)
        : [...prev, panel]
    );
  };

  const resetChecklist = () => {
    setSections(initialSections);
  };

  const totalTasks = sections.reduce((acc, section) => acc + section.tasks.length, 0);
  const completedTasks = sections.reduce(
    (acc, section) => acc + section.tasks.filter(task => task.completed).length,
    0
  );
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
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
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle className="animate-pulse-slow" size={24} color="#3b82f6" />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Trading Checklist
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={resetChecklist}
            size="small"
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'scale(1.05)',
                boxShadow: 'var(--shadow-medium)'
              }
            }}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {completedTasks}/{totalTasks} ({Math.round(progress)}%)
            </Typography>
            <Chip 
              label={progress === 100 ? "Complete!" : "In Progress"} 
              color={progress === 100 ? "success" : "primary"}
              size="small"
              className={progress === 100 ? "animate-bounce-subtle" : ""}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              background: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                background: progress === 100 ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                transition: 'all 0.6s ease'
              }
            }} 
          />
        </Box>
      </Box>

      {sections.map((section) => {
        const Icon = sectionIcons[section.id as keyof typeof sectionIcons];
        const sectionProgress = section.tasks.filter(t => t.completed).length / section.tasks.length * 100;
        
        return (
          <Accordion
            key={section.id}
            expanded={expanded.includes(section.id)}
            onChange={() => handleAccordionChange(section.id)}
            sx={{ 
              mb: 1,
              borderRadius: '8px !important',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: 'var(--shadow-medium)'
              },
              '&.Mui-expanded': {
                margin: '8px 0',
                background: sectionProgress === 100 ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                '& .MuiAccordionSummary-root': {
                  color: 'white',
                  '& .MuiTypography-root': {
                    color: 'white'
                  }
                }
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1.5
                }
              }}
            >
              <Icon size={20} className="animate-pulse-slow" />
              <Typography variant="subtitle1" fontWeight="medium">
                {section.title}
              </Typography>
              <Chip 
                label={`${section.tasks.filter(t => t.completed).length}/${section.tasks.length}`}
                size="small"
                color={sectionProgress === 100 ? "success" : "default"}
                sx={{ ml: 'auto', mr: 1 }}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ background: 'rgba(255,255,255,0.95)' }}>
              <Box sx={{ pl: 1 }}>
                {section.tasks.map((task) => (
                  <FormControlLabel
                    key={task.id}
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleTaskChange(section.id, task.id)}
                        size="small"
                        sx={{
                          transition: 'all 0.3s ease',
                          '&.Mui-checked': {
                            transform: 'scale(1.1)',
                            color: 'var(--success)'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography 
                        sx={{ 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.7 : 1,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {task.label}
                      </Typography>
                    }
                    sx={{ 
                      display: 'block', 
                      mb: 0.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)'
                      }
                    }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default Checklist;