import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { Eye, Copy, Download } from 'lucide-react';
import { JournalData, generateJournalText } from '../utils/journalGenerator';

interface JournalPreviewProps {
  journalData: JournalData;
}

const JournalPreview: React.FC<JournalPreviewProps> = ({ journalData }) => {
  const journalText = generateJournalText(journalData);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(journalText);
      // You could add a toast notification here
      console.log('Journal copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([journalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-${journalData.date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          background: 'var(--gradient-success)',
        }
      }}
      className="animate-fade-in"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Eye className="animate-pulse-slow" size={24} color="#16a34a" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Journal Preview
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Copy size={16} />}
            onClick={copyToClipboard}
            size="small"
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
            Copy
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={downloadAsFile}
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
            Download .txt
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          maxHeight: '400px',
          overflow: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-medium)',
          '&:hover': {
            boxShadow: 'var(--shadow-large)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        {journalText}
      </Box>
    </Paper>
  );
};

export default JournalPreview;