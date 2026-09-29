// The home page: the five sessions in order, each with its date and what it
// gets ready for, and each unit's warm-up, lessons and exit check.
import React from "react";
import { COURSE_TITLE, IDEAS } from "../content/course";
import { isDue } from "../engine/practice";
import type { Lesson, Unit } from "../content/types";
import type { Progress } from "../engine/progress";

const KIND: Record<Lesson["kind"], { icon: string; note: string }> = {
  warmup: { icon: "✎", note: "No notes" },
  learn: { icon: "★", note: "" },
  exit: { icon: "◎", note: "No notes" },
  cards: { icon: "▤", note: "No notes" },
};

/** How long a lesson is, in the words a student would use. */
const countOf = (l: Lesson, short = false) =>
  l.kind === "cards" ? (short ? `${l.items.length} cards` : `${l.items.length} cards, each right twice`) : `${l.items.length} question${l.items.length > 1 ? "s" : ""}`;

export function PlanPage(props: {
  units: Unit[];
  progress: Progress;
  onLesson: (u: Unit, l: Lesson) => void;
  onNotes: (u: Unit) => void;
  onPractice: () => void;
}) {
  const { progress: p } = props;
  // The next thing to do: the first lesson not yet done, in the first ready unit that has one.
  const due = IDEAS.filter((i) => props.units.some((u) => u.ready && u.id === i.unit) && isDue(p, i.id)).length;
  const next = props.units.flatMap((u) => (u.ready ? u.lessons : [])).find((l) => !p.done[l.id]);
  const nextLesson = next && { lesson: next, unit: props.units.find((u) => u.lessons.includes(next))! };
  return (
    <div className="page plan">
      <header className="plan-head">
        <h1>HP Science Study</h1>
        <p className="plan-course">{COURSE_TITLE}</p>
        <p className="muted">
          One short lesson at a time, in order. Each session starts with a warm-up and ends with a check — both without
          notes, like a quiz.
        </p>
      </header>

      {nextLesson && (
        <button className="start-here" onClick={() => props.onLesson(nextLesson.unit, nextLesson.lesson)}>
          <span className="start-kicker">{Object.keys(p.done).length ? "Next up" : "Start here"}</span>
          <span className="start-title">{nextLesson.lesson.title}</span>
          <span className="start-meta">
            Session {nextLesson.unit.n} · {countOf(nextLesson.lesson)}
          </span>
        </button>
      )}

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
                        {last ? last.right + "/" + last.total : countOf(l, true)}
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

      <div className="practice-card">
        <div>
          <strong>Endless practice</strong>
          <span className="muted">
            {due ? due + " idea" + (due > 1 ? "s" : "") + " due for review" : "Mixed questions on anything, for as long as you like"}
          </span>
        </div>
        <button onClick={props.onPractice}>Practise</button>
      </div>

      <footer className="plan-foot muted">
        Progress stays in this browser only. Build {__BUILD_ID__}
      </footer>
    </div>
  );
}
