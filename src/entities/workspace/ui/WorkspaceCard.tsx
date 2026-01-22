"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Workspace } from "@/shared/stores/workspace.store";
import { useWorkspace } from "@/shared/hooks/use-workspace.hook";

type WorkspaceCardProps = {
  workspace: Workspace;
};

/**
 * Картка для відображення одного воркспейсу.
 * Схожа на картку проекту в Supabase.
 */
export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const isCurrent = currentWorkspace?.id === workspace.id;

  return (
    <Card
      className={`flex flex-col transition-all hover:border-primary/60 ${
        isCurrent ? "border-2 border-primary" : ""
      }`}
    >
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-lg font-medium leading-tight">
            {workspace.name}
          </CardTitle>
          <CardDescription className="mt-1">
            <span className="font-mono text-xs">{workspace.slug}</span>
          </CardDescription>
        </div>
        {isCurrent && <Badge variant="secondary">Поточний</Badge>}
      </CardHeader>
      <CardContent className="grow">
        <p className="text-sm text-muted-foreground">
          Тут буде майбутній опис воркспейсу або статистика.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end bg-muted/40 p-3">
        {isCurrent ? (
          <Button asChild size="sm">
            <Link href="/dashboard">Перейти в панель</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWorkspace(workspace)}
          >
            Зробити поточним
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
