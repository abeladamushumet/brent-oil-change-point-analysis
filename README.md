# Brent Oil Change Point Analysis

## Project Overview

This project analyzes how major geopolitical and economic events affect Brent oil prices using Bayesian change point detection models. The analysis aims to identify structural breaks in oil price time series and associate them with significant events.

## Business Objective

The main goal is to study how important events affect Brent oil prices, focusing on:
- Political decisions and conflicts in oil-producing regions
- Global economic sanctions
- OPEC policy changes
- Economic crises and market shocks

## Project Structure

```
brent-oil-change-point-analysis/
├── data/
│   ├── raw/                    # Raw data files
│   └── processed/              # Cleaned and processed data
├── notebooks/                  # Jupyter notebooks for analysis
├── src/                        # Source code modules
│   ├── data/                   # Data processing utilities
│   ├── modeling/               # Change point models
├── dashboard/                  # Interactive dashboard
│   ├── backend/                # Flask API
│   └── frontend/               # React frontend
├── reports/                    # Analysis reports and figures
└── tests/                      # Unit tests
```

## Data

- **Oil Prices**: Daily Brent oil prices from May 20, 1987 to September 30, 2022
- **Events**: Major geopolitical and economic events affecting oil markets

## Methodology

1. **Data Preprocessing**: Clean and prepare time series data
2. **Change Point Detection**: Apply Bayesian models using PyMC3
3. **Event Association**: Link detected change points to historical events
4. **Impact Quantification**: Measure the magnitude of price changes
5. **Visualization**: Create interactive dashboards and reports

## Key Technologies

- **Analysis**: Python, PyMC, Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn, Plotly
- **Dashboard**: Flask (backend), React (frontend)
- **Statistical Methods**: Bayesian inference, MCMC sampling

## Getting Started

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run data preprocessing:
   ```bash
   python src/data/preprocess.py
   ```

3. Execute analysis notebooks in order:
   - `data_exploration.ipynb`
   - `change_point_modeling.ipynb`
   - `event_integration.ipynb`

## Results

The analysis provides:
- Identification of significant change points in oil prices
- Association of price changes with major events
- Quantitative impact assessment
- Interactive dashboard for stakeholder exploration

## License

This project is licensed under the Apache License.

![Dashboard ](repots/figures/dashbord.png)
