import PriceForm from "../../components/PriceForm";
import ProgressBar from "../../components/ProgressBar";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <header className="py-6 shadow-md bg-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          🪙 Token Price App
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Fetch real-time & historical token prices
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-md">
          <ProgressBar />
          <PriceForm />
        </div>
      </main>

      <footer className="py-4 text-center text-gray-400 text-sm">
        Built with Next.js, Tailwind, and BullMQ ✨
      </footer>
    </div>
  );
}
