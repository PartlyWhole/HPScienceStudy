// Is an answer right — and if not, what to say about it. A right number in
// the wrong form is not right when the question asks for a form: "write it
// in scientific notation" is the skill, not the value.
import { type Parsed, close, formatSci, formatStandard, parseAnswer } from "../lib/answer";
import type { Cell, Question } from "../content/types";
import { type Factor, UNIT, cancel, factorTrue, sameUnits, unitText } from "../content/units";

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

type ChainQ = Extract<Question, { kind: "chain" }>;
export type ChainVerdict = { ok: boolean; notes: string[]; factorOk: boolean[]; unitsOk: boolean; numberOk: boolean };

/** How the bottom of a factor compares with its top, as the true statement: "1 km = 1,000 m". */
function truth(f: Factor): string {
  const a = UNIT[f.top.unit], b = UNIT[f.bottom.unit];
  if (a.size >= b.size) return `1 ${f.top.unit} = ${formatStandard(Number((a.size / b.size).toPrecision(10)))} ${f.bottom.unit}`;
  return `1 ${f.bottom.unit} = ${formatStandard(Number((b.size / a.size).toPrecision(10)))} ${f.top.unit}`;
}

/**
 * Grade a whole setup: each factor true and the right way up, the units
 * left over the ones asked for, and the number right. Each fault gets its
 * own note, in the words the plan uses.
 */
export function gradeChain(q: ChainQ, factors: Factor[], raw: string): ChainVerdict {
  const notes: string[] = [];
  const factorOk: boolean[] = [];
  let running = { num: [...q.given.units.num], den: [...q.given.units.den] };
  factors.forEach((f, i) => {
    const k = factors.length > 1 ? `Factor ${i + 1}` : "The factor";
    let ok = true;
    if (!UNIT[f.top.unit] || !UNIT[f.bottom.unit] || UNIT[f.top.unit].dim !== UNIT[f.bottom.unit].dim) {
      notes.push(`${k} compares ${f.top.unit} with ${f.bottom.unit}, which measure different things — it can't equal 1.`);
      ok = false;
    } else if (!factorTrue(f)) {
      notes.push(`${k} isn't equal to 1: ${formatStandard(f.top.n)} ${f.top.unit} is not the same amount as ${formatStandard(f.bottom.n)} ${f.bottom.unit}. (${truth(f)}.)`);
      ok = false;
    }
    // Upside down: its top unit is one still waiting on top to be cancelled,
    // and its bottom cancels nothing.
    const cancelsSomething = running.num.includes(f.bottom.unit) || running.den.includes(f.top.unit);
    if (!cancelsSomething && running.num.includes(f.top.unit)) {
      notes.push(`${k} is upside down: ${f.top.unit} is on top, so it can't cancel the ${f.top.unit} you have. The unit you're getting rid of goes on the bottom.`);
      ok = false;
    }
    running = cancel(running, [f]);
    factorOk.push(ok);
  });
  const left = cancel(q.given.units, factors);
  const unitsOk = sameUnits(left, q.target);
  if (!unitsOk && factorOk.every(Boolean))
    notes.push(`After cancelling, the units left are ${unitText(left)}, not ${unitText(q.target)}.` + (factors.length < 2 ? " Add another factor if the unit left over still isn't the one you want." : ""));
  const p = parseAnswer(raw);
  const numberOk = !!p && close(p.value, q.answer, Math.abs(q.answer) * 0.005);
  if (!numberOk && p) {
    const trap = q.traps?.find((t) => close(p.value, t.value, Math.abs(t.value) * 0.005));
    if (trap) notes.push(trap.note);
    else if (factorOk.every(Boolean) && unitsOk) notes.push("The setup is right; check the arithmetic: multiply the tops, divide by the bottoms.");
  }
  if (numberOk && !(factorOk.every(Boolean) && unitsOk)) notes.unshift("Right number — but the setup has to show why.");
  return { ok: numberOk && unitsOk && factorOk.every(Boolean), notes, factorOk, unitsOk, numberOk };
}
