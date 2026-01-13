/**
 * @file Комплексні інтеграційні тести для company.repository.ts.
 * @description Ці тести перевіряють, як RLS-політики та функції репозиторію
 * працюють для різних ролей користувачів (Owner, Admin, Manager, User, Guest)
 * відповідно до матриці прав доступу для сутності "Компанії".
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as CompanyRepository from "@/shared/repositories/company.repository";
import {
  createTestWorkspace,
  createTestUser,
  cleanupTestData,
} from "../../lib/helpers/db-setup";
import type { Database } from "@/shared/lib/types/database";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type Role = "owner" | "admin" | "manager" | "user" | "guest";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Тип для зручності
type TestUser = {
  id: string;
  email: string;
  client: SupabaseClient;
  role: Role;
};

// Змінні для тестового середовища
let owner: TestUser;
let admin: TestUser;
let manager: TestUser;
let user: TestUser;
let guest: TestUser;
let outsider: TestUser; // Користувач з іншого воркспейсу

let workspaceId: string;

/**
 * Автентифікує користувача і створює для нього клієнт Supabase.
 * Додано невелику затримку для уникнення перевищення ліміту запитів.
 */
async function createAuthenticatedClient(
  email: string,
  password: string,
): Promise<SupabaseClient> {
  await sleep(300); // Затримка для уникнення rate limit
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const {
    data: { session },
    error,
  } = await anonClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign in failed for ${email}: ${error.message}`);
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${session!.access_token}` } },
    },
  );
}

