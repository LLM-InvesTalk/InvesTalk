from flask import Blueprint, jsonify, request
from .models import Users, FavoriteStocks, db
from .utils import get_stock_data
from .dtos import UserDTO, FavoriteStockDTO

# 블루프린트 생성
main_bp = Blueprint('main', __name__)

# 메인 화면
@main_bp.route('/')
def index():
    return jsonify({"message": "Welcome to the InvesTalk API!"})

# 전체 사용자 목록 조회
@main_bp.route('/api/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    user_dtos = [UserDTO(user.id, user.name, user.email) for user in users]
    return jsonify([user.to_dict() for user in user_dtos])

# 사용자 생성
@main_bp.route('/api/users', methods=['POST'])
def create_user():
    name = request.json.get('name')
    email = request.json.get('email')

    existing_user = Users.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "사용자가 이미 존재합니다."}), 400

    new_user = Users(name=name, email=email)
    db.session.add(new_user)
    db.session.commit()

    user_dto = UserDTO(new_user.id, new_user.name, new_user.email)
    return jsonify(user_dto.to_dict()), 201

# 사용자 조회
@main_bp.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    user_dto = UserDTO(user.id, user.name, user.email)
    return jsonify(user_dto.to_dict())

# 사용자 수정
@main_bp.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    name = request.json.get('name', user.name)
    email = request.json.get('email', user.email)

    user.name = name
    user.email = email
    db.session.commit()

    user_dto = UserDTO(user.id, user.name, user.email)
    return jsonify(user_dto.to_dict())

# 사용자 삭제
@main_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    FavoriteStocks.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "사용자가 삭제되었습니다."})

# 전체 사용자 관심 종목 조회
@main_bp.route('/api/favorite_stocks', methods=['GET'])
def get_all_favorite_stocks():
    favorite_stocks = FavoriteStocks.query.all()
    stocks_data = []
    for stock in favorite_stocks:
        user = Users.query.get(stock.user_id)
        stock_dto = FavoriteStockDTO(user.id, user.name, stock.symbol, stock.desired_price)
        stocks_data.append(stock_dto.to_dict())

    return jsonify(stocks_data)

# 사용자 관심 종목 목록 및 데이터 조회
@main_bp.route('/api/user/<int:user_id>/favorite_stocks', methods=['GET'])
def get_favorite_stocks_with_data(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    favorite_stocks = FavoriteStocks.query.filter_by(user_id=user_id).all()
    stocks_data = []

    for favorite in favorite_stocks:
        symbol = favorite.symbol
        stock_info = get_stock_data(symbol)

        # 기존 stock_info에 나의희망가격 추가
        stock_info["나의희망가격"] = favorite.desired_price  # desired_price를 나의희망가격으로 추가

        # 원하는 필드만 포함하여 stocks_data에 추가
        stocks_data.append(stock_info)

    return jsonify(stocks_data)

# 사용자 관심 종목 추가
@main_bp.route('/api/user/<int:user_id>/add_favorite', methods=['POST'])
def add_favorite_stock(user_id):
    symbol = request.json.get('symbol')
    desired_price = request.json.get('desired_price')

    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    # 이미 관심 종목에 존재하는지 확인
    existing_favorite = FavoriteStocks.query.filter_by(user_id=user_id, symbol=symbol).first()
    if existing_favorite:
        return jsonify({"error": f"{symbol} 종목은 이미 관심 목록에 있습니다."}), 400

    # 새로운 관심 종목 추가
    new_favorite = FavoriteStocks(user_id=user_id, symbol=symbol, desired_price=desired_price)
    db.session.add(new_favorite)
    db.session.commit()

    stock_dto = FavoriteStockDTO(user.id, user.name, new_favorite.symbol, new_favorite.desired_price)
    return jsonify(stock_dto.to_dict()), 201

# 사용자 희망 가격 업데이트
@main_bp.route('/api/user/<int:user_id>/update_price', methods=['POST'])
def update_desired_price(user_id):
    data = request.json
    symbol = data.get('symbol')
    desired_price = data.get('desired_price')

    # 해당 유저의 관심 종목을 찾음
    favorite_stock = FavoriteStocks.query.filter_by(user_id=user_id, symbol=symbol).first()

    if favorite_stock:
        favorite_stock.desired_price = desired_price  # 희망 가격 업데이트
        db.session.commit()
        return jsonify({"message": f"{symbol}의 희망 가격이 {desired_price}로 수정되었습니다."}), 200

    return jsonify({"error": "종목을 찾을 수 없습니다."}), 404

# 관심 종목 삭제
@main_bp.route('/api/user/<int:user_id>/remove_favorite', methods=['DELETE'])
def remove_favorite_stock(user_id):
    symbol = request.json.get('symbol')

    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    favorite_stock = FavoriteStocks.query.filter_by(user_id=user_id, symbol=symbol).first()
    if not favorite_stock:
        return jsonify({"error": "관심 종목을 찾을 수 없습니다."}), 404

    db.session.delete(favorite_stock)
    db.session.commit()

    return jsonify({"message": f"{symbol}가 관심 종목에서 삭제되었습니다."})