import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase/supabase";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('books')
      .upload(fileName, file);

    if (error) {
      toast.error("Upload failed!");
      console.error("Upload failed:", error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('books')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  };

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) console.error(error);
    else setBooks(data);
    setLoading(false);
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error("Title and file required");
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
      toast.error("Failed to submit request.");
    } else {
      toast.success("Event request submitted for approval!");
      setFile(null);
      setTitle("");
      setAuthor("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

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

        <button
          onClick={() => navigate("approved-events")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6"
        >
          Check Approved Events
        </button>

        <Outlet />
      </div>
    </div>
  );
}
