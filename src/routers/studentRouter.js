import express from "express";
import { getAllStudents } from "../models/user/UserModel.js";

const router = express.Router();

// get students
router.get("/", async (req, res, next) => {
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

export default router;
