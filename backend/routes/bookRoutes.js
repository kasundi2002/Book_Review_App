const express = require('express');
const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const multer = require('multer');
const upload = multer(); 
const router = express.Router();

// Routes for books

// http://localhost:8081/book/getAll
router.get('/getAll', getAllBooks); // Get all books

// http://localhost:8081/book/getOnebook/:id
router.get('/getOnebook/:id', getBookById); // Get a specific book by ID

// http://localhost:8081/book/addBook
router.post('/addBook', upload.single('coverImage'), addBook);

// http://localhost:8081/book/updateBook/${id}
router.put('/updateBook/:id', updateBook); // Update a book by ID

// http://localhost:8081/book/deleteBook/${id}
router.delete('/deleteBook/:id', deleteBook); // Delete a book by ID

module.exports = router;
