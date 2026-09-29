// Unit 3's notes: "per" units, and the vocabulary with its key words.
import React from "react";
import { ChainDisplay } from "../ui/Chain";
import type { Note } from "./types";
import { stepFactor } from "./unit2";
import { FACTS, type Term } from "./vocab";
import { TERMS_A, TERMS_B } from "./unit3";

export const RATE_NOTES: Note[] = [
  {
    title: "“Per” means a fraction",
    body: (
      <>
        <p>
          km/hr is <b>km on top and hr on the bottom</b>. Convert the top unit first, then the bottom unit. A unit on the bottom is
          cancelled by a factor with that unit on <b>top</b>.
        </p>
        <ChainDisplay n={90} units={{ num: ["km"], den: ["hr"] }} factors={[stepFactor("km", "m"), stepFactor("s", "hr")]} result="25 m/s" />
        <p>km cancels km. The hr on the bottom cancels the hr on top of the second factor. What's left is m/s.</p>
      </>
    ),
  },
];

const table = (terms: Term[]) => (
  <table className="notes-table vocab">
    <thead>
      <tr><th>Term</th><th>Key words the definition needs</th></tr>
    </thead>
    <tbody>
      {terms.map((t) => (
        <tr key={t.term}>
          <td><b>{t.term}</b></td>
          <td>{t.keys.map((k) => k.label).join("; ")}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const VOCAB_A_NOTES: Note[] = [
  {
    title: "The SI and its units",
    body: (
      <>
        <p>Say each definition in your own words. What matters is the key words.</p>
        {table(TERMS_A)}
      </>
    ),
  },
];

export const VOCAB_B_NOTES: Note[] = [
  { title: "Liters, prefixes, factors and shapes", body: table(TERMS_B) },
  {
    title: "Facts that show up next to the vocabulary",
    body: (
      <ul>
        {FACTS.filter((f) => f.truth).map((f) => (
          <li key={f.text}>{f.text}</li>
        ))}
        <li>Mass is measured in kg; weight is a force, measured in newtons or pounds.</li>
      </ul>
    ),
  },
];
