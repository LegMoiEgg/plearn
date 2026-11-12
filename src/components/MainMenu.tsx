import { useEffect, useRef, useState } from "react";
import { SONGS } from "../data/songs";
import type { Difficulty, Song } from "../types";
import { getHighscore } from "../lib/scoring";
import { preview } from "../lib/preview";
import "./MainMenu.css";

interface MainMenuProps {
  onSelect: (song: Song, difficulty: Difficulty, practice: boolean) => void;
}

const DIFFICULTIES: Difficulty[] = ["einfach", "mittel", "schwer"];

export default function MainMenu({ onSelect }: MainMenuProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [practice, setPractice] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Beim Verlassen des Menüs eine evtl. laufende Vorschau stoppen.
  useEffect(() => {
    return () => preview.stop();
  }, []);

  const scrollBy = (dir: number) => {
    cardsRef.current?.scrollBy({ left: dir * 258, behavior: "smooth" });
  };

  const togglePreview = (song: Song) => {
    if (preview.isPlaying(song.id)) {
      preview.stop();
      return;
    }
    // Vorschau mit der vollsten verfügbaren Spur abspielen.
    const chart = song.charts.schwer ?? song.charts.einfach;
    preview.play(song.id, chart, (endedId) => {
      // Button nur zurücksetzen, wenn der gerade angezeigte Song gemeint ist.
      setPlayingId((cur) => (cur === endedId ? null : cur));
    });
    setPlayingId(song.id);
  };

  return (
    <div className="menu">
      <h1 className="menu-title">PLearn</h1>
      <p className="menu-subtitle">Lerne Anime-Soundtracks am Klavier</p>

      {/* Practice-Mode-Regler */}
      <button
        className={`mode-toggle ${practice ? "on" : ""}`}
        onClick={() => setPractice((p) => !p)}
        role="switch"
        aria-checked={practice}
      >
        <span className="mode-label">Übungsmodus</span>
        <span className="mode-track">
          <span className="mode-knob" />
        </span>
        <span className="mode-state">{practice ? "AN" : "AUS"}</span>
      </button>
      <p className="mode-hint">
        {practice
          ? "Zurückspulen & pausieren – übe einzelne Abschnitte in Ruhe"
          : "Normaler Lauf mit Score und Ergebnis am Ende"}
      </p>

      <div className="carousel">
        <button className="nav left" onClick={() => scrollBy(-1)} aria-label="Zurück">
          ‹
        </button>

        <div className="cards" ref={cardsRef}>
          {SONGS.map((song) => (
            <div
              className="card"
              key={song.id}
              style={{
                background: `linear-gradient(160deg, ${song.color}33, var(--panel))`,
                borderColor: `${song.color}55`,
              }}
            >
              <button
                className="preview-btn"
                style={{ background: `${song.color}` }}
                onClick={() => togglePreview(song)}
                aria-label={
                  playingId === song.id ? "Vorschau stoppen" : "Song anhören"
                }
                title={playingId === song.id ? "Stoppen" : "Anhören"}
              >
                {playingId === song.id ? "■" : "▶"}
              </button>

              <div>
                <div className="card-emoji">{song.emoji}</div>
                <div className="card-anime">{song.anime}</div>
                <div className="card-title">{song.title}</div>
                <div className="card-bpm">{song.bpm} BPM</div>
              </div>

              <div>
                <div className="diffs">
                  {DIFFICULTIES.map((d) => {
                    const hs = getHighscore(song.id, d);
                    return (
                      <button
                        key={d}
                        className="diff-btn"
                        style={{ background: `${song.color}33` }}
                        onClick={() => onSelect(song, d, practice)}
                      >
                        {d}
                        <span className="hs">{hs > 0 ? `★ ${hs}` : "—"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="nav right" onClick={() => scrollBy(1)} aria-label="Weiter">
          ›
        </button>
      </div>

      <p className="hint">Wische durch die Songs und wähle eine Schwierigkeit</p>
    </div>
  );
}
