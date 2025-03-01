import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";
import path from 'path';

// Load environment variables
dotenv.config();

// Check if MongoDB connection string exists
const mongoUri = process.env.MONGODB_CONNECTION_STRING;
if (!mongoUri) {
    console.error("Error: MONGODB_CONNECTION_STRING is not defined in the environment variables.");
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB Atlas", err);
        process.exit(1);
    });

const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Serve frontend (React/Vue/Next.js build)
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server
app.listen(8000, () => {
    console.log("Server is running on localhost:8000");
});
