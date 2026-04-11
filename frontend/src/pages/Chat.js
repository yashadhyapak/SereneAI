"use client"

import { useState, useEffect, useRef } from "react"
import ChatBubble from "../components/ChatBubble"
import { sendMessage, getChatHistory } from "../services/api"

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const data = await getChatHistory(user.id)
      const formattedMessages = []
      data.chats.forEach((chat) => {
        formattedMessages.push({ text: chat.message, isUser: true })
        formattedMessages.push({ text: chat.response, isUser: false })
      })
      setMessages(formattedMessages)
    } catch (err) {
      console.error("Failed to load chat history:", err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }])
    setLoading(true)

    try {
      const response = await sendMessage(user.id, userMessage)
      setMessages((prev) => [...prev, { text: response.response, isUser: false }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, I couldn't process that. Please try again.",
          isUser: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="page-header">
            <h1 className="page-title">Talk to Serene</h1>
            <p className="page-subtitle">I'm here to listen. Share what's on your mind.</p>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                Start a conversation by typing a message below.
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
            ))}
            {loading && (
              <div className="chat-bubble ai">
                <span style={{ opacity: 0.7 }}>Serene is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            {/* <button className="mic-button" title="Voice input (not functional)">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button> */}
            <textarea
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button className="send-button" onClick={handleSend} disabled={loading}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
    </div>
  )
}

export default Chat
