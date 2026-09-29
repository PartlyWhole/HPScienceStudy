// Turning a lesson into the run of questions a student sees.
import type { Lesson, Maker, Question, Unit } from "../content/types";

export type Slot = { maker: Maker; q: Question; phase: "carried" | "main" | "again" };

/** Every maker on the course, by id, so a carried miss can be asked afresh. */
export function makerIndex(units: Unit[]): Map<string, Maker> {
  const out = new Map<string, Maker>();
  for (const u of units) for (const l of u.lessons) for (const m of l.items) out.set(m.id, m);
  return out;
}

/**
 * The lesson's questions in order. A warm-up opens with fresh versions of
 * what was missed last time — up to five — before its own.
 */
export function buildLesson(lesson: Lesson, r: () => number, carried: Maker[] = []): Slot[] {
  const first = lesson.kind === "warmup" ? carried.filter((m) => !lesson.items.includes(m)).slice(0, 5) : [];
  return [
    ...first.map((m) => ({ maker: m, q: m.make(r), phase: "carried" as const })),
    ...lesson.items.map((m) => ({ maker: m, q: m.make(r), phase: "main" as const })),
  ];
}

/** A miss comes back once, freshly made, at the end — except in the exit check, which is a check. */
export const againAllowed = (lesson: Lesson, slot: Slot) => lesson.kind !== "exit" && slot.phase !== "again";
