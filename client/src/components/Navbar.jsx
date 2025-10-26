import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext"; // NEW

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // NEW

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/tables", label: "Tables", icon: <StorageIcon /> },
    { path: "/docs", label: "Docs", icon: <DescriptionIcon /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MenuBookIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography 
              variant="h6" 
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              Library NLQ
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  bgcolor: location.pathname === item.path ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(96, 165, 250, 0.15)',
                    color: 'primary.main'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <>
                <Chip 
                  label={user.role} 
                  size="small" 
                  color="primary" 
                  sx={{ fontWeight: 700 }}
                />
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ color: 'error.main' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ color: 'success.main' }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
