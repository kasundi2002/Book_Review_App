import React, { useState, useEffect } from 'react';
import './CustomerHome.css';

const CustomerHomePage = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch books data from backend when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8081/book/getAll'); // replace with your backend API URL
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  const handleViewDetails = (bookId) => {
    // Logic for viewing book details (e.g., navigate to another page or open a modal)
    alert(`Viewing details for book ID: ${bookId}`);
  };

  const handleSubmitReview = (bookId, rating, comment) => {
    // Logic for submitting the review (e.g., send it to the backend)
    alert(`Review submitted for book ID: ${bookId}\nRating: ${rating}\nComment: ${comment}`);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="title">
          <h1>Best Selling Books</h1>
        </div>

        {error && <p>{error}</p>}

        <div className="product">
          <div className="product-container">
            {books.map((book) => (
              <div className="product-item" key={book.id}>
                <div className="product-img">
                  <img src={`${book.image}`} alt={book.title} />
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => handleViewDetails(book.id)}
                  >
                    View Details
                  </button>
                </div>

                <div className="product-content">
                  <a href="/viewBook" className="book-title">{book.title}</a>
                  <p className="author">by <span>{book.author}</span></p>
                  <div>
                    <ul className="rating">
                      {[...Array(5)].map((_, index) => (
                        <li key={index}>
                          <i
                            className={`fas fa-star ${index < Math.floor(book.rating) ? '' : 'empty-star'}`}
                          ></i>
                        </li>
                      ))}
                      {/* Ensure reviews is an array before accessing its length */}
                      <li>({Array.isArray(book.reviews) ? book.reviews.length : 0} review{book.reviews && book.reviews.length !== 1 ? 's' : ''})</li>
                    </ul>
                    <span className="price">${book.price}</span>
                  </div>
                </div>

                {/* Rating & Review Form */}
                <div className="review-section">
                  <div className="rating-stars">
                    <span>Rate this book:</span>
                    {[...Array(5)].map((_, index) => (
                      <label key={index}>
                        <input type="radio" name={`rating-${book.id}`} value={index + 1} />
                        <i className={`fas fa-star ${index < 4 ? '' : 'empty-star'}`}></i>
                      </label>
                    ))}
                  </div>
                  <textarea placeholder="Write a review..." id={`review-comment-${book.id}`} />
                  <button
                    className="submit-review-btn"
                    onClick={() => {
                      const comment = document.getElementById(`review-comment-${book.id}`).value;
                      const rating = document.querySelector(`input[name="rating-${book.id}"]:checked`)?.value;
                      if (rating && comment) {
                        handleSubmitReview(book.id, rating, comment);
                      } else {
                        alert('Please provide a rating and review comment');
                      }
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHomePage;
