/**
 * @file layout.tsx (dashboard)
 * @description Layout для сторінок дашборду з ініціалізацією воркспейсів
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/supabase/server";

export const metadata: Metadata = {
  title: "Дашборд | CRM4SMB",
  description: "Управління воркспейсом",
};

/**
 * Layout для dashboard-роутів
 *
 */
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerClient();

  // Отримуємо користувача
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Редірект неавтентифікованих (додаткова перевірка, основна в middleware)
  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
