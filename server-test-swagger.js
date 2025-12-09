// Temporary server for testing Swagger UI without database
import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swagger.config.js";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS setup
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerConfig);

console.log("✅ Swagger spec generated!");
console.log(`   Endpoints: ${Object.keys(swaggerSpec.paths || {}).length}`);

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

app.get("/", (_req, res) => res.send("Swagger Test Server - Visit /api-docs"));

app.listen(PORT, () => {
    console.log(`\n🚀 Server started on http://localhost:${PORT}`);
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`📄 JSON spec: http://localhost:${PORT}/swagger/v1/swagger.json\n`);
});
