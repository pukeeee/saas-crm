-- ============================================================================
-- Міграція: Створення RPC для атомарного створення воркспейсів
-- Дата: 2026-01-21
-- Опис: Ця міграція впроваджує надійний, атомарний метод для створення
--              воркспейсів. Вона включає:
-- 1. Функцію для генерації коротких, URL-дружніх, випадкових slug'ів.
-- 2. Зміну в таблиці `workspaces` для автоматичної генерації slug'ів при вставці.
-- 3. Функцію RPC `create_workspace_with_owner`, яка створює воркспейс
--    та призначає власника в одній транзакції, повертаючи дані нового
--    воркспейсу.
-- ============================================================================

-- ============================================================================
-- Крок 1: Створення функції для генерації коротких, випадкових, URL-дружніх slug'ів.
-- Ця функція генерує 10-символьний base64url-безпечний випадковий рядок.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_random_slug()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
PARALLEL UNSAFE
AS $$
DECLARE
  -- Нам потрібно 8 байт, щоб отримати 10-11 символів у base64.
  -- 6 байт -> 8 символів, 7 байт -> 9.3 символів, 8 байт -> 10.6 символів
  random_bytes bytea;
  slug TEXT;
BEGIN
  -- Генеруємо криптографічно безпечні випадкові байти
  random_bytes := extensions.gen_random_bytes(8);

  -- Кодуємо байти в base64, а потім робимо їх URL-безпечними
  slug := replace(
            replace(
              encode(random_bytes, 'base64'),
            '+', '-'),
          '/', '_');

  -- Видаляємо заповнювач (padding) і повертаємо перші 10 символів
  RETURN left(trim(trailing '=' from slug), 10);
END;
$$;

COMMENT ON FUNCTION public.generate_random_slug() IS 'Генерує короткий, випадковий, URL-безпечний slug (напр., для воркспейсів).';


-- ============================================================================
-- Крок 2: Модифікація таблиці `workspaces` для використання нового генератора slug'ів.
-- Ми тимчасово робимо колонку `slug` nullable, щоб застосувати значення за замовчуванням,
-- а потім повертаємо обмеження NOT NULL. Обмеження CHECK також оновлюється.
-- ============================================================================
ALTER TABLE public.workspaces
  ALTER COLUMN slug DROP NOT NULL,
  ALTER COLUMN slug SET DEFAULT public.generate_random_slug();

-- Оновлюємо існуючі воркспейси, які могли мати порожні slug'и (якщо такі є)
UPDATE public.workspaces
SET slug = public.generate_random_slug()
WHERE slug IS NULL OR trim(slug) = '';

-- Тепер знову встановлюємо обмеження NOT NULL
ALTER TABLE public.workspaces
  ALTER COLUMN slug SET NOT NULL;

-- Видаляємо стару перевірку і додаємо нову, що дозволяє коротші slug'и
ALTER TABLE public.workspaces DROP CONSTRAINT IF EXISTS "workspaces_slug_check";
ALTER TABLE public.workspaces ADD CONSTRAINT "workspaces_slug_check" CHECK (slug ~ '^[a-zA-Z0-9_-]+$' AND length(slug) >= 8);


-- ============================================================================
-- Крок 3: Створення основної функції RPC для атомарного створення воркспейсу.
-- Ця функція буде викликатися з фронтенду.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_workspace_with_owner(p_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
  new_workspace_slug TEXT;
  current_user_id UUID := auth.uid();
BEGIN
  -- Валідація вхідних даних
  IF trim(p_name) = '' OR length(p_name) < 2 OR length(p_name) > 100 THEN
    RAISE EXCEPTION 'Назва воркспейсу повинна містити від 2 до 100 символів.';
  END IF;

  -- Крок 1: Створюємо воркспейс. Slug буде згенеровано за замовчуванням.
  INSERT INTO public.workspaces (name, owner_id)
  VALUES (p_name, current_user_id)
  RETURNING workspaces.id, workspaces.slug INTO new_workspace_id, new_workspace_slug;

  -- Крок 2: Додаємо користувача до воркспейсу як власника.
  INSERT INTO public.workspace_users (workspace_id, user_id, role)
  VALUES (new_workspace_id, current_user_id, 'owner');

  -- Крок 3: Повертаємо дані щойно створеного воркспейсу.
  -- Це робить результат доступним для клієнта, що викликав функцію.
  RETURN QUERY
    SELECT ws.id, ws.name, ws.slug
    FROM public.workspaces ws
    WHERE ws.id = new_workspace_id;

END;
$$;

COMMENT ON FUNCTION public.create_workspace_with_owner(TEXT) IS 'Атомарно створює новий воркспейс і призначає поточного користувача його власником.';

-- ============================================================================
-- КІНЕЦЬ МІГРАЦІЇ
-- ============================================================================
