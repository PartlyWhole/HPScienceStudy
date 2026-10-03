// Endless practice: choose ideas, then answer until you stop.
import React, { useMemo, useRef, useState } from "react";
import { IDEAS, recapFor } from "../content/course";
import { NotesView } from "./LessonPlayer";
import type { Question, Unit } from "../content/types";
import { isDue, nextMaker, practiceMakers } from "../engine/practice";
import type { Progress } from "../engine/progress";
import type { Slot } from "../engine/session";
import { rng } from "../lib/rng";
import { QuestionView } from "./QuestionView";

const CHOSEN = "hpss-practice-chosen";
const loadChosen = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(CHOSEN) ?? "[]");
  } catch {
    return [];
  }
};
const saveChosen = (ids: string[]) => {
  try {
    localStorage.setItem(CHOSEN, JSON.stringify(ids));
  } catch {
    // Not remembered; no harm.
  }
};

/**
 * A link that opens endless practice straight on these ideas — for a tutor to
 * send ("practise rates and two-step conversions tonight"). It lives after
 * the #, so the site needs no server to read it.
 */
export function practiceLink(ids: string[], recap = false): string {
  return location.origin + location.pathname + "#practice=" + ids.map(encodeURIComponent).join(",") + (recap ? "&recap" : "");
}

/** What a link asks for — its ideas, keeping only ones that exist, and whether to recap first. */
export function linkedPractice(hash: string): { ids: string[]; recap: boolean } | null {
  const m = hash.match(/^#practice=([^&]+)(&recap)?$/);
  if (!m) return null;
  const known = new Set(IDEAS.map((i) => i.id));
  const ids = m[1].split(",").map(decodeURIComponent).filter((id) => known.has(id));
  return ids.length ? { ids, recap: !!m[2] } : null;
}

export const linkedIdeas = (hash: string) => linkedPractice(hash)?.ids ?? null;

const RECAP_KEY = "hpss-practice-recap";
const loadRecap = () => {
  try {
    return localStorage.getItem(RECAP_KEY) !== "off";
  } catch {
    return true;
  }
};
const saveRecap = (on: boolean) => {
  try {
    localStorage.setItem(RECAP_KEY, on ? "on" : "off");
  } catch {
    // Not remembered; no harm.
  }
};

/** The link, ready to copy or send, with what it will practise. */
function ShareBox(props: { link: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const linked = linkedPractice(new URL(props.link).hash);
  const ids = linked?.ids ?? [];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const share = typeof navigator !== "undefined" && "share" in navigator;
  return (
    <div className="share-box" role="dialog" aria-label="Share this practice">
      <strong>A link to this practice</strong>
      <p className="muted">
        Opening it starts endless practice{linked?.recap ? ", after a quick recap," : ""} on: {ids.map((id) => IDEAS.find((i) => i.id === id)?.name).join(", ")}.
      </p>
      <input className="share-link" readOnly value={props.link} onFocus={(e) => e.target.select()} aria-label="Practice link" />
      <div className="row">
        <button className="primary" onClick={copy}>{copied ? "Copied" : "Copy link"}</button>
        {share && <button onClick={() => navigator.share({ title: "HP Science Study practice", url: props.link }).catch(() => {})}>Send…</button>}
        <button className="link" onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
}

function Strength(props: { s: number }) {
  return (
    <span className="strength" aria-label={"strength " + props.s + " of 5"}>
      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= props.s ? "on" : ""} />)}
    </span>
  );
}

