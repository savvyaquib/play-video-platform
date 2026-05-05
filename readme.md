# VideoHub

VideoHub is a comprehensive video streaming backend API inspired by YouTube. It provides a robust set of features for video management, user interactions, and content discovery.

## 🚀 Features

- **User Authentication**: Secure signup, login, and logout functionalities with JWT.
- **Video Management**: Upload, update, delete, and fetch videos. Integrated with Cloudinary for media storage.
- **Interactions**: Like and comment on videos, tweets, and comments.
- **Subscriptions**: Subscribe to channels and manage your subscription feed.
- **Playlists**: Create and manage custom playlists for organizing videos with full CRUD operations.
- **Tweets/Community**: Create text posts (tweets) for channel communities.
- **Dashboard**: Channel analytics and statistics for content creators (total views, subscribers, videos, and likes).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer & Cloudinary
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure necessary variables (MongoDB URI, Port, CORS origin, Cloudinary credentials, JWT secrets, etc.).
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🧪 API Testing

A complete Postman collection is included in the project root for testing all API routes.

- **Postman Collection**: [`videoHub.postman_collection.json`](./postman/videoHub.postman_collection.json)

You can import this file directly into Postman to test all available endpoints, including authentication, video uploads, and CRUD operations for playlists, comments, likes, subscriptions, and tweets.

## 📝 License

This project is licensed under the ISC License.
