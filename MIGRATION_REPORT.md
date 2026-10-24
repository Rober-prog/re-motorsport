# Migración local a RE-Motorsport

## Categoría 08 y catálogo de ocho categorías

Creada e integrada la fotografía de «Transmisión y embrague» mediante la herramienta integrada de imagen, tomando filtros como referencia de estilo. Embrague, cojinete y palier sobre banco metálico con detalles rojos #F80303. Maestro en `assets/categories-generated/transmision-master.png`, imagen WebP 960 × 640 de 159.924 bytes en `public/images/categories/transmision-rojo.webp` y prompt en `docs/category-08-prompt.txt`.

Eliminada la categoría 09 «Escape y emisiones» de los datos y traducciones. El catálogo, filtros y formularios usan las ocho categorías restantes. Las antiguas rutas `/catalogo/escape` y sus variantes de idioma devuelven 404. Build correcto con 57 rutas prerenderizadas; 20 pruebas unitarias y dos comprobaciones de navegador existentes superadas. Verificados ocho elementos, nueva imagen y ficha, ausencia de la categoría retirada y navegación en español/catalán a 390 y 1440 px.

## Categoría 07 · Neumáticos y llantas

Renombrada por petición del usuario; versión catalana «Pneumàtics i llandes». Actualizados identificador, ruta `/catalogo/neumaticos-llantas`, familias, descripción e icono. Nueva fotografía generada con la herramienta integrada de imagen, usando frenos y filtros como referencias de estilo: neumáticos y llantas sobre banco metálico, taller y detalles rojos #F80303.

Maestro en `assets/categories-generated/neumaticos-llantas-master.png`, WebP de 960 × 640 (141.686 bytes) en `public/images/categories/neumaticos-llantas-rojo.webp`, prompt en `docs/category-07-prompt.txt`. Integrada en catálogo y ficha en ambos idiomas. Verificados build, las 60 rutas prerenderizadas y navegación e imagen en español y catalán a 390 y 1440 px.

## Foto de la categoría 04 · Filtros y mantenimiento

Creada con la herramienta integrada de imagen a partir de las fotografías de mecánica y sistema eléctrico como referencias de estilo. Composición de filtros de aire, habitáculo, aceite y combustible, lubricantes sin marcas y pequeños elementos de mantenimiento sobre un banco metálico en taller con detalles rojos #F80303. Imagen ilustrativa, sin afirmación de existencias ni instalaciones reales.

Maestro preservado en `assets/categories-generated/filtros-master.png`; exportación WebP de 960 × 640 y 145.842 bytes en `public/images/categories/filtros-rojo.webp`. Prompt en `docs/category-04-prompt.txt` y procedencia en `assets/categories-generated/filtros-generation.json`. Integrada en la portada, catálogo y ficha de categoría en español y catalán. El build y la comprobación de HTML en ambos idiomas son correctos.

## Actualización vigente: botón único y selector español/catalán

Se retira el botón duplicado de consulta del hero y de la banda de contacto: la acción «Consultar un recambio» permanece en la barra superior. En móvil también está visible, en una segunda fila de la cabecera.

Se añade selector ES/CA que conserva página, parámetros y ancla. Español por defecto, catalán en `/ca/...` y aliases españoles `/es/...`. Hay 250 textos por idioma, incluyendo portada, categorías, familias, navegación, tiendas, formularios, validaciones, avisos, accesibilidad y metadatos. Las páginas catalanas se prerenderizan con `html lang="ca"`; el selector funciona sin JavaScript. No se añaden cookies ni persistencia de preferencias.

Se conserva la portada estática Nissan GT-R y el tratamiento rojo de las categorías. Detalles de edición de idiomas en `docs/languages.md`.

Validación de esta actualización: build/typecheck y lint correctos, 20 pruebas unitarias correctas, 17 comprobaciones funcionales de navegador correctas y auditoría final axe superada en 12 páginas representativas (6 en español y 6 en catalán). Se comprobaron selector, consulta con categoría, HTML sin JavaScript y cabecera a 320, 390, 1024 y 1440 px. Se corrigieron las etiquetas accesibles del selector y del enlace de mapas catalán para que incluyan el texto visible. Capturas en `docs/previews/re-motorsport-ca-*.png`.

## Historial: portada estática Nissan GT-R y categorías rojas

Por petición expresa posterior del usuario, la portada animada se ha sustituido por imágenes estáticas generadas con la herramienta integrada de imagen. El nuevo GT-R R35 grafito lleva pinzas de freno rojas, con detalles e iluminación rojos en un taller ilustrativo inspirado en el encuadre anterior.

