const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const consul = require('consul');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

const consulClient = new consul({
  host: config.consulHost,
  port: config.consulPort,
  promisify: true
});

const PORT = parseInt(process.env.PORT || '5001', 10);

app.listen(PORT, async () => {
  console.log(`Auth service running on port ${PORT}`);
  setTimeout(async () => {
  try {
    await consulClient.agent.service.register({
      name: 'auth-service',
      address: process.env.SERVICE_ADDRESS || 'auth-service',
      port: PORT,
      check: {
        http: `http://${process.env.SERVICE_ADDRESS || 'auth-service'}:${PORT}/health`,
        interval: '10s'
      }
    });
    console.log('Auth Service registered with Consul');
  } catch (err) {
    console.error('Auth Service Failed to register with Consul:', err);
  }
}, 15000); // 15 seconds delay
});



app.get('/health', (req, res) => res.status(200).send('OK'));