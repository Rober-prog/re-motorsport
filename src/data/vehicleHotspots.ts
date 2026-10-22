import { categories, type Locale } from './categories';
export type VectorTuple = [number, number, number];
export interface VehicleHotspotConfig {
  id: string;
  categoryId: string;
  active: boolean;
  meshName?: string;
  /** Fractional bounding-box coordinates: x front(-) / rear(+), y ground(0) / roof(1), z side. */
  anchor: VectorTuple;
  /** Offset in normalized scene units, applied after mesh-center resolution. */
  offset: VectorTuple;
  visualOffset: [number, number];
  icon: string;
  destination: string;
  ctaKey: string;
  translations: Record<Locale, { name: string; description: string }>;
  showOnVehicle: boolean;
  occlude: boolean;
  approximate: boolean;
  camera?: { position: VectorTuple; target: VectorTuple };
}
const point = (
  id: string,
  anchor: VectorTuple,
  options: Partial<VehicleHotspotConfig> = {},
): VehicleHotspotConfig => {
  const category = categories.find((c) => c.id === id)!;
  return {
    id,
    categoryId: id,
    active: true,
    anchor,
    offset: [0, 0, 0],
    visualOffset: [0, 0],
    icon: category.icon,
    destination: `/contacto?categoria=${id}`,
    ctaKey: 'common.inquire',
    translations: {
      es: { name: category.name.es, description: category.description.es },
      ca: { name: category.name.ca, description: category.description.ca },
    },
    showOnVehicle: true,
    occlude: false,
    approximate: true,
    ...options,
  };
};
// Mesh names below were read from docs/model-inventory.json, never inferred.
// Internal systems use schematic anchors. They do not assert an exact component location.
export const vehicleHotspots: VehicleHotspotConfig[] = [
  point('ruedas-neumaticos', [-0.25, 0.28, 0.46], {
    meshName: 'WHL_FL_Tire.001',
    offset: [-0.18, -0.13, 0.18],
    icon: 'wheel',
    occlude: true,
    approximate: false,
  }),
  point('frenos', [-0.25, 0.35, 0.46], {
    meshName: 'WHL_RL_BrakeDisc',
    offset: [0, 0.08, 0.25],
    icon: 'disc',
    occlude: true,
    approximate: false,
  }),
  point('motor', [0.23, 0.8, 0.05], { icon: 'engine', offset: [0, 0.12, 0] }),
  point('iluminacion', [-0.4, 0.47, 0.39], {
    meshName: 'LGT_F_DaylightLedON_02',
    offset: [-0.12, 0.08, 0.12],
    icon: 'light',
    occlude: true,
    approximate: false,
  }),
  point('carroceria', [-0.46, 0.28, 0.1], {
    offset: [0, 0, 0.12],
    icon: 'car',
    showOnVehicle: false,
  }),
  point('retrovisores-accesorios', [-0.11, 0.73, 0.48], {
    meshName: 'DOOR_L_Mirror_02',
    offset: [0, 0.08, 0.08],
    icon: 'mirror',
    occlude: true,
    approximate: false,
  }),
  point('suspension', [0.29, 0.32, 0.43], { icon: 'spring', showOnVehicle: false }),
  point('sistema-electrico', [-0.23, 0.58, -0.12], { icon: 'battery', showOnVehicle: false }),
  point('climatizacion', [-0.08, 0.62, 0.28], { icon: 'climate', showOnVehicle: false }),
  point('interior', [0.02, 0.9, 0.23], { icon: 'seat' }),
  point('escape', [0.49, 0.65, 0.1], {
    meshName: 'EXT_ExhaustBlackMatt_01',
    offset: [0.09, 0.02, 0.12],
    icon: 'exhaust',
    showOnVehicle: false,
    approximate: false,
  }),
];
