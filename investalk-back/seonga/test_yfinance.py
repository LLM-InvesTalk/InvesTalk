# # import yfinance as yf
# # from datetime import datetime, timedelta
# # import pytz
# #
# # # 주말 제외 거래일 계산 함수
# # def get_previous_trading_day(date):
# #     while date.weekday() >= 5:  # 5: Saturday, 6: Sunday
# #         date -= timedelta(days=1)
# #     return date
# #
# # def fetch_stock_data(symbol):
# #     stock = yf.Ticker(symbol)
# #
# #     # 현재 시간 가져오기 (미국 동부 시간대)
# #     est = pytz.timezone('US/Eastern')
# #     now = datetime.now(est)
# #
# #     # 최근 거래일 계산
# #     end_date = now.date() if now.hour >= 9 else now.date() - timedelta(days=1)
# #     end_date = get_previous_trading_day(end_date)
# #     start_date = end_date - timedelta(days=1)
# #
# #     # 데이터 가져오기
# #     history = stock.history(start=start_date, end=end_date)
# #
# #     # 그래프 데이터
# #     graph_data = history['Close'].tolist()
# #
# #     # 등락폭 계산
# #     if len(history) > 1:
# #         change_percent = ((history['Close'].iloc[-1] - history['Close'].iloc[-2]) / history['Close'].iloc[-2]) * 100
# #     else:
# #         change_percent = 0
# #
# #     # 0.1 이상일 때만 표시
# #     change_percent = round(change_percent, 2) if abs(change_percent) >= 0.1 else 0
# #
# # # 실적 발표 날짜 가져오기
# # def get_earnings_date(stock):
# #     try:
# #         earnings_dates = stock.earnings_dates
# #         if not earnings_dates.empty:
# #             # 가장 가까운 실적 발표 날짜 가져오기
# #             closest_date = earnings_dates.index[0]
# #             return closest_date.strftime('%Y-%m-%d')
# #     except Exception as e:
# #         print(f"Error fetching earnings date: {e}")
# #     return "N/A"
# #
# #     # 결과 출력
# #     print(f"Stock: {symbol}")
# #     print(f"Graph Data: {graph_data}")
# #     print(f"Change Percent: {change_percent}%")
# #     print(f"Earnings Date: {get_earnings_date(stock)}")
# #     print("-------------")
# #
# # # 테스트할 종목 목록
# # symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']
# #
# # for symbol in symbols:
# #     fetch_stock_data(symbol)
#
# from flask import Flask, jsonify
# import yfinance as yf
# from datetime import datetime, timedelta
# import pytz
#
# app = Flask(__name__)
#
# def get_stock_data(symbol):
#     # yfinance 라이브러리를 사용하여 주식 정보를 가져옵니다
#     stock = yf.Ticker(symbol)
#
#     # 뉴욕 시간대 설정 (미국 주식 시장 기준)
#     ny_tz = pytz.timezone('America/New_York')
#     now = datetime.now(ny_tz)
#
#     # 장 시작 시간 설정 (뉴욕 시간 09:30)
#     market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
#
#     # 오늘의 주식 데이터 가져오기 (1분 간격)
#     today_data = stock.history(start=market_open, end=now, interval="1m")
#
#     # 그래프 데이터: 종가(Close) 가격 리스트
#     graph_data = today_data['Close'].tolist()
#
#     # 등락폭 계산
#     if not today_data.empty:
#         previous_close = stock.info['previousClose']  # 전일 종가
#         current_price = today_data['Close'].iloc[-1]  # 현재 가격
#         # 등락폭을 백분율로 계산하고 소수점 첫째 자리까지 반올림
#         change_percent = round((current_price - previous_close) / previous_close * 100, 1)
#     else:
#         change_percent = 0  # 데이터가 없을 경우 0으로 설정
#
#     # 다음 실적 발표일 가져오기
#     next_earnings_date = stock.calendar.iloc[0, 0] if not stock.calendar.empty else None
#     if next_earnings_date:
#         # 날짜 형식을 "YYYY년 MM월 DD일"로 변환
#         next_earnings_date = next_earnings_date.strftime("%Y년 %m월 %d일")
#     else:
#         next_earnings_date = "정보 없음"
#
#     # 결과 딕셔너리 반환
#     return {
#         "종목": symbol,
#         "그래프": graph_data,
#         "등락폭": f"{change_percent}%",
#         "실적발표날짜": next_earnings_date,
#         "안정성": "",  # 구현되지 않은 필드
#         "나의희망가격": "",  # 구현되지 않은 필드
#         "ai기준가능성": ""  # 구현되지 않은 필드
#     }
#
# @app.route('/api/stocks/<symbol>')
# def get_stock_info(symbol):
#     try:
#         # 주식 데이터 가져오기
#         stock_data = get_stock_data(symbol)
#         return jsonify(stock_data)  # JSON 형식으로 응답
#     except Exception as e:
#         # 에러 발생 시 400 Bad Request 응답
#         return jsonify({"error": str(e)}), 400
#
# if __name__ == '__main__':
#     app.run(debug=True)  # 디버그 모드로 Flask 앱 실행