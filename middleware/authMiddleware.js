// back-end/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    // Lấy token từ header hoặc cookie 'token'
    const header = (req.headers.authorization || "").trim();
    const [scheme, cred] = header.split(/\s+/);
    const token = (scheme && scheme.toLowerCase() === "bearer" && cred) ? cred
      : (req.cookies?.token || null); // nếu bạn có dùng cookie-parser

    if (!token) {
      console.warn("Auth: missing token");
      return res.status(401).json({ success: false, message: "No token" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const payload = jwt.verify(token, secret); // sẽ throw nếu hết hạn hoặc sai

    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    const msg =
      err?.name === "TokenExpiredError" ? "Token expired"
        : err?.name === "JsonWebTokenError" ? "Invalid token"
          : "Unauthorized";
    console.warn("Auth error:", err?.name || err, "- url:", req.method, req.originalUrl);
    return res.status(401).json({ success: false, message: msg });
  }
}
