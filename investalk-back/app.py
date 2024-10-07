import sys
import os

# 프로젝트의 루트 디렉토리를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# 기존 코드
from flask import Flask
from api.routes import api_bp
from crawling import crawler
from LLM import llm_model
from flask_cors import CORS
from flask_migrate import Migrate
from seonga.models import db

# Flask 앱 생성
app = Flask(__name__)

# 설정 파일 불러오기
app.config.from_object('seonga.config')
db.init_app(app)
migrate = Migrate(app, db)

# CORS 설정: 모든 도메인에서 API를 호출할 수 있도록 허용
CORS(app)

# Blueprint 등록
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(port=5000, debug=True)