// Unit 4 (Session 4): volume. Two formulas, one idea — the area of the base
// times the height. Radius is half the diameter; all lengths in one unit
// before multiplying; 1 cm³ = 1 mL, 1,000 cm³ = 1 L, 1,000 L = 1 m³.
import { formatStandard } from "../lib/answer";
import { int, pick } from "../lib/rng";
import type { Maker, Part, Question, Solid } from "./types";
import { chain } from "./unit2";
import { rateChain, recallTerm } from "./unit3";
import { TERMS } from "./vocab";

const fixed = (id: string, concepts: string[], q: Question): Maker => ({ id, concepts, make: () => q, fixed: true });
const f = (v: number) => formatStandard(Number(v.toPrecision(10)));
const cyl = (r: number, h: number) => Math.PI * r * r * h;
const round1 = (v: number) => formatStandard(Math.round(v * 10) / 10);

const steps = (prompt: string, solid: Solid, parts: Part[], why: string, context?: string[]): Question => ({
  kind: "steps",
  prompt,
  context,
  figure: { kind: "solid", solid },
  parts,
  why,
});

/** The trap every cylinder has: the diameter used as the radius. */
const diameterTrap = (d: number, h: number) => ({ value: cyl(d, h), note: "That used the diameter as the radius. Halve it first: r = d ÷ 2." });
const notSquared = (r: number, h: number) => ({ value: Math.PI * r * h, note: "The radius has to be squared: V = π × r × r × h." });
const litersTrap = (cm3: number) => ({ value: cm3 * 1000, note: "1,000 cm³ = 1 L, so liters are fewer: divide by 1,000." });

// ---------------------------------------------------------------------------
// The plan's practice
// ---------------------------------------------------------------------------

