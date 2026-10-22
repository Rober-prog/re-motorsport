# Recanvis Martorell

Web corporativa bilingüe ES/CA con catálogo informativo, explorador 3D y consultas comerciales. Desarrollo local; **no se ha publicado ni se ha modificado ningún DNS**.

La portada incorpora ahora un fondo de garaje generado, un encuadre más centrado y tarjetas próximas a sus puntos. [Cambios, capturas y procedencia del fondo](docs/visual-refresh.md).

Se han integrado los dos logotipos aportados, dando protagonismo al emblema del coche en la portada, la cabecera, el pie y el favicon. [Archivos y uso de la marca](docs/brand.md).

## Ejecutar

Para subir el proyecto y revisarlo desde el móvil: [guía de GitHub Pages](docs/github-pages.md). El despliegue automático está en `.github/workflows/pages.yml`.

Requisitos: Node **22.16 o posterior compatible** (recomendado Node 24 LTS), npm y Chrome para las pruebas de navegador.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173. En PowerShell con ejecución de scripts restringida, usar `npm.cmd` en lugar de `npm`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
npm run test:e2e
```

La previsualización estática se abre en http://127.0.0.1:4173 y sirve el HTML de cada ruta, sus cabeceras y el 404. Para ejecutar también Pages Functions, usar `npm run dev:cloudflare` después del build. El servidor estático devuelve 503 en `/api/*`; no simula envíos.

## Implementado

- React, TypeScript estricto, Vite, Tailwind 4 y tokens centralizados.
- Todas las páginas solicitadas, 11 categorías y fichas de familias orientativas.
- Búsqueda sin acentos, filtros, estado vacío y consulta con categoría preseleccionada.
- Español y catalán con URLs estables: `/...` y `/ca/...`, cambio de idioma que conserva ruta y consulta.
- 42 páginas HTML prerenderizadas, además de 404. Contenido comercial accesible sin JavaScript.
- Titles, descripciones, canonical, hreflang, Open Graph, Twitter Cards, sitemap, robots y datos estructurados mínimos sin dirección inventada.
- Hero con el Lamborghini suministrado, cámara calculada desde Box3, entorno de iluminación local, materiales PBR y entrada GSAP.
- Rotación completa de 360° con arrastre de ratón y botones de giro en ambos sentidos, accesibles por teclado y tacto; restablecimiento, calidad seleccionable y render bajo demanda.
- Manifiesto de 11 hotspots; se muestran seis puntos exteriores/esquemáticos para reducir solapamientos y cinco en móvil. Selector textual de las 11 categorías, catálogo y popups con CTA.
- Etiquetas visibles al pasar sobre el punto o enfocarlo con teclado. Ficha mediante clic, Enter o toque; Escape y devolución del foco. Tarjeta adaptada a móvil.
- Detección WebGL, carga diferida, progreso, boundary de errores e imagen estática del mismo modelo.
- En móvil o ahorro de datos, el 3D se activa de forma explícita desde su botón. En escritorio se carga al entrar en la zona visible.
- Formularios general, recambio, profesional y clásico con React Hook Form y Zod; validación compartida con servidor.
- Función de correo Resend configurable, honeypot, control de origen, cuerpo limitado y contador atómico D1.
- Skip link, menús y diálogos nativos, foco visible, avisos anunciables, reducción de movimiento y fuentes locales OFL.

## Modelo y licencia

Original conservado: `public/models/Lamborghini+Temerario.glb` (41.118.748 bytes).

Versión web: `public/models/lamborghini-temerario.web.glb` (10.288.880 bytes, **75,0 % menos**). Mantiene 827 nodos y 782 mallas. Texturas WebP de hasta 1024 px, simplificación conservadora y Meshopt. El build excluye el original y la referencia visual de `dist`.

La pintura principal original carece de parámetros PBR; se completa en ejecución con un acabado grafito. No se modifica el original. La referencia visual se interpreta con diseño e iluminación propios, sin colocarla como fondo de página.

**No se ha aportado licencia comercial del GLB o sus texturas. La publicación del modelo y sus capturas está bloqueada hasta verificarla.** No se afirma relación comercial con Lamborghini ni con marcas de la imagen de referencia.

Informes: [inspección](docs/model-inspection.md), [rendimiento](docs/3d-performance.md), [inventario completo](docs/model-inventory.json), [métricas web](docs/web-model-metrics.json).

## Editar contenido

| Archivo                       | Responsabilidad                                                         |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/data/categories.ts`      | Nombres, descripciones, familias, filtros, orden y estado de categorías |
| `src/data/vehicleHotspots.ts` | Anclajes, nodos observados, offsets, visibilidad y destinos             |
| `src/locales/resources.ts`    | Traducciones de navegación, páginas, formularios y mensajes             |
| `src/components/vehicle/`     | Escena, vehículo, cámara, luces, selección, controles y fallback        |
| `src/pages/`                  | Páginas corporativas y catálogo                                         |
| `src/styles/`                 | Tokens, diseño responsive y contraste                                   |
| `src/lib/contactSchema.ts`    | Validación compartida                                                   |
| `functions/api/contact.ts`    | Envío y protección del endpoint                                         |
| `scripts/prerender.mjs`       | Generación HTML, sitemap y CSP de JSON-LD                               |

No hay CMS, carrito, pagos, productos con stock ficticio ni integraciones comerciales innecesarias. Añadir una categoría a `categories.ts` la incorpora al catálogo y al prerenderizado; calibrar su anclaje si se desea mostrarla sobre el vehículo.

## Datos pendientes

Razón social, NIF, forma jurídica, constitución, actividad y dirección publicada están incorporados en ES/CA; también se enlaza la tienda de clásicos. [Datos y fuentes](docs/business-sources.md). Quedan por confirmar la numeración/acceso 4 o 4A, la vigencia registral, teléfono, WhatsApp, correo, horario actuales, historia comercial, instalaciones, fotografías, catálogo real, proveedores, promociones y textos legales definitivos.

El formulario **no envía** hasta completar la configuración de correo, D1, privacidad y `VITE_CONTACT_ENABLED=true`. Los tests del proveedor usan dobles de prueba; no acreditan entrega real de correo.

## Cloudflare Pages

Build: `npm run build`. Directorio de salida: `dist`. La carpeta `functions` se mantiene en la raíz del repositorio, fuera de `dist`. No usar una subida de archivos estáticos que ignore las Functions.

Guía detallada, secretos y conexión futura de `rmartorell.com`: [docs/cloudflare.md](docs/cloudflare.md). Se requiere autorización explícita antes de publicar o modificar DNS.

## Calidad y límites

[docs/qa.md](docs/qa.md) recoge resultados medidos, herramientas y limitaciones. Una auditoría automatizada no certifica por sí sola WCAG ni sustituye pruebas con dispositivos reales y lectores de pantalla. No se afirma una puntuación Lighthouse sin informe generado.

```sh
npm run inspect:model
npm run optimize:model
node scripts/inspect-web-model.mjs
npm run analyze
npm run audit
npm run format:check
```

La optimización es reproducible y escribe un archivo diferente. Las capturas pueden regenerarse con `node scripts/capture-preview.mjs` mientras corre Vite; `BASE_URL` permite usar otro servidor. La vista estática y la imagen social deben regenerarse después de cambiar cámara o materiales. No son fotografías comerciales de productos.

Si la red corporativa usa su propia CA, configurar `NODE_EXTRA_CA_CERTS` con un PEM de confianza y una caché npm escribible. No desactivar la validación TLS. `.cache/` es local e ignorada.

Se ha aplicado la guía local del plugin [Sites](C:/Users/Usuario/.codex/plugins/cache/openai-curated-remote/sites/1.1.0/skills/sites/SKILL.md) al diseño y a la revisión local, manteniendo el stack y el destino de despliegue solicitados.
