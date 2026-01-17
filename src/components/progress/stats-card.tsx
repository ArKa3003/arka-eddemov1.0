import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
        {trend && (
          <div className={`text-sm mt-2 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}