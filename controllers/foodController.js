import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";

// ADD
export const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const { name, description, price, category } = req.body;

    const doc = new foodModel({
      name,
      description,
      price: Number(price),
      image: req.file.path,
      category,
    });

    const saved = await doc.save();

    return res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: saved
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to add food item" });
  }
};

// LIST
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}).sort({ createdAt: -1 });

    return res.json({ success: true, data: foods });

  } catch (error) {
    console.error("Error fetching food list:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch food list" });
  }
};

// REMOVE
export const removeFood = async (req, res) => {
  try {
    const id = req.body?.id || req.query?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const doc = await foodModel.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await doc.deleteOne();

    return res.json({ success: true, message: "Food removed" });

  } catch (error) {
    console.error("Remove error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove food" });
  }
};