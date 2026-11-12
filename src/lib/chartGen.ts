// Erzeugt aus einer einfachen Melodie automatisch die drei Schwierigkeitsgrade.
//
// Idee:
//  - einfach: nur die (oberste) Melodienote, immer genau eine Taste.
//  - mittel:  Melodie + gelegentlich eine zweite Stimme (Terz darunter).
//  - schwer:  genau das, was du eingetippt hast (inkl. Akkorde),
//             bzw. ein Dreiklang, wenn du nur eine Note angegeben hast.

import type { Chart, Difficulty, NoteEvent } from "../types";

/**
 * Ein Melodie-Schritt.
 * `note` darf sein:
 *   - eine MIDI-Zahl:            67
 *   - ein Notenname als Text:    "G4"
 *   - ein Akkord als Text:       "C4+E4+G4"
 *   - mehrere Noten als Array:   [60, 64, 67] oder ["C4", "E4", "G4"]
 *   - null                        -> Pause
 * `beats` ist die Länge: 1 = Viertel, 2 = Halbe, 0.5 = Achtel.
 */
export interface Step {
  note: number | string | Array<number | string> | null;
  beats: number;
}

const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  "C#": 1,
  DB: 1,
  D: 2,
  "D#": 3,
  EB: 3,
  E: 4,
  F: 5,
  "F#": 6,
  GB: 6,
  G: 7,
  "G#": 8,
  AB: 8,
  A: 9,
  "A#": 10,
  BB: 10,
  B: 11,
};

/** Wandelt einen einzelnen Notennamen wie "G4" oder "C#5" in eine MIDI-Zahl um. */
function nameToMidi(name: string): number {
  const match = name.trim().toUpperCase().match(/^([A-G][#B]?)(-?\d+)$/);
  if (!match) {
    throw new Error(`Ungültiger Notenname: "${name}" (erwartet z. B. "G4" oder "C#5")`);
  }
  const [, letter, octaveStr] = match;
  const offset = NOTE_OFFSETS[letter];
  const octave = parseInt(octaveStr, 10);
  // MIDI: C-1 = 0, C0 = 12, C4 = 60
  return (octave + 1) * 12 + offset;
}

/** Normalisiert das `note`-Feld eines Steps zu einer Liste von MIDI-Zahlen. */
function toMidis(note: Step["note"]): number[] {
  if (note === null) return [];
  if (typeof note === "number") return [note];
  if (typeof note === "string") {
    // Akkord per "+" trennen, z. B. "C4+E4+G4"
    return note.split("+").map((part) => nameToMidi(part));
  }
  // Array aus Zahlen und/oder Namen
  return note.map((n) => (typeof n === "number" ? n : nameToMidi(n)));
}

/**
 * Baut EINE Spur direkt aus einer handgemachten Step-Liste.
 * Nimmt die Noten genau so, wie du sie eintippst (inkl. Akkorden).
 * Für eigene, von Hand erstellte Arrangements (z. B. ein Mittel-Sheet).
 */
export function buildChart(
  steps: Step[],
  bpm: number,
  difficulty: Difficulty
): Chart {
  const msPerBeat = 60000 / bpm;
  const events: NoteEvent[] = [];
  let t = 0;
  for (const step of steps) {
    const dur = step.beats * msPerBeat;
    // Doppelte Töne im selben Akkord entfernen (können durch Oktav-Faltung
    // entstehen, wenn zwei Töne auf derselben Taste landen) und sortieren.
    const midis = Array.from(new Set(toMidis(step.note))).sort((a, b) => a - b);
    if (midis.length > 0) {
      events.push({ time: t, notes: midis, duration: dur });
    }
    t += dur;
  }
  return { difficulty, events };
}

/**
 * Eigene, von Hand erstellte Spuren pro Schwierigkeit.
 * Wo gesetzt, überschreiben sie die automatisch generierte Variante.
 */
export interface ChartOverrides {
  einfach?: Step[];
  mittel?: Step[];
  schwer?: Step[];
}

/**
 * Baut die drei Charts aus einer Melodie und einem Tempo.
 * Über `overrides` kann man pro Schwierigkeit ein eigenes Arrangement
 * angeben, das die automatische Erzeugung ersetzt.
 */
export function buildCharts(
  melody: Step[],
  bpm: number,
  overrides: ChartOverrides = {}
): Record<Difficulty, Chart> {
  const msPerBeat = 60000 / bpm;

  const easy: NoteEvent[] = [];
  const medium: NoteEvent[] = [];
  const hard: NoteEvent[] = [];

  let t = 0;
  melody.forEach((step, index) => {
    const dur = step.beats * msPerBeat;
    const midis = toMidis(step.note);

    if (midis.length > 0) {
      // Höchste Note gilt als Melodieton.
      const top = Math.max(...midis);

      // einfach: nur die Melodienote.
      easy.push({ time: t, notes: [top], duration: dur });

      // mittel: auf jedem zweiten Ton eine Terz darunter dazu.
      const mediumNotes = index % 2 === 0 ? [top, top - 3] : [top];
      medium.push({ time: t, notes: mediumNotes, duration: dur });

      // schwer: genau das Eingetippte. Bei nur einer Note einen Dreiklang bauen.
      const hardNotes = midis.length > 1 ? midis : [top, top - 5, top - 9];
      hard.push({ time: t, notes: hardNotes, duration: dur });
    }
    t += dur;
  });

  return {
    einfach: overrides.einfach
      ? buildChart(overrides.einfach, bpm, "einfach")
      : { difficulty: "einfach", events: easy },
    mittel: overrides.mittel
      ? buildChart(overrides.mittel, bpm, "mittel")
      : { difficulty: "mittel", events: medium },
    schwer: overrides.schwer
      ? buildChart(overrides.schwer, bpm, "schwer")
      : { difficulty: "schwer", events: hard },
  };
}
