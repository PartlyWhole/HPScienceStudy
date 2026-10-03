// The shapes every question and lesson share.
import type { Form } from "../lib/answer";
import type { Factor, Units } from "./units";

/** A wrong answer worth naming: when the student types this, say this. */
export type Trap = { value: number; note: string };

/**
 * A close-up of a graduated cylinder: the scale from `from` to `to` mL, a
 * line every `line` mL, a number every `label` mL, and the water's level at
 * the bottom of its curve.
 */
export type Cylinder = {
  capacity: number;
  line: number;
  label: number;
  level: number;
  from: number;
  to: number;
  /** Something sunk in the water, for displacement. */
  object?: boolean;
  /** For the notes: point at the bottom of the curve and draw eye level. */
  mark?: boolean;
  caption?: string;
};

/** A solid drawn to its numbers, with its measurements labelled. */
export type Solid =
  | { shape: "box"; l: number; w: number; h: number; unit: string; labels?: [string, string, string] }
  | { shape: "cylinder"; h: number; unit: string; d?: number; r?: number; labels?: { across: string; height: string } }
  | { shape: "lshape"; a: number; b: number; c: number; d: number; h: number; unit: string };

export type Figure = { kind: "cylinders"; cylinders: Cylinder[] } | { kind: "solid"; solid: Solid };

/** One part of a question worked in steps: r first, then V, then liters. */
export type Part = {
  label: string;
  answer: number;
  unit?: string;
  /** Rounding allowed, as a fraction of the answer (0.005 is half a percent). */
  within?: number;
  traps?: Trap[];
};

/** A cell of a fill-in table: shown, or to be written (text or a number). */
export type Cell =
  | { given: string }
  | { text: string[]; caseSensitive?: boolean; placeholder?: string }
  | { number: number; placeholder?: string };

export type Question =
  | {
      kind: "number";
      prompt: string;
      context?: string[];
      figure?: Figure;
      answer: number;
      unit?: string;
      /** Which way the answer must be written; any way when not given. */
      form?: Form;
      /** How far off a rounded answer may be, as an absolute amount. */
      tolerance?: number;
      traps?: Trap[];
      why: string;
    }
  | { kind: "text"; prompt: string; context?: string[]; accept: string[]; caseSensitive?: boolean; why: string }
  | {
      kind: "choice";
      prompt: string;
      context?: string[];
      figure?: Figure;
      choices: string[];
      correct: number;
      why: string;
      whyPerChoice?: Record<number, string>;
    }
  | { kind: "table"; prompt: string; context?: string[]; columns: string[]; rows: Cell[][]; why: string }
  | { kind: "steps"; prompt: string; context?: string[]; figure?: Figure; parts: Part[]; why: string }
  | {
      /**
       * The class's four steps for scientific notation, done by hand: move
       * the decimal to just right of the first non-zero digit, count the
       * places, and give the power its sign (moved right: negative; moved
       * left: positive).
       */
      kind: "decimal";
      prompt: string;
      /** The number's digits, without its point: 0.00056 is "000056". */
      digits: string;
      /** Where the point starts, counted in digits from the left. */
      start: number;
      /** Where it belongs: just right of the first non-zero digit. */
      target: number;
      exponent: number;
      why: string;
    }
  | {
      /**
       * Write it from memory: a definition or a short explanation, checked
       * against the key words it needs. When the check can't tell, the
       * student marks it honestly against the model answer.
       */
      kind: "recall";
      prompt: string;
      model: string;
      keys: import("./vocab").Key[];
      why: string;
    }
  | {
      /**
       * The conversion-factor method: the student writes each factor — its
       * numbers and its units — watches the units cancel, then gives the
       * answer. The setup is graded, not only the number.
       */
      kind: "chain";
      prompt: string;
      context?: string[];
      given: { n: number; units: Units };
      target: Units;
      answer: number;
      /** A worked setup, shown after a miss. */
      solution: Factor[];
      /** Guided: each factor's units filled in, top and bottom, leaving the numbers. */
      guided?: boolean;
      traps?: Trap[];
      why: string;
    };

/** Something that makes questions: a fixed one from the plan, or a generator. */
export type Maker = {
  id: string;
  /** The ideas a question from it practises. */
  concepts: string[];
  make: (r: () => number) => Question;
  /** Always the same question (one of the plan's own): kept out of endless practice. */
  fixed?: boolean;
};

/** A card of notes, read before practising. */
export type Note = { title: string; body: import("react").ReactNode };

export type Lesson = {
  id: string;
  title: string;
  /**
   * warm-up and exit check are done without notes — the skill the quizzes
   * test; a learn lesson reads its notes first.
   */
  kind: "warmup" | "learn" | "exit" | "cards";
  notes?: Note[];
  /**
   * Asked in this order, each once; a miss comes back once at the end. A
   * cards lesson instead goes round until each is right twice in a row.
   */
  items: Maker[];
};

export type Unit = {
  id: string;
  n: number;
  title: string;
  /** When the matching tutoring session is held. */
  session: string;
  /** The graded work it gets ready for. */
  prepares: string;
  lessons: Lesson[];
  /** Units are added one ahead of each deadline; the rest are shown as coming. */
  ready: boolean;
};
