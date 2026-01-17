import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ResultsBreakdownProps {
  score: number;
  total: number;
  categoryScores?: Record<string, number>;
}

export function ResultsBreakdown({
  score,
  total,
  categoryScores,
}: ResultsBreakdownProps) {
  const percentage = (score / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">{score}/{total}</div>
            <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
          </div>
          {categoryScores && (
            <div className="space-y-2">
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="flex justify-between">
                  <span>{category}</span>
                  <span className="font-semibold">{score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}