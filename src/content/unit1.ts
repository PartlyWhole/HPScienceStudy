// Unit 1 (Session 1): the five prefixes, scientific notation, and reading a
// graduated cylinder. Fixed questions are the plan's own practice and exit
// check; generators make as many fresh ones as practice needs.
import { formatSci, formatStandard } from "../lib/answer";
import { int, pick, shuffle } from "../lib/rng";
import type { Cylinder, Maker, Question } from "./types";

// ---------------------------------------------------------------------------
// The prefixes
// ---------------------------------------------------------------------------

export type Prefix = { name: string; symbol: string; power: number; means: string };

export const PREFIXES: Prefix[] = [
  { name: "mega", symbol: "M", power: 6, means: "1,000,000" },
  { name: "kilo", symbol: "k", power: 3, means: "1,000" },
  { name: "centi", symbol: "c", power: -2, means: "1/100" },
  { name: "milli", symbol: "m", power: -3, means: "1/1,000" },
  { name: "micro", symbol: "µ", power: -6, means: "1/1,000,000" },
];

const byName = (n: string) => PREFIXES.find((p) => p.name === n)!;

/** 10 to a power, without floating-point tails. */
export const pow10 = (n: number) => Number(`1e${n}`);
/** n × 10^k, exactly as written. */
const times = (n: number, k: number) => Number((n * pow10(k)).toPrecision(12));

/** A fixed question, made the same way every time. */
const fixed = (id: string, concepts: string[], q: Question): Maker => ({ id, concepts, make: () => q, fixed: true });

/** Which prefixes the book uses with each unit. */
const USES: Record<string, string[]> = {
  m: ["kilo", "centi", "milli", "micro"],
  g: ["mega", "kilo", "milli", "micro"],
  L: ["milli", "micro", "centi"],
  W: ["mega", "kilo", "milli"],
};
const UNIT_NAME: Record<string, string> = { m: "meters", g: "grams", L: "liters", W: "watts" };

/** Why flipping a prefix conversion upside down is wrong, in words. */
function flipNote(p: Prefix, base: string, up: boolean): string {
  const small = p.power < 0;
  const big = p.symbol + base, one = base;
  if (up)
    return small
      ? `${big} is smaller than ${one}, so 1 ${big} is a fraction of a ${one}.`
      : `${big} is bigger than ${one}, so 1 ${big} is many ${UNIT_NAME[base]}.`;
  return small
    ? `${big} is small, so it takes many of them to make 1 ${one}. That's the trap: fraction prefixes point the other way.`
    : `${big} is big, so 1 ${one} is only a small part of one ${big}.`;
}

/** "1 km = ___ m", "1 m = ___ cm", sometimes with more than one: "4.5 kg = ___ g". */
export const prefixFill: Maker = {
  id: "prefix-fill",
  concepts: ["prefixes"],
  make(r) {
    const base = pick(r, Object.keys(USES));
    const p = byName(pick(r, USES[base]));
    const up = r() < 0.5;
    // Mostly one unit, as the plan asks. A few of them only when the answer
    // stays a comfortable number — no 0.000025 to count zeros in.
    let n = r() < 0.6 ? 1 : pick(r, [2, 3, 4.5, 7, 25]);
    if (times(n, up ? p.power : -p.power) < 1) n = 1;
    const from = up ? p.symbol + base : base;
    const to = up ? base : p.symbol + base;
    const answer = times(n, up ? p.power : -p.power);
    const flipped = times(n, up ? -p.power : p.power);
    return {
      kind: "number",
      prompt: `${n} ${from} = ___ ${to}`,
      answer,
      unit: to,
      traps: [{ value: flipped, note: flipNote(p, base, up) }],
      why: `${p.name}- means ${p.means}, so 1 ${p.symbol}${base} = ${formatStandard(pow10(p.power))} ${base}` +
        (up ? "" : ` and 1 ${base} = ${formatStandard(pow10(-p.power))} ${p.symbol}${base}`) +
        (n === 1 ? "." : `. ${n} of them: ${formatStandard(answer)} ${to}.`),
    };
  },
};

/** "Which prefix means 1/1,000?" — the name, typed from memory. */
export const prefixName: Maker = {
  id: "prefix-name",
  concepts: ["prefixes"],
  make(r) {
    const p = pick(r, PREFIXES);
    return {
      kind: "text",
      prompt: `Which prefix means ${p.means}?`,
      accept: [p.name, p.name + "-"],
      why: `${p.name}- (${p.symbol}) means ${p.means}, or 10${sup(p.power)}.`,
    };
  },
};

