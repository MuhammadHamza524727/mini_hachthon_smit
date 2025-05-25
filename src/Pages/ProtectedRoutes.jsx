// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../Supabase/supabase'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/" />

  if (adminOnly && user.email !== 'admin@bookhub.com') {
    return <Navigate to="/user" />
  }

  return children
}
