import { useState, useEffect, useRef } from 'react';
import { playCountdownBeep, playHorn } from '../utils/sound';

interface Props {
  onComplete: () => void;
  soundEnabled: boolean;
}

const STEPS: Array<{ display: string | number; duration: number }> = [
  { display: 3, duration: 1000 },
  { display: 2, duration: 1000 },
  { display: 1, duration: 1000 },
  { display: 'QUACK! 🦆', duration: 800 },
];

export function CountdownOverlay({ onComplete, soundEnabled }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [animating, setAnimating] = useState(true);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (soundRef.current) playCountdownBeep(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    for (let i = 1; i <= STEPS.length; i++) {
      elapsed += STEPS[i - 1].duration;
      const idx = i;
      timers.push(
        setTimeout(() => {
          if (idx < STEPS.length) {
            setAnimating(false);
            setTimeout(() => {
              setStepIdx(idx);
              setAnimating(true);
              if (soundRef.current) {
                if (idx < 3) playCountdownBeep(idx);
                else playHorn();
              }
            }, 50);
          } else {
            onCompleteRef.current();
          }
        }, elapsed),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  const step = STEPS[stepIdx];
  const isQuack = typeof step.display === 'string';

  return (
    <div className="countdown-overlay">
      <div
        className={`countdown-text${animating ? ' pop-in' : ''}${isQuack ? ' quack' : ''}`}
      >
        {step.display}
      </div>
    </div>
  );
}
