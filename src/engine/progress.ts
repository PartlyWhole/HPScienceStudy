// What the student has done, kept in this browser only: nothing is sent
// anywhere, and a private window or blocked storage simply starts afresh.
const KEY = "hpss-v1";

export type Progress = {
  /** How many times each lesson has been finished. */
  done: Record<string, number>;
  /** The latest score on each lesson. */
  last: Record<string, { right: number; total: number }>;
  /**
   * Questions missed, by the maker that made them. "Anything he misses opens
   * the next session's warm-up": the next warm-up asks fresh versions.
   */
  carry: string[];
  /** Per idea: strength 0–5, and the day it is next due for review. */
  skill: Record<string, { s: number; due: string }>;
};

export const emptyProgress = (): Progress => ({ done: {}, last: {}, carry: [], skill: {} });

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Nowhere to keep it; this visit still works.
  }
}

export const today = (d = new Date()) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

const addDays = (day: string, n: number) => {
  const d = new Date(day + "T12:00:00");
  d.setDate(d.getDate() + n);
  return today(d);
};

/** Review gaps by strength: a miss is due again today, a strong idea in two weeks. */
const GAP = [0, 1, 2, 4, 7, 14];

export function recordAnswer(p: Progress, concepts: string[], correct: boolean): Progress {
  const skill = { ...p.skill };
  for (const c of concepts) {
    const cur = skill[c] ?? { s: 0, due: today() };
    const s = Math.max(0, Math.min(5, cur.s + (correct ? 1 : -1)));
    skill[c] = { s, due: addDays(today(), GAP[s]) };
  }
  return { ...p, skill };
}

/**
 * A finished lesson: its score, its answers, and its misses carried forward.
 * A question answered right leaves the carried list; one missed joins it.
 */
export function finishLesson(
  p: Progress,
  lessonId: string,
  answers: { makerId: string; concepts: string[]; correct: boolean }[],
): Progress {
  let next = p;
  for (const a of answers) next = recordAnswer(next, a.concepts, a.correct);
  const right = new Set(answers.filter((a) => a.correct).map((a) => a.makerId));
  const missed = answers.filter((a) => !a.correct).map((a) => a.makerId);
  const carry = [...new Set([...next.carry.filter((id) => !right.has(id) || missed.includes(id)), ...missed])];
  return {
    ...next,
    carry,
    done: { ...next.done, [lessonId]: (next.done[lessonId] ?? 0) + 1 },
    last: { ...next.last, [lessonId]: { right: answers.filter((a) => a.correct).length, total: answers.length } },
  };
}
