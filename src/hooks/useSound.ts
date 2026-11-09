import { useCallback, useEffect, useRef } from 'react';

type SfxName = 'click' | 'toggle' | 'success' | 'door' | 'step' | 'inspect';

export function useSound(enabled: boolean) {
  const context = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (context.current && context.current.state !== 'closed') {
        void context.current.close();
      }
      context.current = null;
    };
  }, []);

  const play = useCallback((name: SfxName) => {
    if (!enabled) return;
    try {
      const AudioCtor = window.AudioContext;
      if (!AudioCtor) return;
      const ctx = context.current ?? new AudioCtor();
      context.current = ctx;
      if (ctx.state === 'suspended') void ctx.resume();

      const makeTone = (freq: number, at: number, duration: number, wave: OscillatorType = 'sine', amp = 0.055) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + at);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
        gain.gain.exponentialRampToValueAtTime(amp, ctx.currentTime + at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + duration);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(ctx.currentTime + at);
        oscillator.stop(ctx.currentTime + at + duration + 0.01);
      };

      if (name === 'click') makeTone(440, 0, 0.06, 'sine', 0.023);
      if (name === 'step') makeTone(180, 0, 0.045, 'triangle', 0.012);
      if (name === 'toggle') {
        makeTone(520, 0, 0.075, 'triangle', 0.05);
        makeTone(720, 0.08, 0.11, 'sine', 0.04);
      }
      if (name === 'inspect') {
        makeTone(580, 0, 0.10, 'sine', 0.028);
        makeTone(740, 0.1, 0.12, 'sine', 0.028);
      }
      if (name === 'door') {
        makeTone(230, 0, 0.20, 'triangle', 0.04);
        makeTone(310, 0.12, 0.3, 'sine', 0.03);
      }
      if (name === 'success') {
        [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => makeTone(frequency, i * 0.12, 0.31, 'sine', 0.057));
      }
    } catch {
      // Audio is optional. The game remains playable when sound is unavailable.
    }
  }, [enabled]);

  return play;
}
