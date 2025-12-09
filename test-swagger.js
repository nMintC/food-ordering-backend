import swaggerJsdoc from "swagger-jsdoc";
import swaggerConfig from "./swagger.config.js";

console.log("Testing Swagger configuration...");

try {
    const swaggerSpec = swaggerJsdoc(swaggerConfig);
    console.log("✅ Swagger spec generated successfully!");
    console.log(`Title: ${swaggerSpec.info.title}`);
    console.log(`Version: ${swaggerSpec.info.version}`);
    console.log(`Paths found: ${Object.keys(swaggerSpec.paths || {}).length}`);

    if (swaggerSpec.paths) {
        console.log("\nAPI Endpoints:");
        Object.keys(swaggerSpec.paths).forEach(path => {
            const methods = Object.keys(swaggerSpec.paths[path]);
            console.log(`  ${path}: ${methods.join(", ").toUpperCase()}`);
        });
    }

    console.log("\n✅ Swagger configuration is valid!");
} catch (error) {
    console.error("❌ Error generating Swagger spec:");
    console.error(error);
    process.exit(1);
}
