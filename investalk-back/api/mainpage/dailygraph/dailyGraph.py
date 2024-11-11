from flask import jsonify
import yfinance as yf
from flask import request
from datetime import datetime, timedelta

# 상위 20개 OECD 국가의 대표 ETF 티커 심볼 리스트
ETF_SYMBOLS = [
    'SPY',  # 미국
    'EWJ',  # 일본
    'EWG',  # 독일
    'EWQ',  # 프랑스
    'EWC',  # 캐나다
    'EWA',  # 호주
    'EWU',  # 영국
    'EWL',  # 스위스
    'EWK',  # 벨기에
    'EWD',  # 스웨덴
    'EWS',  # 싱가포르
    'EWH',  # 홍콩
    'EWI',  # 이탈리아
    'EWN',  # 네덜란드
    'EWP',  # 스페인
    'EWO',  # 오스트리아
    'EWD',  # 덴마크
    'EWY',  # 한국
    'EWZ',  # 브라질
    'EWT'   # 대만
]

def fetch_etf_data():
    etf_data = {}
    for symbol in ETF_SYMBOLS:
        try:
            etf = yf.Ticker(symbol)
            hist = etf.history(period="5d")  # 최근 5일간의 데이터를 가져옴
            
            if len(hist) >= 2:  # 데이터가 최소 2일 이상인 경우에만 처리
                today_price = float(hist['Close'].iloc[-1])  # 가장 최근 종가
                yesterday_price = float(hist['Close'].iloc[-2])  # 그 전날 종가
                
                etf_data[symbol] = {
                    "today_price": today_price,
                    "yesterday_price": yesterday_price
                }
            else:
                etf_data[symbol] = {"today_price": None, "yesterday_price": None}
        except Exception as e:
            etf_data[symbol] = {"today_price": None, "yesterday_price": None}
            print(f"Error fetching data for {symbol}: {str(e)}")
    
    return etf_data




def get_daily_graph_data():
    try:
        offset = int(request.args.get('offset', 0))  # 쿼리 매개변수로부터 offset 값 가져오기
        limit = 10  # 한 번에 가져올 데이터 수
        data = fetch_etf_data()  # ETF 데이터 가져오기

        # 상위 20개 중 offset에서 시작하여 limit만큼 슬라이싱
        sliced_data = dict(list(data.items())[offset:offset + limit])

        return jsonify(sliced_data), 200  # JSON 형식으로 반환
    except Exception as e:
        print(f"Server Error: {str(e)}")  # 오류 로그 출력
        return jsonify({"error": str(e)}), 500
