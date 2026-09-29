// A question worked in steps: each part typed, all checked together, each
// marked on its own — so "r = 3.3" can be right while the volume is not.
import React, { useState } from "react";
import type { Question } from "../content/types";
import { type Verdict, gradePart } from "../engine/grade";
import { formatStandard, parseAnswer } from "../lib/answer";
import { FigureView } from "./FigureView";
import { VerdictBar } from "./VerdictBar";

type StepsQ = Extract<Question, { kind: "steps" }>;

export function StepsQuestion(props: { q: StepsQ; onAnswered: (ok: boolean) => void; onContinue: () => void }) {
  const { q } = props;
  const [entries, setEntries] = useState<string[]>(() => q.parts.map(() => ""));
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);
  const done = verdicts !== null;
  const ready = entries.every((e) => parseAnswer(e) !== null);
  const ok = !!verdicts?.every((v) => v.ok);

  const check = () => {
    if (!ready || done) return;
    const v = q.parts.map((p, i) => gradePart(p, entries[i]));
    setVerdicts(v);
    props.onAnswered(v.every((x) => x.ok));
  };

  return (
    <div className="q">
      {q.context?.map((c, i) => <p key={i} className="q-context">{c}</p>)}
      <h2 className="q-prompt">{q.prompt}</h2>
      {q.figure && <FigureView figure={q.figure} />}
      <ol className="parts">
        {q.parts.map((p, i) => (
          <li key={i} className={verdicts ? (verdicts[i].ok ? "right" : "wrong") : ""}>
            <label>
              <span className="part-label">{p.label}</span>
              <span className="entry-row">
                <input
                  className="entry-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={entries[i]}
                  disabled={done}
                  autoFocus={i === 0}
                  onChange={(e) => setEntries((xs) => xs.map((x, k) => (k === i ? e.target.value : x)))}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
                />
                {p.unit && <span className="entry-unit">{p.unit}</span>}
              </span>
            </label>
            {verdicts && !verdicts[i].ok && (
              <span className="part-note">
                {verdicts[i].note ? verdicts[i].note + " " : ""}It's {formatStandard(p.answer)}{p.unit ? " " + p.unit : ""}.
              </span>
            )}
          </li>
        ))}
      </ol>
      <VerdictBar
        shown={verdicts && { ok, score: verdicts.length > 1 ? `${verdicts.filter((v) => v.ok).length} of ${verdicts.length} parts` : undefined, why: q.why }}
        ready={ready}
        onCheck={check}
        onContinue={props.onContinue}
      />
    </div>
  );
}
