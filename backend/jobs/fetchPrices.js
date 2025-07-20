import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import Price from "../models/Price.js";
import alchemy from "../services/alchemy.js";
import pRetry from "p-retry";
import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {},
});

export const fetchPricesQueue = new Queue("fetchPrices", { connection });

export const fetchPricesWorker = new Worker(
  "fetchPrices",
  async (job) => {
    const { token, network, timestamp } = job.data;

    console.log(`Fetching price for ${token} at ${timestamp}`);

    try {
      const price = await pRetry(
        async () => {
          const dummyPrice = 1.0 + Math.random() * 0.1;

          if (!dummyPrice) {
            throw new Error("Failed to fetch price");
          }

          return dummyPrice;
        },
        {
          retries: 5,
          minTimeout: 1000,
          factor: 2,
        }
      );

      const newPrice = new Price({
        token,
        network,
        timestamp,
        price,
      });
      await newPrice.save();

      return { status: "success", token, timestamp };
    } catch (err) {
      console.error("Failed after retries:", err);
      throw err;
    }
  },
  { connection }
);

fetchPricesWorker.on("completed", (job) => {
  console.log(`✅ Completed job ${job.id}`);
});

fetchPricesWorker.on("failed", (job, err) => {
  console.error(`❌ Failed job ${job.id}: ${err.message}`);
});
