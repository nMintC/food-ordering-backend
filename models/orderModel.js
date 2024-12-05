// back-end/models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // ref "user" khớp userModel
  items: { type: Array, required: true },    // [{ name, price, quantity }]
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food pending" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
