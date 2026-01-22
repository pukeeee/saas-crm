import { create } from "zustand";

type CreateWorkspaceModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * Хук для керування станом модального вікна створення воркспейсу.
 */
export const useCreateWorkspaceModal = create<CreateWorkspaceModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
