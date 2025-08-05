import React from "react";
import { Paper, Typography, Alert, Box } from "@mui/material";
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const StatusPanel = ({ status }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon />;
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <InfoIcon sx={{ mr: 1 }} />
        Status
      </Typography>

      <Alert
        severity={getAlertSeverity(status.type)}
        icon={getAlertIcon(status.type)}
        sx={{
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <Typography variant="body2">{status.message}</Typography>
      </Alert>
    </Paper>
  );
};

export default StatusPanel;
