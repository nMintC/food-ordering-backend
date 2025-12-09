import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'food-delivery-app',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     tags: [Food]
 *     summary: Add new food item (Admin)
 *     description: Upload a new food item with image to the database
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Margherita Pizza
 *               description:
 *                 type: string
 *                 example: Fresh tomatoes, mozzarella, and basil
 *               price:
 *                 type: number
 *                 example: 15
 *               category:
 *                 type: string
 *                 example: Pizza
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Food item added successfully
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
 *                   example: Food item added successfully
 *                 data:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Bad request - Missing image or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
foodRouter.post("/add", (req, res, next) => {
  upload.single("image")(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    next();
  });
}, addFood);

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     tags: [Food]
 *     summary: Get all food items
 *     description: Retrieve a list of all available food items
 *     responses:
 *       200:
 *         description: List of food items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
foodRouter.get("/list", listFood);

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     tags: [Food]
 *     summary: Remove food item by ID
 *     description: Delete a food item from the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Food item removed successfully
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
 *                   example: Food removed
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
foodRouter.post("/remove", removeFood);

export default foodRouter;