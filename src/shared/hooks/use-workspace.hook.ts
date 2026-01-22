import { useWorkspaceStore } from "../stores/workspace.store";

/**
 * Хук для доступу та маніпуляції даними воркспейсів.
 * Надає зручний інтерфейс для роботи з `useWorkspaceStore`.
 */
export const useWorkspace = () => {
  const {
    workspaces,
    currentWorkspace,
    setWorkspaces,
    addWorkspace,
    setCurrentWorkspace,
  } = useWorkspaceStore();

  return {
    workspaces,
    currentWorkspace,
    setWorkspaces,
    addWorkspace,
    setCurrentWorkspace,
  };
};
