import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleBookPage.css'; // Link the CSS file

const SingleBookPage = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch book details from the backend
        fetch(`http://localhost:8081/book/getOneBook/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setBook(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching book details:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="loading">Loading book details...</div>;
    }

    if (!book) {
        return <div className="error">Book not found.</div>;
    }

    return (
        <div className="book-details">
            <h1>{book.title}</h1>
            <h2>Author: {book.author}</h2>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Publication Year:</strong> {book.publicationYear}</p>
            <p className="description"><strong>Description:</strong> {book.summary}</p>
            <p className="ratings"><strong>Average Rating:</strong> {book.averageRating}</p>
            <p className="reviews"><strong>Review:</strong> {book.summary}</p>
            <button
                className="go-back-button"
                onClick={() => window.history.back()}
            >
                Go Back
            </button>
        </div>
    );
};

export default SingleBookPage;

