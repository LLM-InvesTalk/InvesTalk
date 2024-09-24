import requests

# NewsAPI API 키 설정
API_KEY = 'your_newsapi_key'  # 여기에 NewsAPI에서 받은 API 키를 입력하세요.

# 엔비디아 관련 뉴스 검색
url = 'https://newsapi.org/v2/everything'
params = {
    'q': 'NVDA',  # 엔비디아 티커 심볼
    'apiKey': 'c4e062f290c94a4a8823eceb29154491',  # API 키
    'sortBy': 'popularity',  # 조회수 높은 순으로 정렬
    'pageSize': 3  # 상위 3개의 뉴스만 가져오기
}

# API 요청
response = requests.get(url, params=params)
news_data = response.json()

# 응답 결과에서 뉴스 기사 정보 추출
if news_data['status'] == 'ok':
    top_articles = news_data['articles']
    for idx, article in enumerate(top_articles, 1):
        print(f"뉴스 {idx}")
        print(f"제목: {article['title']}")
        print(f"출처: {article['source']['name']}")
        print(f"URL: {article['url']}")
        print(f"발행일: {article['publishedAt']}")
        print('-' * 40)
else:
    print("뉴스 데이터를 가져오는데 실패했습니다.")
