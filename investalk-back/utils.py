# utils.py
import jwt
import os
from flask import request, jsonify
from functools import wraps

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
