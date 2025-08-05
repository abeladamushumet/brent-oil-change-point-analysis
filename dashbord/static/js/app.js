// Brent Oil Change Point Analysis Frontend JavaScript

// Global variables
let oilDataUploaded = false;
let eventDataUploaded = false;
let analysisCompleted = false;

// Utility functions
function showStatus(message, type = "info") {
  const statusPanel = document.getElementById("statusPanel");
  const alertClass =
    type === "success"
      ? "alert-success"
      : type === "error"
      ? "alert-danger"
      : type === "warning"
      ? "alert-warning"
      : "alert-info";

  statusPanel.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-triangle"
                : type === "warning"
                ? "exclamation-circle"
                : "info-circle"
            } me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function showLoading(show = true) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultsSection = document.getElementById("resultsSection");

  if (show) {
    loadingSpinner.classList.remove("d-none");
    resultsSection.classList.add("d-none");
  } else {
    loadingSpinner.classList.add("d-none");
    resultsSection.classList.remove("d-none");
  }
}

function updateButtonStates() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const eventsBtn = document.getElementById("eventsBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  // Enable analyze button if oil data is uploaded
  analyzeBtn.disabled = !oilDataUploaded;

  // Enable events button if both data types are uploaded and analysis is complete
  eventsBtn.disabled = !(
    oilDataUploaded &&
    eventDataUploaded &&
    analysisCompleted
  );

  // Enable download button if analysis is complete
  downloadBtn.disabled = !analysisCompleted;
}

