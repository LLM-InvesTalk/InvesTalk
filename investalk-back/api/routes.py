import sys
import os

# 현재 파일 위치에서 상위 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from flask import Blueprint, jsonify,request  
from .detail.recommend.sectorRecommend import get_ticker_sector, get_similar_sectors
from .detail.recommend.enterpriseRecommend import calculate_average_growth
# Blueprint 생성
api_bp = Blueprint('api', __name__)

@api_bp.route('/recommend-sectors', methods=['GET'])
def recommend_sectors():
    nvidia_ticker = "NVDA"
    nvidia_sector = get_ticker_sector(nvidia_ticker)
    similar_sectors = get_similar_sectors(nvidia_sector)
    
    return jsonify({
        'nvidia_sector': nvidia_sector,
        'similar_sectors': similar_sectors
    })

@api_bp.route('/average-growth', methods=['POST'])
def average_growth():
    # 프론트에서 4개의 종목을 JSON 형식으로 받음
    data = request.get_json()
    tickers = data.get('tickers')

    # 4개의 종목이 주어졌는지 확인
    if len(tickers) != 4:
        return jsonify({'error': 'Exactly 4 tickers are required'}), 400

    # 종목들의 평균 성장률 계산
    result = calculate_average_growth(tickers)
    
    return jsonify(result)