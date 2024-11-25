// back-end/controllers/userController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

const createToken = (id, email) =>
  jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// helper: chặn các biến thể gmail sai
function isBlockedGmailDomain(email) {
  try {
    const domain = String(email).split("@")[1]?.toLowerCase().trim();
    if (!domain) return false;
    // chặn mọi "gmail.*" khác "gmail.com"
    if (domain.startsWith("gmail.") && domain !== "gmail.com") return true;
    return false;
  } catch {
    return false;
  }
}

// POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    email = String(email).toLowerCase().trim();

    // validate chuẩn + chặn gmail.* sai
    if (!validator.isEmail(email) || isBlockedGmailDomain(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = createToken(user._id, user.email);
    return res.status(201).json({ success: true, token });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


