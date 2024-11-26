from . import db
from sqlalchemy.orm import relationship

# 유저 모델
class Users(db.Model):
    __tablename__ = 'users'  # 테이블 이름 설정

    # 사용자 등록 시마다 아이디를 생성하며 자동 증가 설정 (기본 키 설정)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 사용자의 이름 (중복 불가)
    name = db.Column(db.String(100), unique=True, nullable=False)
    # 사용자의 이메일 (중복 불가)
    email = db.Column(db.String(150), unique=True, nullable=False)
    # 로그인 플랫폼 추가
    platform = db.Column(db.String(50), nullable=True)
    # 관심 종목 리스트에 대한 관계 정의
    favorite_stocks = db.relationship('FavoriteStocks', backref='user', lazy=True)

# 관심 종목 모델
class FavoriteStocks(db.Model):
    __tablename__ = 'favorite_stocks'  # 테이블 이름 설정

    # 관심 종목 등록 시마다 아이디를 생성하며 자동 증가 설정 (기본 키 설정)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 유저 ID (Users 모델의 id를 외래 키로 참조)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # 주식 심볼 (종목 코드)
    symbol = db.Column(db.String(10), nullable=False)
    # 사용자가 설정한 희망 가격
    desired_price = db.Column(db.Float, nullable=True)