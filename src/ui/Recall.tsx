// Write it from memory, then check it against the key words. When every key
// word is there it counts as right on its own; otherwise the student reads
// the model answer and says honestly whether they had the idea.
import React, { useState } from "react";
import type { Question } from "../content/types";
import { keysFound } from "../content/vocab";

type RecallQ = Extract<Question, { kind: "recall" }>;

export function RecallQuestion(props: { q: RecallQ; onAnswered: (ok: boolean) => void; onContinue: () => void }) {
  const { q } = props;
  const [text, setText] = useState("");
  const [found, setFound] = useState<boolean[] | null>(null);
  const [decided, setDecided] = useState<boolean | null>(null);

  const check = () => {
    if (!text.trim() || found) return;
    const f = keysFound(q.keys, text);
    setFound(f);
    if (f.every(Boolean)) {
      setDecided(true);
      props.onAnswered(true);
    }
  };
  const decide = (ok: boolean) => {
    setDecided(ok);
    props.onAnswered(ok);
  };

  return (
    <div className="q">
      <h2 className="q-prompt">{q.prompt}</h2>
      <textarea
        className="recall-input"
        rows={3}
        placeholder="In your own words…"
        value={text}
        disabled={!!found}
        autoFocus
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), check())}
      />
      {found && (
        <div className="recall-check">
          <span className="muted">The key words a definition needs:</span>
          <ul className="keys">
            {q.keys.map((k, i) => (
              <li key={i} className={found[i] ? "found" : "missing"}>
                <span aria-hidden="true">{found[i] ? "✓" : "○"}</span> {k.label}
              </li>
            ))}
          </ul>
          <p className="recall-model"><b>A model answer:</b> {q.model}</p>
        </div>
      )}
      <div className={"q-bar" + (decided === true ? " ok" : decided === false ? " bad" : "")}>
        {decided !== null ? (
          <>
            <div className="q-verdict" role="status">
              <strong>{decided ? "Right" : "Not yet"}</strong>
              <span>{decided ? (found?.every(Boolean) ? "Every key word is there." : "Counted right.") : "It comes back — write it again next time, key words and all."}</span>
            </div>
            <button className="primary" onClick={props.onContinue} autoFocus>Continue</button>
          </>
        ) : found ? (
          <>
            <div className="q-verdict">
              <strong>Some key words are missing.</strong>
              <span>Compare with the model answer. Did you have the idea?</span>
            </div>
            <div className="recall-decide">
              <button onClick={() => decide(false)}>Count it as a miss</button>
              <button onClick={() => decide(true)}>I had it — count it right</button>
            </div>
          </>
        ) : (
          <button className="primary" disabled={!text.trim()} onClick={check}>Check</button>
        )}
      </div>
    </div>
  );
}
