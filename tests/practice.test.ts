import { describe, expect, it } from "vitest";
import { rng } from "../src/lib/rng";
import { UNITS, IDEAS } from "../src/content/course";
import { nextMaker, practiceMakers } from "../src/engine/practice";
import { emptyProgress } from "../src/engine/progress";

describe("endless practice", () => {
  const all = new Set(IDEAS.map((i) => i.id));

  it("uses generators only, and every idea on the list has some", () => {
    const makers = practiceMakers(UNITS, all);
    expect(makers.every((m) => !m.fixed)).toBe(true);
    for (const idea of IDEAS.filter((i) => UNITS.find((u) => u.id === i.unit)!.ready))
      expect(practiceMakers(UNITS, new Set([idea.id])).length, idea.id).toBeGreaterThan(0);
  });

  it("names every idea a lesson practises", () => {
    const named = new Set(IDEAS.map((i) => i.id));
    for (const u of UNITS.filter((x) => x.ready))
      for (const l of u.lessons) for (const m of l.items) for (const c of m.concepts) expect(named.has(c), m.id + " " + c).toBe(true);
  });

  it("never repeats the last question's maker, and brings a miss back", () => {
    const makers = practiceMakers(UNITS, all);
    const r = rng(11);
    const history: { maker: (typeof makers)[number]; ok?: boolean }[] = [];
    for (let n = 0; n < 50; n++) {
      const m = nextMaker(makers, all, emptyProgress(), history, r);
      if (history.length) expect(m.id).not.toBe(history[history.length - 1].maker.id);
      history.push({ maker: m, ok: n !== 4 });
    }
    expect(history.slice(5, 8).some((h) => h.maker.id === history[4].maker.id)).toBe(true);
  });
});
