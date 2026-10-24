import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import type { ScreenRect } from '../../lib/popupPlacement';
interface Interaction {
  selected: string | null;
  pinned: boolean;
  select: (id: string, trigger?: HTMLElement) => void;
  hover: (id: string) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  close: () => void;
  rotation: number;
  setRotation: (value: number) => void;
  reset: () => void;
  geometry: RefObject<{ car: ScreenRect | null }>;
}
const VehicleContext = createContext<Interaction | null>(null);
export function VehicleInteractionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [rotation, setRotation] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const origin = useRef<HTMLElement | null>(null);
  const geometry = useRef<{ car: ScreenRect | null }>({ car: null });
  const cancelClose = useCallback(() => {
    clearTimeout(timer.current);
  }, []);
  const close = useCallback(() => {
    cancelClose();
    setSelected(null);
    setPinned(false);
    origin.current?.focus({ preventScroll: true });
    origin.current = null;
  }, [cancelClose]);
  const select = useCallback(
    (id: string, trigger?: HTMLElement) => {
      cancelClose();
      origin.current = trigger || null;
      setSelected(id);
      setPinned(true);
    },
    [cancelClose],
  );
  const hover = useCallback(
    (id: string) => {
      cancelClose();
      if (!pinned) setSelected(id);
    },
    [pinned, cancelClose],
  );
  const scheduleClose = useCallback(() => {
    cancelClose();
    if (!pinned) timer.current = setTimeout(() => setSelected(null), 220);
  }, [cancelClose, pinned]);
  useEffect(() => () => cancelClose(), [cancelClose]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selected) close();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [close, selected]);
  return (
    <VehicleContext.Provider
      value={{
        selected,
        pinned,
        select,
        hover,
        scheduleClose,
        cancelClose,
        close,
        rotation,
        setRotation,
        reset: () => {
          setRotation(0);
          setSelected(null);
          setPinned(false);
        },
        geometry,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}
export function useVehicleInteraction() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('VehicleInteractionProvider missing');
  return ctx;
}
