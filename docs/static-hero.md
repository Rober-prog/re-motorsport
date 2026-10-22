# Portada fotográfica

Se ha sustituido el explorador 3D por una fotografía fija de un deportivo grafito en un taller. No hay puntos interactivos, tarjetas flotantes, controles de giro ni activación 3D. El botón principal lleva directamente a las categorías del catálogo.

La portada funciona sin JavaScript. En móvil, el texto ocupa la parte superior y la fotografía la inferior. La imagen es decorativa y utiliza `alt=""`; el título y los enlaces son HTML accesible, independientes de la imagen.

## Imágenes

- `public/images/hero-garage.webp`: 1672 × 941, 171.270 bytes.
- `public/images/hero-garage-mobile.webp`: 1000 × 563, 66.268 bytes.

Generadas con la herramienta integrada `image_gen`, usando la captura aportada únicamente como referencia visual. La conversión a WebP conserva la composición original. La carga usa `<picture>`, selección por anchura y prioridad alta.

Los modelos originales se conservan como archivos de origen; la compilación los excluye por completo de la web publicada. Las antiguas dependencias y componentes de React Three Fiber y las pruebas del explorador se han retirado. Las pruebas actuales verifican la imagen, el catálogo, ambos idiomas y la ausencia de descargas de modelos.

## Prompt de generación

> Generate a new photorealistic automotive website hero background image, using the user's attached screenshot ONLY as a reference for the garage atmosphere and the general car composition. This is a photographic asset, NOT a website screenshot or UI mockup. Wide 16:9 landscape, ideally 2560px or larger. A beautiful graphite anthracite metallic sports coupe with a timeless rounded silhouette, seen in front three-quarter view, front pointing left, parked in an elegant dark industrial auto workshop. The whole car is visible, positioned in the lower-right two thirds, leaving dark calm negative space in the upper-left for HTML text. Concrete floor with subtle reflections, workshop glass, equipment softly out of focus, tall vertical warm white light strips. Premium realistic automotive photography with carefully controlled highlights and natural tire contact. Corporate mood: anthracite #32373E and restrained turquoise #60BED2 ambient reflections, no electric royal blue. Crisp detailed vehicle without visible logos or badges, no people. Absolutely NO text, NO typography, NO navigation, NO interface, NO cards, NO dots or hotspots, NO labels, NO watermarks. Composition should also allow a mobile portrait crop around the car. Single image with opaque background.
