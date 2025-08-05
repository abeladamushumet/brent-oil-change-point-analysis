import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import axios from "axios";

const DataUploadPanel = ({
  oilData,
  setOilData,
  eventData,
  setEventData,
  updateStatus,
}) => {
  const [oilFile, setOilFile] = useState(null);
  const [eventFile, setEventFile] = useState(null);

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === "oil") {
        setOilFile(file);
        updateStatus(`Selected oil price file: ${file.name}`, "info");
      } else {
        setEventFile(file);
        updateStatus(`Selected event file: ${file.name}`, "info");
      }
    }
  };

  const uploadFile = async (file, type) => {
    if (!file) {
      updateStatus(`Please select a ${type} file first.`, "error");
      return;
    }

    const formData = new FormData();
    formData.append(type === "oil" ? "oil_price_file" : "event_file", file);

    try {
      updateStatus(`Uploading ${type} data...`, "info");

      const response = await axios.post(
        "http://localhost:5001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (type === "oil") {
          setOilData(response.data.data_preview);
        } else {
          setEventData(response.data.data_preview);
        }
        updateStatus(response.data.message, "success");
      } else {
        updateStatus(response.data.message, "error");
      }
    } catch (error) {
      updateStatus(`Upload failed: ${error.message}`, "error");
    }
  };

  const renderDataPreview = (data, title) => {
    if (!data || data.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          <TableChartIcon sx={{ mr: 1, fontSize: 16 }} />
          {title} Preview
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key} sx={{ fontWeight: 600 }}>
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <CloudUploadIcon sx={{ mr: 1 }} />
        Data Upload
      </Typography>

      {/* Oil Price Data Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Oil Price Data (CSV)
        </Typography>
        <input
          accept=".csv"
          style={{ display: "none" }}
          id="oil-file-input"
          type="file"
          onChange={(e) => handleFileSelect(e, "oil")}
        />
        <label htmlFor="oil-file-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            Select Oil Price File
          </Button>
        </label>
        {oilFile && (
          <Chip
            label={oilFile.name}
            onDelete={() => setOilFile(null)}
            sx={{ mb: 1 }}
          />
        )}
        <Button
          variant="contained"
          onClick={() => uploadFile(oilFile, "oil")}
          disabled={!oilFile}
          fullWidth
        >
          Upload Oil Data
        </Button>
        {renderDataPreview(oilData, "Oil Price Data")}
      </Box>

      {/* Event Data Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Event Data (CSV) - Optional
        </Typography>
        <input
          accept=".csv"
          style={{ display: "none" }}
          id="event-file-input"
          type="file"
          onChange={(e) => handleFileSelect(e, "event")}
        />
        <label htmlFor="event-file-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<EventIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            Select Event File
          </Button>
        </label>
        {eventFile && (
          <Chip
            label={eventFile.name}
            onDelete={() => setEventFile(null)}
            sx={{ mb: 1 }}
          />
        )}
        <Button
          variant="contained"
          onClick={() => uploadFile(eventFile, "event")}
          disabled={!eventFile}
          fullWidth
        >
          Upload Event Data
        </Button>
        {renderDataPreview(eventData, "Event Data")}
      </Box>

      {/* File Format Info */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Oil Price Data:</strong> CSV with 'Date' and 'Price' columns
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Event Data:</strong> CSV with 'Date' and 'Event' columns
        </Typography>
      </Alert>
    </Paper>
  );
};

export default DataUploadPanel;
