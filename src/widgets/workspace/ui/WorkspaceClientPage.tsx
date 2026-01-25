"use client";

import { useState } from "react";
import { Database } from "@/shared/lib/types/database";
import { CreateWorkspaceForm } from "@/features/workspace/ui/CreateWorkspaceForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { WorkspaceCard } from "@/entities/workspace/ui/WorkspaceCard";
import { CreateWorkspaceCard } from "@/features/workspace/ui/CreateWorkspaceButton";

type Workspace = Pick<
  Database["public"]["Tables"]["workspaces"]["Row"],
  "id" | "name" | "slug"
>;

/**
 * @description Пропси для компонента `WorkspaceClientPage`.
 * @property {Workspace[]} initialWorkspaces - Початковий список воркспейсів, отриманий від серверного компонента.
 */
type WorkspaceClientPageProps = {
  initialWorkspaces: Workspace[];
};

/**
 * Клієнтський компонент-обгортка для сторінки вибору воркспейсів.
 *
 * Відповідає за:
 * 1. Відображення списку воркспейсів або стану-заглушки, якщо воркспейсів немає.
 * 2. Управління станом модального вікна для створення нового воркспейсу.
 * 3. Передачу даних та колбеків дочірнім компонентам.
 *
 * @param {WorkspaceClientPageProps} props - Пропси компонента.
 */
export function WorkspaceClientPage({
  initialWorkspaces,
}: WorkspaceClientPageProps) {
  // Локальний стан для контролю видимості діалогового вікна створення воркспейсу.
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Джерелом правди для відображення є пропс `initialWorkspaces`,
  // який надходить із серверного компонента. Це спрощує логіку стану.
  const displayWorkspaces = initialWorkspaces;
  // const hasWorkspaces = displayWorkspaces.length > 0;

  /**
   * Обробник успішного створення воркспейсу.
   * Єдине завдання цього колбека - закрити діалогове вікно.
   * Оновлення списку воркспейсів відбувається автоматично завдяки `revalidatePath`
   * в `createWorkspaceAction`, що змушує серверний компонент-батько передати новий `initialWorkspaces`.
   */
  const handleSuccessAction = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* Діалогове вікно для створення воркспейсу.
          Його видимість контролюється станом `isDialogOpen`. */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити новий воркспейс</DialogTitle>
            <DialogDescription>
              Введіть назву для нового робочого простору
            </DialogDescription>
          </DialogHeader>
          <CreateWorkspaceForm onSuccessAction={handleSuccessAction} />
        </DialogContent>
      </Dialog>

      {/* Основний контент сторінки */}
      <div className="container max-w-6xl py-8">
        <div className="space-y-8">
          {/* Заголовок сторінки */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ваші воркспейси
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Оберіть воркспейс для роботи або створіть новий
            </p>
          </div>

          {/* Обгортка для обмеження максимальної ширини сітки */}
          <div className="mx-auto max-w-4xl">
            {/* Адаптивний контейнер для карток */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
              <CreateWorkspaceCard
                onClickAction={() => setIsDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
