// Unit 3 (Session 3): "per" units and the Chapter 8 vocabulary. A rate is a
// fraction: convert the top unit, then the bottom one, which a factor
// cancels by carrying it on top. The vocabulary is written from memory and
// checked against its key words — the plan's index cards, on screen.
import { formatStandard } from "../lib/answer";
import { pick, shuffle } from "../lib/rng";
import type { Maker, Question } from "./types";
import { type Factor, type Units, chainValue, convert, unitText } from "./units";
import { chain, stepFactor } from "./unit2";
import { BASE_UNITS, FACTS, TERMS, type Term } from "./vocab";

type ChainQ = Extract<Question, { kind: "chain" }>;
const fixed = (id: string, concepts: string[], q: Question): Maker => ({ id, concepts, make: () => q, fixed: true });
const per = (a: string, b: string): Units => ({ num: [a], den: [b] });
const tidy = (v: number) => Number(v.toPrecision(10));
const frac = (f: Factor) => `(${formatStandard(f.top.n)} ${f.top.unit} / ${formatStandard(f.bottom.n)} ${f.bottom.unit})`;

/** The rounded factor the plan uses for miles. */
const PLAN_FACTOR: Record<string, Factor> = {
  "mi>m": { top: { n: 1609, unit: "m" }, bottom: { n: 1, unit: "mi" } },
};

/**
 * A rate conversion: the top unit first, then the bottom one. The bottom
 * unit is cancelled by a factor with that unit on top.
 */
export function rateChain(n: number, from: Units, to: Units, o: { guided?: boolean; prompt?: string } = {}): ChainQ {
  const [a, b] = [from.num[0], from.den[0]], [c, d] = [to.num[0], to.den[0]];
  const solution: Factor[] = [];
  if (a !== c) solution.push(PLAN_FACTOR[a + ">" + c] ?? stepFactor(a, c));
  if (b !== d) solution.push(stepFactor(d, b));
  const answer = a === "mi" ? tidy(chainValue(n, solution)) : convert(n, from, to);
  // The classic slip: the bottom unit's factor flipped, multiplying where it should divide.
  const flipped = tidy(solution.reduce((v, f, i) => (i === solution.length - 1 && b !== d ? (v * f.bottom.n) / f.top.n : (v * f.top.n) / f.bottom.n), n));
  return {
    kind: "chain",
    prompt: o.prompt ?? `Convert ${formatStandard(n)} ${unitText(from)} to ${unitText(to)}.`,
    given: { n, units: from },
    target: to,
    answer,
    solution,
    guided: o.guided,
    traps:
      b !== d && flipped !== answer
        ? [{ value: flipped, note: `The ${b} is on the bottom of ${unitText(from)}, so the factor that cancels it has ${b} on top. That answer has it the other way up.` }]
        : [],
    why:
      `${formatStandard(n)} ${unitText(from)} × ${solution.map(frac).join(" × ")} = ${formatStandard(answer)} ${unitText(to)}.` +
      (b !== d ? ` The top unit first, then the bottom: ${b} is cancelled by a factor with ${b} on top.` : ""),
  };
}

// ---------------------------------------------------------------------------
// The plan's rate practice, warm-up and exit check
// ---------------------------------------------------------------------------

const R = (k: number, n: number, from: Units, to: Units, note = "") =>
  fixed("s3-rate-" + k, ["rates"], rateChain(n, from, to, { prompt: `Convert ${formatStandard(n)} ${unitText(from)} to ${unitText(to)}.${note}` }));

export const RATE_PRACTICE: Maker[] = [
  R(1, 90, per("km", "hr"), per("m", "s"), " (The worked example — now without looking.)"),
  R(2, 12, per("m", "s"), per("km", "hr")),
  R(3, 4.8, per("L", "min"), per("mL", "s")),
  R(4, 30, per("mi", "hr"), per("m", "s"), " Use 1,609 m = 1 mi."),
  R(5, 2.5, per("g", "s"), per("kg", "hr")),
  R(6, 18, per("L", "hr"), per("mL", "min")),
  R(7, 600, per("cm", "min"), per("m", "s")),
];

