import requests

def chatting(message):
    # ngrok URL
    ngrok_url = "https://5701-34-125-140-221.ngrok-free.app/generate"

    # 요청 데이터
    data = {
        "instruction": message,
        "max_tokens": 256
    }

    # POST 요청 보내기
    response = requests.post(ngrok_url, json=data)

    # 응답 출력 및 반환
    if response.status_code == 200:
        return response.json()  # JSON 데이터를 반환
    else:
        return {"error": response.text, "status_code": response.status_code}