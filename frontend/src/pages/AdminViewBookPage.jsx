import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/SingleBookPage.css';

const AdminViewBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
    
  useEffect(() => {
      // Fetching user profile
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem('token'); // Use localStorage for web
          if (token) {
            const response = await fetch(`http://localhost:8081/users/getUser`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log(`Inside single book ratings : ${data}`)
            setUserName(data.userName); // Set the user's name
            setUserId(data._id);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile();
    }, []);

  useEffect(() => {
    const fetchBookById = async () => {
      try {
        const response = await fetch(`http://localhost:8081/book/getOnebook/${id}`);
        if (!response.ok) throw new Error('Failed to fetch book by ID');
        const data = await response.json();
        if (data?._id) {
          setBook(data);
          setReviews(data.reviews || []);
        } else {
          setBook(null);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookById();
  }, [id]);


  if (loading) return <h2>Loading book data...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
  if (!book) return <h2>No book found with ID: {id}</h2>;

  const bookCoverSrc = book.coverImage?.data && book.coverImage?.contentType
    ? `data:${book.coverImage.contentType};base64,${book.coverImage.data}`
    : 'fallback_image_url_here';

  return (
    <div>
      <div className="item-detail-container">
        <img src={book.coverImage} alt={book.title} className="item-image" />
        <div className="item-details">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Summary:</strong> {book.summary}</p>
          <p><strong>Rating:</strong> {book.averageRating || 'N/A'} / 5</p>
        </div>
      </div>
 
    </div>
  );
};

export default AdminViewBookPage;
