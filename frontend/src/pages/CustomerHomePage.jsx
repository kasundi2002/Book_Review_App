import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';
import '../css/CustomerHomePage.css';

const CustomerHomePage = () => {
  const { id } = useParams();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:8081/users/getUser`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUserName(data.name);
          setUserId(data._id);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8081/book/getAll');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          setError(false);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(true);
        setBooks(null);
      }
    };

    fetchBooks();
  }, []);

  const convertBufferToBase64 = (bufferData) => {
    return btoa(
      new Uint8Array(bufferData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };

  if (books === null && !error) return <div>Loading...</div>;
  if (error) return <div>Error fetching books. Please try again later.</div>;
  if (books.length === 0) return <div>No books found.</div>;

  return (
    <div>
      <Navbar userName={userName} />
      <div className="content">
        <div className="product-grid">
          {books.map((book) => {
            let bookCoverSrc = 'https://via.placeholder.com/150';
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
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <h4>{book.title || 'Untitled Book'}</h4>
                <p>Author: {book.author || 'Unknown Author'}</p>
                <p>Genre: {book.genre || 'Unknown Genre'}</p>
                <br />
                <Link
                  to={`/books/${book._id}`}
                  className="view-item-btn"
                >
                  View Book
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerHomePage;
