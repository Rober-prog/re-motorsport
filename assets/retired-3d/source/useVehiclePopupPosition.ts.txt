import { useLayoutEffect, useState, type RefObject } from 'react';
import { nearestEdge, placeVehiclePopup, type ScreenRect } from '../lib/popupPlacement';
import { useVehicleInteraction } from '../components/vehicle/VehicleInteractionProvider';
export function useVehiclePopupPosition(ref: RefObject<HTMLElement | null>) {
  const { selected, geometry } = useVehicleInteraction();
  const [placement, setPlacement] = useState<{
    left: number;
    top: number;
    path: string;
    id: string;
  } | null>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    const stage = element?.closest<HTMLElement>('.vehicle-experience');
    const hero = element?.closest<HTMLElement>('.hero');
    if (!element || !stage || !hero || !selected) return;
    let frame = 0;
    let last = 0;
    const update = (time: number) => {
      if (window.innerWidth > 639 && time - last > 45) {
        last = time;
        const hotspot = stage.querySelector<HTMLElement>(
          `[data-hotspot="${selected}"] .hotspot-dot`,
        );
        const canvas = stage.querySelector('canvas');
        const bounds = hero.getBoundingClientRect();
        const origin = stage.getBoundingClientRect();
        const dot = hotspot?.getBoundingClientRect();
        const anchor = dot
          ? { x: dot.left + dot.width / 2, y: dot.top + dot.height / 2 }
          : { x: bounds.left + bounds.width * 0.65, y: bounds.top + bounds.height * 0.55 };
        const projected = geometry.current.car;
        const canvasBounds = canvas?.getBoundingClientRect() || origin;
        const car: ScreenRect = projected
          ? {
              left: canvasBounds.left + projected.left * canvasBounds.width - 16,
              top: canvasBounds.top + projected.top * canvasBounds.height - 12,
              width: projected.width * canvasBounds.width + 32,
              height: projected.height * canvasBounds.height + 24,
            }
          : {
              left: bounds.left + bounds.width * 0.18,
              top: bounds.top + bounds.height * 0.4,
              width: bounds.width * 0.64,
              height: bounds.height * 0.35,
            };
        const copy = hero.querySelector<HTMLElement>('.hero-copy');
        const lastCopy = copy?.querySelector<HTMLElement>('.hero-actions');
        const copyBox = copy?.getBoundingClientRect();
        const copyBottom = lastCopy?.getBoundingClientRect();
        let textRight = copyBox?.left || 0;
        if (copy) {
          const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            range.selectNodeContents(walker.currentNode);
            for (const rect of range.getClientRects()) textRight = Math.max(textRight, rect.right);
          }
        }
        const avoid =
          copyBox && copyBottom
            ? {
                left: copyBox.left,
                top: copyBox.top,
                width: textRight - copyBox.left + 12,
                height: copyBottom.bottom - copyBox.top,
              }
            : undefined;
        const box = placeVehiclePopup(
          anchor,
          { width: element.offsetWidth, height: element.offsetHeight },
          {
            left: bounds.left + 20,
            top: Math.max(bounds.top + 18, 12),
            width: bounds.width - 40,
            height: bounds.height - 60,
          },
          car,
          avoid,
        );
        const edge = nearestEdge(anchor, box);
        const x1 = anchor.x - origin.left,
          y1 = anchor.y - origin.top,
          x2 = edge.x - origin.left,
          y2 = edge.y - origin.top;
        const next = {
          left: Math.round(box.left - origin.left),
          top: Math.round(box.top - origin.top),
          path: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
          id: selected,
        };
        setPlacement((previous) =>
          previous?.left === next.left &&
          previous?.top === next.top &&
          previous?.path === next.path &&
          previous?.id === next.id
            ? previous
            : next,
        );
      }
      frame = window.requestAnimationFrame(update);
    };
    update(100);
    return () => window.cancelAnimationFrame(frame);
  }, [selected, geometry, ref]);
  return placement?.id === selected ? placement : null;
}
