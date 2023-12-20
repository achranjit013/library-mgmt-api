import express from "express";
import {
  createReview,
  getManyReview,
  updateReview,
} from "../models/review/ReviewModel.js";
import { newReviewValidation } from "../middlewares/joiValidation.js";
import { adminAuth, userAuth } from "../middlewares/authMiddleware.js";
import { updateBurrow } from "../models/burrow/BurrowModel.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // if admin, return all review history
    // if not admin, return only user review histopry acc. to their id
    const reviews = await getManyReview();

    res.json({
      status: "success",
      mesage: "here is the review history",
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", userAuth, newReviewValidation, async (req, res, next) => {
  try {
    const userId = req.userInfo._id;
    const result = await createReview({ ...req.body, userId });

    if (result?._id) {
      // update burrow table with review id
      await updateBurrow(
        { _id: req.body.burrowHistoryId },
        { reviewGiven: result._id }
      );

      return res.json({
        status: "success",
        mesage: "You have successfully reviewed the book. Thank you!",
      });
    }

    res.json({
      status: "error",
      message: "Unable to process your review, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

// update
router.patch("/:_id?", adminAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const status = req.body;
    if (["active", "inactive"].includes(status)) {
      const result = await updateReview({ _id }, { status });

      if (result?._id) {
        return res.json({
          status: "success",
          message: "Return success, congratulations!",
        });
      }
    }

    return res.json({
      status: "error",
      message: "failed, sorry!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
