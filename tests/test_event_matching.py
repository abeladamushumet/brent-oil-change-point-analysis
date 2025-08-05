import pytest
import pandas as pd
from src.data.preprocess import load_and_clean_event_data

def test_load_event_data():
    # Load the event data 
    df_events = load_and_clean_event_data("data/raw/event_data_unprocessed.csv")
    
    # Check it is a DataFrame
    assert isinstance(df_events, pd.DataFrame)
    
    # Check expected columns exist
    expected_cols = {"EventDate", "EventName"}
    assert expected_cols.issubset(df_events.columns)
    
    # Check EventDate column is datetime type
    assert pd.api.types.is_datetime64_any_dtype(df_events["EventDate"])

def test_event_matching_logic():
    # Example event data to test matching logic
    data = {
        "EventDate": pd.to_datetime(["2020-01-01", "2020-06-01", "2021-01-01"]),
        "EventName": ["Event A", "Event B", "Event C"]
    }
    df_events = pd.DataFrame(data)

    # Assume change point date
    change_point_date = pd.Timestamp("2020-06-15")

    # Find events within 30 days of change point
    matched_events = df_events[
        (df_events["EventDate"] >= change_point_date - pd.Timedelta(days=30)) &
        (df_events["EventDate"] <= change_point_date + pd.Timedelta(days=30))
    ]
    
    # Check that only the event within 30 days is included
    assert len(matched_events) == 1
    assert matched_events.iloc[0]["EventName"] == "Event B"
