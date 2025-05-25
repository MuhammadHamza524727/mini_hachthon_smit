// import React, { useState } from 'react'
// import { supabase } from '../Supabase/supabase'
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'

// const ADMIN_EMAIL = "admin@bookhub.com"

// export default function Signup() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   const handleSignup = async (event) => {
//     event.preventDefault()
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     })

//     if (error) {
//       setError(error.message)
//     } else {
//       alert("Signup successful! Logging you in...")
//       if (email === ADMIN_EMAIL) navigate('/admin')
//       else navigate('/user')
//     }
//   }

//   return (
//     <>
//     <div className="p-8 max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-4"
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-4"
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {error && <p className="text-red-600 mb-4">{error}</p>}
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//           type="submit"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>

//     <p className="text-sm mt-4 text-center">
//       Already have an account? <Link to="/" className="text-blue-600 underline">Login</Link>
//     </p>
//     </>
//   )
// }

import React, { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useNavigate, Link } from 'react-router-dom'

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
      setError(error.message)
    } else {
      alert("Signup successful! Logging you in...")
      if (email === ADMIN_EMAIL) navigate('/admin')
      else navigate('/user')
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
