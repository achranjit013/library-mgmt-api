import express from "express";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  createUser,
  getAllStudents,
  getUserByEmail,
  updateRefreshJWT,
} from "../models/user/UserModel.js";
import {
  loginValidation,
  newUserValidation,
} from "../middlewares/joiValidation.js";
import { signJWTs } from "../utils/jwtHelper.js";
import {
  userAuth,
  refreshAuth,
  adminAuth,
} from "../middlewares/authMiddleware.js";
import { deleteSession } from "../models/session/SessionModel.js";

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

// logout
router.post("/logout", async (req, res, next) => {
  try {
    const { accessJWT, email } = req.body;

    // remove from session table
    accessJWT && (await deleteSession({ token: accessJWT }));

    // remove from user table
    email && (await updateRefreshJWT(email, ""));

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

// get students
router.get("/all-students", adminAuth, async (req, res, next) => {
  try {
    const students = await getAllStudents({ role: "student" });

    res.json({
      status: "success",
      message: "Here are the students",
      students,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/get-accessjwt", refreshAuth);

export default router;
