import IORedis from "ioredis";

const redis = new IORedis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, // For Upstash TLS connections
});

import express from "express";
import Price from "../models/Price.js";
import alchemy from "../services/alchemy.js";
import { interpolate } from "../services/interpolation.js";
import { fetchPricesQueue } from "../jobs/fetchPrices.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { token, network, timestamp, price } = req.body;

  try {
    const newPrice = new Price({ token, network, timestamp, price });
    await newPrice.save();

    res.json({ message: "Price saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const prices = await Price.find();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:token/:network/:timestamp", async (req, res) => {
  const { token, network, timestamp } = req.params;
  const ts_q = parseInt(timestamp);

  const cacheKey = `${token}:${network}:${ts_q}`;

  try {
    const cachedPrice = await redis.get(cacheKey);
    if (cachedPrice) {
      return res.json({
        price: parseFloat(cachedPrice),
        source: "cache",
      });
    }

    const existingPrice = await Price.findOne({
      token,
      network,
      timestamp: ts_q,
    });

    if (existingPrice) {
      await redis.setex(cacheKey, 300, existingPrice.price.toString());

      return res.json({
        price: existingPrice.price,
        source: "database",
      });
    }

    const beforePrice = await Price.findOne({
      token,
      network,
      timestamp: { $lt: ts_q },
    }).sort({ timestamp: -1 });

    const afterPrice = await Price.findOne({
      token,
      network,
      timestamp: { $gt: ts_q },
    }).sort({ timestamp: 1 });

    if (!beforePrice || !afterPrice) {
      return res.status(404).json({
        error: "Cannot interpolate - missing before or after price data",
      });
    }

    const interpolatedPrice = interpolate(
      ts_q,
      beforePrice.timestamp,
      beforePrice.price,
      afterPrice.timestamp,
      afterPrice.price
    );

    const newPrice = new Price({
      token,
      network,
      timestamp: ts_q,
      price: interpolatedPrice,
    });
    await newPrice.save();

    await redis.setex(cacheKey, 300, interpolatedPrice.toString());

    res.json({
      price: interpolatedPrice,
      source: "interpolated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/schedule", async (req, res) => {
  const { token, network } = req.body;

  try {
    const today = new Date();
    const creationDate = new Date(today);
    creationDate.setDate(today.getDate() - 20);

    const jobs = [];

    for (
      let d = new Date(creationDate);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const ts = Math.floor(d.getTime() / 1000);

      jobs.push({
        name: `${token}-${ts}`,
        data: { token, network, timestamp: ts },
      });
    }

    await fetchPricesQueue.addBulk(jobs);

    res.json({ message: `Scheduled ${jobs.length} jobs for ${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
