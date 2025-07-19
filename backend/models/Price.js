import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  token: String,
  network: String,
  timestamp: Number,
  price: Number,
});

export default mongoose.model("Price", priceSchema);
