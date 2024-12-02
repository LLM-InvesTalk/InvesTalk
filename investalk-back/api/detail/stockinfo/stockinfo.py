import yfinance as yf
import math  # 올림 처리를 위해 추가

def get_stockInfo(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)
    
    # 최근 데이터 가져오기
    try:
        history_data = ticker.history(period="1d", interval="1m")
        if not history_data.empty:
            current_price = history_data['Close'].iloc[-1]
            current_price = int(current_price)  # 올림 처리
        else:
            current_price = 'N/A'
    except Exception as e:
        print(f"Error fetching history data for {ticker_symbol}: {e}")
        current_price = 'N/A'

    # 기존 정보 가져오기
    company_name = ticker.info.get('longName', 'N/A')
    symbol = ticker_symbol
    analyst_rating = ticker.info.get('recommendationMean', 'N/A')
    sector = ticker.info.get('sector', 'N/A')

    # 결과 반환
    return {
        "name": company_name,
        "symbol": symbol,
        "analyst_rating": analyst_rating,
        "sector": sector,
        "price": current_price
    }
