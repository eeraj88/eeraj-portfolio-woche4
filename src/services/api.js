// API Base URL - aus Umgebungsvariable oder localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Hilfsfunktion für IP-Adresse (einfache Implementierung)
const getClientIP = () => {
  // In Produktion würde die IP vom Backend kommen
  // Für Development nutzen wir einen zufälligen Wert oder localStorage
  let ip = localStorage.getItem('client_ip')
  if (!ip) {
    ip = 'client_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('client_ip', ip)
  }
  return ip
}

// Visitor API
export const visitorAPI = {
  getCount: async () => {
    const response = await fetch(`${API_BASE}/visitor/count`)
    if (!response.ok) throw new Error('Failed to fetch visitor count')
    return response.json()
  },

  register: async () => {
    const response = await fetch(`${API_BASE}/visitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipAddress: getClientIP() })
    })
    if (!response.ok) throw new Error('Failed to register visitor')
    return response.json()
  }
}

// Like API
export const likeAPI = {
  getCount: async (projectId) => {
    const response = await fetch(`${API_BASE}/likes/${projectId}`)
    if (!response.ok) throw new Error('Failed to fetch like count')
    return response.json()
  },

  addLike: async (projectId) => {
    const response = await fetch(`${API_BASE}/likes/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipAddress: getClientIP() })
    })
    if (!response.ok) throw new Error('Failed to add like')
    return response.json()
  }
}

// Comment API
export const commentAPI = {
  getComments: async (projectId) => {
    const response = await fetch(`${API_BASE}/comments/${projectId}`)
    if (!response.ok) throw new Error('Failed to fetch comments')
    return response.json()
  },

  addComment: async (projectId, name, message) => {
    const response = await fetch(`${API_BASE}/comments/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    })
    if (!response.ok) throw new Error('Failed to add comment')
    return response.json()
  }
}
