// API Configuration
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swagger.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Tạo danh sách các domain được phép gọi API (Whitelist)
const whitelist = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://food-delivery-frontend-opal.vercel.app",
  "https://food-delivery-admin-fawn.vercel.app"
];

// Cấu hình chi tiết
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép các request không có origin (như Postman, Server-to-Server) hoặc nằm trong whitelist
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Can not access because of CORS Error'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Các method được phép
  credentials: true, // Cho phép gửi cookie/token nếu cần
  allowedHeaders: ["Content-Type", "Authorization"] // Các header được phép
};

// log gọn mỗi request
app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

// static uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// parsers PHẢI trước routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON payload" });
  }
  next();
});

// db
connectDB();

console.log("Stripe key prefix:", process.env.STRIPE_SECRET?.slice(0, 7));

// routes
app.use("/image", express.static(uploadDir));
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoute);

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    docExpansion: 'list',
    persistAuthorization: false,
    displayOperationId: false,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1
  }
}));

// Swagger JSON spec endpoint
app.get("/swagger/v1/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (_req, res) => res.send("API working"));

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
