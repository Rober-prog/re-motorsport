import {
  BatteryCharging,
  CarFront,
  CircleDot,
  Disc3,
  Fan,
  Gauge,
  Lamp,
  Layers3,
  RectangleEllipsis,
  ScanLine,
  Wrench,
  type LucideProps,
} from 'lucide-react';
const icons = {
  wheel: CircleDot,
  disc: Disc3,
  engine: Gauge,
  light: Lamp,
  car: CarFront,
  mirror: ScanLine,
  spring: Layers3,
  battery: BatteryCharging,
  climate: Fan,
  seat: RectangleEllipsis,
  exhaust: Wrench,
};
export function CategoryIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = icons[name as keyof typeof icons] || Wrench;
  return <Icon {...props} aria-hidden="true" />;
}
