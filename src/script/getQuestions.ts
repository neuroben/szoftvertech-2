import type { Question } from "../types/questionTypes";

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function loadQuestions(count: number): Promise<Question[]> {
  try {
    const data = await fetch("/szoftvertech2/questions_placeholder.json").then((r) =>
      r.json()
    );

    if (Array.isArray(data) && data.length > 0) {
      const filtered = data.filter(
        (q: any) =>
          q.id &&
          q.statement &&
          Array.isArray(q.options) &&
          q.options.length > 0
      );

      return shuffle(filtered)
        .slice(0, count)
        .map((q: any) => ({
          id: q.id,
          statement: q.statement,
          options: q.options.map((opt: any) => ({
            text: opt.text,
            correct: opt.correct,
            image: opt.image // Opció képe, ha van
          })),
          image: q.image, // Kérdés képe, ha van
          correct_answer: undefined
        } as Question));
    }
  } catch (e) {
    console.error("Hiba történt a kérdések betöltésekor:", e);
    alert("Nem sikerült betölteni a kérdésbankot! Nézd meg a konzolt a részletekért.");
  }

  return [];
}