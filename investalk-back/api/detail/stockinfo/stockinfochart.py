import yfinance as yf
import datetime
from dateutil.relativedelta import relativedelta
import numpy as np

def get_stockInfo_chart(ticker_symbol, period):
    ticker = yf.Ticker(ticker_symbol)
    shares_outstanding = ticker.info.get('sharesOutstanding', 0)
    end_date = datetime.datetime.now(datetime.timezone.utc)
    dataset = []
    last_percentage_change = None  # 마지막 증감률을 저장할 변수

    try:
        if period == "1d":
            start_date = end_date - datetime.timedelta(days=30)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1d')
            if historical_data.empty:
                print("No data available for the given period.")
                return {"dataset": [], "percentage_change": None}

            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            # 스케일링 (0에서 100 사이로 변환)
            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            # 시각화용 데이터를 dataset에 저장
            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)  # 소수점 제거
                })

            # 마지막 값과 그 전 값으로 증감률 계산 (실제 시가총액 기준)
            if len(market_caps) > 1:
                last_percentage_change = (market_caps[-1] - market_caps[-2]) / market_caps[-2] * 100
                last_percentage_change = round(last_percentage_change, 2)
                
        elif period == "1m":
            start_date = end_date - relativedelta(months=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return {"dataset": [], "percentage_change": None}

            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)
                })

            if len(scaled_market_caps) > 1:
                last_percentage_change = (scaled_market_caps[-1] - scaled_market_caps[-2]) / scaled_market_caps[-2] * 100
                last_percentage_change = round(last_percentage_change, 2)

        elif period == "1y":
            start_date = end_date - relativedelta(years=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return {"dataset": [], "percentage_change": None}

            historical_data = historical_data['Close'].resample('YE').last().to_frame()
            market_caps = []
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                market_caps.append(market_cap)

            min_val = min(market_caps)
            max_val = max(market_caps)
            scaled_market_caps = [(mc - min_val) / (max_val - min_val) * 100 for mc in market_caps]

            for idx, value in enumerate(scaled_market_caps):
                dataset.append({
                    "x": idx,
                    "y": int(value)
                })

            if len(scaled_market_caps) > 1:
                last_percentage_change = (scaled_market_caps[-1] - scaled_market_caps[-2]) / scaled_market_caps[-2] * 100
                last_percentage_change = round(last_percentage_change, 2)

    except Exception as e:
        print(f"Error fetching data for {ticker_symbol} with period {period}: {e}")

    return {
        "data": dataset, 
        "percentage_change": last_percentage_change  # 마지막 증감률만 반환
    }
