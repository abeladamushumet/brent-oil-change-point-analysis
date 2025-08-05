import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ResultsPanel = ({
  analysisResults,
  oilData,
  eventData,
  updateStatus,
}) => {
  const [tabValue, setTabValue] = useState(0);

  if (!analysisResults) {
    return (
      <Paper sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Analysis Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload data and run analysis to see results here
        </Typography>
      </Paper>
    );
  }

  const { stats, plots, events } = analysisResults;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderSummaryStats = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {stats.change_point_date}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Change Point Date
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              ${stats.mean_before.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Mean Price Before
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              ${stats.mean_after.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Mean Price After
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            background:
              stats.price_change_pct > 0
                ? "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              {stats.price_change_pct > 0 ? (
                <TrendingUpIcon />
              ) : (
                <TrendingDownIcon />
              )}
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 700, ml: 1 }}
              >
                {stats.price_change_pct.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Price Change
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDetailedStats = () => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TrendingDownIcon sx={{ mr: 1 }} />
              Before Change Point
            </Typography>
            <Typography variant="body1">
              <strong>Mean:</strong> ${stats.mean_before.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Std Dev:</strong> ${stats.std_before.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TrendingUpIcon sx={{ mr: 1 }} />
              After Change Point
            </Typography>
            <Typography variant="body1">
              <strong>Mean:</strong> ${stats.mean_after.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Std Dev:</strong> ${stats.std_after.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderVisualizations = () => (
    <Box sx={{ mt: 3 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Time Series" icon={<TimelineIcon />} />
        <Tab label="Posterior Distribution" icon={<BarChartIcon />} />
        <Tab label="Price Distributions" icon={<PieChartIcon />} />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Brent Oil Price Time Series with Detected Change Point
          </Typography>
          {plots && plots.time_series && (
            <img
              src={`data:image/png;base64,${plots.time_series}`}
              alt="Time Series Plot"
              style={{ width: "100%", height: "auto", maxHeight: 350 }}
            />
          )}
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Posterior Distribution of Change Point Location
          </Typography>
          {plots && plots.posterior && (
            <img
              src={`data:image/png;base64,${plots.posterior}`}
              alt="Posterior Distribution Plot"
              style={{ width: "100%", height: "auto", maxHeight: 350 }}
            />
          )}
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Price Distributions Before and After Change Point
          </Typography>
          {plots && plots.distributions && (
            <img
              src={`data:image/png;base64,${plots.distributions}`}
              alt="Price Distributions Plot"
              style={{ width: "100%", height: "auto", maxHeight: 350 }}
            />
          )}
        </Paper>
      )}
    </Box>
  );

  const renderEvents = () => {
    if (!events) {
      return (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No Event Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload event data and click "View Event Correlations" to see events
            near the change point
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EventIcon sx={{ mr: 1 }} />
          Event Correlations
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Chip
              label={`Change Point: ${events.change_point_date}`}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Chip
              label={`Events Found: ${events.events_in_window} (${events.total_events} total)`}
              color="secondary"
              variant="outlined"
            />
          </Grid>
        </Grid>

        {events.nearby_events && events.nearby_events.length > 0 ? (
          <List>
            {events.nearby_events.map((event, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.Event}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="primary">
                          {event.Date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.Days_From_Change > 0
                            ? `+${event.Days_From_Change} days after change point`
                            : `${Math.abs(
                                event.Days_From_Change
                              )} days before change point`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < events.nearby_events.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            No events found within 30 days of the change point.
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Box>
      {/* Analysis Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <BarChartIcon sx={{ mr: 1 }} />
          Analysis Summary
        </Typography>
        {renderSummaryStats()}
        {renderDetailedStats()}
      </Paper>

      {/* Visualizations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TimelineIcon sx={{ mr: 1 }} />
          Visualizations
        </Typography>
        {renderVisualizations()}
      </Paper>

      {/* Event Correlations */}
      {renderEvents()}
    </Box>
  );
};

export default ResultsPanel;
