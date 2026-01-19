import React, { useMemo } from "react";
import { useDwellActivate } from "../hooks/useDwellActivate";

function getCenter(shape) {
  if (shape.type === "circle") return { cx: shape.cx, cy: shape.cy };
  if (shape.type === "rect") return { cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2 };
  if (shape.type === "polygon") {
    const pts = shape.points
      .trim()
      .split(/\s+/)
      .map((p) => p.split(",").map(Number))
      .filter((a) => a.length === 2 && !Number.isNaN(a[0]) && !Number.isNaN(a[1]));
    if (!pts.length) return { cx: 0, cy: 0 };
    const cx = pts.reduce((s, [x]) => s + x, 0) / pts.length;
    const cy = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
    return { cx, cy };
  }
  return { cx: 0, cy: 0 };
}

function DwellSvgRing({ cx, cy, progress }) {
  const r = 18;
  const C = 2 * Math.PI * r;
  const dashOffset = C * (1 - progress);

  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.55)" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(0,0,0,0.7)"
        strokeWidth="4"
        strokeDasharray={C}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </g>
  );
}

function ShapeEl({ shape, style, onActivate, dwellMs, enableDwell }) {
  const dwell = useDwellActivate(onActivate, dwellMs);
  const { cx, cy } = useMemo(() => getCenter(shape), [shape]);

  const common = enableDwell
    ? {
        role: "button",
        tabIndex: 0,
        onPointerEnter: dwell.onPointerEnter,
        onPointerLeave: dwell.onPointerLeave,
        onClick: (e) => {
            e.stopPropagation();
            dwell.onClick();
        },
      }
    : {};

  const elProps = { style, ...common };

  let shapeEl = null;
  if (shape.type === "circle") shapeEl = <circle {...elProps} cx={shape.cx} cy={shape.cy} r={shape.r} />;
  if (shape.type === "rect") shapeEl = <rect {...elProps} x={shape.x} y={shape.y} width={shape.w} height={shape.h} />;
  if (shape.type === "polygon") shapeEl = <polygon {...elProps} points={shape.points} />;
  if (!shapeEl) return null;

  return (
    <g>
      {shapeEl}
      {enableDwell && dwell.dwelling && <DwellSvgRing cx={cx} cy={cy} progress={dwell.progress} />}
    </g>
  );
}

export function ShapeBoard({
  width,
  height,
  shapes,
  fillById,
  outlineOnly,
  canActivate,
  onActivateShape,
  dwellMs,
}) {
  return (
    <svg className={`layer-stacked ${outlineOnly ? "svg-outline" : "svg-fill"}`} viewBox={`0 0 ${width} ${height}`}>
      {shapes.map((s) => {
        const style = outlineOnly
          ? { fill: "none", stroke: "black", strokeWidth: 8, pointerEvents: "none" }
          : {
              fill: fillById[s.id] || "white",
              stroke: "none",
              cursor: canActivate ? "pointer" : "default",
              pointerEvents: canActivate ? "all" : "none",
            };

        return (
          <ShapeEl
            key={s.id}
            shape={s}
            style={style}
            onActivate={canActivate ? () => onActivateShape(s.id) : undefined}
            dwellMs={dwellMs}
            enableDwell={canActivate}
          />
        );
      })}
    </svg>
  );
}
