import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}