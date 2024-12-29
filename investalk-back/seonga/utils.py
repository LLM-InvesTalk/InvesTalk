import yfinance as yf
from datetime import datetime, timedelta
import pytz

# 거래일 계산 (공휴일 또는 데이터 없는 날 포함)
def get_previous_trading_day(date, symbol):
    while True:
        try:
            # 데이터가 있는 날짜를 찾을 때까지 이전 날짜로 반복
            data = yf.Ticker(symbol).history(start=date, end=date + timedelta(days=1))
            if not data.empty:
                return date  # 거래 데이터가 있는 날짜 반환
        except Exception as e:
            print(f"Error checking trading day for {symbol}: {e}")
        date -= timedelta(days=1)  # 이전 날짜로 이동

# 시장이 열려 있는지 확인하는 함수 (뉴욕 증권 거래소 기준)
def is_market_open(now):
    market_open_time = now.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close_time = now.replace(hour=16, minute=0, second=0, microsecond=0)
    return market_open_time <= now <= market_close_time

# 주식 데이터 가져오기 함수
def get_stock_data(symbol, desired_price=None):
    stock = yf.Ticker(symbol)
    ny_tz = pytz.timezone('America/New_York')
    now = datetime.now(ny_tz)

    # 거래 가능한 가장 최근 거래일 계산
    previous_trading_day = get_previous_trading_day(now - timedelta(days=1), symbol)

    # 전날 장중 데이터 가져오기
    yesterday_start = previous_trading_day.replace(hour=9, minute=30, second=0)
    yesterday_end = previous_trading_day.replace(hour=16, minute=0, second=0)

    try:
        yesterday_data = stock.history(start=yesterday_start, end=yesterday_end, interval="1m")
        if yesterday_data.empty:
            print(f"No data for {symbol} on {previous_trading_day}. Checking for earlier trading days...")
            # 가장 최근 거래 데이터를 다시 검색
            previous_trading_day = get_previous_trading_day(previous_trading_day - timedelta(days=1), symbol)
            yesterday_start = previous_trading_day.replace(hour=9, minute=30, second=0)
            yesterday_end = previous_trading_day.replace(hour=16, minute=0, second=0)
            yesterday_data = stock.history(start=yesterday_start, end=yesterday_end, interval="1m")
    except Exception as e:
        print(f"Error fetching yesterday data for {symbol}: {e}")
        yesterday_data = None

    # 전날 시가 및 종가 계산
    if yesterday_data is not None and not yesterday_data.empty:
        open_price = yesterday_data['Open'].iloc[0]
        last_yesterday_close = yesterday_data['Close'].iloc[-1]
    else:
        open_price = 0
        last_yesterday_close = 0

    # 전전날 데이터 가져오기
    two_days_ago = get_previous_trading_day(previous_trading_day - timedelta(days=1), symbol)
    two_days_ago_start = two_days_ago.replace(hour=9, minute=30)
    two_days_ago_end = two_days_ago.replace(hour=16, minute=0)

    two_days_ago_data = stock.history(start=two_days_ago_start, end=two_days_ago_end)
    if not two_days_ago_data.empty:
        two_days_ago_close = two_days_ago_data['Close'].iloc[-1]
    else:
        two_days_ago_close = 0

    # 장중일 때 현재 가격과 전날 종가의 차이로 등락폭 계산
    if is_market_open(now):
        current_price_data = stock.history(start=now - timedelta(minutes=1), end=now, interval="1m")
        current_price = current_price_data['Close'].iloc[-1] if not current_price_data.empty else last_yesterday_close
    else:
        current_price = last_yesterday_close
        
    
    from_price = last_yesterday_close if is_market_open(now) else two_days_ago_close
    to_price = current_price if is_market_open(now) else last_yesterday_close

    percentage_change = (
        (to_price - from_price) / from_price * 100  # 100을 곱해서 퍼센트로 변환
    )
    rises_and_falls = {
        "change": round(percentage_change, 2),  # 소수점 둘째 자리까지 반올림
        "direction": "up" if percentage_change > 0 else "down",
        "from": from_price,
        "to": to_price,
        "time_from": previous_trading_day.strftime("%Y-%m-%d"),
        "time_to": now.strftime("%Y-%m-%d"),
    }

    # 그래프 데이터 생성
    graph_data = (
        [rises_and_falls["from"]] + list(yesterday_data["Close"]) if yesterday_data is not None and not yesterday_data.empty else [rises_and_falls["from"]]
    )

    # 실적 발표 날짜 가져오기
    try:
        earnings_calendar = stock.get_earnings_dates()
        if earnings_calendar is not None and not earnings_calendar.empty:
            future_earnings_dates = [
                date for date in earnings_calendar.index if date.tz_convert(ny_tz) > now
            ]
            next_earnings_date = (
                min(future_earnings_dates).strftime("%Y년 %m월 %d일")
                if future_earnings_dates
                else "실적 발표 예정 없음"
            )
        else:
            next_earnings_date = "정보 없음"
    except Exception as e:
        print(f"Error fetching earnings date for {symbol}: {e}")
        next_earnings_date = "정보 없음"

    data_date = now.strftime("%Y년 %m월 %d일") if yesterday_data is not None and not yesterday_data.empty else previous_trading_day.strftime("%Y년 %m월 %d일")

    return {
        "종목": symbol,
        "현재가격": current_price,
        "그래프": graph_data,
        "등락폭": rises_and_falls,
        "안정성": "",
        "실적발표날짜": next_earnings_date,
        "데이터날짜": data_date,
        "나의희망가격": desired_price,
        "ai기준가능성": "",
    }
