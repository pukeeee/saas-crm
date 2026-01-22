"use server";

import { createServerClient } from "@/shared/supabase/server";

/**
 * Серверна дія для отримання всіх воркспейсів, до яких належить поточний користувач.
 * @returns Повертає масив об'єктів воркспейсів або null у разі помилки.
 */
export async function getWorkspaces() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Authentication error: User not found.");
    return null;
  }

  // RLS (Row Level Security) в Supabase автоматично відфільтрує воркспейси,
  // до яких користувач не має доступу. Нам просто потрібно запитати
  // таблицю `workspaces`.
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("id, name, slug");

  if (error) {
    console.error("Error fetching workspaces:", error.message);
    return null;
  }

  return workspaces;
}
