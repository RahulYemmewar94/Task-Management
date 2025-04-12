import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import api from "./routes/index.js";
import { verifyToken } from "./middlewares/authMiddleware.js";

dotenv.config();

mongoose.connect(
  process.env.MONGODB_PATH,
  () => {
    console.log("MongoDB Connected");
  },
  (e) => console.log("MongoDB Connection Error:", e)
);

const app = express();

const PORT = process.env.SERVER_PORT || 6001;

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(verifyToken);
app.use(api);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
