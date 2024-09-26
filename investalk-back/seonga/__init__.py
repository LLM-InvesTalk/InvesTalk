# # from flask import Flask
# # from flask_sqlalchemy import SQLAlchemy
# # from flask_migrate import Migrate
# #
# # db = SQLAlchemy()
# #
# # def create_app():
# #     app = Flask(__name__)
# #
# #     # MySQL 연결 URI 설정
# #     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:19960201@localhost:3306/InvesTalkUser'
# #     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# #
# #     # 환경변수와 DB 설정 불러오기
# #     app.config.from_pyfile('../config.py')
# #
# #     db.init_app(app)
# #     migrate = Migrate(app, db)
# #
# #     # 블루프린트 라우트 등록
# #     from .routes import main as main_blueprint
# #     app.register_blueprint(main_blueprint)
# #
# #     return app
#
# import yfinance as yf
#
# from flask import Flask
# from .routes import main
#
# def create_app():
#     app = Flask(__name__)
#     app.register_blueprint(main)
#     return app
#
# def get_stock_data(stock_symbols):
#     stock_data = []
#     for symbol in stock_symbols:
#         stock = yf.Ticker(symbol)
#         data = stock.history(period="1d")
#
#         if not data.empty:
#             last_quote = data.iloc[-1]
#             result = {
#                 'symbol': symbol,
#                 'price': last_quote['Close'],
#                 'change': last_quote['Close'] - last_quote['Open'],
#                 'earnings_date': stock.earnings_dates  # 추가 정보도 가져올 수 있음
#             }
#             stock_data.append(result)
#     return stock_data
#
# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True)







# from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
# import yfinance as yf
# from datetime import datetime, timedelta
# import pytz
#
# app = Flask(__name__)
#
# # MySQL 데이터베이스 설정
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/dbname'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
#
# # 사용자 모델 정의
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#
# # 관심 종목 모델 정의
# class FavoriteStock(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     symbol = db.Column(db.String(10), nullable=False)
#     user = db.relationship('User', backref=db.backref('favorite_stocks', lazy=True))
#
# def get_stock_data(symbol):
#     stock = yf.Ticker(symbol)
#
#     ny_tz = pytz.timezone('America/New_York')
#     now = datetime.now(ny_tz)
#
#     market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
#
#     today_data = stock.history(start=market_open, end=now, interval="1m")
#
#     graph_data = today_data['Close'].tolist()
#
#     if not today_data.empty:
#         previous_close = stock.info['previousClose']
#         current_price = today_data['Close'].iloc[-1]
#         change_percent = round((current_price - previous_close) / previous_close * 100, 1)
#     else:
#         change_percent = 0
#
#     next_earnings_date = stock.calendar.iloc[0, 0] if not stock.calendar.empty else None
#     if next_earnings_date:
#         next_earnings_date = next_earnings_date.strftime("%Y년 %m월 %d일")
#     else:
#         next_earnings_date = "정보 없음"
#
#     return {
#         "종목": symbol,
#         "그래프": graph_data,
#         "등락폭": f"{change_percent}%",
#         "안정성": "",
#         "실적발표날짜": next_earnings_date,
#         "나의희망가격": "",
#         "ai기준가능성": ""
#     }
#
# @app.route('/api/stocks/<symbol>')
# def get_stock_info(symbol):
#     try:
#         stock_data = get_stock_data(symbol)
#         return jsonify(stock_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<int:user_id>/favorite_stocks')
# def get_user_favorite_stocks(user_id):
#     try:
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404
#
#         favorite_stocks = FavoriteStock.query.filter_by(user_id=user_id).all()
#
#         if not favorite_stocks:
#             return jsonify({"message": "관심 있는 종목을 즐겨찾기에 추가하세요."})
#
#         stocks_data = [get_stock_data(stock.symbol) for stock in favorite_stocks]
#
#         return jsonify(stocks_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<int:user_id>/add_favorite', methods=['POST'])
# def add_favorite_stock(user_id):
#     try:
#         symbol = request.json['symbol']
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404
#
#         existing_favorite = FavoriteStock.query.filter_by(user_id=user_id, symbol=symbol).first()
#         if existing_favorite:
#             return jsonify({"message": "이미 관심 종목으로 등록되어 있습니다."}), 400
#
#         new_favorite = FavoriteStock(user_id=user_id, symbol=symbol)
#         db.session.add(new_favorite)
#         db.session.commit()
#
#         return jsonify({"message": f"{symbol} 추가됨"})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<int:user_id>/remove_favorite', methods=['POST'])
# def remove_favorite_stock(user_id):
#     try:
#         symbol = request.json['symbol']
#         favorite = FavoriteStock.query.filter_by(user_id=user_id, symbol=symbol).first()
#         if favorite:
#             db.session.delete(favorite)
#             db.session.commit()
#             return jsonify({"message": f"{symbol} 제거됨"})
#         else:
#             return jsonify({"error": "관심 종목을 찾을 수 없습니다."}), 404
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 400
#
# if __name__ == '__main__':
#     db.create_all()  # 데이터베이스 테이블 생성
#     app.run(debug=True)





