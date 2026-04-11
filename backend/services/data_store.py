from datetime import datetime

# In-memory data structures
users = [
    {"id": 1, "name": "Demo User", "email": "demo@serene.ai", "password": "demo123"},
    {"id": 2, "name": "Test User", "email": "test@serene.ai", "password": "test123"},
]

chat_history = [
    {
        "id": 1,
        "user_id": 1,
        "message": "I've been feeling stressed lately",
        "response": "I hear you, and I want you to know that it's okay to feel stressed sometimes. Would you like to tell me more about what's been on your mind?",
        "timestamp": "2024-01-15T10:30:00"
    }
]

diary_entries = [
    {
        "id": 1,
        "user_id": 1,
        "content": "Today was a good day. I managed to complete my tasks and felt productive.",
        "date": "2024-01-15",
        "preview": "Today was a good day..."
    },
    {
        "id": 2,
        "user_id": 1,
        "content": "Feeling a bit anxious about the upcoming presentation, but I'm trying to stay positive.",
        "date": "2024-01-14",
        "preview": "Feeling a bit anxious..."
    }
]

# Helper functions
def get_next_user_id():
    return max([u["id"] for u in users], default=0) + 1

def get_next_chat_id():
    return max([c["id"] for c in chat_history], default=0) + 1

def get_next_diary_id():
    return max([d["id"] for d in diary_entries], default=0) + 1
