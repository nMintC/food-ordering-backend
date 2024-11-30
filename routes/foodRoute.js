import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
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

foodRouter.post("/add", (req, res, next) => {
  upload.single("image")(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    next();
  });
}, addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;