// Song-Bibliothek. Keine Datenbank nötig: Alles liegt hier im Projekt.
//
// =========================================================================
// SO TRÄGST DU EINEN EIGENEN SONG EIN
// =========================================================================
// Ein Song ist eine Liste aus Schritten (Step[]). Jeder Schritt hat:
//   note:  die Tonhöhe       beats: die Länge
//
// Die Note kannst du auf mehrere Arten schreiben:
//   { note: "G4",        beats: 1 }    // als Name (empfohlen, am lesbarsten)
//   { note: 67,          beats: 1 }    // als MIDI-Zahl (dasselbe wie "G4")
//   { note: "C4+E4+G4",  beats: 1 }    // Akkord: mehrere Tasten gleichzeitig
//   { note: null,        beats: 1 }    // Pause (nichts spielen)
//
// Die Länge (beats):
//   1   = eine Zählzeit (Viertel)
//   2   = doppelt so lang (Halbe)
//   0.5 = halb so lang (Achtel)
//   Das Grundtempo legst du unten mit bpm fest.
//
// Namen gehen von C bis B, mit # für schwarze Tasten und Oktavzahl:
//   C4 D4 E4 F4 G4 A4 B4   (mittlere Lage)   C5 = eine Oktave höher
//   Schwarze Tasten: C#4, D#4, F#4, G#4, A#4
//
// Aus EINER eingetippten Melodie entstehen automatisch alle drei
// Schwierigkeiten (einfach/mittel/schwer). Bei schwer werden deine Akkorde
// voll übernommen; bei einfach bleibt nur die oberste Note.
// =========================================================================
//
// Hinweis zu den Chainsaw-Man-Songs weiter unten:
// Die sind als leere Vorlagen angelegt. Trage dort die Noten aus deinem
// eigenen Sheet / Tutorial ein (oder gib sie mir durch, dann fülle ich sie).

import type { Song } from "../types";
import { buildCharts, type Step } from "../lib/chartGen";

// "Sakura Morning" – ruhige, freundliche Melodie
const sakuraMorning: Step[] = [
  { note: 67, beats: 1 },
  { note: 69, beats: 1 },
  { note: 72, beats: 2 },
  { note: 71, beats: 1 },
  { note: 69, beats: 1 },
  { note: 67, beats: 2 },
  { note: 64, beats: 1 },
  { note: 65, beats: 1 },
  { note: 67, beats: 2 },
  { note: 64, beats: 2 },
];

// "Hero's Journey" – aufsteigend, heroisch
const herosJourney: Step[] = [
  { note: 60, beats: 1 },
  { note: 64, beats: 1 },
  { note: 67, beats: 1 },
  { note: 72, beats: 1 },
  { note: 71, beats: 2 },
  { note: 67, beats: 1 },
  { note: 69, beats: 1 },
  { note: 71, beats: 2 },
  { note: 72, beats: 2 },
];

// "Starlight Waltz" – wiegend, im Dreier
const starlightWaltz: Step[] = [
  { note: 62, beats: 1 },
  { note: 65, beats: 0.5 },
  { note: 69, beats: 0.5 },
  { note: 67, beats: 1 },
  { note: 65, beats: 1 },
  { note: 64, beats: 0.5 },
  { note: 62, beats: 0.5 },
  { note: 60, beats: 2 },
  { note: 64, beats: 1 },
  { note: 67, beats: 1 },
  { note: 72, beats: 2 },
];

// "Quiet Rain" – langsam, melancholisch
const quietRain: Step[] = [
  { note: 69, beats: 1 },
  { note: 67, beats: 1 },
  { note: 64, beats: 2 },
  { note: 65, beats: 1 },
  { note: 64, beats: 1 },
  { note: 62, beats: 2 },
  { note: 60, beats: 1 },
  { note: 62, beats: 1 },
  { note: 64, beats: 1 },
  { note: 65, beats: 1 },
  { note: 64, beats: 2 },
];

// ===== Chainsaw Man – deine eigenen Songs =====
// Diese Vorlagen sind absichtlich leer. Trage hier die Noten aus deinem
// eigenen Sheet/Tutorial ein. Beispielzeile zum Kopieren:
//   { note: "G4", beats: 1 },
//   { note: "C4+E4+G4", beats: 2 },   // Akkord
//   { note: null, beats: 1 },          // Pause

