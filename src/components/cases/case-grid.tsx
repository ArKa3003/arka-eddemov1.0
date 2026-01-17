import { CaseCard } from "./case-card";
import type { CaseCardProps } from "./case-card";

export interface CaseGridProps {
  cases: CaseCardProps[];
}

export function CaseGrid({ cases }: CaseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cases.map((caseItem) => (
        <CaseCard key={caseItem.id} {...caseItem} />
      ))}
    </div>
  );
}