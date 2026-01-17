"use client";

export interface ProgressChartProps {
  data: { date: string; value: number }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-64 flex items-end justify-center gap-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-blue-500 rounded-t w-8"
          style={{ height: `${(item.value / 100) * 100}%` }}
          title={`${item.date}: ${item.value}`}
        />
      ))}
    </div>
  );
}