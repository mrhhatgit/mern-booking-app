import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import myHotelRoutes from './routes/my-hotels';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import hotelRoutes from "./routes/hotels";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if MongoDB connection string exists
const mongoUri = process.env.MONGODB_CONNECTION_STRING;
if (!mongoUri) {
    console.error("Error: MONGODB_CONNECTION_STRING is not defined in the environment variables.");
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB Atlas:", err);
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
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-hotels', myHotelRoutes);
app.use('/api/hotels', hotelRoutes);

// Catch-all route for serving the frontend
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
