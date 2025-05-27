import React, { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify' // ✅ Toast import

const ADMIN_EMAIL = "admin@bookhub.com"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message) // ✅ Show error toast
    } else {
      toast.success("Signup successful! Logging you in...") // ✅ Success toast
      setTimeout(() => {
        if (email === ADMIN_EMAIL) navigate('/admin')
        else navigate('/user')
      }, 1500) // Small delay for user to see toast
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 w-full mb-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 w-full mb-4 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
