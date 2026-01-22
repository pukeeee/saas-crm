"use client";

import { WorkspaceCard } from "@/entities/workspace/ui/WorkspaceCard";
import { Workspace } from "@/shared/stores/workspace.store";

type WorkspaceListProps = {
  workspaces: Workspace[];
};

/**
 * Компонент-фіча для відображення списку воркспейсів.
 * Використовує `WorkspaceCard` для рендерингу кожного елемента.
 */
export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <h3 className="text-xl font-medium">У вас ще немає воркспейсів</h3>
        <p className="text-sm text-muted-foreground">
          Створіть свій перший, щоб почати роботу.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((ws) => (
        <WorkspaceCard key={ws.id} workspace={ws} />
      ))}
    </div>
  );
}
