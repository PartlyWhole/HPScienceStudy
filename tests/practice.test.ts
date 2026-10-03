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

import { retryOf } from "../src/engine/session";

describe("lesson size and retries", () => {
  it("keeps every lesson short: eight questions at most, six cards a set", () => {
    for (const u of UNITS.filter((x) => x.ready))
      for (const l of u.lessons) expect(l.items.length, l.id + " " + l.title).toBeLessThanOrEqual(l.kind === "cards" ? 6 : 8);
  });

  it("retries a missed plan question with a fresh one when the lesson has one", () => {
    const l = UNITS[0].lessons.find((x) => x.id === "1.4")!;
    const fixed = l.items.find((m) => m.fixed)!;
    const slot = { maker: fixed, q: fixed.make(rng(1)), phase: "main" as const };
    const again = retryOf(l, slot, rng(2));
    expect(again.prompt).not.toBe(slot.q.prompt);
  });
});

import { linkedIdeas } from "../src/ui/Practice";

describe("practice links", () => {
  it("reads the ideas a link asks for, and ignores ones that don't exist", () => {
    expect(linkedIdeas("#practice=rates,two-step")).toEqual(["rates", "two-step"]);
    expect(linkedIdeas("#practice=rates,nonsense")).toEqual(["rates"]);
    expect(linkedIdeas("#practice=nonsense")).toBeNull();
    expect(linkedIdeas("")).toBeNull();
  });
});
