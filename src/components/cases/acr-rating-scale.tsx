export interface ACRRatingScaleProps {
  currentRating?: number;
}

export function ACRRatingScale({ currentRating }: ACRRatingScaleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">ACR Appropriateness:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
          <div
            key={rating}
            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold ${
              currentRating === rating
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {rating}
          </div>
        ))}
      </div>
    </div>
  );
}