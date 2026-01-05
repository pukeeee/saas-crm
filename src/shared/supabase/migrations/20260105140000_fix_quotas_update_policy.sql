-- ============================================================================
-- Fix: Add RLS UPDATE policy for workspace_quotas
-- Version: 1.1.1
-- Description: Додавання відсутньої політики безпеки (RLS) для операції UPDATE 
--              в таблиці `workspace_quotas`. Це необхідно, щоб сервіс білінгу 
--              міг оновлювати ліміти при зміні тарифного плану.
-- Дата: 05 січня 2026
-- ============================================================================

-- Дозволяємо оновлення квот тільки власникам або адміністраторам воркспейсу.
-- Альтернативно, можна створити політику, яка дозволяє це робити тільки з `service_role` ключем,
-- але для початку достатньо і цього.
CREATE POLICY "Admins can update workspace quotas"
ON public.workspace_quotas FOR UPDATE
USING (
  workspace_id IN (
    SELECT wu.workspace_id
    FROM public.workspace_users wu
    WHERE wu.user_id = auth.uid() AND wu.role IN ('owner', 'admin')
  )
);
