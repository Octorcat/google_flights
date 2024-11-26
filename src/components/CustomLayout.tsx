"use client";

import * as React from "react";
import { Bounce, ToastContainer } from 'react-toastify';
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import theme from "@/theme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import RegionalSettings from "./RegionalSettings";
import LanguageIcon from '@mui/icons-material/Language';
import 'react-toastify/dist/ReactToastify.css';

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const [isRegionalSettingsOpen, setRegionalSettingsOpen] = React.useState(false);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme(mode)}>
          <CssBaseline />
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              backgroundColor: "background.default",
              color: "text.primary",
              boxShadow: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {/* Placeholder for App Title or Logo */}
            <Box sx={{ fontWeight: 600, fontSize: "1.2rem" }}>Flight Search App</Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Regional Settings */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRegionalSettingsOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 4,
                  fontWeight: 500,
                }}
                startIcon={<LanguageIcon />}
              >
                Open Regional Settings
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outlined"
                onClick={toggleTheme}
                startIcon={mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 4,
                  fontWeight: 500,
                  color: "text.primary",
                  borderColor: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                {mode === "dark" ? "Dark Mode" : "Light Mode"}
              </Button>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ mt: 3 }}>{children}</Box>

          {/* Regional Settings Modal */}
          <RegionalSettings
            open={isRegionalSettingsOpen}
            onClose={() => setRegionalSettingsOpen(false)}
          />

          <ToastContainer 
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={mode}
            transition={Bounce}
          />
        </ThemeProvider>
      </LocalizationProvider>
    </AppRouterCacheProvider>
  );
};

export default CustomLayout;