/** "What does micro- mean?" — the number, typed. */
export const prefixMeaning: Maker = {
  id: "prefix-meaning",
  concepts: ["prefixes"],
  make(r) {
    const p = pick(r, PREFIXES);
    return {
      kind: "number",
      prompt: `What does ${p.name}- mean? Give the number (a fraction or a power of ten is fine).`,
      answer: pow10(p.power),
      traps: [{ value: pow10(-p.power), note: p.power < 0 ? `That's upside down: ${p.name}- makes a unit smaller, not bigger.` : `That's upside down: ${p.name}- makes a unit bigger, not smaller.` }],
      why: `${p.name}- means ${p.means} = 10${sup(p.power)}.`,
    };
  },
};

/** "What is the symbol for micro-?" — capital M and small m are different prefixes. */
export const prefixSymbol: Maker = {
  id: "prefix-symbol",
  concepts: ["prefixes", "prefix-traps"],
  make(r) {
    const p = pick(r, PREFIXES);
    const others = shuffle(r, PREFIXES.filter((x) => x !== p)).slice(0, 3).map((x) => x.symbol);
    const choices = shuffle(r, [p.symbol, ...others]);
    return {
      kind: "choice",
      prompt: `What is the symbol for ${p.name}-?`,
      choices,
      correct: choices.indexOf(p.symbol),
      why:
        `${p.name}- is ${p.symbol}.` +
        (p.name === "mega" || p.name === "milli" ? " Capital M is mega (a million); small m is milli (a thousandth)." : ""),
    };
  },
};

// ---------------------------------------------------------------------------
// Scientific notation
// ---------------------------------------------------------------------------

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const sup = (n: number) => (n < 0 ? "⁻" : "") + [...String(Math.abs(n))].map((d) => SUP[Number(d)]).join("");

/** A number with one to three significant figures, from 10⁻⁶ to 10⁸. */
function sciNumber(r: () => number) {
  const figs = pick(r, [1, 2, 2, 3]);
  let digits = String(int(r, 1, 9));
  for (let i = 1; i < figs; i++) digits += String(i === figs - 1 ? int(r, 1, 9) : int(r, 0, 9));
  const mantissa = Number(digits[0] + (digits.length > 1 ? "." + digits.slice(1) : ""));
  const exponent = pick(r, [-6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8]);
  return { mantissa, exponent, value: times(mantissa, exponent) };
}

const sciText = (m: number, e: number) => `${m} × 10${sup(e)}`;

/** Why the sign of the power is what it is. */
const signNote = (e: number) =>
  e > 0
    ? "Big numbers (10 or more) get positive powers; that answer is less than 1."
    : "Small numbers (less than 1) get negative powers; that answer is bigger than 1.";

/** "Write 0.00056 in scientific notation." */
export const toSci: Maker = {
  id: "to-sci",
  concepts: ["sci-write"],
  make(r) {
    const { mantissa, exponent, value } = sciNumber(r);
    return {
      kind: "number",
      prompt: `Write ${formatStandard(value)} in scientific notation.`,
      answer: value,
      form: "sci",
      traps: [{ value: times(mantissa, -exponent), note: signNote(exponent) }],
      why:
        `Move the decimal point ${Math.abs(exponent)} place${Math.abs(exponent) > 1 ? "s" : ""} ` +
        `${exponent > 0 ? "left" : "right"} to get ${mantissa}, a number from 1 to just under 10: ${sciText(mantissa, exponent)}.`,
    };
  },
};

/** "Write 3.1 × 10⁻² in standard form." */
export const toStandard: Maker = {
  id: "to-standard",
  concepts: ["sci-standard"],
  make(r) {
    const { mantissa, exponent, value } = sciNumber(r);
    return {
      kind: "number",
      prompt: `Write ${sciText(mantissa, exponent)} in standard form.`,
      answer: value,
      form: "standard",
      traps: [
        { value: times(mantissa, -exponent), note: exponent < 0 ? "A negative power means the number is less than 1: move the point left." : "A positive power means a big number: move the point right." },
        { value: times(mantissa, exponent + 1), note: `One place too far. The power ${exponent} moves the point exactly ${Math.abs(exponent)} places.` },
        { value: times(mantissa, exponent - 1), note: `One place short. The power ${exponent} moves the point exactly ${Math.abs(exponent)} places.` },
      ],
      why: `The power ${exponent} moves the decimal point ${Math.abs(exponent)} places ${exponent > 0 ? "right" : "left"}: ${formatStandard(value)}.`,
    };
  },
};

