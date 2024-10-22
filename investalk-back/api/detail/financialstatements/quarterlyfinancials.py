import yfinance as yf
import pandas as pd

# 관심 있는 티커 입력 (예: AAPL - 애플)
ticker_symbol = 'AAPL'
ticker = yf.Ticker(ticker_symbol)

# 분기별 재무제표 데이터 가져오기
financials = ticker.quarterly_financials  # 분기별 재무제표
financials = financials.sort_index(axis=1)  # 날짜 기준으로 오름차순 정렬
print("분기별 재무제표 항목:")
print(financials.index)

# 1. 수익성 관련 정보
print("\n--- 수익성 관련 정보 (분기별) ---")

# 1.1 Free Cash Flow 증감율 계산
cashflow = ticker.quarterly_cashflow.T  # 전치하여 행과 열을 바꿈
cashflow = cashflow.sort_index()  # 날짜 기준으로 오름차순 정렬

if 'Free Cash Flow' in cashflow.columns:
    # 데이터 타입을 float로 변환
    cashflow['Free Cash Flow'] = pd.to_numeric(cashflow['Free Cash Flow'], errors='coerce')
    
    # 계산 전에 데이터 타입을 확인하고 경고 발생을 방지합니다.
    cashflow['Free Cash Flow Growth (%)'] = cashflow['Free Cash Flow'].pct_change() * 100
    cashflow['Free Cash Flow Growth (%)'] = cashflow['Free Cash Flow Growth (%)'].astype(float)
    
    print("\n분기별 Free Cash Flow 증감율 (%):")
    print(cashflow['Free Cash Flow Growth (%)'].apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A"))
else:
    print("Free Cash Flow 데이터를 찾을 수 없습니다.")

# 1.2 EPS 증감율 계산
if 'Diluted EPS' in financials.index:
    eps = financials.loc['Diluted EPS']
    eps = eps.sort_index(axis=0)  # 날짜 기준으로 오름차순 정렬
    eps = pd.to_numeric(eps, errors='coerce')  # 데이터 타입을 float로 변환
    eps_growth = eps.pct_change() * 100
    eps_growth = eps_growth.astype(float)
    print("\n분기별 EPS 증감율 (%):")
    eps_growth_formatted = eps_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(eps_growth_formatted)
else:
    print("EPS 데이터를 찾을 수 없습니다.")

# 1.3 순이익(Net Income) 증감율 계산
if 'Net Income' in financials.index:
    net_income = financials.loc['Net Income']
    net_income = net_income.sort_index(axis=0)
    net_income = pd.to_numeric(net_income, errors='coerce')
    net_income_growth = net_income.pct_change() * 100
    net_income_growth = net_income_growth.astype(float)
    print("\n분기별 순이익 증감율 (%):")
    net_income_growth_formatted = net_income_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(net_income_growth_formatted)
else:
    print("순이익 데이터를 찾을 수 없습니다.")

# 1.4 마진(Profit Margin) 증감율 계산
if 'Net Income' in financials.index and 'Total Revenue' in financials.index:
    net_income = pd.to_numeric(financials.loc['Net Income'], errors='coerce')
    total_revenue = pd.to_numeric(financials.loc['Total Revenue'], errors='coerce')
    profit_margin = (net_income / total_revenue) * 100  # 백분율로 표시

    # 날짜 오름차순 정렬
    profit_margin = profit_margin.sort_index(axis=0)

    # 증감율 계산
    profit_margin_growth = profit_margin.pct_change() * 100
    profit_margin_growth = profit_margin_growth.astype(float)

    print("\n분기별 마진 (%):")
    profit_margin_formatted = profit_margin.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(profit_margin_formatted)

    print("\n분기별 마진 증감율 (%):")
    profit_margin_growth_formatted = profit_margin_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(profit_margin_growth_formatted)
else:
    print("마진 데이터를 계산할 수 없습니다.")

# 2. 안전성 관련 정보
print("\n--- 안전성 관련 정보 (분기별) ---")

# 2.1 부채 및 현금 (Balance Sheet)
balance_sheet = ticker.quarterly_balance_sheet.T  # 전치하여 행과 열을 바꿈
balance_sheet = balance_sheet.sort_index()

# Net Debt 증감율 계산
if 'Net Debt' in balance_sheet.columns:
    balance_sheet['Net Debt'] = pd.to_numeric(balance_sheet['Net Debt'], errors='coerce')
    balance_sheet['Net Debt Growth (%)'] = balance_sheet['Net Debt'].pct_change() * 100
    balance_sheet['Net Debt Growth (%)'] = balance_sheet['Net Debt Growth (%)'].astype(float)
    print("\n분기별 Net Debt 증감율 (%):")
    net_debt_growth_formatted = balance_sheet['Net Debt Growth (%)'].apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(net_debt_growth_formatted)
else:
    print("Net Debt 데이터를 찾을 수 없습니다.")

# Cash and Cash Equivalents 증감율 계산
if 'Cash And Cash Equivalents' in balance_sheet.columns:
    balance_sheet['Cash And Cash Equivalents'] = pd.to_numeric(balance_sheet['Cash And Cash Equivalents'], errors='coerce')
    balance_sheet['Cash Growth (%)'] = balance_sheet['Cash And Cash Equivalents'].pct_change() * 100
    balance_sheet['Cash Growth (%)'] = balance_sheet['Cash Growth (%)'].astype(float)
    print("\n분기별 Cash 증감율 (%):")
    cash_growth_formatted = balance_sheet['Cash Growth (%)'].apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(cash_growth_formatted)
else:
    print("Cash 데이터를 찾을 수 없습니다.")

# 2.2 영업비용 (Operating Expenses) 증감율 계산
if 'Operating Expense' in financials.index:
    operating_expenses = financials.loc['Operating Expense']
    operating_expenses = operating_expenses.sort_index(axis=0)
    operating_expenses = pd.to_numeric(operating_expenses, errors='coerce')
    operating_expenses_growth = operating_expenses.pct_change() * 100
    operating_expenses_growth = operating_expenses_growth.astype(float)
    print("\n분기별 영업비용 증감율 (%):")
    operating_expenses_growth_formatted = operating_expenses_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(operating_expenses_growth_formatted)
else:
    print("영업비용 데이터를 찾을 수 없습니다.")

# 3. 시장 추세 관련 정보
print("\n--- 시장 추세 관련 정보 (분기별) ---")

# 시간대 정보 제거 함수 정의
def remove_timezone(df):
    df = df.copy()
    df.index = df.index.tz_convert(None)
    return df

# 3.1 RSI (Relative Strength Index) 분기별 증감율 계산
data = ticker.history(period='2y', interval='1d')  # 지난 2년치의 일별 데이터 가져오기
data = remove_timezone(data)
data['Quarter'] = data.index.to_period('Q')
quarterly_data = data.groupby('Quarter')['Close'].apply(list)

# 분기별 RSI 계산 함수
def calculate_quarterly_rsi(close_prices):
    close_series = pd.Series(close_prices)
    delta = close_series.diff()
    gain = delta.where(delta > 0, 0).sum()
    loss = -delta.where(delta < 0, 0).sum()
    if loss == 0:
        return 100  # 손실이 없으면 RSI는 100
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

# 분기별 RSI 계산
quarterly_rsi = quarterly_data.apply(calculate_quarterly_rsi)

print("\n분기별 RSI:")
quarterly_rsi_formatted = quarterly_rsi.apply(lambda x: f"{x:.2f}" if pd.notnull(x) else "N/A")
print(quarterly_rsi_formatted)

# RSI 증감율 계산
quarterly_rsi_growth = quarterly_rsi.pct_change() * 100
quarterly_rsi_growth = quarterly_rsi_growth.astype(float)

print("\n분기별 RSI 증감율 (%):")
quarterly_rsi_growth_formatted = quarterly_rsi_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
print(quarterly_rsi_growth_formatted)

# 3.2 원유 (Crude Oil) 데이터 증감율 계산 (분기별)
crude_oil = yf.Ticker('CL=F')
crude_oil_price = crude_oil.history(period='2y')

if not crude_oil_price.empty and 'Close' in crude_oil_price.columns:
    crude_oil_price = remove_timezone(crude_oil_price)
    crude_oil_price['Quarter'] = crude_oil_price.index.to_period('Q')

    # 각 분기의 마지막 영업일 종가를 가져옵니다.
    quarterly_close = crude_oil_price.groupby('Quarter')['Close'].last()

    # 분기별 증감률을 계산합니다.
    quarterly_growth = quarterly_close.pct_change() * 100
    quarterly_growth = quarterly_growth.astype(float)

    print("\n분기별 원유 종가:")
    quarterly_close_formatted = quarterly_close.apply(lambda x: f"{x:.2f}" if pd.notnull(x) else "N/A")
    print(quarterly_close_formatted)

    print("\n분기별 원유 가격 증감률 (%):")
    quarterly_growth_formatted = quarterly_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(quarterly_growth_formatted)
else:
    print("원유 데이터가 없습니다.")

# 3.3 채권 (Treasury Bonds) 데이터 증감율 계산 (분기별)
treasury_bond = yf.Ticker('^TNX')  # '^TNX'는 미국 10년 만기 국채 수익률 지수입니다.
treasury_bond_price = treasury_bond.history(period='2y')

if not treasury_bond_price.empty and 'Close' in treasury_bond_price.columns:
    treasury_bond_price = remove_timezone(treasury_bond_price)
    treasury_bond_price['Quarter'] = treasury_bond_price.index.to_period('Q')

    # 각 분기의 마지막 영업일 종가를 가져옵니다.
    quarterly_close = treasury_bond_price.groupby('Quarter')['Close'].last()

    # 분기별 증감률을 계산합니다.
    quarterly_growth = quarterly_close.pct_change() * 100
    quarterly_growth = quarterly_growth.astype(float)

    print("\n분기별 채권 수익률:")
    quarterly_close_formatted = quarterly_close.apply(lambda x: f"{x:.2f}" if pd.notnull(x) else "N/A")
    print(quarterly_close_formatted)

    print("\n분기별 채권 수익률 증감률 (%):")
    quarterly_growth_formatted = quarterly_growth.apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(quarterly_growth_formatted)
else:
    print("채권 데이터가 없습니다.")

# 3.4 자금 유입 (Cash Inflow) 증감율 계산 (분기별)
print("\nCashflow 데이터의 열 목록:")
print(cashflow.columns)

if 'Financing Cash Flow' in cashflow.columns:
    # 데이터 타입을 float로 변환
    cashflow['Financing Cash Flow'] = pd.to_numeric(cashflow['Financing Cash Flow'], errors='coerce')
    
    # 증감률 계산
    cashflow['Cash Inflow Growth (%)'] = cashflow['Financing Cash Flow'].pct_change() * 100
    cashflow['Cash Inflow Growth (%)'] = cashflow['Cash Inflow Growth (%)'].astype(float)
    
    print("\n분기별 자금 유입 (Financing Cash Flow):")
    cash_inflow_formatted = cashflow['Financing Cash Flow'].apply(lambda x: f"{x:.2f}" if pd.notnull(x) else "N/A")
    print(cash_inflow_formatted)
    
    print("\n분기별 자금 유입 증감율 (%):")
    cash_inflow_growth_formatted = cashflow['Cash Inflow Growth (%)'].apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else "N/A")
    print(cash_inflow_growth_formatted)
else:
    print("'Financing Cash Flow' 데이터를 찾을 수 없습니다.")