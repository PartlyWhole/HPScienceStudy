// The thirteen Chapter 8 terms, each with a short definition and the key
// words a definition needs — the plan's vocabulary table — and the facts that
// tend to show up next to them.

/** A key word, found if any of its spellings appears in what was written. */
export type Key = { label: string; any: string[]; count?: number };

export type Term = { term: string; model: string; keys: Key[]; group?: string };

export const TERMS: Term[] = [
  {
    term: "base unit",
    model: "One of the 7 SI units that all other units are built from.",
    keys: [
      { label: "one of the 7 SI units", any: ["7", "seven", "si"] },
      { label: "other units are built from them", any: ["built", "made", "other unit", "combin", "from them", "based"] },
    ],
  },
  {
    term: "derived unit",
    model: "A unit made by combining base units, like the joule, the newton or m³.",
    keys: [
      { label: "made by combining base units", any: ["combin", "made from", "made of", "made by", "built from", "base unit", "two or more"] },
      { label: "an example (joule, newton, m³…)", any: ["joule", "newton", "watt", "m³", "m3", "cubic", "volt", "pascal", "m/s", "speed", "area", "volume", "density"] },
    ],
  },
  {
    term: "International System of Units (the SI)",
    model: "The SI: the system of units scientists everywhere use. It was published in 1960 and is run from Sèvres, France.",
    keys: [
      { label: "the SI", any: ["si", "metric"] },
      { label: "used by scientists everywhere", any: ["scientist", "everywhere", "world", "international", "all over"] },
      { label: "published 1960, run from Sèvres, France", any: ["1960", "sevres", "france", "paris"] },
    ],
  },
  {
    term: "metric system",
    model: "The American name for the SI. It began in France during the French Revolution, with the meter and the kilogram.",
    keys: [
      { label: "the American name for the SI", any: ["american", "si", "international"] },
      { label: "began in France, French Revolution", any: ["france", "french", "revolution"] },
      { label: "with the meter and kilogram", any: ["meter", "metre", "kilogram", "kg"] },
    ],
  },
  {
    term: "meter",
    model: "The SI unit of distance (length), a few inches longer than a yard, set by the speed of light.",
    keys: [
      { label: "SI unit of distance (length)", any: ["distance", "length", "how far", "long"] },
      { label: "a bit longer than a yard", any: ["yard", "inch", "3.3", "3 feet", "39"] },
      { label: "set by the speed of light", any: ["light"] },
    ],
  },
  {
    term: "kilogram",
    model: "The SI unit of mass — not weight — about 2.2 lb on Earth.",
    keys: [
      { label: "SI unit of mass", any: ["mass"] },
      { label: "not weight", any: ["not weight", "isn't weight", "not the same as weight", "weight"] },
      { label: "about 2.2 lb", any: ["2.2", "pound", "lb"] },
    ],
  },
  {
    term: "second",
    model: "The SI unit of time, used to define every base unit except the mole.",
    keys: [
      { label: "SI unit of time", any: ["time"] },
      { label: "defines every base unit but the mole", any: ["mole", "define", "every", "other base"] },
    ],
  },
  {
    term: "liter",
    model: "A unit of volume, not an official SI unit: 1 L = 1,000 mL = 1,000 cm³.",
    keys: [
      { label: "a unit of volume", any: ["volume", "liquid", "space", "capacity"] },
      { label: "1 L = 1,000 mL (or 1,000 cm³)", any: ["1000", "1,000", "thousand", "ml", "cm"] },
    ],
  },
  {
    term: "metric prefix",
    model: "Added to the front of a unit to make it larger or smaller, like kilo-, centi- or milli-.",
    keys: [
      { label: "added to a unit", any: ["add", "front", "before", "start", "in front", "beginning", "attach"] },
      { label: "makes it larger or smaller", any: ["larger", "smaller", "bigger", "power", "times", "multipl", "size"] },
      { label: "an example (kilo-, centi-, milli-)", any: ["kilo", "centi", "milli", "mega", "micro"] },
    ],
  },
  {
    term: "unit conversion factor",
    model: "A fraction whose top and bottom are equal amounts — a way of writing 1.",
    keys: [
      { label: "a fraction", any: ["fraction", "ratio", "over", "divid"] },
      { label: "top and bottom are equal amounts", any: ["equal", "same", "equivalent"] },
      { label: "equals 1", any: ["1", "one"] },
    ],
  },
  {
    term: "right rectangular solid",
    model: "A box shape, with volume V = L · W · H.",
    keys: [
      { label: "a box shape", any: ["box", "rectang", "cuboid", "brick", "prism"] },
      { label: "V = L · W · H", any: ["lwh", "l x w", "l*w", "l·w", "length", "width", "height", "l × w"] },
    ],
  },
  {
    term: "right circular cylinder",
    model: "A circular base with straight sides; volume V = πr²h.",
    keys: [
      { label: "a circular base", any: ["circ", "round"] },
      { label: "straight sides", any: ["straight", "side", "tube", "can", "upright"] },
      { label: "V = πr²h", any: ["πr", "pi", "r²", "r2", "r^2", "radius"] },
    ],
  },
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[×·*]/g, "x")
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Does the writing contain this key word? Short ones ("SI", "7", "1") must
 * stand as words of their own — "si" is inside "basic" — longer ones are
 * stems ("combin" finds "combining").
 */
function has(written: string, token: string): boolean {
  const t = norm(token);
  if (t.length > 3) return written.includes(t);
  return new RegExp("(^|[^a-z0-9])" + escape(t) + "($|[^a-z0-9])").test(written);
}

/** Which key words a written definition has. */
export function keysFound(keys: Key[], written: string): boolean[] {
  const w = norm(written);
  return keys.map((k) => k.any.filter((a) => has(w, a)).length >= (k.count ?? 1));
}

/** The facts that tend to show up next to the vocabulary, true or false. */
export const FACTS: { text: string; truth: boolean; why: string }[] = [
  { text: "The U.S., Liberia and Myanmar are the only nations that haven't officially adopted the SI.", truth: true, why: "Those three are the only ones." },
  { text: "Since 2019, all seven base units are defined by physical constants.", truth: true, why: "The last to change was the kilogram, in 2019." },
  { text: "The kilogram is still defined by a metal object kept in a vault in France.", truth: false, why: "It used to be. Since 2019 it's defined by a physical constant, like every other base unit." },
  { text: "The inch has been exactly 2.54 cm since 1959.", truth: true, why: "That's why 2.54 cm = 1 in is exact, not rounded." },
  { text: "Mass and weight are the same thing, and both are measured in kilograms.", truth: false, why: "Mass is measured in kg. Weight is a force, measured in newtons or pounds." },
  { text: "The five base units used in this course are the meter, kilogram, second, ampere and kelvin.", truth: true, why: "Those five. The SI has seven; the other two are the mole and the candela." },
  { text: "The liter is an official SI base unit.", truth: false, why: "The liter is a unit of volume but not an official SI unit. 1 L = 1,000 cm³." },
  { text: "A meter is a few inches shorter than a yard.", truth: false, why: "A meter is a few inches longer than a yard." },
  { text: "A kilogram is about 2.2 lb on Earth.", truth: true, why: "About 2.2 lb." },
  { text: "The second is used to define every base unit except the mole.", truth: true, why: "Every base unit but the mole depends on the second." },
  { text: "The metric system began in England during the Industrial Revolution.", truth: false, why: "It began in France, during the French Revolution, with the meter and the kilogram." },
];
