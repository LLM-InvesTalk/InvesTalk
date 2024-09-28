import yfinance as yf
import pandas as pd

def get_quarterly_financials(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)

    # 분기별 재무제표 데이터 가져오기
    financials = ticker.quarterly_financials  # 분기별 재무제표
    financials = financials.sort_index(axis=1)  # 날짜 기준으로 오름차순 정렬

    result = {}

    # 1. 수익성 관련 정보
    cashflow = ticker.quarterly_cashflow.T  # 전치하여 행과 열을 바꿈
    cashflow = cashflow.sort_index()  # 날짜 기준으로 오름차순 정렬

    # Free Cash Flow 증감율
    if 'Free Cash Flow' in cashflow.columns:
        cashflow['Free Cash Flow'] = pd.to_numeric(cashflow['Free Cash Flow'], errors='coerce')
        cashflow['Free Cash Flow Growth (%)'] = cashflow['Free Cash Flow'].pct_change() * 100
        cashflow['Free Cash Flow Growth (%)'] = cashflow['Free Cash Flow Growth (%)'].round(2)
        result['free_cash_flow_growth'] = cashflow['Free Cash Flow Growth (%)'].iloc[-1]
    else:
        result['free_cash_flow_growth'] = 'N/A'

    # EPS 증감율
    if 'Diluted EPS' in financials.index:
        eps = pd.to_numeric(financials.loc['Diluted EPS'], errors='coerce')
        eps_growth = eps.pct_change() * 100
        eps_growth = eps_growth.round(2)
        result['eps_growth'] = eps_growth.iloc[-1]
    else:
        result['eps_growth'] = 'N/A'

    # 순이익(Net Income) 증감율
    if 'Net Income' in financials.index:
        net_income = pd.to_numeric(financials.loc['Net Income'], errors='coerce')
        net_income_growth = net_income.pct_change() * 100
        net_income_growth = net_income_growth.round(2)
        result['net_income_growth'] = net_income_growth.iloc[-1]
    else:
        result['net_income_growth'] = 'N/A'

    # 마진(Profit Margin) 증감율
    if 'Net Income' in financials.index and 'Total Revenue' in financials.index:
        net_income = pd.to_numeric(financials.loc['Net Income'], errors='coerce')
        total_revenue = pd.to_numeric(financials.loc['Total Revenue'], errors='coerce')
        profit_margin = (net_income / total_revenue) * 100  # 백분율로 표시
        profit_margin_growth = profit_margin.pct_change() * 100
        profit_margin_growth = profit_margin_growth.round(2)
        result['profit_margin_growth'] = profit_margin_growth.iloc[-1]
    else:
        result['profit_margin_growth'] = 'N/A'

    # Net Debt 증감율
    balance_sheet = ticker.quarterly_balance_sheet.T  # 전치하여 행과 열을 바꿈
    balance_sheet = balance_sheet.sort_index()
    if 'Net Debt' in balance_sheet.columns:
        balance_sheet['Net Debt'] = pd.to_numeric(balance_sheet['Net Debt'], errors='coerce')
        balance_sheet['Net Debt Growth (%)'] = balance_sheet['Net Debt'].pct_change() * 100
        balance_sheet['Net Debt Growth (%)'] = balance_sheet['Net Debt Growth (%)'].round(2)
        result['net_debt_growth'] = balance_sheet['Net Debt Growth (%)'].iloc[-1]
    else:
        result['net_debt_growth'] = 'N/A'

    # Cash and Cash Equivalents 증감율
    if 'Cash And Cash Equivalents' in balance_sheet.columns:
        balance_sheet['Cash And Cash Equivalents'] = pd.to_numeric(balance_sheet['Cash And Cash Equivalents'], errors='coerce')
        balance_sheet['Cash Growth (%)'] = balance_sheet['Cash And Cash Equivalents'].pct_change() * 100
        balance_sheet['Cash Growth (%)'] = balance_sheet['Cash Growth (%)'].round(2)
        result['cash_growth'] = balance_sheet['Cash Growth (%)'].iloc[-1]
    else:
        result['cash_growth'] = 'N/A'

    # 영업비용(Operating Expenses) 증감율
    if 'Operating Expense' in financials.index:
        operating_expenses = pd.to_numeric(financials.loc['Operating Expense'], errors='coerce')
        operating_expenses_growth = operating_expenses.pct_change() * 100
        operating_expenses_growth = operating_expenses_growth.round(2)
        result['operating_expenses_growth'] = operating_expenses_growth.iloc[-1]
    else:
        result['operating_expenses_growth'] = 'N/A'

    # 자금 유입 증감율
    if 'Financing Cash Flow' in cashflow.columns:
        cashflow['Financing Cash Flow'] = pd.to_numeric(cashflow['Financing Cash Flow'], errors='coerce')
        cashflow['Cash Inflow Growth (%)'] = cashflow['Financing Cash Flow'].pct_change() * 100
        cashflow['Cash Inflow Growth (%)'] = cashflow['Cash Inflow Growth (%)'].round(2)
        result['cash_inflow_growth'] = cashflow['Cash Inflow Growth (%)'].iloc[-1]
    else:
        result['cash_inflow_growth'] = 'N/A'

    # RSI 증감율 계산 (분기별)
    data = ticker.history(period='2y', interval='1d')  # 지난 2년치의 일별 데이터 가져오기
    data.index = data.index.tz_localize(None)  # 타임존 정보 제거
    data['Quarter'] = data.index.to_period('Q')
    quarterly_data = data.groupby('Quarter')['Close'].apply(list)

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

    quarterly_rsi = quarterly_data.apply(calculate_quarterly_rsi)
    quarterly_rsi_growth = quarterly_rsi.pct_change() * 100
    quarterly_rsi_growth = quarterly_rsi_growth.round(2)
    result['rsi_growth'] = quarterly_rsi_growth.iloc[-1] if not quarterly_rsi_growth.empty else 'N/A'

    # 원유 데이터 증감율 계산 (분기별)
    crude_oil = yf.Ticker('CL=F')
    crude_oil_price = crude_oil.history(period='2y')
    crude_oil_price.index = crude_oil_price.index.tz_localize(None)  # 타임존 정보 제거

    if not crude_oil_price.empty and 'Close' in crude_oil_price.columns:
        crude_oil_price['Quarter'] = crude_oil_price.index.to_period('Q')
        quarterly_close = crude_oil_price.groupby('Quarter')['Close'].last()
        quarterly_growth = quarterly_close.pct_change() * 100
        quarterly_growth = quarterly_growth.round(2)
        result['crude_oil_price_growth'] = quarterly_growth.iloc[-1] if not quarterly_growth.empty else 'N/A'
    else:
        result['crude_oil_price_growth'] = 'N/A'

    # 채권 수익률 증감율 계산 (분기별)
    treasury_bond = yf.Ticker('^TNX')
    treasury_bond_price = treasury_bond.history(period='2y')
    treasury_bond_price.index = treasury_bond_price.index.tz_localize(None)  # 타임존 정보 제거

    if not treasury_bond_price.empty and 'Close' in treasury_bond_price.columns:
        treasury_bond_price['Quarter'] = treasury_bond_price.index.to_period('Q')
        quarterly_close = treasury_bond_price.groupby('Quarter')['Close'].last()
        quarterly_growth = quarterly_close.pct_change() * 100
        quarterly_growth = quarterly_growth.round(2)
        result['treasury_bond_growth'] = quarterly_growth.iloc[-1] if not quarterly_growth.empty else 'N/A'
    else:
        result['treasury_bond_growth'] = 'N/A'

    return result
