import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  modalOpen: boolean;
  learningMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleModal: () => void;
  setModalOpen: (open: boolean) => void;
  toggleLearningMode: () => void;
  setLearningMode: (enabled: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  learningMode: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
  setModalOpen: (open) => set({ modalOpen: open }),
  toggleLearningMode: () =>
    set((state) => ({ learningMode: !state.learningMode })),
  setLearningMode: (enabled) => set({ learningMode: enabled }),
}));