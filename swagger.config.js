// Swagger Configuration for Food Ordering Backend API
export default {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Ordering Backend API",
            version: "1.0.0",
            description: "Complete REST API for food ordering system with user authentication, cart management, and order processing",
            contact: {
                name: "API Support"
            }
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "Local Development Server"
            },
            {
                url: "https://food-delivery-frontend-opal.vercel.app",
                description: "Production Frontend"
            }
        ],
        components: {
            schemas: {
                Food: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                        name: { type: "string", example: "Margherita Pizza" },
                        description: { type: "string", example: "Fresh tomatoes, mozzarella, basil" },
                        price: { type: "number", example: 12.99 },
                        image: { type: "string", example: "food-delivery-app/pizza-123.jpg" },
                        category: { type: "string", example: "Pizza" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@gmail.com" },
                        role: { type: "string", example: "user" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                Order: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                        userId: { type: "string", example: "507f1f77bcf86cd799439011" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string", example: "Margherita Pizza" },
                                    price: { type: "number", example: 12.99 },
                                    quantity: { type: "number", example: 2 }
                                }
                            }
                        },
                        amount: { type: "number", example: 45.99 },
                        address: { $ref: "#/components/schemas/Address" },
                        status: { type: "string", example: "Food pending" },
                        payment: { type: "boolean", example: false },
                        date: { type: "string", format: "date-time" }
                    }
                },
                Address: {
                    type: "object",
                    properties: {
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        street: { type: "string", example: "123 Main St" },
                        city: { type: "string", example: "New York" },
                        state: { type: "string", example: "NY" },
                        zipcode: { type: "string", example: "10001" },
                        country: { type: "string", example: "USA" },
                        phone: { type: "string", example: "+1234567890" }
                    }
                },
                CartItem: {
                    type: "object",
                    properties: {
                        foodId: { type: "string", example: "507f1f77bcf86cd799439011" },
                        qty: { type: "number", example: 2 },
                        food: { $ref: "#/components/schemas/Food" }
                    }
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Operation successful" },
                        data: { type: "object" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error message" }
                    }
                }
            }
        },
        tags: [
            { name: "Food", description: "Food management endpoints" },
            { name: "User", description: "User authentication endpoints" },
            { name: "Cart", description: "Shopping cart endpoints (requires auth)" },
            { name: "Order", description: "Order management endpoints" }
        ]
    },
    apis: [
        "./routes/*.js",
        "./routes/**/*.js"
    ]
};