/** Which is the number? — the sense check: a negative power means less than 1. */
export const sciSense: Maker = {
  id: "sci-sense",
  concepts: ["sci-standard"],
  make(r) {
    const { mantissa, exponent, value } = sciNumber(r);
    const wrong = [times(mantissa, -exponent), times(mantissa, exponent + (r() < 0.5 ? 1 : -1))];
    const choices = shuffle(r, [value, ...wrong].map(formatStandard));
    const right = formatStandard(value);
    return {
      kind: "choice",
      prompt: `Which number is ${sciText(mantissa, exponent)}?`,
      choices,
      correct: choices.indexOf(right),
      why: `${exponent < 0 ? "A negative power: the number is less than 1." : "A positive power: the number is bigger than 10."} Move the point ${Math.abs(exponent)} places: ${right}.`,
    };
  },
};

// ---------------------------------------------------------------------------
// The graduated cylinder
// ---------------------------------------------------------------------------

type Scale = { capacity: number; line: number; label: number };
const SCALES: Scale[] = [
  { capacity: 10, line: 0.2, label: 1 },
  { capacity: 25, line: 0.5, label: 5 },
  { capacity: 50, line: 1, label: 5 },
  { capacity: 100, line: 1, label: 10 },
  { capacity: 100, line: 2, label: 10 },
  { capacity: 250, line: 5, label: 50 },
];

const tidy = (v: number) => Number(v.toFixed(4));

/**
 * A close-up of sixteen lines with the water's level near the middle — never
 * at an edge, where the curve would be cut off — and at least one number.
 */
export function closeUp(s: Scale, level: number, extra: Partial<Cylinder> = {}): Cylinder {
  const span = 16 * s.line;
  let from = tidy(Math.floor(level / s.line - 8) * s.line);
  from = Math.max(0, Math.min(from, s.capacity - span));
  return { capacity: s.capacity, line: s.line, label: s.label, level, from, to: tidy(from + span), ...extra };
}

/** A level on a line, away from the ends of the scale. */
function levelOn(r: () => number, s: Scale) {
  const lo = Math.ceil((1.5 * s.label) / s.line), hi = Math.floor((s.capacity - 1.5 * s.label) / s.line);
  return tidy(int(r, lo, hi) * s.line);
}

/** Read the cylinder: the bottom of the curve, with each line worth what it is worth. */
export const readCylinder: Maker = {
  id: "read-cylinder",
  concepts: ["cylinder"],
  make(r) {
    const s = pick(r, SCALES);
    const level = levelOn(r, s);
    const below = Math.floor(level / s.label + 1e-9) * s.label;
    const ticks = Math.round((level - below) / s.line);
    const traps = [{ value: tidy(level + s.line), note: "That's where the water climbs the glass. Read the bottom of the curve (the meniscus)." }];
    if (s.line !== 1 && tidy(below + ticks) !== level)
      traps.push({ value: tidy(below + ticks), note: `Each line here is worth ${s.line} mL, not 1 mL. Check what a line is worth before reading.` });
    return {
      kind: "number",
      prompt: `What volume does this ${s.capacity}-mL cylinder show?`,
      figure: { kind: "cylinders", cylinders: [closeUp(s, level, { caption: `Close-up of a ${s.capacity}-mL cylinder` })] },
      answer: level,
      unit: "mL",
      tolerance: s.line / 4,
      traps,
      why: `Each line is worth ${s.line} mL. The bottom of the curve is ${ticks} line${ticks === 1 ? "" : "s"} above ${below}: ${formatStandard(level)} mL.`,
    };
  },
};

/** What is each line worth? The first thing to check on any cylinder. */
export const lineValue: Maker = {
  id: "line-value",
  concepts: ["cylinder"],
  make(r) {
    const s = pick(r, SCALES.filter((x) => x.line !== 1));
    const level = levelOn(r, s);
    const spaces = Math.round(s.label / s.line);
    return {
      kind: "number",
      prompt: "How many mL is each line worth on this cylinder?",
      figure: { kind: "cylinders", cylinders: [closeUp(s, level, { caption: `Close-up of a ${s.capacity}-mL cylinder` })] },
      answer: s.line,
      unit: "mL",
      traps: [{ value: 1, note: `Not every cylinder counts by ones. From one number to the next is ${s.label} mL, split into ${spaces} spaces.` }],
      why: `From one number to the next is ${s.label} mL, and there are ${spaces} spaces between them: ${s.label} ÷ ${spaces} = ${s.line} mL a line.`,
    };
  },
};

