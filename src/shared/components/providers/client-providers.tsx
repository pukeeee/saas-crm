"use client";

/**
 * @file client-providers.tsx
 * @description Обертка для всех клиентских провайдеров
 * 
 * Это позволяет использовать Server Components в layout
 * при этом сохраняя клиентские провайдеры для интерактивности
 */

import { AuthProvider } from "@/shared/lib/context/auth-context";
import { AuthModal } from "@/widgets/auth/ui/AuthModal";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
