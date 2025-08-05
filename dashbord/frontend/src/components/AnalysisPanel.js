import React from "react";
import { Paper, Typography, Box, Button, Stack } from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Event as EventIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import axios from "axios";

const AnalysisPanel = ({
  oilData,
  eventData,
  analysisResults,
  setAnalysisResults,
  loading,
  setLoading,
  updateStatus,
}) => {
  const runAnalysis = async () => {
    if (!oilData) {
      updateStatus("Please upload oil price data first.", "error");
      return;
    }

    try {
      setLoading(true);
      updateStatus(
        "Running Bayesian change point analysis... This may take several minutes.",
        "info"
      );

      const response = await axios.post("http://localhost:5001/analyze");

      if (response.data.success) {
        setAnalysisResults(response.data.results);
        updateStatus("Analysis completed successfully!", "success");
      } else {
        updateStatus(response.data.message, "error");
      }
    } catch (error) {
      updateStatus(`Analysis failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    if (!oilData || !eventData || !analysisResults) {
      updateStatus(
        "Please upload both data files and run analysis first.",
        "error"
      );
      return;
    }

    try {
      updateStatus("Loading event correlations...", "info");

      const response = await axios.get("http://localhost:5001/events");

      if (response.data.success) {
        // Update analysis results with event data
        setAnalysisResults((prev) => ({
          ...prev,
          events: response.data,
        }));
        updateStatus("Event correlations loaded successfully!", "success");
      } else {
        updateStatus(response.data.message, "error");
      }
    } catch (error) {
      updateStatus(`Failed to load events: ${error.message}`, "error");
    }
  };

  const downloadResults = async () => {
    if (!analysisResults) {
      updateStatus("Please run analysis first.", "error");
      return;
    }

    try {
      updateStatus("Preparing download...", "info");

      const response = await axios.get(
        "http://localhost:5001/download_results",
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "change_point_analysis_results.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      updateStatus("Results downloaded successfully!", "success");
    } catch (error) {
      updateStatus(`Download failed: ${error.message}`, "error");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <PlayArrowIcon sx={{ mr: 1 }} />
        Analysis Controls
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={runAnalysis}
          disabled={!oilData || loading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Run Change Point Analysis
        </Button>

        <Button
          variant="outlined"
          startIcon={<EventIcon />}
          onClick={loadEvents}
          disabled={!oilData || !eventData || !analysisResults || loading}
          fullWidth
        >
          View Event Correlations
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={downloadResults}
          disabled={!analysisResults || loading}
          fullWidth
        >
          Download Results
        </Button>
      </Stack>

      {/* Status indicators */}
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Data Status:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: oilData ? "success.main" : "text.secondary",
              display: "flex",
              alignItems: "center",
            }}
          >
            • Oil Price Data: {oilData ? "✓ Uploaded" : "✗ Not uploaded"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: eventData ? "success.main" : "text.secondary",
              display: "flex",
              alignItems: "center",
            }}
          >
            • Event Data: {eventData ? "✓ Uploaded" : "✗ Not uploaded"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: analysisResults ? "success.main" : "text.secondary",
              display: "flex",
              alignItems: "center",
            }}
          >
            • Analysis: {analysisResults ? "✓ Completed" : "✗ Not completed"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AnalysisPanel;
