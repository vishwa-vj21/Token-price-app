import { create } from "zustand";

const usePriceStore = create((set) => ({
  token: "",
  network: "",
  timestamp: "",
  priceResult: null,
  loading: false,
  progress: 0, // ✅ add progress state
  setToken: (token) => set({ token }),
  setNetwork: (network) => set({ network }),
  setTimestamp: (timestamp) => set({ timestamp }),
  setLoading: (loading) => set({ loading }),
  setPriceResult: (priceResult) => set({ priceResult }),
  setProgress: (progress) => set({ progress }), // ✅ add setProgress action
}));

export default usePriceStore;
