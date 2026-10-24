# RE-Motorsport

Adaptación local de la copia independiente `re-motorsport`. React, TypeScript y Vite. Español por defecto y catalán con selector ES/CA. Catálogo orientativo, tiendas y consultas por teléfono. No hay stock ni precios simulados.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

En PowerShell con scripts restringidos, usar `npm.cmd`. Desarrollo: http://127.0.0.1:5173. Tras compilar, `npm run preview` sirve http://127.0.0.1:4173. Las pruebas de navegador requieren Chrome local.

La portada utiliza dos imágenes estáticas generadas de un Nissan GT-R R35 con pinzas rojas en un taller ilustrativo. El encuadre móvil conserva el coche completo. No hay canvas, WebGL, controles, hotspots ni descargas de modelos. El HTML y el catálogo funcionan sin JavaScript.

## Editar

| Archivo | Responsabilidad |
| --- | --- |
| `src/config/brand.json` | Nombre, logo aportado, colores extraídos, tiendas, horarios, estados de validación y canales |
| `src/config/brand.ts` | Visibilidad de tiendas, mapas y dominio configurable |
| `src/data/categories.ts` | Ocho familias editoriales, sin inventario real |
| `scripts/prepare-static-hero.mjs` | Exportaciones optimizadas de los maestros de escritorio y móvil |
| `src/locales/resources.ts` | Textos españoles; alias de idiomas antiguos |
| `src/components/forms/ContactForm.tsx` | Preparación de consulta y llamada a la tienda |
| `scripts/prerender.mjs` | HTML, schema de dos tiendas corroboradas, robots y sitemap |

Después de cambiar la paleta, ejecutar `node scripts/prepare-re-brand.mjs` para regenerar CSS, PNG del logo restaurado, favicon y social preview. `node scripts/adapt-category-images.mjs` adapta las cinco composiciones ilustrativas desde sus originales archivados. El original aportado está en assets/brand/re-motorsport/logo-original.jpeg; el maestro reconstruido con la herramienta de imagen y el prompt se conservan junto al informe. Las exportaciones de 4096 px son derivados raster, sin pretensión de vectorización exacta.

`VITE_SITE_URL` debe quedar vacío hasta aprobar el dominio. Sin él se omite el canónico, se genera sitemap vacío y se bloquea la indexación. Las rutas sin prefijo muestran español, /ca/... muestra catalán y /es/... se conserva como alias español. El selector mantiene página, parámetros y ancla.

El formulario permite preparar datos sin enviarlos ni persistirlos. La llamada telefónica es el canal operativo. El backend original se conserva protegido: necesita aprobación central de privacidad/envío y configuración de proveedor, origen, D1 y salt. No se habilita con una variable de frontend únicamente.

## Restauración y publicación

Punto de partida: commit `e4bca60`, conservado en el historial. Rama de trabajo y publicación: `re-motorsport-local`. Los originales están en `assets/brand/originals`, `assets/legacy-public` y `assets/retired-3d`; los modelos y componentes antiguos no forman parte del sitio ni del build. El proyecto original de Recanvis Martorell conserva su repositorio independiente.

GitHub Pages se publica mediante `.github/workflows/pages.yml` desde la rama `re-motorsport-local`. El flujo ejecuta las pruebas, compila con la ruta base `/re-motorsport/` obtenida de Pages y publica únicamente `dist`. En Settings → Pages debe seleccionarse GitHub Actions como origen. Las imágenes actuales son composiciones ilustrativas generadas para este proyecto. El material del antiguo visor está archivado y no se sirve.

Consultar [auditoría de marca](BRAND_AUDIT.md), [informe de migración](MIGRATION_REPORT.md) y [datos pendientes](PENDIENTE_CLIENTE.md). Los documentos, scripts y capturas anteriores en `docs` son históricos y pueden describir la marca original; no son instrucciones vigentes para publicar esta copia. Las pruebas anteriores están archivadas en `docs/legacy-tests`.
