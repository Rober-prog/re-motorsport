export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
export interface ScreenPoint {
  x: number;
  y: number;
}
const right = (r: ScreenRect) => r.left + r.width;
const bottom = (r: ScreenRect) => r.top + r.height;
export function overlapArea(a: ScreenRect, b: ScreenRect) {
  return (
    Math.max(0, Math.min(right(a), right(b)) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(bottom(a), bottom(b)) - Math.max(a.top, b.top))
  );
}
export function nearestEdge(point: ScreenPoint, rect: ScreenRect): ScreenPoint {
  const x = Math.max(rect.left, Math.min(right(rect), point.x));
  const y = Math.max(rect.top, Math.min(bottom(rect), point.y));
  if (x !== point.x || y !== point.y) return { x, y };
  return [
    { x: rect.left, y },
    { x: right(rect), y },
    { x, y: rect.top },
    { x, y: bottom(rect) },
  ].sort(
    (a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y),
  )[0];
}
/** Prefer nearby free space. Penalize covering the vehicle or heading and always stay inside the hero. */
export function placeVehiclePopup(
  anchor: ScreenPoint,
  size: { width: number; height: number },
  viewport: ScreenRect,
  car: ScreenRect,
  copy?: ScreenRect,
) {
  const gap = 20;
  const { width, height } = size;
  const positions = [
    ...(copy ? [{ left: right(copy) + gap, top: car.top - height - gap }] : []),
    { left: anchor.x - width / 2, top: car.top - height - gap },
    { left: anchor.x - width / 2, top: bottom(car) + gap },
    { left: right(car) + gap, top: anchor.y - height / 2 },
    { left: car.left - width - gap, top: anchor.y - height / 2 },
    { left: anchor.x - width / 2, top: anchor.y - height - gap },
    { left: anchor.x - width / 2, top: anchor.y + gap },
    { left: anchor.x + gap, top: anchor.y - height / 2 },
    { left: anchor.x - width - gap, top: anchor.y - height / 2 },
  ];
  const candidates = positions.map((position) => ({
    left: Math.max(viewport.left, Math.min(right(viewport) - width, position.left)),
    top: Math.max(viewport.top, Math.min(bottom(viewport) - height, position.top)),
    width,
    height,
  }));
  const score = (box: ScreenRect) => {
    const edge = nearestEdge(anchor, box);
    const distance = Math.hypot(edge.x - anchor.x, edge.y - anchor.y);
    return (
      overlapArea(box, car) * 0.055 +
      (copy ? overlapArea(box, copy) * 0.1 : 0) +
      distance +
      (anchor.x >= box.left &&
      anchor.x <= right(box) &&
      anchor.y >= box.top &&
      anchor.y <= bottom(box)
        ? 2000
        : 0)
    );
  };
  return candidates.sort((a, b) => score(a) - score(b))[0];
}
