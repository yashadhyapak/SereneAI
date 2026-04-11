import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("API KEY starts with:", api_key[:5] if api_key else "None")

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    resp = model.generate_content("hello")
    print("SUCCESS 1.5-flash:", resp.text)
except Exception as e:
    print("ERROR 1.5-flash:", type(e).__name__, str(e))

try:
    model2 = genai.GenerativeModel("gemini-pro")
    resp2 = model2.generate_content("hello")
    print("SUCCESS gemini-pro:", resp2.text)
except Exception as e:
    print("ERROR gemini-pro:", type(e).__name__, str(e))
