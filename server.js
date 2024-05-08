import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/MongoDb.js';

import authRoutes from './routes/auth.route.js'

/* import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js"; */
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();
connectDatabase()
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use('/test', (req, res) => {
    res.send("Seen")
})
// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});