Food Ordering Website 🍅

A full-stack food ordering application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to browse menus, manage their cart, and place orders seamlessly, while providing administrators with a dashboard to manage food inventory and order statuses.

## 🚀 Features

- **User Authentication:** Secure login and registration.
- **Food Catalog:** Browse diverse food categories and detailed items.
- **Shopping Cart:** Real-time cart management.
- **Order System:** Secure checkout with Stripe integration.
- **Admin Panel:** Manage food items (Add/List/Remove) and update order status.

## 🛠️ Technology Stack

- **Frontend:** ReactJS, Vite, Context API, CSS Modules.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas.
- **Authentication:** JWT (JSON Web Token).
- **Payment Gateway:** Stripe.
- **Image Storage:** Cloudinary.

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nMintC/food-ordering-backend.git
   cd food-ordering-backend
   ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    CLOUDINARY_API_KEY=your_key
    ```

4.  **Run the Server**

    ```bash
    npm run dev
    ```

## 📝 API Endpoints

### 👤 User Authentication
- `POST /api/user/register` - Register a new user account
- `POST /api/user/login` - Login user & generate Token

### 🍔 Food Management
- `GET /api/food/list` - Fetch all food items
- `POST /api/food/add` - Upload and add a new food item (Admin)
- `POST /api/food/remove` - Remove a food item (Admin)

### 🛒 Cart Operations
- `GET /api/cart` - Retrieve current user's shopping cart
- `POST /api/cart/add` - Add an item to the cart
- `POST /api/cart/remove` - Decrease quantity or remove an item

### 📦 Order System
- `POST /api/order/place` - Place a new order & Create Stripe session
- `POST /api/order/verify` - Webhook to verify payment status
- `POST /api/order/userorders` - Get order history for the logged-in user
- `GET /api/order/list` - List all orders for the dashboard (Admin)
- `POST /api/order/status` - Update order delivery status (Admin)

## 👤 Author

Developed by **NGUYEN MINH CUONG** as part of the Web Application Development course.
