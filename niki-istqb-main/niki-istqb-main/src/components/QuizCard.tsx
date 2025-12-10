import ListGroup from "./ListGroup";
import { useState, useEffect } from "react";

import type { MultiOption } from "../types/questionTypes.ts";

interface Props {
  options: MultiOption[];
  statement: string;
  isMultiple: boolean;
  onNext: (wasCorrect: boolean, selectedIndices: number[]) => void;
  previousSelection?: number[]; // Felhasználó korábbi választása
}

function QuizCard({ statement, options, isMultiple, onNext, previousSelection }: Props) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  //const [correctAnswer, setCorrectAnswer] = useState(false);

  const items = options.map((option) => option.text);

  // Ha van korábbi válasz, beállítjuk a megfelelő kiválasztott opciókat
  useEffect(() => {
    if (previousSelection && previousSelection.length > 0) {
      // Ha van korábbi választás, azt mutatjuk
      setSelectedIndices(previousSelection);
    } else {
      // Új kérdés, nincs korábbi válasz
      setSelectedIndices([]);
    }
  }, [previousSelection]);

  // Függvény a statement formázásához - \n karaktereket <br> tagekké alakítja
  const formatStatement = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  function handleExternalTrigger() {
    //const selectedItems = selectedIndices.map((i) => items[i]);
    //console.log("Kiválasztott elemek: ", selectedIndices);
    const isCorrect = checkAnswer(selectedIndices, options);
    {
      /*if (isCorrect) {
      setCorrectAnswer(true);
    } else {
      setCorrectAnswer(false);
    }*/
    }
    setSelectedIndices([]);
    onNext(isCorrect, selectedIndices);
  }

  function checkAnswer(
    selectedIndices: number[],
    options: MultiOption[]
  ): boolean {
    // Csak a helyes válaszok indexei
    const correctIndices = options
      .map((opt, idx) => (opt.correct ? idx : null))
      .filter((idx) => idx !== null) as number[];

    // Akkor helyes, ha pontosan a helyeseket és csak azokat jelölte be
    return (
      selectedIndices.length === correctIndices.length &&
      correctIndices.every((idx) => selectedIndices.includes(idx))
    );
  }

  return (
    <div className="card mb-0 rounded-top  shadow-sm">
      <div className="card-header py-3">
        <h4 className="my-0 fw-normal">{formatStatement(statement)}</h4>
        {isMultiple && (
          <div className="mt-2">
            <small className="text-muted">Több helyes válasz lehetséges</small>
          </div>
        )}
      </div>
      <div className="card-body rounded">
        <ListGroup
          items={items}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          onSelectItem={(item) => {
            console.log("Selected:", item);
          }}
        />
        <button
          type="button"
          className="w-100 btn btn-lg btn-outline-primary mt-4"
          onClick={handleExternalTrigger}
        >
          ok
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
