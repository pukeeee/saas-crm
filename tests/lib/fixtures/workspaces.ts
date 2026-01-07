/**
 * @file Фікстури для тестування сутності "Робочі простори" (workspaces).
 * @description Надає готові об'єкти для симуляції різних станів робочих просторів у тестах.
 */

import type { Database } from "@/shared/lib/types/database";

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
type WorkspaceInsert = Database["public"]["Tables"]["workspaces"]["Insert"];

/**
 * @constant mockWorkspaceId
 * @description Стандартний UUID для тестового робочого простору.
 */
export const mockWorkspaceId = "11111111-1111-1111-1111-111111111111";

/**
 * @constant mockOwnerId
 * @description Стандартний UUID для власника тестового робочого простору.
 */
export const mockOwnerId = "22222222-2222-2222-2222-222222222222";

/**
 * @constant mockWorkspace
 * @description Базовий мок робочого простору з типовими налаштуваннями.
 */
export const mockWorkspace: Workspace = {
  id: mockWorkspaceId,
  name: "Test Company LLC",
  slug: "test-company",
  owner_id: mockOwnerId,
  settings: {
    visibility_mode: "all",
    default_currency: "UAH",
    timezone: "Europe/Kyiv",
    date_format: "DD.MM.YYYY",
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

/**
 * @constant mockCreateWorkspace
 * @description Мок даних для створення нового робочого простору.
 * Використовується для тестування функцій створення.
 */
export const mockCreateWorkspace: WorkspaceInsert = {
  name: "New Workspace",
  slug: "new-workspace",
  owner_id: mockOwnerId,
};

/**
 * @constant mockWorkspaceWithCustomSettings
 * @description Мок робочого простору з нетиповими, кастомними налаштуваннями.
 * Використовується для перевірки логіки, що залежить від налаштувань.
 */
export const mockWorkspaceWithCustomSettings: Workspace = {
  ...mockWorkspace,
  id: "33333333-3333-3333-3333-333333333333",
  name: "Custom Settings Workspace",
  slug: "custom-settings",
  settings: {
    visibility_mode: "team",
    default_currency: "USD",
    timezone: "America/New_York",
    date_format: "MM/DD/YYYY",
  },
};

/**
 * @constant mockDeletedWorkspace
 * @description Мок робочого простору, який було "м'яко" видалено (soft-deleted).
 * Поле `deleted_at` містить часову мітку видалення.
 */
export const mockDeletedWorkspace: Workspace = {
  ...mockWorkspace,
  id: "44444444-4444-4444-4444-444444444444",
  deleted_at: "2024-12-31T23:59:59Z",
};
