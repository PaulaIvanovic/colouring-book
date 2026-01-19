import { useCallback, useRef, useState } from "react";

function softTone(ctx, { freq, durationMs, type = "sine", peak = 0.05 }) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.type = type;
  o.frequency.value = freq;

  // gentle envelope
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(peak, now + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  o.connect(g);
  g.connect(ctx.destination);

  o.start(now);
  o.stop(now + durationMs / 1000);
}

export function useFeedback() {
  const audioCtxRef = useRef(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const flash = useCallback((kind) => {
    setFeedback(kind);
    window.setTimeout(() => setFeedback(null), 450);
  }, []);

  const correct = useCallback(() => {
    const ctx = ensureCtx();
    softTone(ctx, { freq: 660, durationMs: 220, type: "sine", peak: 0.045 });
    setTimeout(() => softTone(ctx, { freq: 880, durationMs: 260, type: "sine", peak: 0.04 }), 140);
    flash("correct");
  }, [ensureCtx, flash]);

  const wrong = useCallback(() => {
    const ctx = ensureCtx();
    softTone(ctx, { freq: 220, durationMs: 260, type: "triangle", peak: 0.04 });
    setTimeout(() => softTone(ctx, { freq: 180, durationMs: 320, type: "triangle", peak: 0.032 }), 130);
    flash("wrong");
  }, [ensureCtx, flash]);

  return { feedback, correct, wrong };

  /*
  // OPTIONAL: Use real sounds instead (add files in /public/sfx/)
  // const correctAudio = useRef(new Audio("/sfx/correct.mp3"));
  // const wrongAudio = useRef(new Audio("/sfx/wrong.mp3"));
  // const correct = () => { correctAudio.current.currentTime = 0; correctAudio.current.play(); flash("correct"); };
  // const wrong = () => { wrongAudio.current.currentTime = 0; wrongAudio.current.play(); flash("wrong"); };
  */
}
