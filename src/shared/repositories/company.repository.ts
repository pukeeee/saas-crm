/**
 * Репозиторій для роботи з сутністю 'Company'.
 * Надає методи для CRUD операцій з компаніями.
 */

import { createServerClient } from "@/shared/supabase/server";
import type { Database } from "@/shared/lib/types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

/**
 * Отримує компанію за ID.
 * @param companyId - ID компанії.
 * @returns Об'єкт компанії або null.
 */
export async function getById(
  companyId: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company | null> {
  const supabase = supabaseClient ?? (await createServerClient());
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error(`CompanyRepository Error (getById): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Отримує всі компанії для воркспейсу з фільтрацією та пагінацією.
 * @param workspaceId - ID робочого простору.
 * @param options - Опції фільтрації та пагінації.
 * @returns Масив компаній.
 */
export async function getByWorkspaceId(
  workspaceId: string,
  options?: {
    status?: Company["status"];
    limit?: number;
    offset?: number;
    showDeleted?: boolean;
  },
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company[]> {
  const supabase = supabaseClient ?? (await createServerClient());
  let query = supabase
    .from("companies")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (!options?.showDeleted) {
    query = query.is("deleted_at", null);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 20) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      `CompanyRepository Error (getByWorkspaceId): ${error.message}`,
    );
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Підраховує кількість компаній у воркспейсі.
 * @param workspaceId - ID робочого простору.
 * @param options - Опції фільтрації.
 * @returns Кількість компаній.
 */
export async function count(
  workspaceId: string,
  options?: {
    status?: Company["status"];
    showDeleted?: boolean;
  },
  supabaseClient?: SupabaseClient<Database>,
): Promise<number> {
  const supabase = supabaseClient ?? (await createServerClient());
  let query = supabase
    .from("companies")
    .select("id", { count: "exact" })
    .eq("workspace_id", workspaceId);

  if (!options?.showDeleted) {
    query = query.is("deleted_at", null);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`CompanyRepository Error (count): ${error.message}`);
    throw new Error(error.message);
  }

  return count || 0;
}

/**
 * Створює нову компанію.
 * @param company - Дані для створення компанії.
 * @returns Створена компанія.
 */
export async function create(
  company: CompanyInsert,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company> {
  const supabase = supabaseClient ?? (await createServerClient());
  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select()
    .single();

  if (error) {
    console.error(`CompanyRepository Error (create): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Оновлює компанію.
 * @param companyId - ID компанії.
 * @param updates - Об'єкт з полями для оновлення.
 * @returns Оновлена компанія.
 */
export async function update(
  companyId: string,
  updates: CompanyUpdate,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company> {
  const supabase = supabaseClient ?? (await createServerClient());
  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", companyId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error(`CompanyRepository Error (update): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

/**
 * М'яке видалення компанії.
 * @param companyId - ID компанії.
 * @returns Видалена компанія.
 */
export async function softDelete(
  companyId: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company> {
  const supabase = supabaseClient ?? (await createServerClient());
  const { data, error } = await supabase
    .from("companies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", companyId)
    .select()
    .single();

  if (error) {
    console.error(`CompanyRepository Error (softDelete): ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Пошук компаній за текстом.
 * @param workspaceId - ID робочого простору.
 * @param searchQuery - Текст для пошуку.
 * @returns Масив знайдених компаній (макс 50).
 */
export async function search(
  workspaceId: string,
  searchQuery: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Company[]> {
  const supabase = supabaseClient ?? (await createServerClient());
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .or(`name.ilike.%${searchQuery}%,legal_name.ilike.%${searchQuery}%`)
    .limit(50);

  if (error) {
    console.error(`CompanyRepository Error (search): ${error.message}`);
    throw new Error(error.message);
  }

  return data || [];
}
