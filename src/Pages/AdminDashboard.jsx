import React, { useEffect, useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'

export default function AdminDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('book_requests').select('*')
    if (error) console.error(error)
    else setRequests(data)
    setLoading(false)
  }

  
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== "admin@bookhub.com") {
        navigate('/')
      }
    }

    checkAdmin()
    fetchRequests()
  }, [])

  const handleApprove = async (request) => {
    const { error: insertError } = await supabase.from('books').insert([{
      title: request.title,
      author: request.author,
      pdf_url: request.pdf_url,
      uploaded_at: new Date().toISOString(),
    }])

    if (insertError) {
      console.error("Insert error:", insertError)
      toast.error("Error approving request")
      return
    }

    const { error: deleteError } = await supabase
      .from('book_requests')
      .delete()
      .eq('id', request.id)

    if (deleteError) {
      console.error("Delete error:", deleteError)
      toast.error("Approved but failed to remove from requests.")
      return
    }

    toast.success("Event approved!")
    fetchRequests()
  }

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('book_requests')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Error rejecting request")
    } else {
      toast.success("Event rejected.")
      fetchRequests()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-5xl bg-gray-800 p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
          <h1 className="text-3xl font-extrabold">Admin Panel - Event Requests</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition text-white font-semibold px-5 py-2 rounded-md shadow-md"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No pending requests.</p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border border-gray-500 rounded-lg shadow-sm p-5 hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold mb-1">Organisor Name: {req.title}</h2>
                <p className="text-lg mb-2">Event: <span className="italic">{req.author}</span></p>
                <a
                  href={req.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4 text-blue-400 hover:text-blue-300 underline"
                >
                  View image PDF
                </a>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(req)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-shadow shadow"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition-shadow shadow"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
