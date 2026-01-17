"use client";

export interface StreakCalendarProps {
  dates: string[]; // Array of date strings that have activity
}

export function StreakCalendar({ dates }: StreakCalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 28 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (27 - index));
        const dateStr = date.toISOString().split("T")[0];
        const hasActivity = dates.includes(dateStr);

        return (
          <div
            key={index}
            className={`h-8 rounded ${hasActivity ? "bg-green-500" : "bg-gray-200"}`}
            title={dateStr}
          />
        );
      })}
    </div>
  );
}