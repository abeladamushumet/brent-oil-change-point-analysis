import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [oilData, setOilData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Dashboard
            oilData={oilData}
            setOilData={setOilData}
            eventData={eventData}
            setEventData={setEventData}
            analysisResults={analysisResults}
            setAnalysisResults={setAnalysisResults}
            loading={loading}
            setLoading={setLoading}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
