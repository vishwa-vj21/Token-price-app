// services/redis.js
import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create Redis instance with your Upstash URL
const redis = new IORedis(process.env.UPSTASH_REDIS_URL, {
  tls: {}, // Upstash requires TLS
});

export default redis;
