import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FeedbackPanelProps {
  feedback: string;
  correct?: boolean;
}

export function FeedbackPanel({ feedback, correct }: FeedbackPanelProps) {
  return (
    <Card className={correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{feedback}</p>
      </CardContent>
    </Card>
  );
}