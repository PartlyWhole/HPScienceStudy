import { describe, expect, it } from "vitest";
import { rng } from "../src/lib/rng";
import { gradeChain } from "../src/engine/grade";
import { UNITS } from "../src/content/course";
import { cancel, chainValue, factorTrue, sameUnits } from "../src/content/units";
import { EXIT_3, GENERATORS_3, RATE_PRACTICE, rateChain } from "../src/content/unit3";
import { TERMS, keysFound } from "../src/content/vocab";

const unit3 = UNITS.find((u) => u.id === "u3")!;
const makers = [...new Set([...unit3.lessons.flatMap((l) => l.items), ...GENERATORS_3])];

describe("unit 3: rates and vocabulary", () => {
  it("gives every rate a true, cancelling, correct worked setup", () => {
    for (const m of makers)
      for (let s = 1; s <= 60; s++) {
        const q = m.make(rng(s * 15485863));
        const where = m.id + " seed " + s + " " + q.prompt;
        if (q.kind === "chain") {
          for (const f of q.solution) expect(factorTrue(f), where).toBe(true);
          expect(sameUnits(cancel(q.given.units, q.solution), q.target), where).toBe(true);
          expect(Math.abs(chainValue(q.given.n, q.solution) - q.answer) <= Math.abs(q.answer) * 0.005, where).toBe(true);
          expect(gradeChain(q, q.solution, String(q.answer)).ok, where).toBe(true);
        }
        if (q.kind === "choice") {
          expect(new Set(q.choices).size, where).toBe(q.choices.length);
          expect(q.correct, where).toBeGreaterThanOrEqual(0);
        }
        if (q.kind === "recall") expect(keysFound(q.keys, q.model).every(Boolean), where + " model has its key words").toBe(true);
      }
  });

  it("keeps the plan's answer key", () => {
    const got = RATE_PRACTICE.map((m) => m.make(rng(1))).map((q) => (q.kind === "chain" ? q.answer : NaN));
    [25, 43.2, 80, 13.4, 9, 300, 0.1].forEach((v, i) => expect(Math.abs(got[i] - v) <= v * 0.005, "rate " + (i + 1) + " got " + got[i]).toBe(true));
    const exit = EXIT_3[2].make(rng(1));
    expect(exit.kind === "chain" && exit.answer).toBe(10);
  });

  it("catches the bottom unit's factor upside down", () => {
    const q = rateChain(90, { num: ["km"], den: ["hr"] }, { num: ["m"], den: ["s"] });
    const v = gradeChain(q, [q.solution[0], { top: { n: 3600, unit: "s" }, bottom: { n: 1, unit: "hr" } }], "324000");
    expect(v.ok).toBe(false);
    expect(v.notes.join(" ")).toMatch(/upside down/);
  });

  it("finds key words honestly", () => {
    for (const t of TERMS) {
      expect(keysFound(t.keys, t.model).every(Boolean), t.term).toBe(true);
      expect(keysFound(t.keys, "I don't know").every(Boolean), t.term + " blank").toBe(false);
    }
    const base = TERMS[0];
    expect(keysFound(base.keys, "a basic measurement")[0], "si is not inside basic").toBe(false);
  });
});
