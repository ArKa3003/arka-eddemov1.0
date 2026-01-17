import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CaseCardProps {
  id: string;
  title: string;
  specialty: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  completed?: boolean;
}

export function CaseCard({ id, title, specialty, difficulty, completed }: CaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge>{specialty}</Badge>
          <Badge variant={difficulty === "beginner" ? "success" : difficulty === "intermediate" ? "warning" : "error"}>
            {difficulty}
          </Badge>
          {completed && <Badge variant="success">Completed</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Case card placeholder</p>
      </CardContent>
    </Card>
  );
}