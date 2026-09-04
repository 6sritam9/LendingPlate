import React, { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('trustlend_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('trustlend_token'))

  const persistSession = (authResponse) => {
    const { token: newToken, userId, name, email } = authResponse
    const userInfo = { id: userId, name, email }

    localStorage.setItem('trustlend_token', newToken)
    localStorage.setItem('trustlend_user', JSON.stringify(userInfo))

    setToken(newToken)
    setUser(userInfo)
  }

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    persistSession(data)
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    persistSession(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('trustlend_token')
    localStorage.removeItem('trustlend_user')
    setToken(null)
    setUser(null)
  }

  const value = { user, token, isAuthenticated: !!token, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
