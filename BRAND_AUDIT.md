# Identidad RE-Motorsport · logo aportado y colores extraídos

Fecha: 24/10/2026. Esta revisión sustituye la propuesta tipográfica y ámbar inicial. El usuario ha identificado `logo RE.jpeg` como logo del negocio y ha pedido reconstruirlo e integrarlo.

## Fuente y restauración

- Original intacto: `assets/brand/re-motorsport/logo-original.jpeg`, 627 × 318 px. Incluye un amplio margen blanco que no forma parte de la marca.
- Herramienta de imagen integrada `image_gen`, modo edición con referencia y transparencia. Prompt completo y procedencia en `docs/logo-restoration-prompt.txt`.
- Salida nativa preservada: `assets/brand/re-motorsport/logo-ai-master.png`, 2132 × 737 px.
- Maestro recortado: `assets/brand/re-motorsport/logo-restored-master.png`, 2089 × 587 px.
- Exportaciones transparentes: `public/brand/logo-re-motorsport-1024.png`, `-2048.png` y `-4096.png`.
- Exportación sobre blanco: `public/brand/logo-re-motorsport-4096-white.png`.

La reconstrucción conserva la composición del emblema rojo con pistón, las letras negras inclinadas RE y la palabra MotorSport roja. Se ha inspeccionado sobre blanco y gris para revisar geometría y transparencia. La reconstrucción con IA puede introducir pequeñas diferencias de contorno; queda pendiente de revisión del negocio. El archivo de 4096 px es un derivado redimensionado del maestro reconstruido: **no es un vector ni acredita recuperación exacta de todos los detalles del original**.

La cabecera, el menú móvil y el pie usan la imagen reconstruida sobre soporte blanco, preservando las letras negras del diseño. Se han retirado del árbol público el wordmark textual y favicon provisionales. Están respaldados en `assets/brand/provisional-before-official` junto a la configuración y auditoría anteriores.

Los favicons PNG de 32/128 px y el icono Apple de 180 px se extraen del emblema del JPEG original para conservar su forma en pequeño tamaño. El social preview integra el logo reconstruido. No se ha inventado un emblema nuevo ni se ha declarado una fuente comercial equivalente a las letras originales.

## Extracción de colores

Proceso reproducible: `node scripts/extract-logo-palette.mjs`. Resultado, número de muestras, dimensiones y SHA-256 del original en `assets/brand/re-motorsport/palette-sampling.json`.

Se analiza la zona de la marca (x < 500, y < 145) en sRGB y se calcula la mediana por canal. Para el rojo se seleccionan píxeles R > 200, G < 45 y B < 45, excluyendo el fondo blanco y buena parte del antialiasing. El negro usa canales < 30 y el blanco canales > 248.

| Color de la referencia | HEX representativo | RGB | Muestras |
| --- | --- | --- | --- |
| Rojo | **#F80303** | 248, 3, 3 | 10.649 |
| Negro | **#000000** | 0, 0, 0 | 6.788 |
| Blanco | **#FFFFFF** | 255, 255, 255 | 40.276 |

Confianza alta en la lectura del archivo; media en el rojo nominal de marca, porque JPEG introduce variaciones. El píxel rojo más frecuente es #FD0002, mientras que la mediana global es #F80303. No se afirma que estos valores sean una carta de color oficial ni un Pantone certificado. Se utiliza la mediana como token principal para que el resultado sea reproducible. No se extraen colores del archivo generado por IA.

## Aplicación y accesibilidad

Maestro único: `src/config/brand.json`. `node scripts/prepare-re-brand.mjs` genera los tokens CSS, exportaciones del logo, iconos, imagen social y respaldo neutro del coche.

| Rol | HEX | Procedencia |
| --- | --- | --- |
| primary | #F80303 | Mediana del rojo original |
| ink / white | #000000 / #FFFFFF | Muestreo del original |
| accent | #FF5252 | Rojo claro adaptado para texto sobre tarjetas oscuras |
| action / actionHover | #D50000 / #E00000 | Rojos adaptados para botones con texto blanco |
| surface / secondary | #151515 / #212121 | Neutros de apoyo de interfaz |
| muted / border / car | #C3C3C3 / #3D3D3D / #343434 | Texto secundario, bordes y carrocería grafito |

Los tonos de apoyo son decisiones de interfaz; no se presentan como colores adicionales extraídos del logo. Se elimina el ámbar anterior de los recursos activos, de las luces y de las imágenes de categorías.

Contrastes de referencia sRGB: rojo original/negro **5,01:1**; texto blanco/botón #D50000 **5,48:1**; rojo claro #FF5252/tarjeta #151515 **5,72:1**. Blanco sobre el rojo original solo alcanza **4,20:1**, por eso los botones usan un rojo algo más oscuro. La banda roja de contacto utiliza texto negro.

Las cinco composiciones de categorías se procesan de nuevo desde sus originales cian, sin encadenar conversiones sobre las imágenes ámbar. El script usa el tono principal central y conserva iluminación y textura. La portada actual utiliza dos imágenes generadas de un Nissan GT-R grafito con pinzas y detalles de taller rojos: una horizontal y otra vertical. Se ha retirado todo el visor 3D por petición posterior del usuario. Los maestros y prompts están en assets/hero-gtr y docs/static-nissan-gtr-prompts.txt. Las cinco fotografías de categorías usan nuevas rutas terminadas en -rojo.webp, con tratamiento de color ampliado para eliminar detalles cian/azules y evitar versiones antiguas en caché.

Las fotografías de piezas siguen siendo ilustrativas; no acreditan catálogo, instalaciones ni acuerdos de distribución. Los pendientes legales, de contacto y de imágenes siguen en `PENDIENTE_CLIENTE.md`.

La categoría 04 dispone además de una composición nueva de filtros y mantenimiento, generada con la herramienta integrada de imagen siguiendo las referencias de mecánica y sistema eléctrico. Conserva el banco metálico, taller de fondo, iluminación y detalles rojos. El original y su procedencia están en `assets/categories-generated`; exportación pública en `public/images/categories/filtros-rojo.webp` y prompt en `docs/category-04-prompt.txt`. Se añade como sexta fotografía, sin alterar el tratamiento de las cinco anteriores.
