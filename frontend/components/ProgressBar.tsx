"use client";
import usePriceStore from "../store/priceStore";

export default function ProgressBar() {
  const { progress } = usePriceStore();

  return (
    <div className="w-full bg-gray-300 rounded-full h-2 my-4">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
