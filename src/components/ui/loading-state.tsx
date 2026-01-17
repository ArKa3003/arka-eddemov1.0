import * as React from "react";
import { Skeleton } from "./skeleton";

export interface LoadingStateProps {
  count?: number;
}

export function LoadingState({ count = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}