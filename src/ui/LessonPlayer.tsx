// A lesson start to finish: its notes (for a learn lesson), its questions,
// then how it went. Any answered question can be gone back to with ‹ ›; a
// miss comes back once at the end, freshly made.
import React, { useMemo, useRef, useState } from "react";
import type { Lesson, Maker, Note } from "../content/types";
import { type Slot, againAllowed, buildLesson } from "../engine/session";
import { rng } from "../lib/rng";
import { QuestionView } from "./QuestionView";

export type Answer = { makerId: string; concepts: string[]; correct: boolean };

/** Notes, a card at a time. Also the "read the notes" page. */
export function NotesView(props: { notes: Note[]; onDone: () => void; doneLabel: string; onSkip?: () => void }) {
  const [i, setI] = useState(0);
  const note = props.notes[i];
  const last = i === props.notes.length - 1;
  return (
    <div className="notes">
      <span className="tag">Notes · {i + 1} of {props.notes.length}</span>
      <h2>{note.title}</h2>
      <div className="notes-body">{note.body}</div>
      <div className="q-bar">
        <button onClick={() => setI(i - 1)} disabled={i === 0}>Back</button>
        {props.onSkip && !last && <button className="link" onClick={props.onSkip}>Skip notes</button>}
        <button className="primary" onClick={() => (last ? props.onDone() : setI(i + 1))}>
          {last ? props.doneLabel : "Next"}
        </button>
      </div>
    </div>
  );
}

export function LessonPlayer(props: {
  lesson: Lesson;
  carried: Maker[];
  onExit: (answers: Answer[] | null) => void;
}) {
  const { lesson } = props;
  const r = useRef(rng(Math.floor(Math.random() * 1e9))).current;
  const [reading, setReading] = useState(lesson.kind === "learn" && !!lesson.notes?.length);
  const [slots, setSlots] = useState<Slot[]>(() => buildLesson(lesson, r, props.carried));
  const [view, setView] = useState(0);
  const [reached, setReached] = useState(0);
  const [results, setResults] = useState<(boolean | undefined)[]>([]);

  const answered = (i: number, ok: boolean) => {
    setResults((x) => Object.assign([...x], { [i]: ok }));
    const s = slots[i];
    if (!ok && againAllowed(lesson, s)) setSlots((all) => [...all, { maker: s.maker, q: s.maker.make(r), phase: "again" }]);
  };
  const advance = (i: number) => {
    setView(i + 1);
    setReached((x) => Math.max(x, i + 1));
  };

  const finished = view >= slots.length;
  const firstTry = slots.map((s, i) => ({ s, ok: results[i] })).filter((x) => x.s.phase !== "again" && x.ok !== undefined);
  const right = firstTry.filter((x) => x.ok).length;
  const answers: Answer[] = firstTry.map((x) => ({ makerId: x.s.maker.id, concepts: x.s.maker.concepts, correct: !!x.ok }));
  const progress = results.filter((x) => x !== undefined).length / slots.length;
  const noNotes = lesson.kind !== "learn";

  const header = useMemo(
    () => (noNotes ? (lesson.kind === "warmup" ? "Warm-up · no notes" : "Exit check · no notes") : lesson.title),
    [lesson, noNotes],
  );

  return (
    <div className="page lesson">
      <div className="lesson-top">
        <button className="icon" onClick={() => props.onExit(null)} aria-label="Leave the lesson">×</button>
        {!reading && (
          <span className="lesson-nav">
            <button className="icon" onClick={() => setView(view - 1)} disabled={view === 0} aria-label="Previous question">‹</button>
            <button className="icon" onClick={() => setView(view + 1)} disabled={view >= Math.min(reached, slots.length)} aria-label="Next question">›</button>
          </span>
        )}
        <div className="progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: (reading ? 0 : progress * 100) + "%" }} />
        </div>
        <span className="lesson-title">{header}</span>
      </div>

      {reading ? (
        <NotesView notes={lesson.notes!} doneLabel="Start the questions" onDone={() => setReading(false)} onSkip={() => setReading(false)} />
      ) : (
        <>
          {slots.slice(0, Math.min(reached + 1, slots.length)).map((s, i) => (
            <div key={i} hidden={i !== view}>
              {s.phase === "carried" && <span className="tag carried">Missed last time</span>}
              {s.phase === "again" && <span className="tag again">One more go</span>}
              {i < reached && results[i] !== undefined && <span className="tag past">Question {i + 1} · answered</span>}
              <QuestionView q={s.q} onAnswered={(ok) => answered(i, ok)} onContinue={() => advance(i)} />
            </div>
          ))}
          {finished && (
            <div className="lesson-done">
              <span className="tag">{lesson.kind === "exit" ? "Exit check" : lesson.kind === "warmup" ? "Warm-up" : "Lesson"} done</span>
              <h2>{right === firstTry.length ? "All right first time" : right + " of " + firstTry.length + " right first time"}</h2>
              {right < firstTry.length && (
                <p className="muted">
                  {lesson.kind === "exit" ? "What you missed opens the next warm-up." : "What you missed comes back in the next warm-up."}
                </p>
              )}
              <ol className="review">
                {slots.map((s, i) =>
                  results[i] === undefined ? null : (
                    <li key={i}>
                      <button onClick={() => setView(i)}>
                        <span className={results[i] ? "mark ok" : "mark bad"}>{results[i] ? "✓" : "✗"}</span>
                        <span>{s.q.prompt}</span>
                      </button>
                    </li>
                  ),
                )}
              </ol>
              <div className="q-bar">
                <button className="primary" onClick={() => props.onExit(answers)}>Back to the plan</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
