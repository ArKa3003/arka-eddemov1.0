import { ProgressBar } from "@/components/ui/progress";

export interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <ProgressBar value={percentage} />
    </div>
  );
}