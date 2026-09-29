// Unit 2 (Session 2): the conversion-factor method. A factor is a fraction
// equal to 1; the unit to get rid of goes on the bottom; two steps go through
// the base unit. The plan's fourteen practice conversions and exit check are
// here as written, with generators for fresh ones.
import { formatStandard } from "../lib/answer";
import { int, pick, shuffle } from "../lib/rng";
import type { Maker, Question } from "./types";
import { type Factor, UNIT, type Units, convert } from "./units";
import { PREFIXES } from "./unit1";

const fixed = (id: string, concepts: string[], q: Question): Maker => ({ id, concepts, make: () => q, fixed: true });
const u = (s: string): Units => ({ num: [s], den: [] });
const tidy = (v: number) => Number(v.toPrecision(10));

/** The factor that turns one unit into the next, written with the bigger unit as 1. */
export function stepFactor(from: string, to: string): Factor {
  const a = UNIT[from].size, b = UNIT[to].size;
  return a >= b
    ? { top: { n: tidy(a / b), unit: to }, bottom: { n: 1, unit: from } }
    : { top: { n: 1, unit: to }, bottom: { n: tidy(b / a), unit: from } };
}

const setupText = (n: number, from: string, factors: Factor[], answer: number, to: string) =>
  `${formatStandard(n)} ${from} × ` +
  factors.map((f) => `(${formatStandard(f.top.n)} ${f.top.unit} / ${formatStandard(f.bottom.n)} ${f.bottom.unit})`).join(" × ") +
  ` = ${formatStandard(answer)} ${to}.`;

/**
 * A chain question from `from` to `to`, going through `via` on the way. The
 * worked setup and the trap (the one-factor-upside-down answer) come with it.
 */
export type ChainQ = Extract<Question, { kind: "chain" }>;

export function chain(n: number, from: string, to: string, via: string[] = [], o: { guided?: boolean; prompt?: string } = {}): ChainQ {
  const path = [from, ...via, to];
  const solution = path.slice(1).map((x, i) => stepFactor(path[i], x));
  const answer = convert(n, u(from), u(to));
  // The commonest slip: every factor flipped, so the number moves the wrong way.
  const flipped = tidy(solution.reduce((v, f) => (v * f.bottom.n) / f.top.n, n));
  const smaller = UNIT[to].size > UNIT[from].size;
  return {
    kind: "chain",
    prompt: o.prompt ?? `Convert ${formatStandard(n)} ${from} to ${to}.`,
    given: { n, units: u(from) },
    target: u(to),
    answer,
    solution,
    guided: o.guided,
    traps: flipped !== answer ? [{ value: flipped, note: `That moves the number the wrong way. ${UNIT[to].name[0].toUpperCase() + UNIT[to].name.slice(1)} are ${smaller ? "bigger" : "smaller"} than ${UNIT[from].name}, so the number should get ${smaller ? "smaller" : "bigger"}.` }] : [],
    why: setupText(n, from, solution, answer, to) + (via.length ? ` There's no single ${from}-to-${to} factor to memorize, so go through ${via.join(" and ")}.` : ""),
  };
}

// ---------------------------------------------------------------------------
// The plan's practice and exit check
// ---------------------------------------------------------------------------

const P = (k: number, n: number, from: string, to: string, via: string[] = [], concepts = ["factor-method"]) =>
  fixed("s2-practice-" + k, concepts, chain(n, from, to, via, {
    prompt: `Convert ${formatStandard(n)} ${from} to ${to}.` + (via.length ? ` (Two steps, through ${via.join(" and ")}.)` : ""),
  }));

