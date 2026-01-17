export const IMAGING_OPTIONS = [
  {
    id: "ct-head",
    type: "CT Head",
    description: "Computed Tomography of the head",
    acrRating: 9,
    radiationLevel: "high" as const,
    cost: 500,
  },
  {
    id: "mri-head",
    type: "MRI Head",
    description: "Magnetic Resonance Imaging of the head",
    acrRating: 8,
    radiationLevel: "low" as const,
    cost: 1500,
  },
  {
    id: "xray-chest",
    type: "Chest X-Ray",
    description: "Radiograph of the chest",
    acrRating: 7,
    radiationLevel: "low" as const,
    cost: 100,
  },
] as const;