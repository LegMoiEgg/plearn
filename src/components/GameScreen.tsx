import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Piano from "./Piano";
import type { Difficulty, NoteEvent, ScoreResult, Song } from "../types";
import { piano } from "../lib/audio";
import { POINTS, rateHit, TIMING } from "../lib/scoring";
import "./GameScreen.css";

interface GameScreenProps {
  song: Song;
  difficulty: Difficulty;
  /** Übungsmodus: Zurückspulen möglich, kein automatischer Abschluss. */
  practice: boolean;
  onExit: () => void;
  onFinish: (result: ScoreResult) => void;
}

// Wie viele Millisekunden im Voraus eine Note sichtbar fällt.
const LOOKAHEAD = 2200;
// Vorlaufzeit nach dem Countdown, bevor die erste Note getroffen werden muss.
const LEAD_IN = 2600;
// Wie weit ein Rewind-Schritt zurückspringt (ms).
const REWIND_STEP = 5000;
// Tastaturbereich des gezeichneten Klaviers.
const KEY_FROM = 48; // C3
const KEY_TO = 84; // C6

// Interner Zustand pro Note-Event.
interface LiveNote extends NoteEvent {
  index: number;
  /** Zeit mit LEAD_IN-Versatz; Basis für die Darstellung. */
  playTime: number;
  status: "pending" | "hit" | "missed";
  /** Bereits getroffene Teiltöne (bei Akkorden). */
  hitNotes: Set<number>;
}

interface Judgement {
  id: number;
  rating: "perfect" | "good" | "miss";
  /** Taste, an der die Bewertung angezeigt wird (MIDI). */
  midi: number;
}

