import catalan from './categories.ca.json';
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
const definitions = [
  [
    'mecanica',
    'Motor y distribución',
    'Correas, cadenas, bombas y juntas. Prepara tu consulta con los datos de tu motor.',
    ['Correas', 'Cadenas', 'Bombas', 'Juntas'],
    'engine',
    'mechanics',
    'mecanica',
  ],
  [
    'frenos',
    'Frenos',
    'Consulta la compatibilidad de los componentes de frenado de tu vehículo.',
    ['Discos', 'Pastillas', 'Pinzas', 'Líquido de frenos'],
    'disc',
    'mechanics',
    'frenos',
  ],
  [
    'suspension',
    'Suspensión y dirección',
    'Amortiguadores y componentes de dirección. Cada vehículo necesita la pieza adecuada.',
    ['Amortiguadores', 'Muelles', 'Brazos', 'Rótulas'],
    'spring',
    'mechanics',
    'suspension',
  ],
  [
    'filtros',
    'Filtros y mantenimiento',
    'Describe qué necesitas para el mantenimiento de tu coche.',
    ['Filtros de aceite', 'Filtros de aire', 'Filtros de habitáculo', 'Lubricantes'],
    'engine',
    'maintenance',
    'filtros',
  ],
  [
    'sistema-electrico',
    'Baterías y sistema eléctrico',
    'Consulta por la batería y los componentes eléctricos de tu vehículo.',
    ['Baterías', 'Alternadores', 'Arranque', 'Sensores'],
    'battery',
    'maintenance',
    'sistema-electrico',
  ],
  [
    'iluminacion',
    'Iluminación',
    'Consulta faros, bombillas y pilotos compatibles con tu vehículo.',
    ['Faros', 'Bombillas', 'Pilotos'],
    'light',
    'equipment',
    'iluminacion',
  ],
  [
    'neumaticos-llantas',
    'Neumáticos y llantas',
    'Consulta neumáticos, llantas y accesorios compatibles con tu vehículo.',
    ['Neumáticos', 'Llantas', 'Válvulas', 'Accesorios de rueda'],
    'wheel',
    'equipment',
    'neumaticos-llantas',
  ],
  [
    'transmision',
    'Transmisión y embrague',
    'Identifica los componentes de transmisión que buscas.',
    ['Kits de embrague', 'Palieres', 'Juntas'],
    'engine',
    'mechanics',
    'transmision',
  ],
] as const;
export const categories: Category[] = definitions.map(
  ([id, name, description, families, icon, group, image], i) => ({
    id,
    slug: id,
    name: { es: name, ca: catalan[id].name },
    description: { es: description, ca: catalan[id].description },
    families: { es: [...families], ca: catalan[id].families },
    icon,
    group,
    image: image ? '/images/categories/' + image + '-rojo.webp' : undefined,
    active: true,
    order: i + 1,
    publication: 'provisional',
  }),
);
export const activeCategories = () =>
  categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
export function filterCategories(query: string, group: string, locale: Locale = 'es') {
  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const term = normalize(query.trim());
  return activeCategories().filter(
    (c) =>
      (group === 'all' || c.group === group) &&
      normalize([c.name[locale], ...c.families[locale]].join(' ')).includes(term),
  );
}
