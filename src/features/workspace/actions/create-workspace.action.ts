"use server";

import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/supabase/server";

// Оновлена схема валідації, залишається без змін
const CreateWorkspaceFormSchema = z.object({
  name: z.string().min(2, "Назва має бути довшою за 2 символи").max(100),
});

// Новий тип для стану, що може містити дані у разі успіху
type WorkspaceData = {
  id: string;
  name: string;
  slug: string;
};

type State = {
  message: string;
  error: boolean;
  data?: WorkspaceData | null;
};

export async function createWorkspace(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Помилка автентифікації. Спробуйте увійти знову.",
      error: true,
    };
  }

  const validatedFields = CreateWorkspaceFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message:
        validatedFields.error.flatten().fieldErrors.name?.[0] ??
        "Невірна назва воркспейсу.",
      error: true,
    };
  }

  const { name } = validatedFields.data;

  // Викликаємо єдину RPC-функцію, яка виконує всю логіку в базі даних
  const { data: newWorkspace, error } = await supabase
    .rpc("create_workspace_with_owner", { p_name: name })
    .select("id, name, slug")
    .single();

  if (error || !newWorkspace) {
    // Обробляємо помилки, що повертаються з функції PostgreSQL
    return {
      message: error?.message || "Не вдалося створити воркспейс.",
      error: true,
    };
  }

  // Замість revalidatePath, ми повертаємо дані, щоб UI міг оновитись динамічно.
  // revalidatePath("/user/workspace"); // Можна залишити, якщо дані також використовуються на інших сторінках

  return {
    message: `Воркспейс "${name}" успішно створено!`,
    error: false,
    data: newWorkspace,
  };
}
