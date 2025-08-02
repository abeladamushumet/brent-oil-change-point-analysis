# Interim Report: Brent Oil Change Point Analysis

**Author:** Abel Adamu SHumet 
**Date:** August 2, 2025  
**Project:** Change Point Analysis and Statistical Modeling of Time Series Data  
**Organization:** Birhan Energies  

## Executive Summary

This interim report presents the initial findings and progress of the Brent oil change point analysis project. The primary objective is to identify significant structural breaks in oil price time series data and associate these changes with major geopolitical and economic events. This analysis aims to provide actionable insights for investors, policymakers, and energy companies operating in the volatile oil market.

The project has successfully established a comprehensive analytical framework incorporating Bayesian change point detection models, event impact analysis, and an interactive dashboard for stakeholder engagement. Initial findings demonstrate clear relationships between major global events and oil price volatility, with quantifiable impacts on market behavior.

## Project Overview

### Business Objective

The main goal of this analysis is to study how important events affect Brent oil prices, focusing specifically on detecting changes and associating causes in time series data. This research addresses critical business needs in the energy sector where market volatility creates significant challenges for decision-making processes.

The oil market's inherent instability makes it difficult for investors to make informed decisions, manage risks effectively, and maximize returns. Policymakers require detailed analysis to create strategies for economic stability and energy security, while energy companies need accurate price forecasts to plan operations, control costs, and secure supply chains.

### Data Sources

The analysis utilizes two primary datasets:

1. **Historical Brent Oil Prices**: Daily price data spanning from May 20, 1987, to September 30, 2022, providing over 35 years of market observations
2. **Major Events Database**: Curated collection of significant geopolitical and economic events with documented impacts on oil markets

### Methodology Framework

The analytical approach employs Bayesian change point detection models using PyMC, a standard Bayesian modeling package in Python. This methodology enables the identification of statistically significant structural breaks in the time series while quantifying uncertainty through probabilistic inference.

## Data Analysis Workflow

### Data Preprocessing

The data preprocessing phase involved several critical steps to ensure data quality and analytical readiness:

**Oil Price Data Cleaning**: The raw price data underwent comprehensive cleaning procedures, including missing value identification and removal, date format standardization, and calculation of log returns for improved stationarity. Log returns were computed as log(price_t) - log(price_{t-1}), which provides a more stationary series suitable for change point modeling.

**Event Data Structuring**: The event dataset was organized with standardized date formats and impact classifications. Events were categorized by expected impact levels (High, Medium, Low) and assigned numerical scores for quantitative analysis.

### Exploratory Data Analysis

Initial exploration revealed several key characteristics of the Brent oil price series:

**Trend Analysis**: The price series exhibits significant volatility with multiple periods of rapid price changes, particularly during major geopolitical events and economic crises. Long-term trends show periods of relative stability punctuated by sharp movements.

**Volatility Clustering**: The log returns demonstrate clear volatility clustering, where periods of high volatility tend to be followed by continued high volatility, a characteristic feature of financial time series.

**Stationarity Assessment**: Statistical tests confirmed that while the raw price series is non-stationary, the log returns series exhibits properties more suitable for change point modeling.

## Change Point Modeling Results

### Model Implementation

The Bayesian change point model was implemented with the following specifications:

- **Switch Point (τ)**: Discrete uniform prior over all possible data points
- **Before/After Parameters**: Normal priors for means with half-normal priors for standard deviations
- **Likelihood Function**: Normal distribution with switching parameters based on the change point location

### Preliminary Findings

Initial model runs on a subset of data (2010 onwards) have identified several potential change points that align with major market events. The model demonstrates good convergence properties with R-hat values close to 1.0, indicating reliable posterior estimates.

**Statistical Significance**: The detected change points show strong statistical support with narrow posterior distributions, suggesting high confidence in the timing of structural breaks.

**Parameter Estimates**: The model successfully captures changes in both mean price levels and volatility patterns around identified change points.

## Event Impact Analysis

### Quantitative Impact Assessment

The analysis has developed a systematic approach to quantify the impact of major events on oil prices:

**Price Change Measurement**: For each event, the analysis compares average prices in 30-day windows before and after the event occurrence, calculating both absolute and percentage changes.

**Volatility Analysis**: Changes in price volatility are measured by comparing standard deviations of log returns in equivalent time windows around events.

### Preliminary Event Findings

Initial analysis of major events reveals varying degrees of impact:

**High-Impact Events**: Events classified as high-impact show substantial price movements, often exceeding 10% changes in average price levels within the analysis window.

**Medium-Impact Events**: These events demonstrate moderate price effects, typically in the 3-7% range, with corresponding increases in volatility.

**Low-Impact Events**: Events with low expected impact show minimal price effects but may still contribute to increased market uncertainty.

## Dashboard Development

### Technical Architecture

The interactive dashboard employs a modern web architecture:

**Backend**: Flask-based API providing data access and analytical results
**Frontend**: React-based user interface with interactive visualizations
**Data Visualization**: Recharts library for responsive, interactive charts


## Challenges and Limitations

### Data Limitations

**Event Selection Bias**: The current event database represents a curated selection and may not capture all market-moving events, potentially introducing selection bias in the analysis.

**Temporal Resolution**: Daily price data may miss intraday volatility spikes that occur immediately following event announcements.

### Methodological Considerations

**Causality vs. Correlation**: While the analysis identifies temporal relationships between events and price changes, establishing definitive causal relationships requires careful consideration of confounding factors and alternative explanations.

**Model Assumptions**: The Bayesian change point model assumes specific distributional forms and may not capture all types of structural changes in the data.

## Next Steps

### Model Enhancement

Future work will focus on:

- **Multiple Change Points**: Extending the model to detect multiple change points within the time series
- **Regime Switching**: Implementing Markov-switching models to identify distinct market regimes
- **External Variables**: Incorporating additional economic indicators and market variables

### Validation and Testing

Comprehensive validation procedures will include:

- **Out-of-Sample Testing**: Evaluating model performance on held-out data
- **Cross-Validation**: Implementing time series cross-validation techniques
- **Sensitivity Analysis**: Testing model robustness to parameter choices and data variations

### Stakeholder Engagement

The project will continue developing tools for stakeholder communication:

- **Report Generation**: Automated reporting capabilities for regular market updates
- **Alert Systems**: Real-time monitoring for potential change points
- **Decision Support**: Integration with existing risk management frameworks

## Conclusion

The interim analysis demonstrates the feasibility and value of applying Bayesian change point detection to oil price analysis. The developed framework successfully identifies structural breaks in the time series and provides quantitative measures of event impacts. The interactive dashboard offers stakeholders an intuitive interface for exploring these relationships and understanding market dynamics.

The project is well-positioned to deliver actionable insights that support investment strategies, policy development, and operational planning in the energy sector. Continued development will enhance the analytical capabilities and expand the scope of the analysis to provide even more comprehensive market intelligence.

---

*This interim report represents work in progress. Final results and recommendations will be provided in the comprehensive final report upon project completion.*

