const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const connectDB = require('./config/db.js');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler.js');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const connectDB = require('./config/db.js');
const authRouter = require('./routes/auth.js');
const emailRouter = require('./routes/email');
const phoneRouter = require('./routes/phone');
const profileRoutes = require('./routes/profile');

const errorHandler = require('./middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 5005;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

connectDB();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3002',
  })
);
app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter);
app.use('/email', emailRouter);
app.use('/phone', phoneRouter);
app.use('/profile', profileRoutes);

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
