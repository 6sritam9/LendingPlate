import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-brand">TrustLend</Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-5 text-sm">
          <Link to="/browse" className="text-gray-600 hover:text-brand">Browse</Link>
          <Link to="/my-items" className="text-gray-600 hover:text-brand">My Items</Link>
          <Link to="/loans" className="text-gray-600 hover:text-brand">Loans</Link>
          <span className="text-gray-400">Hi, {user?.name?.split(' ')[0]}</span>
          <button onClick={handleLogout} className="bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-sm">
          <Link to="/login" className="text-gray-600 hover:text-brand">Login</Link>
          <Link to="/register" className="bg-brand text-white px-3 py-1.5 rounded-md hover:bg-brand-dark">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}
