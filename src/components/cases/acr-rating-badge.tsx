import { Badge } from "@/components/ui/badge";

export interface ACRRatingBadgeProps {
  rating: number;
}

export function ACRRatingBadge({ rating }: ACRRatingBadgeProps) {
  const variant =
    rating >= 7 ? "success" : rating >= 4 ? "warning" : "error";
  
  return (
    <Badge variant={variant}>
      ACR {rating}
    </Badge>
  );
}