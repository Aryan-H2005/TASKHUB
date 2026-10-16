import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

const allowedOrigins = ["https://taskhub-ry7r.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header, such as Postman
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Keep your existing route paths
app.use("/", authRoutes);
app.use("/api/tasks", taskRoutes);

// Keep your existing error handlers
app.use(notFound);
app.use(errorHandler);

// Keep your existing database connection and server startup
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
