import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ClinicalPearlProps {
  title: string;
  content: string;
}

export function ClinicalPearl({ title, content }: ClinicalPearlProps) {
  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg">💡 Clinical Pearl: {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  );
}