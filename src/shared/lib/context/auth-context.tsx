/**
 * Провайдер контексту автентифікації.
 * Надає глобальний стан, пов'язаний з автентифікацією користувача,
 * його робочим простором та роллю, для всіх компонентів у додатку.
 */

"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@/shared/supabase/client";
import type { User } from "@supabase/supabase-js";
import type {
  UserRole,
  Workspace,
  WorkspaceUser,
} from "@/shared/lib/validations/schemas";

// ============================================================================
// ТИПИ
// ============================================================================

/**
 * @interface AuthContextType
 * @description Визначає структуру даних, що зберігаються в контексті автентифікації.
 * @property {User | null} user - Об'єкт користувача від Supabase або null, якщо не автентифікований.
 * @property {Workspace | null} workspace - Поточний активний робочий простір користувача.
 * @property {WorkspaceUser | null} workspaceUser - Профіль користувача в рамках робочого простору (включає роль).
 * @property {UserRole | null} role - Роль поточного користувача.
 * @property {boolean} loading - Прапорець, що вказує на процес завантаження початкових даних.
 * @property {() => Promise<void>} refreshWorkspace - Функція для примусового оновлення даних про робочий простір.
 */
interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  workspaceUser: WorkspaceUser | null;
  role: UserRole | null;
  loading: boolean;
  refreshWorkspace: () => Promise<void>;
}

/**
 * @description Розширений тип для результату запиту, що об'єднує дані
 * користувача робочого простору (`WorkspaceUser`) та самого робочого простору (`Workspace`).
 */
type WorkspaceUserProfile = WorkspaceUser & {
  workspaces: Workspace | null;
};


// ============================================================================
// КОНТЕКСТ
// ============================================================================

/**
 * @description React Context для зберігання стану автентифікації.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// ПРОВАЙДЕР
// ============================================================================

/**
 * @component AuthProvider
 * @description Компонент-провайдер, що огортає додаток і надає доступ до контексту автентифікації.
 * Він керує станом сесії, завантажує дані користувача та робочого простору.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Стан для збереження об'єкта користувача Supabase
  const [user, setUser] = useState<User | null>(null);
  // Стан для збереження поточного робочого простору
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  // Стан для збереження профілю користувача в рамках робочого простору
  const [workspaceUser, setWorkspaceUser] = useState<WorkspaceUser | null>(
    null,
  );
  // Стан, що вказує на завершення початкового завантаження даних
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  /**
   * @function fetchWorkspace
   * @description Асинхронна функція для отримання даних про робочий простір користувача.
   * Робить запит до таблиці `workspace_users` і за допомогою join отримує пов'язані дані з `workspaces`.
   * @param {string} userId - ID користувача, для якого потрібно знайти робочий простір.
   */
  const fetchWorkspace = useCallback(async (userId: string) => {
    try {
      const { data: workspaceUserData, error } = await supabase
        .from("workspace_users")
        .select("*, workspaces(*)") // Отримати всі поля з workspace_users та всі пов'язані поля з workspaces
        .eq("user_id", userId)
        .eq("status", "active") // Тільки активні профілі
        .single(); // Очікуємо один запис

      if (error) throw error;
      if (!workspaceUserData) {
        throw new Error("Профіль користувача для цього робочого простору не знайдено.");
      }

      // Безпечно розділяємо отримані дані на профіль користувача та робочий простір
      const { workspaces, ...userProfile } = workspaceUserData as WorkspaceUserProfile;

      setWorkspaceUser(userProfile);
      setWorkspace(workspaces);

    } catch (error) {
      console.error("Помилка при завантаженні робочого простору:", error);
      setWorkspace(null);
      setWorkspaceUser(null);
    }
  }, [supabase]);

  // Головний ефект, що виконується один раз при монтуванні компонента
  useEffect(() => {
    /**
     * @function initAuth
     * @description Ініціалізує стан автентифікації: отримує поточного користувача
     * і, якщо він є, завантажує дані його робочого простору.
     */
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          await fetchWorkspace(user.id);
        }
      } catch (error) {
        console.error("Помилка при ініціалізації автентифікації:", error);
      } finally {
        setLoading(false); // Завершуємо завантаження в будь-якому випадку
      }
    };

    initAuth();

    // Підписка на зміни стану автентифікації (логін, логаут)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Якщо користувач увійшов, завантажуємо його дані
          await fetchWorkspace(currentUser.id);
        } else {
          // Якщо користувач вийшов, очищуємо дані
          setWorkspace(null);
          setWorkspaceUser(null);
        }
      },
    );

    // Функція очищення, яка відписується від слухача при демонтуванні компонента
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchWorkspace, supabase.auth]);

  /**
   * @function refreshWorkspace
   * @description Публічна функція для примусового перезавантаження даних робочого простору.
   */
  const refreshWorkspace = async () => {
    if (user) {
      await fetchWorkspace(user.id);
    }
  };

  // Формуємо об'єкт, який буде переданий через контекст
  const value: AuthContextType = {
    user,
    workspace,
    workspaceUser,
    role: workspaceUser?.role ?? null,
    loading,
    refreshWorkspace,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// ХУК
// ============================================================================

/**
 * @function useAuthContext
 * @description Спеціальний хук для доступу до контексту автентифікації.
 * Забезпечує, що контекст використовується тільки всередині `AuthProvider`.
 * @returns {AuthContextType} Поточне значення контексту.
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext має використовуватися всередині AuthProvider");
  }
  return context;
}
