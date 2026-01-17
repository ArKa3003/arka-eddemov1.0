export interface Case {
  id: string;
  title: string;
  description: string;
  specialty: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  patientInfo?: PatientInfo;
  imagingOptions?: ImagingOption[];
  acrRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientInfo {
  age: number;
  gender: string;
  chiefComplaint: string;
  history: string;
}

export interface ImagingOption {
  id: string;
  type: string;
  description: string;
  acrRating: number;
  radiationLevel: "low" | "moderate" | "high";
  cost: number;
}