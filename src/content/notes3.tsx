// Unit 3's notes: "per" units, and the vocabulary with its key words.
import React from "react";
import { ChainDisplay } from "../ui/Chain";
import type { Note } from "./types";
import { stepFactor } from "./unit2";
import { FACTS, type Term } from "./vocab";
import { TERM_SETS } from "./unit3";

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

const TITLES = ["Units and systems", "Meter, kilogram, second, liter", "Prefixes, factors and shapes"];

/** One card per set of four terms: each term and the key words its definition needs. */
export const VOCAB_NOTES: Note[][] = TERM_SETS.map((terms, i) => [
  {
    title: TITLES[i],
    body: (
      <>
        <p>Say each one in your own words. What matters is the key words.</p>
        {table(terms)}
      </>
    ),
  },
]);

export const FACT_NOTES: Note[] = [
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
