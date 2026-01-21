/**
 * @file auth-context.tsx
 * @description Улучшенный провайдер контексту автентифікації
 *
 * Изменения:
 * - Убраны race conditions
 * - Добавлена синхронизация состояния
 * - Оптимизирована загрузка данных
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createBrowserClient } from "@/shared/supabase/client";
import type { User } from "@supabase/supabase-js";
import type {
  UserRole,
  Workspace,
  WorkspaceUser,
  Subscription,
  WorkspaceQuota,
} from "@/shared/lib/validations/schemas";

// ============================================================================
// ТИПЫ
// ============================================================================

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  workspaceUser: WorkspaceUser | null;
  role: UserRole | null;
  subscription: Subscription | null;
  quotas: WorkspaceQuota | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

type WorkspaceUserProfile = WorkspaceUser & {
  workspaces: Workspace | null;
};

// ============================================================================
// КОНТЕКСТ
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// ПРОВАЙДЕР
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaceUser, setWorkspaceUser] = useState<WorkspaceUser | null>(
    null,
  );
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [quotas, setQuotas] = useState<WorkspaceQuota | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  /**
   * Очищает все данные пользователя
   */
  const clearUserData = useCallback(() => {
    setUser(null);
    setWorkspace(null);
    setWorkspaceUser(null);
    setSubscription(null);
    setQuotas(null);
  }, []);

  /**
   * Завантажує дані робочого простору користувача
   */
  const fetchWorkspaceData = useCallback(
    async (workspaceId: string) => {
      try {
        const [subResult, quotasResult] = await Promise.all([
          supabase
            .from("subscriptions")
            .select("*")
            .eq("workspace_id", workspaceId)
            .maybeSingle(),
          supabase
            .from("workspace_quotas")
            .select("*")
            .eq("workspace_id", workspaceId)
            .maybeSingle(),
        ]);

        if (!subResult.error) {
          setSubscription((subResult.data as Subscription) || null);
        }

        if (!quotasResult.error) {
          setQuotas((quotasResult.data as WorkspaceQuota) || null);
        }
      } catch (error) {
        console.error(
          "[AuthContext] Помилка завантаження даних воркспейсу:",
          error,
        );
      }
    },
    [supabase],
  );

  /**
   * Завантажує дані робочого простору користувача
   */
  const fetchWorkspace = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("workspace_users")
          .select("*, workspaces(*)")
          .eq("user_id", userId)
          .eq("status", "active")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const { workspaces, ...userProfile } = data as WorkspaceUserProfile;
          setWorkspaceUser(userProfile);
          setWorkspace(workspaces);

          // Загружаем зависимые данные только если есть workspace
          if (workspaces?.id) {
            await fetchWorkspaceData(workspaces.id);
          }
        } else {
          setWorkspace(null);
          setWorkspaceUser(null);
          setSubscription(null);
          setQuotas(null);
        }
      } catch (error) {
        console.error(
          "[AuthContext] Помилка при завантаженні робочого простору:",
          error,
        );
        setWorkspace(null);
        setWorkspaceUser(null);
        setSubscription(null);
        setQuotas(null);
      }
    },
    [supabase, fetchWorkspaceData],
  );

  /**
   * Ініціалізація та відстеження змін автентифікації
   */
  useEffect(() => {
    let mounted = true;

    // Початкове завантаження користувача
    const initializeAuth = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (currentUser) {
          setUser(currentUser);
          await fetchWorkspace(currentUser.id);
        } else {
          clearUserData();
        }
      } catch (error) {
        console.error("[AuthContext] Помилка ініціалізації:", error);
        if (mounted) {
          clearUserData();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Підписка на зміни автентифікації
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;

      // INITIAL_SESSION обробляється в initializeAuth, тому ігноруємо його тут,
      // щоб уникнути подвійного завантаження
      if (event === "INITIAL_SESSION") {
        return;
      }

      if (event === "SIGNED_OUT") {
        clearUserData();
        return;
      }

      // Для SIGNED_IN та TOKEN_REFRESHED, ми перевіряємо сесію на сервері
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          // Важливо: отримуємо свіжого користувача, а не з колбеку
          const {
            data: { user: freshUser },
          } = await supabase.auth.getUser();
          if (mounted) {
            if (freshUser) {
              setUser(freshUser);
              // Перезавантажуємо дані воркспейсу, оскільки могли змінитись підписки/ролі
              await fetchWorkspace(freshUser.id);
            } else {
              // Якщо getUser не повернув користувача, сесія не валідна
              clearUserData();
            }
          }
        } catch (error) {
          console.error(
            "[AuthContext] Помилка під час оновлення сесії:",
            error,
          );
          if (mounted) clearUserData();
        }
      }
    });

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, [supabase.auth, fetchWorkspace, clearUserData]);

  /**
   * Функція для ручного оновлення даних
   */
  const refresh = useCallback(async () => {
    if (user?.id) {
      setLoading(true);
      await fetchWorkspace(user.id);
      setLoading(false);
    }
  }, [user?.id, fetchWorkspace]);

  const value: AuthContextType = {
    user,
    workspace,
    workspaceUser,
    role: workspaceUser?.role ?? null,
    subscription,
    quotas,
    loading,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// ХУК
// ============================================================================

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext має використовуватися всередині AuthProvider",
    );
  }
  return context;
}
