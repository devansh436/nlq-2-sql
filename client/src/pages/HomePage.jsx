import React, { useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { Fade } from '@mui/material';
import QueryInput from '../components/QueryInput';
import ResultsTable from '../components/ResultsTable';
import { executeQuery } from '../services/api';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';

function HomePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box textAlign="center" mb={5}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <MenuBookIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <PsychologyIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}
          >
            Library NLQ System
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Natural Language Query to MySQL using AI • Powered by Gemini
          </Typography>
        </Box>
      </Fade>

      <QueryInput onSubmit={handleQuery} loading={loading} />
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={48} thickness={4} />
        </Box>
      )}
      <ResultsTable result={result} />
    </Container>
  );
}

export default HomePage;
