// One question: answer, check, read why, continue. One try each — the point
// is recall, and a miss comes back later rather than being retried on the spot.
import React, { useRef, useState } from "react";
import type { Cell, Question } from "../content/types";
import { gradeCell, gradeNumber, gradeText } from "../engine/grade";
import { formatStandard, parseAnswer, preview } from "../lib/answer";
import { CylinderFigure } from "./CylinderFigure";
import { ChainQuestion } from "./Chain";

type Props = { q: Question; onAnswered: (ok: boolean) => void; onContinue: () => void };
type Verdict = { ok: boolean; text: string };

export function QuestionView(props: Props) {
  if (props.q.kind === "chain") return <ChainQuestion q={props.q} onAnswered={props.onAnswered} onContinue={props.onContinue} />;
  return <SimpleQuestion {...props} q={props.q} />;
}

function SimpleQuestion(props: Omit<Props, "q"> & { q: Exclude<Question, { kind: "chain" }> }) {
  const { q } = props;
  const [entry, setEntry] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [cells, setCells] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const done = verdict !== null;

  const ready =
    q.kind === "number" ? parseAnswer(entry) !== null
    : q.kind === "text" ? entry.trim() !== ""
    : q.kind === "choice" ? choice !== null
    : q.rows.every((row, i) => row.every((c, j) => "given" in c || (cells[i * 10 + j] ?? "").trim() !== ""));

  const check = () => {
    if (!ready || done) return;
    let ok = false;
    let note: string | undefined;
    if (q.kind === "number") ({ ok, note } = gradeNumber(q, entry));
    else if (q.kind === "text") ok = gradeText(q.accept, entry, q.caseSensitive);
    else if (q.kind === "choice") {
      ok = choice === q.correct;
      if (!ok) note = q.whyPerChoice?.[choice!];
    } else ok = q.rows.every((row, i) => row.every((c, j) => gradeCell(c, cells[i * 10 + j] ?? "") !== false));
    setVerdict({ ok, text: ok ? q.why : [note, q.why].filter(Boolean).join(" ") });
    props.onAnswered(ok);
  };

  return (
    <div className="q">
      {"context" in q && q.context?.map((c, i) => <p key={i} className="q-context">{c}</p>)}
      <h2 className="q-prompt">{q.prompt}</h2>

      {"figure" in q && q.figure && (
        <div className="q-figure">
          {q.figure.cylinders.map((c, i) => (
            <CylinderFigure key={i} cylinder={c} />
          ))}
        </div>
      )}

      {q.kind === "number" && <NumberEntry value={entry} onChange={setEntry} unit={q.unit} disabled={done} onEnter={check} form={q.form} />}
      {q.kind === "text" && <TextEntry value={entry} onChange={setEntry} disabled={done} onEnter={check} />}
      {q.kind === "choice" && (
        <div className="choices">
          {q.choices.map((c, i) => (
            <button
              key={i}
              className={"choice" + (choice === i ? " picked" : "") + (done && i === q.correct ? " right" : "") + (done && choice === i && i !== q.correct ? " wrong" : "")}
              disabled={done}
              onClick={() => setChoice(i)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {q.kind === "table" && (
        <FillTable
          columns={q.columns}
          rows={q.rows}
          values={cells}
          done={done}
          onChange={(k, v) => setCells((c) => Object.assign([...c], { [k]: v }))}
          onEnter={check}
        />
      )}

      <div className={"q-bar" + (verdict ? (verdict.ok ? " ok" : " bad") : "")}>
        {verdict && (
          <div className="q-verdict" role="status" aria-live="polite">
            <strong>{verdict.ok ? "Right" : "Not quite"}</strong>
            <span>{verdict.text}</span>
          </div>
        )}
        {verdict ? (
          <button className="primary" onClick={props.onContinue} autoFocus>
            Continue
          </button>
        ) : (
          <button className="primary" disabled={!ready} onClick={check}>
            Check
          </button>
        )}
      </div>
    </div>
  );
}

/** A typed number, shown back the way it looks on paper, with a button for "× 10^". */
function NumberEntry(props: { value: string; onChange: (v: string) => void; unit?: string; disabled: boolean; onEnter: () => void; form?: "standard" | "sci" | "fraction" }) {
  const input = useRef<HTMLInputElement>(null);
  const shown = props.value ? preview(props.value) : null;
  const insert = (s: string) => {
    props.onChange(props.value + s);
    input.current?.focus();
  };
  return (
    <div className="entry">
      <div className="entry-row">
        <input
          ref={input}
          className="entry-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={props.form === "sci" ? "e.g. 5.6 x 10^-4" : props.form === "fraction" ? "e.g. 1/100" : "Type a number"}
          value={props.value}
          disabled={props.disabled}
          autoFocus
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), props.onEnter())}
        />
        {props.unit && <span className="entry-unit">{props.unit}</span>}
      </div>
      {!props.disabled && (
        <div className="entry-help">
          {/* Shortcuts for what a phone keyboard hides, when the question needs them. */}
          {props.form === "sci" && (
            <>
              <button type="button" className="chip" onClick={() => insert(" × 10^")}>× 10^</button>
              <button type="button" className="chip" onClick={() => insert("-")}>−</button>
            </>
          )}
          {props.form === "fraction" && <button type="button" className="chip" onClick={() => insert("/")}>/</button>}
          <span className="entry-preview" aria-live="polite">
            {props.value ? (shown ? "Reads as: " + shown : "Not a number yet") : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function TextEntry(props: { value: string; onChange: (v: string) => void; disabled: boolean; onEnter: () => void }) {
  return (
    <div className="entry">
      <input
        className="entry-input"
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="Type your answer"
        value={props.value}
        disabled={props.disabled}
        autoFocus
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), props.onEnter())}
      />
    </div>
  );
}

/** A table to fill in from memory; after checking, each cell says right or wrong. */
function FillTable(props: {
  columns: string[];
  rows: Cell[][];
  values: string[];
  done: boolean;
  onChange: (key: number, v: string) => void;
  onEnter: () => void;
}) {
  const answerOf = (c: Cell) => ("text" in c ? c.text[0] : "number" in c ? formatStandard(c.number) : "");
  return (
    <table className="fill">
      <thead>
        <tr>{props.columns.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {props.rows.map((row, i) => (
          <tr key={i}>
            {row.map((c, j) => {
              const k = i * 10 + j;
              if ("given" in c) return <td key={j} className="given">{c.given}</td>;
              const ok = props.done ? gradeCell(c, props.values[k] ?? "") : undefined;
              return (
                <td key={j} className={ok === undefined ? "" : ok ? "right" : "wrong"}>
                  <input
                    type="text"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label={props.columns[j] + " for " + (row.find((x) => "given" in x) as { given: string } | undefined)?.given}
                    placeholder={c.placeholder}
                    value={props.values[k] ?? ""}
                    disabled={props.done}
                    autoFocus={k === 1}
                    onChange={(e) => props.onChange(k, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), props.onEnter())}
                  />
                  {ok === false && <span className="fill-answer">{answerOf(c)}</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      {props.rows.some((r) => r.some((c) => "text" in c && c.text.includes("µ"))) && (
        <caption className="fill-tip">Tip: type u for µ.</caption>
      )}
    </table>
  );
}
