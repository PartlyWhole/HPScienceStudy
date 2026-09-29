// The whole app: the plan, a lesson in progress, or a unit's notes.
import React, { useMemo, useState } from "react";
import { UNITS } from "./content/course";
import type { Lesson, Maker, Unit } from "./content/types";
import { type Progress, finishLesson, loadProgress, saveProgress } from "./engine/progress";
import { makerIndex } from "./engine/session";
import { LessonPlayer, NotesView } from "./ui/LessonPlayer";
import { PlanPage } from "./ui/PlanPage";

type Screen = { kind: "plan" } | { kind: "lesson"; unit: Unit; lesson: Lesson } | { kind: "notes"; unit: Unit };

export function App() {
  const [p, setP] = useState<Progress>(loadProgress);
  const [screen, setScreen] = useState<Screen>({ kind: "plan" });
  const index = useMemo(() => makerIndex(UNITS), []);

  const update = (next: Progress) => {
    setP(next);
    saveProgress(next);
  };

  if (screen.kind === "lesson") {
    const carried = p.carry.map((id) => index.get(id)).filter(Boolean) as Maker[];
    return (
      <LessonPlayer
        key={screen.lesson.id}
        lesson={screen.lesson}
        carried={carried}
        onExit={(answers) => {
          if (answers) update(finishLesson(p, screen.lesson.id, answers));
          setScreen({ kind: "plan" });
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (screen.kind === "notes") {
    const notes = screen.unit.lessons.flatMap((l) => l.notes ?? []);
    return (
      <div className="page lesson">
        <div className="lesson-top">
          <button className="icon" onClick={() => setScreen({ kind: "plan" })} aria-label="Back to the plan">×</button>
          <span className="lesson-title">Session {screen.unit.n} notes</span>
        </div>
        <NotesView notes={notes} doneLabel="Back to the plan" onDone={() => setScreen({ kind: "plan" })} />
      </div>
    );
  }

  return (
    <PlanPage
      units={UNITS}
      progress={p}
      onLesson={(unit, lesson) => {
        setScreen({ kind: "lesson", unit, lesson });
        window.scrollTo(0, 0);
      }}
      onNotes={(unit) => setScreen({ kind: "notes", unit })}
    />
  );
}
