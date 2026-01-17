import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CurriculumModuleProps {
  title: string;
  description: string;
  modules: number;
  completed?: boolean;
}

export function CurriculumModule({
  title,
  description,
  modules,
  completed,
}: CurriculumModuleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge>{modules} modules</Badge>
          {completed && <Badge variant="success">Completed</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}