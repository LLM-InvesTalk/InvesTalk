import yfinance as yf

def get_stockInfo(ticker_symbol):
    # yfinance에서 Ticker 객체 생성
    ticker = yf.Ticker(ticker_symbol)

    # 회사 이름
    company_name = ticker.info.get('longName', 'N/A')

    # 티커 심볼
    symbol = ticker_symbol

    # 애널리스트 평점
    analyst_rating = ticker.info.get('recommendationMean', 'N/A')  # 1.0: Strong Buy, 5.0: Strong Sell

    if analyst_rating != 'N/A':
        try:
            analyst_rating = float(analyst_rating)
            reversed_analyst_rating = 5.0 - (analyst_rating - 1.0)
        except ValueError:
            reversed_analyst_rating = 'N/A'
    else:
        reversed_analyst_rating = 'N/A'

    # 섹터 정보
    sector = ticker.info.get('sector', 'N/A')

    # 결과 반환
    return {
        "name": company_name,
        "symbol": symbol,
        "analyst_rating": reversed_analyst_rating,
        "sector": sector
    }