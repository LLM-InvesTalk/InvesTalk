from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
import os
import sys
from dotenv import load_dotenv
from seonga import create_app
from api.routes import api_bp  # Blueprint 불러오기
from login import login_bp  # Blueprint 불러오기
from flask_migrate import Migrate
from seonga.models import db
from seonga.config import Config  # Config 클래스 불러오기

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# 환경 변수 로드
load_dotenv()

# 앱 초기화
app = create_app()

# CORS 설정
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# 환경 변수에서 SECRET_KEY 가져오기
SECRET_KEY = os.getenv("SECRET_KEY")

# JWT 검증 데코레이터
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('jwt')  # 쿠키에서 토큰 가져오기
        if not token:
            return jsonify({"error": "Unauthorized, please log in"}), 401  # 인증 실패 시

        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # JWT 토큰 검증
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)  # JWT가 유효하면 원래 함수 실행
    return decorated

# Blueprint 등록
app.register_blueprint(api_bp, url_prefix='/api')  # api 관련 Blueprint 등록
app.register_blueprint(login_bp, url_prefix='/login')  # login 관련 Blueprint 등록

if __name__ == '__main__':
    app.run(port=5000, debug=True)
