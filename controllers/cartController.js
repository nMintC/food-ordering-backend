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

// Remove 1 unit (or delete if <= 1)
export const removeFromCart = async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { foodId } = req.body || {};

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ success: false, message: "Invalid foodId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    if (!cart[foodId]) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    const nextQty = Number(cart[foodId]) - 1;
    if (nextQty <= 0) delete cart[foodId];
    else cart[foodId] = nextQty;

    await User.findByIdAndUpdate(userId, { $set: { cartData: cart } });
    return res.json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    console.error("Error removing from cart:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get cart; optionally expand to full food details
export const getCart = async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};

    // if you want expanded items with details:
    const ids = Object.keys(cart);
    let items = [];
    if (ids.length) {
      const foods = await Food.find({ _id: { $in: ids } }).lean();
      const byId = Object.fromEntries(foods.map(f => [String(f._id), f]));
      items = ids.map(fid => ({
        foodId: fid,
        qty: cart[fid],
        food: byId[fid] ? {
          _id: byId[fid]._id,
          name: byId[fid].name,
          price: byId[fid].price,
          imageUrl: `${req.protocol}://${req.get("host")}/image/${byId[fid].image}`,
          category: byId[fid].category
        } : null
      }));
    }

    return res.json({ success: true, cart, items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};