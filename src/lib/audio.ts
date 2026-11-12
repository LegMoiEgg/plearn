// Piano-Engine auf Basis der Web Audio API.
// Erzeugt klavierähnliche Töne ohne externe Soundfiles und unterstützt
// echtes Note-on / Note-off: Ein Ton klingt, solange die Taste gehalten wird.

import { midiToFreq } from "./notes";

/** Alle Audioknoten, die zu einer gerade klingenden Note gehören. */
interface Voice {
  sources: AudioScheduledSourceNode[];
  gain: GainNode;
}

class PianoAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Leichter Nachhall für mehr Räumlichkeit (weniger "trocken"/8-bit). */
  private reverb: ConvolverNode | null = null;
  /** Kurzes Hammergeräusch (Rauschimpuls) für den Anschlag. */
  private hammerBuffer: AudioBuffer | null = null;
  /** Aktuell klingende Noten (pro MIDI-Taste). */
  private voices = new Map<number, Voice>();

  /**
   * Muss durch eine Nutzerinteraktion (Tap/Klick) ausgelöst werden,
   * sonst blockieren Browser (besonders Safari am iPad) den Sound.
   */
  resume(): void {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);

      // Kurzer, dezenter Nachhall parallel zum Direktsignal.
      this.reverb = this.ctx.createConvolver();
      this.reverb.buffer = this.makeImpulseResponse(1.6, 2.2);
      const reverbGain = this.ctx.createGain();
      reverbGain.gain.value = 0.18;
      this.reverb.connect(reverbGain);
      reverbGain.connect(this.ctx.destination);

      this.hammerBuffer = this.makeHammerNoise();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  /** Erzeugt eine künstliche Impulsantwort (exponentiell abfallendes Rauschen). */
  private makeImpulseResponse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  /** Erzeugt einen sehr kurzen Rauschimpuls (Hammer auf die Saite). */
  private makeHammerNoise(): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * 0.03);
    const buffer = ctx.createBuffer(1, length, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      // Abklingendes Rauschen
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
    return buffer;
  }

  /**
   * Startet eine Note und hält sie. Mehrere gestimmte Obertöne + ein
   * Tiefpassfilter, der nach dem Anschlag schließt, ergeben einen
   * klavierähnlichen, warmen Klang mit perkussivem Anschlag.
   */
  noteOn(midi: number): void {
    if (!this.ctx || !this.master) return;
    // Falls dieselbe Taste schon klingt, vorher sauber beenden.
    if (this.voices.has(midi)) this.noteOff(midi);

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = midiToFreq(midi);
    const sources: AudioScheduledSourceNode[] = [];

    // Inharmonische Obertonreihe: echte Klaviersaiten schwingen leicht
    // "unsauber", die Teiltöne liegen etwas über dem ganzzahligen Vielfachen.
    // B ist der Inharmonizitätskoeffizient. Höhere Obertöne klingen zudem
    // schneller aus (frequenzabhängiges Decay) – typisch Klavier.
    const B = 0.0006;
    // Wärmerer Klang: Grundton und tiefe Obertöne betont, hohe Teiltöne
    // deutlich zurückgenommen.
    const partials: Array<{ n: number; gain: number }> = [
      { n: 1, gain: 1.0 },
      { n: 2, gain: 0.45 },
      { n: 3, gain: 0.18 },
      { n: 4, gain: 0.08 },
      { n: 5, gain: 0.04 },
      { n: 6, gain: 0.02 },
    ];

    // Haupt-Hüllkurve der Stimme: schneller Anschlag, Decay auf gehaltenen
    // Sustain-Pegel. Das endgültige Ausklingen passiert bei noteOff.
    const gain = ctx.createGain();
    const peak = 0.5;
    const sustain = 0.24;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.004); // Attack
    gain.gain.exponentialRampToValueAtTime(sustain, now + 0.4); // Decay -> Sustain

    // Weicher Tiefpass, der nach dem Anschlag schließt. Dunkler eingestellt
    // für einen wärmeren Klang (weniger Höhen).
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(6000, freq * 6), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(700, freq * 2.2), now + 0.5);
    filter.Q.value = 0.4;

    // Jeder Oberton als eigener Oszillator mit eigener Abkling-Hüllkurve.
    partials.forEach((p) => {
      const partialFreq = freq * p.n * Math.sqrt(1 + B * p.n * p.n);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = partialFreq;

      const g = ctx.createGain();
      // Höhere Teiltöne klingen schneller aus.
      const decayTime = 0.5 + 6 / p.n;
      g.gain.setValueAtTime(p.gain, now);
      g.gain.exponentialRampToValueAtTime(p.gain * 0.25, now + decayTime);

      osc.connect(g);
      g.connect(gain);
      osc.start(now);
      sources.push(osc);
    });

    // FM-Anschlag: ein Modulator, der nur ganz kurz "zupft" und dann
    // verschwindet – gibt dem Ton den perkussiven Klavier-Attack.
    const modOsc = ctx.createOscillator();
    modOsc.type = "sine";
    modOsc.frequency.value = freq * 3;
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(freq * 2, now);
    modGain.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
    const carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.value = freq;
    const carrierGain = ctx.createGain();
    carrierGain.gain.setValueAtTime(0.25, now);
    carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    modOsc.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(carrierGain);
    carrierGain.connect(gain);
    modOsc.start(now);
    carrier.start(now);
    sources.push(modOsc, carrier);

    // Kurzes Hammergeräusch beim Anschlag.
    if (this.hammerBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.hammerBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = Math.min(6000, freq * 4);
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.025;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gain);
      noise.start(now);
      sources.push(noise);
    }

    // Signalweg: Stimme -> Filter -> Master (+ parallel in den Nachhall).
    gain.connect(filter);
    filter.connect(this.master);
    if (this.reverb) filter.connect(this.reverb);

    this.voices.set(midi, { sources, gain });
  }

  /** Lässt eine gehaltene Note weich ausklingen (Release). */
  noteOff(midi: number): void {
    if (!this.ctx) return;
    const voice = this.voices.get(midi);
    if (!voice) return;
    this.voices.delete(midi);

    const now = this.ctx.currentTime;
    const release = 0.4;
    try {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    } catch {
      /* ignore */
    }
    voice.sources.forEach((src) => {
      try {
        src.stop(now + release + 0.05);
      } catch {
        /* ignore */
      }
    });
  }

  /**
   * Spielt eine Note mit fester Dauer an (für automatisches Abspielen,
   * Vorschau usw.). Nutzt intern noteOn/noteOff.
   */
  playNote(midi: number, duration = 0.6): void {
    this.noteOn(midi);
    window.setTimeout(() => this.noteOff(midi), duration * 1000);
  }

  /** Spielt mehrere Noten gleichzeitig (Akkord) mit fester Dauer. */
  playChord(midis: number[], duration = 0.6): void {
    midis.forEach((m) => this.playNote(m, duration));
  }

  /**
   * Stoppt sofort ALLE klingenden Noten. Wichtig beim Verlassen des Spiels,
   * damit eine noch gehaltene letzte Note nicht endlos weiterklingt.
   */
  stopAll(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const voice of this.voices.values()) {
      try {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      } catch {
        /* ignore */
      }
      voice.sources.forEach((src) => {
        try {
          src.stop(now + 0.15);
        } catch {
          /* ignore */
        }
      });
    }
    this.voices.clear();
  }
}

export const piano = new PianoAudio();
