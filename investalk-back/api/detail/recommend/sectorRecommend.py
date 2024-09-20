import os
import requests
import yfinance as yf
from dotenv import load_dotenv  # dotenv를 통해 .env 파일을 불러옵니다.

# .env 파일 로드
load_dotenv()

# .env 파일에서 API 키 가져오기
api_key = os.getenv('FINANCIALMODELINGPREP_API_KEY')

# NVIDIA 종목의 섹터를 가져오는 함수
def get_ticker_sector(ticker_symbol):
    # yfinance를 사용하여 특정 종목의 정보 가져오기
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    sector = info.get('sector', 'N/A')  # 섹터 정보 추출
    return sector

# 특정 섹터와 성과가 비슷한 섹터 5개를 추천하는 함수
def get_similar_sectors(sector_name):
    # 1. 전체 섹터 성과 리스트를 가져오는 API 호출
    sectors_url = f'https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey={api_key}'
    response = requests.get(sectors_url)
    
    if response.status_code == 200:
        sectors_data = response.json()
        
        # 2. 섹터 성과 데이터 가져오기
        all_sectors = sectors_data.get('sectorPerformance', [])
        
        # 3. 사용자가 선택한 섹터의 성과 데이터 찾기
        target_sector = None
        for sector in all_sectors:
            if sector['sector'] == sector_name:
                target_sector = sector
                break
        
        if not target_sector:
            print(f"'{sector_name}' 섹터를 찾을 수 없습니다.")
            return []

        # 4. 섹터 성과 비교 (1주간 성과 기준으로 유사성 비교)
        target_performance = float(target_sector['changesPercentage'].replace('%', ''))

        # 5. 성과가 비슷한 섹터 5개 찾기 (절대 차이가 적은 순으로)
        similar_sectors = []
        for sector in all_sectors:
            if sector['sector'] != sector_name:
                performance = float(sector['changesPercentage'].replace('%', ''))
                similar_sectors.append((sector['sector'], abs(performance - target_performance)))

        # 성과 차이가 적은 순으로 정렬
        similar_sectors = sorted(similar_sectors, key=lambda x: x[1])

        # 상위 5개 섹터 반환
        top_5_sectors = [sector[0] for sector in similar_sectors[:5]]
        return top_5_sectors
    else:
        print("API 호출에 실패했습니다.")
        return []

# NVIDIA 티커 심볼
nvidia_ticker = "NVDA"

# 1. NVIDIA 종목의 섹터 가져오기
nvidia_sector = get_ticker_sector(nvidia_ticker)
print(f"NVIDIA 종목의 섹터: {nvidia_sector}")

# 2. 성과가 비슷한 섹터 5개 출력
similar_sectors = get_similar_sectors(nvidia_sector)
print(f"'{nvidia_sector}' 섹터와 성과가 비슷한 추천 섹터: {similar_sectors}")
