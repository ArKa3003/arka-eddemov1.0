interface AssessmentPageProps {
  params: { assessmentId: string };
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Assessment: {params.assessmentId}</h1>
      <p className="mt-4 text-gray-600">Assessment detail page placeholder</p>
    </div>
  );
}