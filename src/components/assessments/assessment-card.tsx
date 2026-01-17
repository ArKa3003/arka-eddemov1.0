import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AssessmentCardProps {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  completed?: boolean;
}

export function AssessmentCard({
  id,
  title,
  description,
  questionsCount,
  completed,
}: AssessmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge>{questionsCount} questions</Badge>
          {completed && <Badge variant="success">Completed</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}