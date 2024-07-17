import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Middleware
app.use(
    cors({
      origin: 'http://localhost:3001',
    })
  );
  app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter);

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});