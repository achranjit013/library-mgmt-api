import express from "express";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { createUser, getUserByEmail } from "../models/user/UserModel.js";
import {
  loginValidation,
  newUserValidation,
} from "../middlewares/joiValidation.js";
import { signJWTs } from "../utils/jwtHelper.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// creates new user
router.post("/", async (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "to do post user",
    });
  } catch (error) {
    next(error);
  }
});

// login
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (user?._id) {
      const isMatched = comparePassword(password, user.password);

      if (isMatched) {
        // jwts
        const jwts = signJWTs(user.email);

        return res.json({
          status: "success",
          message: "Login successful",
          jwts,
        });
      }
    }

    res.json({
      status: "error",
      message:
        "Sorry!!! unable to login. Please try again with correct credentials",
    });
  } catch (error) {
    next(error);
  }
});

//  below this should be private
// ------------------------------
// creates new admin
router.post("/admin-user", newUserValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.password = hashPassword(req.body.password);
    req.body.role = "admin";
    const user = await createUser(req.body);

    if (user?._id) {
      return res.json({
        status: "success",
        message: "Congratulations!!! Your account has been created.",
      });
    }

    res.json({
      status: "error",
      message:
        "Sorry!!! We are unable to create your account. Please try again later or contact admin.",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "There is already an user with this email. Please try again with  new email.";
      error.errorCode = 200;
    }
    next(error);
  }
});

// get user info
router.get("/", userAuth, (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "here is the user info",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
