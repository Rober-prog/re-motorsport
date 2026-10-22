# QA de entrega — 21 de octubre de 2026

Verificación local en Windows, Node 22.16, Chrome y Playwright. Build estable con cabeceras CSP reales y previsualización estática comprimida. No se ha desplegado ni se ha enviado correo real.

| Comprobación                                     | Resultado                                                                                                   |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| TypeScript estricto                              | Pasa                                                                                                        |
| ESLint del código fuente                         | Pasa; se excluyen salidas generadas de Vite, Wrangler y QA                                                  |
| Formato Prettier                                 | Pasa                                                                                                        |
| Vitest y React Testing Library                   | **33 pruebas pasan**, cuatro archivos                                                                       |
| Playwright en Chrome                             | **19 casos verificados**: 18 existentes y el nuevo caso de datos empresariales en ejecución focal           |
| Accesibilidad axe                                | **Cero infracciones detectadas** en 22 URLs representativas ES/CA, etiquetas WCAG 2 A/AA, 2.1 A/AA y 2.2 AA |
| Build Vite + prerender                           | Pasa; **42 rutas + 404**, con contenido comercial en HTML                                                   |
| Build Pages Functions con Wrangler               | Compilación correcta                                                                                        |
| Smoke test de Function en emulador Pages         | HTTP **503**, `NOT_CONFIGURED`, sin simular envío                                                           |
| npm audit completo                               | **0 vulnerabilidades**                                                                                      |
| Integridad del modelo original                   | SHA-256 coincide con la inspección inicial                                                                  |
| Secretos/configuración privada en bundle cliente | No se encontraron `RESEND_API_KEY`, `CONTACT_RATE_DB` ni credenciales de prueba                             |

## Qué comprueban las pruebas

La revisión de portada añade cuatro pruebas unitarias de colocación, tres de alineación del horizonte del suelo y una prueba de navegador que verifica proximidad, separación del punto y límites de pantalla. Las pruebas del horizonte proyectan puntos lejanos del suelo y comprueban su coincidencia con el fondo en escritorio y móvil. Se revisaron capturas con el modelo real en 390, 768, 1024, 1440 y 1920 px. El fondo generado y sus límites visuales se documentan en [revisión visual](visual-refresh.md). Las comprobaciones de infraestructura, correo, auditoría de dependencias y Lighthouse de la tabla corresponden a la entrega anterior.

La revisión de luz y giro completo añade tres pruebas de encuadre que proyectan las ocho esquinas del coche durante una vuelta completa, con los márgenes de lente de escritorio y móvil. La nueva prueba de navegador comprueba una vuelta completa mediante botones, arrastre amplio, giro a la izquierda y restablecimiento; la prueba táctil verifica que los controles y el selector de categorías ocupen filas distintas. Build, TypeScript, ESLint, formato, las 33 pruebas unitarias y las 18 pruebas de navegador pasan. Las capturas de los cuatro lados se obtienen con `scripts/review-rotation.mjs`.

La revisión posterior de etiquetas elimina los dos textos inferiores y limita el hover al nombre de la categoría. Se ha ampliado la prueba de teclado para comprobar etiquetas inicialmente ocultas, aparición al pasar el puntero, desaparición al retirarlo, ausencia de tarjeta en hover y nombre visible con foco de teclado. Pasan los cuatro casos de navegador pertinentes: etiquetas/teclado, posición de tarjetas, giro completo y móvil. También pasan TypeScript, ESLint y el build; las cifras de la ejecución completa anterior se conservan arriba.

Tras integrar los dos logos aportados vuelven a pasar las 18 pruebas de navegador, incluida axe en las 22 URLs, TypeScript, ESLint, formato y build. Se revisaron cabecera, portada y pie, con tamaños de 320, 360, 390, 768 y 1440 px. Los WebP y el favicon responden 200 con tipos de imagen correctos en el servidor estático. Las copias de los PNG originales coinciden por SHA-256 con los archivos aportados; véase [marca](brand.md).

La incorporación de datos empresariales pasa las 33 pruebas unitarias, TypeScript, ESLint, formato, build y los 18 casos de navegador existentes, con axe sin infracciones en las 22 URLs. El nuevo caso ES/CA se verifica en ejecución focal: identidad/NIF, constitución, dirección 4/4A, registro, enlace de tienda y metadatos sin número de calle ni `foundingDate` no confirmados. La expectativa de fecha admite las variantes «de»/«del» que puede producir Intl en catalán. Se revisaron las fichas de empresa y dirección y el aviso legal, sin errores de página. Fuentes y alcance en [business-sources.md](business-sources.md).

