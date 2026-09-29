// The conversion-factor method on screen: the given amount, then factors on
// horizontal fraction bars, units struck out as they cancel, then the answer.
import React, { useState } from "react";
import type { Question } from "../content/types";
import { type Factor, cancel, unitText, unitsLike } from "../content/units";
import { gradeChain } from "../engine/grade";
import { formatAnswer, formatStandard, parseAnswer, preview } from "../lib/answer";
import { VerdictBar } from "./VerdictBar";

type ChainQ = Extract<Question, { kind: "chain" }>;

/**
 * Which units cancel, as on paper: each unit on top is struck out with the
 * first matching unit below it. Keys: given top "g0", given bottom "d0",
 * factor tops "t0" and bottoms "b0".
 */
function struck(start: { num: string[]; den: string[] }, factors: Factor[]) {
  const tops = [...start.num.map((u, i) => ({ u, key: "g" + i })), ...factors.map((f, i) => ({ u: f.top.unit, key: "t" + i }))];
  const bottoms = [...start.den.map((u, i) => ({ u, key: "d" + i })), ...factors.map((f, i) => ({ u: f.bottom.unit, key: "b" + i }))];
  const gone = new Set<string>();
  for (const t of tops) {
    if (!t.u) continue;
    const b = bottoms.find((x) => x.u === t.u && !gone.has(x.key));
    if (b) gone.add(t.key).add(b.key);
  }
  return {
    given: (i: number) => gone.has("g" + i),
    givenDen: (i: number) => gone.has("d" + i),
    top: (i: number) => gone.has("t" + i),
    bottom: (i: number) => gone.has("b" + i),
  };
}

const Unit = (props: { u: string; gone?: boolean }) => <span className={"u-sym" + (props.gone ? " gone" : "")}>{props.u}</span>;

/** A worked setup, as it is written on paper. */
export function ChainDisplay(props: { n: number; units: { num: string[]; den: string[] }; factors: Factor[]; result?: string }) {
  const s = struck(props.units, props.factors);
  return (
    <div className="chain display" aria-label="Worked setup">
      <span className="chain-given">
        {formatStandard(props.n)}{" "}
        {props.units.den.length ? (
          <span className="frac">
            <span>{props.units.num.map((u, i) => <Unit key={i} u={u} gone={s.given(i)} />)}</span>
            <span>{props.units.den.map((u, i) => <Unit key={i} u={u} gone={s.givenDen(i)} />)}</span>
          </span>
        ) : (
          props.units.num.map((u, i) => <Unit key={i} u={u} gone={s.given(i)} />)
        )}
      </span>
      {props.factors.map((f, i) => (
        <React.Fragment key={i}>
          <span className="chain-op">×</span>
          <span className="frac">
            <span>{formatStandard(f.top.n)} <Unit u={f.top.unit} gone={s.top(i)} /></span>
            <span>{formatStandard(f.bottom.n)} <Unit u={f.bottom.unit} gone={s.bottom(i)} /></span>
          </span>
        </React.Fragment>
      ))}
      {props.result && (
        <>
          <span className="chain-op">=</span>
          <span className="chain-given">{props.result}</span>
        </>
      )}
    </div>
  );
}

type Draft = { topN: string; topU: string; botN: string; botU: string };
const blank = (): Draft => ({ topN: "", topU: "", botN: "", botU: "" });

const asFactor = (d: Draft): Factor => ({
  top: { n: parseAnswer(d.topN)?.value ?? NaN, unit: d.topU },
  bottom: { n: parseAnswer(d.botN)?.value ?? NaN, unit: d.botU },
});

