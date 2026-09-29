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
  const asked = new Set<string>();
  // A maker listed twice should not ask the same thing twice: try again for a fresh one.
  const fresh = (m: Maker) => {
    let q = m.make(r);
    for (let t = 0; t < 8 && asked.has(q.prompt); t++) q = m.make(r);
    asked.add(q.prompt);
    return q;
  };
  return [
    ...first.map((m) => ({ maker: m, q: fresh(m), phase: "carried" as const })),
    ...lesson.items.map((m) => ({ maker: m, q: fresh(m), phase: "main" as const })),
  ];
}

/** A miss comes back once, freshly made, at the end — except in the exit check, which is a check. */
export const againAllowed = (lesson: Lesson, slot: Slot) => lesson.kind !== "exit" && slot.phase !== "again";

/**
 * A fresh question for a miss. A generator makes a new one; a fixed question
 * from the plan is swapped for a generator in the same lesson on the same
 * idea, so the retry is recalled rather than read back. Only when there is no
 * such generator does the same question come back.
 */
export function retryOf(lesson: Lesson, slot: Slot, r: () => number): import("../content/types").Question {
  if (!slot.maker.fixed) {
    let q = slot.maker.make(r);
    for (let t = 0; t < 8 && q.prompt === slot.q.prompt; t++) q = slot.maker.make(r);
    return q;
  }
  const sibling = lesson.items.find((m) => !m.fixed && m.concepts.some((c) => slot.maker.concepts.includes(c)) && m.make(r).kind === slot.q.kind);
  return (sibling ?? slot.maker).make(r);
}
