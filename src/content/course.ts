// The course: five units, one per tutoring session, each ready before the
// graded work it prepares for. A unit is a no-notes warm-up, one or more
// lessons with notes and practice, and a no-notes exit check — the plan's
// session pattern. Units after the first are added one ahead of each deadline.
import type { Unit } from "./types";
import { CYLINDER_NOTES, PREFIX_NOTES, SCI_READ_NOTES, SCI_WRITE_NOTES, TRAP_NOTES } from "./notes1";
import { FACTOR_NOTES, FACTS_NOTES, METHOD_NOTES, TWO_STEP_NOTES } from "./notes2";
import { FACT_NOTES, RATE_NOTES, VOCAB_NOTES } from "./notes3";
import { BOX_NOTES, CYLINDER_NOTES_4, L_NOTES, PERCENT_NOTES, SAME_UNIT_NOTES } from "./notes4";
import {
  EXIT_4,
  PRACTICE_4,
  WARMUP_4,
  boxMaker,
  cylinderMaker,
  lShapeMaker,
  mixedUnitsMaker,
  percentMaker,
  volumeUnitsMaker,
} from "./unit4";
import {
  CARD_SETS,
  EXIT_3,
  RATE_PRACTICE,
  TERM_SETS,
  WARMUP_3,
  defFromTerm,
  factTF,
  rateMaker,
  recallTerm,
  termFromDef,
} from "./unit3";
import {
  EXIT_2,
  PRACTICE_2,
  PRACTICE_2_TWO_STEP,
  chain,
  chainMaker,
  factRecall,
  prefixPowers,
  rightWayUp,
  senseCheck,
  warmSci,
  whichIsOne,
} from "./unit2";
import {
  EXIT_1,
  PRACTICE_A,
  PRACTICE_B,
  displacement,
  lineValue,
  prefixFill,
  prefixName,
  prefixSymbol,
  prefixTable,
  readCylinder,
  sciSense,
  toSci,
  toStandard,
} from "./unit1";

export const COURSE_TITLE = "Chapter 8: Measurement and Units";

/** The ideas practised, by unit, as endless practice lists them. */
export const IDEAS: { unit: string; id: string; name: string }[] = [
  { unit: "u1", id: "prefixes", name: "Metric prefixes" },
  { unit: "u1", id: "prefix-traps", name: "Prefix traps (M or m?)" },
  { unit: "u1", id: "sci-write", name: "Writing scientific notation" },
  { unit: "u1", id: "sci-standard", name: "Reading scientific notation" },
  { unit: "u1", id: "cylinder", name: "Reading a cylinder" },
  { unit: "u1", id: "displacement", name: "Displacement" },
  { unit: "u2", id: "factor-idea", name: "What a conversion factor is" },
  { unit: "u2", id: "factors-to-know", name: "Factors to know" },
  { unit: "u2", id: "factor-method", name: "One-step conversions" },
  { unit: "u2", id: "two-step", name: "Two-step conversions" },
  { unit: "u3", id: "rates", name: "Rate (“per”) conversions" },
  { unit: "u3", id: "vocab", name: "Vocabulary" },
  { unit: "u3", id: "facts", name: "SI facts" },
  { unit: "u4", id: "box-volume", name: "Boxes" },
  { unit: "u4", id: "cylinder-volume", name: "Cylinders" },
  { unit: "u4", id: "volume-units", name: "cm³, mL, L and m³" },
  { unit: "u4", id: "same-units", name: "Lengths in one unit" },
  { unit: "u4", id: "l-shape", name: "L-shapes" },
  { unit: "u4", id: "percent-diff", name: "Percent difference" },
];