export const PRACTICE_4: Maker[] = [
  fixed("s4-1", ["box-volume", "volume-units"], steps(
    "A box 20 cm × 12 cm × 8 cm. What is its volume?",
    { shape: "box", l: 20, w: 12, h: 8, unit: "cm" },
    [
      { label: "V in cm³", answer: 1920, unit: "cm³", traps: [{ value: 40, note: "That added the lengths. Volume multiplies them: L × W × H." }] },
      { label: "V in L", answer: 1.92, unit: "L", traps: [litersTrap(1920)] },
    ],
    "V = 20 × 12 × 8 = 1,920 cm³, and 1,000 cm³ = 1 L, so 1.92 L.",
  )),
  fixed("s4-2", ["box-volume", "volume-units"], steps(
    "A cube 5 cm on each side. What is its volume in mL?",
    { shape: "box", l: 5, w: 5, h: 5, unit: "cm" },
    [{ label: "V in mL", answer: 125, unit: "mL", traps: [{ value: 25, note: "That's the area of one face. A cube's volume is side × side × side." }, { value: 15, note: "That added the sides. Multiply them." }] }],
    "V = 5 × 5 × 5 = 125 cm³, and 1 cm³ = 1 mL, so 125 mL.",
  )),
  fixed("s4-3", ["cylinder-volume"], steps(
    "A cylinder with radius 3 cm and height 10 cm. What is its volume?",
    { shape: "cylinder", r: 3, h: 10, unit: "cm" },
    [{ label: "V in cm³", answer: cyl(3, 10), unit: "cm³", traps: [notSquared(3, 10), { value: 2 * Math.PI * 3 * 10, note: "That's the area around the side (2πrh), not the volume." }] }],
    "V = π × 3² × 10 = π × 9 × 10 ≈ 282.7 cm³.",
  )),
  fixed("s4-4", ["cylinder-volume", "volume-units"], steps(
    "A soup can 6.6 cm across and 12.2 cm tall. What is its volume?",
    { shape: "cylinder", d: 6.6, h: 12.2, unit: "cm" },
    [
      { label: "r = ", answer: 3.3, unit: "cm", traps: [{ value: 6.6, note: "6.6 cm is the diameter — all the way across. The radius is half of it." }] },
      { label: "V in cm³", answer: cyl(3.3, 12.2), unit: "cm³", traps: [diameterTrap(6.6, 12.2)] },
      { label: "V in L", answer: cyl(3.3, 12.2) / 1000, unit: "L", traps: [litersTrap(cyl(3.3, 12.2))] },
    ],
    "“Across” is the diameter, so r = 6.6 ÷ 2 = 3.3 cm. V = π × 3.3² × 12.2 ≈ 417.4 cm³ = 0.417 L.",
  )),
  fixed("s4-5", ["box-volume", "volume-units"], steps(
    "An aquarium 60 cm × 30 cm × 35 cm. How many liters of water does it hold?",
    { shape: "box", l: 60, w: 30, h: 35, unit: "cm" },
    [
      { label: "V in cm³", answer: 63000, unit: "cm³" },
      { label: "V in L", answer: 63, unit: "L", traps: [litersTrap(63000)] },
    ],
    "V = 60 × 30 × 35 = 63,000 cm³ = 63 L.",
  )),
  fixed("s4-6", ["cylinder-volume", "same-units"], steps(
    "A brass rod ½ in across and 3.5 in long (the lab sample). Convert to cm first, then find the volume.",
    { shape: "cylinder", d: 0.5, h: 3.5, unit: "in", labels: { across: "½ in across", height: "3.5 in" } },
    [
      { label: "d in cm", answer: 1.27, unit: "cm", traps: [{ value: 0.5, note: "Convert: 0.5 in × 2.54 cm/in." }] },
      { label: "r = ", answer: 0.635, unit: "cm", traps: [{ value: 1.27, note: "That's the diameter; halve it." }] },
      { label: "h in cm", answer: 8.89, unit: "cm", traps: [{ value: 3.5, note: "Convert: 3.5 in × 2.54 cm/in." }] },
      { label: "V in cm³", answer: cyl(0.635, 8.89), unit: "cm³", within: 0.01, traps: [{ value: cyl(0.25, 3.5), note: "That's the volume in cubic inches. Convert the lengths to cm first." }, diameterTrap(1.27, 8.89)] },
    ],
    "d = 0.5 × 2.54 = 1.27 cm, so r = 0.635 cm; h = 3.5 × 2.54 = 8.89 cm. V = π × 0.635² × 8.89 ≈ 11.3 cm³.",
  )),
  fixed("s4-7", ["box-volume", "volume-units"], steps(
    "A tank 2 m × 1.5 m × 0.8 m. What is its volume?",
    { shape: "box", l: 2, w: 1.5, h: 0.8, unit: "m" },
    [
      { label: "V in m³", answer: 2.4, unit: "m³" },
      { label: "V in L", answer: 2400, unit: "L", traps: [{ value: 0.0024, note: "1 m³ is 1,000 L — a cubic meter holds a lot. Multiply by 1,000." }] },
    ],
    "V = 2 × 1.5 × 0.8 = 2.4 m³, and 1,000 L = 1 m³, so 2,400 L.",
  )),
  fixed("s4-8", ["l-shape"], steps(
    "An L-shaped block: its base is a 6 cm × 2 cm rectangle with a 2 cm × 3 cm rectangle attached along one end. It's 3 cm tall.",
    { shape: "lshape", a: 6, b: 2, c: 2, d: 3, h: 3, unit: "cm" },
    [
      { label: "Area of the base", answer: 18, unit: "cm²", traps: [{ value: 30, note: "That's the rectangle around the whole L. Split the base into two rectangles and add their areas." }] },
      { label: "V", answer: 54, unit: "cm³", traps: [{ value: 90, note: "That's the box around the L. Use the L's own base: 12 + 6 = 18 cm²." }] },
    ],
    "Base = 6 × 2 + 2 × 3 = 12 + 6 = 18 cm². V = 18 × 3 = 54 cm³.",
  )),
  fixed("s4-9", ["percent-diff", "displacement"], {
    kind: "steps",
    prompt: "Displacement check: water reads 48.0 mL, then 56.5 mL with a metal bar in. The calculated volume was 8.2 cm³.",
    context: ["percent difference = |predicted − experimental| ÷ predicted × 100%, with the graduated-cylinder volume as “predicted”."],
    parts: [
      { label: "Measured volume", answer: 8.5, unit: "cm³", traps: [{ value: 56.5, note: "That's the water and the bar. Subtract the water on its own." }] },
      { label: "Percent difference", answer: (Math.abs(8.5 - 8.2) / 8.5) * 100, unit: "%", within: 0.02, traps: [{ value: (0.3 / 8.2) * 100, note: "Divide by the predicted value — the graduated-cylinder volume, 8.5 — not 8.2." }] },
    ],
    why: "56.5 − 48.0 = 8.5 cm³. |8.5 − 8.2| ÷ 8.5 × 100% ≈ 3.5%, within the 10% the lab allows.",
  }),
];

// ---------------------------------------------------------------------------
// Warm-up and exit check
// ---------------------------------------------------------------------------

export const WARMUP_4: Maker[] = [
  ...Array.from({ length: 6 }, () => recallTerm("warmup-4-vocab", TERMS)),
  fixed("warmup-4-rate", ["rates"], rateChain(12, { num: ["m"], den: ["s"] }, { num: ["km"], den: ["hr"] })),
];

