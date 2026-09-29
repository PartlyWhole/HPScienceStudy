// A seeded generator, so a test can replay any question it makes.
export function rng(seed: number) {
  let s = Math.floor(Math.abs(seed)) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export const pick = <T,>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

export function shuffle<T>(r: () => number, xs: readonly T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** An integer from lo to hi, both included. */
export const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
