import { create } from "zustand";

/**
 * Тип, що описує структуру даних воркспейсу.
 */
export type Workspace = {
  id: string;
  name: string;
  slug: string;
};

type WorkspaceStore = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
};

/**
 * Глобальний стейт-менеджер для воркспейсів.
 * Дозволяє зберігати та оновлювати список воркспейсів та поточний активний воркспейс.
 */
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));