- Maestros preservados en `assets/hero-gtr/desktop-master.png` y `mobile-master.png`. Prompts y referencias en `docs/static-nissan-gtr-prompts.txt`. No son fotografías de instalaciones reales del negocio.
- Imagen horizontal WebP 1672 × 941 (205.722 bytes) y vertical 900 × 1350 (137.236 bytes). Selección nativa mediante `<picture>`, sin JavaScript; la versión vertical conserva el coche completo en móvil y tablet.
- Eliminados de la aplicación visor, controles, hotspots, ventanas, loaders, traducciones asociadas, CSS y helpers. Modelos, fuentes anteriores y scripts de inspección respaldados en `assets/retired-3d`, fuera de los recursos públicos.
- Eliminadas las dependencias React Three Fiber, Drei, Three.js, GSAP, herramientas glTF, tipos y Meshoptimizer que solo utilizaba el visor. El build ya no genera chunks de escenas ni sirve archivos GLB. Se ha retirado de CSP el permiso de ejecución WASM que requería ese sistema.
- Las cinco fotos de categorías se reprocesan desde los originales, con un rango más amplio de tonos cian/azules para convertir mobiliario, detalles y reflejos a rojo corporativo #F80303 manteniendo textura y luces. Se han inspeccionado juntas en una hoja de contacto.
- Nuevos nombres `mecanica-rojo.webp`, `frenos-rojo.webp`, `suspension-rojo.webp`, `sistema-electrico-rojo.webp` e `iluminacion-rojo.webp` evitan las versiones antiguas en caché. Estadísticas y procedencia en `assets/hero-gtr/category-colors.json`.
- Validación final: typecheck/build y lint correctos; **20 pruebas unitarias y 12 de navegador correctas**. Se comprueban las cinco fotografías cargadas con rutas rojas, responsive 320–1920 px, ausencia de recursos 3D, catálogo y contacto, teclado y contraste/semántica axe. Las capturas vigentes son `docs/previews/re-motorsport-static-390.png` y `re-motorsport-static-1440.png`, con fotografías ya cargadas. Se ha inspeccionado el encuadre final de ambos formatos.
- Bundle cliente: 482,30 kB (153,89 kB gzip), sin los anteriores módulos separados de WebGL ni la descarga de modelo de 10 MB. No se ha publicado nada ni cambiado los canales o datos pendientes de validación.

## Historial: logo aportado por el negocio

El usuario ha facilitado `logo RE.jpeg` y solicitado reconstrucción de alta resolución y adaptación cromática. Se sustituyen el wordmark provisional y la paleta ámbar de la primera fase. Las secciones de migración que siguen se conservan como historial; la identidad actual se describe en `BRAND_AUDIT.md`.

- Original conservado en `assets/brand/re-motorsport/logo-original.jpeg` (627 × 318). Reconstrucción con la herramienta integrada `image_gen`, a partir del JPEG, sin usar un modelo alternativo ni credenciales de API.
- Salida nativa 2132 × 737 y maestro recortado 2089 × 587 preservados. PNG transparentes de 1024/2048/4096 px y versión sobre blanco de 4096 px. Las exportaciones son raster; no se afirma vectorización exacta. Prompt en `docs/logo-restoration-prompt.txt`.
- Colores muestreados por mediana del original: rojo #F80303 (248, 3, 3), negro #000000 y blanco #FFFFFF. Método, SHA-256 y muestras en `assets/brand/re-motorsport/palette-sampling.json`; script reproducible `scripts/extract-logo-palette.mjs`.
- `src/config/brand.json` registra procedencia, recursos y colores. Rojos de accesibilidad #FF5252 para textos y #D50000 para botones con blanco. Grises neutros de apoyo documentados como decisiones de interfaz.
- Logo integrado en cabecera, menú móvil y pie. Favicons extraídos del emblema original, imagen social con la reconstrucción, coche grafito con luces y hotspots rojos, respaldo estático neutro y fotografías de categorías reprocesadas desde sus originales para sustituir el cian por rojo.
- Respaldo de los assets y configuración provisionales en `assets/brand/provisional-before-official`. Los originales heredados siguen intactos. No se modifica el resto de estados de validación comercial ni se publica el sitio.
- Validación de esta actualización: build + typecheck correctos; lint correcto; **21 pruebas unitarias y 14 de navegador correctas**. Incluye responsive 320–1920 px, contraste/semántica axe, visor 3D de escritorio y activación móvil. Inspección visual del logo sobre blanco/gris y de la web en escritorio/móvil.

## Historial: primera migración

