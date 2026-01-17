"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface QuizBuilderProps {
  onSave?: (quiz: QuizData) => void;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export function QuizBuilder({ onSave }: QuizBuilderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">Quiz builder placeholder</p>
        <Button onClick={() => onSave?.({ title: "", questions: [] })}>
          Save Quiz
        </Button>
      </CardContent>
    </Card>
  );
}