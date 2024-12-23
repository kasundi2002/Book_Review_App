import React, { useState, useEffect } from 'react';
import '../css/CustomerHomePage.css';
import { Link } from 'react-router-dom';

const CustomerHomePage = () => {
  const [books, setBooks] = useState(null); // Null for loading state
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState(''); // State to store user name

  useEffect(() => {
    // Fetching user profile
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Use localStorage for web
        if (token) {
          const response = await fetch('http://localhost:5000/api/admin/residents/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUserName(data.userName); // Set the user's name
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetching book data
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8081/book/getAll');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          setError(false);
        } else {
          setBooks([]); // No books found
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(true);
        setBooks(null);
      }
    };

    fetchBooks();
  }, []);

  // Function to convert buffer data to Base64 string
  const convertBufferToBase64 = (bufferData) => {
    return btoa(
      new Uint8Array(bufferData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };

  if (books === null && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching books. Please try again later.</div>;
  }

  if (books.length === 0) {
    return <div>No books found.</div>;
  }

  return (
    <div className="product-grid">
      {books.map((book) => {
        let bookCoverSrc = 'https://via.placeholder.com/150'; // Fallback image

        // Handle cover image if present
        if (book.coverImage && book.coverImage.data) {
          const base64String = convertBufferToBase64(book.coverImage.data.data);
          bookCoverSrc = `data:${book.coverImage.contentType};base64,${base64String}`;
        }

        return (
          <div key={book._id} className="product-card">
            <img
              src={bookCoverSrc}
              alt={book.title || 'Book Cover'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150'; // Fallback image
              }}
            />
            <h4>{book.title || 'Untitled Book'}</h4>
            <p>Author: {book.author || 'Unknown Author'}</p>
            <p>Genre: {book.genre || 'Unknown Genre'}</p>
            <br />
            <Link
              to={`/books/${book._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="view-item-btn"
            >
              View Book
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerHomePage;