/** Displacement: the object's volume is the rise in the water. */
export const displacement: Maker = {
  id: "displacement",
  concepts: ["displacement"],
  make(r) {
    const s = SCALES[3];
    const before = int(r, 30, 60);
    const v = int(r, 3, 18);
    const after = before + v;
    const thing = pick(r, ["bolt", "stone", "key", "marble", "metal washer"]);
    const read = r() < 0.5;
    return {
      kind: "number",
      prompt: read
        ? `Read both cylinders. What is the ${thing}'s volume in cm³?`
        : `The water reads ${before} mL, then ${after} mL after a ${thing} goes in. What is the ${thing}'s volume in cm³?`,
      figure: {
        kind: "cylinders",
        cylinders: [closeUp(s, before, { caption: "Before" }), closeUp(s, after, { caption: `With the ${thing}`, object: true })],
      },
      answer: v,
      unit: "cm³",
      traps: [
        { value: after, note: `${after} mL is the water and the ${thing} together. Subtract the water on its own.` },
        { value: before, note: `${before} mL is the water before the ${thing} went in.` },
      ],
      why: `The ${thing} pushed the water up from ${before} mL to ${after} mL: ${after} − ${before} = ${v} mL, and 1 mL = 1 cm³, so ${v} cm³.`,
    };
  },
};

// ---------------------------------------------------------------------------
// Fixed questions: the plan's warm-up, Practice A and B, and exit check
// ---------------------------------------------------------------------------

/** Warm-up, no notes: write the five prefixes and their symbols from what each means. */
export const prefixTable = fixed("warmup-prefix-table", ["prefixes"], {
  kind: "table",
  prompt: "From memory: write the prefix and its symbol for each amount.",
  context: ["Write what you remember from class. Leave a box blank if you don't know it yet — that's what this is for."],
  columns: ["Means", "Prefix", "Symbol"],
  rows: PREFIXES.map((p) => [
    { given: p.means },
    { text: [p.name, p.name + "-"], placeholder: "prefix" },
    { text: p.symbol === "µ" ? ["µ", "μ", "u"] : [p.symbol], caseSensitive: true, placeholder: "symbol" },
  ]),
  why: "mega- M (a million), kilo- k (a thousand), centi- c (a hundredth), milli- m (a thousandth), micro- µ (a millionth). Capital M and small m are different prefixes.",
});

const A = (n: number, prompt: string, answer: number, unit: string, trap: { value: number; note: string } | null, why: string) =>
  fixed("practice-a-" + n, ["prefixes"], { kind: "number", prompt, answer, unit, traps: trap ? [trap] : [], why });

export const PRACTICE_A: Maker[] = [
  A(1, "1 km = ___ m", 1000, "m", { value: 0.001, note: "A kilometer is the bigger unit, so 1 km is many meters." }, "kilo- means 1,000: 1 km = 1,000 m."),
  A(2, "1 m = ___ cm", 100, "cm", { value: 0.01, note: "Fraction prefixes point the other way: centimeters are small, so it takes many of them to make a meter." }, "A centimeter is 1/100 of a meter, so 1 m = 100 cm."),
  A(3, "1 g = ___ mg", 1000, "mg", { value: 0.001, note: "Milligrams are small, so a gram is many of them." }, "A milligram is 1/1,000 of a gram, so 1 g = 1,000 mg."),
  A(4, "1 L = ___ µL", 1_000_000, "µL", { value: 1e-6, note: "Microliters are tiny, so a liter is a great many of them." }, "A microliter is 1/1,000,000 of a liter, so 1 L = 1,000,000 µL."),
  A(5, "1 MW = ___ W", 1_000_000, "W", { value: 1e-6, note: "Capital M is mega, a million — not milli." }, "mega- means 1,000,000: 1 MW = 1,000,000 W."),
  fixed("practice-a-6", ["prefixes", "prefix-traps"], {
    kind: "choice",
    prompt: "Which is bigger, 1 mg or 1 Mg? By how much?",
    choices: ["1 Mg, a billion times bigger", "1 Mg, a thousand times bigger", "1 mg, a million times bigger", "They are the same"],
    correct: 0,
    whyPerChoice: {
      1: "1 Mg is 1,000,000 g and 1 mg is 0.001 g. Divide: 1,000,000 ÷ 0.001 = 1,000,000,000.",
      2: "Capital M is mega (a million grams); small m is milli (a thousandth of a gram).",
      3: "Capital M and small m are different prefixes: mega- and milli-.",
    },
    why: "1 Mg = 1,000,000 g and 1 mg = 0.001 g, so 1 Mg is 1,000,000 ÷ 0.001 = a billion times bigger.",
  }),
  fixed("trap-mkg", ["prefix-traps"], {
    kind: "choice",
    prompt: "Which of these is not a real unit?",
    choices: ["mkg", "mg", "Mg", "kg"],
    correct: 0,
    why: "Mass prefixes go on the gram, not the kilogram. A thousandth of a kilogram is a gram; a millionth of a kilogram is a milligram (mg).",
  }),
];

