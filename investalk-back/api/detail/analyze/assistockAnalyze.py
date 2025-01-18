from openai import OpenAI
import os
from dotenv import load_dotenv
import sys

# 현재 파일 위치에서 상위 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from detail.financialstatements.financialstatements import get_quarterly_financials
from detail.stockinfo.stockinfo import get_stockInfo

from detail.recommend.sectorRecommend import get_ticker_sector, get_similar_sectors
from detail.recommend.enterpriseRecommend import calculate_average_growth
from detail.recommend.NewsRecommend import get_related_news

# .env 파일 로드
load_dotenv()

client = OpenAI(api_key =os.getenv('OPENAI_API_KEY'))


def chat_with_gpt(ticker):
    # 특정 티커의 데이터를 가져오기
    try:
        financial_data = get_quarterly_financials(ticker)  # 분기 재무 데이터 가져오기
        stock_info = get_stockInfo(ticker)  # 주식 정보 가져오기
        sector = get_ticker_sector(ticker)  # 섹터 정보 가져오기
        similar_sectors = get_similar_sectors(sector)  # 유사 섹터 가져오기
        news = get_related_news(ticker)  # 관련 뉴스 가져오기

        # 프롬프트 데이터 구성
        prompt_data = (
            f"Analyze the following stock data:\n"
            f"Ticker: {ticker}\n"
            f"Sector: {sector}\n"
            f"Similar Sectors: {', '.join(similar_sectors)}\n"
            f"Stock Info: {stock_info}\n"
            f"Financial Data: {financial_data}\n"
            f"Related News: {news}\n"
        )

        # OpenAI Chat Completion 호출
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # 또는 "gpt-4"
            messages=[
                {"role": "system", "content": "당신은 한국어로 주식 및 재무 정보를 분석하는 금융 전문가입니다. 종목의 섹터, 시가총액 변동, 예상 가격 변화, 성공 확률, 추천 등을 100자 이내로 분석합니다."},
                {"role": "user", "content": prompt_data}
            ]
        )
        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        return {"error": str(e)}
    
# Flask 없이 직접 실행
ticker_symbol = 'AAPL'
print(chat_with_gpt(ticker_symbol))