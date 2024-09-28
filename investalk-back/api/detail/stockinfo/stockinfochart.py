import yfinance as yf
import datetime
from dateutil.relativedelta import relativedelta
import numpy as np

def get_stockInfo_chart(ticker_symbol, period):
    ticker = yf.Ticker(ticker_symbol)
    shares_outstanding = ticker.info.get('sharesOutstanding', 0)
    end_date = datetime.datetime.now(datetime.timezone.utc)
    dataset = []

    try:
        if period == "1d":
            start_date = end_date - datetime.timedelta(days=30)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1d')
            if historical_data.empty:
                print("No data available for the given period.")
                return []

            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            # 스케일링 (0에서 100 사이로 변환)
            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)  # 소수점 제거
                })

        elif period == "1m":
            start_date = end_date - relativedelta(months=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return []

            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            # 스케일링 (0에서 100 사이로 변환)
            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)  # 소수점 제거
                })

        elif period == "1y":
            start_date = end_date - relativedelta(years=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return []

            historical_data = historical_data['Close'].resample('YE').last().to_frame()
            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            # 스케일링 (0에서 100 사이로 변환)
            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)  # 소수점 제거
                })

    except Exception as e:
        print(f"Error fetching data for {ticker_symbol} with period {period}: {e}")

    return dataset
