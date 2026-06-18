import { createContext, useContext, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })

      // Backend returns { message: "..." } with no token on failure (HTTP 200)
      if (!data.token) {
        return { success: false, message: data.message ?? 'Login failed. Check your credentials.' }
      }

      let name = email
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]))
        name = payload.sub ?? email
      } catch { /* JWT decode failed — use email */ }

      const userObj = { email, name }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userObj))
      setToken(data.token)
      setUser(userObj)
      return { success: true }

    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  // Backend register returns NO token — redirect to login after success
  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register({ name, email, password })

      if (data.message?.toLowerCase().includes('already')) {
        return { success: false, message: data.message }
      }

      return { success: true }

    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
