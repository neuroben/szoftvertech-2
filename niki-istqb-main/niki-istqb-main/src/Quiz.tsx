import ProgressBar from "./components/ProgressBar";
import QuizCard from "./components/QuizCard";
import Timer from "./components/Timer";
import { useState, useCallback } from "react";
import { loadQuestions } from "./script/getQuestions.ts";
import { useEffect } from "react";
import type {
  Question,
  MultiOption,
} from "./types/questionTypes";
import Counter from "./components/Counter.tsx";
import EndQuiz from "./components/EndQuiz.tsx";
import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to manage quiz state
 * @param maxStatementNumber Maximum number of questions to load
 * @returns Quiz state and state updaters
 */
function useQuizState(maxStatementNumber: number) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[][]>([]); // Felhasználó tényleges válaszai
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    loadQuestions(maxStatementNumber).then((qs) => {
      setQuestions(qs);
      // Inicializáljuk az answers tömböt null értékekkel (még nem válaszolt)
      setAnswers(new Array(qs.length).fill(null));
      // Inicializáljuk a tényleges válaszok tömbjét üres tömbökkel
      setUserAnswers(new Array(qs.length).fill([]).map(() => []));
      setLoading(false);
    });
  }, [maxStatementNumber]);

  return { loading, progress, setProgress, questions, answers, setAnswers, userAnswers, setUserAnswers, totalTime, setTotalTime };
}

/**
 * Quiz component that displays questions, tracks progress and manages answers
 */
function Quiz() {
  const [searchParams] = useSearchParams();
  const maxStatementNumber = Number(searchParams.get("count")) || 5;
  const { loading, progress, setProgress, questions, answers, setAnswers, userAnswers, setUserAnswers, totalTime, setTotalTime } =
    useQuizState(maxStatementNumber);

  // Timer állapota - akkor indul el, amikor betöltötték a kérdéseket és még nem fejeződött be a kvíz
  const isTimerRunning = !loading && questions.length > 0 && progress < questions.length;

  const handleNextQuestion = (wasCorrect: boolean, selectedIndices: number[]) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[progress] = wasCorrect; // A jelenlegi pozícióra írjuk
      return newAnswers;
    });
    
    setUserAnswers((prev) => {
      const newUserAnswers = [...prev];
      newUserAnswers[progress] = selectedIndices; // Eltároljuk a tényleges választ
      return newUserAnswers;
    });
    
    // Az utolsó kérdésnél nem lépünk automatikusan tovább
    if (progress < questions.length - 1) {
      setProgress(progress + 1);
    }
  };

  // Kvíz befejezése gomb kezelése
  const handleFinishQuiz = () => {
    setProgress(questions.length); // Beállítjuk az EndQuiz megjelenítéséhez
  };

  // Progress bar kattintás kezelése
  const handleProgressClick = (index: number) => {
    // Bármelyik kérdésre navigálhatunk
    setProgress(index);
  };

  // Befejezés ellenőrzése - csak akkor fejezzük be, ha az összes kérdést megválaszoltuk
  const isQuizFinished = answers.every(answer => answer !== null);

  // A feldolgozó függvény memorizálása a szükségtelen újraszámítások elkerülése érdekében
  const parseQuestionOptions = useCallback(
    (question: Question | undefined): MultiOption[] => {
      if (!question) return [];
      
      if ("options" in question && "correctAnswers" in question) {
        // Ez az új ExamQuestion formátum
        const options = question.options.map((text, index) => ({
          text,
          correct: question.correctAnswers.includes(index),
        }));
        
        return options;
      } else if ("options" in question && Array.isArray(question.options) && question.options.length > 0 && typeof question.options[0] === "object") {
        // Ez a régi MultiQuestion formátum
        const options = question.options as MultiOption[];
        
        return options;
      } else if ("correct_answer" in question) {
        // Ez a régi SimpleQuestion formátum
        return [
          { text: "Igaz", correct: question.correct_answer === "Igaz" },
          { text: "Hamis", correct: question.correct_answer === "Hamis" },
        ];
      }
      return [];
    },
    []
  );

  // Segédfüggvény annak ellenőrzésére, hogy több helyes válasz van-e
  const hasMultipleCorrectAnswers = useCallback((question: Question | undefined): boolean => {
    if (!question) return false;
    
    if ("options" in question && "correctAnswers" in question) {
      return question.correctAnswers.length > 1;
    } else if ("options" in question && Array.isArray(question.options) && question.options.length > 0 && typeof question.options[0] === "object") {
      const options = question.options as MultiOption[];
      return options.filter(opt => opt.correct).length > 1;
    }
    return false;
  }, []);

  // Segédfüggvény a kérdés szövegének lekérdezéséhez
  const getQuestionText = (question: Question | undefined): string => {
    if (!question) return "";
    if ("questionText" in question) {
      return question.questionText;
    } else if ("statement" in question) {
      return question.statement;
    }
    return "";
  };

  // Komplex JSX kiemelése az olvashatóság javítása érdekében
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <h4>Betöltés...</h4>
        </div>
      );
    }

    // Ha befejeztük (progress >= questions.length), akkor az EndQuiz-t mutatjuk
    if (progress >= questions.length) {
      return <EndQuiz answers={answers} totalTime={totalTime} />;
    }

    if (questions.length > 0 && progress < questions.length) {
      const currentQuestion = questions[progress];
      if (!currentQuestion) {
        return <EndQuiz answers={answers} totalTime={totalTime} />;
      }
      
      return (
        <>
          <QuizCard
            statement={getQuestionText(currentQuestion)}
            options={parseQuestionOptions(currentQuestion)}
            isMultiple={hasMultipleCorrectAnswers(currentQuestion)}
            onNext={handleNextQuestion}
            previousSelection={userAnswers[progress]} // Átadjuk a korábbi választást
          />
          <Counter counter={progress} maxStaementNumber={maxStatementNumber} />
          
          {/* Leadás gomb megjelenítése, ha minden kérdésre van válasz */}
          {isQuizFinished && (
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-success btn-lg"
                onClick={handleFinishQuiz}
              >
                Leadás
              </button>
            </div>
          )}
        </>
      );
    }

    return <EndQuiz answers={answers} totalTime={totalTime} />;
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      {/* Timer a jobb felső sarokban */}
      <Timer
        isRunning={isTimerRunning}
        onTimeUpdate={setTotalTime}
        className="position-fixed top-0 end-0 m-3 bg-white text-dark rounded p-2 shadow border"
      />
      
      <div className="row">
        <div
          className="col-md-10 mx-auto"
          style={{ maxWidth: "2000px", width: "100%" }}
        >
          {renderContent()}
        </div>
      </div>

      <ProgressBar
        classN="progress-fixed-bottom"
        statementNumber={maxStatementNumber}
        progress={progress}
        answer={answers}
        onProgressClick={handleProgressClick}
      />
    </div>
  );
}

export default Quiz;
