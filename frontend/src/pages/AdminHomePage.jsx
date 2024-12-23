// AdminHomePage.js
import React, { useEffect, useState } from 'react';
import './AdminHomePage.css';

const AdminHomePage = () => {
    const [books, setBooks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        genre: '',
        summary: '',
        coverImage: null,
    });

    // Fetch books from the API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books'); // Adjust the API URL as needed
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    // Handle Delete Book
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try {
            await fetch(`/api/books/${id}`, {
                method: 'DELETE',
            });
            setBooks(books.filter((book) => book._id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    // Handle Edit (navigate to edit page)
    const handleEdit = (id) => {
        window.location.href = `/admin/edit/${id}`; // Adjust the path as needed
    };

    // Handle View (navigate to view page)
    const handleView = (id) => {
        window.location.href = `/admin/view/${id}`; // Adjust the path as needed
    };

    // Handle Add Book Form Submission
    const handleAddBookSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('genre', newBook.genre);
        formData.append('summary', newBook.summary);
        if (newBook.coverImage) {
            formData.append('coverImage', newBook.coverImage);
        }

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setBooks([...books, data]);
            setShowAddForm(false);
            setNewBook({ title: '', author: '', genre: '', summary: '', coverImage: null });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div className="admin-home">
            <h1>Admin Home Page</h1>
            <button className="btn add" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add Book'}
            </button>

            {showAddForm && (
                <form className="add-book-form" onSubmit={handleAddBookSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Summary"
                        value={newBook.summary}
                        onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
                        required
                    ></textarea>
                    <input
                        type="file"
                        onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.files[0] })}
                        accept="image/*"
                    />
                    <button type="submit" className="btn save">Save Book</button>
                </form>
            )}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>Average Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.averageRating.toFixed(1)}</td>
                            <td>
                                <button className="btn view" onClick={() => handleView(book._id)}>
                                    View
                                </button>
                                <button className="btn edit" onClick={() => handleEdit(book._id)}>
                                    Edit
                                </button>
                                <button className="btn delete" onClick={() => handleDelete(book._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHomePage;
