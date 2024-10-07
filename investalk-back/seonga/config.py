import os
from dotenv import load_dotenv

# .env 파일의 환경 변수 로드
load_dotenv()

class Config:
    # SQLAlchemy 설정
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 보안 키 설정
    SECRET_KEY = os.getenv('SECRET_KEY')

    # 추가 설정 (필요에 따라 확장 가능)
    DEBUG = False
    TESTING = False