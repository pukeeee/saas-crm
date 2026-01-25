/**
 * @file layout.tsx (root)
 * @description Кореневий Layout додатку з SSR ініціалізацією воркспейсів
 *
 * АРХІТЕКТУРА:
 * - Server Component: рендериться на сервері
 * - Завантажує дані воркспейсів для автентифікованих користувачів
 * - Передає дані клієнтським провайдерам для синхронної ініціалізації
 */

import type { Metadata } from "next";
import { Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/widgets/theme/model/theme-provider";
import { ClientProviders } from "@/shared/components/providers/client-providers";
import { createServerClient } from "@/shared/supabase/server";
import type { Database } from "@/shared/lib/types/database";

// ============================================================================
// ТИПИ
// ============================================================================

/**
 * Мінімальний тип воркспейсу для передачі клієнту
 * Використовуємо Pick для type-safety з базою даних
 */
type Workspace = Pick<
  Database["public"]["Tables"]["workspaces"]["Row"],
  "id" | "name" | "slug"
>;

// ============================================================================
// ШРИФТИ
// ============================================================================

/**
 * Основний шрифт (Geist Sans)
 * Використовується для всього тексту крім коду
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Моноширинний шрифт (Geist Mono)
 * Використовується для коду та технічних елементів
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "CRM для малого бізнесу",
  description: "Українська CRM система для малого та середнього бізнесу",
};

// ============================================================================
// ROOT LAYOUT (Server Component)
// ============================================================================

/**
 * Кореневий Layout додатку
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * 1. Завантаження даних на сервері (SSR)
 * 2. Налаштування HTML структури
 * 3. Підключення шрифтів та стилів
 * 4. Ініціалізація провайдерів
 *
 * ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ:
 * - Перевіряємо автентифікацію користувача
 * - Якщо користувач залогінений - завантажуємо його воркспейси
 * - Якщо гість - передаємо порожній масив
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ===== ІНІЦІАЛІЗАЦІЯ SUPABASE =====

  /**
   * Створюємо серверний клієнт Supabase
   * Використовує cookies для автентифікації
   */
  const supabase = await createServerClient();

  // ===== ПЕРЕВІРКА АВТЕНТИФІКАЦІЇ =====

  /**
   * Отримуємо поточного користувача
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ===== ЗАВАНТАЖЕННЯ ВОРКСПЕЙСІВ =====

  /**
   * Завантажуємо воркспейси для автентифікованих користувачів
   *
   * ОПТИМІЗАЦІЯ:
   * - Запит виконується тільки якщо є user
   * - Вибираємо тільки потрібні поля (id, name, slug)
   * - Сортуємо за датою створення (новіші першими)
   *
   * RLS БЕЗПЕКА:
   * - Row Level Security автоматично фільтрує тільки доступні воркспейси
   * - Користувач бачить тільки ті воркспейси, де він є учасником
   */
  let initialWorkspaces: Workspace[] = [];

  if (user) {
    const { data: workspaces, error } = await supabase
      .from("workspaces")
      .select("id, name, slug")
      .order("created_at", { ascending: false });

    // Обробка помилок
    if (error) {
      console.error("[RootLayout] Помилка завантаження воркспейсів:", error);
      // Не кидаємо помилку - додаток має працювати навіть без воркспейсів
      initialWorkspaces = [];
    } else {
      initialWorkspaces = workspaces || [];
    }

    // Debug логування (тільки dev)
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[RootLayout] Завантажено ${initialWorkspaces.length} воркспейсів для користувача ${user.id}`,
      );
    }
  }

  // ===== РЕНДЕРИНГ HTML =====

  /**
   * HTML структура додатку
   *
   * ВАЖЛИВІ АТРИБУТИ:
   * - suppressHydrationWarning: дозволяє ThemeProvider змінювати <html> без попереджень
   * - lang="uk": українська мова для accessibility та SEO
   * - className: CSS змінні шрифтів для використання в Tailwind
   */
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*
            Клієнтські провайдери з SSR даними
          */}
          <ClientProviders initialWorkspaces={initialWorkspaces}>
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
