/* eslint-disable no-unused-vars */
import React from "react";
import { useDwellActivate } from "../hooks/useDwellActivate";

export function DwellPressable({
  as: Comp = "button",
  onActivate,
  dwellMs = 1200,
  className = "",
  style,
  children,
  role,
  tabIndex,
  ...rest
}) {
  const dwell = useDwellActivate(onActivate, dwellMs);
  const ringStyle = { "--deg": `${dwell.progress * 360}deg` };

  return (
    <Comp
      {...rest}
      style={style}
      className={`dwell-pressable ${className}`}
      role={role}
      tabIndex={tabIndex}
      onPointerEnter={dwell.onPointerEnter}
      onPointerLeave={dwell.onPointerLeave}
      onClick={dwell.onClick}
    >
      {children}
      {dwell.dwelling && <span className="dwell-ring" style={ringStyle} />}
    </Comp>
  );
}
