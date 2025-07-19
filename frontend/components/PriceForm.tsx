"use client";

import usePriceStore from "../store/priceStore";
import { useState } from "react";

export default function PriceForm() {
  const {
    token,
    network,
    timestamp,
    priceResult,
    loading,
    setToken,
    setNetwork,
    setTimestamp,
    setLoading,
    setPriceResult,
    setProgress, // ✅ import from store
    progress, // ✅ also get current progress if needed for rendering
  } = usePriceStore();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ➡️ Simulate progress increasing before API call
      for (let i = 1; i <= 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200)); // wait 200ms
        setProgress(i * 20); // increments: 20%, 40%, ..., 100%
      }

      const res = await fetch(
        `https://token-price-app.onrender.com/api/price/${token}/${network}/${timestamp}`
      );
      const data = await res.json();
      setPriceResult(data);
    } catch (err) {
      console.error(err);
      setPriceResult({ error: "Failed to fetch price" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Token Address"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Network</option>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
        </select>

        <input
          type="number"
          placeholder="Timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Price"}
        </button>
      </form>

      {priceResult && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          {priceResult.error ? (
            <p className="text-red-600">{priceResult.error}</p>
          ) : (
            <>
              <p>
                <strong>Price:</strong> {priceResult.price}
              </p>
              <p>
                <strong>Source:</strong> {priceResult.source}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
