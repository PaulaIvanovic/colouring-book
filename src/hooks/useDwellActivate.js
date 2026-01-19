import { useCallback, useRef, useState } from "react";

export function useDwellActivate(onActivate, dwellMs = 1200) {
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [dwelling, setDwelling] = useState(false);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    startRef.current = 0;
    setDwelling(false);
    setProgress(0);
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const p = Math.min(1, (now - startRef.current) / dwellMs);
    setProgress(p);
    // eslint-disable-next-line react-hooks/immutability
    if (p < 1) rafRef.current = requestAnimationFrame(tick);
  }, [dwellMs]);

  const start = useCallback(() => {
    clear();
    startRef.current = performance.now();
    setDwelling(true);
    setProgress(0);
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      clear();
      onActivate?.();
    }, dwellMs);
  }, [clear, dwellMs, onActivate, tick]);

  const onPointerEnter = useCallback(() => start(), [start]);
  const onPointerLeave = useCallback(() => clear(), [clear]);

  const onClick = useCallback(() => {
    clear();
    onActivate?.();
  }, [clear, onActivate]);

  return { onPointerEnter, onPointerLeave, onClick, progress, dwelling, clear };
}
