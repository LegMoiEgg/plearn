import type { Difficulty, ScoreResult, Song } from "../types";
import "./ResultScreen.css";

interface ResultScreenProps {
  song: Song;
  difficulty: Difficulty;
  result: ScoreResult;
  isNewRecord: boolean;
  onRetry: () => void;
  onMenu: () => void;
}

/** Note (Grade) aus der Genauigkeit ableiten. */
function grade(accuracy: number): string {
  if (accuracy >= 0.97) return "S";
  if (accuracy >= 0.9) return "A";
  if (accuracy >= 0.75) return "B";
  if (accuracy >= 0.6) return "C";
  if (accuracy >= 0.4) return "D";
  return "E";
}

export default function ResultScreen({
  song,
  difficulty,
  result,
  isNewRecord,
  onRetry,
  onMenu,
}: ResultScreenProps) {
  const pct = Math.round(result.accuracy * 100);

  return (
    <div className="result">
      <div className="result-grade">{grade(result.accuracy)}</div>
      <div className="result-song">
        {song.emoji} {song.title}
      </div>
      <div className="result-diff">{difficulty}</div>

      <div className="result-score">{result.score}</div>
      <div className="result-max">
        von {result.maxScore} · {pct}% Genauigkeit · beste Combo {result.combo}×
      </div>

      {isNewRecord && <div className="new-record">★ Neuer Rekord!</div>}

      <div className="stats">
        <div className="stat perfect">
          <div className="n">{result.perfect}</div>
          <div className="l">Perfect</div>
        </div>
        <div className="stat good">
          <div className="n">{result.good}</div>
          <div className="l">Good</div>
        </div>
        <div className="stat miss">
          <div className="n">{result.miss}</div>
          <div className="l">Miss</div>
        </div>
      </div>

      <div className="result-actions">
        <button className="result-btn" onClick={onMenu}>
          Menü
        </button>
        <button className="result-btn primary" onClick={onRetry}>
          Nochmal
        </button>
      </div>
    </div>
  );
}
