import React from "react";
import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import {
  Timeline as TimelineIcon,
  OilBarrel as OilBarrelIcon,
} from "@mui/icons-material";

const Header = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <OilBarrelIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Brent Oil Change Point Analysis
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<TimelineIcon />}
            label="Bayesian Analysis"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "& .MuiChip-icon": { color: "white" },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
