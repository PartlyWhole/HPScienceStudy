// The course: five units, one per tutoring session, each ready before the
// graded work it prepares for. A unit is a no-notes warm-up, one or more
// lessons with notes and practice, and a no-notes exit check — the plan's
// session pattern. Units after the first are added one ahead of each deadline.
import type { Unit } from "./types";
import { CYLINDER_NOTES, PREFIX_NOTES, SCI_NOTES } from "./notes1";
import { FACTOR_NOTES, FACTS_NOTES, METHOD_NOTES, TWO_STEP_NOTES } from "./notes2";
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
  prefixMeaning,
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
      { id: "1.0", title: "Warm-up: the prefixes", kind: "warmup", items: [prefixTable, prefixMeaning] },
      {
        id: "1.1",
        title: "The five prefixes",
        kind: "learn",
        notes: PREFIX_NOTES,
        items: [...PRACTICE_A, prefixName, prefixSymbol, prefixFill, prefixFill],
      },
      {
        id: "1.2",
        title: "Scientific notation",
        kind: "learn",
        notes: SCI_NOTES,
        items: [...PRACTICE_B, sciSense, toSci, toStandard],
      },
      {
        id: "1.3",
        title: "Reading a graduated cylinder",
        kind: "learn",
        notes: CYLINDER_NOTES,
        items: [lineValue, readCylinder, readCylinder, readCylinder, displacement, displacement],
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
      { id: "2.3", title: "The four steps", kind: "learn", notes: METHOD_NOTES, items: [senseCheck, ...PRACTICE_2] },
      {
        id: "2.4",
        title: "Two steps",
        kind: "learn",
        notes: TWO_STEP_NOTES,
        items: [...PRACTICE_2_TWO_STEP, chainMaker("chain-metric-two", "metric-two"), chainMaker("chain-time-two", "time-two")],
      },
      { id: "2.x", title: "Exit check", kind: "exit", items: EXIT_2 },
    ],
  },
  {
    id: "u3",
    n: 3,
    title: "Rates and vocabulary",
    session: "Tue, Oct 6",
    prepares: "the Oct 7 quiz and Learning Checks",
    ready: false,
    lessons: [],
  },
  {
    id: "u4",
    n: 4,
    title: "Volume",
    session: "Sun, Oct 11",
    prepares: "the Oct 12 volume quiz",
    ready: false,
    lessons: [],
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
