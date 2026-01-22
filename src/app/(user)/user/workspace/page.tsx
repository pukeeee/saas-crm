import { getWorkspaces } from "@/features/workspace/actions/get-workspaces.action";
import { WorkspaceClientPage } from "@/widgets/workspace/ui/WorkspaceClientPage";

/**
 * Серверний компонент сторінки воркспейсів.
 * Його завдання - отримати початкові дані (список воркспейсів)
 * і передати їх клієнтському компоненту для відображення та інтерактивності.
 */
export default async function WorkspacePage() {
  const workspaces = await getWorkspaces();

  return <WorkspaceClientPage initialWorkspaces={workspaces ?? []} />;
}
