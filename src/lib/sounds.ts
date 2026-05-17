// Sound effects utility using Web Audio API — zero dependencies
const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;
let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx && AudioCtx) ctx = new AudioCtx();
  return ctx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, c.currentTime);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function playHabitComplete() {
  const c = getCtx();
  if (!c) return;
  // Rising chime: C5 → E5 → G5
  setTimeout(() => playTone(523, 0.15, 'sine', 0.12), 0);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.10), 80);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.08), 160);
}

export function playXPGain() {
  const c = getCtx();
  if (!c) return;
  // Quick sparkle chirp
  playTone(880, 0.08, 'sine', 0.06);
  setTimeout(() => playTone(1175, 0.12, 'sine', 0.05), 60);
}

export function playLevelUp() {
  const c = getCtx();
  if (!c) return;
  // Triumphant fanfare: C4 → E4 → G4 → C5 (arpeggio)
  const notes = [262, 330, 392, 523, 659, 784];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'triangle', 0.12 - i * 0.015), i * 120);
  });
  // Final sustained chord
  setTimeout(() => {
    playTone(523, 0.6, 'sine', 0.08);
    playTone(659, 0.6, 'sine', 0.06);
    playTone(784, 0.6, 'sine', 0.05);
  }, 750);
}

export function playButtonClick() {
  playTone(600, 0.05, 'sine', 0.04);
}

export function playToggle(on: boolean) {
  playTone(on ? 880 : 440, 0.08, 'sine', 0.05);
}

export function playError() {
  playTone(200, 0.15, 'square', 0.06);
  setTimeout(() => playTone(180, 0.2, 'square', 0.04), 100);
}

export function playAchievement() {
  // Magical reveal
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.1 - i * 0.02), i * 100);
  });
  setTimeout(() => {
    playTone(1047, 0.5, 'triangle', 0.06);
  }, 500);
}

export function playDelete() {
  playTone(400, 0.1, 'sawtooth', 0.04);
  setTimeout(() => playTone(300, 0.15, 'sawtooth', 0.03), 80);
}
