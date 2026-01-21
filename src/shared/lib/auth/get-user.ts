/**
 * @file get-user.ts
 * @description Серверні утиліти для роботи з користувачем
 */

import { createServerClient } from '@/shared/supabase/server';
import { cache } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Отримує поточного аутентифікованого користувача (кешується на час запиту).
 * Використовує `getUser()` для безпечного отримання даних.
 * Використовується в Server Components.
 * @returns {Promise<User | null>} Об'єкт користувача або null, якщо не аутентифікований.
 */
export const getCachedUser = cache(async (): Promise<User | null> => {
  const supabase = await createServerClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('[getCachedUser] Помилка отримання користувача:', error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error('[getCachedUser] Критична помилка:', error);
    return null;
  }
});

/**
 * Перевіряє, чи авторизований користувач.
 * Використовується в Server Components.
 * @returns {Promise<boolean>} true, якщо користувач авторизований.
 */
export const isAuthenticated = cache(async (): Promise<boolean> => {
  const user = await getCachedUser();
  return !!user;
});
