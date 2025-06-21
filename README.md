# Weather-API
A simple Node.js API that fetches real-time weather data from Visual Crossing and caches it using Redis.

**Project URL**: [https://github.com/Siddharth-1644/Weather-API](https://github.com/Siddharth-1644/Weather-API)

## Features
- 3rd-party API integration
- In-memory caching with Redis
- Rate limiting
- Environment variable support

## Setup

1. Clone the repo: git clone
   https://github.com/your-username/weather-api.git

   cd weather-api

2. Install dependencies:
  npm install

3. Create a `.env` file:
  PORT=3000
  
  REDIS_URL=redis://localhost:6379
  
  WEATHER_API_KEY=your_actual_key

4. Start Redis (e.g., using Docker or WSL)

5. Run the app:

   node index.js



