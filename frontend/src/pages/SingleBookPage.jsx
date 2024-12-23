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
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');

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
    if (!reviewAuthor.trim() || !reviewText.trim() || rating < 1 || rating > 5) {
      alert('Please provide valid input.');
      return;
    }
    try {
      const reviewData = { bookId: id, rating, reviewText };
      const response = await fetch('http://localhost:8081/addRatingReview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      const savedReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, savedReview]);
      setRating(5);
      setReviewAuthor('');
      setReviewText('');
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

  console.log(book.coverImage);

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
        <form onSubmit={handleReviewSubmit} className="review-form">
          <label>
            Name:
            <input
              type="text"
              placeholder="Your name"
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
            />
          </label>
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
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default SingleBookPage;
