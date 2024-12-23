import React, { useEffect, useState } from 'react';
import './AdminHomePage.css';
import { useNavigate } from 'react-router-dom';

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
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEdit, setIsEdit] = useState(false); // To toggle between View/Edit modes
    const navigate = useNavigate();
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // You can adjust this value

    // Fetch books from the API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log('Fetching books...');
                const response = await fetch('http://localhost:8081/book/getAll'); // Adjust the API URL as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }

                const data = await response.json();
                if (data && data.length > 0) {
                    setBooks(data);
                } else {
                    setBooks(null); // No books found
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks(null);  // Set to null on error
            }
        };

        fetchBooks();
    }, []);

    // Handle Delete Book
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:8081/book/deleteBook/${id}`, {
                method: 'DELETE',
            });
            setBooks(books.filter((book) => book._id !== id)); // Remove the deleted book from the list
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    // Handle Edit (navigate to edit page)
    const handleEdit = (id) => {
        window.location.href = `http://localhost:8081/book/updateBook/${id}`; // Adjust the path as needed
    };

    // Handle View (navigate to view page)
    const handleView = (id) => {
        
        navigate(`/book/${id}`); // Redirect to the book details page
    };

    // Handle Add Book Form Submission
    const handleAddBookSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('genre', newBook.genre);
        formData.append('summary', newBook.summary);

        if (newBook.coverImage && newBook.coverImage instanceof File) {
            formData.append('coverImage', newBook.coverImage);
        }

        try {
            const response = await fetch('http://localhost:8081/book/addBook', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Ensure books is an array before setting the new state
            setBooks((prevBooks) => {
                if (Array.isArray(prevBooks)) {
                    return [...prevBooks, data];
                }
                return [data];  // If prevBooks is not an array, start a new array with the added book
            });

            setShowAddForm(false);
            setNewBook({ title: '', author: '', genre: '', summary: '', coverImage: null });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    // Open the modal to view or edit the book
    const handleBookSelect = (book, edit = false) => {
        setSelectedBook(book);
        setIsEdit(edit);
    };

    // Handle the form submit for editing the selected book
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', selectedBook.title);
        formData.append('author', selectedBook.author);
        formData.append('genre', selectedBook.genre);
        formData.append('summary', selectedBook.summary);

        if (selectedBook.coverImage && selectedBook.coverImage instanceof File) {
            formData.append('coverImage', selectedBook.coverImage);
        }

        try {
            const response = await fetch(`http://localhost:8081/book/updateBook/${selectedBook._id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update book');
            }

            const updatedBook = await response.json();
            setBooks(books.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
            setSelectedBook(null); // Close modal
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil((books?.length || 0) / itemsPerPage);

    const currentBooks = (books || []).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
                    <select
                        value={newBook.genre}
                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                        required
                    >
                        <option value="">Select Genre</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Romance">Romance</option>
                    </select>
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

            {books === null || books.length === 0 ? (
                <p>No books available</p>
            ) : (
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
                        {currentBooks.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.genre}</td>
                                <td>{book.averageRating?.toFixed(1) || 'N/A'}</td>
                                <td>
                                    <button className="btn view" onClick={() => handleView(book._id)}>
                                        View
                                    </button>
                                    <button className="btn edit" onClick={() => handleBookSelect(book, true)}>
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
            )}

            {/* Pagination Controls */}
            <div className="pagination">
                <button className="pagination-btn first" onClick={handleFirstPage}>
                    First
                </button>
                <button className="pagination-btn prev" onClick={handlePrevPage}>
                    Previous
                </button>
                <span className="page-number">
                    Page {currentPage} of {totalPages}
                </span>
                <button className="pagination-btn next" onClick={handleNextPage}>
                    Next
                </button>
                <button className="pagination-btn last" onClick={handleLastPage}>
                    Last
                </button>
            </div>

            {/* Modal for View/Edit */}
            {selectedBook && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEdit ? 'Edit Book' : 'View Book'}</h2>
                        <form onSubmit={isEdit ? handleEditSubmit : null}>
                            <input
                                type="text"
                                value={selectedBook.title}
                                onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                                disabled={!isEdit}
                                required
                            />
                            <input
                                type="text"
                                value={selectedBook.author}
                                onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                                disabled={!isEdit}
                                required
                            />
                            <select
                                value={selectedBook.genre}
                                onChange={(e) => setSelectedBook({ ...selectedBook, genre: e.target.value })}
                                disabled={!isEdit} // Disable when not in edit mode
                                required
                            >
                                <option value="">Select Genre</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Mystery">Mystery</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Science Fiction">Science Fiction</option>
                                <option value="Romance">Romance</option>
                            </select>
                            <textarea
                                value={selectedBook.summary}
                                onChange={(e) => setSelectedBook({ ...selectedBook, summary: e.target.value })}
                                disabled={!isEdit}
                                required
                            ></textarea>
                            {isEdit && (
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedBook({ ...selectedBook, coverImage: e.target.files[0] })}
                                    accept="image/*"
                                />
                            )}
                            {isEdit && (
                                <button type="submit" className="btn save">Save Changes</button>
                            )}
                        </form>
                        <button className="btn close" onClick={() => setSelectedBook(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHomePage;
