import { Alchemy, Network } from "alchemy-sdk";
import dotenv from "dotenv";
import pRetry from "p-retry";

dotenv.config();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

/**
 * Fetches token price from Alchemy with exponential backoff using p-retry
 * @param {string} tokenAddress - The token contract address
 * @returns {Promise<number>} - The fetched price
 */
export async function fetchTokenPrice(tokenAddress) {
  return await pRetry(
    async () => {
      const response = await alchemy.core.getTokenMetadata(tokenAddress);
      console.log("Fetched price data:", response);

      // 📝 For now, returning dummy price because real price endpoint requires token with liquidity
      const dummyPrice = 1 + Math.random() * 0.1;
      return dummyPrice;
    },
    {
      retries: 5, // Number of retries
      factor: 2, // Exponential factor
      minTimeout: 1000, // Start at 1s
      maxTimeout: 8000, // Max at 8s
      onFailedAttempt: (error) => {
        console.warn(
          `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
        );
      },
    }
  );
}

export default alchemy;
