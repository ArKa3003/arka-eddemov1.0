"use client";

export interface CategoryBarProps {
  categories: { name: string; value: number; max: number }[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <div className="space-y-4">
      {categories.map((cat, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{cat.name}</span>
            <span className="font-semibold">{cat.value}/{cat.max}</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(cat.value / cat.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}