"use client";

export interface CompetencyRadarProps {
  competencies: { name: string; value: number }[];
}

export function CompetencyRadar({ competencies }: CompetencyRadarProps) {
  return (
    <div className="flex flex-col gap-2">
      {competencies.map((comp, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{comp.name}</span>
            <span className="font-semibold">{comp.value}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${comp.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}