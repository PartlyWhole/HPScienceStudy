import { describe, expect, it } from "vitest";
import { rng } from "../src/lib/rng";
import { gradeChain, gradeNumber } from "../src/engine/grade";
import { buildLesson } from "../src/engine/session";
import { UNITS } from "../src/content/course";
import { cancel, chainValue, factorTrue, sameUnits } from "../src/content/units";
import { EXIT_2, GENERATORS_2, PRACTICE_2, PRACTICE_2_TWO_STEP, chain } from "../src/content/unit2";
import { formatStandard } from "../src/lib/answer";

const unit2 = UNITS.find((u) => u.id === "u2")!;
const makers = [...new Set([...unit2.lessons.flatMap((l) => l.items), ...GENERATORS_2])];

describe("unit 2: the conversion-factor method", () => {
  it("gives every chain a true, cancelling, correct worked setup", () => {
    for (const m of makers)
      for (let s = 1; s <= 60; s++) {
        const q = m.make(rng(s * 104729));
        const where = m.id + " seed " + s + " " + q.prompt;
        if (q.kind === "chain") {
          for (const f of q.solution) expect(factorTrue(f), where + " factor true").toBe(true);
          expect(sameUnits(cancel(q.given.units, q.solution), q.target), where + " cancels").toBe(true);
          expect(Math.abs(chainValue(q.given.n, q.solution) - q.answer) <= Math.abs(q.answer) * 1e-9, where + " value").toBe(true);
          expect(gradeChain(q, q.solution, formatStandard(q.answer).replace(/,/g, "")).ok, where + " grades right").toBe(true);
          for (const t of q.traps ?? []) expect(t.value, where).not.toBe(q.answer);
        }
        if (q.kind === "number") expect(gradeNumber(q, q.form === "sci" ? q.answer.toExponential() : String(q.answer)).ok, where).toBe(true);
        if (q.kind === "choice") expect(new Set(q.choices).size, where).toBe(q.choices.length);
      }
  });

  it("keeps the plan's answer key", () => {
    const got = [...PRACTICE_2, ...PRACTICE_2_TWO_STEP].map((m) => m.make(rng(1))).map((q) => (q.kind === "chain" ? q.answer : NaN));
    const want = [2400, 0.85, 75, 620, 2700, 10800, 38.1, 13200, 15, 45000, 38, 2_600_000, 4320, 5.2];
    want.forEach((v, i) => expect(got[i], "practice " + (i + 1)).toBeCloseTo(v, 9));
    const exit = EXIT_2.map((m) => m.make(rng(1)));
    expect(exit[0].kind === "chain" && exit[0].answer).toBe(750);
    expect(exit[1].kind === "chain" && exit[1].answer).toBe(2.5);
  });

  it("names each fault in a setup", () => {
    const q = chain(50, "cm", "m");
    const upside = gradeChain(q, [{ top: { n: 100, unit: "cm" }, bottom: { n: 1, unit: "m" } }], "5000");
    expect(upside.ok).toBe(false);
    expect(upside.notes.join(" ")).toMatch(/upside down/);
    const untrue = gradeChain(q, [{ top: { n: 1, unit: "m" }, bottom: { n: 1000, unit: "cm" } }], "0.05");
    expect(untrue.notes.join(" ")).toMatch(/isn't equal to 1/);
    const oneShort = gradeChain(chain(4200, "mg", "kg", ["g"]), [{ top: { n: 1, unit: "g" }, bottom: { n: 1000, unit: "mg" } }], "4.2");
    expect(oneShort.notes.join(" ")).toMatch(/units left are g/);
    const arithmetic = gradeChain(q, q.solution, "5");
    expect(arithmetic.notes.join(" ")).toMatch(/check the arithmetic/);
    const roundTrip = gradeChain(q, [{ top: { n: 1, unit: "m" }, bottom: { n: 100, unit: "cm" } }], "0.5");
    expect(roundTrip.ok).toBe(true);
  });

  it("does not ask the same question twice in a lesson", () => {
    const facts = unit2.lessons.find((l) => l.id === "2.2")!;
    for (let s = 1; s <= 20; s++) {
      const prompts = buildLesson(facts, rng(s)).map((x) => x.q.prompt);
      expect(new Set(prompts).size, "seed " + s).toBe(prompts.length);
    }
  });
});
