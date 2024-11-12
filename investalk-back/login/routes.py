import jwt
import datetime
import os
from flask import Blueprint, redirect, request, make_response, jsonify
from dotenv import load_dotenv
from requests_oauthlib import OAuth2Session
from utils import token_required  # utils.py에서 token_required 가져오기
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
def login_status():
    return jsonify({"loggedIn": True}), 200

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
        email = userinfo_response.json()["email"] # email 가져오기
        # name = userinfo.get("name", "No Name") # 이름 가져오기(기본값: "No Name")
        # given_name = userinfo.get("given_name", "No Given Name")  # 이름
        # family_name = userinfo.get("family_name", "No Family Name")  # 성
        # picture = userinfo.get("picture", "")  # 프로필 사진 URL
        # gender = userinfo.get("gender", "Not Specified")  # 성별 (구글에서 더 이상 제공하지 않을 수 있음)

        # JWT 생성
        token = jwt.encode({
            'email': email,
            # 'name': name,
            # 'given_name': given_name,
            # 'family_name': family_name,
            # 'picture': picture,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm="HS256")

        response = make_response(redirect("http://localhost:3000"))
        response.set_cookie('jwt', token, httponly=True)
        return response
    else:
        return "User email not verified by Google.", 400

# 로그아웃 라우트
@login_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logout successful'}))
    response.set_cookie('jwt', '', expires=0)
    return response
