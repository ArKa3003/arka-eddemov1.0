import { Card, CardContent } from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  type: "case" | "assessment" | "achievement";
  title: string;
  timestamp: Date;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">{activity.title}</p>
                <p className="text-xs text-gray-600 capitalize">{activity.type}</p>
              </div>
              <p className="text-xs text-gray-500">
                {activity.timestamp.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}