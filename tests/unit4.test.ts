import { describe, expect, it } from "vitest";
import { rng } from "../src/lib/rng";
import { gradePart, gradeChain } from "../src/engine/grade";
import { UNITS } from "../src/content/course";
import { EXIT_4, GENERATORS_4, PRACTICE_4 } from "../src/content/unit4";
import { formatStandard } from "../src/lib/answer";

const unit4 = UNITS.find((u) => u.id === "u4")!;
const makers = [...new Set([...unit4.lessons.flatMap((l) => l.items), ...GENERATORS_4])];
const answers = (q: ReturnType<(typeof PRACTICE_4)[number]["make"]>) => (q.kind === "steps" ? q.parts.map((p) => p.answer) : q.kind === "chain" ? [q.answer] : []);

describe("unit 4: volume", () => {
  it("makes steps whose answers grade right and whose traps are wrong", () => {
    for (const m of makers)
      for (let s = 1; s <= 60; s++) {
        const q = m.make(rng(s * 32452843));
        const where = m.id + " seed " + s + " " + q.prompt;
        if (q.kind !== "steps") continue;
        for (const p of q.parts) {
          expect(Number.isFinite(p.answer), where).toBe(true);
          expect(gradePart(p, formatStandard(p.answer).replace(/,/g, "")).ok, where + " " + p.label).toBe(true);
          for (const t of p.traps ?? []) expect(gradePart(p, String(t.value)).ok, where + " trap " + t.value + " for " + p.label).toBe(false);
        }
        if (q.figure?.kind === "solid") {
          const s2 = q.figure.solid;
          const dims = s2.shape === "box" ? [s2.l, s2.w, s2.h] : s2.shape === "cylinder" ? [s2.h, s2.d ?? s2.r!] : [s2.a, s2.b, s2.c, s2.d, s2.h];
          for (const d of dims) expect(d, where).toBeGreaterThan(0);
          if (s2.shape === "lshape") expect(s2.c, where + " the L's foot fits").toBeLessThan(s2.a);
        }
      }
  });

  it("keeps the plan's answer key", () => {
    const got = PRACTICE_4.map((m) => answers(m.make(rng(1))));
    const want = [[1920, 1.92], [125], [282.7], [3.3, 417.4, 0.4174], [63000, 63], [1.27, 0.635, 8.89, 11.3], [2.4, 2400], [18, 54], [8.5, 3.5]];
    want.forEach((w, i) => w.forEach((v, k) => expect(Math.abs(got[i][k] - v) <= Math.abs(v) * 0.02, `practice ${i + 1} part ${k + 1}: ${got[i][k]} vs ${v}`).toBe(true)));
    const exit = EXIT_4.map((m) => m.make(rng(1)));
    expect(answers(exit[0]).map((v) => Math.round(v * 10) / 10)).toEqual([5, 314.2]);
    const liters = exit[1];
    expect(liters.kind === "chain" && liters.answer).toBe(2.5);
    if (liters.kind === "chain") expect(gradeChain(liters, liters.solution, "2.5").ok).toBe(true);
  });
});
