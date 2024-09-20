import os
import requests
import yfinance as yf
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# .env 파일에서 API 키 가져오기
api_key = os.getenv('FINANCIALMODELINGPREP_API_KEY')

# NVIDIA 종목의 섹터를 가져오는 함수
def get_ticker_sector(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    sector = info.get('sector', 'N/A')
    return sector

# 특정 섹터와 성과가 비슷한 섹터 5개를 추천하는 함수
def get_similar_sectors(sector_name):
    sectors_url = f'https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey={api_key}'
    response = requests.get(sectors_url)
    
    if response.status_code == 200:
        sectors_data = response.json()
        all_sectors = sectors_data.get('sectorPerformance', [])
        
        target_sector = None
        for sector in all_sectors:
            if sector['sector'] == sector_name:
                target_sector = sector
                break
        
        if not target_sector:
            return []
        
        target_performance = float(target_sector['changesPercentage'].replace('%', ''))
        similar_sectors = []
        for sector in all_sectors:
            if sector['sector'] != sector_name:
                performance = float(sector['changesPercentage'].replace('%', ''))
                similar_sectors.append((sector['sector'], abs(performance - target_performance)))
        
        similar_sectors = sorted(similar_sectors, key=lambda x: x[1])
        top_5_sectors = [sector[0] for sector in similar_sectors[:5]]
        return top_5_sectors
    else:
        return []
