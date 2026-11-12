// Hilfsfunktionen rund um MIDI-Noten.

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/** Frequenz einer MIDI-Note in Hz (A4 = 440 Hz, MIDI 69). */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Name einer MIDI-Note, z. B. 60 -> "C4". */
export function midiToName(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

/** Ist die Taste eine schwarze Taste? */
export function isBlackKey(midi: number): boolean {
  return NOTE_NAMES[midi % 12].includes("#");
}

/** Alle MIDI-Nummern zwischen zwei Grenzen (inklusive). */
export function midiRange(from: number, to: number): number[] {
  const out: number[] = [];
  for (let m = from; m <= to; m++) out.push(m);
  return out;
}
