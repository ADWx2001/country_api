import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Routes for the API
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("MongoDb is connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

// Start the server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000!");
  });
}

// API routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// For testing only
export default app;
