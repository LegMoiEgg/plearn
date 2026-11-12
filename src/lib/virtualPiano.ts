// Übersetzt Tasten eines "Virtual Piano"-Tastatur-Layouts in Notennamen,
// die buildCharts versteht (z. B. "C5", "A#4").
//
// Standard-Virtual-Piano-Mapping (36 Tasten, 3 Oktaven):
//   Weiße Tasten (von links):
//     1 2 3 4 5 6 7 8 9 0   -> C3 D3 E3 F3 G3 A3 B3 C4 D4 E4
//     q w e r t y u i o p   -> F4 G4 A4 B4 C5 D5 E5 F5 G5 A5
//     a s d f g h j k l     -> B5 C6 D6 E6 F6 G6 A6 B6 C7
//     z x c v b n m         -> D7 E7 F7 G7 A7 B7 C8
//   Schwarze Tasten (Sonderzeichen = Shift der Zahlen, Großbuchstaben = Shift der Buchstaben):
//     ! @   $ % ^   * (     -> C#3 D#3  F#3 G#3 A#3  C#4 D#4
//     Q W   E   T Y   I O P -> F#4 G#4  A#4  C#5 D#5  F#5 G#5 A#5
//     S D   G H J   L       -> C#6 D#6  F#6 G#6 A#6  C#7
//     Z   C V B             -> D#7  F#7 G#7 A#7
//
// Hinweis: Es gibt leicht abweichende Varianten dieses Layouts. Falls eine
// Tonhöhe daneben klingt, hier das Mapping anpassen – alles an einer Stelle.

const KEY_TO_NOTE: Record<string, string> = {
  // weiße Tasten
  "1": "C3",
  "2": "D3",
  "3": "E3",
  "4": "F3",
  "5": "G3",
  "6": "A3",
  "7": "B3",
  "8": "C4",
  "9": "D4",
  "0": "E4",
  q: "F4",
  w: "G4",
  e: "A4",
  r: "B4",
  t: "C5",
  y: "D5",
  u: "E5",
  i: "F5",
  o: "G5",
  p: "A5",
  a: "B5",
  s: "C6",
  d: "D6",
  f: "E6",
  g: "F6",
  h: "G6",
  j: "A6",
  k: "B6",
  l: "C7",
  z: "D7",
  x: "E7",
  c: "F7",
  v: "G7",
  b: "A7",
  n: "B7",
  m: "C8",
  // schwarze Tasten (obere Reihen / Shift)
  "!": "C#3",
  "@": "D#3",
  $: "F#3",
  "%": "G#3",
  "^": "A#3",
  "*": "C#4",
  "(": "D#4",
  Q: "F#4",
  W: "G#4",
  E: "A#4",
  T: "C#5",
  Y: "D#5",
  I: "F#5",
  O: "G#5",
  P: "A#5",
  S: "C#6",
  D: "D#6",
  G: "F#6",
  H: "G#6",
  J: "A#6",
  L: "C#7",
  Z: "D#7",
  C: "F#7",
  V: "G#7",
  B: "A#7",
};

/** Übersetzt eine einzelne Virtual-Piano-Taste in einen Notennamen, sonst null. */
export function keyToNote(key: string): string | null {
  return KEY_TO_NOTE[key] ?? null;
}

// --- Oktav-Falten in den spielbaren Bereich des App-Klaviers (C3..C6) ---

const NOTE_OFFSETS: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5,
  "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

/** Notenname -> MIDI-Zahl (C4 = 60). */
function nameToMidi(name: string): number {
  const m = name.toUpperCase().match(/^([A-G]#?)(-?\d+)$/);
  if (!m) throw new Error(`Ungültiger Notenname: ${name}`);
  const [, letter, oct] = m;
  return (parseInt(oct, 10) + 1) * 12 + NOTE_OFFSETS[letter];
}

/** MIDI-Zahl -> Notenname. */
function midiToName(midi: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

/**
 * Faltet eine Note oktavweise in den Bereich [lowMidi, highMidi],
 * behält also die Tonhöhenklasse (C bleibt C), rückt aber in eine
 * spielbare Oktave. Standardbereich passt zum App-Klavier C3..C6.
 */
export function foldIntoRange(
  note: string,
  lowMidi = 48, // C3
  highMidi = 84 // C6
): string {
  let midi = nameToMidi(note);
  while (midi < lowMidi) midi += 12;
  while (midi > highMidi) midi -= 12;
  return midiToName(midi);
}

/** Bequemer Komplett-Schritt: Virtual-Piano-Taste -> gefalteter Notenname. */
export function keyToPlayableNote(key: string): string | null {
  const name = keyToNote(key);
  if (!name) return null;
  return foldIntoRange(name);
}
