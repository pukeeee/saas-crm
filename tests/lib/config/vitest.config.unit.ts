/**
 * @file Конфігурація Vitest для unit-тестів.
 * @description Цей файл налаштовує середовище для запуску unit-тестів,
 * які перевіряють бізнес-логіку в ізоляції від зовнішніх залежностей (напр., БД).
 * Він включає налаштування для збору покриття коду.
 */

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Вказуємо корінь проекту.
    root: path.resolve(__dirname, "../../.."),
    // Назва групи тестів.
    name: "unit",
    // Дозволяє використовувати глобальні змінні Vitest.
    globals: true,
    // Середовище виконання тестів.
    environment: "node",
    // Паттерн для пошуку файлів з unit-тестами.
    include: ["tests/unit/**/*.test.ts"],
    // Виключаємо інтеграційні тести.
    exclude: ["tests/integration/**", "node_modules/**"],
    // Налаштування звіту про покриття коду.
    coverage: {
      // Провайдер для збору покриття (використовує нативний V8).
      provider: "v8",
      // Формати звітів: текстовий в консолі, json, html-сторінка та lcov для інтеграцій.
      reporter: ["text", "json", "html", "lcov"],
      // Включаємо в звіт тільки сервіси та утиліти, де знаходиться основна бізнес-логіка.
      include: ["src/shared/lib/services/**", "src/shared/lib/utils/**"],
      // Виключаємо з покриття самі тести, типи, конфіги тощо.
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/types/**", "**/config/**"],
    },
    // Файл для глобального налаштування моків перед запуском тестів.
    setupFiles: ["./tests/lib/setup/unit-setup.ts"],
  },
  resolve: {
    // Налаштування аліасів для зручних імпортів.
    alias: {
      "@": path.resolve(__dirname, "../../../src"),
      "@tests": path.resolve(__dirname, "../../../tests"),
    },
  },
});
