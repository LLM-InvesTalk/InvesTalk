from flask import Blueprint, redirect, request, make_response, jsonify
from seonga.models import Users, db
from utils import token_required  # token_required 데코레이터
import jwt
import datetime
import os
from dotenv import load_dotenv
from requests_oauthlib import OAuth2Session
import requests

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
login_bp = Blueprint('login', __name__)

# Google OAuth 설정
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
REDIRECT_URI = "http://localhost:5000/login/google/callback"

# Google 제공자 구성 가져오기
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

# OAuth2 세션 초기화
auth_session = OAuth2Session(
    client_id=GOOGLE_CLIENT_ID,
    redirect_uri=REDIRECT_URI,
    scope=["https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"]
)

# 로그인 상태 확인 라우트
@login_bp.route('/status', methods=['GET'])
@token_required
def login_status(current_user):
    return jsonify({"loggedIn": True, "user": current_user}), 200


# Google 로그인 라우트
@login_bp.route('/google', methods=['GET'])
def google_login():
    authorization_url, state = auth_session.authorization_url(
        get_google_provider_cfg()["authorization_endpoint"]
    )
    return redirect(authorization_url)

# Google Callback 라우트
@login_bp.route('/google/callback', methods=['GET'])
def google_callback():
    token = auth_session.fetch_token(
        token_url=get_google_provider_cfg()["token_endpoint"],
        authorization_response=request.url,
        client_secret=GOOGLE_CLIENT_SECRET
    )

    userinfo_endpoint = get_google_provider_cfg()["userinfo_endpoint"]
    userinfo_response = auth_session.get(userinfo_endpoint)
    userinfo = userinfo_response.json()

    if userinfo.get("email_verified"):
        email = userinfo["email"]
        name = userinfo.get("name", "Unknown")
        platform = "Google"

        # DB에 사용자 정보 저장
        user = Users.query.filter_by(email=email).first()
        if not user:
            # 사용자 정보가 없으면 새로 추가
            user = Users(name=name, email=email, platform=platform)
            db.session.add(user)
            db.session.commit()

        # JWT 생성
        token = jwt.encode({
            'id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm="HS256")

        response = make_response(redirect("http://localhost:3000"))
        response.set_cookie('jwt', token, httponly=True)
        return response

    return "User email not verified by Google.", 400

# 로그아웃 라우트
@login_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logout successful'}))
    response.set_cookie('jwt', '', expires=0)
    return response
