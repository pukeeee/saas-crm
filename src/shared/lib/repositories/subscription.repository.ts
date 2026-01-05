/**
 * Репозиторій для роботи з сутністю 'Subscription'.
 * Надає методи для прямої взаємодії з таблицею 'subscriptions' в базі даних.
 */

import { createServerClient } from "@/shared/supabase/server";
import type { Database } from "@/shared/lib/types/database";
import type { SubscriptionTier } from "@/shared/lib/validations/schemas";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];

/**
 * Отримує дані про підписку за ID робочого простору.
 * @param workspaceId - ID робочого простору.
 * @returns Об'єкт підписки або null.
 */
export async function getByWorkspaceId(
  workspaceId: string,
): Promise<Subscription | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single();

  if (error) {
    // В репозиторії ми не логуємо, а прокидаємо помилку вище.
    // Сервіс, що викликає, вирішить, що з нею робити.
    if (error.code === "PGRST116") {
      // Це не помилка, а просто відсутність запису
      return null;
    }
    console.error(`SubscriptionRepository Error (getByWorkspaceId): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Оновлює підписку.
 * @param workspaceId - ID робочого простору.
 * @param updates - Об'єкт з полями для оновлення.
 * @returns Оновлений об'єкт підписки.
 */
export async function update(
  workspaceId: string,
  updates: SubscriptionUpdate,
): Promise<Subscription> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("workspace_id", workspaceId)
    .select()
    .single();

  if (error) {
    console.error(`SubscriptionRepository Error (update): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}
