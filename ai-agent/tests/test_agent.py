import requests
import json

BASE_URL = "http://localhost:8000/api/chat"

def test_chat(message):
    print(f"\nUser: {message}")
    try:
        response = requests.post(BASE_URL, json={"message": message})
        if response.status_code == 200:
            print("Agent:", response.json()['message'])
        else:
            print("Error:", response.status_code, response.text)
    except Exception as e:
        print("Request failed:", e)

if __name__ == "__main__":
    print("--- Testing Advanced AI Agent ---")
    test_chat("Hello")
    test_chat("What is the latest car news?")  # Should trigger Scraper (fallback)
    test_chat("Check inventory for BMW")       # Should trigger DB (fallback)
