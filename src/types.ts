export interface DuckState {
  name: string;
  color: string;
  lane: number;
  position: number;
  speed: number;
  baseSpeed: number;
  finished: boolean;
  finishTime: number;
  finishPlace: number;
  lastSpeedUpdate: number;
  currentModifier: number;
}

export interface FinishEntry {
  name: string;
  color: string;
  lane: number;
  place: number;
}

export type GamePhase = 'setup' | 'countdown' | 'racing' | 'results';

export const DUCK_COLORS = [
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Blue', hex: '#1E90FF' },
  { name: 'Red', hex: '#FF4444' },
  { name: 'Green', hex: '#32CD32' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Purple', hex: '#9B59B6' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Cyan', hex: '#00CED1' },
  { name: 'Lime', hex: '#ADFF2F' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Teal', hex: '#20B2AA' },
  { name: 'Gold', hex: '#DAA520' },
];
