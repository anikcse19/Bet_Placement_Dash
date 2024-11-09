// src/zustand/useModeStore.js
import { create } from "zustand"; // Import as a named import

const useStore = create((set) => ({
  mode: localStorage.getItem("mode") || "light",

  toggleMode: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("mode", newMode);
      return { mode: newMode };
    }),

  setMode: (newMode) =>
    set(() => {
      localStorage.setItem("mode", newMode);
      return { mode: newMode };
    }),
}));

export default useStore;