- Respuesta HTML, idioma y canonical propio para las 42 URLs comerciales.
- Catálogo disponible sin JavaScript, búsqueda, filtros, estado vacío, cambio ES/CA y categoría preseleccionada en contacto.
- Validación, errores anunciables, consentimiento y ausencia de llamadas de envío cuando está desactivado.
- Esquema de cliente/servidor, rechazo de origen cruzado, honeypot, límite de cuerpo y contador, errores del proveedor y aceptación con ID. Las respuestas del proveedor son **mocks**, no entregas reales.
- Carga del modelo real, anclaje de rueda resuelto por malla original, selección por teclado, fijación de popup, Escape, devolución de foco, reselección del mismo elemento y CTA.
- Rotación y restablecimiento, selector de calidad, activación 3D móvil, tap y cierre del panel.
- Errores de carga y ausencia de WebGL sin pérdida de catálogo o navegación.
- Ausencia de errores de consola y excepciones en las pruebas 3D normales, tanto en escritorio como tras activación táctil.
- Menú móvil, rutas 404 y ausencia de desbordamiento en **360, 390, 768, 1024, 1440 y 1920 px** sobre inicio, catálogo, contacto y clásicos.
- Auditoría axe de las diez plantillas principales y una ficha de categoría en ambos idiomas: 22 páginas.

## Lighthouse de la versión anterior a la revisión visual

Lighthouse **12.8.2**, Chrome headless, perfil móvil por defecto, URL local `http://127.0.0.1:4173/`. Esta medición precede al nuevo fondo de garaje y al cambio de encuadre y tarjetas: **no es una medición del diseño actual**. El estado inicial móvil usa la captura estática del coche y ofrece activar el 3D. No representa el coste de descargar y ejecutar el modelo tras pulsar ese botón.

| Categoría        |    Puntuación |
| ---------------- | ------------: |
| Rendimiento      |  **92 / 100** |
| Accesibilidad    | **100 / 100** |
| Buenas prácticas |  **96 / 100** |
| SEO              | **100 / 100** |

- First Contentful Paint: **2,1 s**.
- Largest Contentful Paint: **3,0 s**.
- Total Blocking Time: **90 ms**.
- Cumulative Layout Shift: **0**.

Informe original, con configuración, trazas resumidas y auditorías: [lighthouse-mobile.json](lighthouse-mobile.json). La medición usa throttling de Lighthouse, gzip local y una máquina de escritorio; no garantiza estas cifras con tráfico, red o dispositivos reales. Se debe volver a medir en el dominio definitivo después de autorizar la publicación.

Lighthouse mantiene avisos sobre source maps de JavaScript y un diagnóstico CSP del inspector. Las pruebas con la CSP activa y la auditoría de consola no detectan bloqueos de texturas ni errores de carga normales. No se debilita la CSP para obtener una puntuación perfecta.

## Límites y pendientes reales

- No hay credenciales de correo, remitente/destinatario verificados, D1 aprovisionada ni privacidad definitiva. La interfaz explica el bloqueo y la Function falla cerrada con 503. No se ha probado entrega real.
- No se ha aportado licencia comercial del GLB o sus texturas. También afecta a las capturas derivadas. Solo desarrollo local; publicación comercial pendiente de verificación.
- Identidad, NIF, constitución, actividad, dirección publicada y tienda de clásicos están incorporados. Siguen pendientes la aclaración de numeración/acceso 4/4A, vigencia registral, contactos y horario actuales, fotografías, catálogo confirmado, proveedores, promociones y documentación legal definitiva.
- Las seis posiciones visibles de escritorio y cinco de móvil evitan saturación; las once categorías están disponibles mediante selector. Los sistemas internos usan anclajes esquemáticos y requieren validación de contenido. La rueda, freno, luz y retrovisor utilizan centros de nodos inspeccionados.
- El modelo web sigue pesando **10,3 MB** y conserva **782 primitivas**. No se ha medido FPS sostenido, tiempo GPU ni draw calls reales; los conteos del archivo no equivalen a mediciones de GPU.
- Se probó Chrome y emulación táctil. Quedan dispositivos físicos, Safari/Firefox y lectores de pantalla. Axe y Lighthouse no certifican por sí solos conformidad WCAG 2.2 AA.
- Three/Fiber y el controlador gráfico pueden emitir avisos de deprecación de Clock y precisión de shaders. No se ocultan mediante un parche de consola.
- El emulador Wrangler respondió correctamente. Su lectura opcional de metadatos `Request.cf` utilizó un placeholder por certificados del entorno; la Function no depende de esa propiedad. Configurar la CA corporativa si se necesita esa consulta.

No se ha publicado la web, modificado DNS, contratado servicios ni contactado a clientes.
