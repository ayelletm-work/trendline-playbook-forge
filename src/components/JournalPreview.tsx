import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
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
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Journal Preview
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={copyToClipboard}
            size="small"
          >
            Copy
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadAsFile}
            size="small"
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
          borderRadius: 1,
          p: 2,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          maxHeight: '400px',
          overflow: 'auto',
        }}
      >
        {journalText}
      </Box>
    </Paper>
  );
};

export default JournalPreview;