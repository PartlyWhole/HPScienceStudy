// The plan's index cards: go round until every card is right twice in a row.
// A missed card comes back three cards later; a right one goes to the back
// until it has been right twice running.
import React, { useRef, useState } from "react";
import type { Lesson, Question } from "../content/types";
import { rng, shuffle } from "../lib/rng";
import type { Answer } from "./LessonPlayer";
import { QuestionView } from "./QuestionView";

export function CardsPlayer(props: { lesson: Lesson; onExit: (answers: Answer[] | null) => void }) {
  const { lesson } = props;
  const r = useRef(rng(Math.floor(Math.random() * 1e9))).current;
  const [queue, setQueue] = useState<number[]>(() => shuffle(r, lesson.items.map((_, i) => i)));
  const [streak, setStreak] = useState<number[]>(() => lesson.items.map(() => 0));
  const [turn, setTurn] = useState(0);
  const [last, setLast] = useState<boolean | null>(null);
  const answers = useRef<Answer[]>([]);
  const card = queue[0];
  const q = useRef(new Map<number, Question>()).current;
  const questionFor = (i: number) => {
    if (!q.has(turn * 100 + i)) q.set(turn * 100 + i, lesson.items[i].make(r));
    return q.get(turn * 100 + i)!;
  };
  const mastered = streak.filter((s) => s >= 2).length;

  const answered = (ok: boolean) => {
    const m = lesson.items[card];
    answers.current.push({ makerId: m.id, concepts: m.concepts, correct: ok });
    setStreak((s) => Object.assign([...s], { [card]: ok ? s[card] + 1 : 0 }));
    setLast(ok);
  };
  const next = () => {
    const rest = queue.slice(1);
    const s = last ? streak[card] : 0;
    if (s < 2) {
      if (last) rest.push(card);
      else rest.splice(Math.min(3, rest.length), 0, card);
    }
    setQueue(rest);
    setLast(null);
    setTurn((t) => t + 1);
  };

  return (
    <div className="page lesson">
      <div className="lesson-top">
        <button className="icon" onClick={() => props.onExit(null)} aria-label="Leave the cards">×</button>
        <div className="progress" role="progressbar" aria-valuenow={mastered} aria-valuemin={0} aria-valuemax={lesson.items.length}>
          <span style={{ width: (mastered / lesson.items.length) * 100 + "%" }} />
        </div>
        <span className="lesson-title">{mastered} of {lesson.items.length} cards</span>
      </div>
      {card === undefined ? (
        <div className="lesson-done">
          <span className="tag">Cards done</span>
          <h2>Every card right twice in a row</h2>
          <p className="muted">
            {answers.current.length} goes, {answers.current.filter((a) => !a.correct).length} missed along the way.
          </p>
          <div className="q-bar">
            <button className="primary" onClick={() => props.onExit(answers.current)}>Back to the plan</button>
          </div>
        </div>
      ) : (
        <>
          <span className="tag">
            {streak[card] === 1 ? "Right once — once more" : "Card"} · {mastered} mastered
          </span>
          <QuestionView key={turn} q={questionFor(card)} onAnswered={answered} onContinue={next} />
        </>
      )}
    </div>
  );
}
