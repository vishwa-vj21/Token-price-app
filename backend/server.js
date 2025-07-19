import dotenv from "dotenv";
dotenv.config();

console.log(process.env);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import priceRoutes from "./routes/price.js";
import "./jobs/fetchPrices.js";

// console.log("UPSTASH_REDIS_URL =", process.env.UPSTASH_REDIS_URL);
// console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY);
// console.log

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

app.use("/api/price", priceRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
