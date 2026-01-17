"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
          />
        ))}
      </div>
    </>
  );
}