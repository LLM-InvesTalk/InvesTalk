from flask import Blueprint
from api.mainpage.dailygraph.dailyGraph import get_daily_graph_data

api_bp = Blueprint('api', __name__)

@api_bp.route('/etf-data', methods=['GET'])
def get_etf_data():
    return get_daily_graph_data()