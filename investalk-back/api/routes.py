from flask import Blueprint
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