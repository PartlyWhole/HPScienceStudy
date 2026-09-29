// The course: five units, one per tutoring session, each ready before the
// graded work it prepares for. A unit is a no-notes warm-up, one or more
// lessons with notes and practice, and a no-notes exit check — the plan's
// session pattern. Units after the first are added one ahead of each deadline.
import type { Unit } from "./types";
import { CYLINDER_NOTES, PREFIX_NOTES, SCI_NOTES } from "./notes1";
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
    ready: false,
    lessons: [],
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
