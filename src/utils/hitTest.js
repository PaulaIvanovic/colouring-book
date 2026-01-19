function pointInCircle(px, py, c) {
  const dx = px - c.cx;
  const dy = py - c.cy;
  return dx * dx + dy * dy <= c.r * c.r;
}

function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// Ray-casting point-in-polygon
function pointInPolygon(px, py, poly) {
  const pts = poly.points
    .trim()
    .split(/\s+/)
    .map((p) => p.split(",").map(Number));

  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1];
    const xj = pts[j][0], yj = pts[j][1];

    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi + 0.0000001) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

export function hitTestShape(px, py, shape) {
  if (shape.type === "circle") return pointInCircle(px, py, shape);
  if (shape.type === "rect") return pointInRect(px, py, shape);
  if (shape.type === "polygon") return pointInPolygon(px, py, shape);
  return false;
}