export const WARMUP_3: Maker[] = [
  fixed("warmup-3-mi", ["factor-method", "factors-to-know"], chain(2.5, "mi", "ft", [], { prompt: "From memory, with the full setup: convert 2.5 mi to ft." })),
  fixed("warmup-3-mm", ["two-step"], chain(380, "mm", "cm", ["m"], { prompt: "With the full setup: convert 380 mm to cm, through meters." })),
];

export const EXIT_3: Maker[] = [
  fixed("exit-3-derived", ["vocab"], {
    kind: "recall",
    prompt: "Define derived unit, and give two examples.",
    model: "A unit made by combining base units — for example the newton (force), the joule (energy) or the pascal (pressure).",
    keys: [
      { label: "made by combining base units", any: ["combin", "made from", "made of", "made by", "built from", "base unit", "two or more"] },
      { label: "two examples", any: ["joule", "newton", "watt", "m³", "m3", "cubic", "volt", "m/s", "speed", "area", "volume", "density", "pascal"], count: 2 },
    ],
    why: "Derived units combine base units: the newton, the joule, the pascal, the hertz.",
  }),
  fixed("exit-3-why-one", ["factor-idea"], {
    kind: "recall",
    prompt: "Why is a conversion factor equal to 1?",
    model: "Its top and bottom are the same amount, written in two different units — like 1,000 m and 1 km.",
    keys: [
      { label: "top and bottom are the same amount", any: ["same", "equal", "equivalent"] },
      { label: "written in different units", any: ["unit", "two way", "different", "top", "bottom", "numerator", "denominator"] },
    ],
    why: "The top and bottom are the same amount written two ways, so the fraction is 1 — and multiplying by 1 changes only the units.",
  }),
  fixed("exit-3-rate", ["rates"], rateChain(36, per("km", "hr"), per("m", "s"))),
];

// ---------------------------------------------------------------------------
// Rates, generated
// ---------------------------------------------------------------------------

const RATES: [Units, Units, number[]][] = [
  [per("km", "hr"), per("m", "s"), [18, 36, 54, 72, 90, 108, 144]],
  [per("m", "s"), per("km", "hr"), [5, 10, 12, 15, 20, 25, 30]],
  [per("L", "min"), per("mL", "s"), [1.2, 2.4, 3, 4.8, 6, 9]],
  [per("mL", "s"), per("L", "min"), [5, 10, 25, 50, 80]],
  [per("g", "s"), per("kg", "hr"), [0.5, 1.5, 2.5, 4, 10]],
  [per("cm", "min"), per("m", "s"), [300, 600, 900, 1200, 1800]],
  [per("m", "min"), per("km", "hr"), [50, 100, 250, 400, 500]],
  [per("mg", "s"), per("g", "min"), [5, 20, 50, 100]],
];

export function rateMaker(id: string, o: { guided?: boolean } = {}): Maker {
  return {
    id,
    concepts: ["rates"],
    make(r) {
      const [from, to, amounts] = pick(r, RATES);
      return rateChain(pick(r, amounts), from, to, o);
    },
  };
}

// ---------------------------------------------------------------------------
// Vocabulary and facts
// ---------------------------------------------------------------------------

/** Four terms at a time: about what working memory holds. */
export const TERM_SETS: Term[][] = [TERMS.slice(0, 4), TERMS.slice(4, 8), TERMS.slice(8)];

const recallOf = (t: Term): Question => ({
  kind: "recall",
  prompt: `Define: ${t.term}`,
  model: t.model,
  keys: t.keys,
  why: t.model,
});

