import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import DataUploadPanel from "./DataUploadPanel";
import AnalysisPanel from "./AnalysisPanel";
import ResultsPanel from "./ResultsPanel";
import StatusPanel from "./StatusPanel";

const Dashboard = ({
  oilData,
  setOilData,
  eventData,
  setEventData,
  analysisResults,
  setAnalysisResults,
  loading,
  setLoading,
}) => {
  const [status, setStatus] = useState({
    message: "Ready to upload data",
    type: "info",
  });

  const updateStatus = (message, type = "info") => {
    setStatus({ message, type });
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Brent Oil Change Point Analysis
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Advanced Bayesian change point detection for Brent oil price analysis
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Panel - Controls */}
        <Grid item xs={12} md={4}>
          <DataUploadPanel
            oilData={oilData}
            setOilData={setOilData}
            eventData={eventData}
            setEventData={setEventData}
            updateStatus={updateStatus}
          />

          <AnalysisPanel
            oilData={oilData}
            eventData={eventData}
            analysisResults={analysisResults}
            setAnalysisResults={setAnalysisResults}
            loading={loading}
            setLoading={setLoading}
            updateStatus={updateStatus}
          />

          <StatusPanel status={status} />
        </Grid>

        {/* Right Panel - Results */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                Running Bayesian Analysis...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This may take several minutes depending on your data size
              </Typography>
            </Paper>
          ) : (
            <ResultsPanel
              analysisResults={analysisResults}
              oilData={oilData}
              eventData={eventData}
              updateStatus={updateStatus}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
