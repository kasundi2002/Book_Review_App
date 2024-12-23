const express = require('express');
const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const upload = require('../middleware/multer');
const router = express.Router();

// Routes for books
router.get('/getAll', getAllBooks); // Get all books
router.get('/getOnebook/:id', getBookById); // Get a specific book by ID
router.post('/', upload.single('coverImage'), addBook);
router.put('/updateBook/:id', updateBook); // Update a book by ID
router.delete('/deleteBook/:id', deleteBook); // Delete a book by ID

module.exports = router;
