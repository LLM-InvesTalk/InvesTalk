from flask import Flask
from api.routes import api_bp
from crawling import crawler
from LLM import llm_model

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
