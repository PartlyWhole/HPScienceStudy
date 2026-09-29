// The bar under every question: Check before, and after checking a short
// verdict — right or not, the one thing that went wrong, the answer — with
// the full explanation a tap away rather than a wall of text.
import React, { useState } from "react";

export type Shown = {
  ok: boolean;
  /** "4 of 10 right", for questions with several answers. */
  score?: string;
  /** The one thing to know about this answer: the trap it fell into. */
  note?: string;
  /** The right answer, when the question itself doesn't already show it. */
  answer?: string;
  /** The full explanation, behind "Why?". */
  why: string;
};

export function VerdictBar(props: {
  shown: Shown | null;
  ready: boolean;
  onCheck?: () => void;
  onContinue: () => void;
  checkLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const s = props.shown;
  return (
    <div className={"q-bar" + (s ? (s.ok ? " ok" : " bad") : "")}>
      {s && (
        <div className="q-verdict" role="status" aria-live="polite">
          <strong>
            {s.ok ? "Right" : "Not quite"}
            {s.score && <span className="q-score"> · {s.score}</span>}
          </strong>
          {!s.ok && s.note && <span>{s.note}</span>}
          {!s.ok && s.answer && <span className="q-answer">Answer: {s.answer}</span>}
          {open ? (
            <span className="q-why">{s.why}</span>
          ) : (
            <button className="link why" onClick={() => setOpen(true)}>Why?</button>
          )}
        </div>
      )}
      {s ? (
        <button className="primary" onClick={props.onContinue} autoFocus>Continue</button>
      ) : (
        props.onCheck && (
          <button className="primary" disabled={!props.ready} onClick={props.onCheck}>
            {props.checkLabel ?? "Check"}
          </button>
        )
      )}
    </div>
  );
}
