// Unit 1's notes: short cards read before practising, one idea each.
import React from "react";
import type { Note } from "./types";
import { PREFIXES, sup } from "./unit1";

const EVERYDAY: Record<string, string> = {
  mega: "The Mississippi River moves about 17 ML of water a second",
  kilo: "1 kg is a bag of salt; 1 km is about 2/3 of a mile",
  centi: "1 cm is a bit less than half an inch",
  milli: "1 mm is about two pencil leads thick",
  micro: "A hair is about 40 µm thick",
};

export const PREFIX_NOTES: Note[] = [
  {
    title: "Five prefixes, five powers of ten",
    body: (
      <>
        <p>A prefix in front of a unit makes it bigger or smaller by a power of ten.</p>
        <table className="notes-table">
          <thead>
            <tr><th>Prefix</th><th>Symbol</th><th>Means</th><th>Power</th></tr>
          </thead>
          <tbody>
            {PREFIXES.map((p) => (
              <tr key={p.name}>
                <td>{p.name}-</td>
                <td className="symbol">{p.symbol}</td>
                <td>{p.means}</td>
                <td>10{sup(p.power)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="notes-sizes">
          {PREFIXES.map((p) => (
            <li key={p.name}><b>{p.name}-</b> {EVERYDAY[p.name]}.</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "Three traps",
    body: (
      <ol className="notes-traps">
        <li>
          <b>Capital M or small m?</b> 1 Mg is a million grams; 1 mg is a thousandth of a gram. The size of the letter is the whole difference.
        </li>
        <li>
          <b>Mass prefixes go on the gram,</b> not the kilogram: mg, kg, Mg — never “mkg”.
        </li>
        <li>
          <b>Fraction prefixes point the other way.</b> A centimeter is 1/100 of a meter, so 1 m = <b>100</b> cm, not 1/100 cm. Small units take many of them.
        </li>
      </ol>
    ),
  },
];

export const SCI_NOTES: Note[] = [
  {
    title: "Scientific notation",
    body: (
      <>
        <p>
          Write a number as <b>a number from 1 to just under 10</b>, times 10 to a power. The power counts how many places the decimal point moves.
        </p>
        <p className="notes-example">4,500 = 4.5 × 10³ <span>the point moved 3 places left</span></p>
        <p className="notes-example">0.031 = 3.1 × 10⁻² <span>the point moved 2 places right</span></p>
      </>
    ),
  },
  {
    title: "Which way does the power go?",
    body: (
      <>
        <ul>
          <li><b>Big numbers get positive powers.</b> 93,000,000 = 9.3 × 10⁷.</li>
          <li><b>Small numbers get negative powers.</b> 0.00056 = 5.6 × 10⁻⁴.</li>
          <li><b>Quick check:</b> if the power is negative, the number must be less than 1.</li>
        </ul>
        <p className="notes-tip">To type it, write <code>5.6 x 10^-4</code> or <code>5.6e-4</code>. The answer box shows it the way it looks on paper.</p>
      </>
    ),
  },
];

export const CYLINDER_NOTES: Note[] = [
  {
    title: "Reading a graduated cylinder",
    body: (
      <ol>
        <li>Set it on a flat table and bend down so your eye is level with the water.</li>
        <li>
          Read the <b>bottom of the curve</b> (the meniscus), not the edges where the water climbs the glass.
        </li>
        <li>
          <b>Check what each line is worth</b> before reading: count the spaces between two numbers. Not every cylinder counts by ones.
        </li>
        <li>1 mL = 1 cm³, so a reading in mL is already a volume in cm³.</li>
      </ol>
    ),
  },
  {
    title: "Displacement: the volume of a solid",
    body: (
      <>
        <p>Read the water, slide the object in, read again. The object pushed its own volume of water up:</p>
        <p className="notes-example">volume of the object = reading with it − reading without it</p>
        <p>52 mL, then 61 mL: the object is 61 − 52 = 9 mL = 9 cm³.</p>
        <p className="notes-tip">Tilt the cylinder and slide the object in, so the glass doesn't break.</p>
      </>
    ),
  },
];
