/**
 * @file Головний конфігураційний файл Vitest.
 * @description Ця конфігурація використовується за замовчуванням командою `npm test`.
 * Вона налаштована для запуску **всіх** тестів у проекті (unit та integration).
 */

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "dotenv";
import path from "path";

// Завантажуємо змінні середовища з файлу .env для інтеграційних тестів.
config({ path: path.resolve(__dirname, "./.env") });

export default defineConfig({
  test: {
    // Паттерн для пошуку всіх тестових файлів у проекті.
    include: ["tests/**/*.test.ts"],
    // Файли для налаштування середовища перед запуском тестів.
    // unit-setup мокує глобальні залежності, а integration-setup налаштовує тестову БД.
    setupFiles: [
      "./tests/lib/setup/unit-setup.ts",
      "./tests/lib/setup/integration-setup.ts",
    ],
  },
  // Додаємо плагін для автоматичного розпізнавання аліасів шляхів (`@/...`)
  // з файлу tsconfig.json. Це необхідно, щоб імпорти в тестах працювали коректно.
  plugins: [tsconfigPaths()],
});