export const PRACTICE_2: Maker[] = [
  P(1, 2.4, "km", "m"),
  P(2, 850, "mL", "L"),
  P(3, 7.5, "cm", "mm"),
  P(4, 0.62, "kg", "g"),
  P(5, 45, "min", "s", [], ["factor-method", "factors-to-know"]),
  P(6, 3, "hr", "s", [], ["factor-method", "factors-to-know"]),
  P(7, 15, "in", "cm", [], ["factor-method", "factors-to-know"]),
  P(8, 2.5, "mi", "ft", [], ["factor-method", "factors-to-know"]),
  P(9, 5, "yd", "ft", [], ["factor-method", "factors-to-know"]),
  P(10, 0.045, "MW", "W"),
];

export const PRACTICE_2_TWO_STEP: Maker[] = [
  P(11, 380, "mm", "cm", ["m"], ["two-step"]),
  fixed("s2-practice-12", ["factor-method", "sci-write"], {
    ...chain(2.6, "m", "µm"),
    prompt: "Convert 2.6 m to µm. (Then think: how would you write it in scientific notation?)",
    why: "2.6 m × (1,000,000 µm / 1 m) = 2,600,000 µm = 2.6 × 10⁶ µm.",
  }),
  P(13, 3, "day", "min", ["hr"], ["two-step", "factors-to-know"]),
  fixed("s2-practice-14", ["factor-method", "sci-standard"], {
    ...chain(5200, "g", "kg"),
    prompt: "Convert 5.2 × 10³ g to kg.",
    context: ["5.2 × 10³ g is 5,200 g."],
    why: "5,200 g × (1 kg / 1,000 g) = 5.2 kg.",
  }),
];

export const UPSIDE_DOWN: Question = {
  kind: "choice",
  prompt: "Which factor is upside down, and why?  50 cm × (100 cm / 1 m)",
  choices: [
    "100 cm / 1 m — cm has to be on the bottom to cancel, so use 1 m / 100 cm",
    "Nothing — it's set up correctly",
    "50 cm — it should be on the bottom",
    "100 cm / 1 m — it should be 1,000 cm / 1 m",
  ],
  correct: 0,
  why: "The cm you start with only cancels a cm on the bottom. Flip the factor: 50 cm × (1 m / 100 cm) = 0.5 m.",
  whyPerChoice: {
    1: "Look at the units: cm on top times cm on top gives cm², not m. Nothing cancels.",
    3: "1 m is 100 cm — the numbers are right. It's which way up the factor is that's wrong.",
  },
};

export const EXIT_2: Maker[] = [
  fixed("exit-2-ml", ["factor-method"], chain(0.75, "L", "mL")),
  fixed("exit-2-hr", ["factor-method", "factors-to-know"], chain(9000, "s", "hr")),
  fixed("exit-2-upside", ["factor-method"], UPSIDE_DOWN),
];

// ---------------------------------------------------------------------------
// Factors to know from memory
// ---------------------------------------------------------------------------

export const FACTS: { one: string; is: number; of: string }[] = [
  { one: "mi", is: 5280, of: "ft" },
  { one: "yd", is: 3, of: "ft" },
  { one: "min", is: 60, of: "s" },
  { one: "hr", is: 60, of: "min" },
  { one: "hr", is: 3600, of: "s" },
  { one: "day", is: 24, of: "hr" },
  { one: "yr", is: 365, of: "day" },
  { one: "in", is: 2.54, of: "cm" },
  { one: "cm³", is: 1, of: "mL" },
  { one: "L", is: 1000, of: "cm³" },
  { one: "m³", is: 1000, of: "L" },
];

const plural = (unit: string, n: number) => (unit === "day" && n !== 1 ? "days" : unit);

/** "1 mi = ___ ft" from memory. */
export const factRecall: Maker = {
  id: "fact-recall",
  concepts: ["factors-to-know"],
  make(r) {
    const f = pick(r, FACTS);
    return {
      kind: "number",
      prompt: `From memory: 1 ${f.one} = ___ ${plural(f.of, f.is)}`,
      answer: f.is,
      unit: plural(f.of, f.is),
      why: `1 ${f.one} = ${formatStandard(f.is)} ${plural(f.of, f.is)}.`,
    };
  },
};

