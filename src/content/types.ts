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
  caption?: string;
};

export type Figure = { kind: "cylinders"; cylinders: Cylinder[] };

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
  | { kind: "table"; prompt: string; columns: string[]; rows: Cell[][]; why: string }
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
  kind: "warmup" | "learn" | "exit";
  notes?: Note[];
  /** Asked in this order, each once; a miss comes back once at the end. */
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
