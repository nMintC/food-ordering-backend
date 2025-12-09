// back-end/routes/orderRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRoute = express.Router();

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     tags: [Order]
 *     summary: Place new order
 *     description: Create a new order and initiate Stripe payment (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - amount
 *               - address
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Margherita Pizza
 *                     price:
 *                       type: number
 *                       example: 20
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               amount:
 *                 type: number
 *                 example: 40
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Order placed successfully, returns Stripe session URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 session_url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_...
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoute.post("/place", auth, placeOrder);

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     tags: [Order]
 *     summary: Verify payment result
 *     description: Verify order payment status after Stripe redirect
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - success
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               success:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Payment verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Paid
 *       400:
 *         description: Missing orderId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoute.post("/verify", verifyOrder);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     tags: [Order]
 *     summary: Get user's orders
 *     description: Retrieve all orders for the authenticated user (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoute.post("/userorders", auth, userOrders);

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     tags: [Order]
 *     summary: Get all orders (Admin)
 *     description: Retrieve all orders in the system (for admin panel)
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoute.get("/list", listOrders);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     tags: [Order]
 *     summary: Update order status (Admin)
 *     description: Update the delivery status of an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 example: Out for delivery
 *                 enum:
 *                   - Food pending
 *                   - Food preparing
 *                   - Out for delivery
 *                   - Delivered
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Status updated
 */
orderRoute.post("/status", updateStatus);

export default orderRoute;
