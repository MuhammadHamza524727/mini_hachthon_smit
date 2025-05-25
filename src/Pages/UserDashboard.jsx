import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase/supabase";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  // File Upload
  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('books')
      .upload(fileName, file);

    if (error) {
      console.error("Upload failed:", error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('books')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  };

  // Fetch Approved Books
  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) console.error(error);
    else setBooks(data);
    setLoading(false);
  };

  // Auth Check
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) navigate("/");
    };

    checkSession();
    fetchBooks();
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Submit Upload Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Title and file required");
      return;
    }

    const pdfUrl = await uploadFile(file);
    if (!pdfUrl) return;

    const user = await supabase.auth.getUser();
    const submitted_by = user.data.user.email;

    const { error } = await supabase.from("book_requests").insert([
      {
        title,
        author,
        pdf_url: pdfUrl,
        submitted_by,
      },
    ]);

    if (error) {
      console.error("Insert failed:", error);
    } else {
      alert("User Event request submitted for approval!");
      setFile(null);
      setTitle("");
      setAuthor("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">Submit New Event Request</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="User Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Submit Request
          </button>
        </form>

        {/* Approved Books */}
        <h2 className="text-2xl font-semibold mb-4">Approved Events</h2>
        {loading ? (
          <p className="text-gray-300">Loading approved requests...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-200"
              >
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-sm text-gray-400">Event: {book.author || "N/A"}</p>
                <a
                  href={book.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  View image pdf
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
