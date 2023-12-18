import express from "express";
import {
  createBurrow,
  getManyBurrow,
  updateBurrow,
} from "../models/burrow/BurrowModel.js";
import { newBurrowValidation } from "../middlewares/joiValidation.js";
import { updateBookById } from "../models/book/BookModel.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { role, _id } = req.userInfo;

    // if admin, return all burrow history
    // if not admin, return only user burrow histopry acc. to their id
    const burrow =
      role === "admin"
        ? await getManyBurrow({})
        : await getManyBurrow({ userId: _id });

    res.json({
      status: "success",
      mesage: "here is the burrow history",
      burrow,
    });
  } catch (error) {
    next(error);
  }
});

// get burrow history of logged user
router.get("/my-books", async (req, res, next) => {
  try {
    const { _id } = req.userInfo;

    const burrow = await getManyBurrow({ userId: _id });

    res.json({
      status: "success",
      mesage: "here is the burrow history",
      burrow,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", newBurrowValidation, async (req, res, next) => {
  try {
    const numberOfdaysToReturn = 15;
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + numberOfdaysToReturn);
    const result = await createBurrow({ ...req.body, dueDate });

    if (result?._id) {
      await updateBookById({
        _id: req.body.bookId,
        isAvailable: false,
        dueDate,
      });

      return res.json({
        status: "success",
        mesage:
          "You have successfully burrowed the book, you can check your burrow history to find this transaction",
      });
    }

    res.json({
      status: "error",
      message: "Unable to burrow the book, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

// update
router.patch("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { user } = req.userInfo;

    const filter = { _id, user };
    // update burrow table
    const burrowUpdate = {
      isReturned: true,
      returnDate: Date(),
    };
    console.log(burrowUpdate);

    const result = await updateBurrow(filter, burrowUpdate);
    if (result?._id) {
      // update book table
      const updateBook = {
        _id: result.bookId,
        isAvailable: true,
        dueDate: null,
      };

      await updateBookById(updateBook);

      return res.json({
        status: "success",
        message: "Return success, congratulations!",
      });
    }

    return res.json({
      status: "error",
      message: "Return failed, please try again later!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
