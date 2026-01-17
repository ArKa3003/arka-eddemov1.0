import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ClinicalVignetteProps {
  patientInfo: {
    age: number;
    gender: string;
    chiefComplaint: string;
    history: string;
  };
}

export function ClinicalVignette({ patientInfo }: ClinicalVignetteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Vignette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Age:</strong> {patientInfo.age}
          </div>
          <div>
            <strong>Gender:</strong> {patientInfo.gender}
          </div>
          <div>
            <strong>Chief Complaint:</strong> {patientInfo.chiefComplaint}
          </div>
          <div>
            <strong>History:</strong> {patientInfo.history}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}