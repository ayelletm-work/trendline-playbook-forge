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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Trading Checklist
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={resetChecklist}
            size="small"
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Progress: {completedTasks}/{totalTasks} ({Math.round(progress)}%)
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      </Box>

      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded.includes(section.id)}
          onChange={() => handleAccordionChange(section.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              {section.title} ({section.tasks.filter(t => t.completed).length}/{section.tasks.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 1 }}>
              {section.tasks.map((task) => (
                <FormControlLabel
                  key={task.id}
                  control={
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskChange(section.id, task.id)}
                      size="small"
                    />
                  }
                  label={task.label}
                  sx={{ display: 'block', mb: 0.5 }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default Checklist;