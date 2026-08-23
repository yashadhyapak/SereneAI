"use client"

import { useState, useEffect, useRef } from "react"
import ChatBubble from "../components/ChatBubble"
import { sendMessage, getChatSessions, createChatSession, getChatSessionMessages } from "../services/api"

function Chat({ user, onLogout }) {
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId)
    } else {
      setMessages([])
    }
  }, [currentSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadSessions = async () => {
    try {
      const data = await getChatSessions(user.id)
      setSessions(data.sessions || [])
      if (data.sessions && data.sessions.length > 0) {
        setCurrentSessionId(data.sessions[0].id)
      } else {
        handleNewChat()
      }
    } catch (err) {
      console.error("Failed to load sessions:", err)
    }
  }

  const loadSessionMessages = async (sessionId) => {
    try {
      const data = await getChatSessionMessages(sessionId)
      const formattedMessages = []
      data.chats.forEach((chat) => {
        formattedMessages.push({ text: chat.message, isUser: true })
        formattedMessages.push({ text: chat.response, isUser: false })
      })
      setMessages(formattedMessages)
    } catch (err) {
      console.error("Failed to load messages:", err)
    }
  }

  const handleNewChat = async () => {
    try {
      const newSession = await createChatSession(user.id)
      setSessions((prev) => [newSession, ...prev])
      setCurrentSessionId(newSession.id)
    } catch (err) {
      console.error("Failed to create new chat:", err)
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
      const response = await sendMessage(user.id, userMessage, currentSessionId)
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

  const formatDate = (dateString) => {
    const d = new Date(dateString)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-layout">
      <div className="chat-main">
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
      
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
           <button className="btn btn-primary" style={{width: '100%'}} onClick={handleNewChat}>
             + New Conversation
           </button>
        </div>
        <div className="chat-sidebar-history">
           {sessions.map((session) => (
             <div 
               key={session.id} 
               className={`history-card ${currentSessionId === session.id ? 'active' : ''}`}
               onClick={() => setCurrentSessionId(session.id)}
             >
               <div className="history-title">{session.title}</div>
               <div className="history-date">{formatDate(session.created_at)}</div>
             </div>
           ))}
           {sessions.length === 0 && (
             <div style={{textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem'}}>
               No history yet.
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default Chat
