import { Badge } from "@/components/ui/badge";

export interface TrackHeaderProps {
  title: string;
  description: string;
  progress?: number;
}

export function TrackHeader({ title, description, progress }: TrackHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}