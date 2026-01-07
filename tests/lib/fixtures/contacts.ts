/**
 * @file Фікстури для тестування сутностей "Контакти" та "Угоди".
 * @description Цей файл надає готові об'єкти контактів та угод для використання в тестах,
 * що дозволяє симулювати різні сценарії роботи з цими даними.
 */

import type { Database } from "@/shared/lib/types/database";
import { mockWorkspaceId, mockOwnerId } from "./workspaces";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Deal = Database["public"]["Tables"]["deals"]["Row"];

export const mockContactId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
export const mockDealId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
export const mockPipelineId = "cccccccc-cccc-cccc-cccc-cccccccccccc";

/**
 * @constant mockContact
 * @description Базовий мок контакту з усіма заповненими полями.
 * Являє собою типовий контакт в системі.
 */
export const mockContact: Contact = {
  id: mockContactId,
  workspace_id: mockWorkspaceId,
  company_id: null,
  first_name: "Іван",
  last_name: "Коваленко",
  middle_name: "Петрович",
  full_name: "Іван Коваленко Петрович",
  phones: [{ type: "mobile", number: "+380501234567", primary: true }],
  emails: [{ type: "work", email: "ivan@example.com", primary: true }],
  position: "Менеджер з продажу",
  status: "new",
  tags: ["vip", "ukraine"],
  source: "website",
  owner_id: mockOwnerId,
  custom_fields: { budget: "high" },
  created_by: mockOwnerId,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

/**
 * @constant mockQualifiedContact
 * @description Мок кваліфікованого контакту (статус `qualified`).
 */
export const mockQualifiedContact: Contact = {
  ...mockContact,
  id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
  first_name: "Марія",
  last_name: "Шевченко",
  status: "qualified",
};

/**
 * @constant mockMinimalContact
 * @description Мок контакту з мінімальним набором заповнених полів.
 * Використовується для тестування сценаріїв з неповними даними.
 */
export const mockMinimalContact: Contact = {
  id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
  workspace_id: mockWorkspaceId,
  company_id: null,
  first_name: "Олексій",
  last_name: "Бондаренко",
  middle_name: null,
  full_name: "Олексій Бондаренко",
  phones: [],
  emails: [],
  position: null,
  status: "new",
  tags: [],
  source: null,
  owner_id: null,
  custom_fields: {},
  created_by: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

/**
 * @constant mockDeal
 * @description Базовий мок угоди зі статусом `open`.
 */
export const mockDeal: Deal = {
  id: mockDealId,
  workspace_id: mockWorkspaceId,
  pipeline_id: mockPipelineId,
  stage_id: "new",
  title: "Постачання обладнання",
  amount: 50000,
  currency: "UAH",
  probability: 25,
  contact_id: mockContactId,
  company_id: null,
  owner_id: mockOwnerId,
  expected_close_date: "2024-03-01",
  actual_close_date: null,
  status: "open",
  lost_reason: null,
  tags: ["hardware", "q1-2024"],
  custom_fields: { delivery_address: "Київ" },
  created_by: mockOwnerId,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

/**
 * @constant mockWonDeal
 * @description Мок успішно виграної угоди (статус `won`).
 */
export const mockWonDeal: Deal = {
  ...mockDeal,
  id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
  stage_id: "won",
  status: "won",
  probability: 100,
  actual_close_date: "2024-02-15",
};

/**
 * @constant mockLostDeal
 * @description Мок програної угоди (статус `lost`) з вказаною причиною.
 */
export const mockLostDeal: Deal = {
  ...mockDeal,
  id: "99999999-9999-9999-9999-999999999999",
  stage_id: "lost",
  status: "lost",
  probability: 0,
  lost_reason: "Конкурент запропонував кращу ціну",
  actual_close_date: "2024-02-10",
};
