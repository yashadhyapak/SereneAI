import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Auth endpoints
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password })
  return response.data
}

export const register = async (name, email, password, confirmPassword) => {
  const response = await api.post("/register", {
    name,
    email,
    password,
    confirm_password: confirmPassword,
  })
  return response.data
}

// Chat endpoints
export const sendMessage = async (userId, message) => {
  const response = await api.post("/chat", {
    user_id: userId,
    message,
  })
  return response.data
}

export const getChatHistory = async (userId) => {
  const response = await api.get(`/chat/${userId}`)
  return response.data
}

// Diary endpoints
export const createDiaryEntry = async (userId, content) => {
  const response = await api.post("/diary", {
    user_id: userId,
    content,
  })
  return response.data
}

export const getDiaryEntries = async (userId) => {
  const response = await api.get(`/diary/${userId}`)
  return response.data
}

// Insights endpoints
export const getInsights = async (userId) => {
  const response = await api.get(`/insights/${userId}`)
  return response.data
}

export const analyzeInsights = async (userId) => {
  const response = await api.post(`/insights/${userId}/analyze`)
  return response.data
}

export default api