export function ChainQuestion(props: { q: ChainQ; onAnswered: (ok: boolean) => void; onContinue: () => void }) {
  const { q } = props;
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    q.guided ? q.solution.map((f) => ({ ...blank(), topU: f.top.unit, botU: f.bottom.unit })) : [blank()],
  );
  const [entry, setEntry] = useState("");
  const [verdict, setVerdict] = useState<ReturnType<typeof gradeChain> | null>(null);
  const done = verdict !== null;
  const options = unitsLike(q.given.units, q.target);

  const complete = (d: Draft) => d.topU && d.botU && parseAnswer(d.topN) && parseAnswer(d.botN);
  const ready = drafts.length > 0 && drafts.every(complete) && parseAnswer(entry) !== null;
  const factors = drafts.map(asFactor);
  // What is left so far, counting only the factors whose units are chosen.
  const chosen = drafts.filter((d) => d.topU && d.botU).map(asFactor);
  const left = cancel(q.given.units, chosen);
  const s = struck(q.given.units, factors);

  const set = (i: number, patch: Partial<Draft>) => setDrafts((ds) => ds.map((d, k) => (k === i ? { ...d, ...patch } : d)));

  const check = () => {
    if (!ready || done) return;
    const v = gradeChain(q, factors, entry);
    setVerdict(v);
    props.onAnswered(v.ok);
  };

  const unitPicker = (value: string, onChange: (u: string) => void, label: string, gone: boolean) => (
    <select className={"unit-pick" + (gone ? " gone" : "")} value={value} disabled={done || !!q.guided} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="" disabled>unit</option>
      {options.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  );
  const numberBox = (value: string, onChange: (v: string) => void, label: string) => (
    <input
      className="num-box"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={value}
      disabled={done}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
      aria-label={label}
      placeholder="?"
    />
  );

  return (
    <div className="q">
      {q.context?.map((c, i) => <p key={i} className="q-context">{c}</p>)}
      <h2 className="q-prompt">{q.prompt}</h2>
      <p className="muted chain-help">
        {q.guided
          ? "The units are set. Fill in the numbers so each factor equals 1, then the answer."
          : "Build each factor: the unit you want to get rid of goes on the bottom."}
      </p>

      <div className="chain" aria-label="Your setup">
        <span className="chain-given">
          {formatStandard(q.given.n)}{" "}
          {q.given.units.den.length ? (
            <span className="frac">
              <span>{q.given.units.num.map((u, i) => <Unit key={i} u={u} gone={s.given(i)} />)}</span>
              <span>{q.given.units.den.map((u, i) => <Unit key={i} u={u} gone={s.givenDen(i)} />)}</span>
            </span>
          ) : (
            q.given.units.num.map((u, i) => <Unit key={i} u={u} gone={s.given(i)} />)
          )}
        </span>
        {drafts.map((d, i) => (
          <React.Fragment key={i}>
            <span className="chain-op">×</span>
            <span className={"frac edit" + (verdict && !verdict.factorOk[i] ? " wrong" : verdict ? " right" : "")}>
              <span>
                {numberBox(d.topN, (v) => set(i, { topN: v }), `Factor ${i + 1} top number`)}
                {unitPicker(d.topU, (u) => set(i, { topU: u }), `Factor ${i + 1} top unit`, s.top(i))}
              </span>
              <span>
                {numberBox(d.botN, (v) => set(i, { botN: v }), `Factor ${i + 1} bottom number`)}
                {unitPicker(d.botU, (u) => set(i, { botU: u }), `Factor ${i + 1} bottom unit`, s.bottom(i))}
              </span>
            </span>
          </React.Fragment>
        ))}
        <span className="chain-op">=</span>
        <span className="chain-answer">
          <input
            className="num-box answer"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={entry}
            disabled={done}
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
            aria-label="Answer"
            placeholder="answer"
          />
          <span className="u-sym">{unitText(q.target)}</span>
        </span>
      </div>

      {!done && (
        <div className="chain-tools">
          {!q.guided && (
            <>
              <button type="button" className="chip" onClick={() => setDrafts((ds) => [...ds, blank()])} disabled={drafts.length >= 3}>+ Add a factor</button>
              <button type="button" className="chip" onClick={() => setDrafts((ds) => ds.slice(0, -1))} disabled={drafts.length <= 1}>− Remove one</button>
            </>
          )}
          <span className={"chain-left" + (chosen.length && unitText(left) === unitText(q.target) ? " ok" : "")}>
            Units left: <b>{unitText(left)}</b>
            {entry && preview(entry) && <> · answer reads {preview(entry)}</>}
          </span>
        </div>
      )}

      {verdict && !verdict.ok && (
        <div className="chain-worked">
          <span className="muted">One correct setup:</span>
          <ChainDisplay n={q.given.n} units={q.given.units} factors={q.solution} result={formatAnswer(q.answer) + " " + unitText(q.target)} />
        </div>
      )}

      <VerdictBar
        shown={
          verdict && {
            ok: verdict.ok,
            note: verdict.notes[0],
            answer: formatAnswer(q.answer) + " " + unitText(q.target),
            why: [...verdict.notes.slice(1), q.why].join(" "),
          }
        }
        ready={ready}
        onCheck={check}
        onContinue={props.onContinue}
      />
    </div>
  );
}

