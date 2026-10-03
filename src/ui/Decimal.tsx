// Scientific notation the way the class handout teaches it, by hand:
//   1. Move the decimal to the right of the first non-zero number.
//   2. Count how many places the decimal had to be moved.
//   3. If it moved to the right, the exponent is negative.
//   4. If it moved to the left, the exponent is positive.
// The digits sit in a row; the student moves the point with the arrows (or
// taps between two digits), watches the count, then writes the exponent.
import React, { useState } from "react";
import type { Question } from "../content/types";
import { parseAnswer } from "../lib/answer";
import { sup } from "../content/unit1";
import { VerdictBar } from "./VerdictBar";

type DecimalQ = Extract<Question, { kind: "decimal" }>;

const STEPS = [
  "Move the decimal to the right of the first non-zero number.",
  "Count how many places it moved.",
  "Moved right: the exponent is negative.",
  "Moved left: the exponent is positive.",
];

/** The number as it reads with the point at `at`: leading and trailing zeros trimmed. */
export function readAs(digits: string, at: number): string {
  const whole = digits.slice(0, at).replace(/^0+(?=\d)/, "") || "0";
  const frac = digits.slice(at).replace(/0+$/, "");
  return frac ? whole + "." + frac : whole;
}

export function DecimalQuestion(props: { q: DecimalQ; onAnswered: (ok: boolean) => void; onContinue: () => void }) {
  const { q } = props;
  const [at, setAt] = useState(q.start);
  const [exp, setExp] = useState("");
  const [shown, setShown] = useState<null | { ok: boolean; note?: string; answer: string }>(null);
  const done = shown !== null;
  const moved = at - q.start; // positive: moved right
  const e = parseAnswer(exp)?.value;
  const ready = exp.trim() !== "" && e !== undefined && Number.isInteger(e);

  const check = () => {
    if (!ready || done) return;
    const placed = at === q.target;
    const ok = placed && e === q.exponent;
    let note: string | undefined;
    if (!placed) note = `Step 1: the decimal goes just to the right of the first non-zero digit, ${q.digits[q.target - 1]}.`;
    else if (Math.abs(e!) !== Math.abs(q.exponent)) note = `Step 2: it moved ${Math.abs(q.exponent)} place${Math.abs(q.exponent) === 1 ? "" : "s"}.`;
    else if (e !== q.exponent) note = q.exponent < 0 ? "Step 3: it moved to the right, so the exponent is negative." : "Step 4: it moved to the left, so the exponent is positive.";
    const answer = `${readAs(q.digits, q.target)} × 10${sup(q.exponent)}`;
    setShown({ ok, note, answer });
    props.onAnswered(ok);
  };

  return (
    <div className="q">
      <h2 className="q-prompt">{q.prompt}</h2>
      <ol className="sci-steps">
        {STEPS.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      <div className="mover" aria-label="Move the decimal point">
        <div className="mover-digits">
          {[...q.digits].map((d, i) => (
            <React.Fragment key={i}>
              <button
                className={"gap" + (at === i ? " on" : "")}
                disabled={done}
                onClick={() => setAt(i)}
                aria-label={`Put the decimal before digit ${i + 1}`}
              >
                {at === i && <span className="pt" aria-hidden="true" />}
              </button>
              <span className={"digit" + (done && i === q.target - 1 ? " first" : "")}>{d}</span>
            </React.Fragment>
          ))}
          <button className={"gap" + (at === q.digits.length ? " on" : "")} disabled={done} onClick={() => setAt(q.digits.length)} aria-label="Put the decimal at the end">
            {at === q.digits.length && <span className="pt" aria-hidden="true" />}
          </button>
        </div>
        <div className="mover-controls">
          <button disabled={done || at === 0} onClick={() => setAt(at - 1)} aria-label="Move the decimal left">◀</button>
          <span className="mover-count" aria-live="polite">
            {moved === 0 ? "Not moved yet" : `Moved ${Math.abs(moved)} place${Math.abs(moved) === 1 ? "" : "s"} to the ${moved > 0 ? "right" : "left"}`}
          </span>
          <button disabled={done || at === q.digits.length} onClick={() => setAt(at + 1)} aria-label="Move the decimal right">▶</button>
        </div>
      </div>

      <div className="sci-answer">
        <span className="sci-mantissa">{readAs(q.digits, at)}</span>
        <span className="sci-times">× 10</span>
        <input
          className="sci-exp"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="?"
          aria-label="Exponent"
          value={exp}
          disabled={done}
          onChange={(ev) => setExp(ev.target.value.replace(/[−–]/g, "-"))}
          onKeyDown={(ev) => ev.key === "Enter" && (ev.preventDefault(), check())}
        />
        {!done && (
          <button type="button" className="chip" onClick={() => setExp((x) => (x.startsWith("-") ? x.slice(1) : "-" + x))} aria-label="Flip the sign of the exponent">
            ±
          </button>
        )}
      </div>

      <VerdictBar shown={shown && { ok: shown.ok, note: shown.note, answer: shown.answer, why: q.why }} ready={ready} onCheck={check} onContinue={props.onContinue} />
    </div>
  );
}

/**
 * A scientific-notation answer in two boxes — the number, and the exponent
 * raised beside the 10 — instead of typing "x 10^". Reports the pair as one
 * answer string the grader reads.
 */
export function SciEntry(props: { onChange: (v: string) => void; disabled: boolean; onEnter: () => void }) {
  const [c, setC] = useState("");
  const [e, setE] = useState("");
  const report = (cc: string, ee: string) => props.onChange(cc.trim() && ee.trim() ? `${cc} x 10^${ee}` : "");
  const keys = (ev: React.KeyboardEvent) => ev.key === "Enter" && (ev.preventDefault(), props.onEnter());
  return (
    <div className="sci-answer">
      <input
        className="sci-coef"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="number"
        aria-label="The number, from 1 to just under 10"
        value={c}
        disabled={props.disabled}
        autoFocus
        onChange={(ev) => {
          setC(ev.target.value);
          report(ev.target.value, e);
        }}
        onKeyDown={keys}
      />
      <span className="sci-times">× 10</span>
      <input
        className="sci-exp"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="?"
        aria-label="Exponent"
        value={e}
        disabled={props.disabled}
        onChange={(ev) => {
          const v = ev.target.value.replace(/[−–]/g, "-");
          setE(v);
          report(c, v);
        }}
        onKeyDown={keys}
      />
      {!props.disabled && (
        <button
          type="button"
          className="chip"
          aria-label="Flip the sign of the exponent"
          onClick={() => {
            const v = e.startsWith("-") ? e.slice(1) : "-" + e;
            setE(v);
            report(c, v);
          }}
        >
          ±
        </button>
      )}
    </div>
  );
}
