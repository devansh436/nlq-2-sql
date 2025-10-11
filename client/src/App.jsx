import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import QueryInput from './components/QueryInput';
import ResultsTable from './components/ResultsTable';
import { executeQuery, checkHealth } from './services/api';
import './App.css';

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
    <div className="App">
      <Box sx={{ bgcolor: '#1976d2', color: 'white', py: 3, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom>
            📚 Library NLQ System
          </Typography>
          <Typography variant="subtitle1">
            Natural Language Query to MySQL using AI
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {backendStatus === 'checking' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {backendStatus === 'disconnected' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Backend server is not responding. Please ensure the server is running on port 5000.
          </Alert>
        )}

        {backendStatus === 'connected' && (
          <>
            <QueryInput onSubmit={handleQuery} loading={loading} />
            <ResultsTable result={result} />
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
