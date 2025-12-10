import { Link } from "react-router-dom";

interface Props {
  answers: (boolean | null)[];
  totalTime?: number;
}

function EndQuiz({ answers, totalTime }: Props) {
  const correctAnswers = answers.filter((i) => i === true).length;
  const answeredQuestions = answers.filter((i) => i !== null).length;
  const percent = answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0;

  const success = percent >= 0.6;

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center">
        {success ? (
          <div
            className="card border-success mb-3"
            style={{ maxWidth: "20rem" }}
          >
            <div className="card-header text-center">Eredmény</div>
            <div className="card-body rounded-bottom text-success">
              <h5 className="card-title text-center">Sikeres kvíz!</h5>
              <p className="card-text">
                Helyes válaszok: {correctAnswers} / {answeredQuestions} (
                {(percent * 100).toFixed(1)}%)
              </p>
              {totalTime && (
                <p className="card-text">
                  <i className="bi bi-clock me-2"></i>
                  Befejezési idő: {formatTime(totalTime)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div
            className="card border-danger mb-3"
            style={{ maxWidth: "20rem" }}
          >
            <div className="card-header text-center">Eredmény</div>
            <div className="card-body rounded-bottom text-danger">
              <h5 className="card-title text-center">Nem sikerült</h5>
              <p className="card-text ">
                Helyes válaszok: {correctAnswers} / {answeredQuestions} (
                {(percent * 100).toFixed(1)}%)
              </p>
              {totalTime && (
                <p className="card-text">
                  <i className="bi bi-clock me-2"></i>
                  Befejezési idő: {formatTime(totalTime)}
                </p>
              )}
            </div>
          </div>
        )}
        <Link to="/" type="button" className="btn btn-outline-light mt-2">
          Restart
        </Link>
      </div>
    </div>
  );
}

export default EndQuiz;
