import React, { useEffect, useState } from 'react';
import { supabase } from '../Supabase/supabase';
import { useNavigate } from 'react-router-dom';

const ApprovedEvents = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) navigate('/');
        };

        const fetchBooks = async () => {
            const { data, error } = await supabase.from('books').select('*');
            if (error) console.error(error);
            else setBooks(data);
            setLoading(false);
        };

        checkSession();
        fetchBooks();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
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
    );
};

export default ApprovedEvents;
