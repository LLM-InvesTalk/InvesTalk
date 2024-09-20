import sys
import os

# 프로젝트의 루트 디렉토리를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# 기존 코드
from flask import Flask
from api.routes import api_bp
from crawling import crawler
from LLM import llm_model

app = Flask(__name__)

# Blueprint 등록
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
