import yfinance as yf
from datetime import datetime, timedelta
import pytz

# 이전 거래일 계산 함수 (단, 입력된 날짜도 거래일이면 그 날짜를 반환)
def get_previous_trading_day(date):
    date -= timedelta(days=1)  # 주말이나 공휴일일 경우 전날로 바로 넘김
    while True:
        if yf.Ticker('AAPL').history(start=date, end=date + timedelta(days=1)).shape[0] > 0:
            return date
        date -= timedelta(days=1)  # 거래일이 아닌 경우 계속 이전 날을 탐색

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

    # # 현재 시간을 9월 2일 공휴일로 설정 (예시)
    # now = datetime(2024, 10, 6, 7, 35, 0, tzinfo=ny_tz)
    
    yesterday = now - timedelta(days=1)
    
    # 장이 열려 있는지 확인
    if not is_market_open(now):
        # 시장이 열려 있지 않으면 전 거래일 데이터를 가져옴
        previous_trading_day = get_previous_trading_day(now - timedelta(days=1))
    else:
        # 시장이 열려 있으면 오늘 데이터를 사용
        previous_trading_day = get_previous_trading_day(now - timedelta(days=1))
    
    # 전날 장 중 데이터 가져오기
    yesterday_start = previous_trading_day.replace(hour=9, minute=30, second=0)
    yesterday_end = previous_trading_day.replace(hour=16, minute=0, second=0)
    yesterday_data = stock.history(start=yesterday_start, end=yesterday_end, interval="1m")

    # 전날 시가 및 종가 계산
    if not yesterday_data.empty:
        open_price = yesterday_data['Open'].iloc[0]  # 시가
        last_yesterday_close = yesterday_data['Close'].iloc[-1]  # 종가
    else:
        open_price = 0
        last_yesterday_close = 0  # 여기에 문제가 발생할 수 있으므로 수정
    
    # 만약 종가가 0이면, 데이터를 재확인하여 마지막 거래일의 종가를 가져옴
    if last_yesterday_close == 0:
        # 전날 데이터가 제대로 없을 경우 마지막 거래일 종가 가져오기
        previous_day_data = stock.history(start=previous_trading_day, end=previous_trading_day + timedelta(days=1))
        if not previous_day_data.empty:
            last_yesterday_close = previous_day_data['Close'].iloc[-1]  # 전날 종가를 재설정
    
    # 장중일 경우 현재 가격 가져오기
    if is_market_open(now):
        current_price = stock.history(start=now - timedelta(minutes=1), end=now, interval="1m")['Close'].iloc[-1] if not stock.history(start=now - timedelta(minutes=1), end=now, interval="1m").empty else last_yesterday_close
    else:
        current_price = last_yesterday_close

    # 전전날 데이터 가져오기
    two_days_ago = get_previous_trading_day(previous_trading_day - timedelta(days=1))
    two_days_ago_data = stock.history(start=two_days_ago.replace(hour=9, minute=30), end=two_days_ago.replace(hour=16, minute=0))
    
    if not two_days_ago_data.empty:
        two_days_ago_close = two_days_ago_data['Close'].iloc[-1]  # 전전날 종가
    else:
        two_days_ago_close = 0  # 데이터가 없을 경우 기본값 설정

    # 장중일 때는 현재 가격과 전날 종가의 차이로 등락폭 계산
    if is_market_open(now):
        percentage_change = (current_price - last_yesterday_close) / last_yesterday_close * 100 if last_yesterday_close else 0
    else:
        # 장중이 아닐 때는 전날 종가와 전전날 종가의 차이로 등락폭 계산
        percentage_change = (last_yesterday_close - two_days_ago_close) / two_days_ago_close * 100 if two_days_ago_close else 0

    rises_and_falls = {
        "change": round(percentage_change, 2), 
        "direction": "up" if percentage_change > 0 else "down",
        "from": last_yesterday_close if is_market_open(now) else two_days_ago_close,  # 기준 가격 설정
        "to": current_price if is_market_open(now) else last_yesterday_close,  # 현재 가격이나 전날 종가
        "time_from": previous_trading_day.replace(hour=16, minute=0).strftime("%Y-%m-%d %H:%M:%S") if is_market_open(now) else two_days_ago.replace(hour=16, minute=0).strftime("%Y-%m-%d %H:%M:%S"),
        "time_to": now.strftime("%Y-%m-%d %H:%M:%S") if is_market_open(now) else previous_trading_day.replace(hour=16, minute=0).strftime("%Y-%m-%d %H:%M:%S")
    }

    # 그래프 데이터에 첫번째 가격을 from 값으로 삽입
    graph_data = [rises_and_falls['from']] + list(yesterday_data['Close']) if not yesterday_data.empty else [rises_and_falls['from']]

    # 실적 발표 날짜 처리
    earnings_calendar = stock.get_earnings_dates()
    if not earnings_calendar.empty:
        future_earnings_dates = [date for date in earnings_calendar.index if date.tz_convert(ny_tz) > now]
        next_earnings_date = min(future_earnings_dates).strftime("%Y년 %m월 %d일") if future_earnings_dates else "실적 발표 예정 없음"
    else:
        next_earnings_date = "정보 없음"
    
    # 데이터가 언제의 데이터인지 확인하여 반환
    data_date = now.strftime("%Y년 %m월 %d일") if yesterday_data is not None and not yesterday_data.empty else previous_trading_day.strftime("%Y년 %m월 %d일")

    # 모든 데이터를 한 번에 반환
    return {
        "종목": symbol,
        "현재가격": current_price,  # 현재 가격 추가
        "그래프": graph_data,  # 수정된 그래프 데이터 반환
        "등락폭": rises_and_falls,
        "안정성": "",  # 아직 구현되지 않음
        "실적발표날짜": next_earnings_date,
        "데이터날짜": data_date,  # 데이터의 날짜 추가
        "나의희망가격": desired_price,
        "ai기준가능성": ""  # 아직 구현되지 않음
    }
