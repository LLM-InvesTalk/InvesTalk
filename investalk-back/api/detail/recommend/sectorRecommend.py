from flask import Flask, jsonify, request
import os
import requests
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

api_key = os.getenv('FINANCIALMODELINGPREP_API_KEY')

app = Flask(__name__)

def get_ticker_sector(ticker_symbol):
    """
    yfinance를 사용하여 특정 종목의 섹터 정보를 가져옵니다.
    """
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    # 'sector' 키가 없을 경우 'N/A'를 반환
    sector = info.get('sector', 'N/A')  
    return sector

def get_similar_sectors(sector_name):
    """
    특정 섹터와 성과가 비슷한 섹터 5개를 추천해주는 함수
    (Financial Modeling Prep API 이용)
    """
    # 1. 전체 섹터 성과 리스트를 가져오는 API 호출
    sectors_url = f'https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey={api_key}'
    response = requests.get(sectors_url)
    
    # 2. API 호출이 성공적인지 확인
    if response.status_code == 200:
        sectors_data = response.json()
        
        # 3. 섹터 성과 데이터 가져오기
        all_sectors = sectors_data.get('sectorPerformance', [])
        
        # 4. 사용자가 선택한 섹터의 성과 데이터 찾기
        target_sector = None
        for sector in all_sectors:
            if sector['sector'] == sector_name:
                target_sector = sector
                break
        
        # 5. 섹터가 없으면 빈 리스트 반환
        if not target_sector:
            print(f"'{sector_name}' 섹터를 찾을 수 없습니다.")
            return []
        
        # 6. 섹터 성과 비교(1주간 성과 기준)
        target_performance = float(
            target_sector['changesPercentage'].replace('%', '')
        )
        
        # 7. 성과가 비슷한 섹터 5개 찾기 (절대 차이가 적은 순)
        similar_sectors = []
        for sector in all_sectors:
            if sector['sector'] != sector_name:  # 자기 자신은 제외
                performance = float(
                    sector['changesPercentage'].replace('%', '')
                )
                diff = abs(performance - target_performance)
                similar_sectors.append((sector['sector'], diff))

        # 8. 성과 차이가 적은 순으로 정렬 후 상위 5개
        similar_sectors.sort(key=lambda x: x[1])
        top_5_sectors = [sector[0] for sector in similar_sectors[:5]]
        return top_5_sectors
    else:
        print("API 호출에 실패했습니다.")
        return []