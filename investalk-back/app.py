from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
import os

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app = Flask(__name__)

# CORS 설정
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

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
from api import api_bp
from login import login_bp

app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/login')

if __name__ == '__main__':
    app.run(debug=True)
