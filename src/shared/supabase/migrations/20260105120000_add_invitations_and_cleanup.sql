-- ============================================================================
-- CRM4SMB Database Schema Update
-- Version: 1.1.0
-- Description: Впровадження нової системи запрошень та очищення схеми
-- Дата: 05 січня 2026
-- ============================================================================

-- ============================================================================
-- ОНОВЛЕННЯ ЕНУМІВ
-- ============================================================================

-- Додаємо новий енум для статусу запрошень
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- ============================================================================
-- НОВА ТАБЛИЦЯ: Запрошення до воркспейсів
-- ============================================================================

CREATE TABLE workspace_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Інформація про запрошення
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  role user_role NOT NULL DEFAULT 'user',
  token TEXT NOT NULL UNIQUE, -- Унікальний токен для посилання
  
  -- Хто запросив
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Статус
  status invitation_status NOT NULL DEFAULT 'pending',
  
  -- Дати
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  
  -- Метадані
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Запобігаємо дублюванню активних запрошень на один email в межах одного воркспейсу
CREATE UNIQUE INDEX unique_pending_invitation
ON workspace_invitations(workspace_id, email)
WHERE (status = 'pending');

-- Тригер для оновлення updated_at
CREATE TRIGGER update_workspace_invitations_updated_at BEFORE UPDATE ON workspace_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Індекси
CREATE INDEX idx_invitations_workspace ON workspace_invitations(workspace_id);
CREATE INDEX idx_invitations_email ON workspace_invitations(email);
CREATE INDEX idx_invitations_token ON workspace_invitations(token);
CREATE INDEX idx_invitations_status ON workspace_invitations(status);

COMMENT ON TABLE workspace_invitations IS 'Запрошення користувачів до воркспейсів. Заміняє стару систему полів invited_by/invited_at в workspace_users.';

-- ============================================================================
-- ОНОВЛЕННЯ ІСНУЮЧИХ ТАБЛИЦЬ
-- ============================================================================

-- Видаляємо застарілі колонки для запрошень з таблиці workspace_users,
-- оскільки цю логіку тепер повністю покриває нова таблиця workspace_invitations.
ALTER TABLE workspace_users DROP COLUMN IF EXISTS invited_by;
ALTER TABLE workspace_users DROP COLUMN IF EXISTS invited_at;

-- ============================================================================
-- ФУНКЦІЇ
-- ============================================================================

-- Функція для генерації безпечного токена запрошення.
-- Використовує pgcrypto, тому розширення має бути увімкнене.
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_invitation_token IS 'Генерує безпечний випадковий токен у форматі hex для запрошень.';

-- ============================================================================
-- ПОЛІТИКИ БЕЗПЕКИ (RLS)
-- ============================================================================

-- Вмикаємо RLS для нової таблиці
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

-- Власники та адміністратори можуть переглядати всі запрошення у своєму воркспейсі
CREATE POLICY "Admins can view invitations in their workspace"
ON workspace_invitations FOR SELECT
USING (
  workspace_id IN (
    SELECT wu.workspace_id FROM workspace_users wu
    WHERE wu.user_id = auth.uid()
      AND wu.role IN ('owner', 'admin')
      AND wu.status = 'active'
  )
);

-- Користувачі можуть бачити запрошення, надіслані на їхню електронну пошту
CREATE POLICY "Users can view their own invitations"
ON workspace_invitations FOR SELECT
USING (
  email = (SELECT u.email FROM auth.users u WHERE u.id = auth.uid())
);

-- Власники та адміністратори можуть створювати запрошення
CREATE POLICY "Admins can create invitations"
ON workspace_invitations FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT wu.workspace_id FROM workspace_users wu
    WHERE wu.user_id = auth.uid()
      AND wu.role IN ('owner', 'admin')
      AND wu.status = 'active'
  )
);

-- Власники та адміністратори можуть скасовувати (видаляти) запрошення
CREATE POLICY "Admins can delete invitations"
ON workspace_invitations FOR DELETE
USING (
  workspace_id IN (
    SELECT wu.workspace_id FROM workspace_users wu
    WHERE wu.user_id = auth.uid()
      AND wu.role IN ('owner', 'admin')
      AND wu.status = 'active'
  )
);

-- Примітка: Оновлення запрошень (UPDATE) не є типовою дією.
-- Зазвичай простіше скасувати старе запрошення і створити нове.
-- Якщо оновлення все ж потрібне, можна додати політику аналогічну до DELETE.

-- ============================================================================
-- КІНЕЦЬ МІГРАЦІЇ
-- ============================================================================
