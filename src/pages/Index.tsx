import React, { useState } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { TrendingUp } from 'lucide-react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import Checklist from '../components/Checklist';
import JournalForm from '../components/JournalForm';
import JournalPreview from '../components/JournalPreview';
import Analyzer from '../components/Analyzer';
import { JournalData, defaultJournalData } from '../utils/journalGenerator';

const MainContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [journalData, setJournalData] = useState<JournalData>(defaultJournalData);
  const [currentTab, setCurrentTab] = useState(0);

  const handleJournalDataChange = (data: JournalData) => {
    setJournalData(data);
  };

  const handleJournalReset = () => {
    setJournalData(defaultJournalData);
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'var(--gradient-primary)',
          boxShadow: 'var(--shadow-medium)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <TrendingUp className="animate-bounce-subtle" size={28} />
            <Typography variant="h6" component="h1" fontWeight="bold">
              4H MGC & SIL – Trendline Playbook (To-Do + Journal)
            </Typography>
          </Box>
          <IconButton 
            color="inherit" 
            onClick={toggleDarkMode}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(180deg) scale(1.1)',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={currentTab} 
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }
            }}
          >
            <Tab label="Trading Journal" />
            <Tab label="Playbook Analyzer" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <>
           
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
          </>
        )}

        {currentTab === 1 && (
          <Box className="animate-fade-in">
            <Analyzer />
          </Box>
        )}
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