const B = (n: number, text: string, value: number, form: "sci" | "standard", why: string, traps: { value: number; note: string }[] = []) =>
  fixed("practice-b-" + n, [form === "sci" ? "sci-write" : "sci-standard"], {
    kind: "number",
    prompt: form === "sci" ? `Write ${text} in scientific notation.` : `Write ${text} in standard form.`,
    answer: value,
    form,
    traps,
    why,
  });

export const PRACTICE_B: Maker[] = [
  B(7, "4.5 × 10³", 4500, "standard", "The power 3 moves the point 3 places right: 4,500.", [{ value: 0.0045, note: "A positive power means a big number: move the point right." }]),
  B(8, "6.02 × 10⁵", 602000, "standard", "The power 5 moves the point 5 places right: 602,000.", [{ value: 60200, note: "One place short: the point moves exactly 5 places." }]),
  B(9, "3.1 × 10⁻²", 0.031, "standard", "A negative power means less than 1: move the point 2 places left, 0.031.", [{ value: 310, note: "A negative power means the number is less than 1." }]),
  B(10, "7 × 10⁻⁶", 0.000007, "standard", "Move the point 6 places left: 0.000007.", [{ value: 0.0000007, note: "One place too far: count exactly 6 places." }]),
  B(11, "93,000,000", 9.3e7, "sci", "Move the point 7 places left to get 9.3: 9.3 × 10⁷.", [{ value: 9.3e-7, note: signNote(7) }]),
  B(12, "0.00056", 5.6e-4, "sci", "Move the point 4 places right to get 5.6: 5.6 × 10⁻⁴.", [{ value: 5.6e4, note: signNote(-4) }]),
  B(13, "1,609", 1.609e3, "sci", "Move the point 3 places left to get 1.609: 1.609 × 10³.", [{ value: 1.609e-3, note: signNote(3) }]),
  B(14, "0.04", 4e-2, "sci", "Move the point 2 places right to get 4: 4 × 10⁻².", [{ value: 400, note: signNote(-2) }]),
];

/** Exit check: three quick problems, no notes. */
export const EXIT_1: Maker[] = [
  fixed("exit-1-cm-fraction", ["prefixes"], {
    kind: "number",
    prompt: "1 cm = ___ m. Write it as a fraction.",
    answer: 0.01,
    form: "fraction",
    unit: "m",
    traps: [{ value: 100, note: "A centimeter is smaller than a meter, so 1 cm is a fraction of a meter." }],
    why: "centi- means 1/100, so 1 cm = 1/100 m.",
  }),
  fixed("exit-1-cm-sci", ["prefixes", "sci-write"], {
    kind: "number",
    prompt: "Now write 1 cm in meters in scientific notation.",
    answer: 0.01,
    form: "sci",
    unit: "m",
    traps: [{ value: 100, note: "1 cm is less than a meter, so the power is negative." }],
    why: "1/100 m = 0.01 m = 1 × 10⁻² m.",
  }),
  fixed("exit-1-sci", ["sci-write"], {
    kind: "number",
    prompt: "Write 0.0072 in scientific notation.",
    answer: 7.2e-3,
    form: "sci",
    traps: [{ value: 7.2e3, note: signNote(-3) }],
    why: "Move the point 3 places right to get 7.2: 7.2 × 10⁻³.",
  }),
  fixed("exit-1-bolt", ["displacement"], {
    kind: "number",
    prompt: "The water reads 52 mL, then 61 mL after a bolt goes in. What is the bolt's volume in cm³?",
    figure: { kind: "cylinders", cylinders: [closeUp(SCALES[3], 52, { caption: "Before" }), closeUp(SCALES[3], 61, { caption: "With the bolt", object: true })] },
    answer: 9,
    unit: "cm³",
    traps: [{ value: 61, note: "61 mL is the water and the bolt together. Subtract the water on its own." }],
    why: "61 − 52 = 9 mL, and 1 mL = 1 cm³, so the bolt is 9 cm³.",
  }),
];

/** Every generator in the unit, for review and practice. */
export const GENERATORS_1: Maker[] = [prefixFill, prefixName, prefixMeaning, prefixSymbol, toSci, toStandard, sciSense, readCylinder, lineValue, displacement];

// Formatting helpers are part of what the generators promise; export for tests.
export { formatSci };
