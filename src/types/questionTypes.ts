export type SimpleQuestion = {
  id: number;
  statement: string;
  correct_answer: string;
  image?: string; // Képútvonal a kérdéshez
};

export type MultiOption = {
  text: string;
  correct: boolean;
  image?: string; // Képútvonal az opcióhoz
};

export type MultiQuestion = {
  id: number;
  statement: string;
  options: MultiOption[];
  image?: string; // Képútvonal a kérdéshez
};

// Új típus az exam_questions.json formátumhoz
export type ExamQuestion = {
  id: number;
  source: string;
  topic: string;
  questionText: string;
  type: "single" | "multiple";
  options: string[];
  correctAnswers: number[];
  image?: string; // Képútvonal a kérdéshez
};

export type Question = SimpleQuestion | MultiQuestion | ExamQuestion;