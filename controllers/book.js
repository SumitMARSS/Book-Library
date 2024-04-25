const Book = require('../models/book');
const User = require("../models/user");

//tested -> running
// Add a new book
const addBook = async (req, res) => {
    try {

        const {title, author, publication } = req.body;

        //validate
        if( !title || !author || !publication ){
            return res.status(402).json({
                success:false,
                message:`Please fill all mendatary details`,
            })
        }

        //create instances of objects 
        const book = new Book({
            title: title,
            author: author,
            publication: publication
        });

        //save book entry
        const savedBook = await book.save();

        //find user and add new book to user/author dashboard
        const userId = req.user.id;
        //add book details into user
        await User.findByIdAndUpdate(
            {_id:userId},
            {
                $push:{
                    books:savedBook._id,
                }
            },{new:true},
        );

        return res.status(200).json({
            success:true,
            message:'Book added successfully',
            book:savedBook,
        })
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Error while adding book, please try later',
            error:err,
        })
    }
};

// tested -> running

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        return res.status(200).json({
            success:true,
            message:'All books fetched successfully',
            data:books,
        })

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Error while fetching for all books, please try later',
            error:err,
        })
    }
};


// tested - running properly
// Update a book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findOne({ title: req.params.title });
        if (!book) {
            // return res.status(404).json({ message: 'Book not found' });
            return res.status(404).json({
                success:false,
                message:'Book not found, Please enter correct title',
            })
        }
        //either keep previous data or fill new entered data
        book.author = req.body.author || book.author;
        book.publication = req.body.publication || book.publication;
        
        //save in db
        const updatedBook = await book.save();
        
        res.status(200).json({
            success:true,
            book:updatedBook,
            message:'Book updated successfully',
        })

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Error while updating book, please try later',
            error:err,
        })
    }
};

// tested - running properly
// Delete a book
const deleteBook = async (req, res) => {
    try {

        const book = await Book.findOneAndDelete({ title: req.params.title });
        
        if (!book) {
            return res.status(404).json({
                success:false,
                message: 'Book not found',
            });
        }

        // Remove the book ID from the user's dashboard
        const userId = req.user.id;
        await User.findByIdAndUpdate(
            {_id: userId},
            {$pull: {books: book._id}},
            {new: true}
        );

        res.status(200).json({
            success:true,
            message: 'Book deleted successfully',
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Error while deleting book, please try later',
            error:err,
        })
    }
};

// tested - running properly

// Filter books by author or publication year
const filterBooks = async (req, res) => {
    try {
        let filter = {};
        //if given either author name or publication store in filtre
        if (req.query.author) {
            filter.author = req.query.author;
        }
        if (req.query.publication) {
            filter.publication = req.query.publication;
        }

        if(!filter){
            return res.status(402).json({
                success:false,
                message:'Please fill all mendatory details',
            })
        }
        //find all books
        const books = await Book.find(filter);
        res.json({
            success:true,
            books:books,
            message:"Book filtered successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Error while filtering book, please try later',
            error:err,
        })
    }
};

// tested - running properly

module.exports = {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    filterBooks
};