export const UNITS: Unit[] = [
  {
    id: "u1",
    n: 1,
    title: "Prefixes, scientific notation, cylinders",
    session: "Wed, Sep 30",
    prepares: "Sep 30 classwork and the Oct 1 Rainbow Lab",
    ready: true,
    lessons: [
      { id: "1.0", title: "Warm-up: the prefixes", kind: "warmup", items: [prefixTable] },
      { id: "1.1", title: "The five prefixes", kind: "learn", notes: PREFIX_NOTES, items: [...PRACTICE_A.slice(0, 5), prefixName, prefixSymbol] },
      { id: "1.2", title: "Prefix traps", kind: "learn", notes: TRAP_NOTES, items: [...PRACTICE_A.slice(5), prefixSymbol, prefixFill, prefixFill] },
      { id: "1.3", title: "Reading scientific notation", kind: "learn", notes: SCI_READ_NOTES, items: [...PRACTICE_B.slice(0, 4), sciSense, toStandard] },
      { id: "1.4", title: "Writing scientific notation", kind: "learn", notes: SCI_WRITE_NOTES, items: [...PRACTICE_B.slice(4), toSci, toSci] },
      {
        id: "1.5",
        title: "Reading a graduated cylinder",
        kind: "learn",
        notes: CYLINDER_NOTES,
        items: [lineValue, readCylinder, readCylinder, displacement, displacement],
      },
      { id: "1.x", title: "Exit check", kind: "exit", items: EXIT_1 },
    ],
  },
  {
    id: "u2",
    n: 2,
    title: "The conversion-factor method",
    session: "Sun, Oct 4",
    prepares: "the Oct 5 quizzes and worksheets",
    ready: true,
    lessons: [
      { id: "2.0", title: "Warm-up: powers of ten", kind: "warmup", items: [prefixPowers, warmSci] },
      {
        id: "2.1",
        title: "A factor is a way of writing 1",
        kind: "learn",
        notes: FACTOR_NOTES,
        items: [
          whichIsOne,
          { id: "s2-guided-km", concepts: ["factor-method"], make: () => chain(3.5, "km", "m", [], { guided: true }), fixed: true },
          chainMaker("chain-metric-guided", "metric", { guided: true }),
          chainMaker("chain-metric-guided", "metric", { guided: true }),
          rightWayUp,
          whichIsOne,
        ],
      },
      {
        id: "2.2",
        title: "Factors to know",
        kind: "learn",
        notes: FACTS_NOTES,
        items: [factRecall, factRecall, factRecall, factRecall, factRecall, chainMaker("chain-time-guided", "time", { guided: true }), chainMaker("chain-english-guided", "english", { guided: true })],
      },
      { id: "2.3", title: "The four steps", kind: "learn", notes: [METHOD_NOTES[0]], items: [senseCheck, ...PRACTICE_2.slice(0, 4)] },
      { id: "2.4", title: "Time and English units", kind: "learn", notes: [METHOD_NOTES[1]], items: PRACTICE_2.slice(4) },
      { id: "2.5", title: "Two steps", kind: "learn", notes: TWO_STEP_NOTES, items: [...PRACTICE_2_TWO_STEP, chainMaker("chain-metric-two", "metric-two")] },
      { id: "2.x", title: "Exit check", kind: "exit", items: EXIT_2 },
    ],
  },
  {
    id: "u3",
    n: 3,
    title: "Rates and vocabulary",
    session: "Tue, Oct 6",
    prepares: "the Oct 7 quiz and Learning Checks",
    ready: true,
    lessons: [
      { id: "3.0", title: "Warm-up: conversions", kind: "warmup", items: WARMUP_3 },
      {
        id: "3.1",
        title: "“Per” means a fraction",
        kind: "learn",
        notes: RATE_NOTES,
        items: [{ ...rateMaker("rate-guided", { guided: true }), fixed: false }, ...RATE_PRACTICE.slice(0, 3)],
      },
      { id: "3.2", title: "More rates", kind: "learn", items: [...RATE_PRACTICE.slice(3), rateMaker("rate")] },
      ...TERM_SETS.map((terms, k) => ({
        id: "3." + (k + 3),
        title: "Vocabulary: " + ["units and systems", "meter, kilogram, second, liter", "prefixes, factors, shapes"][k],
        kind: "learn" as const,
        notes: k === 2 ? [...VOCAB_NOTES[k], ...FACT_NOTES] : VOCAB_NOTES[k],
        items: [
          termFromDef("term-from-def-" + k, terms),
          recallTerm("recall-term-" + k, terms),
          defFromTerm("def-from-term-" + k, terms),
          recallTerm("recall-term-" + k, terms),
          ...(k === 2 ? [factTF, factTF] : []),
        ],
      })),
      { id: "3.6", title: "Vocabulary cards, set 1", kind: "cards", items: CARD_SETS[0] },
      { id: "3.7", title: "Vocabulary cards, set 2", kind: "cards", items: CARD_SETS[1] },
      { id: "3.x", title: "Exit check", kind: "exit", items: EXIT_3 },
    ],
  },
  {
    id: "u4",
    n: 4,
    title: "Volume",
    session: "Sun, Oct 11",
    prepares: "the Oct 12 volume quiz",
    ready: true,
    lessons: [
      { id: "4.0", title: "Warm-up: cards and a rate", kind: "warmup", items: WARMUP_4 },
      { id: "4.1", title: "Boxes", kind: "learn", notes: BOX_NOTES, items: [PRACTICE_4[0], PRACTICE_4[1], PRACTICE_4[4], PRACTICE_4[6], boxMaker, volumeUnitsMaker] },
      { id: "4.2", title: "Cylinders", kind: "learn", notes: CYLINDER_NOTES_4, items: [PRACTICE_4[2], PRACTICE_4[3], cylinderMaker, cylinderMaker] },
      { id: "4.3", title: "Every length in one unit", kind: "learn", notes: SAME_UNIT_NOTES, items: [PRACTICE_4[5], mixedUnitsMaker, mixedUnitsMaker] },
      { id: "4.4", title: "L-shapes", kind: "learn", notes: L_NOTES, items: [PRACTICE_4[7], lShapeMaker, lShapeMaker] },
      { id: "4.5", title: "Displacement and percent difference", kind: "learn", notes: PERCENT_NOTES, items: [PRACTICE_4[8], percentMaker, displacement] },
      { id: "4.x", title: "Exit check", kind: "exit", items: EXIT_4 },
    ],
  },
  {
    id: "u5",
    n: 5,
    title: "Chapter 8 Test review",
    session: "Tue, Oct 13",
    prepares: "the Oct 14 Chapter 8 Test",
    ready: false,
    lessons: [],
  },
];
