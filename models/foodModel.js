// back-end/models/foodModel.js
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.models.Food || mongoose.model("Food", foodSchema);
