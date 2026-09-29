// Is an answer right — and if not, what to say about it. A right number in
// the wrong form is not right when the question asks for a form: "write it
// in scientific notation" is the skill, not the value.
import { type Parsed, close, formatSci, formatStandard, parseAnswer } from "../lib/answer";
import type { Cell, Question } from "../content/types";

export type Verdict = { ok: boolean; note?: string };

type NumberQ = Extract<Question, { kind: "number" }>;

const FRACTION_OF: Record<string, string> = { "0.01": "1/100", "0.001": "1/1,000", "0.000001": "1/1,000,000" };

export function gradeNumber(q: NumberQ, raw: string): Verdict {
  const p = parseAnswer(raw);
  if (!p) return { ok: false, note: "That isn't a number I can read. Try something like 4500, 0.031, 4.5 x 10^3 or 1/100." };
  if (close(p.value, q.answer, q.tolerance)) return formCheck(q, p);
  const trap = q.traps?.find((t) => close(p.value, t.value, q.tolerance));
  return { ok: false, note: trap?.note };
}

function formCheck(q: NumberQ, p: Parsed): Verdict {
  if (q.form === "sci") {
    if (p.form !== "sci") return { ok: false, note: `Right amount, but the question asks for scientific notation: ${formatSci(q.answer)}.` };
    const m = Math.abs(p.mantissa!);
    if (m < 1 || m >= 10)
      return { ok: false, note: `Right amount, but the first number has to be from 1 to just under 10: ${formatSci(q.answer)}.` };
  }
  if (q.form === "standard" && p.form !== "standard")
    return { ok: false, note: `Right amount — now write it out in standard form: ${formatStandard(q.answer)}.` };
  if (q.form === "fraction" && p.form !== "fraction")
    return { ok: false, note: `Right amount — now write it as a fraction, like ${FRACTION_OF[String(q.answer)] ?? "1/100"}.` };
  return { ok: true };
}

const clean = (s: string, caseSensitive?: boolean) => {
  const t = s.trim().replace(/\s+/g, " ").replace(/-$/, "");
  return caseSensitive ? t : t.toLowerCase();
};

export function gradeText(accept: string[], raw: string, caseSensitive?: boolean): boolean {
  const got = clean(raw, caseSensitive);
  return accept.some((a) => clean(a, caseSensitive) === got);
}

/** One cell of a table: right, wrong, or nothing to grade. */
export function gradeCell(cell: Cell, raw: string): boolean | undefined {
  if ("given" in cell) return undefined;
  if ("text" in cell) return gradeText(cell.text, raw, cell.caseSensitive);
  const p = parseAnswer(raw);
  return !!p && close(p.value, cell.number);
}
