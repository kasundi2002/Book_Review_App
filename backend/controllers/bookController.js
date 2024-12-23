const Book = require('../models/bookModel');

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        const populatedBooks = await Book.populate(books, { path: 'RatingsAndReviews' });
        res.status(200).json(populatedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Convert image to base64 string (optional)
        const bookWithImage = {
            ...book._doc,
            coverImage: `data:${book.coverImage.contentType};base64,${book.coverImage.data.toString('base64')}`,
        };

        res.status(200).json(bookWithImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new book with cover image
const addBook = async (req, res) => {
    try {
        const { title, author, genre, summary } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Cover image is required' });
        }

        const newBook = new Book({
            title,
            author,
            genre,
            summary,
            coverImage: {
                data: req.file.buffer, // Binary data from multer
                contentType: req.file.mimetype, // MIME type (e.g., image/jpeg)
            },
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a book
const updateBook = async (req, res) => {
    try {
        const { title, author, genre, summary } = req.body;
        console.log(`Inside update book: ${title} , ${author} , ${genre} ${summary}`);
        const bookId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update fields if provided in the request
        if (title) book.title = title;
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (summary) book.summary = summary;

        // Check if a new cover image is provided
        if (req.file) {
            book.coverImage = {
                data: req.file.buffer, // Binary data from multer
                contentType: req.file.mimetype, // MIME type (e.g., image/jpeg)
            };
        }

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a book
const deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