export function PracticeSetup(props: { units: Unit[]; progress: Progress; onStart: (ids: string[], recap: boolean) => void; onBack: () => void }) {
  const { progress: p } = props;
  const ready = new Set(props.units.filter((u) => u.ready).map((u) => u.id));
  const ideas = IDEAS.filter((i) => ready.has(i.unit));
  const due = ideas.filter((i) => isDue(p, i.id)).map((i) => i.id);
  const [chosen, setChosen] = useState<Set<string>>(() => {
    const kept = loadChosen().filter((id) => ideas.some((i) => i.id === id));
    return new Set(kept.length ? kept : due.length ? due : ideas.map((i) => i.id));
  });
  const makers = practiceMakers(props.units, chosen);
  const [link, setLink] = useState<string | null>(null);
  const [recap, setRecap] = useState(loadRecap);
  const cards = recapFor([...chosen]).length;
  const toggle = (id: string) =>
    setChosen((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="page practice">
      <div className="lesson-top">
        <button className="icon" onClick={props.onBack} aria-label="Back to the plan">×</button>
        <span className="lesson-title">Endless practice</span>
      </div>
      <h1>Endless practice</h1>
      <p className="muted">Choose what to practise. Questions keep coming until you stop; the weakest and most overdue ideas come up most.</p>
      <div className="presets">
        <button className="chip" onClick={() => setChosen(new Set(due))} disabled={!due.length}>Due for review ({due.length})</button>
        <button className="chip" onClick={() => setChosen(new Set(ideas.map((i) => i.id)))}>Everything</button>
        <button className="chip" onClick={() => setChosen(new Set())} disabled={!chosen.size}>Clear</button>
      </div>
      {props.units.filter((u) => u.ready).map((u) => (
        <section key={u.id} className="idea-group">
          <h2>Session {u.n} · {u.title}</h2>
          <div className="ideas">
            {ideas.filter((i) => i.unit === u.id).map((i) => (
              <button key={i.id} className={"idea" + (chosen.has(i.id) ? " on" : "")} aria-pressed={chosen.has(i.id)} onClick={() => toggle(i.id)}>
                <span>{i.name}</span>
                <Strength s={p.skill[i.id]?.s ?? 0} />
                {isDue(p, i.id) ? <em className="badge">due</em> : !p.skill[i.id] && <em className="badge new">new</em>}
              </button>
            ))}
          </div>
        </section>
      ))}
      <label className="recap-toggle">
        <input
          type="checkbox"
          checked={recap}
          onChange={(e) => {
            setRecap(e.target.checked);
            saveRecap(e.target.checked);
          }}
        />
        <span>
          <b>Recap first</b>
          <span className="muted">
            {" "}— a quick look at the notes for {chosen.size === 1 ? "this idea" : "these ideas"}
            {cards ? ` (${cards} card${cards === 1 ? "" : "s"})` : ""} before the questions start.
          </span>
        </span>
      </label>
      <div className="practice-start">
        <span className="muted">{chosen.size ? chosen.size + " chosen" : "Choose at least one idea."}</span>
        <button className="link" disabled={!makers.length} onClick={() => setLink(practiceLink([...chosen], recap))}>
          Share link
        </button>
        <button
          className="primary"
          disabled={!makers.length}
          onClick={() => {
            saveChosen([...chosen]);
            props.onStart([...chosen], recap);
          }}
        >
          Start
        </button>
      </div>
      {link && <ShareBox link={link} onClose={() => setLink(null)} />}
    </div>
  );
}

export function PracticePlayer(props: {
  units: Unit[];
  progress: Progress;
  chosen: string[];
  /** Open with the notes for the chosen ideas, a card at a time, before any question. */
  recap?: boolean;
  onAnswer: (concepts: string[], ok: boolean) => void;
  onExit: () => void;
}) {
  const r = useRef(rng(Math.floor(Math.random() * 1e9))).current;
  const chosen = useMemo(() => new Set(props.chosen), [props.chosen]);
  const makers = useMemo(() => practiceMakers(props.units, chosen), [props.units, chosen]);
  const progress = useRef(props.progress);
  progress.current = props.progress;
  const asked = useRef(new Set<string>()).current;
  const fresh = (m: Slot["maker"]): Question => {
    let q = m.make(r);
    for (let t = 0; t < 8 && asked.has(q.prompt); t++) q = m.make(r);
    asked.add(q.prompt);
    return q;
  };
  const [slots, setSlots] = useState<Slot[]>(() => {
    const m = nextMaker(makers, chosen, progress.current, [], r);
    return [{ maker: m, q: fresh(m), phase: "main" }];
  });
  const results = useRef<(boolean | undefined)[]>([]);
  const [shown, setShown] = useState<(boolean | undefined)[]>([]);
  const [view, setView] = useState(0);
  const [reached, setReached] = useState(0);
  const [summary, setSummary] = useState(false);
  const recapNotes = useMemo(() => recapFor(props.chosen), [props.chosen]);
  const [reading, setReading] = useState(!!props.recap && recapNotes.length > 0);

  const answered = (i: number, ok: boolean) => {
    results.current[i] = ok;
    setShown([...results.current]);
    props.onAnswer(slots[i].maker.concepts, ok);
    if (i === slots.length - 1) {
      const history = slots.map((s, k) => ({ maker: s.maker, ok: results.current[k] }));
      const m = nextMaker(makers, chosen, progress.current, history, r);
      setSlots((all) => [...all, { maker: m, q: fresh(m), phase: "main" }]);
    }
  };
  const done = shown.filter((x) => x !== undefined).length;
  const right = shown.filter(Boolean).length;

  if (reading)
    return (
      <div className="page lesson">
        <div className="lesson-top">
          <button className="icon" onClick={props.onExit} aria-label="Stop practising">×</button>
          <span className="practice-tally">Recap before practice</span>
        </div>
        <NotesView notes={recapNotes} doneLabel="Start practising" onDone={() => setReading(false)} onSkip={() => setReading(false)} />
      </div>
    );

  if (summary)
    return (
      <div className="page lesson">
        <div className="lesson-done">
          <span className="tag">Endless practice</span>
          <h2>{done ? right + " of " + done + " right" : "Nothing answered yet"}</h2>
          <ul className="strengths">
            {IDEAS.filter((i) => chosen.has(i.id)).map((i) => (
              <li key={i.id}>
                <span>{i.name}</span>
                <Strength s={props.progress.skill[i.id]?.s ?? 0} />
              </li>
            ))}
          </ul>
          <div className="q-bar">
            <button onClick={() => setSummary(false)}>Keep going</button>
            <button className="primary" onClick={props.onExit}>Back to the plan</button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="page lesson">
      <div className="lesson-top">
        <button className="icon" onClick={() => setSummary(true)} aria-label="Stop practising">×</button>
        <span className="lesson-nav">
          <button className="icon" onClick={() => setView(view - 1)} disabled={view === 0} aria-label="Previous question">‹</button>
          <button className="icon" onClick={() => setView(view + 1)} disabled={view >= reached} aria-label="Next question">›</button>
        </span>
        <span className="practice-tally">{done ? right + " of " + done + " right" : "Endless practice"}</span>
        <button className="link" onClick={() => setSummary(true)}>Finish</button>
      </div>
      {slots.slice(0, reached + 1).map((s, i) => (
        <div key={i} hidden={i !== view}>
          {i < reached && shown[i] !== undefined && <span className="tag past">Question {i + 1} · answered</span>}
          <QuestionView
            q={s.q}
            onAnswered={(ok) => answered(i, ok)}
            onContinue={() => {
              setView(i + 1);
              setReached((x) => Math.max(x, i + 1));
            }}
          />
        </div>
      ))}
    </div>
  );
}
