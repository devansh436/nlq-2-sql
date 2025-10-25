import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/tables", label: "Tables", icon: <StorageIcon /> },
    { path: "/docs", label: "Docs", icon: <DescriptionIcon /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
      style={{ borderRadius: "0" }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <MenuBookIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Library NLQ
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.secondary",
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  bgcolor:
                    location.pathname === item.path
                      ? "rgba(96, 165, 250, 0.1)"
                      : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(96, 165, 250, 0.15)",
                    color: "primary.main",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
