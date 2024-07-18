const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const connectDB  = require ('./config/db.js');
const authRouter = require('./routes/auth');
const errorHandler = require ('./middleware/errorHandler.js');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const  connectDB=  require('./config/db.js') ;
const  authRouter= require('./routes/auth.js') ;
const  errorHandler= require('./middleware/errorHandler.js') ;
f
const app = express();
const PORT = process.env.PORT || 5005;

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

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});