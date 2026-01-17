"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface HintSystemProps {
  hints: string[];
}

export function HintSystem({ hints }: HintSystemProps) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  if (hints.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Hint:</p>
          <p className="text-sm text-gray-600">{hints[currentHintIndex]}</p>
          {hints.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentHintIndex((prev) => (prev + 1) % hints.length)}
            >
              Next Hint
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}