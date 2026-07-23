import { useState, useEffect, useRef, useCallback } from 'react';
import type { FinishEntry } from '../types';
import { playFanfare } from '../utils/sound';

interface Props {
  finishOrder: FinishEntry[];
  onRaceAgain: () => void;
  onEditNames: () => void;
}

function placeMedal(place: number): string {
  if (place === 1) return '🥇';
  if (place === 2) return '🥈';
  if (place === 3) return '🥉';
  return `${place}`;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function ResultsScreen({ finishOrder, onRaceAgain, onEditNames }: Props) {
  const [showBJ, setShowBJ] = useState(false);
  const [copied, setCopied] = useState(false);
  const fanfarePlayed = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowBJ(true);
      if (!fanfarePlayed.current) {
        fanfarePlayed.current = true;
        playFanfare();
      }
    }, finishOrder.length * 100 + 600);
    return () => clearTimeout(t);
  }, [finishOrder.length]);

  const blackjackOrder = [...finishOrder].reverse();

  const handleCopy = useCallback(() => {
    const lines: string[] = ['=== DUCK RACE RESULTS ==='];
    finishOrder.forEach(e => lines.push(`${ordinal(e.place)}: ${e.name}`));
    lines.push('');
    lines.push('=== BLACKJACK PLAYING ORDER ===');
    lines.push('(Last in race → First at table)');
    blackjackOrder.forEach((e, i) => lines.push(`${i + 1}. ${e.name} (finished ${ordinal(e.place)} in race)`));
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [finishOrder, blackjackOrder]);

  return (
    <div className="results-screen">
      <div className="results-header">
        <h1>🏁 Race Complete!</h1>
      </div>

      <div className="results-panels">
        {/* Race Results */}
        <div className="results-panel">
          <h2>🏁 Race Results</h2>
          {finishOrder.map((entry, i) => (
            <div
              key={entry.lane}
              className={`result-row${entry.place === 1 ? ' first' : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="result-place">{placeMedal(entry.place)}</span>
              <div
                className="result-color-dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="result-name">{entry.name}</span>
            </div>
          ))}
        </div>

        {/* Blackjack Order */}
        <div
          className="results-panel"
          style={{
            opacity: showBJ ? 1 : 0,
            transform: showBJ ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          <h2>🃏 Blackjack Playing Order</h2>
          <p className="panel-subtitle">Last in race → First at the table</p>
          {showBJ &&
            blackjackOrder.map((entry, i) => (
              <div
                key={entry.lane}
                className={`result-row${i === 0 ? ' first' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="result-place" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  {i + 1}.
                </span>
                <div
                  className="result-color-dot"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="result-name">{entry.name}</span>
                <span className="result-note">finished {ordinal(entry.place)}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-race-again" onClick={onRaceAgain}>
          🔄 Race Again
        </button>
        <button className="btn-edit-names" onClick={onEditNames}>
          ✏️ Edit Names
        </button>
        <button className={`btn-copy${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy Results'}
        </button>
      </div>
    </div>
  );
}
