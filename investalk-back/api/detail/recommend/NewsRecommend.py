import requests
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# NewsAPI를 통해 티커와 관련된 뉴스 3개를 가져오는 함수
def get_related_news(ticker):
    # .env 파일에서 API 키 불러오기
    API_KEY = os.getenv('NEWS_API_KEY')
    
    if not API_KEY:
        raise ValueError("API 키를 찾을 수 없습니다. .env 파일을 확인하세요.")
    
    url = 'https://newsapi.org/v2/everything'
    params = {
        'q': ticker,  # 티커 기반 뉴스 검색
        'apiKey': API_KEY,  # .env에서 불러온 API 키
        'sortBy': 'popularity',  # 조회수 높은 순으로 정렬
        'pageSize': 3  # 상위 3개의 뉴스만 가져오기
    }

    response = requests.get(url, params=params)
    news_data = response.json()

    # 뉴스 결과를 처리하여 필요한 정보만 반환
    if news_data['status'] == 'ok':
        articles = news_data['articles']
        return [{
            'title': article['title'],
            'url': article['url'],
            'publishedAt': article['publishedAt']
        } for article in articles]
    else:
        return []  # 에러가 발생하면 빈 리스트 반환
