"use client";

import { SwitchComponent } from "@/components/ui/switch";

export interface LearningModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function LearningModeToggle({ enabled, onToggle }: LearningModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Learning Mode</span>
      <SwitchComponent checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}