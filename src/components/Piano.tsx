import { useMemo } from "react";
import { isBlackKey, midiRange, midiToName } from "../lib/notes";
import "./Piano.css";

interface PianoProps {
  from: number;
  to: number;
  /** Tasten, die gerade gedrückt sind (visuelles Feedback). */
  active: Set<number>;
  /** Tasten, die der Spieler als Nächstes treffen soll. */
  expected: Set<number>;
  onPress: (midi: number) => void;
  onRelease: (midi: number) => void;
}

export default function Piano({
  from,
  to,
  active,
  expected,
  onPress,
  onRelease,
}: PianoProps) {
  const all = useMemo(() => midiRange(from, to), [from, to]);
  const whites = all.filter((m) => !isBlackKey(m));

  return (
    <div className="piano">
      <div className="piano-inner">
        {/* Weiße Tasten als Grid */}
        <div
          className="white-row"
          style={{ gridTemplateColumns: `repeat(${whites.length}, 1fr)` }}
        >
          {whites.map((m) => (
            <Key
              key={m}
              midi={m}
              black={false}
              active={active.has(m)}
              expected={expected.has(m)}
              onPress={onPress}
              onRelease={onRelease}
            />
          ))}
        </div>

        {/* Schwarze Tasten absolut darüber */}
        <div className="black-layer">
          {all
            .filter((m) => isBlackKey(m))
            .map((m) => {
              // Position: über die Lücke zwischen den weißen Tasten.
              const whiteIndex = whites.filter((w) => w < m).length;
              const leftPct = (whiteIndex / whites.length) * 100;
              return (
                <Key
                  key={m}
                  midi={m}
                  black
                  active={active.has(m)}
                  expected={expected.has(m)}
                  style={{
                    left: `calc(${leftPct}% - (100% / ${whites.length} / 2))`,
                    width: `calc(100% / ${whites.length} * 0.62)`,
                  }}
                  onPress={onPress}
                  onRelease={onRelease}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

interface KeyProps {
  midi: number;
  black: boolean;
  active: boolean;
  expected: boolean;
  style?: React.CSSProperties;
  onPress: (midi: number) => void;
  onRelease: (midi: number) => void;
}

function Key({
  midi,
  black,
  active,
  expected,
  style,
  onPress,
  onRelease,
}: KeyProps) {
  const cls = [
    "key",
    black ? "black" : "white",
    active ? "active" : "",
    expected ? "expected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={cls}
      style={style}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(midi);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onRelease(midi);
      }}
      onPointerLeave={() => onRelease(midi)}
      onPointerCancel={() => onRelease(midi)}
    >
      <span className="key-label">{midiToName(midi)}</span>
    </button>
  );
}
