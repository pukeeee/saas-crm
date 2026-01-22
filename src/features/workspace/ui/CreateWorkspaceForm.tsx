"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createWorkspace } from "../actions/create-workspace.action";
import { Workspace } from "@/shared/stores/workspace.store";

// Початковий стан тепер включає `data`
const initialState = {
  message: "",
  error: false,
  data: null,
};

type CreateWorkspaceFormProps = {
  /**
   * Callback, що викликається після успішного створення воркспейсу.
   * @param workspace - Дані нового воркспейсу.
   */
  onSuccess?: (workspace: Workspace) => void;
};

/**
 * Окремий компонент для вмісту форми.
 */
function FormContent() {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Назва воркспейсу</Label>
        <Input
          id="name"
          name="name"
          placeholder='Наприклад, "Моя компанія"'
          required
          minLength={2}
          disabled={pending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Створення..." : "Створити воркспейс"}
      </Button>
    </>
  );
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const [state, formAction] = useFormState(createWorkspace, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.error) {
      toast.error(state.message);
    } else if (state.data) {
      // Якщо є дані - це успіх
      toast.success(state.message);
      // Викликаємо callback, якщо він переданий
      onSuccess?.(state.data);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <FormContent />
    </form>
  );
}
