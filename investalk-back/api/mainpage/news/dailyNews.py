from flask import request, jsonify
import requests
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# .env에서 API 키 가져오기
api_key = os.getenv('NEWS_API_KEY')

# ETF 티커 심볼 목록
etf_list = [
    'SPY', 'EWJ', 'EWG', 'EWQ', 'EWC', 'EWA', 'EWU', 'EWL', 'EWK', 'EWD',
    'EWS', 'EWH', 'EWI', 'EWN', 'EWP', 'EWO', 'EWD', 'EWY', 'EWZ', 'EWT'
]

def get_news():
    etf_news = []
    offset = int(request.args.get('offset', 0))
    limit = int(request.args.get('limit', 3))

    try:
        if not api_key:
            return jsonify({'error': 'API key not found'}), 500

        for etf in etf_list:
            url = f'https://newsapi.org/v2/everything?q={etf}&sortBy=popularity&pageSize=100&apiKey={api_key}'
            response = requests.get(url)

            if response.status_code != 200:
                return jsonify({'error': f"Failed to fetch news for {etf}. Status code: {response.status_code}"}), 500

            data = response.json()

            if 'articles' not in data:
                return jsonify({'error': f"No articles found for {etf}"}), 500

            for article in data['articles']:
                etf_news.append({
                    'title': article['title'],
                    'link': article['url'],
                    'time': article['publishedAt'],
                    'imgSrc': article.get('urlToImage', 'https://via.placeholder.com/150')  # 키 이름을 'imgSrc'로 수정
                })

        paginated_news = etf_news[offset:offset + limit]

        if not paginated_news:
            return jsonify({'error': 'No more articles available'}), 404

        return jsonify(paginated_news)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

