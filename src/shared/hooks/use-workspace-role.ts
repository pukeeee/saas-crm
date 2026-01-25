/**
 * @file use-workspace-role.ts
 * @description Хук для получения роли пользователя в конкретном воркспейсе.
 * 
 * Этот хук НЕ использует глобальный контекст, а получает slug из URL
 * и делает запрос к базе данных для определения роли.
 * 
 * @architecture
 * - Server Components передают начальные данные через props
 * - Client Components используют этот хук для реактивности
 * - Кеширование через React Query (будущая оптимизация)
 */

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/shared/supabase/client";
import type { UserRole } from "@/shared/lib/validations/schemas";

interface UseWorkspaceRoleResult {
  role: UserRole | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Хук для получения роли пользователя в текущем воркспейсе (из URL).
 * 
 * @example
 * function DealCard() {
 *   const { role, loading } = useWorkspaceRole();
 *   
 *   if (loading) return <Skeleton />;
 *   if (!role) return null;
 *   
 *   return (
 *     <div>
 *       {role === 'owner' && <DeleteButton />}
 *     </div>
 *   );
 * }
 */
export function useWorkspaceRole(): UseWorkspaceRoleResult {
  const params = useParams();
  const workspaceSlug = params?.slug as string | undefined;

  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workspaceSlug) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createBrowserClient();

        // Получаем текущего пользователя
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setRole(null);
          return;
        }

        // Получаем роль через RPC функцию
        const { data: workspaceId } = await supabase
          .from("workspaces")
          .select("id")
          .eq("slug", workspaceSlug)
          .single();

        if (!workspaceId) {
          setRole(null);
          return;
        }

        const { data: userRole, error: roleError } = await supabase.rpc(
          "get_workspace_role",
          {
            p_user_id: user.id,
            p_workspace_id: workspaceId.id,
          },
        );

        if (roleError) {
          throw roleError;
        }

        setRole(userRole as UserRole);
      } catch (err) {
        console.error("[useWorkspaceRole] Error:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch role"),
        );
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [workspaceSlug]);

  return { role, loading, error };
}

/**
 * Хук для получения роли в КОНКРЕТНОМ воркспейсе (по ID).
 * Используется когда нужно проверить роль не в текущем, а в другом воркспейсе.
 * 
 * @example
 * function WorkspaceCard({ workspaceId }: { workspaceId: string }) {
 *   const { role } = useWorkspaceRoleById(workspaceId);
 *   return <div>Your role: {role}</div>;
 * }
 */
export function useWorkspaceRoleById(
  workspaceId: string | null,
): UseWorkspaceRoleResult {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createBrowserClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setRole(null);
          return;
        }

        const { data: userRole, error: roleError } = await supabase.rpc(
          "get_workspace_role",
          {
            p_user_id: user.id,
            p_workspace_id: workspaceId,
          },
        );

        if (roleError) {
          throw roleError;
        }

        setRole(userRole as UserRole);
      } catch (err) {
        console.error("[useWorkspaceRoleById] Error:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch role"),
        );
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [workspaceId]);

  return { role, loading, error };
}
