import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Box, Alert, Container } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TablesPage from './pages/TablesPage';
import DocsPage from './pages/DocsPage';
import { checkHealth } from './services/api';
import darkTheme from './theme';
import './App.css';

function App() {
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          
          {backendStatus === 'disconnected' && (
            <Container maxWidth="xl" sx={{ py: 2 }}>
              <Alert severity="error">
                Backend server is not responding. Please ensure the server is running.
              </Alert>
            </Container>
          )}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>

          <Box 
            component="footer" 
            sx={{ 
              textAlign: 'center', 
              py: 3, 
              mt: 8,
              borderTop: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary'
            }}
          >
            Built with React, Node.js, MySQL & Gemini AI
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
