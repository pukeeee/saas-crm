/**
 * @file Глобальний файл налаштувань для інтеграційних тестів.
 * @description Цей файл виконується перед запуском усіх інтеграційних тестів.
 * Він відповідає за налаштування змінних середовища для підключення до тестової бази даних
 * та реєструє `afterEach` хук для очищення даних після кожного тесту.
 */

import { afterEach } from "vitest";
import { cleanupTestData } from "../helpers/db-setup";

// --- Налаштування змінних середовища для тестової бази даних ---

// Якщо в `.env` файлі задані спеціальні змінні для тестової БД,
// ми пріоритетно використовуємо їх, переписуючи стандартні змінні.
if (process.env.NEXT_PUBLIC_SUPABASE_TEST_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_TEST_URL;
}

if (process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY;
}

// Аналогічно, встановлюємо SERVICE_ROLE_KEY для адміністративних операцій.
if (process.env.NEXT_PUBLIC_SUPABASE_TEST_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_TEST_SERVICE_ROLE_KEY;
} else if (process.env.SUPABASE_TEST_SERVICE_KEY) {
  // Запасний варіант для іншої можливої назви змінної.
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_TEST_SERVICE_KEY;
}

/**
 * @hook afterEach
 * @description Цей хук автоматично викликається після кожного виконаного тесту (`it` блоку).
 * Він викликає функцію `cleanupTestData`, яка видаляє всі створені під час тесту дані,
 * забезпечуючи повну ізоляцію між тестами.
 */
afterEach(async () => {
  await cleanupTestData();
});
