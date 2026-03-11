import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLayoutStore = create(
  persist(
    (set) => ({
      isRightPanelOpen: true,
      toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
      setRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
    }),
    {
      name: "layout-storage",
    },
  ),
);