export const EXIT_4: Maker[] = [
  fixed("exit-4-cyl", ["cylinder-volume"], steps(
    "A cylinder is 10 cm across and 4 cm tall.",
    { shape: "cylinder", d: 10, h: 4, unit: "cm" },
    [
      { label: "r = ", answer: 5, unit: "cm", traps: [{ value: 10, note: "10 cm across is the diameter; halve it." }] },
      { label: "V", answer: cyl(5, 4), unit: "cm³", traps: [diameterTrap(10, 4)] },
    ],
    "r = 10 ÷ 2 = 5 cm. V = π × 5² × 4 ≈ 314.2 cm³.",
  )),
  fixed("exit-4-liters", ["volume-units"], chain(2500, "cm³", "L")),
  fixed("exit-4-same-unit", ["same-units"], {
    kind: "recall",
    prompt: "Why must all three lengths be in the same unit?",
    model: "Matching units multiply into a volume unit: cm × cm × cm = cm³. Mixed units like cm × cm × in don't make a volume unit at all.",
    keys: [
      { label: "matching units make a cubed unit (cm × cm × cm = cm³)", any: ["cubed", "cube", "³", "cm3", "match", "same unit", "cancel"] },
      { label: "mixed units don't give a volume unit", any: ["not a volume", "isn't a volume", "mix", "different", "wrong", "doesn't", "don't", "won't", "can't"] },
    ],
    why: "cm × cm × cm = cm³, a volume unit. cm × cm × in isn't one — so convert everything to one unit before multiplying.",
  }),
];

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

export const boxMaker: Maker = {
  id: "box-volume",
  concepts: ["box-volume", "volume-units"],
  make(r) {
    const [l, w, h] = [int(r, 3, 30), int(r, 2, 20), int(r, 2, 15)];
    const v = l * w * h;
    const inL = r() < 0.5;
    return steps(
      `A box ${l} cm × ${w} cm × ${h} cm. What is its volume?`,
      { shape: "box", l, w, h, unit: "cm" },
      [
        { label: "V in cm³", answer: v, unit: "cm³", traps: [{ value: l + w + h, note: "That added the lengths. Multiply them." }] },
        inL ? { label: "V in L", answer: v / 1000, unit: "L", traps: [litersTrap(v)] } : { label: "V in mL", answer: v, unit: "mL", traps: [{ value: v / 1000, note: "1 cm³ = 1 mL: the number doesn't change." }] },
      ],
      `V = ${l} × ${w} × ${h} = ${f(v)} cm³ = ${inL ? f(v / 1000) + " L" : f(v) + " mL"}.`,
    );
  },
};

export const cylinderMaker: Maker = {
  id: "cylinder-volume",
  concepts: ["cylinder-volume"],
  make(r) {
    const byDiameter = r() < 0.7;
    const d = pick(r, [4, 5, 6, 6.6, 8, 9, 10, 12, 14]);
    const h = pick(r, [3, 4, 5, 7.5, 9, 10, 12, 15, 20]);
    const rad = d / 2;
    const v = cyl(rad, h);
    return steps(
      byDiameter ? `A cylinder ${f(d)} cm across and ${f(h)} cm tall.` : `A cylinder with radius ${f(rad)} cm and height ${f(h)} cm.`,
      byDiameter ? { shape: "cylinder", d, h, unit: "cm" } : { shape: "cylinder", r: rad, h, unit: "cm" },
      [
        { label: "r = ", answer: rad, unit: "cm", traps: byDiameter ? [{ value: d, note: `${f(d)} cm across is the diameter; halve it.` }] : [] },
        { label: "V", answer: v, unit: "cm³", traps: [diameterTrap(d, h), notSquared(rad, h)] },
      ],
      `${byDiameter ? `r = ${f(d)} ÷ 2 = ${f(rad)} cm. ` : ""}V = π × ${f(rad)}² × ${f(h)} ≈ ${round1(v)} cm³.`,
    );
  },
};

/** One length in mm or inches: convert it before multiplying. */
export const mixedUnitsMaker: Maker = {
  id: "mixed-units",
  concepts: ["same-units", "box-volume"],
  make(r) {
    const inches = r() < 0.5;
    const [l, h] = [int(r, 4, 20), int(r, 2, 10)];
    const raw = inches ? pick(r, [2, 4, 5, 10]) : pick(r, [50, 80, 120, 150, 250]);
    const w = inches ? raw * 2.54 : raw / 10;
    const v = l * w * h;
    return steps(
      `A box ${l} cm long, ${raw} ${inches ? "in" : "mm"} wide and ${h} cm tall. Put every length in cm first.`,
      { shape: "box", l, w, h, unit: "cm", labels: [`${l} cm`, `${raw} ${inches ? "in" : "mm"}`, `${h} cm`] },
      [
        { label: `Width in cm`, answer: w, unit: "cm", traps: [{ value: raw, note: inches ? "Convert: × 2.54 cm per inch." : "Convert: 10 mm = 1 cm." }] },
        { label: "V", answer: v, unit: "cm³", traps: [{ value: l * raw * h, note: "That multiplied cm by " + (inches ? "inches" : "mm") + ". Convert the width to cm first." }] },
      ],
      `${raw} ${inches ? "in × 2.54" : "mm ÷ 10"} = ${f(w)} cm. V = ${l} × ${f(w)} × ${h} = ${f(v)} cm³.`,
    );
  },
};

