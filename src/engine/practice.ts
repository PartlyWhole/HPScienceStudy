// Endless practice: questions on the chosen ideas until the student stops,
// the weakest and most overdue ideas most often. Only generators take part —
// the plan's own fixed questions would repeat word for word.
import type { Maker, Unit } from "../content/types";
import { type Progress, today } from "./progress";

/** Every generator in the ready units, once. */
export function practiceMakers(units: Unit[], chosen: Set<string>): Maker[] {
  const seen = new Set<string>();
  return units
    .filter((u) => u.ready)
    .flatMap((u) => u.lessons.flatMap((l) => l.items))
    .filter((m) => !m.fixed && (seen.has(m.id) ? false : (seen.add(m.id), true)))
    .filter((m) => m.concepts.some((c) => chosen.has(c)));
}

/** How much an idea wants practice: never tried or weak most, then overdue. */
export function need(p: Progress, concept: string): number {
  const k = p.skill[concept];
  if (!k) return 6;
  return (6 - k.s) * (k.due <= today() ? 2 : 1);
}

/** Practised before, and due again today. An idea never tried is new, not due. */
export const isDue = (p: Progress, concept: string) => !!p.skill[concept] && p.skill[concept].due <= today();

/**
 * The next maker: a miss from three or more questions back comes first;
 * otherwise a weighted pick, never the maker just used.
 */
export function nextMaker(
  makers: Maker[],
  chosen: Set<string>,
  p: Progress,
  history: { maker: Maker; ok?: boolean }[],
  r: () => number,
): Maker {
  for (let i = 0; i <= history.length - 3; i++) {
    const h = history[i];
    if (h.ok === false && !history.slice(i + 1).some((x) => x.maker.id === h.maker.id)) return h.maker;
  }
  const last = history[history.length - 1]?.maker.id;
  const pool = makers.length > 1 ? makers.filter((m) => m.id !== last) : makers;
  const weight = (m: Maker) => Math.max(1, ...m.concepts.filter((c) => chosen.has(c)).map((c) => need(p, c)));
  let x = r() * pool.reduce((s, m) => s + weight(m), 0);
  for (const m of pool) if ((x -= weight(m)) <= 0) return m;
  return pool[pool.length - 1];
}
