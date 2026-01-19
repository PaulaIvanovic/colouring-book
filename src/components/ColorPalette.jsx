import React from "react";
import { DwellPressable } from "./DwellPressable";

export function ColorPalette({ colors, selected, onSelect, dwellMs }) {
  return (
    <div className="colors">
      {colors.map((c) => (
        <DwellPressable
          key={c}
          as="div"
          className="color-box"
          role="button"
          tabIndex={0}
          dwellMs={dwellMs}
          onActivate={() => onSelect(c)}
          style={{
            backgroundColor: c,
            border: selected === c ? "5px solid black" : "2px solid rgba(0,0,0,0.25)",
          }}
          title={c}
        />
      ))}
    </div>
  );
}
