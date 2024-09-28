# 기존 코드
from flask import Flask
from api.routes import api_bp
from crawling import crawler
from LLM import llm_model
from flask_cors import CORS

# Flask 앱 생성
app = Flask(__name__)

# CORS 설정: 모든 도메인에서 API를 호출할 수 있도록 허용
CORS(app)

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
