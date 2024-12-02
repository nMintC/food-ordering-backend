// back-end/controllers/cartController.js
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Food from "../models/foodModel.js";

// Add item to cart: cartData is a map { [foodId]: qty }
export const addToCart = async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { foodId } = req.body || {};

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ success: false, message: "Invalid foodId" });
    }

    // optional: ensure food exists
    const exists = await Food.exists({ _id: foodId });
    if (!exists) return res.status(404).json({ success: false, message: "Food not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    const current = Number(cart[foodId] || 0);
    cart[foodId] = current + 1;

    await User.findByIdAndUpdate(userId, { $set: { cartData: cart } });
    return res.json({ success: true, message: "Item added to cart", cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};