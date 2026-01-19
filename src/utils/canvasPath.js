export function applyClipPath(ctx, shape) {
  ctx.beginPath();

  if (shape.type === "circle") {
    ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
  } else if (shape.type === "rect") {
    ctx.rect(shape.x, shape.y, shape.w, shape.h);
  } else if (shape.type === "polygon") {
    const pts = shape.points.trim().split(/\s+/).map(p => p.split(",").map(Number));
    if (pts.length) {
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
    }
  }
  ctx.clip();
}
