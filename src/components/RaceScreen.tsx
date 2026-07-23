import { useEffect, useRef, useState, useCallback } from 'react';
import { DUCK_COLORS } from '../types';
import type { DuckState, FinishEntry } from '../types';
import { playSplash } from '../utils/sound';

interface Props {
  names: string[];
  onRaceComplete: (order: FinishEntry[]) => void;
  soundEnabled: boolean;
}

/* ─── constants ─── */
const BASE_RATE = 1 / 12500;          // position-units per ms (≈12.5s baseline)
const SPEED_UPDATE_MS = 400;          // re-roll modifier every 400ms
const END_GAME_THRESHOLD = 0.78;      // final stretch starts here
const POST_RACE_DELAY = 1800;         // ms after last duck before results

/* ─── helpers ─── */
function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}

function initDucks(names: string[]): DuckState[] {
  return names.map((name, i) => ({
    name,
    color: DUCK_COLORS[i].hex,
    lane: i,
    position: 0,
    speed: 1,
    baseSpeed: rand(0.88, 1.12),
    finished: false,
    finishTime: 0,
    finishPlace: 0,
    lastSpeedUpdate: 0,
    currentModifier: rand(0.7, 1.3),
  }));
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ─── component ─── */
export function RaceScreen({ names, onRaceComplete, soundEnabled }: Props) {
  const [ducks, setDucks] = useState<DuckState[]>(() => initDucks(names));
  const ducksRef = useRef(ducks);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const prevRef = useRef(0);
  const placeCounter = useRef(0);
  const doneRef = useRef(false);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const onCompleteRef = useRef(onRaceComplete);
  onCompleteRef.current = onRaceComplete;

  const tick = useCallback((now: number) => {
    if (!startRef.current) {
      startRef.current = now;
      prevRef.current = now;
    }

    const dt = Math.min(now - prevRef.current, 50); // cap dt to avoid jumps
    prevRef.current = now;
    const elapsed = now - startRef.current;

    const arr = ducksRef.current;
    const active = arr.filter(d => !d.finished);
    if (active.length === 0) return; // all done

    // average position of active ducks
    const avgPos =
      active.reduce((s, d) => s + d.position, 0) / active.length;

    let changed = false;

    const next = arr.map(duck => {
      if (duck.finished) return duck;

      const d = { ...duck };

      // re-roll speed modifier periodically
      if (elapsed - d.lastSpeedUpdate > SPEED_UPDATE_MS) {
        d.lastSpeedUpdate = elapsed;
        if (d.position >= END_GAME_THRESHOLD) {
          d.currentModifier = rand(0.25, 2.6);
        } else {
          d.currentModifier = rand(0.55, 1.55);
        }
      }

      // rubber-banding: pull toward the pack
      const diff = d.position - avgPos;
      let rubberBand = 1 - diff * 0.55;
      rubberBand = Math.max(0.65, Math.min(1.35, rubberBand));

      // time-based nudge: if race is past 14s, push stragglers
      let timeNudge = 1;
      if (elapsed > 14000 && d.position < 0.85) {
        timeNudge = 1.4 + (elapsed - 14000) / 5000;
      }

      const speed = BASE_RATE * d.baseSpeed * d.currentModifier * rubberBand * timeNudge;
      d.position += speed * dt;

      if (d.position >= 1) {
        d.position = 1;
        d.finished = true;
        d.finishTime = elapsed;
        placeCounter.current += 1;
        d.finishPlace = placeCounter.current;
        if (soundRef.current) playSplash();
        changed = true;
      }

      return d;
    });

    ducksRef.current = next;
    setDucks(next);

    // check if all done
    if (next.every(d => d.finished)) {
      if (!doneRef.current) {
        doneRef.current = true;
        const sorted = [...next].sort((a, b) => a.finishPlace - b.finishPlace);
        const order: FinishEntry[] = sorted.map(d => ({
          name: d.name,
          color: d.color,
          lane: d.lane,
          place: d.finishPlace,
        }));
        setTimeout(() => onCompleteRef.current(order), POST_RACE_DELAY);
      }
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // track width: duck travels from ~130px to (100% - 64px)
  // we express percent of that inner width
  const trackLeftPx = 130;
  const trackRightPx = 64;

  return (
    <div className="race-screen">
      <div className="race-header">
        <h2>🦆 DUCK RACE 🏁</h2>
      </div>

      <div className="race-track">
        <div className="finish-line" />

        {ducks.map(duck => {
          const pct = duck.position * 100;
          const isFast = duck.currentModifier > 1.2 && !duck.finished;

          return (
            <div
              key={duck.lane}
              className={`lane${duck.finished ? ' finished' : ''}`}
            >
              <div className="lane-flash" />
              <span className="player-label">{duck.name}</span>

              <div
                className={`duck-container${isFast ? ' fast' : ''}`}
                style={{
                  transform: `translateX(calc(${pct} * (100vw - ${trackLeftPx + trackRightPx}px) / 100))`,
                }}
              >
                <div className={`duck${!duck.finished ? ' racing' : ''}`}>
                  <div className="duck-body" style={{ background: duck.color }} />
                  <div className="duck-head" style={{ background: duck.color }} />
                  <div className="duck-bill" />
                  <div className="duck-eye" />
                  <div className="duck-wing" />
                </div>

                <div className="splash-container">
                  <span className="splash-dot" />
                  <span className="splash-dot" />
                  <span className="splash-dot" />
                </div>

                {duck.finished && (
                  <span className="placement-badge">{ordinal(duck.finishPlace)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
