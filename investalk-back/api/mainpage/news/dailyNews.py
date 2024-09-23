import requests
from flask import jsonify
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# .env에서 API 키 불러오기
api_key = os.getenv('NEWS_API_KEY')

# ETF 티커 리스트
etf_list = ['SPY', 'EWJ', 'EWG', 'EWQ', 'EWC', 'EWA', 'EWU', 'EWL', 'EWK', 'EWD']

# 뉴스 데이터를 가져오는 함수
def get_news():
    etf_news = []

    try:
        # 각 ETF에 대해 상위 3개의 조회수 높은 뉴스 가져오기
        for etf in etf_list:
            url = f'https://newsapi.org/v2/everything?q={etf}&sortBy=popularity&pageSize=3&apiKey={api_key}'
            response = requests.get(url)

            # 요청이 성공했는지 확인
            if response.status_code != 200:
                return jsonify({'error': f"Failed to fetch news for {etf}. Status code: {response.status_code}"}), 500

            data = response.json()

            # 'articles' 키가 응답에 존재하는지 확인
            if 'articles' not in data:
                return jsonify({'error': f"No articles found for {etf}"}), 500

            # 각 뉴스 데이터에서 필요한 정보를 추출하여 저장
            for article in data['articles']:
                etf_news.append({
                    'title': article['title'],
                    'link': article['url'],
                    'published_time': article['publishedAt'],
                    'thumbnail': article.get('urlToImage', 'https://via.placeholder.com/150')  # 이미지가 없을 경우 기본 이미지 설정
                })

        return jsonify(etf_news)

    except Exception as e:
        # 예외 발생 시 오류 처리
        return jsonify({'error': str(e)}), 500
