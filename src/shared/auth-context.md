/**
 * @file docs/temp/auth-context-archived-logic.ts
 * @description Заархівована логіка з auth-context.tsx (версія до 23.01.2026).
 * 
 * Цей код було винесено, оскільки він базувався на хибному припущенні,
 * що користувач завжди працює в одному "активному" воркспейсі.
 * 
 * Логіка може бути корисною в майбутньому при реалізації завантаження даних
 * на рівні конкретних сторінок (наприклад, /dashboard/[slug]).
 */

import type {
  UserRole,
  Workspace,
  WorkspaceUser,
  Subscription,
  WorkspaceQuota,
} from "@/shared/lib/validations/schemas";
import { createBrowserClient } from "@/shared/supabase/client";

// ============================================================================
// ТИПИ
// ============================================================================

export interface ArchivedAuthContextType {
  workspace: Workspace | null;
  workspaceUser: WorkspaceUser | null;
  role: UserRole | null;
  subscription: Subscription | null;
  quotas: WorkspaceQuota | null;
  refresh: () => Promise<void>;
}

export type ArchivedWorkspaceUserProfile = WorkspaceUser & {
  workspaces: Workspace | null;
};

// ============================================================================
// ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ
// ============================================================================

/**
 * Приклад функції для завантаження даних конкретного воркспейса.
 * Раніше ця логіка була всередині AuthProvider.
 */
export const loadWorkspaceData = async (
  userId: string,
  workspaceId?: string // Може бути опціональним, якщо логіка зміниться
) => {
  const supabase = createBrowserClient(); // Або createServerClient на сервері
  try {
    // Варіант 1: Завантаження "активного" воркспейса (стара логіка)
    const { data, error } = await supabase
      .from("workspace_users")
      .select("*, workspaces(*)")
      .eq("user_id", userId)
      .eq("status", "active") // Це припущення, що є "активний"
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const { workspaces, ...userProfile } = data as ArchivedWorkspaceUserProfile;
      const workspaceData = workspaces;

      if (workspaceData?.id) {
        // Завантаження підписок та квот для цього воркспейса
        const [subResult, quotasResult] = await Promise.all([
          supabase
            .from("subscriptions")
            .select("*")
            .eq("workspace_id", workspaceData.id)
            .maybeSingle(),
          supabase
            .from("workspace_quotas")
            .select("*")
            .eq("workspace_id", workspaceData.id)
            .maybeSingle(),
        ]);
        
        return {
            workspace: workspaceData,
            workspaceUser: userProfile,
            subscription: subResult.data || null,
            quotas: quotasResult.data || null,
        }
      }
    }
    return null;

  } catch (error) {
    console.error("[ArchivedLogic] Помилка при завантаженні робочого простору:", error);
    return null;
  }
};
