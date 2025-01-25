from flask import Blueprint, jsonify, request
from .models import Users, FavoriteStocks, db
from utils import token_required  # token_required 가져오기
from .utils import get_stock_data
from .dtos import UserDTO, FavoriteStockDTO
import json

# 블루프린트 생성
main_bp = Blueprint('main', __name__)


# 메인 화면
@main_bp.route('/')
def index():
    return jsonify({"message": "Welcome to the InvesTalk API!"})

# 전체 사용자 목록 조회
@main_bp.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
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
@token_required
def get_user(current_user, user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    user_dto = UserDTO(user.id, user.name, user.email)
    return jsonify(user_dto.to_dict())

# 사용자 수정
@main_bp.route('/api/users/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
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
@token_required
def delete_user(current_user, user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    FavoriteStocks.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "사용자가 삭제되었습니다."})

# 로그인된 사용자 정보(ID) 조회
@main_bp.route('/api/user_info', methods=['GET'])
@token_required
def get_user_info(current_user):
    return jsonify({
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"]
    })

# 사용자 관심 종목 목록 및 데이터 조회
@main_bp.route('/api/user/favorite_stocks', methods=['GET'])
@token_required
def get_favorite_stocks_with_data(current_user):
    try:
        print(f"Fetching favorite stocks for user: {current_user}")

        # 관심 종목 조회
        favorite_stocks = FavoriteStocks.query.filter_by(user_id=current_user['id']).all()
        if not favorite_stocks:
            return jsonify([])  # 관심 종목이 없으면 빈 배열 반환

        stocks_data = []

        for favorite in favorite_stocks:
            try:
                # 관심 종목 딕셔너리 변환 및 주식 데이터 가져오기
                favorite_data = favorite.to_dict()
                stock_info = get_stock_data(favorite.symbol)
                
                # "나의희망가격" 추가 및 데이터 병합
                stock_info["나의희망가격"] = favorite.desired_price
                combined_data = {**favorite_data, **stock_info}

                stocks_data.append(combined_data)
            except Exception as e:
                # 개별 종목에서 오류 발생 시 처리
                print(f"Error fetching data for symbol {favorite.symbol}: {e}")
                stocks_data.append({
                    "id": favorite.id,
                    "symbol": favorite.symbol,
                    "error": "Stock data unavailable"
                })

        # 디버깅용 출력: 완성된 stocks_data
        print("Final stocks_data:")
        print(json.dumps(stocks_data, ensure_ascii=False, indent=4))

        return jsonify(stocks_data)

    except Exception as e:
        print(f"Error in get_favorite_stocks_with_data: {e}")
        return jsonify({"error": "Internal Server Error"}), 500



# 사용자 관심 종목 추가
@main_bp.route('/api/user/add_favorite', methods=['POST'])
@token_required
def add_favorite_stock(current_user):
    try:
        symbol = request.json.get('symbol')
        desired_price = request.json.get('desired_price')

        if not symbol:
            return jsonify({"error": "symbol 값이 필요합니다."}), 400

        # 이미 관심 종목인지 확인
        existing_favorite = FavoriteStocks.query.filter_by(user_id=current_user['id'], symbol=symbol).first()
        if existing_favorite:
            return jsonify({"error": f"{symbol} 종목은 이미 관심 목록에 있습니다."}), 400

        new_favorite = FavoriteStocks(user_id=current_user['id'], symbol=symbol, desired_price=desired_price)
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({
            "id": current_user["id"],
            "symbol": symbol,
            "desired_price": desired_price
        }), 201
    except Exception as e:
        print(f"Error in add_favorite_stock: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# 사용자 희망 가격 업데이트
@main_bp.route('/api/user/update_price', methods=['POST'])
@token_required
def update_desired_price(current_user):
    try:
        symbol = request.json.get('symbol')
        desired_price = request.json.get('desired_price')

        favorite_stock = FavoriteStocks.query.filter_by(user_id=current_user['id'], symbol=symbol).first()
        if not favorite_stock:
            return jsonify({"error": "종목을 찾을 수 없습니다."}), 404

        favorite_stock.desired_price = desired_price
        db.session.commit()

        return jsonify({"message": f"{symbol}의 희망 가격이 {desired_price}로 수정되었습니다."}), 200
    except Exception as e:
        print(f"Error in update_desired_price: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# 관심 종목 삭제
@main_bp.route('/api/user/remove_favorite', methods=['DELETE'])
@token_required
def remove_favorite_stock(current_user):
    try:
        symbol = request.json.get('symbol')

        favorite_stock = FavoriteStocks.query.filter_by(user_id=current_user['id'], symbol=symbol).first()
        if not favorite_stock:
            return jsonify({"error": "종목을 찾을 수 없습니다."}), 404

        db.session.delete(favorite_stock)
        db.session.commit()

        return jsonify({"message": f"{symbol}가 관심 종목에서 삭제되었습니다."})
    except Exception as e:
        print(f"Error in remove_favorite_stock: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
# 종합 그래프 생성
@main_bp.route('/api/user/favorite_stocks/summed_graph', methods=['GET'])
@token_required
def get_summed_graph(current_user):
    try:
        print(f"Fetching favorite stocks for user: {current_user}")

        # 1) 관심 종목 조회
        favorite_stocks = FavoriteStocks.query.filter_by(user_id=current_user['id']).all()
        if not favorite_stocks:
            # 관심 종목이 없으면 빈 리스트 반환
            return jsonify({"summed_graph": [], "tickers": []})

        stocks_data = []

        # 2) 종목별 주식 데이터 수집
        for favorite in favorite_stocks:
            try:
                # 관심 종목 딕셔너리 변환
                favorite_data = favorite.to_dict()
                
                # 주식 데이터 가져오기
                stock_info = get_stock_data(favorite.symbol)
                
                # "나의희망가격" 추가
                stock_info["나의희망가격"] = favorite.desired_price

                # 원하는 형태로 데이터 병합
                combined_data = {**favorite_data, **stock_info}
                stocks_data.append(combined_data)

            except Exception as e:
                # 개별 종목에서 오류 발생 시 처리
                print(f"Error fetching data for symbol {favorite.symbol}: {e}")
                # 오류가 났어도 최소한의 정보(그래프는 빈 리스트)
                stocks_data.append({
                    "id": favorite.id,
                    "symbol": favorite.symbol,
                    "error": "Stock data unavailable",
                    "그래프": []
                })

        # 3) '그래프' 중 *가장 짧은 길이*를 구해서 그 범위까지만 합산
        #    -> 모든 종목이 공통으로 가지고 있는 인덱스까지만 합산
        #       (즉, 그래프 배열이 없는 종목이 있으면 길이 0 처리)
        min_length = min(len(stock.get("그래프", [])) for stock in stocks_data if "그래프" in stock)
        
        summed_graph = []
        for i in range(min_length):
            sum_value = 0.0
            for stock in stocks_data:
                graph_values = stock.get("그래프", [])
                # 그래프가 min_length 이상이라면 i번째 값을 더함
                sum_value += graph_values[i]
            
            # 소수점 아래 둘째 자리까지 반영
            summed_graph.append(round(sum_value, 2))

        # 관심 종목 티커 리스트 추출
        tickers_list = [stock.symbol for stock in favorite_stocks]

        response_data = {
            "summed_graph": summed_graph,
            "tickers": tickers_list
        }

        # 디버깅용 출력
        print("Final summed_graph:")
        print(json.dumps(response_data, ensure_ascii=False, indent=4))

        return jsonify(response_data)

    except Exception as e:
        print(f"Error in get_summed_graph: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

