import { describe, expect, it } from "vitest";
import { formatSci, formatStandard, parseAnswer, preview } from "../src/lib/answer";
import { rng } from "../src/lib/rng";
import { gradeCell, gradeNumber, gradeText } from "../src/engine/grade";
import { emptyProgress, finishLesson } from "../src/engine/progress";
import { buildLesson } from "../src/engine/session";
import { UNITS } from "../src/content/course";
import { EXIT_1, GENERATORS_1, PRACTICE_A, PRACTICE_B } from "../src/content/unit1";
import type { Question } from "../src/content/types";

/** How a student would type the right answer in the form asked for. */
function typed(q: Extract<Question, { kind: "number" }>): string {
  if (q.form === "sci") return formatSci(q.answer).replace(" × 10", " x 10^").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/, (s) => [...s].map((c) => "0123456789-"["⁰¹²³⁴⁵⁶⁷⁸⁹⁻".indexOf(c)]).join(""));
  if (q.form === "fraction") return "1/" + Math.round(1 / q.answer);
  return formatStandard(q.answer).replace("−", "-");
}

describe("reading answers", () => {
  it("reads every way a number gets typed", () => {
    expect(parseAnswer("4,500")).toMatchObject({ value: 4500, form: "standard" });
    expect(parseAnswer("4.5 x 10^3")).toMatchObject({ value: 4500, form: "sci", mantissa: 4.5, exponent: 3 });
    expect(parseAnswer("4.5×10³")?.value).toBe(4500);
    expect(parseAnswer("7.2 × 10⁻³")?.value).toBeCloseTo(0.0072, 12);
    expect(parseAnswer("5.6e-4")).toMatchObject({ form: "sci" });
    expect(parseAnswer("5.6 * 10^(-4)")?.value).toBeCloseTo(0.00056, 12);
    expect(parseAnswer("10^-2")).toMatchObject({ value: 0.01, form: "sci" });
    expect(parseAnswer("1/100")).toMatchObject({ value: 0.01, form: "fraction" });
    expect(parseAnswer("−3")?.value).toBe(-3);
    expect(parseAnswer(".5")?.value).toBe(0.5);
    expect(parseAnswer("abc")).toBeNull();
    expect(parseAnswer("a million")?.value).toBe(1_000_000);
    expect(parseAnswer("9.3e+7")).toMatchObject({ value: 93_000_000, form: "sci" });
    expect(parseAnswer("one thousandth")?.value).toBe(0.001);
    expect(parseAnswer("1/0")).toBeNull();
  });

  it("writes numbers back cleanly", () => {
    expect(formatStandard(0.000007)).toBe("0.000007");
    expect(formatStandard(93000000)).toBe("93,000,000");
    expect(formatStandard(0.1 + 0.2)).toBe("0.3");
    expect(formatSci(0.00056)).toBe("5.6 × 10⁻⁴");
    expect(formatSci(1609)).toBe("1.609 × 10³");
    expect(preview("4.5x10^3")).toBe("4.5 × 10³");
  });

  it("asks for the form a question asks for", () => {
    const q = { kind: "number" as const, prompt: "", answer: 0.0072, form: "sci" as const, why: "" };
    expect(gradeNumber(q, "7.2 x 10^-3").ok).toBe(true);
    expect(gradeNumber(q, "0.0072")).toMatchObject({ ok: false });
    expect(gradeNumber(q, "72 x 10^-4").note).toMatch(/1 to just under 10/);
    expect(gradeNumber({ ...q, answer: 4500, form: "standard" }, "4.5e3").ok).toBe(false);
    expect(gradeNumber({ ...q, answer: 0.01, form: "fraction" }, "1/100").ok).toBe(true);
    expect(gradeText(["mega", "mega-"], " Mega ")).toBe(true);
    expect(gradeCell({ text: ["M"], caseSensitive: true }, "m")).toBe(false);
  });
});

describe("unit 1", () => {
  const lessons = UNITS[0].lessons;
  const makers = [...new Set(lessons.flatMap((l) => l.items))];

  it("makes well-formed questions that grade right when answered right", () => {
    for (const m of [...makers, ...GENERATORS_1])
      for (let s = 1; s <= 60; s++) {
        const q = m.make(rng(s * 7919));
        const where = m.id + " seed " + s;
        expect(q.prompt.length, where).toBeGreaterThan(4);
        if (q.kind === "number") {
          expect(Number.isFinite(q.answer), where).toBe(true);
          expect(gradeNumber(q, typed(q)).ok, where + " typed " + typed(q)).toBe(true);
          for (const t of q.traps ?? []) expect(Math.abs(t.value - q.answer) > (q.tolerance ?? 0) + 1e-12, where + " trap equals answer").toBe(true);
          for (const c of q.figure?.kind === "cylinders" ? q.figure.cylinders : []) {
            expect(c.level, where).toBeGreaterThanOrEqual(c.from);
            expect(c.level, where).toBeLessThanOrEqual(c.to);
            expect(Math.abs(c.level / c.line - Math.round(c.level / c.line)) < 1e-6, where + " level on a line").toBe(true);
            expect((c.to - c.from) / c.label, where + " a number shows").toBeGreaterThanOrEqual(1);
            // The surface is never at an edge, where its curve would be cut off.
            expect(c.level - c.from, where + " room below").toBeGreaterThanOrEqual(2 * c.line - 1e-9);
            expect(c.to - c.level, where + " room above").toBeGreaterThanOrEqual(2 * c.line - 1e-9);
          }
        }
        if (q.kind === "choice") {
          expect(new Set(q.choices).size, where + " distinct").toBe(q.choices.length);
          expect(q.correct, where).toBeGreaterThanOrEqual(0);
        }
        if (q.kind === "table")
          for (const row of q.rows)
            for (const c of row) if (!("given" in c)) expect(gradeCell(c, "text" in c ? c.text[0] : String(c.number)), where).toBe(true);
        if (q.kind === "text") expect(gradeText(q.accept, q.accept[0]), where).toBe(true);
      }
  });

  it("keeps the plan's answer key", () => {
    const answers = (ms: typeof PRACTICE_A) => ms.map((m) => m.make(rng(1))).map((q) => (q.kind === "number" ? q.answer : q.kind === "choice" ? q.choices[q.correct] : null));
    expect(answers(PRACTICE_A)).toEqual([1000, 100, 1000, 1_000_000, 1_000_000, "1 Mg, a billion times bigger", "mkg"]);
    const b = answers(PRACTICE_B) as number[];
    [4500, 602000, 0.031, 0.000007, 9.3e7, 5.6e-4, 1609, 0.04].forEach((v, i) => expect(b[i]).toBeCloseTo(v, 12));
    expect(answers(EXIT_1)).toEqual([0.01, 0.01, 0.0072, 9]);
  });

  it("opens the warm-up with what was missed, and clears it once answered", () => {
    let p = emptyProgress();
    p = finishLesson(p, "1.2", [{ makerId: "to-sci", concepts: ["sci-write"], correct: false }]);
    expect(p.carry).toEqual(["to-sci"]);
    const warm = lessons.find((l) => l.kind === "warmup")!;
    const slots = buildLesson(warm, rng(3), GENERATORS_1.filter((m) => p.carry.includes(m.id)));
    expect(slots[0].phase).toBe("carried");
    p = finishLesson(p, warm.id, [{ makerId: "to-sci", concepts: ["sci-write"], correct: true }]);
    expect(p.carry).toEqual([]);
    expect(p.skill["sci-write"].s).toBe(1);
  });
});
