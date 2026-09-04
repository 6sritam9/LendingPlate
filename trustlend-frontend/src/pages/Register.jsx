import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', neighborhood: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/browse')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border border-gray-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>

      {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full name</label>
          <input name="name" required value={form.name} onChange={handleChange}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Neighborhood (optional)</label>
          <input name="neighborhood" value={form.neighborhood} onChange={handleChange}
                 className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <button type="submit" disabled={loading}
                className="w-full bg-brand text-white py-2 rounded-md hover:bg-brand-dark disabled:opacity-60">
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-brand font-medium">Log in</Link>
      </p>
    </div>
  )
}
