import React, { useState } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import Checklist from '../components/Checklist';
import JournalForm from '../components/JournalForm';
import JournalPreview from '../components/JournalPreview';
import { JournalData, defaultJournalData } from '../utils/journalGenerator';

const MainContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [journalData, setJournalData] = useState<JournalData>(defaultJournalData);

  const handleJournalDataChange = (data: JournalData) => {
    setJournalData(data);
  };

  const handleJournalReset = () => {
    setJournalData(defaultJournalData);
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            4H MGC & SIL – Trendline Playbook (To-Do + Journal)
          </Typography>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Checklist />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 4 
        }}>
          <Box sx={{ flex: 1 }}>
            <JournalForm
              onDataChange={handleJournalDataChange}
              onReset={handleJournalReset}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <JournalPreview journalData={journalData} />
          </Box>
        </Box>
      </Container>
    </>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

export default Index;
