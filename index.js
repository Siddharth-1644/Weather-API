require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const redis = require('redis');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Redis Client Setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Weather API is running!');
});

// Weather Route
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const cacheKey = `weather:${city}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data');
      return res.json(JSON.parse(cachedData));
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric`;

    console.log("API Key from .env:", apiKey);
    console.log("Constructed Request URL:", url);

    const response = await axios.get(url);
    const weatherData = response.data;

    await redisClient.setEx(cacheKey, 43200, JSON.stringify(weatherData)); // 12 hours cache
    console.log('Fetched new data from API and cached');

    res.json(weatherData);
  } catch (error) {
    console.error("Full error details:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Start server only after Redis is connected
async function startServer() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  } catch (err) {
    console.error(' Failed to connect to Redis:', err);
    process.exit(1);
  }
}

startServer();
