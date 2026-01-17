import { Badge } from "@/components/ui/badge";

export interface RadiationIndicatorProps {
  level: "low" | "moderate" | "high";
  dose?: string;
}

export function RadiationIndicator({ level, dose }: RadiationIndicatorProps) {
  const variantMap = {
    low: "success",
    moderate: "warning",
    high: "error",
  } as const;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variantMap[level]}>
        Radiation: {level.toUpperCase()}
      </Badge>
      {dose && <span className="text-sm text-gray-600">{dose}</span>}
    </div>
  );
}