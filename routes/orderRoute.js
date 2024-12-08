// back-end/routes/orderRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/place", auth, placeOrder);
orderRoute.post("/verify", verifyOrder); // có thể để không cần auth tùy flow
orderRoute.post("/userorders", auth, userOrders); // user order for frontend
orderRoute.get("/list", listOrders); // listing orders for admin
orderRoute.post("/status", updateStatus);

export default orderRoute;
