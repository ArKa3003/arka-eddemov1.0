"use client";

export interface CaseTableProps {
  cases: {
    id: string;
    title: string;
    specialty: string;
    createdAt: Date;
  }[];
}

export function CaseTable({ cases }: CaseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Specialty</th>
            <th className="border p-2 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td className="border p-2">{caseItem.id}</td>
              <td className="border p-2">{caseItem.title}</td>
              <td className="border p-2">{caseItem.specialty}</td>
              <td className="border p-2">{caseItem.createdAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}