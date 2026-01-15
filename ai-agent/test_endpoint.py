
import requests
import json
import sys

def test_chat():
    url = "http://localhost:8003/api/chat/"
    payload = {
        "message": "Hello, is this working?",
        "user_id": "test_user_123",
        "conversation_id": None,
        "mode": None
    }
    headers = {
        "Content-Type": "application/json"
    }

    print(f"Testing POST {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print("Response Headers:")
        print(json.dumps(dict(response.headers), indent=2))
        
        print("\nResponse Body:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_chat()
