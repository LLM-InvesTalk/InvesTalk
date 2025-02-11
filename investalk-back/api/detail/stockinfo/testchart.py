import yfinance as yf
import datetime
from dateutil.relativedelta import relativedelta

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

            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                dataset.append({
                    "x": index.strftime("%Y-%m-%d"),
                    "y": float(market_cap)
                })

        elif period == "1m":
            start_date = end_date - relativedelta(months=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return []

            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                dataset.append({
                    "x": index.strftime("%Y-%m"),
                    "y": float(market_cap)
                })

        elif period == "1y":
            start_date = end_date - relativedelta(years=12)
            historical_data = ticker.history(start=start_date, end=end_date, interval='1mo')
            if historical_data.empty:
                print("No data available for the given period.")
                return []

            # 데이터를 연도로 그룹화
            historical_data = historical_data['Close'].resample('Y').last().to_frame()
            for index, row in historical_data.iterrows():
                market_cap = row['Close'] * shares_outstanding
                dataset.append({
                    "x": index.strftime("%Y"),  # 연도로 표시
                    "y": float(market_cap)
                })

    except Exception as e:
        print(f"Error fetching data for {ticker_symbol} with period {period}: {e}")

    return dataset

# 테스트
print(get_stockInfo_chart("AAPL", "1d"))  # 최근 30일 동안의 시가총액 변화
print(get_stockInfo_chart("AAPL", "1m"))  # 최근 12개월 동안의 시가총액 변화
print(get_stockInfo_chart("AAPL", "1y"))  # 최근 12년 동안의 시가총액 변화
