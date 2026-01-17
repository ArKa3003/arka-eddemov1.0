"use client";

export interface CaseViewerProps {
  caseId: string;
}

export function CaseViewer({ caseId }: CaseViewerProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Case Viewer: {caseId}</h2>
      <p className="mt-4 text-gray-600">Case viewer placeholder</p>
    </div>
  );
}