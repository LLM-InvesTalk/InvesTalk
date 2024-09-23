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
    # 'sector' 키가 없을 경우 'N/A'를 반환
    sector = info.get('sector', 'N/A')  # 섹터 정보 추출
    return sector

# 특정 섹터와 성과가 비슷한 섹터 5개를 추천하는 함수
def get_similar_sectors(sector_name):
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
            # 사용자가 입력한 섹터명과 일치하는 섹터 찾기
            if sector['sector'] == sector_name:
                target_sector = sector
                break
        
        # 5. 섹터가 없으면 빈 리스트 반환
        if not target_sector:
            print(f"'{sector_name}' 섹터를 찾을 수 없습니다.")
            return []

        # 6. 섹터 성과 비교 (1주간 성과 기준으로 유사성 비교)
        target_performance = float(target_sector['changesPercentage'].replace('%', ''))

        # 7. 성과가 비슷한 섹터 5개 찾기 (절대 차이가 적은 순으로)
        similar_sectors = []
        for sector in all_sectors:
            # 비교하려는 섹터는 제외
            if sector['sector'] != sector_name:
                # 성과 퍼센티지를 float으로 변환하고 차이를 계산
                performance = float(sector['changesPercentage'].replace('%', ''))
                # 성과 차이와 함께 섹터를 리스트에 추가
                similar_sectors.append((sector['sector'], abs(performance - target_performance)))

        # 8. 성과 차이가 적은 순으로 정렬
        similar_sectors = sorted(similar_sectors, key=lambda x: x[1])

        # 9. 상위 5개 섹터 반환
        top_5_sectors = [sector[0] for sector in similar_sectors[:5]]
        return top_5_sectors
    else:
        # API 호출 실패 시 메시지 출력
        print("API 호출에 실패했습니다.")
        return []
