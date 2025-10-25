import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ThemeProvider,
  Box,
  Alert,
  Container,
  CircularProgress,
} from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TablesPage from "./pages/TablesPage";
import DocsPage from "./pages/DocsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { checkHealth } from "./services/api";
import darkTheme from "./theme";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await checkHealth();
      setBackendStatus("connected");
    } catch (error) {
      setBackendStatus("disconnected");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />

      {backendStatus === "disconnected" && (
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Alert severity="warning">
            Backend server is not fully responding. Some features may be
            limited.
          </Alert>
        </Container>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <TablesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute>
              <DocsPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 3,
          mt: 8,
          borderTop: "1px solid",
          borderColor: "divider",
          color: "text.secondary",
        }}
      >
        Built with React, Node.js, MySQL, MongoDB & Gemini AI
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
