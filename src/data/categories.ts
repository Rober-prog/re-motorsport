export type Locale = 'es' | 'ca';
export type Localized = Record<Locale, string>;
export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  families: Record<Locale, string[]>;
  icon: string;
  image?: string;
  group: 'maintenance' | 'mechanics' | 'equipment';
  active: boolean;
  order: number;
  publication: 'provisional' | 'confirmed';
}
const entry = (
  id: string,
  es: string,
  ca: string,
  descriptionEs: string,
  descriptionCa: string,
  familiesEs: string[],
  familiesCa: string[],
  icon: string,
  group: Category['group'],
  order: number,
  image?: string,
): Category => ({
  id,
  slug: id,
  name: { es, ca },
  description: { es: descriptionEs, ca: descriptionCa },
  families: { es: familiesEs, ca: familiesCa },
  icon,
  group,
  active: true,
  order,
  publication: 'provisional',
  image,
});
export const categories: Category[] = [
  entry(
    'mecanica',
    'Mecánica',
    'Mecànica',
    'Componentes para el motor, la distribución y la refrigeración. Cuéntanos qué necesita tu vehículo.',
    'Components per al motor, la distribució i la refrigeració. Explica’ns què necessita el teu vehicle.',
    ['Motor', 'Distribución', 'Refrigeración'],
    ['Motor', 'Distribució', 'Refrigeració'],
    'engine',
    'mechanics',
    1,
    '/images/categories/mecanica.webp',
  ),
  entry(
    'frenos',
    'Frenos',
    'Frens',
    'Cada detalle cuenta cuando se trata de frenar. Consulta por el sistema de frenado de tu vehículo.',
    'Cada detall compta quan es tracta de frenar. Consulta pel sistema de frenada del teu vehicle.',
    ['Discos', 'Pastillas', 'Líquido de frenos'],
    ['Discos', 'Pastilles', 'Líquid de frens'],
    'disc',
    'mechanics',
    2,
    '/images/categories/frenos.webp',
  ),
  entry(
    'motor',
    'Motor',
    'Motor',
    'Encuentra el punto de partida para tu próxima reparación. Envíanos los datos de tu motor.',
    'Troba el punt de partida per a la teva propera reparació. Envia’ns les dades del teu motor.',
    ['Filtros', 'Lubricación', 'Distribución'],
    ['Filtres', 'Lubricació', 'Distribució'],
    'engine',
    'mechanics',
    7,
  ),
  entry(
    'neumaticos',
    'Neumáticos',
    'Pneumàtics',
    'Neumáticos, llantas y accesorios de rueda. Cuéntanos las medidas y las necesidades de tu vehículo.',
    'Pneumàtics, llandes i accessoris de roda. Explica’ns les mides i les necessitats del teu vehicle.',
    ['Neumáticos', 'Llantas', 'Accesorios de rueda'],
    ['Pneumàtics', 'Llandes', 'Accessoris de roda'],
    'wheel',
    'maintenance',
    4,
    '/images/categories/neumaticos.webp',
  ),
  entry(
    'carroceria',
    'Carrocería',
    'Carrosseria',
    'Los detalles que dan forma a tu vehículo. Consulta por la pieza que buscas.',
    'Els detalls que donen forma al teu vehicle. Consulta per la peça que busques.',
    ['Paneles', 'Paragolpes', 'Molduras'],
    ['Panells', 'Para-xocs', 'Motllures'],
    'car',
    'equipment',
    8,
  ),
  entry(
    'retrovisores-accesorios',
    'Retrovisores y accesorios',
    'Retrovisors i accessoris',
    'Visibilidad y detalles prácticos para tu día a día al volante.',
    'Visibilitat i detalls pràctics per al teu dia a dia al volant.',
    ['Retrovisores', 'Cristales', 'Accesorios'],
    ['Retrovisors', 'Vidres', 'Accessoris'],
    'mirror',
    'equipment',
    6,
  ),
  entry(
    'suspension',
    'Suspensión',
    'Suspensió',
    'Estabilidad, control y confort. Identifica con nosotros la pieza que necesitas.',
    'Estabilitat, control i confort. Identifica amb nosaltres la peça que necessites.',
    ['Amortiguadores', 'Muelles', 'Brazos'],
    ['Amortidors', 'Molles', 'Braços'],
    'spring',
    'mechanics',
    3,
    '/images/categories/suspension.webp',
  ),
  entry(
    'sistema-electrico',
    'Batería - Sistema Eléctrico',
    'Bateria - Sistema Elèctric',
    'La energía detrás de cada trayecto. Consulta por los componentes eléctricos.',
    'L’energia darrere de cada trajecte. Consulta pels components elèctrics.',
    ['Baterías', 'Alternadores', 'Arranque'],
    ['Bateries', 'Alternadors', 'Arrencada'],
    'battery',
    'maintenance',
    5,
    '/images/categories/sistema-electrico.webp',
  ),
  entry(
    'climatizacion',
    'Climatización',
    'Climatització',
    'Confort en cada estación. Cuéntanos qué componente de climatización buscas.',
    'Confort en cada estació. Explica’ns quin component de climatització busques.',
    ['Filtros de habitáculo', 'Compresores', 'Ventilación'],
    ['Filtres d’habitacle', 'Compressors', 'Ventilació'],
    'climate',
    'maintenance',
    9,
  ),
  entry(
    'interior',
    'Interior',
    'Interior',
    'Todo comienza en el habitáculo. Consulta por elementos y accesorios de interior.',
    'Tot comença a l’habitacle. Consulta per elements i accessoris d’interior.',
    ['Alfombrillas', 'Mandos', 'Accesorios de habitáculo'],
    ['Catifes', 'Comandaments', 'Accessoris d’habitacle'],
    'seat',
    'equipment',
    10,
  ),
  entry(
    'escape',
    'Escape',
    'Escapament',
    'Consulta por los componentes del sistema de escape de tu vehículo.',
    'Consulta pels components del sistema d’escapament del teu vehicle.',
    ['Silenciadores', 'Tubos', 'Elementos de fijación'],
    ['Silenciadors', 'Tubs', 'Elements de fixació'],
    'exhaust',
    'mechanics',
    11,
  ),
];
export const activeCategories = () =>
  categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
export function filterCategories(query: string, group: string) {
  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const term = normalize(query.trim());
  return activeCategories().filter(
    (c) =>
      (group === 'all' || c.group === group) &&
      normalize([...Object.values(c.name), ...Object.values(c.families).flat()].join(' ')).includes(
        term,
      ),
  );
}