export default function GameScreen({
  song,
  difficulty,
  practice,
  onExit,
  onFinish,
}: GameScreenProps) {
  const chart = song.charts[difficulty];

  // Refs für die Game-Loop (ändern sich ohne Re-Render).
  const notesRef = useRef<LiveNote[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const countsRef = useRef({ perfect: 0, good: 0, miss: 0 });
  const finishedRef = useRef(false);
  const judgeIdRef = useRef(0);
  const pausedRef = useRef(false);

  // State nur für das, was gerendert werden muss.
  const [now, setNow] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [active, setActive] = useState<Set<number>>(new Set());
  const [judgements, setJudgements] = useState<Judgement[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [paused, setPaused] = useState(false);

  const totalMaxScore = useMemo(
    () => chart.events.reduce((sum, e) => sum + e.notes.length * POINTS.perfect, 0),
    [chart]
  );

  /** Letzter spielbarer Zeitpunkt (Ende des letzten Tons). */
  const endTime = useMemo(() => {
    const last = chart.events[chart.events.length - 1];
    return last ? last.time + LEAD_IN + last.duration : 0;
  }, [chart]);

  // Events initialisieren. Alle Zeiten um LEAD_IN nach hinten schieben,
  // damit nach dem Countdown die Noten sichtbar ins Bild fallen.
  const initNotes = useCallback(() => {
    notesRef.current = chart.events.map((e, i) => ({
      ...e,
      playTime: e.time + LEAD_IN,
      index: i,
      status: "pending",
      hitNotes: new Set(),
    }));
  }, [chart]);

  useEffect(() => {
    initNotes();
  }, [initNotes]);

  // Sicherheitsnetz: Beim Abbau der Komponente (z. B. Wechsel zum Ergebnis
  // oder zurück ins Menü) jeden noch klingenden Ton stoppen und die Loop
  // beenden, damit nichts endlos weiterspielt.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      piano.stopAll();
    };
  }, []);

  // Countdown vor Spielstart.
  useEffect(() => {
    piano.resume();
    let c = 3;
    setCountdown(c);
    const id = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(id);
        startRef.current = performance.now();
        loop();
      }
    }, 700);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    // Alle noch klingenden Noten stoppen, damit eine gehaltene letzte
    // Note nicht endlos weiterklingt, wenn das Spiel verlassen wird.
    piano.stopAll();
    const c = countsRef.current;
    const totalNotes = c.perfect + c.good + c.miss;
    const result: ScoreResult = {
      score: scoreRef.current,
      maxScore: totalMaxScore,
      accuracy: totalNotes > 0 ? (c.perfect + c.good * 0.5) / totalNotes : 0,
      perfect: c.perfect,
      good: c.good,
      miss: c.miss,
      combo: maxComboRef.current,
    };
    onFinish(result);
  }, [onFinish, totalMaxScore]);

  const showJudge = useCallback((rating: Judgement["rating"], midi: number) => {
    judgeIdRef.current += 1;
    const id = judgeIdRef.current;
    setJudgements((prev) => [...prev, { id, rating, midi }]);
    // Popup nach kurzer Zeit wieder entfernen.
    window.setTimeout(() => {
      setJudgements((prev) => prev.filter((j) => j.id !== id));
    }, 500);
  }, []);

  // Game-Loop: Zeit vorantreiben, verpasste Noten markieren, Ende erkennen.
  const loop = useCallback(() => {
    if (pausedRef.current) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const t = performance.now() - startRef.current;
    setNow(t);

    // Verpasste Noten: Zeitfenster vorbei und noch nicht vollständig getroffen.
    for (const n of notesRef.current) {
      if (n.status === "pending" && t > n.playTime + TIMING.good) {
        n.status = "missed";
        countsRef.current.miss += n.notes.length - n.hitNotes.size;
        comboRef.current = 0;
        setCombo(0);
        // "Miss" an der ersten noch nicht getroffenen Taste dieses Events anzeigen.
        const missedMidi =
          n.notes.find((m) => !n.hitNotes.has(m)) ?? n.notes[0];
        showJudge("miss", missedMidi);
      }
    }

    // Song gilt als fertig, wenn alle Noten abgeschlossen sind
    // (getroffen oder verpasst) UND der letzte Ton durchgelaufen ist.
    const allDone = notesRef.current.every((n) => n.status !== "pending");
    const lastNotePassed = t > endTime;

    // Im Practice Mode NICHT automatisch zum Ergebnis springen –
    // man darf in Ruhe weiter üben und zurückspulen.
    if (!practice && allDone && lastNotePassed) {
      finish();
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime, finish, practice, showJudge]);

  // Tastendruck auswerten.
  const handlePress = useCallback(
    (midi: number) => {
      piano.noteOn(midi);
      setActive((prev) => new Set(prev).add(midi));

      const t = performance.now() - startRef.current;

      // Passende, noch offene Note im Trefferfenster finden (zeitlich nächste).
      let best: LiveNote | null = null;
      let bestDelta = Infinity;
      for (const n of notesRef.current) {
        if (n.status !== "pending") continue;
        if (!n.notes.includes(midi)) continue;
        if (n.hitNotes.has(midi)) continue;
        const delta = t - n.playTime;
        if (Math.abs(delta) <= TIMING.good && Math.abs(delta) < Math.abs(bestDelta)) {
          best = n;
          bestDelta = delta;
        }
      }

      if (!best) {
        comboRef.current = 0;
        setCombo(0);
        return;
      }

      const rating = rateHit(bestDelta);
      best.hitNotes.add(midi);
      countsRef.current[rating] += 1;
      scoreRef.current += POINTS[rating];
      setScore(scoreRef.current);

      if (rating !== "miss") {
        comboRef.current += 1;
        maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
        setCombo(comboRef.current);
      } else {
        comboRef.current = 0;
        setCombo(0);
      }
      showJudge(rating, midi);

      if (best.hitNotes.size === best.notes.length) {
        best.status = "hit";
      }

      // Song endet, sobald die LETZTE Note vollständig getroffen wurde.
      // (Nicht im Practice Mode – da darf weiter geübt werden.)
      if (!practice) {
        const allHitOrDone = notesRef.current.every((n) => n.status !== "pending");
        if (allHitOrDone) {
          // kurzer Moment, damit das letzte "PERFECT" noch sichtbar ist
          window.setTimeout(() => finish(), 400);
        }
      }
    },
    [finish, practice, showJudge]
  );

  const handleRelease = useCallback((midi: number) => {
    piano.noteOff(midi);
    setActive((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  /**
   * Zeit auf einen Zielzeitpunkt setzen und alle Noten in/ab diesem Abschnitt
   * wieder auf "pending" stellen, damit man sie erneut spielen kann.
   * (Nur im Practice Mode genutzt.)
   */
  const seekTo = useCallback((targetMs: number) => {
    const clamped = Math.max(0, targetMs);
    startRef.current = performance.now() - clamped;
    for (const n of notesRef.current) {
      if (n.playTime + n.duration >= clamped) {
        n.status = "pending";
        n.hitNotes = new Set();
      }
    }
    comboRef.current = 0;
    setCombo(0);
    setNow(clamped);
  }, []);

  const rewind = useCallback(() => {
    const t = performance.now() - startRef.current;
    seekTo(t - REWIND_STEP);
  }, [seekTo]);

  const restart = useCallback(() => {
    initNotes();
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    countsRef.current = { perfect: 0, good: 0, miss: 0 };
    setScore(0);
    setCombo(0);
    seekTo(0);
  }, [initNotes, seekTo]);

  const togglePause = useCallback(() => {
    if (pausedRef.current) {
      // Fortsetzen: verstrichene Pausenzeit aus der Startzeit herausrechnen.
      const resumeAt = now;
      startRef.current = performance.now() - resumeAt;
      pausedRef.current = false;
      setPaused(false);
    } else {
      pausedRef.current = true;
      setPaused(true);
    }
  }, [now]);

  // Welche Tasten soll der Spieler jetzt treffen?
  const expected = useMemo(() => {
    const set = new Set<number>();
    for (const n of notesRef.current) {
      if (
        n.status === "pending" &&
        n.playTime - now <= 400 &&
        n.playTime - now >= -TIMING.good
      ) {
        n.notes.forEach((m) => {
          if (!n.hitNotes.has(m)) set.add(m);
        });
      }
    }
    return set;
  }, [now]);

  // Sichtbare fallende Noten. Eine Note bleibt sichtbar, bis ihr ENDE
  // (playTime + duration) unter die Trefferlinie gelaufen ist – sonst
  // verschwinden lange Noten, bevor sie komplett durchgelaufen sind.
  const visibleNotes = notesRef.current.filter(
    (n) =>
      n.playTime - now <= LOOKAHEAD && n.playTime + n.duration - now >= -400
  );

  const whiteCount = countWhiteKeys(KEY_FROM, KEY_TO);
  const progressPct = endTime > 0 ? Math.min(100, Math.max(0, (now / endTime) * 100)) : 0;

  return (
    <div className="game">
      <div className="game-hud">
        <button className="hud-back" onClick={onExit}>
          ‹ Menü
        </button>
        <div className="hud-info">
          <div className="song">
            {song.emoji} {song.title}
            {practice && <span className="practice-badge">Übung</span>}
          </div>
          <div className="diff">{difficulty}</div>
        </div>
        <div className="hud-score">
          <div className="val">{score}</div>
          <div className="combo">{combo > 1 ? `${combo}× Combo` : ""}</div>
        </div>
      </div>

      <div className="falls">
        {/* Fortschrittsbalken */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {visibleNotes.map((n) => {
          const progress = 1 - (n.playTime - now) / LOOKAHEAD;
          const topPct = progress * 100;
          const heightPct = (n.duration / LOOKAHEAD) * 100;

          return n.notes.map((m) => {
            const black = isBlack(m);
            const leftPct = noteLeftPosition(m, KEY_FROM, whiteCount);
            const widthCalc = black
              ? `calc(100% / ${whiteCount} * 0.62)`
              : `calc(100% / ${whiteCount} - 4px)`;
            const cls = [
              "note-block",
              black ? "black" : "white",
              n.status === "hit" ? "hit" : n.status === "missed" ? "missed" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={`${n.index}-${m}`}
                className={cls}
                style={{
                  left: `${leftPct}%`,
                  width: widthCalc,
                  top: `calc(${topPct}% - ${heightPct}%)`,
                  height: `max(14px, ${heightPct}%)`,
                }}
              />
            );
          });
        })}

        <div className="hit-line" />

        {judgements.map((j) => {
          // Horizontal über der getroffenen Taste positionieren.
          const unit = 100 / whiteCount;
          const leftPct = noteLeftPosition(j.midi, KEY_FROM, whiteCount) + unit / 2;
          return (
            <div
              key={j.id}
              className={`judge ${j.rating}`}
              style={{ left: `${leftPct}%` }}
            >
              {j.rating === "perfect"
                ? "PERFECT"
                : j.rating === "good"
                ? "GOOD"
                : "MISS"}
            </div>
          );
        })}

        {countdown > 0 && <div className="countdown">{countdown}</div>}

        {paused && <div className="countdown">Pause</div>}
      </div>

      {/* Steuerleiste nur im Practice Mode */}
      {practice && (
        <div className="practice-bar">
          <button className="pbtn" onClick={restart} title="Von vorne">
            ⏮ Start
          </button>
          <button className="pbtn" onClick={rewind} title="5 Sekunden zurück">
            ⏪ 5s
          </button>
          <button className="pbtn primary" onClick={togglePause}>
            {paused ? "▶ Weiter" : "⏸ Pause"}
          </button>
          <button
            className="pbtn"
            onClick={() => finish()}
            title="Übung beenden und Ergebnis ansehen"
          >
            ✓ Ergebnis
          </button>
        </div>
      )}

      <Piano
        from={KEY_FROM}
        to={KEY_TO}
        active={active}
        expected={expected}
        onPress={handlePress}
        onRelease={handleRelease}
      />
    </div>
  );
}

// --- Hilfsfunktionen für die horizontale Positionierung der fallenden Noten ---

const BLACK = [1, 3, 6, 8, 10];
function isBlack(midi: number): boolean {
  return BLACK.includes(midi % 12);
}

function countWhiteKeys(from: number, to: number): number {
  let c = 0;
  for (let m = from; m <= to; m++) if (!isBlack(m)) c++;
  return c;
}

/**
 * Linke Position einer fallenden Note in % der Klavierbreite.
 * Muss zur Tastenplatzierung in Piano.tsx passen:
 *  - weiße Taste: linke Kante bei whiteIndex / whiteCount
 *  - schwarze Taste: zentriert über der Lücke bei whiteIndex / whiteCount,
 *    Balkenbreite 0.62 einer weißen Taste -> um die halbe Breite nach links.
 */
function noteLeftPosition(midi: number, from: number, whiteCount: number): number {
  let whiteIndex = 0;
  for (let m = from; m < midi; m++) if (!isBlack(m)) whiteIndex++;
  const unit = 100 / whiteCount; // Breite einer weißen Taste in %
  if (isBlack(midi)) {
    return whiteIndex * unit - (unit * 0.62) / 2;
  }
  return whiteIndex * unit;
}
