// back-end/controllers/orderController.js
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";

const stripeSecret = process.env.STRIPE_SECRET;
const stripeClient = stripeSecret ? new Stripe(stripeSecret) : null;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

// Place order and create Stripe Checkout session
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body || {};

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: "items must be a non-empty array" });
    }
    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "amount must be a positive number" });
    }
    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "address is required" });
    }

    // Save order to Database first
    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      amount,
      address
    });

    // Clear user's cart after placing order
    await User.findByIdAndUpdate(req.user.id, { $set: { cartData: {} } });

    // Create line_items for Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: String(item.name || "Item") },
        // Note: Stripe charges in cents (1$ = 100 cents)
        unit_amount: Math.round(Number(item.price) * 100)
      },
      quantity: Math.max(1, Number(item.quantity) || 1)
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(5 * 100)
      },
      quantity: 1
    });

    // If Stripe secret is not configured, return mock URL to test the flow
    if (!stripeClient) {
      return res.json({
        success: true,
        session_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}&mock=stripe`
      });
    }

    // Create Stripe payment session
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${newOrder._id}`
    });

    return res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: `Server error` });
  }
};

// Verify payment result from frontend (Simulated Webhook)
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body || {};
  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }
    if (String(success) === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed, order cancelled" });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User's order list (for Frontend)
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get ALL orders list (for Admin Panel)
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

