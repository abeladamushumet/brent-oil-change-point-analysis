import pandas as pd
import os

def load_oil_price_data(filepath: str) -> pd.DataFrame:
    """
    Load oil price time series data from a CSV file.
    
    Args:
        filepath (str): Path to the oil price CSV file.

    Returns:
        pd.DataFrame: DataFrame with 'Date' and 'Price' columns.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    df = pd.read_csv(filepath)

    # Basic checks
    required_cols = {'Date', 'Price'}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"Missing columns in oil price data. Required columns: {required_cols}")

    return df

def load_event_data(filepath: str) -> pd.DataFrame:
    """
    Load event data (e.g., geopolitical or OPEC events) from a CSV file.
    
    Args:
        filepath (str): Path to the event data CSV file.

    Returns:
        pd.DataFrame: DataFrame with 'Date' and 'Event' columns.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    df = pd.read_csv(filepath)

    # Basic checks
    required_cols = {'Date', 'Event'}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"Missing columns in event data. Required columns: {required_cols}")

    return df
