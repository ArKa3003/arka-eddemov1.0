interface SpecialtyPageProps {
  params: { track: string };
}

export default function SpecialtyPage({ params }: SpecialtyPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Specialty: {params.track}</h1>
      <p className="mt-4 text-gray-600">Specialty track page placeholder</p>
    </div>
  );
}