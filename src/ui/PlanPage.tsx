// The home page: the five sessions in order, each with its date and what it
// gets ready for, and each unit's warm-up, lessons and exit check.
import React from "react";
import { COURSE_TITLE } from "../content/course";
import type { Lesson, Unit } from "../content/types";
import type { Progress } from "../engine/progress";

const KIND: Record<Lesson["kind"], { icon: string; note: string }> = {
  warmup: { icon: "✎", note: "No notes" },
  learn: { icon: "★", note: "" },
  exit: { icon: "◎", note: "No notes" },
};

export function PlanPage(props: {
  units: Unit[];
  progress: Progress;
  onLesson: (u: Unit, l: Lesson) => void;
  onNotes: (u: Unit) => void;
}) {
  const { progress: p } = props;
  // The next thing to do: the first lesson not yet done, in the first ready unit that has one.
  const next = props.units.flatMap((u) => (u.ready ? u.lessons : [])).find((l) => !p.done[l.id]);
  return (
    <div className="page plan">
      <header className="plan-head">
        <h1>HP Science Study</h1>
        <p className="plan-course">{COURSE_TITLE}</p>
        <p className="muted">
          Five short sessions, each before a deadline. Every one starts with a warm-up and ends with an exit check, both
          without notes — that's what quizzes and tests ask for.
        </p>
      </header>

      {props.units.map((u) => (
        <section key={u.id} className={"unit" + (u.ready ? "" : " coming")}>
          <div className="unit-head">
            <span className="unit-n">Session {u.n} · {u.session}</span>
            <h2>{u.title}</h2>
            <p>Gets you ready for {u.prepares}.</p>
            {u.ready && u.lessons.some((l) => l.notes) && (
              <button className="link" onClick={() => props.onNotes(u)}>Read the notes</button>
            )}
          </div>
          {u.ready ? (
            <ol className="lessons">
              {u.lessons.map((l) => {
                const done = !!p.done[l.id];
                const last = p.last[l.id];
                return (
                  <li key={l.id}>
                    <button className={"lesson-row" + (done ? " done" : "") + (l === next ? " next" : "")} onClick={() => props.onLesson(u, l)}>
                      <span className="lesson-icon" aria-hidden="true">{done ? "✓" : KIND[l.kind].icon}</span>
                      <span className="lesson-name">
                        {l.title}
                        {KIND[l.kind].note && <em className="badge">{KIND[l.kind].note}</em>}
                      </span>
                      <span className="lesson-state">
                        {l === next ? "Next" : last ? last.right + "/" + last.total : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="coming-note">Coming before {u.session}.</p>
          )}
        </section>
      ))}

      <footer className="plan-foot muted">
        Progress stays in this browser only. Build {__BUILD_ID__}
      </footer>
    </div>
  );
}
