import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../models/book/BookModel.js";
import {
  newBookValidation,
  updateBookValidation,
} from "../middlewares/joiValidation.js";
import { adminAuth, userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const books = _id ? await getBookById(_id) : await getAllBooks();
    res.json({
      status: "success",
      message: "Here are the books",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//   private endpoints
router.post("/", userAuth, newBookValidation, async (req, res, next) => {
  try {
    if (req.userInfo.role !== "admin") {
      throw new Error("You do not have permission to this api");
    }

    const books = await createBook(req.body);

    books?._id
      ? res.json({
          status: "success",
          message: "New book has been added successfully!",
          books,
        })
      : res.json({
          status: "Error",
          message: "Unable to add New book, try again later",
          books,
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "There is another book with same ISBN. Please change the ISBN and try again!";
    }
    next(error);
  }
});

//   private endpoints
router.put("/", adminAuth, updateBookValidation, async (req, res, next) => {
  try {
    const book = await updateBookById(req.body);

    book?._id
      ? res.json({
          status: "success",
          message: "The book has been updated successfully!",
          book,
        })
      : res.json({
          status: "Error",
          message: "Unable to update the book, try again later",
        });
  } catch (error) {
    next(error);
  }
});

//   private endpoints
router.delete("/:_id", adminAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const book = await deleteBook(_id);

    book?._id
      ? res.json({
          status: "success",
          message: "The book has been deleted successfully!",
          book,
        })
      : res.json({
          status: "Error",
          message: "Unable to delete the book, try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
