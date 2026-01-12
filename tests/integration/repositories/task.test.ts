/**
 * @file Інтеграційні тести для task.repository.ts.
 * @description Ці тести перевіряють взаємодію з реальною базою даних
 * для всіх функцій репозиторію завдань, включаючи перевірку прав доступу (RLS).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as TaskRepository from "@/shared/repositories/task.repository";
import {
  createTestWorkspace,
  createTestUser,
  createTestContact,
  cleanupTestData,
} from "../../lib/helpers/db-setup";

// Тип для зручності
type TestUser = {
  id: string;
  email: string;
  client: SupabaseClient;
  role: "owner" | "manager" | "user";
};

// Змінні для тестового середовища
let owner: TestUser;
let manager: TestUser;
let user1: TestUser;
let user2: TestUser;

let workspaceId: string;
let contactId: string;
// let dealId: string;

describe.sequential("task.repository (integration)", () => {
  beforeEach(async () => {
    // 1. Створюємо воркспейс і власника
    const {
      workspace,
      userId: ownerId,
      email: ownerEmail,
      password: ownerPassword,
    } = await createTestWorkspace();
    workspaceId = workspace.id;

    // 2. Створюємо додаткових користувачів
    const managerCreds = await createTestUser(
      workspaceId,
      "manager",
      "main-manager",
    );
    const user1Creds = await createTestUser(workspaceId, "user", "user-1");
    const user2Creds = await createTestUser(workspaceId, "user", "user-2");

    // 3. Створюємо автентифіковані клієнти для кожного (за патерном з deal.test.ts)
    const authPromises = [
      { email: ownerEmail!, password: ownerPassword },
      { email: managerCreds.email, password: managerCreds.password },
      { email: user1Creds.email, password: user1Creds.password },
      { email: user2Creds.email, password: user2Creds.password },
    ].map(async (creds) => {
      const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const {
        data: { session },
        error,
      } = await anonClient.auth.signInWithPassword(creds);
      if (error)
        throw new Error(`Sign in failed for ${creds.email}: ${error.message}`);
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: { Authorization: `Bearer ${session!.access_token}` },
          },
        },
      );
    });
    const [ownerClient, managerClient, user1Client, user2Client] =
      await Promise.all(authPromises);

    // 4. Зберігаємо дані користувачів
    owner = {
      id: ownerId,
      email: ownerEmail!,
      client: ownerClient,
      role: "owner",
    };
    manager = {
      id: managerCreds.userId,
      email: managerCreds.email,
      client: managerClient,
      role: "manager",
    };
    user1 = {
      id: user1Creds.userId,
      email: user1Creds.email,
      client: user1Client,
      role: "user",
    };
    user2 = {
      id: user2Creds.userId,
      email: user2Creds.email,
      client: user2Client,
      role: "user",
    };

    // 5. Створюємо тестові сутності
    const contact = await createTestContact(workspaceId);
    contactId = contact.id;
    const { data: pipeline } = await owner.client
      .from("pipelines")
      .select("id")
      .eq("workspace_id", workspaceId)
      .single();
    if (!pipeline) throw new Error("Could not find pipeline");
    // const deal = await createTestDeal(workspaceId, pipeline.id, {
    //   owner_id: owner.id,
    // });
    // dealId = deal.id;
  }, 15000); // Збільшуємо таймаут для налаштування

  afterEach(async () => {
    await cleanupTestData();
  }, 15000);

  // --- Скелет тестів ---

  describe("create()", () => {
    it("1.1. (Happy Path): Повинен створити нове завдання з усіма необхідними полями", async () => {
      const taskData = {
        workspace_id: workspaceId,
        created_by: manager.id,
        assigned_to: user1.id,
        title: "Happy Path Task",
        task_type: "todo" as const,
        due_date: new Date().toISOString(),
        contact_id: contactId,
      };

      const createdTask = await TaskRepository.create(taskData, manager.client);

      expect(createdTask).toBeDefined();
      expect(createdTask.id).toEqual(expect.any(String));
      expect(createdTask.title).toBe("Happy Path Task");
      expect(createdTask.created_by).toBe(manager.id);
      expect(createdTask.assigned_to).toBe(user1.id);
      expect(createdTask.workspace_id).toBe(workspaceId);
    });

    it("1.2. (Permissions): `user` повинен мати можливість створити завдання і призначити його на себе", async () => {
      const taskData = {
        workspace_id: workspaceId,
        created_by: user1.id,
        assigned_to: user1.id,
        title: "User Self-Assigned Task",
        task_type: "email" as const,
        due_date: new Date().toISOString(),
      };

      const createdTask = await TaskRepository.create(taskData, user1.client);

      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe("User Self-Assigned Task");
      expect(createdTask.created_by).toBe(user1.id);
      expect(createdTask.assigned_to).toBe(user1.id);
    });

    it("1.3. (Permissions): `manager` повинен мати можливість створити завдання і призначити його на іншого `user`", async () => {
      const taskData = {
        workspace_id: workspaceId,
        created_by: manager.id,
        assigned_to: user2.id,
        title: "Manager Assigned Task",
        task_type: "call" as const,
        due_date: new Date().toISOString(),
      };

      const createdTask = await TaskRepository.create(taskData, manager.client);

      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe("Manager Assigned Task");
      expect(createdTask.assigned_to).toBe(user2.id);
    });

    it("1.4. (Data Integrity): Повинен повернути помилку при спробі створити завдання без обов'язкових полів", async () => {
      const incompleteTaskData = {
        workspace_id: workspaceId,
        // title is missing
        created_by: user1.id,
        assigned_to: user1.id,
        task_type: "todo" as const,
        due_date: new Date().toISOString(),
      };

      await expect(
        TaskRepository.create(incompleteTaskData, user1.client),
      ).rejects.toThrow(
        'null value in column "title" of relation "tasks" violates not-null constraint',
      );
    });
  });

  describe("getById()", () => {
    it("2.1. (Happy Path): Повинен повернути правильне завдання за його ID", async () => {
      // Arrange: Створюємо завдання, яке будемо шукати
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Task for getById",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );

      // Act: Викликаємо функцію getById
      const foundTask = await TaskRepository.getById(task.id, user1.client);

      // Assert: Перевіряємо, що завдання знайдено і воно відповідає створеному
      expect(foundTask).not.toBeNull();
      expect(foundTask?.id).toBe(task.id);
      expect(foundTask?.title).toBe("Task for getById");
    });

    it("2.2. (Not Found): Повинен повернути `null`, якщо ID завдання не існує", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const foundTask = await TaskRepository.getById(
        nonExistentId,
        manager.client,
      );
      expect(foundTask).toBeNull();
    });

    it("2.3. (Not Found): Повинен повернути `null`, якщо завдання було м'яко видалене", async () => {
      // Arrange: Створюємо і одразу м'яко видаляємо завдання
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user1.id,
          title: "Task to be soft-deleted",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );
      await TaskRepository.softDelete(task.id, manager.client);

      // Act: Намагаємося отримати видалене завдання
      const foundTask = await TaskRepository.getById(task.id, manager.client);

      // Assert: Очікуємо, що нічого не буде знайдено
      expect(foundTask).toBeNull();
    });
    it("2.4. (Permissions - Manager): `manager` повинен мати можливість отримати будь-яке завдання в межах свого workspace", async () => {
      // Arrange: `user1` створює завдання для себе
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Task by User1 for Manager to see",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );

      // Act: `manager` намагається отримати це завдання
      const foundTask = await TaskRepository.getById(task.id, manager.client);

      // Assert: Менеджер повинен бачити завдання
      expect(foundTask).not.toBeNull();
      expect(foundTask?.id).toBe(task.id);
    });

    it("2.5. (Permissions - User): `user` повинен мати можливість отримати завдання, призначене на нього", async () => {
      // Arrange: `manager` створює завдання для `user1`
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user1.id,
          title: "Task for User1",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act: `user1` намагається отримати своє завдання
      const foundTask = await TaskRepository.getById(task.id, user1.client);

      // Assert: `user1` повинен бачити завдання
      expect(foundTask).not.toBeNull();
      expect(foundTask?.id).toBe(task.id);
    });

    it("2.6. (Permissions - User): `user` повинен мати можливість отримати завдання, створене ним", async () => {
      // Arrange: `user1` створює завдання для `user2`
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user2.id,
          title: "Task by User1 for User2",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );

      // Act: `user1` (творець) намагається отримати це завдання
      const foundTask = await TaskRepository.getById(task.id, user1.client);

      // Assert: `user1` повинен бачити завдання, яке він створив
      expect(foundTask).not.toBeNull();
      expect(foundTask?.id).toBe(task.id);
    });

    it("2.7. (Permissions - User - Fail): `user` НЕ ПОВИНЕН отримувати завдання, призначене для іншого користувача", async () => {
      // Arrange: `manager` створює завдання для `user2`
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user2.id,
          title: "A private task for User2",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act: `user1` намагається отримати завдання, призначене для `user2`
      const foundTask = await TaskRepository.getById(task.id, user1.client);

      // Assert: `user1` не повинен бачити це завдання
      expect(foundTask).toBeNull();
    });

    it("2.8. (Permissions - Cross-Workspace - Fail): Користувач з іншого workspace НЕ ПОВИНЕН отримувати завдання", async () => {
      // Arrange: Створюємо користувача в іншому воркспейсі
      const { email: outsiderEmail, password: outsiderPassword } =
        await createTestWorkspace({ name: "Outsider Workspace" });
      const outsiderClient = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error } = await outsiderClient.auth.signInWithPassword({
        email: outsiderEmail!,
        password: outsiderPassword,
      });
      if (error) throw error;

      // Створюємо завдання в основному воркспейсі
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user1.id,
          title: "Internal Task",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act: "Чужий" користувач намагається отримати завдання
      const foundTask = await TaskRepository.getById(task.id, outsiderClient);

      // Assert: Чужий користувач не повинен бачити завдання
      expect(foundTask).toBeNull();
    });
  });

  describe("update()", () => {
    let taskToUpdate: Awaited<ReturnType<typeof TaskRepository.create>>;

    beforeEach(async () => {
      // Arrange: Створюємо одне завдання перед кожним тестом в цій групі
      taskToUpdate = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Initial Title",
          description: "Initial description",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );
    });

    it("3.1. (Happy Path): Повинен оновити поля завдання (title, description) та повернути оновлений об'єкт", async () => {
      // Act
      const updatedTask = await TaskRepository.update(
        taskToUpdate.id,
        {
          title: "Updated Title",
          description: "Updated description",
        },
        user1.client,
      );

      // Assert
      expect(updatedTask.title).toBe("Updated Title");
      expect(updatedTask.description).toBe("Updated description");
    });

    it("3.2. (Permissions - Manager): `manager` повинен мати можливість оновити будь-яке завдання", async () => {
      // Act: `manager` оновлює завдання, створене `user1`
      const updatedTask = await TaskRepository.update(
        taskToUpdate.id,
        { title: "Updated by Manager" },
        manager.client,
      );

      // Assert
      expect(updatedTask.title).toBe("Updated by Manager");
    });

    it("3.3. (Permissions - User): `user` повинен мати можливість оновити завдання, призначене на нього", async () => {
      // Act: `user1` оновлює своє ж завдання
      const updatedTask = await TaskRepository.update(
        taskToUpdate.id,
        { title: "Updated by User1" },
        user1.client,
      );

      // Assert
      expect(updatedTask.title).toBe("Updated by User1");
    });

    it("3.4. (Permissions - User - Fail): `user` НЕ ПОВИНЕН мати можливість оновити завдання, призначене на іншого", async () => {
      // Arrange: `manager` створює завдання для `user2`
      const taskForUser2 = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user2.id,
          title: "Task for User 2",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act & Assert: `user1` намагається оновити завдання `user2`.
      // Очікуємо, що це призведе до помилки, оскільки RLS політика не знайде рядок для оновлення.
      await expect(
        TaskRepository.update(
          taskForUser2.id,
          { title: "Hacked by User1" },
          user1.client,
        ),
      ).rejects.toThrow();
    });

    it("3.5. (Data Integrity): `updated_at` timestamp повинен автоматично оновлюватися", async () => {
      const originalUpdatedAt = new Date(taskToUpdate.updated_at).getTime();

      // Act: Чекаємо трохи, щоб гарантувати різницю в часі
      await new Promise((resolve) => setTimeout(resolve, 50));
      const updatedTask = await TaskRepository.update(
        taskToUpdate.id,
        { title: "Timestamp Test" },
        user1.client,
      );
      const newUpdatedAt = new Date(updatedTask.updated_at).getTime();

      // Assert
      expect(newUpdatedAt).toBeGreaterThan(originalUpdatedAt);
    });
  });

  describe("softDelete()", () => {
    let taskToDelete: Awaited<ReturnType<typeof TaskRepository.create>>;

    beforeEach(async () => {
      // Arrange: Створюємо завдання, яке будемо видаляти
      taskToDelete = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Task to be deleted",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );
    });

    it("4.1. (Happy Path - Manager): `manager` повинен мати можливість м'яко видалити завдання", async () => {
      // Act
      const deletedTask = await TaskRepository.softDelete(
        taskToDelete.id,
        manager.client,
      );

      // Assert
      expect(deletedTask).not.toBeNull();
      expect(deletedTask.deleted_at).not.toBeNull();
    });

    it("4.2. (Side-effect): Після видалення, `getById` повинен повертати `null`", async () => {
      // Act
      await TaskRepository.softDelete(taskToDelete.id, manager.client);
      const result = await TaskRepository.getById(
        taskToDelete.id,
        manager.client,
      );

      // Assert
      expect(result).toBeNull();
    });

    it("4.3. (Permissions - User - FAIL): `user` НЕ ПОВИНЕН мати можливість м'яко видалити завдання, навіть призначене на нього", async () => {
      // Act & Assert: `user` намагається видалити своє завдання.
      // RLS політика на DELETE не дозволяє цього, тому репозиторій має кинути помилку.
      await expect(
        TaskRepository.softDelete(taskToDelete.id, user1.client),
      ).rejects.toThrow();
    });
  });

  describe("markAsCompleted()", () => {
    it("5.1. (Happy Path): Повинен оновити статус на 'completed' і заповнити `completed_at`", async () => {
      // Arrange
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Task to complete",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        user1.client,
      );

      // Act
      const completedTask = await TaskRepository.markAsCompleted(
        task.id,
        user1.client,
      );

      // Assert
      expect(completedTask.status).toBe("completed");
      expect(completedTask.completed_at).not.toBeNull();
    });

    it("5.2. (Permissions - User): `user` повинен мати можливість завершити завдання, призначене на нього", async () => {
      // Arrange
      const task = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user1.id,
          title: "Task for User1 to complete",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act
      const completedTask = await TaskRepository.markAsCompleted(
        task.id,
        user1.client,
      );

      // Assert
      expect(completedTask.status).toBe("completed");
    });

    it("5.3. (Permissions - User - Fail): `user` НЕ ПОВИНЕН мати можливість завершити завдання, призначене на іншого", async () => {
      // Arrange
      const taskForUser2 = await TaskRepository.create(
        {
          workspace_id: workspaceId,
          created_by: manager.id,
          assigned_to: user2.id,
          title: "Task for User2",
          task_type: "todo",
          due_date: new Date().toISOString(),
        },
        manager.client,
      );

      // Act & Assert
      await expect(
        TaskRepository.markAsCompleted(taskForUser2.id, user1.client),
      ).rejects.toThrow();
    });
  });

  describe("getByWorkspaceId()", () => {
    beforeEach(async () => {
      // Arrange: Створюємо набір завдань для тестування фільтрації та прав доступу
      const tasksToCreate = [
        // Завдання для user1
        {
          created_by: user1.id,
          assigned_to: user1.id,
          title: "U1-U1 pending",
          status: "pending" as const,
          priority: "high" as const,
          task_type: "email" as const,
        },
        {
          created_by: manager.id,
          assigned_to: user1.id,
          title: "M-U1 completed",
          status: "completed" as const,
          priority: "low" as const,
          task_type: "todo" as const,
        },
        // Завдання для user2
        {
          created_by: manager.id,
          assigned_to: user2.id,
          title: "M-U2 pending",
          status: "pending" as const,
          priority: "medium" as const,
          task_type: "call" as const,
        },
        // Завдання, створене user1 для user2
        {
          created_by: user1.id,
          assigned_to: user2.id,
          title: "U1-U2 in_progress",
          status: "in_progress" as const,
          priority: "high" as const,
          task_type: "meeting" as const,
        },
      ];

      const clients: Record<string, SupabaseClient> = {
        [manager.id]: manager.client,
        [user1.id]: user1.client,
      };

      for (const task of tasksToCreate) {
        await TaskRepository.create(
          {
            ...task,
            workspace_id: workspaceId,
            due_date: new Date().toISOString(),
          },
          clients[task.created_by], // Створюємо від імені відповідного користувача
        );
      }
    });

    it("6.1. (Happy Path - Manager): `manager` повинен отримати всі невидалені завдання", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        {},
        manager.client,
      );
      expect(tasks.length).toBe(4);
    });

    it("6.2. (Permissions - User): `user` повинен отримати тільки ті завдання, де він є автором або виконавцем", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        {},
        user1.client,
      );
      // user1 є автором або виконавцем у 3 завданнях
      expect(tasks.length).toBe(3);
      expect(
        tasks.every(
          (t) => t.created_by === user1.id || t.assigned_to === user1.id,
        ),
      ).toBe(true);
    });

    it("6.3. (Filtering): Повинен коректно фільтрувати за `status`", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { status: "pending" },
        manager.client,
      );
      expect(tasks.length).toBe(2);
      expect(tasks.every((t) => t.status === "pending")).toBe(true);
    });

    it("6.4. (Filtering): Повинен коректно фільтрувати за `priority`", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { priority: "high" },
        manager.client,
      );
      expect(tasks.length).toBe(2);
      expect(tasks.every((t) => t.priority === "high")).toBe(true);
    });

    it("6.5. (Filtering): Повинен коректно фільтрувати за `taskType`", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { taskType: "email" },
        manager.client,
      );
      expect(tasks.length).toBe(1);
      expect(tasks[0].task_type).toBe("email");
    });

    it("6.6. (Filtering): Повинен коректно фільтрувати за `assignedTo`", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { assignedTo: user2.id },
        manager.client,
      );
      expect(tasks.length).toBe(2);
      expect(tasks.every((t) => t.assigned_to === user2.id)).toBe(true);
    });

    it("6.7. (Pagination): Повинен коректно працювати з `limit` та `offset`", async () => {
      const firstPage = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { limit: 3, offset: 0 },
        manager.client,
      );
      expect(firstPage.length).toBe(3);

      const secondPage = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { limit: 3, offset: 3 },
        manager.client,
      );
      expect(secondPage.length).toBe(1);
    });

    it("6.8. (Empty Result): Повинен повернути порожній масив, якщо нічого не знайдено", async () => {
      const tasks = await TaskRepository.getByWorkspaceId(
        workspaceId,
        { status: "cancelled" },
        manager.client,
      );
      expect(tasks.length).toBe(0);
    });
  });

  describe("getOverdueTasks()", () => {
    beforeEach(async () => {
      // Arrange: Створюємо набір завдань з різними датами та статусами
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const tasksToCreate = [
        // Протерміноване і невиконане (повинно знайтись)
        {
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Overdue task",
          status: "pending" as const,
          due_date: yesterday.toISOString(),
        },
        // Протерміноване, але виконане (не повинно знайтись)
        {
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Overdue but completed",
          status: "completed" as const,
          due_date: yesterday.toISOString(),
        },
        // Ще не протерміноване (не повинно знайтись)
        {
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Future task",
          status: "pending" as const,
          due_date: tomorrow.toISOString(),
        },
      ];

      for (const task of tasksToCreate) {
        await TaskRepository.create(
          {
            ...task,
            workspace_id: workspaceId,
            task_type: "todo",
          },
          user1.client,
        );
      }
    });

    it("7.1. (Happy Path): Повинен повертати тільки протерміновані та невиконані завдання", async () => {
      const overdueTasks = await TaskRepository.getOverdueTasks(
        workspaceId,
        user1.id,
        user1.client,
      );
      expect(overdueTasks.length).toBe(1);
      expect(overdueTasks[0].title).toBe("Overdue task");
    });

    it("7.2. (Correctness): НЕ ПОВИНЕН повертати завдання з майбутнім `due_date`", async () => {
      const overdueTasks = await TaskRepository.getOverdueTasks(
        workspaceId,
        user1.id,
        user1.client,
      );
      expect(overdueTasks.some((t) => t.title === "Future task")).toBe(false);
    });

    it("7.3. (Correctness): НЕ ПОВИНЕН повертати завдання зі статусом `completed`", async () => {
      const overdueTasks = await TaskRepository.getOverdueTasks(
        workspaceId,
        user1.id,
        user1.client,
      );
      expect(
        overdueTasks.some((t) => t.title === "Overdue but completed"),
      ).toBe(false);
    });
  });

  describe("countByWorkspaceId()", () => {
    beforeEach(async () => {
      // Arrange: Створюємо набір завдань, аналогічний до getByWorkspaceId
      const tasksToCreate = [
        {
          created_by: user1.id,
          assigned_to: user1.id,
          title: "Task for counting",
          status: "pending" as const,
        },
        {
          created_by: manager.id,
          assigned_to: user1.id,
          title: "Task for counting",
          status: "completed" as const,
        },
        {
          created_by: manager.id,
          assigned_to: user2.id,
          title: "Task for counting",
          status: "pending" as const,
        },
        {
          created_by: user1.id,
          assigned_to: user2.id,
          title: "Task for counting",
          status: "in_progress" as const,
        },
      ];

      const clients: Record<string, SupabaseClient> = {
        [manager.id]: manager.client,
        [user1.id]: user1.client,
      };

      for (const task of tasksToCreate) {
        await TaskRepository.create(
          {
            ...task,
            title: "Task for counting",
            workspace_id: workspaceId,
            task_type: "todo",
            due_date: new Date().toISOString(),
          },
          clients[task.created_by],
        );
      }
    });

    it("8.1. (Happy Path - Manager): `manager` повинен отримати повну кількість завдань", async () => {
      const count = await TaskRepository.countByWorkspaceId(
        workspaceId,
        {},
        manager.client,
      );
      expect(count).toBe(4);
    });

    it("8.2. (Permissions - User): `user` повинен отримати кількість тільки дозволених для нього завдань", async () => {
      // user1 є автором або виконавцем у 3 завданнях
      const count = await TaskRepository.countByWorkspaceId(
        workspaceId,
        {},
        user1.client,
      );
      expect(count).toBe(3);
    });

    it("8.3. (Filtering): Повинен повернути коректну кількість при фільтрації за `status`", async () => {
      const count = await TaskRepository.countByWorkspaceId(
        workspaceId,
        { status: "pending" },
        manager.client,
      );
      expect(count).toBe(2);
    });
  });
});
