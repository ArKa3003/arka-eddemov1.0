import { Badge } from "@/components/ui/badge";

export interface AchievementBadgeProps {
  name: string;
  icon?: string;
  unlocked?: boolean;
}

export function AchievementBadge({ name, icon, unlocked = false }: AchievementBadgeProps) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-lg border ${unlocked ? "bg-yellow-50 border-yellow-300" : "bg-gray-50 border-gray-200"}`}>
      <div className="text-4xl mb-2">{icon || "🏆"}</div>
      <Badge variant={unlocked ? "success" : "default"}>{name}</Badge>
    </div>
  );
}