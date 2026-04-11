import os
from dotenv import load_dotenv
from services.llm_rotator import is_llm_available, generate_content_with_rotator

load_dotenv()
llm_available = is_llm_available()

def label_emotion(diary_content: str) -> str:
    if not llm_available:
        return "Neutral"

    try:
        prompt = f"Analyze the following diary entry and categorize the overarching emotion in exactly ONE word. Choose from: [Joy, Stress, Sadness, Calm, Anger, Anxiety].\n\nEntry: {diary_content}\n\nEmotion:"
        response_text = generate_content_with_rotator(prompt)
        # Clean it up perfectly
        word = response_text.strip().replace(".", "").replace('"', '').title()
        valid_words = ["Joy", "Stress", "Sadness", "Calm", "Anger", "Anxiety"]
        if word in valid_words:
            return word
        else:
            return "Neutral"
    except Exception:
        return "Neutral"
