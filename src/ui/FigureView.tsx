// Whatever a question draws: graduated cylinders, or a solid.
import React from "react";
import type { Figure } from "../content/types";
import { CylinderFigure } from "./CylinderFigure";
import { SolidFigure } from "./SolidFigure";

export function FigureView(props: { figure: Figure }) {
  const f = props.figure;
  return (
    <div className="q-figure">
      {f.kind === "cylinders" ? f.cylinders.map((c, i) => <CylinderFigure key={i} cylinder={c} />) : <SolidFigure solid={f.solid} />}
    </div>
  );
}
