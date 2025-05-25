

import { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useNavigate, Link } from 'react-router-dom'

const ADMIN_EMAIL = "admin@bookhub.com"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) setError(loginError.message)
    else {
      if (email === ADMIN_EMAIL) navigate("/admin")
      else navigate("/user")
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 w-full mb-4 rounded"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 w-full mb-4 rounded"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
