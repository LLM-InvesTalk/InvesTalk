import yfinance as yf
from datetime import datetime, timedelta
import pytz

# 이전 거래일 계산
def get_previous_trading_day(date):
    while True:
        date -= timedelta(days=1)
        if yf.Ticker('AAPL').history(start=date, end=date + timedelta(days=1)).shape[0] > 0:
            return date

def get_stock_data(symbol, desired_price=None):
    stock = yf.Ticker(symbol)
    ny_tz = pytz.timezone('America/New_York')
    now = datetime.now(ny_tz)
    yesterday = now - timedelta(days=1)
    previous_trading_day = get_previous_trading_day(yesterday)

    # 어제의 데이터 및 오늘의 데이터 순차적으로 가져옴
    yesterday_start = previous_trading_day.replace(hour=9, minute=30, second=0)
    yesterday_end = previous_trading_day.replace(hour=16, minute=0, second=0)
    yesterday_data = stock.history(start=yesterday_start, end=yesterday_end, interval="1m")

    market_open = now.replace(hour=9, minute=30, second=0)
    today_data = stock.history(start=market_open, end=now, interval="1m")

    last_yesterday_close = yesterday_data['Close'].iloc[-1] if not yesterday_data.empty else 0

    # 현재 가격 및 등락폭
    if not today_data.empty:
        current_price = today_data['Close'].iloc[-1]
        percentage_change = (current_price - last_yesterday_close) / last_yesterday_close * 100 if last_yesterday_close else 0
        rises_and_falls = {"change": round(percentage_change, 2), "direction": "up" if percentage_change > 0 else "down"}
    else:
        current_price = 0
        rises_and_falls = {"change": 0, "direction": "down"}

    price_changes = list(today_data['Close']) if not today_data.empty else []

    # 실적 발표 날짜 처리
    earnings_calendar = stock.get_earnings_dates()
    if not earnings_calendar.empty:
        future_earnings_dates = [date for date in earnings_calendar.index if date.tz_convert(ny_tz) > now]
        next_earnings_date = min(future_earnings_dates).strftime("%Y년 %m월 %d일") if future_earnings_dates else "실적 발표 예정 없음"
    else:
        next_earnings_date = "정보 없음"

    # 모든 데이터를 한 번에 반환
    return {
        "종목": symbol,
        "그래프": price_changes,
        "등락폭": rises_and_falls,
        "안정성": "",  # 아직 구현되지 않음
        "실적발표날짜": next_earnings_date,
        "나의희망가격": desired_price,
        "ai기준가능성": ""  # 아직 구현되지 않음
    }