/** One card per term, for the cards drill, in two sets of six. */
export const CARDS: Maker[] = TERMS.map((t) => fixed("card-" + t.term.replace(/[^a-z]+/gi, "-").toLowerCase(), ["vocab"], recallOf(t)));
export const CARD_SETS: Maker[][] = [CARDS.slice(0, 6), CARDS.slice(6)];

/** Define a term from memory, from these terms. */
export function recallTerm(id: string, terms: Term[]): Maker {
  return { id, concepts: ["vocab"], make: (r) => recallOf(pick(r, terms)) };
}

/** Other terms to offer beside this one — never two names for the same thing. */
function others(r: () => number, t: Term, n: number): Term[] {
  return shuffle(r, TERMS.filter((x) => x !== t && (!t.group || x.group !== t.group))).slice(0, n);
}

/** Which term does this definition describe? — the matching format. */
export function termFromDef(id: string, terms: Term[]): Maker {
  return {
    id,
    concepts: ["vocab"],
    make(r) {
      const t = pick(r, terms);
      const choices = shuffle(r, [t, ...others(r, t, 3)].map((x) => x.term));
      return { kind: "choice", prompt: `Which term is this? “${t.model}”`, choices, correct: choices.indexOf(t.term), why: `${t.term}: ${t.model}` };
    },
  };
}

/** Which is the best definition of this term? */
export function defFromTerm(id: string, terms: Term[]): Maker {
  return {
    id,
    concepts: ["vocab"],
    make(r) {
      const t = pick(r, terms);
      const choices = shuffle(r, [t, ...others(r, t, 3)].map((x) => x.model));
      return { kind: "choice", prompt: `Which is the best definition of ${t.term}?`, choices, correct: choices.indexOf(t.model), why: `${t.term}: ${t.model}` };
    },
  };
}

/** True or false: the facts that show up next to the vocabulary. */
export const factTF: Maker = {
  id: "fact-tf",
  concepts: ["facts"],
  make(r) {
    const f = pick(r, FACTS);
    return {
      kind: "choice",
      prompt: `True or false? ${f.text}`,
      choices: ["True", "False"],
      correct: f.truth ? 0 : 1,
      why: f.why,
    };
  },
};


/** The SI sheet's seven base units: each quantity's unit and symbol, from memory. */
export const baseUnitsTable: Maker = fixed("si-base-units", ["vocab"], {
  kind: "table",
  prompt: "The seven SI base units: write each one's name and symbol.",
  context: ["Leave a box blank if you don't know it yet."],
  columns: ["Quantity", "Unit", "Symbol"],
  rows: BASE_UNITS.map((b) => [
    { given: b.quantity },
    { text: [b.unit, b.unit + "s", ...(b.unit === "meter" ? ["metre"] : [])], placeholder: "unit" },
    { text: [b.symbol], caseSensitive: true, placeholder: "symbol" },
  ]),
  why: BASE_UNITS.map((b) => `${b.quantity.toLowerCase()}: ${b.unit} (${b.symbol})`).join("; ") + ". Every other unit is built from these.",
});

/** "What is the SI base unit of time?" or "What does the symbol K stand for?" */
export const baseUnitQuestion: Maker = {
  id: "si-base-unit",
  concepts: ["vocab"],
  make(r) {
    const b = pick(r, BASE_UNITS);
    return r() < 0.6
      ? { kind: "text", prompt: `What is the SI base unit of ${b.quantity.toLowerCase()}?`, accept: [b.unit, b.unit + "s"], why: `${b.quantity}: the ${b.unit} (${b.symbol}).` }
      : { kind: "text", prompt: `Which SI base unit has the symbol ${b.symbol}?`, accept: [b.unit, b.unit + "s"], caseSensitive: false, why: `${b.symbol} is the ${b.unit}, the base unit of ${b.quantity.toLowerCase()}.` };
  },
};

export const GENERATORS_3: Maker[] = [baseUnitQuestion, rateMaker("rate"), recallTerm("recall-term", TERMS), termFromDef("term-from-def", TERMS), defFromTerm("def-from-term", TERMS), factTF];
