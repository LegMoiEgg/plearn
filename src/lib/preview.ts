// Vorhör-Player für das Hauptmenü.
// Spielt eine Chart zeitgesteuert über die Audio-Engine ab und kann
// jederzeit gestoppt werden. Es kann immer nur EINE Vorschau gleichzeitig
// laufen – ein neuer Start stoppt die vorherige automatisch.

import type { Chart } from "../types";
import { piano } from "./audio";

class PreviewPlayer {
  private timers: number[] = [];
  private currentId: string | null = null;
  private onEnd: ((id: string) => void) | null = null;

  /** Läuft gerade eine Vorschau für diesen Song? */
  isPlaying(id: string): boolean {
    return this.currentId === id;
  }

  /** Läuft überhaupt eine Vorschau? */
  get activeId(): string | null {
    return this.currentId;
  }

  /** Stoppt Audio + Timer, OHNE einen Callback zu feuern (interne Nutzung). */
  private teardown(): void {
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    piano.stopAll();
  }

  /**
   * Startet die Vorschau einer Chart.
   * @param id     eindeutige Song-Kennung (zum Umschalten des Buttons)
   * @param chart  die abzuspielende Spur
   * @param onEnd  Callback, wenn DIESE Vorschau endet/gestoppt wird; bekommt
   *               die id mit, damit der Aufrufer prüfen kann, ob sie noch aktuell ist.
   */
  play(id: string, chart: Chart, onEnd: (id: string) => void): void {
    // Laufende Vorschau nur abbauen, NICHT ihren Callback feuern –
    // sonst würde der direkt folgende neue Zustand wieder zurückgesetzt.
    this.teardown();
    piano.resume();

    this.currentId = id;
    this.onEnd = onEnd;

    let lastEnd = 0;
    for (const ev of chart.events) {
      const startMs = ev.time;
      const endMs = ev.time + ev.duration;
      lastEnd = Math.max(lastEnd, endMs);

      const onTimer = window.setTimeout(() => {
        ev.notes.forEach((m) => piano.noteOn(m));
      }, startMs);
      const offTimer = window.setTimeout(() => {
        ev.notes.forEach((m) => piano.noteOff(m));
      }, endMs);
      this.timers.push(onTimer, offTimer);
    }

    // Nach dem letzten Ton automatisch beenden.
    const endTimer = window.setTimeout(() => {
      this.stop();
    }, lastEnd + 300);
    this.timers.push(endTimer);
  }

  /** Stoppt die laufende Vorschau sofort und feuert ihren onEnd-Callback. */
  stop(): void {
    const endedId = this.currentId;
    const cb = this.onEnd;
    this.teardown();
    this.currentId = null;
    this.onEnd = null;
    if (cb && endedId) cb(endedId);
  }
}

export const preview = new PreviewPlayer();
