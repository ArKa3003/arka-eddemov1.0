"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface CaseEditorProps {
  caseId?: string;
  onSave?: (data: CaseData) => void;
}

export interface CaseData {
  title: string;
  description: string;
  specialty: string;
}

export function CaseEditor({ caseId, onSave }: CaseEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{caseId ? "Edit Case" : "Create Case"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">Case editor placeholder</p>
        <Button onClick={() => onSave?.({ title: "", description: "", specialty: "" })}>
          Save Case
        </Button>
      </CardContent>
    </Card>
  );
}