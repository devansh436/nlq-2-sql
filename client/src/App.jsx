import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, CircularProgress, ThemeProvider } from '@mui/material';
import { Fade } from '@mui/material';
import QueryInput from './components/QueryInput';
import ResultsTable from './components/ResultsTable';
import { executeQuery, checkHealth } from './services/api';
import darkTheme from './theme';
import './App.css';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await checkHealth();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const handleQuery = async (question) => {
    setLoading(true);
    setResult(null);
    
    try {
      const data = await executeQuery(question);
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.error || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1e40af 0%, #7e22ce 100%)',
          borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
          py: 5,
          mb: 5,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.2) 0%, transparent 50%)',
          }
        }}>
          <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: 6 }}>
            <Fade in timeout={1000}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MenuBookIcon sx={{ fontSize: 48, mr: 2 }} />
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Library NLQ System
                </Typography>
              </Box>
            </Fade>
            <Fade in timeout={1200}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PsychologyIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Natural Language Query to MySQL using AI • Powered by Gemini
                </Typography>
              </Box>
            </Fade>
          </Container>
        </Box>

        <Container maxWidth={false} sx={{ px: 6 }}>
          {backendStatus === 'checking' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {backendStatus === 'disconnected' && (
            <Fade in timeout={500}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                }}
              >
                Backend server is not responding. Please ensure the server is running on port 5000.
              </Alert>
            </Fade>
          )}

          {backendStatus === 'connected' && (
            <>
              <QueryInput onSubmit={handleQuery} loading={loading} />
              <ResultsTable result={result} />
            </>
          )}
        </Container>

        <Box sx={{ py: 4, textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Built with React, Node.js, MySQL & Gemini AI
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