# from flask import Flask, jsonify, request
# import yfinance as yf
# from datetime import datetime, timedelta
# import pytz
#
# app = Flask(__name__)
#
# # 모의 데이터베이스: 실제 구현 시 데이터베이스로 교체해야 함
# mock_db = {
#     "user1": ["AAPL", "GOOGL", "MSFT"]
# }
#
# def get_stock_data(symbol):
#     # 이전 코드와 동일
#     stock = yf.Ticker(symbol)
#
#     ny_tz = pytz.timezone('America/New_York')
#     now = datetime.now(ny_tz)
#
#     market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
#
#     today_data = stock.history(start=market_open, end=now, interval="1m")
#
#     graph_data = today_data['Close'].tolist()
#
#     if not today_data.empty:
#         previous_close = stock.info['previousClose']
#         current_price = today_data['Close'].iloc[-1]
#         change_percent = round((current_price - previous_close) / previous_close * 100, 1)
#     else:
#         change_percent = 0
#
#     next_earnings_date = stock.calendar.iloc[0, 0] if not stock.calendar.empty else None
#     if next_earnings_date:
#         next_earnings_date = next_earnings_date.strftime("%Y년 %m월 %d일")
#     else:
#         next_earnings_date = "정보 없음"
#
#     return {
#         "종목": symbol,
#         "그래프": graph_data,
#         "등락폭": f"{change_percent}%",
#         "실적발표날짜": next_earnings_date,
#         "안정성": "",
#         "나의희망가격": "",
#         "ai기준가능성": ""
#     }
#
# @app.route('/')
# def home():
#     return "Welcome to the Stock Table Home!"
#
# @app.route('/api/stocks/<symbol>')
# def get_stock_info(symbol):
#     try:
#         stock_data = get_stock_data(symbol)
#         return jsonify(stock_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<user_id>/favorite_stocks')
# def get_user_favorite_stocks(user_id):
#     try:
#         # 사용자의 관심 종목 목록 가져오기
#         favorite_stocks = mock_db.get(user_id, [])
#
#         if not favorite_stocks:
#             # 관심 종목이 없는 경우
#             return jsonify({"message": "관심 있는 종목을 즐겨찾기에 추가해보세요!"})
#
#         # 각 관심 종목의 정보 가져오기
#         stocks_data = [get_stock_data(symbol) for symbol in favorite_stocks]
#
#         return jsonify(stocks_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<user_id>/add_favorite', methods=['POST'])
# def add_favorite_stock(user_id):
#     try:
#         symbol = request.json['symbol']
#         if user_id not in mock_db:
#             mock_db[user_id] = []
#         if symbol not in mock_db[user_id]:
#             mock_db[user_id].append(symbol)
#         return jsonify({"message": f"{symbol} 추가됨", "favorites": mock_db[user_id]})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# @app.route('/api/user/<user_id>/remove_favorite', methods=['POST'])
# def remove_favorite_stock(user_id):
#     try:
#         symbol = request.json['symbol']
#         if user_id in mock_db and symbol in mock_db[user_id]:
#             mock_db[user_id].remove(symbol)
#         return jsonify({"message": f"{symbol} 제거됨", "favorites": mock_db[user_id]})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# if __name__ == '__main__':
#     app.run(port=5001, debug=True)






