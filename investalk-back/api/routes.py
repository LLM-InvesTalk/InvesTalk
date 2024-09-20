import sys
import os

# 현재 파일 위치에서 상위 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from flask import Blueprint, jsonify
from .detail.recommend.sectorRecommend import get_ticker_sector, get_similar_sectors

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