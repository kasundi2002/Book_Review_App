import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/SingleBookPage.css';

const SingleBookPage = () => {
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log(`Inside handleReview`);

    if (!reviewText.trim() || rating < 1 || rating > 5) {
      alert('Please provide valid input.');
      return;
    }

    try {
      
      const reviewData = {
        bookId: id,
        userId: userId,
        rating: rating,
        reviewText: reviewText,
      };
      console.log(`userId:${userId} , bookId:${id} , rating:${rating} , reviewText:${reviewText}`);

      console.log(reviewData);
      const token = localStorage.getItem('token');
      // Sending the review data to the backend
      const response = await fetch('http://localhost:8081/ratingReviews/addRatingReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,  // Pass token in the Authorization header
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const savedReview = await response.json();

      // Update reviews state with the newly added review
      setReviews((prevReviews) => [...prevReviews, savedReview.newRating]);
      setRating(5);  // Reset rating
      setReviewText('');  // Reset review text

    } catch (error) {
      console.error('Error posting review:', error);
    }
  };


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
      <div className="review-section">
        <h1>Reviews</h1>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p><strong>{review.author || 'Anonymous'}</strong> — {review.rating}/5</p>
              <p>{review.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
        <h1>Add a Review</h1>
        <form className="review-form">
          {/* <label>
            Name:${userName}
          </label> */}
          <label>
            Rating (1-5):
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </label>
          <label>
            Review:
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </label>
          <button type="button"  onClick={handleReviewSubmit}>Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default SingleBookPage;
