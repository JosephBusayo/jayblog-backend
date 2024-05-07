import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/MongoDb.js';



dotenv.config();
connectDatabase()
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});