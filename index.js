import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow your local dev URL
  methods: "GET, POST, PUT, DELETE, OPTIONS", // Allow methods for CORS
  allowedHeaders: "Content-Type, Authorization", // Specify allowed headers
  preflightContinue: false, // Don't pass the OPTIONS request to other handlers
  optionsSuccessStatus: 204, // Some browsers (like IE11) require a 204 status for OPTIONS
};

app.use(cors(corsOptions));

// Middleware to handle the OPTIONS request correctly
app.options("*", cors(corsOptions)); // This handles preflight requests

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
