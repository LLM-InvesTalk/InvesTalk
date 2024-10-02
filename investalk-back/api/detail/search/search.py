import pandas as pd
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(current_dir, 'companies.csv')
df = pd.read_csv(csv_file_path)

# df = pd.read_csv('/companies.csv')
df = df[['ticker', 'company name', 'short name']]

# print("df: ", df)

def search(query):
    # 검색어가 없는 경우 빈 리스트 반환
    if not query:
        return []

    # 검색어와 매칭되는 데이터 필터링
    results = df[df.apply(lambda row: row.astype(str).str.lower().str.contains(query.lower()).any(), axis=1)].copy()

    # 유사도 계산: 검색어가 포함된 횟수를 기준으로 정렬
    results['similarity'] = results.apply(lambda row: sum([query.lower() in str(value).lower() for value in row]), axis=1)

    # 유사도가 높은 상위 10개 항목만 선택
    top_results = results.nlargest(3, 'similarity')

    # 'similarity' 열을 제거하고 결과 반환
    top_results = top_results.drop(columns=['similarity'])
    suggestions = top_results.to_dict(orient='records')

    return suggestions

# 테스트
print("A: ",search("A")) 
print("AAP: ",search("AAP")) 