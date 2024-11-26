"use client";

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { Roboto } from "next/font/google";

// Load the Roboto font
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Define common typography settings
const typography = {
  fontFamily: roboto.style.fontFamily,
};

// Define light theme options
const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Default blue for primary
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#f5f5f5", // Light gray for the main background
      paper: "#ffffff", // White for cards and paper elements
    },
    text: {
      primary: "#000000", // Black for primary text
      secondary: "#666666", // Gray for secondary text
    },
  },
  typography,
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          "&.MuiAlert-standardInfo": {
            backgroundColor: "#60a5fa", // Custom background for "info" alerts
          },
        },
      },
    },
  },
};

// Define dark theme options
const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue for primary
    },
    secondary: {
      main: "#f48fb1", // Pink for secondary
    },
    background: {
      default: "#121212", // Dark gray for the main background
      paper: "#1e1e1e", // Slightly lighter gray for cards and paper elements
    },
    text: {
      primary: "#ffffff", // White for primary text
      secondary: "#b0bec5", // Light gray for secondary text
    },
  },
  typography,
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          "&.MuiAlert-standardInfo": {
            backgroundColor: "#60a5fa", // Custom background for "info" alerts
          },
        },
      },
    },
  },
};

// Function to generate a theme based on the mode
const theme = (mode: "light" | "dark") =>
  createTheme(mode === "light" ? lightTheme : darkTheme);

export default theme;