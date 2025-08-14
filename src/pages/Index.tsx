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
import { TrendingUp } from 'lucide-react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import Checklist from '../components/Checklist';

const MainContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

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
            <Typography variant="h6" component="h1" className="font-titillium text-tit-2xl font-bold">
              4H MGC & SIL – Trendline Playbook
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
        maxWidth="xl" 
        sx={{ 
          py: 4,
          background: 'var(--bg-gradient-radial)',
          minHeight: 'calc(100vh - 64px)',
          height: 'auto'
        }}
      >
        <Box className="animate-fade-in">
          <Checklist />
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
