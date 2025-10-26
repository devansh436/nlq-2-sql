import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, Box, Alert, Container } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext'; // NEW
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TablesPage from './pages/TablesPage';
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/RegisterPage'; // NEW
import RegisterPage from './pages/RegisterPage'; // NEW
import { checkHealth } from './services/api';
import darkTheme from './theme';
import './App.css';

// Optional protection - allows guest access but shows better UI when logged in
function OptionalProtectedRoute({ children }) {
  return children; // No blocking, just pass through
}

function AppContent() {
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<OptionalProtectedRoute><HomePage /></OptionalProtectedRoute>} />
        <Route path="/tables" element={<OptionalProtectedRoute><TablesPage /></OptionalProtectedRoute>} />
        <Route path="/docs" element={<OptionalProtectedRoute><DocsPage /></OptionalProtectedRoute>} />
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
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
