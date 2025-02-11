from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from .config import Config

# .env 파일의 환경 변수 로드
load_dotenv()

db = SQLAlchemy()  # SQLAlchemy 객체 생성
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Config에서 설정을 로드
    app.config.from_object(Config)  # 이 부분을 추가해야 합니다.

    # SQLAlchemy 앱 초기화
    db.init_app(app)

    # Migrate 설정
    migrate.init_app(app, db)

    from .models import FavoriteStocks, Users

    # 블루프린트 등록
    from .routes import main_bp

    app.register_blueprint(main_bp)

    return app
