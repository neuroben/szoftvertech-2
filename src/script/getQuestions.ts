import type { Question, ExamQuestion } from "../types/questionTypes";

// Feltételezzük, hogy van egy shuffle függvényed:
function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function loadQuestions(count: number): Promise<Question[]> {
  try {
    // Először próbáljuk az új exam_questions.json formátumot
    const examData = await fetch("/niki-istqb/data/exam_questions.json").then((r) =>
      r.json()
    );
    
    if (Array.isArray(examData) && examData.length > 0) {
      // Ez az új formátum
      const filtered = examData.filter(
        (q: any) =>
          q.questionText &&
          Array.isArray(q.options) &&
          Array.isArray(q.correctAnswers)
      );
      return shuffle(filtered)
        .slice(0, count)
        .map((q: any) => q as ExamQuestion);
    }
  } catch (e) {
    console.log("Új formátum nem elérhető, próbáljuk a régi formátumot:", e);
  }

  try {
    // Fallback a régi formátumra
    const data = await fetch("/niki-istqb/data/Questions_save_cleaned.json").then((r) =>
      r.json()
    );
    const filtered = data.questions_full.filter(
      (q: any) =>
        q.statement &&
        (typeof q.correct_answer !== "undefined" || Array.isArray(q.options))
    );
    return shuffle(filtered)
      .slice(0, count)
      .map((q: any) => q as Question);
  } catch (e) {
    console.error("Hiba történt a kérdések betöltésekor:", e);
    alert("Nem sikerült betölteni a kérdésbankot! Nézd meg a konzolt a részletekért.");
    return [];
  }
}