// Iris Out – Kenshi Yonezu (Reze Arc Movie)
const irisOut: Step[] = [
  // TODO: Noten hier eintragen
];

// In the Sea / In the Pool
// Übersetzt aus dem Easy-Tastatur-Sheet (Standard-Virtual-Piano-Mapping),
// oktavweise in den Bereich unseres Klaviers (C3..C6) gefaltet.
// Tasten-Referenz: x=E5 c=F5 z=D5 l=C5 k=B4 t=C5 e=A4 q=F4
//                  u=E5 i=F5 w=G4 0=E4 v=G5 H=G#4 j=A4 H(groß)=G#4
// "-" aus dem Sheet = Rhythmus-Abstand (längere Note bzw. kleine Pause).
const inTheSea: Step[] = [
  // x - c - x - c
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  // -x - z - l -
  { note: "E5", beats: 1 }, { note: "D5", beats: 1 }, { note: "C5", beats: 1 },
  // z - k - x - -
  { note: "D5", beats: 1 }, { note: "B4", beats: 1 }, { note: "E5", beats: 2 },
  // x t e q c t x -
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5", beats: 1 },
  // c -x - e q z t
  { note: "F5", beats: 0.5 }, { note: "E5", beats: 1 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "D5", beats: 0.5 }, { note: "C5", beats: 1 },
  // l - z - v - u t
  { note: "C5", beats: 1 }, { note: "D5", beats: 1 }, { note: "G5", beats: 1 },
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // w 0 w t u t w 0 w t u - -
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 2 },
  // x t e q c t x
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5", beats: 1 },
  // t e q c t x t e q
  { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "F5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // z t l t z q k
  { note: "D5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "D5", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "B4", beats: 1 },
  // t x t w 0 w t u t w 0
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  // w t u t w 0 w t u -
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "E5", beats: 1 },
  // x t e q c t x t
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // e q c t x t e q
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 }, { note: "F5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // z t l - z - v -
  { note: "D5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "C5", beats: 1 },
  { note: "D5", beats: 1 }, { note: "G5", beats: 1 },
  // u t w 0 w t u t w 0 w
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t u t w 0 w t u t w 0 w
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t x - u - c -
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  { note: "F5", beats: 1 },
  // x - u - c -
  { note: "E5", beats: 1 }, { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  // x - z - l - z -
  { note: "E5", beats: 1 }, { note: "D5", beats: 1 }, { note: "C5", beats: 1 },
  { note: "D5", beats: 1 },
  // k - x - u -
  { note: "B4", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // c - x - u -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // c - x - z - l -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "D5", beats: 1 },
  { note: "C5", beats: 1 },
  // z - k - z -
  { note: "D5", beats: 1 }, { note: "B4", beats: 1 }, { note: "D5", beats: 1 },
  // x - c - x -
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 }, { note: "E5", beats: 1 },
  // c - u - x -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // z - l - k - l -
  { note: "D5", beats: 1 }, { note: "C5", beats: 1 }, { note: "B4", beats: 1 },
  { note: "C5", beats: 1 },
  // z - u - u - u -
  { note: "D5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  { note: "E5", beats: 1 },
  // u - u - x - u - i -
  { note: "E5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  // c - x - u -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // c - x - u -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // c - x - z - l -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "D5", beats: 1 },
  { note: "C5", beats: 1 },
  // z - k - x - u -
  { note: "D5", beats: 1 }, { note: "B4", beats: 1 }, { note: "E5", beats: 1 },
  { note: "E5", beats: 1 },
  // c - x - u -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // c - x - z - l -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "D5", beats: 1 },
  { note: "C5", beats: 1 },
  // z - k - z -
  { note: "D5", beats: 1 }, { note: "B4", beats: 1 }, { note: "D5", beats: 1 },
  // x - c - x -
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 }, { note: "E5", beats: 1 },
  // c - u - x -
  { note: "F5", beats: 1 }, { note: "E5", beats: 1 }, { note: "E5", beats: 1 },
  // z - l - k - l -
  { note: "D5", beats: 1 }, { note: "C5", beats: 1 }, { note: "B4", beats: 1 },
  { note: "C5", beats: 1 },
  // k - j - - H -
  { note: "B4", beats: 1 }, { note: "A4", beats: 2 }, { note: "G#4", beats: 1 },
];

// In the Sea – MITTEL (eigenes Arrangement aus deinem Sheet).
// [ab] = Akkord (beide Tasten gleichzeitig). Standard-Mapping + Oktav-Faltung.
// Tasten-Referenz: q=F4 w=G4 e=A4 t=C5 u=E5 x=E5 c=F5 z=D5 l=C5 k=B4
//                  0=E4 9=D4 8=C4 7=B4 d=D5 a=B4 h=G5 v=G5 r=B4 p=A5
//                  i=F5 j=A4 %=G#4 W=G#4 O=G#4 H=G#4
const inTheSeaMedium: Step[] = [
  // [qx]-[gc]-[qx]-[qc]
  { note: "F4+E5", beats: 1 }, { note: "F6+F5", beats: 1 },
  { note: "F4+E5", beats: 1 }, { note: "F4+F5", beats: 1 },
  // -[9x]-[9z]-[sl]-
  { note: "D4+E5", beats: 1 }, { note: "D4+D5", beats: 1 }, { note: "C5+C5", beats: 1 },
  // [dz]-[ak]-[8x]--
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 }, { note: "C4+E5", beats: 2 },
  // [qx]teq[ec]t[ux]-
  { note: "F4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "A4+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+E5", beats: 1 },
  // [qc]-[9x]-eq[ez]t
  { note: "F4+F5", beats: 1 }, { note: "D4+E5", beats: 1 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "A4+D5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // [ul]-[dz]-[hv]-[0u]t
  { note: "E5+C5", beats: 1 }, { note: "D5+D5", beats: 1 }, { note: "G5+G5", beats: 1 },
  { note: "E4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // w0wtutw0wtu--
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 2 },
  // [qx]teq[ec]t[qx]
  { note: "F4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "A4+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "F4+E5", beats: 1 },
  // teq[ec]t[9x]teq
  { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "D4+E5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // [ez]t[ul]t[ez]q[ek]
  { note: "A4+D5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "E5+C5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "A4+D5", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+B4", beats: 1 },
  // t[0x]tw0wt[8u]tw0
  { note: "C5", beats: 0.5 }, { note: "E4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  // wt[7u]tw0wt[8u]-
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "B4+E5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 1 },
  // [qx]teq[ec]t[ux]t
  { note: "F4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 },
  { note: "F4", beats: 0.5 }, { note: "A4+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // eq[ec]t[9x]teq
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 }, { note: "A4+F5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "D4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // [ez]t[ul]-[dz]-[hv]-
  { note: "A4+D5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "E5+C5", beats: 1 },
  { note: "D5+D5", beats: 1 }, { note: "G5+G5", beats: 1 },
  // [0u]tw0wt[7u]tw0w
  { note: "E4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "B4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t[9u]tw0wt[8u]tw0w
  { note: "C5", beats: 0.5 }, { note: "D4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t[qx]-[eu]-[qc]-
  { note: "C5", beats: 0.5 }, { note: "F4+E5", beats: 1 }, { note: "A4+E5", beats: 1 },
  { note: "F4+F5", beats: 1 },
  // [ex]-[eu]-[ec]-
  { note: "A4+E5", beats: 1 }, { note: "A4+E5", beats: 1 }, { note: "A4+F5", beats: 1 },
  // [ex]-[dz]-[sl]-[dz]-
  { note: "A4+E5", beats: 1 }, { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 },
  { note: "D5+D5", beats: 1 },
  // [ak]-[8x]-[ru]-
  { note: "B4+B4", beats: 1 }, { note: "C4+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // [rc]-[0x]-[ru]-
  { note: "B4+F5", beats: 1 }, { note: "E4+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // [rc]-[rx]-[dz]-[sl]-
  { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "D5+D5", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [dz]-[ak]-[%z]-
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 }, { note: "G#4+D5", beats: 1 },
  // [rx]-[rc]-[7x]-
  { note: "B4+E5", beats: 1 }, { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // [Wc]-[ru]-[Wx]-
  { note: "G#4+F5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "G#4+E5", beats: 1 },
  // [dz]-[sl]-[ak]-[sl]-
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [7z]-[ru]-[ru]-[eu]
  { note: "B4+D5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  { note: "A4+E5", beats: 1 },
  // -[ru]-[ru]-[ex]-u-i
  { note: "B4+E5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "A4+E5", beats: 1 },
  { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  // -[9c]-[qx]-[eu]-
  { note: "D4+F5", beats: 1 }, { note: "F4+E5", beats: 1 }, { note: "A4+E5", beats: 1 },
  // [qc]-[qx]-[eu]-
  { note: "F4+F5", beats: 1 }, { note: "F4+E5", beats: 1 }, { note: "A4+E5", beats: 1 },
  // [ec]-[ex]-[dz]-[sl]-
  { note: "A4+F5", beats: 1 }, { note: "A4+E5", beats: 1 }, { note: "D5+D5", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [dz]-[ak]-[8x]-[ru]
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 }, { note: "C4+E5", beats: 1 },
  { note: "B4+E5", beats: 1 },
  // -[rc]-[rx]-[ru]-
  { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // [rc]-[rx]-[dz]-[sl]
  { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "D5+D5", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // -[dz]-[ak]-[%z]-
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 }, { note: "G#4+D5", beats: 1 },
  // [rx]-[rc]-[7x]-
  { note: "B4+E5", beats: 1 }, { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // [rc]-[ru]-[Wx]-
  { note: "B4+F5", beats: 1 }, { note: "B4+E5", beats: 1 }, { note: "G#4+E5", beats: 1 },
  // [dz]-[sl]-[ak]-[sl]-
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [7k]-[pj]--[OH]-
  { note: "B4+B4", beats: 1 }, { note: "A5+A4", beats: 2 }, { note: "G#4+G#4", beats: 1 },
];

// In the Sea – SCHWER (eigenes Arrangement aus deinem Sheet).
// Große Akkorde bis zu 6 Tasten. Doppelte Töne durch Oktav-Faltung werden
// im Chart-Builder automatisch zusammengefasst.
// Tasten-Referenz: q=F4 e=A4 t=C5 u=E5 f=E5 x=E5 g=F5 c=F5 9=D4 d=D5 z=D5
//                  s=C6 l=C5 a=B4 k=B4 8=C4 0=E4 w=G4 h=G5 v=G5 r=B4 i=F5
//                  %=G#4 W=G#4 7=B4 O=G#4 H=G#4 p=A5 j=A4
const inTheSeaHard: Step[] = [
  // [qetufx]-[gc]-[qfx]-[qgc]
  { note: "F4+A4+C5+E5+E5+E5", beats: 1 }, { note: "F5+F5", beats: 1 },
  { note: "F4+E5+E5", beats: 1 }, { note: "F4+F5+F5", beats: 1 },
  // -[9qetfx]-[9dz]-[sl]-
  { note: "D4+F4+A4+C5+E5+E5", beats: 1 }, { note: "D4+D5+D5", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [dz]-[ak]-[80wtfx]--
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C4+E4+G4+C5+E5+E5", beats: 2 },
  // [qetufx]teq[egc]t[ufx]-
  { note: "F4+A4+C5+E5+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+E5+E5", beats: 1 },
  // [qgc]-[9qetfx]-eq[edz]t
  { note: "F4+F5+F5", beats: 1 }, { note: "D4+F4+A4+C5+E5+E5", beats: 1 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+D5+D5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // [usl]-[dz]-[hv]-[0wtu]t
  { note: "E5+C6+C5", beats: 1 }, { note: "D5+D5", beats: 1 }, { note: "G5+G5", beats: 1 },
  { note: "E4+G4+C5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // w0wtutw0wtu--
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "E5", beats: 2 },
  // [qetufx]teq[egc]t[qufx]
  { note: "F4+A4+C5+E5+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "F4+E5+E5", beats: 1 },
  // teq[egc]t[9qefx]teq
  { note: "C5", beats: 0.5 }, { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "D4+F4+A4+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // [edz]t[usl]t[edz]q[eak]
  { note: "A4+D5+D5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+C6+C5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4+D5+D5", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+B4+B4", beats: 1 },
  // t[0wfx]tw0wt[8u]tw0
  { note: "C5", beats: 0.5 }, { note: "E4+G4+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  // wt[7u]tw0wt[8u]-
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "B4+E5", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 1 },
  // [qetufx]teq[egc]t[ufx]t
  { note: "F4+A4+C5+E5+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  // eq[egc]t[9qetfx]teq
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  { note: "A4+F5+F5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "D4+F4+A4+C5+E5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "A4", beats: 0.5 }, { note: "F4", beats: 0.5 },
  // [edz]t[usl]-[dz]-[hv]-
  { note: "A4+D5+D5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "E5+C6+C5", beats: 1 }, { note: "D5+D5", beats: 1 }, { note: "G5+G5", beats: 1 },
  // [0wtu]tw0wt[7u]tw0w
  { note: "E4+G4+C5+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "B4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t[9u]tw0wt[8u]tw0w
  { note: "C5", beats: 0.5 }, { note: "D4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  { note: "C5", beats: 0.5 }, { note: "C4+E5", beats: 0.5 }, { note: "C5", beats: 0.5 },
  { note: "G4", beats: 0.5 }, { note: "E4", beats: 0.5 }, { note: "G4", beats: 0.5 },
  // t[qetufx]-[eu]-[qeigc]-
  { note: "C5", beats: 0.5 }, { note: "F4+A4+C5+E5+E5+E5", beats: 1 },
  { note: "A4+E5", beats: 1 }, { note: "F4+A4+F5+F5", beats: 1 },
  // [eufx]-[eu]-[eigc]-
  { note: "A4+E5+E5+E5", beats: 1 }, { note: "A4+E5", beats: 1 },
  { note: "A4+F5+F5", beats: 1 },
  // [eufx]-[dz]-[sl]-[dz]-
  { note: "A4+E5+E5+E5", beats: 1 }, { note: "D5+D5", beats: 1 },
  { note: "C6+C5", beats: 1 }, { note: "D5+D5", beats: 1 },
  // [ak]-[80wrfx]-[ru]-
  { note: "B4+B4", beats: 1 }, { note: "C4+E4+G4+B4+E5+E5", beats: 1 },
  { note: "B4+E5", beats: 1 },
  // [rigc]-[0rufx]-[ru]-
  { note: "B4+F5+F5+F5", beats: 1 }, { note: "E4+B4+E5+E5+E5", beats: 1 },
  { note: "B4+E5", beats: 1 },
  // [rigc]-[rufx]-[dz]-[sl]-
  { note: "B4+F5+F5+F5", beats: 1 }, { note: "B4+E5+E5+E5", beats: 1 },
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 },
  // [dlz]-[ak]-[%W79dz]-
  { note: "D5+C5+D5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "G#4+G#4+B4+D4+D5+D5", beats: 1 },
  // [rufx]-[rugc]-[W7rufx]-
  { note: "B4+E5+E5+E5", beats: 1 }, { note: "B4+E5+F5+F5", beats: 1 },
  { note: "G#4+B4+B4+E5+E5+E5", beats: 1 },
  // [Wrugc]-[ru]-[Wrufx]-
  { note: "G#4+B4+E5+F5+F5", beats: 1 }, { note: "B4+E5", beats: 1 },
  { note: "G#4+B4+E5+E5+E5", beats: 1 },
  // [dz]-[sl]-[ak]-[sl]-
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [79qedz]-[ru]-[ru]-[eru]
  { note: "B4+B4+F4+A4+D5+D5", beats: 1 }, { note: "B4+E5", beats: 1 },
  { note: "B4+E5", beats: 1 }, { note: "A4+B4+E5", beats: 1 },
  // -[ru]-[ru]-[erufx]-u-i
  { note: "B4+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  { note: "A4+B4+E5+E5+E5", beats: 1 }, { note: "E5", beats: 1 }, { note: "F5", beats: 1 },
  // -[9ugc]-[qetufx]-[eu]-
  { note: "D4+E5+F5+F5", beats: 1 }, { note: "F4+A4+C5+E5+E5+E5", beats: 1 },
  { note: "A4+E5", beats: 1 },
  // [qeigc]-[qeufx]-[eu]-
  { note: "F4+A4+F5+F5", beats: 1 }, { note: "F4+A4+E5+E5+E5", beats: 1 },
  { note: "A4+E5", beats: 1 },
  // [eigc]-[eufx]-[dz]-[sl]-
  { note: "A4+F5+F5", beats: 1 }, { note: "A4+E5+E5+E5", beats: 1 },
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 },
  // [dz]-[ak]-[80wrfx]-[ru]
  { note: "D5+D5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C4+E4+G4+B4+E5+E5", beats: 1 }, { note: "B4+E5", beats: 1 },
  // -[rigc]-[rufx]-[ru]-
  { note: "B4+F5+F5+F5", beats: 1 }, { note: "B4+E5+E5+E5", beats: 1 },
  { note: "B4+E5", beats: 1 },
  // [rigc]-[rufx]-[dz]-[sfl]
  { note: "B4+F5+F5+F5", beats: 1 }, { note: "B4+E5+E5+E5", beats: 1 },
  { note: "D5+D5", beats: 1 }, { note: "C6+E5+C5", beats: 1 },
  // -[dlz]-[ak]-[%W79dz]-
  { note: "D5+C5+D5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "G#4+G#4+B4+D4+D5+D5", beats: 1 },
  // [rufx]-[rugc]-[W7rufx]-
  { note: "B4+E5+E5+E5", beats: 1 }, { note: "B4+E5+F5+F5", beats: 1 },
  { note: "G#4+B4+B4+E5+E5+E5", beats: 1 },
  // [rugc]-[ru]-[Wrufx]-
  { note: "B4+E5+F5+F5", beats: 1 }, { note: "B4+E5", beats: 1 },
  { note: "G#4+B4+E5+E5+E5", beats: 1 },
  // [dz]-[sl]-[ak]-[sl]-
  { note: "D5+D5", beats: 1 }, { note: "C6+C5", beats: 1 }, { note: "B4+B4", beats: 1 },
  { note: "C6+C5", beats: 1 },
  // [79qeuak]-[pj]--[OH]-
  { note: "B4+B4+F4+A4+E5+B4+B4", beats: 1 }, { note: "A5+A4", beats: 2 },
  { note: "G#4+G#4", beats: 1 },
];

// Summertime (Eve) – falls du diesen Song meinst
const summertime: Step[] = [
  // TODO: Noten hier eintragen
];

// Nur Songs mit mindestens einer eingetragenen Note landen im Menü,
// damit leere Vorlagen nicht als spielbare (aber tonlose) Karten erscheinen.
const CHAINSAW_SONGS: Song[] = [
  {
    id: "iris-out",
    title: "Iris Out",
    anime: "Chainsaw Man",
    bpm: 130,
    color: "#ff5252",
    emoji: "🪚",
    charts: buildCharts(irisOut, 130),
  },
  {
    id: "in-the-sea",
    title: "In the Sea",
    anime: "Chainsaw Man",
    bpm: 100,
    color: "#4db9e0",
    emoji: "🌊",
    // Alle drei Grade sind eigene Arrangements aus deinen Sheets.
    charts: buildCharts(inTheSea, 100, {
      mittel: inTheSeaMedium,
      schwer: inTheSeaHard,
    }),
  },
  {
    id: "summertime",
    title: "Summertime",
    anime: "Chainsaw Man",
    bpm: 120,
    color: "#ffa94d",
    emoji: "🌊",
    charts: buildCharts(summertime, 120),
  },
].filter((s) => s.charts.einfach.events.length > 0);

export const SONGS: Song[] = [
  ...CHAINSAW_SONGS,
  {
    id: "sakura-morning",
    title: "Sakura Morning",
    anime: "Slice of Life",
    bpm: 96,
    color: "#ff8fb1",
    emoji: "🌸",
    charts: buildCharts(sakuraMorning, 96),
  },
  {
    id: "heros-journey",
    title: "Hero's Journey",
    anime: "Shonen Action",
    bpm: 120,
    color: "#ffb454",
    emoji: "⚔️",
    charts: buildCharts(herosJourney, 120),
  },
  {
    id: "starlight-waltz",
    title: "Starlight Waltz",
    anime: "Fantasy",
    bpm: 108,
    color: "#8f9bff",
    emoji: "✨",
    charts: buildCharts(starlightWaltz, 108),
  },
  {
    id: "quiet-rain",
    title: "Quiet Rain",
    anime: "Drama",
    bpm: 72,
    color: "#5fd1c9",
    emoji: "🌧️",
    charts: buildCharts(quietRain, 72),
  },
];
