import React, { useEffect, useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useNavigate } from 'react-router-dom'

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
  // Step 1: Insert into books WITHOUT submitted_by
  const { error: insertError } = await supabase.from('books').insert([{
    title: request.title,
    author: request.author,
    pdf_url: request.pdf_url,
    uploaded_at: new Date().toISOString(), // set timestamp
  }])

  if (insertError) {
    console.error("Insert error:", insertError)
    alert("Error approving request")
    return
  }

  // Step 2: Delete from book_requests
  const { error: deleteError } = await supabase
    .from('book_requests')
    .delete()
    .eq('id', request.id)

  if (deleteError) {
    console.error("Delete error:", deleteError)
    alert("Approved but failed to remove from requests.")
    return
  }

  alert("Book approved!")
  fetchRequests()
}


//   const handleApprove = async (request) => {
//     // 1. Insert into 'books'
//     const { error: insertError } = await supabase.from('books').insert([{
//       title: request.title,
//       author: request.author,
//       pdf_url: request.pdf_url,
//       submitted_by: request.submitted_by,
//     }])

//     if (insertError) {
//       alert("Error approving request")
//       return
//     }
// console.log('error', insertError);

//     // 2. Delete from 'book_requests'
//     const { error: deleteError } = await supabase
//       .from('book_requests')
//       .delete()
//       .eq('id', request.id)

//     if (deleteError) {
//       alert("Approved but failed to remove from requests.")
//       return
//     }

//     alert("Book approved!")
//     fetchRequests()
//   }

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('book_requests')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Error rejecting request")
    } else {
      alert("Book rejected.")
      fetchRequests()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel - Requests</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{req.title}</h2>
              <p className="text-sm text-gray-600">by {req.author}</p>
              <a
                href={req.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleApprove(req)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
