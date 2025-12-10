export type SimpleQuestion = {
  id: number;
  statement: string;
  correct_answer: string;
};

export type MultiOption = {
  text: string;
  correct: boolean;
};

export type MultiQuestion = {
  id: number;
  statement: string;
  options: MultiOption[];
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
};

export type Question = SimpleQuestion | MultiQuestion | ExamQuestion;