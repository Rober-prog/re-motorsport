# Arquitectura y decisiones

## Render y rutas

React Router comparte las mismas páginas entre render estático y navegador. `src/entry-server.tsx` crea una instancia aislada de i18next por URL y renderiza HTML durante el build; no necesita Node en producción. El cliente hidrata solo si la ruta coincide con `data-route` del HTML. Rutas desconocidas usan 404 y metadatos noindex. Catalán usa `/ca` con los mismos slugs, canonical propio y hreflang recíproco. El idioma persiste en la URL y al navegar, sin cookies ni mezcla intencionada de contenido.

El render inicial del hero es estático y determinista. Después de hidratar, IntersectionObserver, WebGL y preferencias de ahorro de datos deciden la carga de la escena. El canvas no es una fuente de contenido SEO. Las fuentes se sirven localmente con licencia OFL; no hay CDN de modelos, HDR, fuentes o scripts.

En pantallas menores de 768 px, puntero táctil o ahorro de datos, se conserva la captura estática y se ofrece activación explícita del 3D. Así se evita descargar el modelo y compilar sus materiales antes de una decisión del visitante. La calidad inicial es ligera en estos dispositivos.

GLTFLoader normaliza la puntuación de los nombres: el índice conserva el nombre original de `userData.name` como alias y guarda los centros geométricos antes de transformar la escena. Los anclajes por malla usan ese índice, sin depender de nombres sanitizados supuestos.

## 3D

`VehicleScene` crea el renderer. `VehicleModel` carga con Meshopt, clona la escena y recorre sus mallas. `VehicleCamera` resuelve las desigualdades de perspectiva para las ocho esquinas de Box3 con márgenes. Se normaliza la longitud a seis unidades y se coloca el suelo a cero. Orientación inspeccionada: frente en -X, arriba +Y y lateral visible en +Z.

`VehicleLighting` genera un environment con Lightformers locales. La pintura principal del archivo carece de propiedades físicas; el runtime clona ese material y le asigna acabado grafito. No se toca el archivo original. La entrada GSAP realiza un giro suave sin elevar el coche; se anula con reducción de movimiento. El renderer trabaja bajo demanda y limita el DPR a 1/1,5 según calidad. No se permite zoom ni desplazamiento libre del modelo.

La cámara de la portada alinea el horizonte del suelo 3D con el centro vertical estimado del fondo mediante desplazamiento de lente. `VehicleGroundContact` genera oclusión suave bajo la carrocería y los cuatro neumáticos. Usa una capa visible solo por la cámara principal para evitar que esos planos contaminen la captura de `ContactShadows`. Las sombras de contacto se actualizan en los frames activos del render bajo demanda, en ambas calidades; la resolución cambia entre 256 y 512. La captura inicial conserva el horizonte con metadatos generados junto al WebP y un `ResizeObserver`.

`VehicleInteractionProvider` separa selección fijada, hover transitorio, temporizador de salida, foco y rotación. El giro admite vueltas completas sin tope y botones en ambos sentidos con pasos de 30°. `fitOrbitCamera` mantiene el encuadre inicial y aleja ligeramente la cámara cuando las esquinas giradas necesitan margen, conservando el horizonte del suelo. Los anclajes están dentro del mismo grupo que gira; Html proyecta sus coordenadas. Rueda, freno, iluminación y retrovisor comprueban oclusión por raycast cada 150 ms durante los frames activos y al terminar el giro; los puntos de la cara oculta desaparecen. Los sistemas internos usan anclajes esquemáticos y no aseguran que exista su geometría exacta. Sus categorías siempre están disponibles en el selector y catálogo.

El hover muestra únicamente la etiqueta del punto, que se oculta al sacar el puntero. Las etiquetas no capturan eventos y también aparecen con foco de teclado. Clic, Enter o toque abren el diálogo, ponen foco en la tarjeta y Escape lo devuelve al control de origen. En móvil la tarjeta se convierte en panel inferior no modal: la navegación sigue accesible. Los gestos táctiles no rotan el coche, para mantener el scroll vertical; hay dos botones de giro accesibles por teclado y tacto. El selector de categorías ocupa otra fila para evitar solaparse con los controles.

La portada combina un fondo de garaje generado y un canvas transparente. `VehicleScreenBounds` proyecta los centros de las mallas para estimar el área ocupada por el coche. `useVehiclePopupPosition` relaciona cada tarjeta con su punto HTML y busca espacio próximo, penalizando la superposición con el vehículo y el texto. El algoritmo es independiente del render 3D y tiene pruebas de geometría de pantalla. Véase [revisión visual](visual-refresh.md).

## Datos y consultas

`categories.ts` es el repositorio de datos local; no se añade un CMS prematuramente. Familias, nombres y descripciones son bilingües. El estado provisional queda visible. `vehicleHotspots.ts` contiene la configuración espacial, independiente de la lógica comercial.

React Hook Form utiliza el mismo esquema Zod que la Function. La privacidad y la ausencia de configuración impiden activar envíos reales. El proveedor nunca recibe secretos desde el cliente. D1 solo mantiene contadores de abuso; el mensaje se remite al proveedor, sin persistir en la aplicación. El resultado de las pruebas con mocks se distingue de una entrega real.

## Revisiones pendientes para producción

Calibración comercial final de las once categorías, fotografías y contenido real, licencia del GLB/capturas, configuración y prueba de correo/D1, revisión legal, dispositivos físicos y lector de pantalla, rendimiento con GPU móvil real y autorización de publicación.
