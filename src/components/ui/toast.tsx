"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

export function Toast({ title, description, variant = "default" }: ToastProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-lg",
        {
          "bg-white": variant === "default",
          "bg-green-50 border-green-200": variant === "success",
          "bg-red-50 border-red-200": variant === "error",
        }
      )}
    >
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="text-sm text-gray-600">{description}</div>}
    </div>
  );
}