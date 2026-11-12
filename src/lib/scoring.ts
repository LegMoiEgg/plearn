// Bewertung von Treffern nach Timing-Genauigkeit + Highscore-Speicherung.

import type { HitRating } from "../types";

/** Zeitfenster in Millisekunden. */
export const TIMING = {
  perfect: 90, // |abweichung| <= 90ms
  good: 220, // |abweichung| <= 220ms
  // alles darüber ist ein Miss
};

/** Punkte pro Bewertung. */
export const POINTS: Record<HitRating, number> = {
  perfect: 100,
  good: 50,
  miss: 0,
};

/** Bewertet einen Tastendruck anhand der zeitlichen Abweichung (ms). */
export function rateHit(deltaMs: number): HitRating {
  const d = Math.abs(deltaMs);
  if (d <= TIMING.perfect) return "perfect";
  if (d <= TIMING.good) return "good";
  return "miss";
}

const HS_KEY = "plearn.highscores.v1";

type HighscoreMap = Record<string, number>;

function readAll(): HighscoreMap {
  try {
    const raw = localStorage.getItem(HS_KEY);
    return raw ? (JSON.parse(raw) as HighscoreMap) : {};
  } catch {
    return {};
  }
}

/** Schlüssel pro Song + Schwierigkeit. */
function key(songId: string, difficulty: string): string {
  return `${songId}:${difficulty}`;
}

export function getHighscore(songId: string, difficulty: string): number {
  return readAll()[key(songId, difficulty)] ?? 0;
}

/** Speichert einen neuen Highscore, falls er besser ist. Gibt true zurück, wenn neuer Rekord. */
export function saveHighscore(
  songId: string,
  difficulty: string,
  score: number
): boolean {
  const all = readAll();
  const k = key(songId, difficulty);
  if (score > (all[k] ?? 0)) {
    all[k] = score;
    try {
      localStorage.setItem(HS_KEY, JSON.stringify(all));
    } catch {
      /* Speicher nicht verfügbar – ignorieren */
    }
    return true;
  }
  return false;
}
