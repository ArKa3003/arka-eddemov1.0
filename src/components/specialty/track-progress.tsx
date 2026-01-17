"use client";

export interface TrackProgressProps {
  completedModules: number;
  totalModules: number;
  milestones: { name: string; completed: boolean }[];
}

export function TrackProgress({
  completedModules,
  totalModules,
  milestones,
}: TrackProgressProps) {
  const percentage = (completedModules / totalModules) * 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Overall Progress</span>
          <span className="font-semibold">{completedModules}/{totalModules}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Milestones:</p>
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">{milestone.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}