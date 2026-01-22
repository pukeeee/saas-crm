"use client";

import { useEffect } from "react";
import { useWorkspace } from "@/shared/hooks/use-workspace.hook";
import { Workspace } from "@/shared/stores/workspace.store";
import { CreateWorkspaceForm } from "@/features/workspace/ui/CreateWorkspaceForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useCreateWorkspaceModal } from "@/shared/stores/create-workspace-modal.store";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { WorkspaceList } from "./WorkspaceList";

type WorkspaceClientPageProps = {
  initialWorkspaces: Workspace[];
};

/**
 * Клієнтський компонент для сторінки воркспейсів.
 * Відповідає за ініціалізацію стану, відображення списку або форми створення,
 * а також за модальне вікно створення нового воркспейсу.
 */
export function WorkspaceClientPage({
  initialWorkspaces,
}: WorkspaceClientPageProps) {
  const { workspaces, setWorkspaces, setCurrentWorkspace, addWorkspace } =
    useWorkspace();
  const { isOpen, onOpen, onClose } = useCreateWorkspaceModal();

  // Одноразова ініціалізація стору даними, отриманими з сервера.
  useEffect(() => {
    setWorkspaces(initialWorkspaces);
    if (initialWorkspaces.length > 0) {
      setCurrentWorkspace(initialWorkspaces[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasWorkspaces = workspaces && workspaces.length > 0;

  // Callback, який буде викликано після успішного створення воркспейсу
  const handleSuccess = (newWorkspace: Workspace) => {
    addWorkspace(newWorkspace);
    setCurrentWorkspace(newWorkspace); // Робимо новий воркспейс активним
    onClose(); // Закриваємо модальне вікно
  };

  return (
    <>
      {/* Діалогове вікно для створення нового воркспейсу */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити новий воркспейс</DialogTitle>
            <DialogDescription>
              Дайте назву вашому новому простору для спільної роботи.
            </DialogDescription>
          </DialogHeader>
          <CreateWorkspaceForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
        {hasWorkspaces ? (
          <div className="w-full max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Ваші воркспейси</h1>
              <Button onClick={onOpen}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Створити новий
              </Button>
            </div>
            <WorkspaceList workspaces={workspaces} />
          </div>
        ) : (
          // Якщо воркспейсів немає, показуємо вітальний блок-заглушку
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-background p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              У вас ще немає воркспейсів
            </h2>
            <p className="mt-2 text-muted-foreground">
              Створіть свій перший воркспейс, щоб почати роботу.
            </p>
            <Button className="mt-6" onClick={onOpen}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Створити воркспейс
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
