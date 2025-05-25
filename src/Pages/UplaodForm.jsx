import React, { useState, useEffect } from "react";
import { supabase } from "../Supabase/supabase";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      } else {
        setUserId(session.user.id);
      }
    };

    getSession();
  }, []);

  const handleUpload = async () => {
    if (!title || !file) {
      alert("Title and file are required.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `requests/${fileName}`;

    // 🔹 1. Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("books") // make sure 'books' is your bucket name
      .upload(filePath, file);

    if (uploadError) {
      console.error("File upload failed:", uploadError);
      alert("File upload failed!");
      return;
    }

    // 🔹 2. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("books")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      alert("Failed to get file URL.");
      return;
    }

    // 🔹 3. Insert record into book_requests table
    // const { error: insertError } = await supabase
    //   .from('book_requests')
    //   .insert([
    //     {
    //       title,
    //       author,
    //       pdf_url: publicUrl,
    //     //   submitted_by: userId
    //     }
    //   ])
    const { error: insertError } = await supabase.from("books").insert([
      {
        title: request.title,
        author: request.author,
        pdf_url: request.pdf_url,
        // no submitted_by here
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      alert("Error approving request: " + insertError.message);
      return;
    } else {
      alert("Book upload request submitted successfully!");
      setTitle("");
      setAuthor("");
      setFile(null);
      navigate("/userdashboard");
    }
  };
  // if (insertError) {
  //   console.error('Insert error:', insertError)
  //   alert('Failed to submit request.')
  //   return
  // }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">📤 Upload Book</h2>

      <input
        type="text"
        placeholder="Book Title"
        className="border p-2 w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author (optional)"
        className="border p-2 w-full mb-4"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="file"
        accept="application/pdf"
        className="border p-2 w-full mb-4"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={handleUpload}
      >
        Submit Request
      </button>
    </div>
  );
}
