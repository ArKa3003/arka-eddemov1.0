export interface CostDisplayProps {
  cost: number;
  currency?: string;
}

export function CostDisplay({ cost, currency = "USD" }: CostDisplayProps) {
  return (
    <div className="text-lg font-semibold">
      Cost: {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(cost)}
    </div>
  );
}