/** Warm-up: each prefix's power of ten, from memory. */
export const prefixPowers = fixed("warmup-prefix-powers", ["prefixes"], {
  kind: "table",
  prompt: "From memory: the power of ten for each prefix.",
  columns: ["Prefix", "Symbol", "Power of ten"],
  rows: PREFIXES.map((p) => [{ given: p.name + "-" }, { given: p.symbol }, { number: Number(`1e${p.power}`), placeholder: "10^?" }]),
  why: "mega 10⁶, kilo 10³, centi 10⁻², milli 10⁻³, micro 10⁻⁶. Type them as 10^6, 10^-2 and so on.",
});

export const warmSci = fixed("warmup-2-sci", ["sci-write"], {
  kind: "number",
  prompt: "Write 0.00056 in scientific notation.",
  answer: 5.6e-4,
  form: "sci",
  traps: [{ value: 5.6e4, note: "Small numbers (less than 1) get negative powers." }],
  why: "Move the point 4 places right to get 5.6: 5.6 × 10⁻⁴.",
});

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Metric pairs one factor apart, and pairs that need the base unit between them. */
const ONE_STEP: [string, string][] = [
  ["km", "m"], ["m", "cm"], ["m", "mm"], ["m", "µm"], ["kg", "g"], ["g", "mg"], ["L", "mL"], ["L", "µL"], ["MW", "W"], ["kW", "W"],
];
const TWO_STEP: [string, string, string][] = [
  ["mm", "cm", "m"], ["cm", "mm", "m"], ["km", "cm", "m"], ["cm", "km", "m"], ["mg", "kg", "g"], ["kg", "mg", "g"], ["mL", "µL", "L"], ["µm", "mm", "m"], ["MW", "kW", "W"],
];
const TIME_ONE: [string, string][] = [["min", "s"], ["hr", "min"], ["hr", "s"], ["day", "hr"], ["yr", "day"]];
const TIME_TWO: [string, string, string][] = [["day", "min", "hr"], ["hr", "s", "min"], ["day", "s", "hr"]];
const ENGLISH: [string, string][] = [["mi", "ft"], ["yd", "ft"], ["in", "cm"]];

const AMOUNTS = [0.25, 0.5, 0.75, 1.5, 2.4, 3.2, 4.5, 6, 7.5, 12, 25, 45, 250, 380, 850, 1200, 4200];

/** Either way round: km → m, or m → km. */
const either = <T extends string[]>(r: () => number, pair: T): T => (r() < 0.5 ? pair : ([pair[1], pair[0], ...pair.slice(2)] as T));

export function chainMaker(id: string, kind: "metric" | "metric-two" | "time" | "time-two" | "english", o: { guided?: boolean } = {}): Maker {
  return {
    id,
    concepts: kind === "metric-two" || kind === "time-two" ? ["two-step"] : kind === "metric" ? ["factor-method"] : ["factor-method", "factors-to-know"],
    make(r) {
      const n = pick(r, AMOUNTS);
      if (kind === "metric") {
        const [a, b] = either(r, pick(r, ONE_STEP));
        return chain(n, a, b, [], o);
      }
      if (kind === "metric-two") {
        const [a, b, via] = pick(r, TWO_STEP);
        return chain(n, a, b, [via], o);
      }
      if (kind === "time") {
        const [a, b] = pick(r, TIME_ONE);
        // Big to small mostly: 3 hr → s; sometimes back: 9,000 s → hr.
        return r() < 0.7 ? chain(pick(r, [1.5, 2, 3, 4, 45, 0.5]), a, b, [], o) : chain(int(r, 2, 9) * UNIT[a].size / UNIT[b].size, b, a, [], o);
      }
      if (kind === "time-two") {
        const [a, b, via] = pick(r, TIME_TWO);
        return chain(pick(r, [2, 3, 1.5, 0.5]), a, b, [via], o);
      }
      const [a, b] = pick(r, ENGLISH);
      return chain(pick(r, [2, 2.5, 5, 12, 15, 0.5]), a, b, [], o);
    },
  };
}

