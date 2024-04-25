
const express = require("express");
const router = express.Router();

const {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    filterBooks
} = require("../controllers/book");

const { auth, isAdmin, isVisitor } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Admin Intraction
// ********************************************************************************************************

router.route("/addBook").post( auth, isAdmin, addBook );

router.route("/updateBook/:title").put( auth, isAdmin, updateBook );

router.route("/deleteBook/:title").delete(auth , isAdmin, deleteBook);



// ********************************************************************************************************
//                                      Visiter Intraction
// ********************************************************************************************************


router.route("/filterBooks").get(auth , isVisitor, filterBooks);

router.route("/getAllBooks").get(auth , isVisitor, getAllBooks );


module.exports = router;
