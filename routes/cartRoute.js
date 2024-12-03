// back-end/routes/cartRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", auth, addToCart);
cartRouter.post("/remove", auth, removeFromCart);
cartRouter.get("/", auth, getCart);      // GET /api/cart

export default cartRouter;