export const lShapeMaker: Maker = {
  id: "l-shape",
  concepts: ["l-shape"],
  make(r) {
    const a = int(r, 5, 10), b = int(r, 1, 4), c = int(r, 1, Math.max(1, a - 2)), d = int(r, 2, 5), h = int(r, 2, 6);
    const base = a * b + c * d;
    return steps(
      `An L-shaped block: a ${a} cm × ${b} cm rectangle with a ${c} cm × ${d} cm rectangle attached along one end. It's ${h} cm tall.`,
      { shape: "lshape", a, b, c, d, h, unit: "cm" },
      [
        { label: "Area of the base", answer: base, unit: "cm²", traps: [{ value: a * (b + d), note: "That's the rectangle around the whole L. Split it into two and add their areas." }] },
        { label: "V", answer: base * h, unit: "cm³", traps: [{ value: a * (b + d) * h, note: "That's the box around the L. Use the L's own base." }] },
      ],
      `Base = ${a} × ${b} + ${c} × ${d} = ${a * b} + ${c * d} = ${base} cm². V = ${base} × ${h} = ${base * h} cm³.`,
    );
  },
};

/** Displacement against a calculated volume: the lab's percent difference. */
export const percentMaker: Maker = {
  id: "percent-diff",
  concepts: ["percent-diff", "displacement"],
  make(r) {
    const before = int(r, 300, 600) / 10;
    const measured = int(r, 40, 150) / 10;
    const after = Number((before + measured).toFixed(1));
    // Never exactly equal: a percent difference of 0 teaches nothing.
    const off = int(r, 1, 12) * (r() < 0.5 ? -1 : 1);
    let calc = Number((measured * (1 + off / 100)).toFixed(1));
    if (calc === measured) calc = Number((measured + 0.2).toFixed(1));
    const pd = (Math.abs(measured - calc) / measured) * 100;
    return {
      kind: "steps",
      prompt: `Water reads ${before.toFixed(1)} mL, then ${after.toFixed(1)} mL with a sample in. The calculated volume was ${calc} cm³.`,
      context: ["percent difference = |predicted − experimental| ÷ predicted × 100%, with the graduated-cylinder volume as “predicted”."],
      parts: [
        { label: "Measured volume", answer: measured, unit: "cm³", within: 0.01, traps: [{ value: after, note: "That's the water and the sample. Subtract the water on its own." }] },
        // Rounded to a tenth of a percent is fine. The divide-by-the-wrong-one
        // answer is named only when it is clearly different from the right one.
        {
          label: "Percent difference",
          answer: pd,
          unit: "%",
          within: 0.06 / pd,
          traps: Math.abs((Math.abs(measured - calc) / calc) * 100 - pd) > 0.15
            ? [{ value: (Math.abs(measured - calc) / calc) * 100, note: `Divide by the predicted value — the graduated-cylinder volume, ${measured} — not ${calc}.` }]
            : [],
        },
      ],
      why: `${after.toFixed(1)} − ${before.toFixed(1)} = ${measured} cm³. |${measured} − ${calc}| ÷ ${measured} × 100% ≈ ${round1(pd)}% — ${pd <= 10 ? "within" : "outside"} the 10% the lab allows.`,
    };
  },
};

/** cm³, mL, L and m³ on the conversion chain. */
export const volumeUnitsMaker: Maker = {
  id: "volume-units",
  concepts: ["volume-units"],
  make(r) {
    const [from, to, amounts] = pick(r, [
      ["cm³", "L", [250, 750, 1920, 2500, 4200]],
      ["L", "cm³", [0.5, 1.5, 2.4, 3]],
      ["m³", "L", [0.5, 2.4, 3, 1.2]],
      ["L", "m³", [500, 2400, 6000]],
      ["cm³", "mL", [45, 125, 300]],
    ] as [string, string, number[]][]);
    return chain(pick(r, amounts), from, to);
  },
};

export const GENERATORS_4: Maker[] = [boxMaker, cylinderMaker, mixedUnitsMaker, lShapeMaker, percentMaker, volumeUnitsMaker];
