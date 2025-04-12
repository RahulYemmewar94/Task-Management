import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import connectToDatabase from "./config/database.js";
import jwtAuthMiddleware from "./middleware/jwtmiddleware.js";

dotenv.config();
connectToDatabase();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
