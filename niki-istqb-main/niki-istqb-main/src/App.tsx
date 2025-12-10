import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";

// A jobb karbantarthatóság érdekében az objektumba kivont stílusok
const styles = {
  container: {
    backgroundColor: "#181a1b",
  },
  title: {
    fontSize: "2.2rem",
    color: "#f8f9fa",
    letterSpacing: "1px",
  },
  card: {
    minWidth: 320,
    background: "#23272b",
  },
  startButton: {
    fontSize: "2rem",
    borderRadius: "2rem",
  },
};

function App() {
  const [questionCount, setQuestionCount] = useState(5);

  const handleCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestionCount(Number(e.target.value));
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={styles.container}
    >
      <div className="mb-4 text-center fw-light" style={styles.title}>
        ISTQB CTFL
      </div>

      <div className="card p-4 shadow" style={styles.card}>
        <h2 className="text-center text-light mb-4">Kvíz</h2>

        <label className="form-label text-light" htmlFor="questionCount">
          Kérdések száma:
        </label>
        <input
          id="questionCount"
          type="number"
          min={1}
          max={100}
          className="form-control mb-4 bg-light text-light"
          value={questionCount}
          onChange={handleCountChange}
        />

        <Link
          to={`/quiz?count=${questionCount}`}
          className="btn btn-outline-light btn-lg px-5 py-3 fw-bold shadow"
          style={styles.startButton}
        >
          Start
        </Link>
      </div>
    </div>
  );
}

export default App;
