import yfinance as yf
import pandas as pd

# 4개의 종목을 리스트로 정의
tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']  # 예시로 Apple, Microsoft, Google, Amazon을 사용
results = []

# 성장률 계산 함수
def calculate_growth_rate(current, previous):
    if previous == 0 or previous is None:
        return None
    return ((current - previous) / previous) * 100

for ticker in tickers:
    stock = yf.Ticker(ticker)
    
    # 현금흐름표(Cashflow Statement) 가져오기
    cashflow = stock.quarterly_cashflow
    
    # 손익계산서(Income Statement) 가져오기
    income_stmt = stock.quarterly_financials
    
    # 현금 유동성(Cash Flow) 성장률 계산 ('Free Cash Flow' 항목 사용)
    try:
        recent_cashflow = cashflow.loc['Free Cash Flow']  # 'Free Cash Flow' 사용
        recent_cashflow_growth = calculate_growth_rate(recent_cashflow[0], recent_cashflow[1])
    except KeyError:
        recent_cashflow_growth = None  # 데이터가 없을 경우 None 처리
    
    # 매출 성장률 계산 (Revenue 사용)
    try:
        recent_revenue = income_stmt.loc['Total Revenue']  # 'Total Revenue' 항목 사용
        recent_revenue_growth = calculate_growth_rate(recent_revenue[0], recent_revenue[1])
    except KeyError:
        recent_revenue_growth = None  # 데이터가 없을 경우 None 처리

    # 결과 저장
    results.append({
        'Ticker': ticker,
        'Cash Flow Growth (%)': recent_cashflow_growth,
        'Revenue Growth (%)': recent_revenue_growth
    })

# 결과를 DataFrame으로 정리
df_results = pd.DataFrame(results)

# DataFrame 출력
print(df_results)

# 현금 유동성 및 매출 성장률의 평균 계산 (NaN은 제외)
avg_cash_flow_growth = df_results['Cash Flow Growth (%)'].mean()
avg_revenue_growth = df_results['Revenue Growth (%)'].mean()

# 평균 출력
print("\nAverage Cash Flow Growth (%):", avg_cash_flow_growth)
print("Average Revenue Growth (%):", avg_revenue_growth)