# from flask import Flask, jsonify
# from datetime import datetime
# from collections import OrderedDict
# from bs4 import BeautifulSoup
# import yfinance as yf, pytz, requests, time, cloudscraper
#
# app = Flask(__name__)
#
# # 모의 데이터베이스: 실제 구현 시 데이터베이스로 교체해야 함
# mock_db = {
#     "user1": ["AAPL", "GOOGL", "MSFT"]  # 사용자별 관심 종목
# }
#
# def search_investing(symbol):
#     search_query = f"{symbol} site:investing.com 실적"
#     search_url = f"https://www.google.com/search?q={search_query}"
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#     }
#     try:
#         response = requests.get(search_url, headers=headers, timeout=5)  # 타임아웃 설정
#         if response.status_code == 200:
#             soup = BeautifulSoup(response.text, 'html.parser')
#             first_result = soup.find('h3')
#             if first_result:
#                 link = first_result.find_parent('a')['href']
#                 return link
#             else:
#                 return "정보 없음"
#         else:
#             print(f"검색 실패: {response.status_code}")  # 에러 로그
#             return "검색 실패"
#     except Exception as e:
#         print(f"검색 중 에러 발생: {e}")  # 에러 로그
#         return "검색 실패"
#
# def get_next_earnings_date(symbol):
#     search_url = search_investing(symbol)
#     if search_url == "정보 없음" or search_url == "검색 실패":
#         return "정보 없음"
#
#     scraper = cloudscraper.create_scraper()
#
#     for _ in range(3):  # 최대 3회 재시도
#         try:
#             response = scraper.get(search_url, timeout=5)  # 타임아웃 설정
#             if response.status_code == 200:
#                 soup = BeautifulSoup(response.content, 'html.parser')
#                 earnings_rows = soup.find_all('tr', attrs={"name": "instrumentEarningsHistory"})
#                 if not earnings_rows:
#                     return "정보 없음"
#
#                 for row in earnings_rows:
#                     earnings_date = row.get('event_timestamp')
#                     if earnings_date:
#                         formatted_date = datetime.strptime(earnings_date, "%Y-%m-%d").strftime("%Y년 %m월 %d일")
#                         return formatted_date
#             else:
#                 print(f"페이지 로드 실패: {response.status_code}")  # 에러 로그
#                 return "정보 없음"
#         except Exception as e:
#             print(f"페이지 로드 중 에러 발생: {e}")  # 에러 로그
#         time.sleep(1)  # 재시도 사이에 잠시 대기
#
#     return "정보 없음"
#
# def get_stock_data(symbol):
#     stock = yf.Ticker(symbol)
#
#     # 뉴욕 시간대에서 현재 시간 가져오기
#     ny_tz = pytz.timezone('America/New_York')
#     now = datetime.now(ny_tz)
#
#     # 시장이 열리는 시간 정의
#     market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
#     market_close = now.replace(hour=16, minute=0, second=0, microsecond=0)
#
#     # 현재 시간이 시장 시간 안에 있는지 확인
#     if market_open <= now <= market_close:
#         # 오늘의 분 단위 주식 데이터를 시도
#         today_data = stock.history(start=market_open, end=now, interval="1m")
#     else:
#         # 시장 시간이 아닐 경우 가장 최근 하루 동안의 데이터를 가져오기
#         today_data = stock.history(period="1d", interval="1d")
#
#     if today_data.empty:
#         return {"error": "주식 데이터가 없습니다."}
#
#     # 그래프 데이터 추출 및 변동률 계산
#     graph_data = today_data['Close'].tolist()
#     previous_close = stock.info.get('previousClose', 0)
#     current_price = today_data['Close'].iloc[-1]
#
#     if previous_close != 0:  # 0으로 나누지 않도록 방지
#         change_percent = round((current_price - previous_close) / previous_close * 100, 1)
#     else:
#         change_percent = 0
#
#     # cloudscraper를 사용하여 실적 발표 날짜 가져오기
#     next_earnings_date = get_next_earnings_date(symbol)
#
#     return OrderedDict([
#         ("종목", symbol),
#         ("그래프", graph_data),
#         ("등락폭", f"{change_percent}%"),
#         ("안정성", ""),
#         ("실적발표날짜", next_earnings_date),
#         ("나의희망가격", ""),
#         ("ai기준가능성", "")
#     ])
#
# @app.route('/')
# def show_favorite_stocks():
#     try:
#         user_id = "user1"  # 하드코딩된 사용자
#         favorite_stocks = mock_db.get(user_id, [])
#
#         if not favorite_stocks:
#             return jsonify({"message": "관심 있는 종목을 추가하세요."})
#
#         stocks_data = [get_stock_data(symbol) for symbol in favorite_stocks]
#         return jsonify(stocks_data)
#
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#
# if __name__ == '__main__':
#     app.run(port=5002, debug=True)





