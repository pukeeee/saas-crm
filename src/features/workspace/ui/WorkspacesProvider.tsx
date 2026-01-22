"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useWorkspace } from "@/shared/hooks/use-workspace.hook";
import { getWorkspaces } from "../actions/get-workspaces.action";
import { Workspace } from "@/shared/stores/workspace.store";

/**
 * Провайдер, що завантажує воркспейси користувача та ініціалізує стор.
 * Показує лоадер під час завантаження.
 */
export function WorkspacesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setWorkspaces, setCurrentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspaces() {
      const workspacesData = await getWorkspaces();

      if (workspacesData) {
        setWorkspaces(workspacesData as Workspace[]);
        // Встановлюємо перший воркспейс як поточний, якщо список не порожній
        if (workspacesData.length > 0) {
          setCurrentWorkspace(workspacesData[0] as Workspace);
        }
      }
      setIsLoading(false);
    }

    loadWorkspaces();
  }, [setWorkspaces, setCurrentWorkspace]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
