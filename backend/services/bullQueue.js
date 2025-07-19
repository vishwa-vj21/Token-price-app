// backend/services/bullQueue.js
const { Queue, Worker } = require("bullmq");
const { getTokenCreationDate, getTokenPriceAt } = require("./alchemy");
const Price = require("../models/Price");

const queue = new Queue("priceQueue");

async function addJob(token, network) {
  await queue.add("fetchHistory", { token, network });
}

function initQueue() {
  const worker = new Worker("priceQueue", async (job) => {
    const { token, network } = job.data;
    const creationDate = await getTokenCreationDate(token);
    const start = new Date(creationDate);
    const end = new Date();

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ts = Math.floor(d.getTime() / 1000);
      const price = await getTokenPriceAt(token, ts);

      if (price) {
        await Price.updateOne(
          { token, network, date: d },
          { $set: { price } },
          { upsert: true }
        );
      }
    }
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });
}

module.exports = { addJob, initQueue };
