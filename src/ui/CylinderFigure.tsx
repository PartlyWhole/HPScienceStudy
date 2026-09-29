// A close-up of a graduated cylinder, drawn to its numbers: a line every
// `line` mL, a number every `label` mL, and water whose curve bottoms out at
// the level — with the edges climbing the glass, as real water does.
import React from "react";
import type { Cylinder } from "../content/types";

const TOP = 16, BOTTOM = 296, LEFT = 58, RIGHT = 122, W = 150;

export function CylinderFigure(props: { cylinder: Cylinder }) {
  const c = props.cylinder;
  const span = c.to - c.from;
  const y = (v: number) => BOTTOM - ((v - c.from) / span) * (BOTTOM - TOP);
  const perLine = ((BOTTOM - TOP) * c.line) / span;
  const lines = Math.round(span / c.line);
  const ticks = Array.from({ length: lines + 1 }, (_, k) => Number((c.from + k * c.line).toFixed(4)));
  const isLabel = (v: number) => Math.abs(v / c.label - Math.round(v / c.label)) < 1e-6;

  const yL = y(c.level);
  const yE = yL - Math.min(0.8 * perLine, 12);
  const mid = (LEFT + RIGHT) / 2;
  const surface = `M ${LEFT} ${yE} Q ${mid} ${2 * yL - yE} ${RIGHT} ${yE}`;

  return (
    <figure className="cylinder">
      <svg viewBox={`0 0 ${W} ${BOTTOM + 8}`} role="img" aria-label={c.caption ?? "Graduated cylinder"}>
        <path className="cyl-water" d={`${surface} L ${RIGHT} ${BOTTOM} L ${LEFT} ${BOTTOM} Z`} />
        <path className="cyl-meniscus" d={surface} />
        {c.object && <rect className="cyl-object" x={mid - 16} y={BOTTOM - 44} width={32} height={30} rx={6} />}
        {ticks.map((v) => (
          <g key={v}>
            <line className={isLabel(v) ? "cyl-tick major" : "cyl-tick"} x1={LEFT} x2={LEFT + (isLabel(v) ? 26 : 13)} y1={y(v)} y2={y(v)} />
            {isLabel(v) && (
              <text className="cyl-label" x={LEFT - 7} y={y(v) + 4.5} textAnchor="end">
                {v}
              </text>
            )}
          </g>
        ))}
        {/* The glass: open at the top and bottom of the close-up. */}
        <line className="cyl-glass" x1={LEFT} x2={LEFT} y1={TOP - 12} y2={BOTTOM + 8} />
        <line className="cyl-glass" x1={RIGHT} x2={RIGHT} y1={TOP - 12} y2={BOTTOM + 8} />
        <text className="cyl-unit" x={RIGHT + 6} y={TOP + 4}>mL</text>
      </svg>
      {c.caption && <figcaption>{c.caption}</figcaption>}
    </figure>
  );
}
