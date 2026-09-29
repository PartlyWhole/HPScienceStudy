// Boxes, cylinders and L-shaped blocks, drawn roughly to their numbers with
// their measurements written on them.
import React from "react";
import type { Solid } from "../content/types";
import { formatStandard } from "../lib/answer";

const W = 320, H = 220;
const n = (v: number, unit: string) => formatStandard(v) + " " + unit;

export function SolidFigure(props: { solid: Solid }) {
  const s = props.solid;
  return (
    <figure className="solid">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={describe(s)}>
        {s.shape === "box" && <Box s={s} />}
        {s.shape === "cylinder" && <Cyl s={s} />}
        {s.shape === "lshape" && <LShape s={s} />}
      </svg>
    </figure>
  );
}

function describe(s: Solid): string {
  if (s.shape === "box") return `A box ${n(s.l, s.unit)} by ${n(s.w, s.unit)} by ${n(s.h, s.unit)}`;
  if (s.shape === "cylinder") return `A cylinder ${s.d !== undefined ? n(s.d, s.unit) + " across" : "radius " + n(s.r!, s.unit)}, ${n(s.h, s.unit)} tall`;
  return `An L-shaped block, ${n(s.h, s.unit)} tall`;
}

function Box(props: { s: Extract<Solid, { shape: "box" }> }) {
  const { l, w, h } = props.s;
  // Oblique drawing: depth runs up and to the right at half scale.
  const k = Math.min(190 / (l + 0.5 * w * 0.87), 150 / (h + 0.5 * w * 0.5));
  const L = l * k, Hh = h * k, dx = 0.5 * w * k * 0.87, dy = 0.5 * w * k * 0.5;
  const x0 = (W - L - dx) / 2, y0 = (H - Hh - dy) / 2 + dy;
  const labels = props.s.labels ?? [n(l, props.s.unit), n(w, props.s.unit), n(h, props.s.unit)];
  return (
    <g>
      <path className="solid-face side" d={`M ${x0 + L} ${y0} l ${dx} ${-dy} v ${Hh} l ${-dx} ${dy} Z`} />
      <path className="solid-face top" d={`M ${x0} ${y0} l ${dx} ${-dy} h ${L} l ${-dx} ${dy} Z`} />
      <rect className="solid-face front" x={x0} y={y0} width={L} height={Hh} />
      <text className="solid-label" x={x0 + L / 2} y={y0 + Hh + 18} textAnchor="middle">{labels[0]}</text>
      <text className="solid-label" x={x0 + L + dx / 2 + 6} y={y0 + Hh - dy / 2 + 14} textAnchor="start">{labels[1]}</text>
      <text className="solid-label" x={x0 - 8} y={y0 + Hh / 2 + 4} textAnchor="end">{labels[2]}</text>
    </g>
  );
}

function Cyl(props: { s: Extract<Solid, { shape: "cylinder" }> }) {
  const { h } = props.s;
  const d = props.s.d ?? 2 * props.s.r!;
  const k = Math.min(150 / d, 150 / h);
  const R = (d * k) / 2, Hh = h * k, ry = Math.max(8, R * 0.3);
  const cx = W / 2, top = (H - Hh) / 2;
  const across = props.s.labels?.across ?? (props.s.d !== undefined ? "d = " + n(props.s.d, props.s.unit) : "r = " + n(props.s.r!, props.s.unit));
  const height = props.s.labels?.height ?? n(h, props.s.unit);
  return (
    <g>
      <path className="solid-face front" d={`M ${cx - R} ${top} v ${Hh} a ${R} ${ry} 0 0 0 ${2 * R} 0 v ${-Hh}`} />
      <ellipse className="solid-face top" cx={cx} cy={top} rx={R} ry={ry} />
      {props.s.d !== undefined ? (
        <line className="solid-measure" x1={cx - R} y1={top} x2={cx + R} y2={top} />
      ) : (
        <line className="solid-measure" x1={cx} y1={top} x2={cx + R} y2={top} />
      )}
      <circle className="solid-dot" cx={cx} cy={top} r={2.5} />
      <text className="solid-label" x={cx} y={top - ry - 8} textAnchor="middle">{across}</text>
      <line className="solid-measure" x1={cx + R + 14} y1={top} x2={cx + R + 14} y2={top + Hh} />
      <text className="solid-label" x={cx + R + 20} y={top + Hh / 2 + 4}>{height}</text>
    </g>
  );
}

/** The L-shaped block from above: its base split into two rectangles, and its height. */
function LShape(props: { s: Extract<Solid, { shape: "lshape" }> }) {
  const { a, b, c, d, h, unit } = props.s;
  const k = Math.min(200 / a, 150 / (b + d));
  const x0 = (W - a * k) / 2, y0 = (H - (b + d) * k) / 2 - 6;
  const A = a * k, B = b * k, C = c * k, D = d * k;
  return (
    <g>
      <path className="solid-face top" d={`M ${x0} ${y0} h ${A} v ${B} h ${-(A - C)} v ${D} h ${-C} Z`} />
      <line className="solid-split" x1={x0} y1={y0 + B} x2={x0 + C} y2={y0 + B} />
      <text className="solid-label" x={x0 + A / 2} y={y0 - 8} textAnchor="middle">{n(a, unit)}</text>
      <text className="solid-label" x={x0 + A + 6} y={y0 + B / 2 + 4}>{n(b, unit)}</text>
      <text className="solid-label" x={x0 + C / 2} y={y0 + B + D + 16} textAnchor="middle">{n(c, unit)}</text>
      <text className="solid-label" x={x0 - 6} y={y0 + B + D / 2 + 4} textAnchor="end">{n(d, unit)}</text>
      <text className="solid-note" x={W / 2 + C / 2} y={H - 6} textAnchor="middle">Seen from above · {n(h, unit)} tall</text>
    </g>
  );
}