/** Which of these fractions equals 1? Both ways up are 1; wrong numbers are not. */
export const whichIsOne: Maker = {
  id: "which-is-one",
  concepts: ["factor-idea"],
  make(r) {
    const [a, b] = pick(r, ONE_STEP);
    const k = tidy(UNIT[a].size / UNIT[b].size);
    const flipTrue = r() < 0.5;
    const right = flipTrue ? `1 ${a} / ${formatStandard(k)} ${b}` : `${formatStandard(k)} ${b} / 1 ${a}`;
    const wrong = [`${formatStandard(k)} ${a} / 1 ${b}`, `1 ${b} / ${formatStandard(k)} ${a}`, `${formatStandard(k / 10)} ${b} / 1 ${a}`];
    const choices = shuffle(r, [right, ...wrong]);
    return {
      kind: "choice",
      prompt: "Which of these fractions is equal to 1?",
      choices,
      correct: choices.indexOf(right),
      why: `1 ${a} = ${formatStandard(k)} ${b}: the top and the bottom are the same amount written two ways, so the fraction is 1 — whichever way up it is.`,
    };
  },
};

/** Before any arithmetic: should the number get bigger or smaller? */
export const senseCheck: Maker = {
  id: "sense-check",
  concepts: ["factor-method"],
  make(r) {
    const [a, b] = either(r, pick(r, [...ONE_STEP, ...TWO_STEP.map(([x, y]) => [x, y] as [string, string]), ...ENGLISH]));
    const n = pick(r, AMOUNTS);
    const bigger = UNIT[b].size < UNIT[a].size;
    const BIG = "Bigger — the new unit is smaller, so it takes more of them";
    const SMALL = "Smaller — the new unit is bigger, so it takes fewer of them";
    return {
      kind: "choice",
      prompt: `Converting ${formatStandard(n)} ${a} to ${b}: will the number get bigger or smaller?`,
      choices: [BIG, SMALL],
      correct: bigger ? 0 : 1,
      why: `${UNIT[b].name[0].toUpperCase() + UNIT[b].name.slice(1)} are ${bigger ? "smaller" : "bigger"} than ${UNIT[a].name}, so the answer is ${bigger ? "bigger" : "smaller"}: ${formatStandard(convert(n, u(a), u(b)))} ${b}.`,
    };
  },
};

/** Which setup is the right way up? */
export const rightWayUp: Maker = {
  id: "right-way-up",
  concepts: ["factor-method"],
  make(r) {
    const [a, b] = either(r, pick(r, [...ONE_STEP, ...ENGLISH]));
    const n = pick(r, AMOUNTS);
    const f = stepFactor(a, b);
    const good = `${formatStandard(n)} ${a} × (${formatStandard(f.top.n)} ${f.top.unit} / ${formatStandard(f.bottom.n)} ${f.bottom.unit})`;
    const bad = `${formatStandard(n)} ${a} × (${formatStandard(f.bottom.n)} ${f.bottom.unit} / ${formatStandard(f.top.n)} ${f.top.unit})`;
    const choices = shuffle(r, [good, bad]);
    return {
      kind: "choice",
      prompt: `Which setup converts ${formatStandard(n)} ${a} to ${b}?`,
      choices,
      correct: choices.indexOf(good),
      why: `${a} has to be on the bottom of the factor to cancel the ${a} you start with. ${good} = ${formatStandard(convert(n, u(a), u(b)))} ${b}.`,
    };
  },
};

export const GENERATORS_2: Maker[] = [
  chainMaker("chain-metric", "metric"),
  chainMaker("chain-metric-two", "metric-two"),
  chainMaker("chain-time", "time"),
  chainMaker("chain-time-two", "time-two"),
  chainMaker("chain-english", "english"),
  factRecall,
  whichIsOne,
  senseCheck,
  rightWayUp,
];

