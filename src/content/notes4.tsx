// Unit 4's notes: volume, one idea a card. The worked examples use their own
// numbers, never a practice question's.
import React from "react";
import type { Note } from "./types";
import { SolidFigure } from "../ui/SolidFigure";

export const BOX_NOTES: Note[] = [
  {
    title: "Volume = area of the base × height",
    body: (
      <>
        <p>
          For a box: <b>V = L × W × H</b>.
        </p>
        <div className="notes-figure"><SolidFigure solid={{ shape: "box", l: 4, w: 3, h: 2, unit: "cm" }} /></div>
        <p className="notes-example">V = 4 × 3 × 2 = 24 cm³ <span>cm × cm × cm = cm³: the units get cubed too</span></p>
      </>
    ),
  },
  {
    title: "Volume links",
    body: (
      <>
        <table className="notes-table">
          <tbody>
            <tr><td>1 cm³</td><td>=</td><td><b>1 mL</b></td></tr>
            <tr><td>1,000 cm³</td><td>=</td><td><b>1 L</b></td></tr>
            <tr><td>1,000 L</td><td>=</td><td><b>1 m³</b></td></tr>
          </tbody>
        </table>
        <p>So 24 cm³ is 24 mL, or 0.024 L.</p>
      </>
    ),
  },
];

export const CYLINDER_NOTES_4: Note[] = [
  {
    title: "Cylinders: V = πr²h",
    body: (
      <>
        <p>The base is a circle, with area πr². Times the height:</p>
        <div className="notes-figure"><SolidFigure solid={{ shape: "cylinder", d: 8, h: 5, unit: "cm" }} /></div>
        <ol>
          <li>
            Circle the word “across” or “diameter”. Write <b>r = ___</b> first: 8 ÷ 2 = <b>4 cm</b>.
          </li>
          <li>Then V = π × 4² × 5 = π × 16 × 5 ≈ 251.3 cm³.</li>
        </ol>
        <p className="notes-tip">Most cylinder mistakes come from using the diameter as the radius.</p>
      </>
    ),
  },
];

export const SAME_UNIT_NOTES: Note[] = [
  {
    title: "Every length in one unit first",
    body: (
      <>
        <p>
          cm × cm × cm = cm³, a volume. But cm × cm × in isn't a unit of anything. So convert before multiplying:
        </p>
        <p className="notes-example">2 in × 2.54 = 5.08 cm <span>inches to centimeters: × 2.54</span></p>
        <p className="notes-example">40 mm ÷ 10 = 4 cm <span>millimeters to centimeters: ÷ 10</span></p>
      </>
    ),
  },
];

export const L_NOTES: Note[] = [
  {
    title: "L-shapes: split the base",
    body: (
      <>
        <div className="notes-figure"><SolidFigure solid={{ shape: "lshape", a: 5, b: 2, c: 1, d: 3, h: 4, unit: "cm" }} /></div>
        <p>Split the L into two rectangles that don't overlap, and add their areas:</p>
        <p className="notes-example">5 × 2 + 1 × 3 = 13 cm² <span>not the whole box around it</span></p>
        <p>Then times the height: 13 × 4 = 52 cm³.</p>
      </>
    ),
  },
];

export const PERCENT_NOTES: Note[] = [
  {
    title: "Percent difference",
    body: (
      <>
        <p>How far a calculated volume is from the one the graduated cylinder measured:</p>
        <p className="notes-example">
          |predicted − experimental| ÷ predicted × 100%
          <span>“predicted” is the graduated-cylinder volume</span>
        </p>
        <p>Measured 20.0 cm³, calculated 19.0 cm³: |20.0 − 19.0| ÷ 20.0 × 100% = 5%. The lab allows 10%.</p>
      </>
    ),
  },
];
