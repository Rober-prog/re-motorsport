import { describe, expect, it } from 'vitest';
import { nearestEdge, overlapArea, placeVehiclePopup } from '../lib/popupPlacement';

describe('Tarjetas alrededor del vehículo', () => {
  const viewport = { left: 20, top: 100, width: 1400, height: 860 };
  const car = { left: 190, top: 365, width: 950, height: 355 };
  const copy = { left: 80, top: 130, width: 635, height: 300 };
  const size = { width: 300, height: 207 };
  it('motor usa el hueco superior sin tapar el coche ni el titular', () => {
    const box = placeVehiclePopup({ x: 875, y: 395 }, size, viewport, car, copy);
    expect(overlapArea(box, car)).toBe(0);
    expect(overlapArea(box, copy)).toBe(0);
    expect(box.top + box.height).toBeLessThan(car.top);
  });
  it('ruedas usa el hueco inferior cerca de su punto', () => {
    const anchor = { x: 494, y: 670 };
    const box = placeVehiclePopup(anchor, size, viewport, car, copy);
    expect(overlapArea(box, car)).toBe(0);
    expect(box.top).toBeGreaterThan(car.top + car.height);
    const edge = nearestEdge(anchor, box);
    expect(Math.hypot(edge.x - anchor.x, edge.y - anchor.y)).toBeLessThan(100);
  });
  it('mantiene la tarjeta dentro de la pantalla al estrecharse', () => {
    const viewport = { left: 20, top: 90, width: 728, height: 700 };
    const box = placeVehiclePopup({ x: 710, y: 400 }, size, viewport, car, copy);
    expect(box.left).toBeGreaterThanOrEqual(viewport.left);
    expect(box.top).toBeGreaterThanOrEqual(viewport.top);
    expect(box.left + box.width).toBeLessThanOrEqual(viewport.left + viewport.width);
    expect(box.top + box.height).toBeLessThanOrEqual(viewport.top + viewport.height);
  });
  it('conecta al borde próximo, incluso si el punto cae dentro', () => {
    const box = { left: 100, top: 100, width: 200, height: 100 };
    expect(nearestEdge({ x: 50, y: 130 }, box)).toEqual({ x: 100, y: 130 });
    expect(nearestEdge({ x: 110, y: 150 }, box)).toEqual({ x: 100, y: 150 });
  });
});