Fecha: 24/10/2026. Carpeta: `C:\Users\Usuario\Desktop\re-motorsport`. Sin publicación, cambios de DNS, mensajes a terceros ni modificaciones del proyecto original.

## Punto de restauración e inspección

El repositorio estaba limpio al inicio. Se creó la rama local `re-motorsport-local` desde `e4bca60`. Ese commit conserva íntegra la copia original. No se cambió la configuración global de Git; las operaciones usaron una excepción de propietario limitada al comando.

Los dos documentos recibidos se copiaron a la raíz con su codificación UTF-8. El inventario previo de referencias a la marca, dominio, NIF y turquesa está en `docs/migration-original-inventory.txt`. Se revisaron README, scripts npm, componentes, traducciones, routing, SEO, estilos, API, tests, configuración de despliegue y recursos públicos.

Hallazgo relevante: el commit inicial de esta copia tenía una portada estática y ya había retirado el visor 3D. Se recuperaron los componentes originales del commit `3d0f68f`, el cálculo de cámara, la colocación de ventanas y sus dependencias desde la caché npm. No se recreó el proyecto ni se reemplazó el modelo.

## Cambios

- Maestro central en `src/config/brand.json`, con contactos por tienda, estados de verificación y paleta. `brand.ts` aplica visibilidad, mapas y dominio autorizado.
- Web pública en español, incluido el contenido de los antiguos enlaces `/es` y `/ca`. Sin selector de idioma incompleto. Navegación: Inicio, Recambios, Cómo trabajamos, Tiendas y Contacto.
- Portada con copy nuevo, CTAs de consulta y tiendas, coche interactivo y tres pasos para preparar una consulta.
- Nueve familias editoriales: motor/distribución, frenos, suspensión/dirección, filtros/mantenimiento, baterías/eléctrico, iluminación, refrigeración/climatización, transmisión/embrague y escape/emisiones. Sin precios, stock, marcas distribuidas ni enlaces de compra ficticios.
- Búsqueda sin acentos, filtros, fichas por familia y formulario con categoría preseleccionada conservados. Las antiguas rutas profesionales, promociones y clásicos siguen accesibles con mensajes prudentes; se elimina la atribución de la tienda externa de clásicos.
- Esparreguera y Piera con teléfono clicable, dirección, enlaces externos a Maps y horarios señalados como pendientes de confirmación directa. Sin mapas incrustados ni rastreadores.
- Olesa permanece oculta; email y WhatsApp candidatos están desactivados. No se atribuye identidad societaria ni NIF al grupo.
- Formulario para marca, modelo, año, motorización, pieza y referencia opcional. Selector de tienda y llamada real al teléfono elegido. La preparación no envía ni persiste datos. El backend original se mantiene protegido por aprobación central de privacidad/envío además de sus credenciales, origen y rate limiting. No se probaron entregas reales ni se enviaron mensajes.
- Wordmark textual provisional, favicon, OG y PNG transparentes en 1024/2048/4096. Paleta propuesta grafito/ámbar, documentada en `BRAND_AUDIT.md`. No se presenta como identidad oficial.
- Nuevos títulos y descripciones, 60 páginas HTML y 404, schema AutoPartsStore para las dos tiendas corroboradas. Sin NIF, ratings, horario estructurado no confirmado ni imágenes empresariales inventadas.
- Dominio canónico mediante `VITE_SITE_URL`, sin valor por defecto. Mientras no esté aprobado: canónicos omitidos, sitemap vacío y rastreo/indexación bloqueados. Las páginas legales provisionales permanecen en noindex incluso con dominio.
- Automatización de publicación anterior archivada como `.github/workflows/pages.yml.disabled`. Nombre local de paquete y Wrangler adaptados; ningún servicio externo se ha modificado.

## Coche y accesibilidad

Geometría y GLB originales intactos. Se conserva GLB web optimizado de 10.288.880 bytes; el original de 41.118.748 bytes queda fuera de `dist`. Material grafito y luz ámbar desde la configuración central. Anclajes de mallas inspeccionadas para frenos e iluminación; los sistemas internos se tratan como aproximaciones esquemáticas. No se presenta el retrovisor como batería.

Visor cargado por separado, renderizado bajo demanda, DPR limitado y calidad ligera en móvil. Móvil, ahorro de datos y movimiento reducido usan inicialmente el respaldo estático y permiten activar el visor. Se mantienen giro con controles, arrastre de escritorio, reinicio, calidad, pausa, hotspots, selector de categorías y ventanas con cierre Escape/restauración de foco. El catálogo funciona sin JavaScript y sin WebGL.

