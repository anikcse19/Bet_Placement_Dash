// useStore.js
import { create } from "zustand";

const useStore = create((set) => ({
  mode: "light",
  setMode: (value) => set(() => ({ mode: value })),
  // increase: () => set((state) => ({ count: state.count + 1 })),
  // decrease: () => set((state) => ({ count: state.count - 1 })),
  // reset: () => set({ count: 0 }),
}));

export default useStore;
