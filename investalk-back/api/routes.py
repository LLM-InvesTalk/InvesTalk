import sys
import os

# 현재 파일 위치에서 상위 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from flask import Blueprint, jsonify
from .detail.financialstatements.financialstatements import get_quarterly_financials
from .detail.stockinfo.stockinfo import get_stockInfo
from .detail.stockinfo.stockinfochart import get_stockInfo_chart

# Blueprint 생성
api_bp = Blueprint('api', __name__)

@api_bp.route('/quarterlyfinancials/<ticker_symbol>', methods=['GET'])
def getQuarterlyFinancials(ticker_symbol):
    try:
        financial_data = get_quarterly_financials(ticker_symbol)
        return jsonify(financial_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/stockinfo/<ticker_symbol>', methods=['GET'])
def getStockInfo(ticker_symbol):
    try:
        financial_data = get_stockInfo(ticker_symbol)
        return jsonify(financial_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/stockinfochart/<ticker_symbol>/<period>', methods=['GET'])
def getStockInfoChart(ticker_symbol,period):
    try:
        financial_data = get_stockInfo_chart(ticker_symbol,period)
        return jsonify(financial_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500