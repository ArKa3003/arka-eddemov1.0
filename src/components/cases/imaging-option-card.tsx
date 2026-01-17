import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ImagingOptionCardProps {
  type: string;
  description: string;
  acrRating?: number;
  selected?: boolean;
  onSelect?: () => void;
}

export function ImagingOptionCard({
  type,
  description,
  acrRating,
  selected,
  onSelect,
}: ImagingOptionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${selected ? "border-blue-500 bg-blue-50" : ""}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{type}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          {acrRating !== undefined && (
            <Badge variant={acrRating >= 7 ? "success" : acrRating >= 4 ? "warning" : "error"}>
              ACR {acrRating}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}