from flask import Flask, jsonify
from datetime import datetime
from collections import OrderedDict
from bs4 import BeautifulSoup
import yfinance as yf
import pytz
import requests
import time
import cloudscraper

app = Flask(__name__)

# 모의 데이터베이스: 실제 구현 시 데이터베이스로 교체해야 함
mock_db = {
    "user1": ["AAPL", "GOOGL", "MSFT"]  # 사용자별 관심 종목
}

def get_yahoo_finance_link(symbol):
    return f"https://finance.yahoo.com/calendar/earnings?symbol={symbol}"

def get_next_earnings_date(symbol):
    search_url = get_yahoo_finance_link(symbol)

    scraper = cloudscraper.create_scraper()

    for _ in range(3):  # 최대 3회 재시도
        try:
            response = scraper.get(search_url, timeout=5)  # 타임아웃 설정
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                earnings_rows = soup.find_all('tr', class_='BdT')

                if not earnings_rows:
                    return "정보 없음"

                # 가장 가까운 실적 발표 날짜 가져오기
                for row in earnings_rows:
                    date_cell = row.find('td', class_='C(black) W(100%)')
                    if date_cell:
                        earnings_date = date_cell.text.strip()
                        # "YYYY-MM-DD" 형식으로 변환
                        if earnings_date:
                            return earnings_date  # 직접 날짜 반환
            else:
                print(f"페이지 로드 실패: {response.status_code}")  # 에러 로그
                return "정보 없음"
        except Exception as e:
            print(f"페이지 로드 중 에러 발생: {e}")  # 에러 로그
        time.sleep(1)  # 재시도 사이에 잠시 대기

    return "정보 없음"

def get_stock_data(symbol):
    stock = yf.Ticker(symbol)

    # 뉴욕 시간대에서 현재 시간 가져오기
    ny_tz = pytz.timezone('America/New_York')
    now = datetime.now(ny_tz)

    # 시장이 열리는 시간 정의
    market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close = now.replace(hour=16, minute=0, second=0, microsecond=0)

    # 현재 시간이 시장 시간 안에 있는지 확인
    if market_open <= now <= market_close:
        # 오늘의 분 단위 주식 데이터를 시도
        today_data = stock.history(start=market_open, end=now, interval="1m")
    else:
        # 시장 시간이 아닐 경우 가장 최근 하루 동안의 데이터를 가져오기
        today_data = stock.history(period="1d", interval="1d")

    if today_data.empty:
        return {"error": "주식 데이터가 없습니다."}

    # 그래프 데이터 추출 및 변동률 계산
    graph_data = today_data['Close'].tolist()
    previous_close = stock.info.get('previousClose', 0)
    current_price = today_data['Close'].iloc[-1]

    if previous_close != 0:  # 0으로 나누지 않도록 방지
        change_percent = round((current_price - previous_close) / previous_close * 100, 1)
    else:
        change_percent = 0

    # Yahoo Finance를 사용하여 실적 발표 날짜 가져오기
    next_earnings_date = get_next_earnings_date(symbol)

    return OrderedDict([
        ("종목", symbol),
        ("그래프", graph_data),
        ("등락폭", f"{change_percent}%"),
        ("안정성", ""),
        ("실적발표날짜", next_earnings_date),
        ("나의희망가격", ""),
        ("ai기준가능성", "")
    ])

@app.route('/')

@app.route('/api/stocks', methods=['GET'])
def show_favorite_stocks():
    try:
        user_id = "user1"  # 하드코딩된 사용자
        favorite_stocks = mock_db.get(user_id, [])

        if not favorite_stocks:
            return jsonify({"message": "관심 있는 종목을 추가하세요."})

        stocks_data = [get_stock_data(symbol) for symbol in favorite_stocks]
        return jsonify(stocks_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5002, debug=True)