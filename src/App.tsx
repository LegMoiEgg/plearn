import { useState } from "react";
import MainMenu from "./components/MainMenu";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import type { Difficulty, ScoreResult, Song } from "./types";
import { saveHighscore } from "./lib/scoring";

type Screen =
  | { name: "menu" }
  | { name: "game"; song: Song; difficulty: Difficulty; practice: boolean }
  | {
      name: "result";
      song: Song;
      difficulty: Difficulty;
      practice: boolean;
      result: ScoreResult;
      isNewRecord: boolean;
    };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });

  const startGame = (song: Song, difficulty: Difficulty, practice: boolean) => {
    setScreen({ name: "game", song, difficulty, practice });
  };

  const finishGame = (
    song: Song,
    difficulty: Difficulty,
    practice: boolean,
    result: ScoreResult
  ) => {
    // Im Übungsmodus zählen Scores nicht für die Rekordliste.
    const isNewRecord = practice
      ? false
      : saveHighscore(song.id, difficulty, result.score);
    setScreen({ name: "result", song, difficulty, practice, result, isNewRecord });
  };

  if (screen.name === "menu") {
    return <MainMenu onSelect={startGame} />;
  }

  if (screen.name === "game") {
    return (
      <GameScreen
        key={`${screen.song.id}-${screen.difficulty}-${screen.practice}`}
        song={screen.song}
        difficulty={screen.difficulty}
        practice={screen.practice}
        onExit={() => setScreen({ name: "menu" })}
        onFinish={(result) =>
          finishGame(screen.song, screen.difficulty, screen.practice, result)
        }
      />
    );
  }

  return (
    <ResultScreen
      song={screen.song}
      difficulty={screen.difficulty}
      result={screen.result}
      isNewRecord={screen.isNewRecord}
      onRetry={() => startGame(screen.song, screen.difficulty, screen.practice)}
      onMenu={() => setScreen({ name: "menu" })}
    />
  );
}