Correcciones encontradas durante QA: controles heredados fuera de la escena, selector de categorías oculto, encuadre del respaldo, ajuste de cámara a la escena gráfica e hidratación de la portada cuando el módulo 3D todavía no había cargado. Se corrigieron y se repitió la comprobación en Chrome.

## Inventario de imágenes

| Recurso | Tratamiento |
| --- | --- |
| `assets/brand/originals/*`, `assets/brand/wordmark-turquoise.svg` | Originales heredados conservados; no servidos |
| `public/brand` heredado | Archivado en `assets/legacy-public/brand` |
| Favicon heredado y referencia conceptual | Archivados en `assets/legacy-public/icons` y `references` |
| `hero-garage*.webp`, `garage-studio.webp`, OG anterior | Archivados en `assets/legacy-public` |
| `categories/mecanica`, `frenos`, `suspension`, `sistema-electrico`, `iluminacion` | Inspección visual, originales respaldados, acentos cian adaptados a ámbar con Sharp; composiciones ilustrativas |
| `categories/neumaticos.webp` | Original archivado, fuera del catálogo público |
| `vehicle-poster.webp` | Original archivado; recorte transparente sin modificar el coche para mejorar encuadre |
| `public/brand/wordmark.svg`, PNG, favicon, `social.jpg` | Nuevas composiciones tipográficas provisionales |
| GLB original y web | Conservados sin reescribir; solo versión web en build |

Las fotografías de piezas no se presentan como instalaciones ni inventario de RE-Motorsport. No se han generado fotografías nuevas. `docs/migration-assets.json` registra el inventario previo al procesamiento y las rutas de archivo. Las capturas antiguas en `docs/previews` son históricas; las nuevas llevan prefijo `re-motorsport`.

## Validación

- Dependencias del visor instaladas desde la caché local. La instalación informó de cero vulnerabilidades; no equivale a una nueva auditoría remota.
- `npm run lint`: correcto.
- `npm test`: 21 pruebas de catálogo, rutas, validación, formulario, API, protección de privacidad, flags comerciales, correspondencia de hotspots y SEO.
- `npm run build`: typecheck, build cliente, SSR y prerender de 60 rutas más 404 correctos.
- Primera ejecución completa corregida de Playwright: 13 pruebas correctas, incluidas carga/giro/reinicio/pausa 3D, alternativa sin WebGL y axe.
- Revisión final de navegador: **14 pruebas correctas**, incluida activación 3D en móvil, selección de frenos, CTA y cierre de la ventana. Capturas en `docs/previews/re-motorsport-desktop.png`, `re-motorsport-mobile.png` y `re-motorsport-mobile-3d.png`.
- Prettier sobre código, estilos, pruebas, API y scripts nuevos: correcto. `git diff --check`: correcto. Búsqueda de marca, NIF, dominio y turquesa heredados en `src`, `functions`, `public` e HTML: sin coincidencias.
- Tamaños comprobados: 320, 390, 768, 1440 y 1920 px, además de captura móvil 390×844. Sin desbordamiento en portada, catálogo, ficha, tiendas y contacto.
- Auditoría axe con etiquetas WCAG 2 A/AA, 2.1 A/AA y 2.2 AA en inicio, catálogo, contacto, tiendas, cómo trabajamos y privacidad. No sustituye una revisión manual completa con lectores de pantalla o dispositivos reales.
- Servidor local de preview: `http://127.0.0.1:4173/`.

El build puede mostrar avisos de anotaciones PURE de Zod, retiradas automáticamente por Rollup. No impiden compilar. La generación de imágenes se completó pese a avisos de Fontconfig sobre cachés externas sin permiso de escritura. Las compilaciones y Chrome se ejecutaron con permiso para superar restricciones de lectura/lanzamiento del sandbox; sin despliegue ni ventanas visibles.

## Fuentes y límites

Base de negocio: documentos aportados. Se volvieron a consultar las fichas públicas de [Esparreguera](https://www.cylex.es/esparreguera/re-motorsport-grup-sl-12915026.html) y [Piera](https://www.cylex.es/piera/re-motorsport-piera-13870849.html), que mantienen direcciones, teléfonos y horarios de la base. No se han contactado las tiendas. Los datos de directorios no se convierten en confirmación directa.

Antes de publicar faltan logo/colores oficiales, identidad jurídica/privacidad, dominio, catálogo y servicios, confirmación directa de horarios/contactos y licencias de recursos. Olesa, email y WhatsApp siguen pendientes. Consultar `PENDIENTE_CLIENTE.md`. No se ha realizado una auditoría Lighthouse nueva ni se atribuye una puntuación a esta versión.
