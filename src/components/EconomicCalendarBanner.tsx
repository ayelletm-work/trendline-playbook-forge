import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Calendar } from 'lucide-react';

// Easy URL replacement - change this constant to switch calendar providers
// Forex Factory blocks iframe embedding, so using an alternative
const ECONOMIC_CALENDAR_URL = 'https://widget.investing.com/economic-calendar/113/1.html';
// Alternative URLs you can use:
// const ECONOMIC_CALENDAR_URL = 'https://www.myfxbook.com/forex-economic-calendar';
// const ECONOMIC_CALENDAR_URL = 'https://s3.tradingview.com/external-embedding/embed-widget-economic-calendar.html';

const EconomicCalendarBanner: React.FC = () => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--gradient-primary)',
        }
      }}
      className="animate-fade-in"
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Calendar size={24} className="animate-pulse-slow" color="#3b82f6" />
          <Typography 
            variant="h6" 
            component="h2" 
            fontWeight="bold"
            sx={{ 
              color: 'text.primary',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            📅 US Economic Calendar
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            mb: 2,
            fontStyle: 'italic'
          }}
        >
          Stay informed about market-moving events and plan your trades accordingly
        </Typography>
      </Box>

      <Box 
        sx={{ 
          position: 'relative',
          height: '400px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '0 0 12px 12px',
          background: '#ffffff',
          boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <iframe
          src={ECONOMIC_CALENDAR_URL}
          width="100%"
          height="400"
          style={{
            border: 'none',
            overflow: 'hidden',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
          title="Economic Calendar"
          loading="lazy"
          // Add custom CSS to hide scrollbars
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            try {
              // Try to access and modify iframe content (will only work for same-origin)
              const doc = iframe.contentDocument || iframe.contentWindow?.document;
              if (doc) {
                const style = doc.createElement('style');
                style.textContent = `
                  body { 
                    overflow: hidden !important; 
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                  }
                  body::-webkit-scrollbar { 
                    display: none !important; 
                  }
                `;
                doc.head.appendChild(style);
              }
            } catch (e) {
              // Cross-origin restriction - this is expected for external sites
              console.log('Cross-origin iframe - cannot modify styles');
            }
          }}
        />
        
        {/* Overlay to prevent direct interaction if needed */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none', // Allow clicks through
            background: 'transparent',
          }}
        />
      </Box>
    </Paper>
  );
};

export default EconomicCalendarBanner;