# Revisión visual de la portada

Se mantiene el modelo 3D suministrado. El coche se encuadra más arriba y con una cámara más baja; la pintura grafito y la iluminación se ajustan para integrarlo en un entorno de garaje con suelo reflectante. El fondo es una imagen generada para esta web, sin vehículo, texto ni interfaz. Es un escenario ilustrativo, no una fotografía de las instalaciones de Recanvis Martorell.

La referencia del proyecto guía la composición, tipografía, ambiente industrial y acentos azules. No se coloca la captura de referencia como fondo. Los reflejos del suelo pertenecen a la imagen; no son reflejos dinámicos del vehículo. El resultado conserva la interactividad del modelo y no reproduce exactamente el realismo de una fotografía de coche.

Las tarjetas de escritorio usan la posición proyectada de cada punto y el espacio ocupado por el vehículo y el texto. El algoritmo busca huecos próximos arriba, abajo o a los lados y penaliza el solapamiento. Una línea conecta la tarjeta con su punto. Las tarjetas se ajustan al cambiar el tamaño o girar el coche. En móvil se conserva un panel inferior por legibilidad y espacio disponible.

## Corrección del apoyo sobre el suelo

La segunda revisión reduce la inclinación de la cámara y alinea la línea de fuga del suelo 3D con el horizonte estimado del fondo, situado en su centro vertical. Se aplica un desplazamiento de lente según la posición real del canvas dentro de la portada, de modo que el ajuste se conserve en escritorio y móvil. Es una calibración visual de una imagen generada, no una recuperación exacta de los parámetros de una cámara fotográfica.

Se añaden sombras suaves bajo la carrocería y en los cuatro contactos de neumático, calculados desde los nodos inspeccionados del modelo. Las sombras de contacto están presentes también en calidad ligera y se recalculan en los frames activos al girar. Se elimina el desplazamiento vertical de la entrada y se reduce la luz azul para acercar el coche a la iluminación del garaje. Las etiquetas de retrovisores e interior se separan para mantener accesibles ambos puntos con el nuevo ángulo.

La captura inicial se ha regenerado con este encuadre. `src/data/vehiclePoster.json` registra sus dimensiones y horizonte; la vista previa conserva esa línea al redimensionarse, antes de activar el 3D. Los reflejos del coche siguen sin reproducirse físicamente sobre el suelo fotográfico. Una composición estática de coche y entorno permitiría una coherencia fotográfica mayor.

## Archivos

Se han eliminado de la portada los textos «Vehículo ilustrativo…» y «Arrastra para explorar». Los puntos mantienen un área de interacción de 44 × 44 px; sus etiquetas aparecen al pasar el ratón y desaparecen al salir. También se muestran con foco de teclado. Clic, Enter o toque abren la ficha; el hover ya no abre tarjetas grandes. Capturas: [portada limpia](previews/home-clean.png), [etiqueta al pasar el puntero](previews/hotspot-hover.png).

La revisión de iluminación aumenta el relleno ambiental y los paneles de luz reflejados para aclarar los laterales sin cambiar el color de pintura. Se suavizan las sombras del suelo, conservando el contacto de los neumáticos. El giro ahora admite 360° continuos mediante arrastre de ratón o botones en ambos sentidos; en móvil se usan los botones. La cámara conserva el horizonte y adapta su distancia cuando es necesario para evitar recortes. Los puntos de las superficies ocultas se esconden, y las once categorías siguen disponibles en el selector.

Capturas de esta revisión: [más luz](previews/home-lightened.png), [vista posterior](previews/rotation-180.png). Revisión reproducible con `node scripts/review-rotation.mjs`.

- Fondo definitivo: `public/images/garage-studio.webp`, 198.778 bytes.
- Poster transparente del mismo modelo: `public/images/vehicle-poster.webp`, 70.514 bytes. Se regenera con `node scripts/capture-preview.mjs` contra el servidor de desarrollo, que permite capturar el canvas transparente y guardar los metadatos de horizonte.
- Estilo de portada: `src/styles/showroom.css`.
- Posicionamiento: `src/lib/popupPlacement.ts`, `src/hooks/useVehiclePopupPosition.ts` y `src/components/vehicle/VehicleScreenBounds.tsx`.
- Capturas: [portada](previews/home-showroom.png), [motor](previews/popup-motor.png), [ruedas](previews/popup-ruedas-neumaticos.png), [panel móvil](previews/popup-mobile.png).
- Revisión visual reproducible: `node scripts/review-showroom.mjs`, con el servidor de desarrollo abierto en el puerto 5173. Se puede usar `BASE_URL` para otra URL local.

## Generación del fondo

Herramienta: ImageGen integrada, mediante la skill `imagegen`. PNG original conservado en `C:/Users/Usuario/.codex/generated_images/01a15b2f-0525-7e11-9191-62b59f621ea3/exec-9dae5a1c-f5e7-43c1-ace0-7954ee0999b4.png`. Se convirtió a WebP con Sharp para servirlo localmente.

Prompt utilizado:

```text
Use case: photorealistic-natural. Asset type: background plate for premium automotive website, wide landscape approximately 16:9, ideally 1920x1080. Create a photorealistic empty cinematic automotive studio / specialist industrial garage at night. NO CAR OR VEHICLE OF ANY KIND. The middle and lower-middle must be a clean empty stage where a separately rendered 3D sports car will be composited. Camera at automotive headlight height, subtle three-quarter garage perspective, horizon/back wall meets floor at about 57 percent of image height. Large dark industrial wall panels and tall structural pillars in background, restrained cabinets and workshop equipment pushed to the far sides, a few narrow vertical cool-white practical light strips glowing on the back wall, subtle electric blue rim light and atmospheric haze. Rich charcoal and navy tones, polished dark concrete floor with realistic fine texture, restrained wet reflections and elongated light reflections toward foreground. Upper left 40 percent quite dark and uncluttered for white website heading. Lower center has soft illumination to ground the car, empty floor clear throughout middle. Premium editorial car photography, believable architectural detail, elegant real garage rather than science-fiction, controlled highlights. This is an environment plate only, not a website mockup. Absolutely no cars, no wheels, no floating products, no text, no letters, no logos, no brands, no interface, no hotspots, no watermarks. Save the generated image as a project asset; include its filesystem path in the result if available.
```

No se ha cambiado a un coche fotográfico estático con hotspots. Esa alternativa permitiría fijar una fotografía de mayor realismo, a cambio de perder la rotación y la geometría 3D actual.
