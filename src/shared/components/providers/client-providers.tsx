"use client";

/**
 * @file client-providers.tsx
 * @description Всі клієнтські провайдери додатку
 */

import { useEffect } from "react";
import { AuthProvider } from "@/shared/lib/context/auth-context";
import { AuthModal } from "@/widgets/auth/ui/AuthModal";
import { Toaster } from "@/shared/components/ui/sonner";
import { WorkspaceProvider } from "./workspace-provider";
import type { Database } from "@/shared/lib/types/database";
import { useWorkspaceStore } from "@/shared/stores/workspace-store";

type Workspace = Pick<
  Database["public"]["Tables"]["workspaces"]["Row"],
  "id" | "name" | "slug"
>;

interface ClientProvidersProps {
  children: React.ReactNode;
  initialWorkspaces?: Workspace[];
}

/**
 * Компонент що об'єднує всі клієнтські провайдери
 * Використовується в Root Layout
 */
export function ClientProviders({
  children,
  initialWorkspaces = [],
}: ClientProvidersProps) {
  // Инициализируем Zustand store с данными с сервера (только один раз)
  useEffect(() => {
    const store = useWorkspaceStore.getState();
    if (!store.initialized) {
      store.setWorkspaces(initialWorkspaces);
    }
  }, [initialWorkspaces]);
  return (
    <AuthProvider>
      <WorkspaceProvider initialWorkspaces={initialWorkspaces}>
        {children}
        <AuthModal />
        <Toaster />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
