import { useState } from 'react';
import { DUCK_COLORS } from '../types';

interface Props {
  onStart: (names: string[]) => void;
  initialNames: string[];
}

export function SetupScreen({ onStart, initialNames }: Props) {
  const [names, setNames] = useState<string[]>(() => {
    if (initialNames.length > 0) {
      const filled = [...initialNames];
      while (filled.length < 12) filled.push('');
      return filled.slice(0, 12);
    }
    return Array(12).fill('');
  });

  const validNames = names.filter(n => n.trim() !== '');
  const canStart = validNames.length >= 2;

  const handleChange = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  const handleStart = () => {
    if (canStart) onStart(validNames.map(n => n.trim()));
  };

  const handleClear = () => setNames(Array(12).fill(''));

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = document.querySelector<HTMLInputElement>(
        `input[data-lane="${index + 1}"]`,
      );
      if (next) next.focus();
      else if (canStart) handleStart();
    }
  };

  const trimmed = names.map(n => n.trim().toLowerCase());
  const isDuplicate = (i: number) => {
    const v = trimmed[i];
    return v !== '' && trimmed.indexOf(v) !== i;
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>🦆 DUCK RACE 🏁</h1>
        <p className="subtitle">Scam Center Draft Position</p>
      </div>

      <div className="name-inputs">
        {names.map((name, i) => (
          <div
            key={i}
            className={`name-input-row${isDuplicate(i) ? ' duplicate' : ''}`}
          >
            <div
              className="color-dot"
              style={{ backgroundColor: DUCK_COLORS[i].hex }}
            />
            <span className="lane-number">Lane {i + 1}</span>
            <input
              type="text"
              data-lane={i}
              value={name}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(e, i)}
              placeholder={`Player ${i + 1}`}
              maxLength={20}
              autoFocus={i === 0}
            />
            {isDuplicate(i) && (
              <span className="duplicate-warning">⚠️</span>
            )}
          </div>
        ))}
      </div>

      <div className="setup-actions">
        <button className="btn-start" onClick={handleStart} disabled={!canStart}>
          🏁 Start Race! ({validNames.length} duck{validNames.length !== 1 ? 's' : ''})
        </button>
        <button className="btn-clear" onClick={handleClear}>
          Clear All
        </button>
      </div>

      {!canStart && (
        <p className="min-warning">Enter at least 2 player names to race</p>
      )}
    </div>
  );
}
