from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from seonga import create_app
from api.routes import api_bp  # Blueprint 불러오기
from login import login_bp  # Blueprint 불러오기
from flask_migrate import Migrate
from seonga.models import db
from seonga.config import Config  # Config 클래스 불러오기
from utils import token_required  # utils.py에서 token_required 가져오기

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# 환경 변수 로드
load_dotenv()

# 앱 초기화
app = create_app()

# CORS 설정
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}}, methods=["GET","POST","DELETE","PUT","OPTIONS"])

# OPTIONS 요청 전역 처리
@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = jsonify({"message": "OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
        
# Blueprint 등록
app.register_blueprint(api_bp, url_prefix='/api')  # api 관련 Blueprint 등록
app.register_blueprint(login_bp, url_prefix='/login')  # login 관련 Blueprint 등록

if __name__ == '__main__':
    app.run(port=5000, debug=True)
