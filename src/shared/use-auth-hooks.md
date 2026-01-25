/**
 * @file docs/temp/use-auth-archived-hooks.ts
 * @description Заархівовані хуки з use-auth.ts (версія до 23.01.2026).
 * 
 * Ці хуки було винесено, оскільки вони залежали від глобального контексту,
 * що містив дані про "активний" воркспейс, що було архітектурно неправильно.
 * 
 * Цей код може бути корисним як приклад або основа для нових, локальних хуків,
 * які будуть отримувати дані з контексту, специфічного для сторінки.
 */

"use client";

import { useAuthContext } from "@/shared/lib/context/auth-context";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  type Permission,
} from "@/shared/lib/auth/permissions";

// Припускаємо, що в майбутньому може існувати локальний контекст
// import { useLocalWorkspaceContext } from "@/.../local-workspace-context";
// І ці хуки будуть використовувати його замість useAuthContext.


// ============================================================================
// ХУКИ РОБОЧОГО ПРОСТОРУ
// ============================================================================

/**
 * @function useWorkspace (ARCHIVED)
 * @description Хук для отримання поточного робочого простору та ролі користувача в ньому.
 */
export function useWorkspace() {
  // В старій реалізації було так:
  // const { workspace, workspaceUser, role, loading, refresh } = useAuthContext();
  
  // В новій реалізації це має приходити з локального контексту сторінки.
  // const { workspace, workspaceUser, role, loading, refresh } = useLocalWorkspaceContext();

  // Повертаємо заглушку
  return {
    workspace: null,
    workspaceUser: null,
    role: null,
    loading: true,
    refresh: async () => {},
  };
}

// ============================================================================
// ХУКИ ДОЗВОЛІВ
// ============================================================================

/**
 * @function usePermission (ARCHIVED)
 * @description Хук для перевірки, чи має поточний користувач певний дозвіл.
 */
export function usePermission(permission: Permission): boolean {
  // const { role } = useLocalWorkspaceContext();
  // if (!role) return false;
  // return hasPermission(role, permission);
  return false;
}

// ... і так далі для usePermissions, useAnyPermission, usePermissionChecker ...


// ============================================================================
// ХУКИ ПІДПИСКИ
// ============================================================================

/**
 * @function useSubscription (ARCHIVED)
 * @description Хук для отримання даних про підписку поточного робочого простору.
 */
export function useSubscription() {
  // const { subscription, loading } = useLocalWorkspaceContext();
  return {
    subscription: null,
    tier: "free",
    status: "trialing",
    loading: true,
  };
}

/**
 * @function useFeatureAccess (ARCHIVED)
 * @description Хук для перевірки, чи доступна певна функція для поточної підписки.
 */
export function useFeatureAccess(feature: string): boolean {
  // const { subscription } = useLocalWorkspaceContext();
  // ... логіка перевірки ...
  return false;
}

// ============================================================================
// ХУКИ КВОТ
// ============================================================================

/**
 * @function useQuotas (ARCHIVED)
 * @description Хук для отримання квот та їх використання робочим простором.
 */
export function useQuotas() {
  // const { quotas, loading } = useLocalWorkspaceContext();
  return {
    quotas: null,
    loading: true,
    canAddContact: false,
    canAddDeal: false,
    canAddUser: false,
  };
}
