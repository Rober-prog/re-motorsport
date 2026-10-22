# Portada fotográfica

Se ha sustituido el explorador 3D por una fotografía fija de un deportivo grafito en un taller. No hay puntos interactivos, tarjetas flotantes, controles de giro ni activación 3D. El hero contiene únicamente el título, el subtítulo y la imagen: no incluye botones de catálogo o contacto, indicador de desplazamiento ni flechas. El catálogo y el contacto siguen disponibles desde la navegación y las secciones de la página.

La portada funciona sin JavaScript. En móvil, el texto ocupa la parte superior y la fotografía la inferior. La imagen es decorativa y utiliza `alt=""`; el título y los enlaces son HTML accesible, independientes de la imagen.

El logotipo circular aportado aparece pequeño en la esquina superior derecha de la fotografía: blanco y con un halo de neón blanco/turquesa suave. Utiliza `public/brand/car-emblem.webp`, derivado del mismo original PNG facilitado por el usuario; el color y el halo se aplican con CSS para conservar el dibujo. La fotografía lleva un desenfoque ligero (1,4 px en escritorio y 1 px en móvil). El texto y el logo permanecen nítidos.

## Imágenes

- `public/images/hero-garage-turquoise.webp`: 1672 × 941, 150.302 bytes.
- `public/images/hero-garage-turquoise-mobile.webp`: 1000 × 563, 61.402 bytes.

La imagen actual incorpora las pinzas de freno delanteras y traseras en el turquesa corporativo `#60BED2`. Se ha editado la fotografía original con la herramienta integrada `image_gen` y se han generado las dos versiones WebP. Los nombres de archivo nuevos evitan reutilizar la imagen anterior almacenada en caché.

Generadas con la herramienta integrada `image_gen`, usando la captura aportada únicamente como referencia visual. La conversión a WebP conserva la composición original. La carga usa `<picture>`, selección por anchura y prioridad alta.

Los modelos originales se conservan como archivos de origen; la compilación los excluye por completo de la web publicada. Las antiguas dependencias y componentes de React Three Fiber y las pruebas del explorador se han retirado. Las pruebas actuales verifican la imagen, el catálogo, ambos idiomas y la ausencia de descargas de modelos.

## Prompt de generación

### Edición de las pinzas de freno

> Precise localized photo edit of the provided automotive hero photograph. Change ONLY the brake calipers on the main graphite sports coupe to corporate turquoise HEX #60BED2 (RGB 96,190,210), a painted turquoise automotive brake-caliper finish with realistic shadows and highlights. Make the front brake caliper clearly visible through the existing dark wheel spokes, and the rear brake caliper turquoise too wherever visible. Preserve the exact existing wheels, spoke geometry, rims, tires, brake discs, car body graphite paint, vehicle shape, composition, framing, camera perspective, garage, lights, floor, reflections and all other details unchanged. Do not color the wheel rims or brake discs. Do not add any text, logos, interface, arrows, badges, dots or other elements. Keep the same wide aspect ratio and image dimensions. Output a single edited photograph.

### Fotografía original

> Generate a new photorealistic automotive website hero background image, using the user's attached screenshot ONLY as a reference for the garage atmosphere and the general car composition. This is a photographic asset, NOT a website screenshot or UI mockup. Wide 16:9 landscape, ideally 2560px or larger. A beautiful graphite anthracite metallic sports coupe with a timeless rounded silhouette, seen in front three-quarter view, front pointing left, parked in an elegant dark industrial auto workshop. The whole car is visible, positioned in the lower-right two thirds, leaving dark calm negative space in the upper-left for HTML text. Concrete floor with subtle reflections, workshop glass, equipment softly out of focus, tall vertical warm white light strips. Premium realistic automotive photography with carefully controlled highlights and natural tire contact. Corporate mood: anthracite #32373E and restrained turquoise #60BED2 ambient reflections, no electric royal blue. Crisp detailed vehicle without visible logos or badges, no people. Absolutely NO text, NO typography, NO navigation, NO interface, NO cards, NO dots or hotspots, NO labels, NO watermarks. Composition should also allow a mobile portrait crop around the car. Single image with opaque background.
