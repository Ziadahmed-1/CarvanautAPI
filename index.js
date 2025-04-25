import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());

// You can also set up CORS options for more control (optional)
// Example: Allow only specific origins
// const corsOptions = {
//   origin: process.env.CLIENT_URL, // Allow only this domain
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specific methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
// };

// // Use the corsOptions in the middleware
// app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
