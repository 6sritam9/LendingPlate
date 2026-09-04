import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/browse')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border border-gray-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Log in to TrustLend</h1>

      {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <button type="submit" disabled={loading}
                className="w-full bg-brand text-white py-2 rounded-md hover:bg-brand-dark disabled:opacity-60">
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        No account yet? <Link to="/register" className="text-brand font-medium">Sign up</Link>
      </p>
    </div>
  )
}
