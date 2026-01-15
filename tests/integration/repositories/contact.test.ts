/**
 * @file Комплексні інтеграційні тести для contact.repository.ts.
 * @description Ці тести перевіряють, як RLS-політики та функції репозиторію
 * працюють для різних ролей користувачів (Owner, Admin, Manager, User, Guest)
 * відповідно до матриці прав доступу для сутності "Контакти".
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as ContactRepository from "@/shared/repositories/contact.repository";
import * as CompanyRepository from "@/shared/repositories/company.repository";
import {
  createTestWorkspace,
  createTestUser,
  cleanupTestData,
} from "../../lib/helpers/db-setup";
import type { Database } from "@/shared/lib/types/database";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type Role = "owner" | "admin" | "manager" | "user" | "guest";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TestUser = {
  id: string;
  email: string;
  client: SupabaseClient;
  role: Role;
};

// Тестове середовище
let owner: TestUser;
let admin: TestUser;
let manager: TestUser;
let user: TestUser;
let guest: TestUser;
let outsider: TestUser;

let workspaceId: string;
let companyId: string;

async function createAuthenticatedClient(
  email: string,
  password: string,
): Promise<SupabaseClient> {
  await sleep(500);
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

describe.sequential("contact.repository (integration with RLS)", () => {
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

    // 2. Послідовно створюємо інших користувачів, щоб уникнути rate limit
    const usersToCreate = [
      { role: "admin", name: "contact-admin" },
      { role: "manager", name: "contact-manager" },
      { role: "user", name: "contact-user" },
      { role: "guest", name: "contact-guest" },
    ];
    
    const createdUsers: TestUser[] = [];
    for (const u of usersToCreate) {
        const creds = await createTestUser(workspaceId, u.role as Role, u.name);
        const client = await createAuthenticatedClient(creds.email, creds.password);
        createdUsers.push({
            id: creds.userId,
            email: creds.email,
            client: client,
            role: u.role as Role,
        });
    }
    [admin, manager, user, guest] = createdUsers;

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

    // 4. Створюємо компанію для тестів getByCompanyId
    const testCompany = await CompanyRepository.create(
        { workspace_id: workspaceId, name: "Test Company for Contacts", created_by: owner.id },
        owner.client,
    );
    companyId = testCompany.id;

  }, 35000);

  afterEach(async () => {
    await cleanupTestData();
  }, 15000);

  describe("create()", () => {
    it("Owner, Admin, Manager та User МОЖУТЬ створювати контакт", async () => {
      const contactData: Omit<ContactInsert, "first_name" | "last_name"> = {
        workspace_id: workspaceId,
        owner_id: user.id
      };
      
      for(const currentUser of [owner, admin, manager, user]) {
        const result = await ContactRepository.create({
            ...contactData,
            first_name: "John",
            last_name: `by ${currentUser.role}`,
            created_by: currentUser.id,
        }, currentUser.client);
        expect(result.last_name).toBe(`by ${currentUser.role}`);
      }
    });

    it("(Security) Guest НЕ МОЖЕ створювати контакт", async () => {
        const contactData: ContactInsert = {
            workspace_id: workspaceId,
            first_name: "Guest",
            last_name: "Attempt",
            created_by: guest.id,
            owner_id: guest.id,
        };
        await expect(ContactRepository.create(contactData, guest.client))
            .rejects.toThrow('new row violates row-level security policy for table "contacts"');
    });

    it("(Security) Outsider НЕ МОЖЕ створювати контакт в чужому воркспейсі", async () => {
        const contactData: ContactInsert = {
            workspace_id: workspaceId,
            first_name: "Malicious",
            last_name: "Entry",
            created_by: outsider.id,
            owner_id: outsider.id,
        };
        await expect(ContactRepository.create(contactData, outsider.client))
            .rejects.toThrow('new row violates row-level security policy for table "contacts"');
    });
  });
  
  describe("getById()", () => {
    let contactOwnedByUser: Contact;
    let contactOwnedByOwner: Contact;
    
    beforeEach(async () => {
        contactOwnedByUser = await ContactRepository.create({
            workspace_id: workspaceId,
            first_name: "Test",
            last_name: "Contact",
            created_by: user.id,
            owner_id: user.id,
        }, user.client);

        contactOwnedByOwner = await ContactRepository.create({
            workspace_id: workspaceId,
            first_name: "Owner's",
            last_name: "Contact",
            created_by: owner.id,
            owner_id: owner.id,
        }, owner.client);
    });

    it("Owner, Admin, Manager, Guest МОЖУТЬ отримати будь-який контакт за ID", async () => {
        for(const currentUser of [owner, admin, manager, guest]) {
            const result = await ContactRepository.getById(contactOwnedByUser.id, currentUser.client);
            expect(result?.id).toBe(contactOwnedByUser.id);
        }
    });

    it("User МОЖЕ отримати контакт, власником якого він є", async () => {
        const result = await ContactRepository.getById(contactOwnedByUser.id, user.client);
        expect(result?.id).toBe(contactOwnedByUser.id);
    });

    it("(Permissions with default 'all' mode) User МОЖЕ отримати чужий контакт за ID", async () => {
        const result = await ContactRepository.getById(contactOwnedByOwner.id, user.client);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(contactOwnedByOwner.id);
    });

    it("(Security) Outsider НЕ МОЖЕ отримати контакт", async () => {
        const result = await ContactRepository.getById(contactOwnedByUser.id, outsider.client);
        expect(result).toBeNull();
    });

    describe("when visibility_mode is 'own'", () => {
      beforeEach(async () => {
        // Оновлюємо налаштування воркспейсу
        const { error } = await owner.client
          .from("workspaces")
          .update({ settings: { visibility_mode: "own" } })
          .eq("id", workspaceId);
        if (error) throw error;
      });

      it("(Security) User НЕ МОЖЕ отримати контакт, власником якого він не є", async () => {
        const result = await ContactRepository.getById(contactOwnedByOwner.id, user.client);
        expect(result).toBeNull();
      });
    });
  });

  describe("update()", () => {
    let contactOwnedByUser: Contact;
    
    beforeEach(async () => {
        contactOwnedByUser = await ContactRepository.create({
            workspace_id: workspaceId,
            first_name: "Original",
            last_name: "Name",
            created_by: user.id,
            owner_id: user.id,
        }, user.client);
    });

    it("Owner, Admin, Manager МОЖУТЬ оновити будь-який контакт", async () => {
        const updatedByOwner = await ContactRepository.update(contactOwnedByUser.id, { last_name: "UpdatedByOwner" }, owner.client);
        expect(updatedByOwner.last_name).toBe("UpdatedByOwner");
        
        const updatedByAdmin = await ContactRepository.update(contactOwnedByUser.id, { last_name: "UpdatedByAdmin" }, admin.client);
        expect(updatedByAdmin.last_name).toBe("UpdatedByAdmin");

        const updatedByManager = await ContactRepository.update(contactOwnedByUser.id, { last_name: "UpdatedByManager" }, manager.client);
        expect(updatedByManager.last_name).toBe("UpdatedByManager");
    });

    it("User МОЖЕ оновити свій контакт", async () => {
        const updatedByUser = await ContactRepository.update(contactOwnedByUser.id, { last_name: "UpdatedByUser" }, user.client);
        expect(updatedByUser.last_name).toBe("UpdatedByUser");
    });

    it("(Security) User НЕ МОЖЕ оновити чужий контакт", async () => {
        const contactOwnedByOwner = await ContactRepository.create({
            workspace_id: workspaceId,
            first_name: "Owner's",
            last_name: "Contact",
            created_by: owner.id,
            owner_id: owner.id,
        }, owner.client);

        await expect(ContactRepository.update(contactOwnedByOwner.id, { last_name: "Hacked" }, user.client))
            .rejects.toThrow(); // RLS won't find the row, resulting in an error
    });

    it("(Security) Guest НЕ МОЖЕ оновити контакт", async () => {
        await expect(ContactRepository.update(contactOwnedByUser.id, { last_name: "Hacked" }, guest.client))
            .rejects.toThrow();
    });
  });
  
  describe("softDelete() & restore()", () => {
      let contact: Contact;

      beforeEach(async () => {
          contact = await ContactRepository.create({
              workspace_id: workspaceId,
              first_name: "To",
              last_name: "Delete",
              created_by: owner.id,
              owner_id: owner.id
          }, owner.client);
      });

      it("Owner, Admin, Manager МОЖУТЬ м'яко видалити контакт", async () => {
          const deleted = await ContactRepository.softDelete(contact.id, manager.client);
          expect(deleted.deleted_at).not.toBeNull();
          
          const found = await ContactRepository.getById(contact.id, manager.client);
          expect(found).toBeNull();
      });

      it("(Security) User та Guest НЕ МОЖУТЬ м'яко видалити контакт", async () => {
          await expect(ContactRepository.softDelete(contact.id, user.client))
              .rejects.toThrow();
          await expect(ContactRepository.softDelete(contact.id, guest.client))
              .rejects.toThrow();
      });

      it("Owner, Admin, Manager МОЖУТЬ відновити контакт", async () => {
        await ContactRepository.softDelete(contact.id, owner.client);

        const restored = await ContactRepository.restore(contact.id, manager.client);
        expect(restored.deleted_at).toBeNull();

        const found = await ContactRepository.getById(contact.id, manager.client);
        expect(found?.id).toBe(contact.id);
      });

      it("(Security) User та Guest НЕ МОЖУТЬ відновити контакт", async () => {
        await ContactRepository.softDelete(contact.id, owner.client);

        await expect(ContactRepository.restore(contact.id, user.client))
            .rejects.toThrow();
        await expect(ContactRepository.restore(contact.id, guest.client))
            .rejects.toThrow();
      });
  });

  describe("getByWorkspaceId() & count()", () => {
    beforeEach(async () => {
        // C1 - owned by user
        await ContactRepository.create({ workspace_id: workspaceId, first_name: "C1", last_name: "UserOwned", owner_id: user.id, created_by: user.id }, user.client);
        // C2 - owned by manager
        await ContactRepository.create({ workspace_id: workspaceId, first_name: "C2", last_name: "ManagerOwned", owner_id: manager.id, created_by: manager.id }, manager.client);
        // C3 - deleted
        const toDelete = await ContactRepository.create({ workspace_id: workspaceId, first_name: "C3", last_name: "Deleted", owner_id: owner.id, created_by: owner.id }, owner.client);
        await ContactRepository.softDelete(toDelete.id, owner.client);
    });

    it("Owner, Admin, Manager, Guest бачать ВСІ невидалені контакти", async () => {
        for(const currentUser of [owner, admin, manager, guest]) {
            const contacts = await ContactRepository.getByWorkspaceId(workspaceId, {}, currentUser.client);
            const count = await ContactRepository.count(workspaceId, {}, currentUser.client);
            expect(contacts.length).toBe(2);
            expect(count).toBe(2);
        }
    });

    it("(Permissions with default 'all' mode) User бачить ВСІ невидалені контакти", async () => {
        const contacts = await ContactRepository.getByWorkspaceId(workspaceId, {}, user.client);
        const count = await ContactRepository.count(workspaceId, {}, user.client);
        expect(contacts.length).toBe(2);
        expect(count).toBe(2);
    });

    it("(Feature) showDeleted: true ПОВЕРТАЄ видалені контакти для адмін-ролей", async () => {
        // Цей тест перевіряє, що RLS-політика дозволяє, а логіка репозиторію
        // коректно обробляє опцію `showDeleted`, повертаючи всі контакти,
        // включаючи м'яко видалені, для користувачів з відповідними правами.
        const contacts = await ContactRepository.getByWorkspaceId(workspaceId, { showDeleted: true }, owner.client);
        const count = await ContactRepository.count(workspaceId, { showDeleted: true }, owner.client);
        expect(contacts.length).toBe(3); // Очікуємо 3 (2 активних + 1 видалений)
        expect(count).toBe(3); // Очікуємо 3
    });

    it("(Security) Outsider не бачить жодного контакту", async () => {
        const contacts = await ContactRepository.getByWorkspaceId(workspaceId, {}, outsider.client);
        const count = await ContactRepository.count(workspaceId, {}, outsider.client);
        expect(contacts.length).toBe(0);
        expect(count).toBe(0);
    });

    describe("when visibility_mode is 'all'", () => {
      beforeEach(async () => {
        // Оновлюємо налаштування воркспейсу
        const { error } = await owner.client
          .from("workspaces")
          .update({ settings: { visibility_mode: "all" } })
          .eq("id", workspaceId);
        if (error) throw error;
      });

      it("(Permissions) User бачить ВСІ невидалені контакти", async () => {
        const contacts = await ContactRepository.getByWorkspaceId(
          workspaceId,
          {},
          user.client,
        );
        const count = await ContactRepository.count(
          workspaceId,
          {},
          user.client,
        );
        // C1 (від user) + C2 (від manager)
        expect(contacts.length).toBe(2);
        expect(count).toBe(2);
      });
    });
  });
  
  describe("getByCompanyId()", () => {
      beforeEach(async () => {
          // Створюємо контакти, прив'язані до companyId
          await ContactRepository.create({ workspace_id: workspaceId, company_id: companyId, first_name: "Link1", last_name: "User", owner_id: user.id, created_by: user.id }, user.client);
          await ContactRepository.create({ workspace_id: workspaceId, company_id: companyId, first_name: "Link2", last_name: "Manager", owner_id: manager.id, created_by: manager.id }, manager.client);
          // Контакт в іншій компанії
          await ContactRepository.create({ workspace_id: workspaceId, first_name: "Unlinked", last_name: "Contact", owner_id: user.id, created_by: user.id }, user.client);
      });

      it("Повертає всі контакти, прив'язані до компанії, для адмін-ролей", async () => {
          const contacts = await ContactRepository.getByCompanyId(companyId, {}, manager.client);
          expect(contacts.length).toBe(2);
      });

      it("(Permissions with default 'all' mode) Повертає всі контакти, прив'язані до компанії, для ролі User", async () => {
        const contacts = await ContactRepository.getByCompanyId(companyId, {}, user.client);
        expect(contacts.length).toBe(2);
      });
  });
});
