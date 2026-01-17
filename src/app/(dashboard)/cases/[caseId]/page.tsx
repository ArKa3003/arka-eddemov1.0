interface CasePageProps {
  params: { caseId: string };
}

export default function CasePage({ params }: CasePageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Case: {params.caseId}</h1>
      <p className="mt-4 text-gray-600">Case detail page placeholder</p>
    </div>
  );
}