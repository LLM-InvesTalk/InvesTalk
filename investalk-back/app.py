import sys
import os
from dotenv import load_dotenv  # .env 파일을 불러오기 위해 추가
from flask_cors import CORS  # CORS 추가

# 프로젝트의 루트 디렉토리를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# 기존 코드
from seonga import create_app  # seonga의 create_app 함수 불러오기
from api.routes import api_bp  # api_bp를 api.routes에서 가져옴
from flask_migrate import Migrate
from seonga.models import db
from seonga.config import Config  # Config 클래스 직접 불러오기

# .env 파일의 환경 변수 로드
load_dotenv()

# Flask 앱 생성
app = create_app()  # create_app 함수 호출하여 앱 생성

# CORS 설정
CORS(app)  # 모든 출처에 대해 CORS 허용

# Blueprint 등록
app.register_blueprint(api_bp, url_prefix='/api')  # api 관련 Blueprint 등록

if __name__ == '__main__':
    app.run(port=5000, debug=True)