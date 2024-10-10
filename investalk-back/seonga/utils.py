import yfinance as yf
from datetime import datetime, timedelta
import pytz

# 이전 거래일 계산 함수 (단, 입력된 날짜도 거래일이면 그 날짜를 반환)
def get_previous_trading_day(date):
    while True:
        if yf.Ticker('AAPL').history(start=date, end=date + timedelta(days=1)).shape[0] > 0:
            return date
        date -= timedelta(days=1)

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
    yesterday = now - timedelta(days=1)
    
    # 장이 열려 있는지 확인
    if not is_market_open(now):
        # 시장이 열려 있지 않으면 어제 날짜를 기준으로 전날 데이터를 가져옴
        previous_trading_day = get_previous_trading_day(now - timedelta(days=1))
    else:
        # 시장이 열려 있으면 오늘 데이터를 사용
        previous_trading_day = get_previous_trading_day(now - timedelta(days=1))
    
    # 전날 장 중 데이터 가져오기
    yesterday_start = previous_trading_day.replace(hour=9, minute=30, second=0)
    yesterday_end = previous_trading_day.replace(hour=16, minute=0, second=0)
    yesterday_data = stock.history(start=yesterday_start, end=yesterday_end, interval="1m")

    # 오늘 장 중 데이터 가져오기 (시장 열려 있을 때만)
    market_open = now.replace(hour=9, minute=30, second=0)
    today_data = stock.history(start=market_open, end=now, interval="1m") if is_market_open(now) else None

    # 전날 시가 및 종가 계산
    if not yesterday_data.empty:
        open_price = yesterday_data['Open'].iloc[0]  # 시가
        last_yesterday_close = yesterday_data['Close'].iloc[-1]  # 종가
    else:
        open_price = 0
        last_yesterday_close = 0

    # 현재 가격 및 등락폭 계산
    if today_data is not None and not today_data.empty:
        current_price = today_data['Close'].iloc[-1]
        percentage_change = (current_price - last_yesterday_close) / last_yesterday_close * 100 if last_yesterday_close else 0
        rises_and_falls = {"change": round(percentage_change, 2), "direction": "up" if percentage_change > 0 else "down"}
        price_changes = list(today_data['Close'])  # 오늘 데이터를 기반으로 price_changes 생성
    else:
        current_price = last_yesterday_close  # 장 마감 시 전날 종가로 설정
        # 시가와 종가 차이를 이용한 등락폭 계산
        percentage_change = (last_yesterday_close - open_price) / open_price * 100 if open_price else 0
        rises_and_falls = {"change": round(percentage_change, 2), "direction": "up" if percentage_change > 0 else "down"}
        price_changes = list(yesterday_data['Close']) if yesterday_data is not None and not yesterday_data.empty else []  # 전날 데이터를 기반으로 price_changes 생성

    # 실적 발표 날짜 처리
    earnings_calendar = stock.get_earnings_dates()
    if not earnings_calendar.empty:
        future_earnings_dates = [date for date in earnings_calendar.index if date.tz_convert(ny_tz) > now]
        next_earnings_date = min(future_earnings_dates).strftime("%Y년 %m월 %d일") if future_earnings_dates else "실적 발표 예정 없음"
    else:
        next_earnings_date = "정보 없음"
    
    # 데이터가 언제의 데이터인지 확인하여 반환
    data_date = now.strftime("%Y년 %m월 %d일") if today_data is not None and not today_data.empty else previous_trading_day.strftime("%Y년 %m월 %d일")

    # 모든 데이터를 한 번에 반환
    return {
        "종목": symbol,
        "그래프": price_changes,
        "등락폭": rises_and_falls,
        "안정성": "",  # 아직 구현되지 않음
        "실적발표날짜": next_earnings_date,
        "데이터날짜": data_date,  # 데이터의 날짜 추가
        "나의희망가격": desired_price,
        "ai기준가능성": ""  # 아직 구현되지 않음
    }
