// Unit 1's notes: short cards read before practising, one idea each. Their
// worked examples are never the practice questions' own numbers, so the
// questions test remembering the idea, not re-reading the card.
import React from "react";
import type { Note } from "./types";
import { PREFIXES } from "./unit1";
import { CylinderFigure } from "../ui/CylinderFigure";
import { closeUp } from "./unit1";

export const PREFIX_NOTES: Note[] = [
  {
    title: "Five prefixes",
    body: (
      <>
        <p>A prefix in front of a unit makes it bigger or smaller. Learn these five:</p>
        <table className="notes-table">
          <thead>
            <tr><th>Prefix</th><th>Symbol</th><th>Means</th></tr>
          </thead>
          <tbody>
            {PREFIXES.map((p) => (
              <tr key={p.name}>
                <td>{p.name}-</td>
                <td className="symbol">{p.symbol}</td>
                <td>{p.means}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>So a kilometer is 1,000 meters, and a milligram is 1/1,000 of a gram.</p>
      </>
    ),
  },
  {
    title: "How big is each one?",
    body: (
      <ul className="notes-sizes">
        <li><b>mega-</b> A megagram (Mg) is 1,000,000 g — about the mass of a small car.</li>
        <li><b>kilo-</b> A kilogram is a bag of sugar. A kilometer is about 2/3 of a mile.</li>
        <li><b>centi-</b> A centimeter is a bit less than half an inch.</li>
        <li><b>milli-</b> A millimeter is about two pencil leads thick.</li>
        <li><b>micro-</b> A micrometer (µm) is tiny: a hair is about 40 of them thick.</li>
      </ul>
    ),
  },
];

export const TRAP_NOTES: Note[] = [
  {
    title: "Three traps",
    body: (
      <ol className="notes-traps">
        <li><b>Capital M or small m?</b> 1 Mg is a million grams; 1 mg is a thousandth of a gram. The size of the letter is the whole difference.</li>
        <li><b>Mass prefixes go on the gram,</b> not the kilogram: mg, kg, Mg — never “mkg”.</li>
        <li><b>Small units take many of them.</b> A centimeter is 1/100 of a meter, so 1 m = <b>100</b> cm, not 1/100 cm.</li>
      </ol>
    ),
  },
];

export const SCI_READ_NOTES: Note[] = [
  {
    title: "Scientific notation",
    body: (
      <>
        <p>
          A number from 1 to just under 10, <b>times 10 to a power</b>. The power says how many places the decimal point moves.
        </p>
        <p className="notes-example">7.2 × 10⁴ = 72,000 <span>positive power: move the point 4 places right</span></p>
        <p className="notes-example">6.3 × 10⁻³ = 0.0063 <span>negative power: move the point 3 places left</span></p>
        <p className="notes-tip">Quick check: a negative power means the number is less than 1.</p>
      </>
    ),
  },
];

export const SCI_WRITE_NOTES: Note[] = [
  {
    title: "Writing it: which way does the power go?",
    body: (
      <>
        <p>Move the point until one digit is in front of it, and count the moves.</p>
        <p className="notes-example">5,100,000 = 5.1 × 10⁶ <span>a big number: positive power</span></p>
        <p className="notes-example">0.00082 = 8.2 × 10⁻⁴ <span>a small number: negative power</span></p>
        <p className="notes-tip">To type it: <code>5.1 x 10^6</code> or <code>5.1e6</code>. The box shows how it reads.</p>
      </>
    ),
  },
];

const SCALE = { capacity: 50, line: 1, label: 5 };

export const CYLINDER_NOTES: Note[] = [
  {
    title: "Reading a graduated cylinder",
    body: (
      <>
        <div className="notes-figure">
          <CylinderFigure cylinder={{ ...closeUp(SCALE, 33), mark: true }} />
        </div>
        <ol>
          <li>Get your eye level with the water.</li>
          <li>Read the <b>bottom of the curve</b> (the meniscus), not the edges. This one reads 33 mL.</li>
          <li><b>Check what each line is worth</b> first. Here there are 5 spaces from 30 to 35, so each line is 1 mL.</li>
        </ol>
      </>
    ),
  },
  {
    title: "Displacement: the volume of a solid",
    body: (
      <>
        <p>Read the water, slide the object in, read again. The object pushes up its own volume of water:</p>
        <p className="notes-example">volume = reading with it − reading without it</p>
        <p>45 mL, then 53 mL: the object is 53 − 45 = 8 mL. And 1 mL = 1 cm³, so it's 8 cm³.</p>
      </>
    ),
  },
];
