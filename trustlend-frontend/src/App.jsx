import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import MyItems from './pages/MyItems'
import Loans from './pages/Loans'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
        <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Routes>
    </div>
  )
}
