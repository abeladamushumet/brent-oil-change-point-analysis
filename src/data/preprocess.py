import pandas as pd
import os

# File paths
RAW_PRICE_PATH = r"C:\Users\hp\Desktop\10 Acadamy\VS code\brent-oil-change-point-analysis\data\raw\BrentOilPrices.csv"
RAW_EVENT_PATH = r"C:\Users\hp\Desktop\10 Acadamy\VS code\brent-oil-change-point-analysis\data\raw\event_data_unprocessed.csv"
PROCESSED_DIR = r"C:\Users\hp\Desktop\10 Acadamy\VS code\brent-oil-change-point-analysis\data\processed"
PROCESSED_PRICE_PATH = os.path.join(PROCESSED_DIR, "brent_oil_prices_processed.csv")
PROCESSED_EVENT_PATH = os.path.join(PROCESSED_DIR, "events_processed.csv")

os.makedirs(PROCESSED_DIR, exist_ok=True)


def clean_price_data(df):
    df.columns = df.columns.str.strip()
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.sort_values("Date")
    df = df.dropna(subset=["Date", "Price"])
    df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
    df = df.dropna(subset=["Price"])
    return df


def clean_event_data(df):
    df.columns = df.columns.str.strip()
    df = df.rename(columns={"EventName": "EventName", "EventDate": "EventDate"})
    df["EventDate"] = pd.to_datetime(df["EventDate"], errors="coerce")
    df = df.dropna(subset=["EventDate", "EventName"])
    df = df.sort_values("EventDate")
    return df


def load_and_clean_price_data(input_path=RAW_PRICE_PATH):
    print("🔹 Loading Brent oil price data...")
    df = pd.read_csv(input_path)
    print("🔹 Cleaning Brent oil price data...")
    return clean_price_data(df)


def load_and_clean_event_data(input_path=RAW_EVENT_PATH):
    print("🔹 Loading event data...")
    df = pd.read_csv(input_path)
    print("🔹 Cleaning event data...")
    return clean_event_data(df)


def save_cleaned_data(df_price, df_events, price_path=PROCESSED_PRICE_PATH, event_path=PROCESSED_EVENT_PATH):
    df_price.to_csv(price_path, index=False)
    print(f"✅ Saved cleaned oil price data to: {price_path}")

    df_events.to_csv(event_path, index=False)
    print(f"✅ Saved cleaned event data to: {event_path}")


if __name__ == "__main__":
    df_price = load_and_clean_price_data()
    df_events = load_and_clean_event_data()
    save_cleaned_data(df_price, df_events)
