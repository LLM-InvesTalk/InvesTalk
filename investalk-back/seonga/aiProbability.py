# aiProbability.py (예시)
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

service = Service(r"C:\chromedriver\chromedriver.exe")
options = Options()
options.add_argument("--ignore-certificate-errors")
options.add_argument("--ignore-ssl-errors")
options.add_argument("--disable-web-security")
options.add_argument("--allow-running-insecure-content")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--no-sandbox")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
)
driver = webdriver.Chrome(service=service, options=options)


def wait_for_page_load(driver):
    WebDriverWait(driver, 30).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )


def get_target_price(ticker):
    exchange_list = ["NASDAQ", "NYSE", "TSE", "LSE", "KRX"]

    for exchange in exchange_list:
        try:
            url = f"https://kr.tradingview.com/symbols/{exchange}-{ticker}/forecast/"
            driver.get(url)
            wait_for_page_load(driver)

            # 1) 목표가 스크래핑
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, "highlight-maJ2WnzA"))
            )
            element = driver.find_element(By.CLASS_NAME, "highlight-maJ2WnzA")
            text = element.text  # 예: "$123.45"
            target_price = float(text.replace("$", "").replace(",", ""))

            print(f"[SCRAPING] [{exchange}] {ticker} 목표가: {target_price}")

            # 2) 애널리스트 평점(1~5) 스크래핑
            #   - 'value-GNeDL9vy' 클래스가 5개 존재한다고 가정 (StrongBuy, Buy, Hold, Sell, StrongSell)
            #   - 각각 5,4,3,2,1 가중치로 계산하여 round()
            time.sleep(3)
            rating_elements = WebDriverWait(driver, 5).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "value-GNeDL9vy"))
            )

            # 최대 5개만 추출
            raw_values = []
            for elem in rating_elements[:5]:
                val = elem.text.strip()
                val_int = int(val) if val.isdigit() else 0
                raw_values.append(val_int)

            print(f"raw_values: {raw_values}")

            # 부족한 경우 5개 맞추기
            if len(raw_values) < 5:
                raw_values += [0] * (5 - len(raw_values))

            weights = [5, 4, 3, 2, 1]  # StrongBuy, Buy, Hold, Sell, StrongSell
            total_analysts = sum(raw_values)
            if total_analysts == 0:
                analyst_rating = 0
            else:
                weighted_sum = sum(v * w for v, w in zip(raw_values, weights))
                rating_float = weighted_sum / total_analysts
                analyst_rating = round(rating_float)

            print(f"[SCRAPING] [{exchange}] {ticker} 애널리스트 평점: {analyst_rating}")

            return (target_price, analyst_rating)

        except Exception as e:
            print(f"[SCRAPING ERROR] [{exchange}] {ticker}: {e}")

    # 모든 거래소 실패
    print(f"[SCRAPING FAILED] 모든 거래소에서 {ticker} 크롤링에 실패하였습니다.")
    return None