describe.sequential("company.repository (integration with RLS)", () => {
  beforeEach(async () => {
    // 1. Створюємо воркспейс і власника
    const {
      workspace,
      userId: ownerId,
      email: ownerEmail,
      password: ownerPassword,
    } = await createTestWorkspace();
    workspaceId = workspace.id;
    owner = {
      id: ownerId,
      email: ownerEmail!,
      client: await createAuthenticatedClient(ownerEmail!, ownerPassword),
      role: "owner",
    };

    // 2. Створюємо інших користувачів
    const adminCreds = await createTestUser(
      workspaceId,
      "admin",
      "company-admin",
    );
    admin = {
      id: adminCreds.userId,
      email: adminCreds.email,
      client: await createAuthenticatedClient(
        adminCreds.email,
        adminCreds.password,
      ),
      role: "admin",
    };

    const managerCreds = await createTestUser(
      workspaceId,
      "manager",
      "company-manager",
    );
    manager = {
      id: managerCreds.userId,
      email: managerCreds.email,
      client: await createAuthenticatedClient(
        managerCreds.email,
        managerCreds.password,
      ),
      role: "manager",
    };

    const userCreds = await createTestUser(workspaceId, "user", "company-user");
    user = {
      id: userCreds.userId,
      email: userCreds.email,
      client: await createAuthenticatedClient(
        userCreds.email,
        userCreds.password,
      ),
      role: "user",
    };

    const guestCreds = await createTestUser(
      workspaceId,
      "guest",
      "company-guest",
    );
    guest = {
      id: guestCreds.userId,
      email: guestCreds.email,
      client: await createAuthenticatedClient(
        guestCreds.email,
        guestCreds.password,
      ),
      role: "guest",
    };

    // 3. Створюємо "чужого" користувача
    const {
      userId: outsiderId,
      email: outsiderEmail,
      password: outsiderPassword,
    } = await createTestWorkspace({ name: "Outsider Workspace" });
    outsider = {
      id: outsiderId,
      email: outsiderEmail!,
      client: await createAuthenticatedClient(outsiderEmail!, outsiderPassword),
      role: "owner",
    };
  }, 35000);

  afterEach(async () => {
    await cleanupTestData();
  }, 15000);

  describe("create()", () => {
    it("Owner, Admin, Manager та User МОЖУТЬ створювати компанію", async () => {
      const companyData: CompanyInsert = {
        workspace_id: workspaceId,
        name: "Test Company",
        created_by: user.id,
      };

      const byOwner = await CompanyRepository.create(
        { ...companyData, name: "By Owner" },
        owner.client,
      );
      const byAdmin = await CompanyRepository.create(
        { ...companyData, name: "By Admin" },
        admin.client,
      );
      const byManager = await CompanyRepository.create(
        { ...companyData, name: "By Manager" },
        manager.client,
      );
      const byUser = await CompanyRepository.create(
        { ...companyData, name: "By User" },
        user.client,
      );

      expect(byOwner.name).toBe("By Owner");
      expect(byAdmin.name).toBe("By Admin");
      expect(byManager.name).toBe("By Manager");
      expect(byUser.name).toBe("By User");
    });

    it("(Security) Guest НЕ МОЖЕ створювати компанію", async () => {
      const companyData: CompanyInsert = {
        workspace_id: workspaceId,
        name: "Guest Company",
        created_by: guest.id,
      };
      await expect(
        CompanyRepository.create(companyData, guest.client),
      ).rejects.toThrow(
        'new row violates row-level security policy for table "companies"',
      );
    });

    it("(Security) Outsider НЕ МОЖЕ створити компанію в чужому воркспейсі", async () => {
      const companyData: CompanyInsert = {
        workspace_id: workspaceId,
        name: "Malicious Company",
        created_by: outsider.id,
      };
      await expect(
        CompanyRepository.create(companyData, outsider.client),
      ).rejects.toThrow(
        'new row violates row-level security policy for table "companies"',
      );
    });
  });

  describe("getById()", () => {
    let company: Company;
    let deletedCompany: Company;

    beforeEach(async () => {
      company = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "TestCo", created_by: owner.id },
        owner.client,
      );
      deletedCompany = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "DeletedCo", created_by: owner.id },
        owner.client,
      );
      await CompanyRepository.softDelete(deletedCompany.id, owner.client);
    });

    it("Owner, Admin, Manager, User та Guest МОЖУТЬ отримати компанію за ID", async () => {
      const fromOwner = await CompanyRepository.getById(
        company.id,
        owner.client,
      );
      const fromAdmin = await CompanyRepository.getById(
        company.id,
        admin.client,
      );
      const fromManager = await CompanyRepository.getById(
        company.id,
        manager.client,
      );
      const fromUser = await CompanyRepository.getById(company.id, user.client);
      const fromGuest = await CompanyRepository.getById(
        company.id,
        guest.client,
      );

      expect(fromOwner?.id).toBe(company.id);
      expect(fromAdmin?.id).toBe(company.id);
      expect(fromManager?.id).toBe(company.id);
      expect(fromUser?.id).toBe(company.id);
      expect(fromGuest?.id).toBe(company.id);
    });

    it("НЕ ПОВЕРТАЄ м'яко видалену компанію", async () => {
      const result = await CompanyRepository.getById(
        deletedCompany.id,
        owner.client,
      );
      expect(result).toBeNull();
    });

    it("(Security) Outsider НЕ МОЖЕ отримати компанію за ID", async () => {
      const result = await CompanyRepository.getById(
        company.id,
        outsider.client,
      );
      expect(result).toBeNull();
    });
  });

  describe("update()", () => {
    let companyByUser: Company;
    let companyByOwner: Company;
    let deletedCompany: Company;

    beforeEach(async () => {
      companyByUser = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "UserCorp", created_by: user.id },
        user.client,
      );
      companyByOwner = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "OwnerCorp", created_by: owner.id },
        owner.client,
      );
      deletedCompany = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "ToDelete", created_by: owner.id },
        owner.client,
      );
      await CompanyRepository.softDelete(deletedCompany.id, owner.client);
    });

    it("Owner, Admin та Manager МОЖУТЬ оновити будь-яку компанію", async () => {
      const updatedByOwner = await CompanyRepository.update(
        companyByUser.id,
        { name: "Updated by Owner" },
        owner.client,
      );
      const updatedByAdmin = await CompanyRepository.update(
        companyByUser.id,
        { name: "Updated by Admin" },
        admin.client,
      );
      const updatedByManager = await CompanyRepository.update(
        companyByOwner.id,
        { name: "Updated by Manager" },
        manager.client,
      );

      expect(updatedByOwner.name).toBe("Updated by Owner");
      expect(updatedByAdmin.name).toBe("Updated by Admin");
      expect(updatedByManager.name).toBe("Updated by Manager");
    });

    it("User МОЖЕ оновити компанію, яку створив сам", async () => {
      const updatedByUser = await CompanyRepository.update(
        companyByUser.id,
        { name: "Updated by User" },
        user.client,
      );
      expect(updatedByUser.name).toBe("Updated by User");
    });

    it("(Security) User НЕ МОЖЕ оновити компанію, створену іншим", async () => {
      await expect(
        CompanyRepository.update(
          companyByOwner.id,
          { name: "Hacked by User" },
          user.client,
        ),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });

    it("(Security) Guest НЕ МОЖЕ оновити компанію", async () => {
      await expect(
        CompanyRepository.update(
          companyByOwner.id,
          { name: "Hacked by Guest" },
          guest.client,
        ),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });

    it("(Security) Outsider НЕ МОЖЕ оновити компанію", async () => {
      await expect(
        CompanyRepository.update(
          companyByOwner.id,
          { name: "Hacked by Outsider" },
          outsider.client,
        ),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });

    it("(Security) НЕ МОЖЕ оновити м'яко видалену компанію", async () => {
      await expect(
        CompanyRepository.update(
          deletedCompany.id,
          { name: "Zombie company" },
          owner.client,
        ),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });
  });

  describe("softDelete()", () => {
    let company: Company;

    beforeEach(async () => {
      company = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "ToDelete", created_by: user.id },
        user.client,
      );
    });

    it("Owner, Admin та Manager МОЖУТЬ м'яко видалити компанію", async () => {
      const c1 = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "C1", created_by: user.id },
        user.client,
      );
      const c2 = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "C2", created_by: user.id },
        user.client,
      );

      const deletedByOwner = await CompanyRepository.softDelete(
        company.id,
        owner.client,
      );
      const deletedByAdmin = await CompanyRepository.softDelete(
        c1.id,
        admin.client,
      );
      const deletedByManager = await CompanyRepository.softDelete(
        c2.id,
        manager.client,
      );

      expect(deletedByOwner.deleted_at).not.toBeNull();
      expect(deletedByAdmin.deleted_at).not.toBeNull();
      expect(deletedByManager.deleted_at).not.toBeNull();
    });

    it("(Security) User НЕ МОЖЕ м'яко видалити компанію (навіть свою)", async () => {
      await expect(
        CompanyRepository.softDelete(company.id, user.client),
      ).rejects.toThrow(
        'new row violates row-level security policy for table "companies"',
      );
    });

    it("(Security) Guest НЕ МОЖЕ м'яко видалити компанію", async () => {
      await expect(
        CompanyRepository.softDelete(company.id, guest.client),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });

    it("(Security) Outsider НЕ МОЖЕ м'яко видалити компанію", async () => {
      await expect(
        CompanyRepository.softDelete(company.id, outsider.client),
      ).rejects.toThrow("Cannot coerce the result to a single JSON object");
    });
  });

  describe("getByWorkspaceId() & count()", () => {
    beforeEach(async () => {
      await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "C1",
          created_by: owner.id,
          status: "active",
        },
        owner.client,
      );
      await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "C2",
          created_by: user.id,
          status: "lead",
        },
        user.client,
      );
      const deleted = await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "C3",
          created_by: owner.id,
          status: "active",
        },
        owner.client,
      );
      await CompanyRepository.softDelete(deleted.id, owner.client);
    });

    it("Повертає всі невидалені компанії для будь-якої ролі в воркспейсі", async () => {
      for (const currentUser of [owner, admin, manager, user, guest]) {
        const companies = await CompanyRepository.getByWorkspaceId(
          workspaceId,
          {},
          currentUser.client,
        );
        const count = await CompanyRepository.count(
          workspaceId,
          {},
          currentUser.client,
        );
        expect(companies.length).toBe(2);
        expect(count).toBe(2);
      }
    });

    it("Повертає видалені компанії з опцією showDeleted (для адмін-ролей)", async () => {
      for (const currentUser of [owner, admin, manager]) {
        const companies = await CompanyRepository.getByWorkspaceId(
          workspaceId,
          { showDeleted: true },
          currentUser.client,
        );
        const count = await CompanyRepository.count(
          workspaceId,
          { showDeleted: true },
          currentUser.client,
        );
        expect(companies.length).toBe(3);
        expect(count).toBe(3);
      }
    });

    it("Фільтрує за статусом", async () => {
      const companies = await CompanyRepository.getByWorkspaceId(
        workspaceId,
        { status: "lead" },
        owner.client,
      );
      const count = await CompanyRepository.count(
        workspaceId,
        { status: "lead" },
        owner.client,
      );

      expect(companies.length).toBe(1);
      expect(count).toBe(1);
      expect(companies[0].name).toBe("C2");
    });

    it("(Security) Outsider не бачить жодної компанії", async () => {
      const companies = await CompanyRepository.getByWorkspaceId(
        workspaceId,
        {},
        outsider.client,
      );
      const count = await CompanyRepository.count(
        workspaceId,
        {},
        outsider.client,
      );
      expect(companies.length).toBe(0);
      expect(count).toBe(0);
    });
  });

  describe("search()", () => {
    let deletedCompany: Company;

    beforeEach(async () => {
      await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "Apple Inc",
          legal_name: "Apple Computer Inc",
          created_by: owner.id,
        },
        owner.client,
      );
      await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "Microsoft",
          legal_name: "Microsoft Corporation",
          created_by: owner.id,
        },
        owner.client,
      );
      deletedCompany = await CompanyRepository.create(
        {
          workspace_id: workspaceId,
          name: "Soft-Deleted Corp",
          created_by: owner.id,
        },
        owner.client,
      );
      await CompanyRepository.softDelete(deletedCompany.id, owner.client);
    });

    it("Знаходить компанії за назвою або юридичною назвою для будь-якої ролі", async () => {
      for (const currentUser of [owner, admin, manager, user, guest]) {
        const results = await CompanyRepository.search(
          workspaceId,
          "corp",
          currentUser.client,
        );
        expect(results.length).toBe(1);
        expect(results[0].legal_name).toBe("Microsoft Corporation");
      }
    });

    it("НЕ ПОВЕРТАЄ м'яко видалені компанії в результатах пошуку", async () => {
      const results = await CompanyRepository.search(
        workspaceId,
        "soft-deleted",
        owner.client,
      );
      expect(results.length).toBe(0);
    });

    it("(Security) Outsider не може нічого знайти", async () => {
      const results = await CompanyRepository.search(
        workspaceId,
        "apple",
        outsider.client,
      );
      expect(results.length).toBe(0);
    });
  });
});
