// Unit 1's notes: short cards read before practising, one idea each. Their
// worked examples are never the practice questions' own numbers, so the
// questions test remembering the idea, not re-reading the card.
import React from "react";
import type { Note } from "./types";
import { LADDER } from "./unit1";
import { CylinderFigure } from "../ui/CylinderFigure";
import { closeUp } from "./unit1";

export const PREFIX_NOTES: Note[] = [
  {
    title: "King Henry Doesn't Usually Drink Chocolate Milk",
    body: (
      <>
        <p>The first letters give the metric ladder, biggest to smallest. The base unit is the meter, liter or gram.</p>
        <table className="notes-table ladder">
          <thead>
            <tr><th></th><th>Prefix</th><th>Symbol</th><th>Size</th></tr>
          </thead>
          <tbody>
            {LADDER.map((p) => (
              <tr key={p.word} className={p.name ? "" : "base"}>
                <td className="word">{p.word}</td>
                <td>{p.name ? p.name + "-" : "base unit"}</td>
                <td className="symbol">{p.name ? p.symbol : "m, L, g"}</td>
                <td>{p.power > 0 ? "1 " + p.name + " = " + p.means : p.power < 0 ? (10 ** -p.power).toLocaleString("en-US") + " " + p.name + " = 1 unit" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
  },
];

export const LADDER_NOTES: Note[] = [
  {
    title: "Moving along the ladder",
    body: (
      <>
        <p>
          Going <b>down</b> the ladder (to a smaller unit): <b>multiply by 10</b> for each step — move the decimal one place to the{" "}
          <b>right</b>.
        </p>
        <p>
          Going <b>up</b> the ladder (to a larger unit): <b>divide by 10</b> for each step — move the decimal one place to the{" "}
          <b>left</b>.
        </p>
        <p className="notes-example">
          5 km = 50 hm = 500 dam = 5,000 m = 50,000 dm = 500,000 cm = 5,000,000 mm
          <span>each step down: one more place to the right</span>
        </p>
      </>
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
    title: "To write a number in scientific notation",
    body: (
      <>
        <ol className="notes-steps">
          <li>Move the decimal to the right of the first non-zero number.</li>
          <li>Count how many places the decimal had to be moved.</li>
          <li>If the decimal had to be moved to the right, the exponent is negative.</li>
          <li>If the decimal had to be moved to the left, the exponent is positive.</li>
        </ol>
        <p className="notes-example">5,100,000 → 5.1 × 10⁶ <span>moved 6 places left: positive</span></p>
        <p className="notes-example">0.00082 → 8.2 × 10⁻⁴ <span>moved 4 places right: negative</span></p>
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
