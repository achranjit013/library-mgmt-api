import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 8000;

// db connection
import { connectDB } from "./src/config/dbConfig.js";
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// api endpoints
import userRouter from "./src/routers/userRouter.js";
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.json({
    status: "succes",
    message: "server is running well",
  });
});

app.use("*", (req, res, next) => {
  const error = {
    message: "404 page not found",
    errorCode: 404,
  };
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });
  next(error);
});

app.listen(PORT, (error) => {
  error
    ? console.log(error.message)
    : console.log(`Server is running at http://localhost:${PORT}`);
});
