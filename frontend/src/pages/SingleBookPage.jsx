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
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');

  // Fetching user profile
  useEffect(() => {
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
          setUserName(data.userName); // Set the user's name
          setUserId(data._id); // Set userId
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch book details by ID
  useEffect(() => {
    const fetchBookById = async () => {
      try {
        const response = await fetch(`http://localhost:8081/book/getOnebook/${id}`);
        if (!response.ok) throw new Error('Failed to fetch book by ID');
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookById();
  }, [id]);

  // Fetch reviews by bookId and calculate average rating
  useEffect(() => {
    const fetchReviewsByBookId = async () => {
      try {
        const response = await fetch(`http://localhost:8081/ratingReviews/reviews/book/${id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews for this book');
        const data = await response.json();
        setReviews(data); // Update the reviews state

        // Calculate the average rating from the reviews
        if (data.length > 0) {
          const totalRatings = data.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRatings / data.length;
          setRating(averageRating.toFixed(1));  // Set average rating to state with 1 decimal place
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
      }
    };
    fetchReviewsByBookId();
  }, [id]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
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

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/ratingReviews/reviews', {
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
      setReviews((prevReviews) => [...prevReviews, savedReview.newRating]);
      setReviewText('');  // Reset review text

      // Recalculate average rating after adding new review
      const totalRatings = [...reviews, savedReview.newRating].reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRatings / (reviews.length + 1);
      setRating(averageRating.toFixed(1)); // Update the rating on the frontend

    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found!');
        return;
      }

      const response = await fetch(`http://localhost:8081/ratingReviews/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to delete review:', response);
        throw new Error('Failed to delete review');
      }

      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));

      // Recalculate average rating after deleting a review
      const totalRatings = reviews.filter((review) => review._id !== reviewId).reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRatings / (reviews.length - 1);
      setRating(averageRating.toFixed(1)); // Update the rating on the frontend

    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Handle review update (Edit)
  const handleEditReview = (review) => {
    setEditReviewId(review._id);
    setEditRating(review.rating);
    setEditText(review.reviewText);
  };

  // Handle the actual submission of the edited review
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editText.trim() || editRating < 1 || editRating > 5) {
      alert('Please provide valid input.');
      return;
    }

    try {
      const updatedReview = {
        rating: editRating,
        reviewText: editText,
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/ratingReviews/reviews/${editReviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      const savedUpdatedReview = await response.json();
      setReviews((prevReviews) => prevReviews.map((review) =>
        review._id === savedUpdatedReview._id ? savedUpdatedReview : review
      ));

      // Recalculate the average rating after editing
      const totalRatings = reviews.reduce(
        (sum, review) => sum + (review._id === savedUpdatedReview._id ? savedUpdatedReview.rating : review.rating),
        0
      );
      const averageRating = totalRatings / reviews.length;
      setRating(averageRating.toFixed(1)); // Update the rating on the frontend

      setEditReviewId(null); // Reset edit mode
      setEditRating(5);
      setEditText('');
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  if (loading) return <h2>Loading book data...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
  if (!book) return <h2>No book found with ID: {id}</h2>;

  return (
    <div>
      <div className="item-detail-container">
        <img src={book.coverImage} alt={book.title} className="item-image" />
        <div className="item-details">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Summary:</strong> {book.summary}</p>
          <p><strong>Rating:</strong> {rating || 'N/A'} / 5</p>
        </div>
      </div>

      <div className="review-section">
        <h1>Reviews</h1>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
            
              <p>{review.reviewText}</p>
              <p>{review.text}</p>
              {/* Edit button visible only if the logged-in user is the author of the review */}
              {String(review.userId) === String(userId) && (
                <button onClick={() => handleEditReview(review)}style={editButtonStyle}>Edit</button>
              )}
              {/* Delete button visible only if the logged-in user is the author of the review */}
              {String(review.userId) === String(userId) && (
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
        <h1>Add a Review</h1>
        <form className="review-form">
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
          <button type="button" onClick={handleReviewSubmit}>Submit Review</button>
        </form>

        {/* Edit review form */}
        {editReviewId && (
          <form onSubmit={handleEditSubmit}>
            <label>
              Rating (1-5):
              <input
                type="number"
                min="1"
                max="5"
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
              />
            </label>
            <label>
              Review:
              <textarea
                placeholder="Edit your review..."
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </label>
            <button type="submit">Update Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

const deleteButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
  borderRadius: '4px',
  marginTop: '10px',
  fontSize: '14px',
};
const editButtonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
  borderRadius: '4px',
  marginTop: '10px',
  margin:'5px',
  fontSize: '14px',
};
export default SingleBookPage;