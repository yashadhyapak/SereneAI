import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Accept both standard GEMINI_API_KEY or comma-separated list
keys_str = os.getenv("GEMINI_API_KEY", "")

_raw_keys = keys_str.split(',') if ',' in keys_str else [keys_str]
API_KEYS = [k.strip() for k in _raw_keys if k.strip() and k.strip() != "your-gemini-api-key-here"]

current_key_idx = 0

if API_KEYS:
    genai.configure(api_key=API_KEYS[current_key_idx])

def is_llm_available() -> bool:
    return len(API_KEYS) > 0

def generate_content_with_rotator(prompt: str) -> str:
    global current_key_idx
    if not is_llm_available():
        raise Exception("No Gemini API keys found.")

    attempts = 0
    max_attempts = len(API_KEYS)

    while attempts < max_attempts:
        try:
             # Make sure to initialize the model dynamically after configuration changes
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "exhausted" in error_str or "quota" in error_str:
                print(f"⚠️ [API Rotator] Key {current_key_idx+1} exhausted. Rotating to next key...")
                current_key_idx = (current_key_idx + 1) % len(API_KEYS)
                genai.configure(api_key=API_KEYS[current_key_idx])
                attempts += 1
            else:
                # Reraise non-quota errors (like 404 Model Not Found)
                raise e
                
    raise Exception("429: All API Keys have exhausted their rate limits.")
