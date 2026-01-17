import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PatientCardProps {
  name: string;
  age: number;
  gender: string;
  mrn?: string;
}

export function PatientCard({ name, age, gender, mrn }: PatientCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div><strong>Name:</strong> {name}</div>
          <div><strong>Age:</strong> {age}</div>
          <div><strong>Gender:</strong> {gender}</div>
          {mrn && <div><strong>MRN:</strong> {mrn}</div>}
        </div>
      </CardContent>
    </Card>
  );
}