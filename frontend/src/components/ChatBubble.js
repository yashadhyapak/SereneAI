function ChatBubble({ message, isUser }) {
  return <div className={`chat-bubble ${isUser ? "user" : "ai"}`}>{message}</div>
}

export default ChatBubble
