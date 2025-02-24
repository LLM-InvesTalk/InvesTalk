import sys
import os

# 현재 파일 위치에서 상위 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from flask import Blueprint, jsonify,request  
from .detail.recommend.sectorRecommend import get_ticker_sector, get_similar_sectors
from .detail.recommend.enterpriseRecommend import calculate_average_growth
from .detail.recommend.NewsRecommend import get_related_news

from .detail.financialstatements.financialstatements import get_quarterly_financials
from .detail.stockinfo.stockinfo import get_stockInfo
from .detail.stockinfo.stockinfochart import get_stockInfo_chart
from .detail.search.search import search
from .detail.chatting.chatting import chatting
from .detail.analyze.assistockAnalyze import chat_with_gpt

# Blueprint 생성
from api.mainpage.dailygraph.dailyGraph import get_daily_graph_data
from api.mainpage.news.dailyNews import get_news

api_bp = Blueprint('api', __name__)

# ETF 그래프 데이터 라우트
@api_bp.route('/etf-data', methods=['GET'])
def get_etf_data():
    return get_daily_graph_data()

# 뉴스 데이터 라우트
@api_bp.route('/get-news', methods=['GET'])
def fetch_news():
    return get_news()

@api_bp.route('/recommend-sectors/<ticker_symbol>', methods=['GET'])
def recommend_sectors(ticker_symbol):
    """
    1) ticker_symbol을 path param으로 받음 (예: /recommend-sectors/AAPL)
    2) 해당 ticker_symbol로 섹터 및 유사 섹터들을 조회
    """
    sector = get_ticker_sector(ticker_symbol)
    # 섹터 정보가 없을 경우 처리
    if sector == 'N/A':
        return jsonify({
            'error': f"섹터 정보를 찾을 수 없습니다. (ticker: {ticker_symbol})"
        }), 404
    
    similar_sectors = get_similar_sectors(sector)
    
    return jsonify({
        'ticker': ticker_symbol,
        'sector': sector,
        'similar_sectors': similar_sectors
    })

@api_bp.route('/average-growth', methods=['POST'])
def average_growth():
    # 프론트에서 4개의 종목을 JSON 형식으로 받음
    data = request.get_json()
    tickers = data.get('tickers')

    # 받은 종목들을 콘솔에 출력
    print(f"Received tickers from front-end: {tickers}")
    
    # 4개의 종목이 주어졌는지 확인
    if len(tickers) != 4:
        return jsonify({'error': 'Exactly 4 tickers are required'}), 400

    # 종목들의 평균 성장률 계산
    result = calculate_average_growth(tickers)
    
    return jsonify(result)

@api_bp.route('/recommend-news', methods=['GET'])
def recommend_news():
    # 프론트엔드에서 티커를 받아옴
    ticker = request.args.get('ticker')
    
    # 티커가 없으면 오류 메시지 반환
    if not ticker:
        return jsonify({'error': 'Ticker parameter is required'}), 400
    
    # 관련 뉴스를 가져옴
    news = get_related_news(ticker)
    
    return jsonify(news)

@api_bp.route('/quarterlyfinancials/<ticker_symbol>', methods=['GET'])
def getQuarterlyFinancials(ticker_symbol):
    try:
        data = get_quarterly_financials(ticker_symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/stockinfo/<ticker_symbol>', methods=['GET'])
def getStockInfo(ticker_symbol):
    try:
        data = get_stockInfo(ticker_symbol)
        print(data)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/stockinfochart/<ticker_symbol>/<period>', methods=['GET'])
def getStockInfoChart(ticker_symbol,period):
    try:
        data = get_stockInfo_chart(ticker_symbol,period)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/search/<keyword>', methods=['GET'])
def getSearchResult(keyword):
    try:
        data = search(keyword)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/chat', methods=['GET'])
def getChatting():
    try:
        message = request.args.get('message')  # 쿼리 파라미터로 메시지 수신
        data = chatting(message)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/chat/analyze/<ticker_symbol>', methods=['GET'])
def getAnalyze(ticker_symbol):
    try:
        if not ticker_symbol:
            return jsonify({"error": "ticker_symbol is required"}), 400
        
        data = chat_with_gpt(ticker_symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500