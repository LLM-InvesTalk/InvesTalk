from flask import request, jsonify
import requests
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# .env에서 API 키 가져오기
api_key = os.getenv("NEWS_API_KEY")

# ETF 티커 심볼 목록
etf_list = [
    "SPY",
    "EWJ",
    "EWG",
    "EWQ",
    "EWC",
    "EWA",
    "EWU",
    "EWL",
    "EWK",
    "EWD",
    "EWS",
    "EWH",
    "EWI",
    "EWN",
    "EWP",
    "EWO",
    "EWD",
    "EWY",
    "EWZ",
    "EWT",
]


def get_news():
    etf_news = []
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 3))

    try:
        if not api_key:
            return jsonify({"error": "API key not found"}), 500

        for etf in etf_list:
            url = f"https://newsapi.org/v2/everything?q={etf}&sortBy=popularity&pageSize=100&apiKey={api_key}"
            response = requests.get(url)

            if response.status_code != 200:
                return (
                    jsonify(
                        {
                            "error": f"Failed to fetch news for {etf}. Status code: {response.status_code}"
                        }
                    ),
                    500,
                )

            data = response.json()

            if "articles" not in data:
                return jsonify({"error": f"No articles found for {etf}"}), 500

            for article in data["articles"]:
                title = article.get("title", "")
                image_url = article.get(
                    "urlToImage"
                )  # 필터링을 위해 raw 데이터로 가져옴

                # 제목이 [removed]이거나, 이미지 URL이 없는(또는 빈 문자열인) 기사 제외
                if title == "[removed]" or not image_url:
                    continue

                etf_news.append(
                    {
                        "title": title,
                        "link": article.get("url", ""),
                        "time": article.get("publishedAt", ""),
                        "imgSrc": (
                            image_url
                            if image_url
                            else "https://via.placeholder.com/150"
                        ),
                    }
                )

        # 페이지네이션
        paginated_news = etf_news[offset : offset + limit]

        if not paginated_news:
            return jsonify({"error": "No more articles available"}), 404

        return jsonify(paginated_news)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
