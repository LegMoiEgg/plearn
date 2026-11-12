// Zentrale Datentypen für die App.

/** Schwierigkeitsgrade, die pro Song angeboten werden. */
export type Difficulty = "einfach" | "mittel" | "schwer";

/**
 * Eine einzelne zu spielende Note in einem Song.
 * - `time`:   Startzeitpunkt in Millisekunden ab Songbeginn.
 * - `notes`:  Eine oder mehrere Tasten, die gleichzeitig gedrückt werden.
 *             Angegeben als MIDI-Nummer (z. B. 60 = C4).
 * - `duration`: Dauer in Millisekunden (für die fallende Note-Darstellung).
 */
export interface NoteEvent {
  time: number;
  notes: number[];
  duration: number;
}

/** Eine spielbare Spur für eine bestimmte Schwierigkeit. */
export interface Chart {
  difficulty: Difficulty;
  /** Chronologisch sortierte Noten-Events. */
  events: NoteEvent[];
}

/** Ein Song mit allen Schwierigkeitsvarianten. */
export interface Song {
  id: string;
  title: string;
  /** Anime bzw. Quelle, nur als Anzeige. */
  anime: string;
  /** Tempo in BPM, nur informativ. */
  bpm: number;
  /** Akzentfarbe für die Karte im Hauptmenü. */
  color: string;
  /** Emoji/Symbol als einfaches Cover. */
  emoji: string;
  /** Pro Schwierigkeit eine Spur. */
  charts: Record<Difficulty, Chart>;
}

/** Bewertung eines einzelnen Treffers. */
export type HitRating = "perfect" | "good" | "miss";

/** Ergebnis am Ende eines Durchlaufs. */
export interface ScoreResult {
  score: number;
  maxScore: number;
  accuracy: number; // 0..1
  perfect: number;
  good: number;
  miss: number;
  combo: number; // höchste Combo
}
