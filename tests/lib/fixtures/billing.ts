/**
 * @file Фікстури для тестування білінгу, підписок та квот.
 * @description Цей файл містить набір готових об'єктів (моків) для симуляції
 * різних станів підписок та квот у тестах. Використання цих фікстур
 * забезпечує консистентність та передбачуваність тестових сценаріїв.
 */

import type { Database } from "@/shared/lib/types/database";
import { mockWorkspaceId } from "./workspaces";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type WorkspaceQuota = Database["public"]["Tables"]["workspace_quotas"]["Row"];

/**
 * @constant mockSubscriptionId
 * @description Стандартний UUID для тестової підписки.
 */
export const mockSubscriptionId = "55555555-5555-5555-5555-555555555555";

/**
 * @constant mockFreeSubscription
 * @description Мок підписки на безкоштовному тарифі (`free`).
 * Симулює активну підписку без додаткових модулів.
 */
export const mockFreeSubscription: Subscription = {
  id: mockSubscriptionId,
  workspace_id: mockWorkspaceId,
  tier: "free",
  status: "active",
  billing_period: "monthly",
  current_period_start: "2024-01-01T00:00:00Z",
  current_period_end: "2024-02-01T00:00:00Z",
  trial_ends_at: null,
  cancelled_at: null,
  payment_provider: null,
  external_subscription_id: null,
  enabled_modules: [],
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

/**
 * @constant mockStarterSubscription
 * @description Мок підписки на тарифі `starter`.
 * Симулює підписку, що оплачується через платіжну систему Paddle.
 */
export const mockStarterSubscription: Subscription = {
  ...mockFreeSubscription,
  id: "66666666-6666-6666-6666-666666666666",
  tier: "starter",
  billing_period: "monthly",
  payment_provider: "paddle",
  external_subscription_id: "sub_123456",
};

/**
 * @constant mockProSubscription
 * @description Мок підписки на тарифі `pro` з річною оплатою.
 */
export const mockProSubscription: Subscription = {
  ...mockFreeSubscription,
  id: "77777777-7777-7777-7777-777777777777",
  tier: "pro",
  billing_period: "annual",
  payment_provider: "paddle",
  external_subscription_id: "sub_789012",
};

/**
 * @constant mockCancelledSubscription
 * @description Мок скасованої підписки.
 */
export const mockCancelledSubscription: Subscription = {
  ...mockFreeSubscription,
  id: "88888888-8888-8888-8888-888888888888",
  status: "cancelled",
  cancelled_at: "2024-12-15T00:00:00Z",
};

/**
 * @constant mockFreeQuota
 * @description Мок квот для безкоштовного тарифу (`free`).
 * Містить базові ліміти та невелике поточне використання.
 */
export const mockFreeQuota: WorkspaceQuota = {
  workspace_id: mockWorkspaceId,
  max_users: 2,
  max_contacts: 100,
  max_deals: 50,
  max_storage_mb: 500,
  current_users: 1,
  current_contacts: 25,
  current_deals: 10,
  current_storage_mb: 50,
  updated_at: "2024-01-01T00:00:00Z",
};

/**
 * @constant mockStarterQuota
 * @description Мок квот для тарифу `starter`.
 */
export const mockStarterQuota: WorkspaceQuota = {
  workspace_id: mockWorkspaceId,
  max_users: 5,
  max_contacts: 5000,
  max_deals: 1000,
  max_storage_mb: 5120,
  current_users: 3,
  current_contacts: 500,
  current_deals: 150,
  current_storage_mb: 1000,
  updated_at: "2024-01-01T00:00:00Z",
};

/**
 * @constant mockProQuota
 * @description Мок квот для тарифу `pro`.
 */
export const mockProQuota: WorkspaceQuota = {
  workspace_id: mockWorkspaceId,
  max_users: 20,
  max_contacts: 50000,
  max_deals: 10000,
  max_storage_mb: 51200,
  current_users: 10,
  current_contacts: 10000,
  current_deals: 2000,
  current_storage_mb: 10000,
  updated_at: "2024-01-01T00:00:00Z",
};

/**
 * @constant mockQuotaAtLimit
 * @description Мок квот, де поточне використання досягло максимальних лімітів.
 * Використовується для тестування логіки блокування створення нових сутностей.
 */
export const mockQuotaAtLimit: WorkspaceQuota = {
  workspace_id: mockWorkspaceId,
  max_users: 2,
  max_contacts: 100,
  max_deals: 50,
  max_storage_mb: 500,
  current_users: 2,
  current_contacts: 100,
  current_deals: 50,
  current_storage_mb: 500,
  updated_at: "2024-01-01T00:00:00Z",
};

/**
 * @constant mockQuotaExceeded
 * @description Мок квот, де поточне використання перевищує ліміти.
 * Використовується для тестування сценаріїв пониження тарифу (downgrade),
 * коли потрібно попередити користувача про перевищення.
 */
export const mockQuotaExceeded: WorkspaceQuota = {
  workspace_id: mockWorkspaceId,
  max_users: 2,
  max_contacts: 100,
  max_deals: 50,
  max_storage_mb: 500,
  current_users: 5, // Ліміт перевищено!
  current_contacts: 250, // Ліміт перевищено!
  current_deals: 75, // Ліміт перевищено!
  current_storage_mb: 1000, // Ліміт перевищено!
  updated_at: "2024-01-01T00:00:00Z",
};
