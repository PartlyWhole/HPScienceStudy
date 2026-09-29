// Unit 2's notes: the conversion-factor method, from the plan's Session 2.
import React from "react";
import { ChainDisplay } from "../ui/Chain";
import type { Note } from "./types";
import { FACTS, stepFactor } from "./unit2";

const km = { num: ["km"], den: [] };
const mg = { num: ["mg"], den: [] };

export const FACTOR_NOTES: Note[] = [
  {
    title: "A conversion factor is a fraction equal to 1",
    body: (
      <>
        <p>
          1,000 m and 1 km are the same distance written two ways. Put one over the other and the fraction is 1:
        </p>
        <div className="chain display">
          <span className="frac"><span>1,000 m</span><span>1 km</span></span>
          <span className="chain-op">=</span>
          <span className="frac"><span>1 km</span><span>1,000 m</span></span>
          <span className="chain-op">=</span>
          <span className="chain-given">1</span>
        </div>
        <p>
          Multiplying by 1 doesn't change an amount. So multiplying by a conversion factor changes the <b>units</b>,
          never the amount. Either way up is still 1 — which way up you need depends on what has to cancel.
        </p>
      </>
    ),
  },
  {
    title: "Worked example: 3.5 km to m",
    body: (
      <>
        <ChainDisplay n={3.5} units={km} factors={[stepFactor("km", "m")]} result="3,500 m" />
        <p>
          km is on the bottom of the factor, so it cancels the km you started with. What's left is m.
        </p>
      </>
    ),
  },
];

export const FACTS_NOTES: Note[] = [
  {
    title: "Factors to know from memory",
    body: (
      <>
        <table className="notes-table">
          <tbody>
            {FACTS.map((f) => (
              <tr key={f.one + f.of}>
                <td>1 {f.one}</td>
                <td>=</td>
                <td>
                  <b>{f.is.toLocaleString("en-US")}</b> {f.of === "day" && f.is !== 1 ? "days" : f.of}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="notes-tip">Metric ones come from the prefixes: 1 km = 1,000 m, 1 L = 1,000 mL, and so on.</p>
      </>
    ),
  },
];

export const METHOD_NOTES: Note[] = [
  {
    title: "The method, in four steps",
    body: (
      <ol>
        <li>Write the given amount with its unit.</li>
        <li>
          Multiply by a factor with the unit you want to get rid of on the <b>bottom</b>.
        </li>
        <li>Cancel units that appear on the top and the bottom. Add another factor if what's left still isn't the unit you want.</li>
        <li>Multiply the tops, divide by the bottoms, and write the unit on the answer.</li>
      </ol>
    ),
  },
  {
    title: "Three habits",
    body: (
      <ul>
        <li>
          <b>Horizontal fraction bars, always.</b> A slanted bar hides which unit is on the bottom, and that's how factors get flipped.
        </li>
        <li>
          <b>Units on every number,</b> including inside the factors.
        </li>
        <li>
          <b>Sense check.</b> Converting to a smaller unit gives a bigger number (km → m). Converting to a bigger unit gives a smaller one (mg → kg).
        </li>
      </ul>
    ),
  },
];

export const TWO_STEP_NOTES: Note[] = [
  {
    title: "Two steps: go through the base unit",
    body: (
      <>
        <p>There's no mg-to-kg factor to memorize. Go through grams — two factors, each one you know:</p>
        <ChainDisplay n={4200} units={mg} factors={[stepFactor("mg", "g"), stepFactor("g", "kg")]} result="0.0042 kg" />
        <p>mg cancels mg, then g cancels g. What's left is kg.</p>
        <p className="notes-tip">The same goes for time: 3 days → min goes through hours (24 hr = 1 day, then 60 min = 1 hr).</p>
      </>
    ),
  },
];