// File upload functions
async function uploadOilData() {
  const fileInput = document.getElementById("oilPriceFile");
  const file = fileInput.files[0];

  if (!file) {
    showStatus("Please select an oil price data file first.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("oil_price_file", file);

  try {
    showStatus("Uploading oil price data...", "info");

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      oilDataUploaded = true;
      showStatus(result.message, "success");
      updateButtonStates();

      // Show data preview
      if (result.data_preview) {
        showDataPreview("Oil Price Data", result.data_preview);
      }
    } else {
      showStatus(result.message, "error");
    }
  } catch (error) {
    showStatus("Upload failed: " + error.message, "error");
  }
}

async function uploadEventData() {
  const fileInput = document.getElementById("eventFile");
  const file = fileInput.files[0];

  if (!file) {
    showStatus("Please select an event data file first.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("event_file", file);

  try {
    showStatus("Uploading event data...", "info");

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      eventDataUploaded = true;
      showStatus(result.message, "success");
      updateButtonStates();

      // Show data preview
      if (result.data_preview) {
        showDataPreview("Event Data", result.data_preview);
      }
    } else {
      showStatus(result.message, "error");
    }
  } catch (error) {
    showStatus("Upload failed: " + error.message, "error");
  }
}

function showDataPreview(title, data) {
  const statusPanel = document.getElementById("statusPanel");
  const currentAlert = statusPanel.querySelector(".alert");

  if (currentAlert) {
    currentAlert.remove();
  }

  const previewHtml = `
        <div class="alert alert-info">
            <h6><i class="fas fa-table me-2"></i>${title} Preview</h6>
            <div class="table-responsive">
                <table class="table table-sm table-striped">
                    <thead>
                        <tr>
                            ${Object.keys(data[0] || {})
                              .map((key) => `<th>${key}</th>`)
                              .join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                          .map(
                            (row) => `
                            <tr>
                                ${Object.values(row)
                                  .map((value) => `<td>${value}</td>`)
                                  .join("")}
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;

  statusPanel.innerHTML = previewHtml;
}

// Analysis functions
async function runAnalysis() {
  if (!oilDataUploaded) {
    showStatus("Please upload oil price data first.", "error");
    return;
  }

  try {
    showLoading(true);
    showStatus(
      "Running Bayesian change point analysis... This may take several minutes.",
      "info"
    );

    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      analysisCompleted = true;
      showStatus("Analysis completed successfully!", "success");
      displayResults(result.results);
      updateButtonStates();
    } else {
      showStatus(result.message, "error");
    }
  } catch (error) {
    showStatus("Analysis failed: " + error.message, "error");
  } finally {
    showLoading(false);
  }
}

function displayResults(results) {
  // Display summary statistics
  displaySummaryStats(results.stats);

  // Display plots
  displayPlots(results.plots);

  // Show results section
  document.getElementById("resultsSection").classList.remove("d-none");
}

function displaySummaryStats(stats) {
  const summaryContainer = document.getElementById("summaryStats");

  const statsHtml = `
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-value">${stats.change_point_date}</div>
                <div class="stat-label">Change Point Date</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-value">$${stats.mean_before.toFixed(2)}</div>
                <div class="stat-label">Mean Price Before</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-value">$${stats.mean_after.toFixed(2)}</div>
                <div class="stat-label">Mean Price After</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-value">${stats.price_change_pct.toFixed(
                  1
                )}%</div>
                <div class="stat-label">Price Change</div>
            </div>
        </div>
        <div class="col-12 mt-3">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title"><i class="fas fa-chart-line me-2"></i>Before Change Point</h6>
                            <p class="mb-1"><strong>Mean:</strong> $${stats.mean_before.toFixed(
                              2
                            )}</p>
                            <p class="mb-0"><strong>Std Dev:</strong> $${stats.std_before.toFixed(
                              2
                            )}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title"><i class="fas fa-chart-line me-2"></i>After Change Point</h6>
                            <p class="mb-1"><strong>Mean:</strong> $${stats.mean_after.toFixed(
                              2
                            )}</p>
                            <p class="mb-0"><strong>Std Dev:</strong> $${stats.std_after.toFixed(
                              2
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  summaryContainer.innerHTML = statsHtml;
}

function displayPlots(plots) {
  // Display time series plot
  if (plots.time_series) {
    document.getElementById("timeSeriesPlot").src =
      "data:image/png;base64," + plots.time_series;
  }

  // Display posterior distribution plot
  if (plots.posterior) {
    document.getElementById("posteriorPlot").src =
      "data:image/png;base64," + plots.posterior;
  }

  // Display price distributions plot
  if (plots.distributions) {
    document.getElementById("distributionsPlot").src =
      "data:image/png;base64," + plots.distributions;
  }
}

// Event correlation functions
async function loadEvents() {
  if (!oilDataUploaded || !eventDataUploaded || !analysisCompleted) {
    showStatus(
      "Please upload both data files and run analysis first.",
      "error"
    );
    return;
  }

  try {
    showStatus("Loading event correlations...", "info");

    const response = await fetch("/events");
    const result = await response.json();

    if (result.success) {
      displayEvents(result);
      showStatus("Event correlations loaded successfully!", "success");
    } else {
      showStatus(result.message, "error");
    }
  } catch (error) {
    showStatus("Failed to load events: " + error.message, "error");
  }
}

function displayEvents(result) {
  const eventsCard = document.getElementById("eventsCard");
  const eventsContent = document.getElementById("eventsContent");

  let eventsHtml = `
        <div class="row mb-3">
            <div class="col-md-6">
                <div class="alert alert-info">
                    <i class="fas fa-calendar me-2"></i>
                    <strong>Change Point:</strong> ${result.change_point_date}
                </div>
            </div>
            <div class="col-md-6">
                <div class="alert alert-warning">
                    <i class="fas fa-chart-bar me-2"></i>
                    <strong>Events Found:</strong> ${result.events_in_window} (${result.total_events} total)
                </div>
            </div>
        </div>
    `;

  if (result.nearby_events && result.nearby_events.length > 0) {
    eventsHtml += '<h6 class="mb-3">Events Near Change Point (±30 days):</h6>';

    result.nearby_events.forEach((event) => {
      const daysText =
        event.Days_From_Change > 0
          ? `+${event.Days_From_Change} days after`
          : `${Math.abs(event.Days_From_Change)} days before`;

      eventsHtml += `
                <div class="event-item">
                    <div class="event-date">
                        <i class="fas fa-calendar-day me-2"></i>
                        ${event.Date}
                    </div>
                    <div class="event-description">
                        <i class="fas fa-info-circle me-2"></i>
                        ${event.Event}
                    </div>
                    <div class="days-from-change">
                        <i class="fas fa-clock me-1"></i>
                        ${daysText}
                    </div>
                </div>
            `;
    });
  } else {
    eventsHtml += `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                No events found within 30 days of the change point.
            </div>
        `;
  }

  eventsContent.innerHTML = eventsHtml;
  eventsCard.style.display = "block";
}

// Download functions
async function downloadResults() {
  if (!analysisCompleted) {
    showStatus("Please run analysis first.", "error");
    return;
  }

  try {
    showStatus("Preparing download...", "info");

    const response = await fetch("/download_results");

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "change_point_analysis_results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showStatus("Results downloaded successfully!", "success");
    } else {
      const result = await response.json();
      showStatus(result.message, "error");
    }
  } catch (error) {
    showStatus("Download failed: " + error.message, "error");
  }
}

// File input change handlers
document.getElementById("oilPriceFile").addEventListener("change", function () {
  if (this.files.length > 0) {
    showStatus(`Selected file: ${this.files[0].name}`, "info");
  }
});

document.getElementById("eventFile").addEventListener("change", function () {
  if (this.files.length > 0) {
    showStatus(`Selected file: ${this.files[0].name}`, "info");
  }
});

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  showStatus("Ready to upload data", "info");
  updateButtonStates();

  // Add some helpful tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
