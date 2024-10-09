import yfinance as yf
from datetime import datetime, timedelta
import pytz
import pandas as pd

# NVIDIA 티커 심볼 설정
TICKER = "NVDA"

# NVIDIA 주식 데이터 다운로드
nvidia = yf.Ticker(TICKER)

def print_recent_data():
    # 현재 시간을 미국 동부 표준시(ET)로 변환하여 장중인지 확인합니다.
    eastern = pytz.timezone('US/Eastern')
    now = datetime.now(eastern)
    market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close = now.replace(hour=16, minute=0, second=0, microsecond=0)

    # 어제의 종가부터 현재까지의 가격 정보를 가져오기 위해 5분 간격 데이터를 가져옵니다.
    if market_open <= now <= market_close:
        start_date = (now - timedelta(days=1)).strftime('%Y-%m-%d')
        data = nvidia.history(interval="5m", start=start_date)
        
        # 데이터가 충분한지 확인합니다.
        if len(data) < 1:
            print("최근 데이터를 가져올 수 없습니다. 데이터를 확인해주세요.")
            return
        
        # 데이터를 출력합니다.
        print("어제 종가부터 현재까지 5분 간격의 NVIDIA 주식 데이터:")
        print(data)
    else:
        # 장이 열리지 않았을 때, 그제 종가부터 어제 장 종료까지의 데이터를 가져옵니다.
        start_date = (now - timedelta(days=2)).strftime('%Y-%m-%d')
        end_date = (now - timedelta(days=1)).strftime('%Y-%m-%d')
        data = nvidia.history(interval="5m", start=start_date, end=end_date)
        
        # 데이터가 충분한지 확인합니다.
        if len(data) < 1:
            print("최근 데이터를 가져올 수 없습니다. 데이터를 확인해주세요.")
            return
        
        # 데이터를 출력합니다.
        print("그제 종가부터 어제 장 종료까지 5분 간격의 NVIDIA 주식 데이터:")
        print(data)
        
if __name__ == "__main__":
    print_recent_data()