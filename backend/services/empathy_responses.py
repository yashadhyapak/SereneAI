import random

# Empathetic placeholder responses
EMPATHY_RESPONSES = [
    "I hear you, and I want you to know that your feelings are valid. It's okay to feel this way. Would you like to share more about what's on your mind?",
    "Thank you for sharing that with me. It takes courage to open up. Remember, you're not alone in this journey.",
    "I understand this might be difficult for you. Take your time, and know that I'm here to listen whenever you're ready.",
    "Your feelings matter, and I'm glad you felt comfortable sharing them with me. What would help you feel better right now?",
    "It sounds like you've been going through a lot. Remember to be gentle with yourself. You're doing the best you can.",
    "I appreciate you trusting me with your thoughts. Sometimes just expressing how we feel can be a relief. Is there anything specific you'd like to explore?",
    "That sounds challenging, and it's completely understandable to feel that way. Would you like to try a simple breathing exercise together?",
    "I'm here for you. Sometimes life can feel overwhelming, but remember that every storm passes. How can I support you today?",
    "Your well-being matters. It's okay to take things one step at a time. What's one small thing that might bring you comfort right now?",
    "Thank you for being so open with me. Remember, seeking support is a sign of strength, not weakness."
]

def get_empathetic_response(message: str) -> str:
    """Returns a contextual empathetic response based on message content."""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["anxious", "anxiety", "worried", "nervous"]):
        return "I can sense you're feeling anxious. That's a really common feeling, and it's okay. Would you like to try a calming technique together, or would you prefer to talk through what's causing these feelings?"
    
    if any(word in message_lower for word in ["sad", "depressed", "down", "unhappy"]):
        return "I'm sorry you're feeling this way. Sadness can be heavy, but please know that you don't have to carry it alone. I'm here to listen. What's been weighing on your heart?"
    
    if any(word in message_lower for word in ["stress", "stressed", "overwhelmed", "pressure"]):
        return "It sounds like you're under a lot of pressure right now. That can be exhausting. Would you like to talk about what's causing this stress, or would you prefer some tips for managing these feelings?"
    
    if any(word in message_lower for word in ["happy", "good", "great", "wonderful", "excited"]):
        return "That's wonderful to hear! I'm so glad you're feeling positive. Would you like to share what's bringing you joy? Celebrating the good moments is important too!"
    
    if any(word in message_lower for word in ["tired", "exhausted", "fatigue", "sleep"]):
        return "Rest is so important for our mental well-being. It sounds like you might need to take some time to recharge. Have you been able to get enough rest lately?"
    
    if any(word in message_lower for word in ["lonely", "alone", "isolated"]):
        return "Feeling lonely can be really difficult. Please know that reaching out here shows strength. You're not as alone as you might feel. Would you like to talk about it?"
    
    return random.choice(EMPATHY_RESPONSES)
