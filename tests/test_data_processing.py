import os
import pandas as pd
import pytest

from src.data import preprocess  # Make sure clean_price_data and clean_event_data are implemented here


def test_load_raw_price_data():
    # Test that the raw oil price CSV loads correctly
    path = "data/raw/BrentOilPrices.csv"
    assert os.path.exists(path), f"Raw price data file not found at {path}"
    df = pd.read_csv(path)
    assert not df.empty, "Raw price data is empty"
    assert "Date" in df.columns and "Price" in df.columns, "Missing expected columns in price data"


def test_clean_price_data():
    # Test the cleaning function on sample data
    df_raw = pd.DataFrame({
        "Date": ["2022-01-01", "2022-01-02", None],
        "Price": ["80.1", "81.2", "invalid"]
    })
    df_clean = preprocess.clean_price_data(df_raw)
    # Check Date column is datetime type
    assert pd.api.types.is_datetime64_any_dtype(df_clean["Date"])
    # Check Price column is numeric and no NaNs remain
    assert df_clean["Price"].dtype in [float, int]
    assert df_clean["Price"].notna().all()
    # Check rows with invalid data are dropped
    assert df_clean.shape[0] == 2


def test_load_raw_event_data():
    # Test raw event data file existence and loading
    path = "data/raw/event_data_unprocessed.csv"
    assert os.path.exists(path), f"Raw event data file not found at {path}"
    df = pd.read_csv(path)
    assert not df.empty, "Raw event data is empty"
    assert "EventName" in df.columns and "EventDate" in df.columns, "Missing expected columns in event data"


def test_clean_event_data():
    # Test cleaning function on sample event data
    df_raw = pd.DataFrame({
        "EventName": ["Event A", None, "Event C"],
        "EventDate": ["2020-01-01", "invalid_date", "2020-01-03"],
        "Description": ["Desc A", "Desc B", "Desc C"],
        "ExpectedImpact": ["High", "Low", "Medium"]
    })
    df_clean = preprocess.clean_event_data(df_raw)
    # Check EventDate is datetime
    assert pd.api.types.is_datetime64_any_dtype(df_clean["EventDate"])
    # Rows with invalid dates or missing EventName dropped
    assert df_clean.shape[0] == 2


if __name__ == "__main__":
    pytest.main([__file__])
