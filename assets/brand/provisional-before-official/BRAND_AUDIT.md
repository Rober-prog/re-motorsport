# Auditoría de identidad · RE-Motorsport

Fecha: 24/10/2026. Estado: **PROPUESTA PROVISIONAL**, pendiente de aprobación del negocio.

No se ha localizado un logo oficial de RE-Motorsport en los archivos entregados. Los logos en `assets/brand/originals` pertenecen a la marca anterior. Se conservan intactos y no se publican. No se ha inventado un emblema ni atribuido una tipografía al negocio.

La cabecera usa texto HTML y fuentes locales. `public/brand/wordmark.svg` es un marcador tipográfico temporal, identificado como tal en su título. Los PNG transparentes de 1024, 2048 y 4096 px se rasterizan desde ese SVG; no son una vectorización ni una recuperación del logo oficial. Favicon y social preview son composiciones gráficas provisionales. Se regeneran mediante `node scripts/prepare-re-brand.mjs`.

## Paleta

Fuente: propuesta editorial creada para esta migración, sin muestreo de imágenes corporativas. Confianza: alta en los valores técnicos; **ninguna verificación como colores corporativos**. Maestro: `src/config/brand.json`; CSS generado en `src/styles/brand.css`. Los materiales del coche y la iluminación leen la misma configuración.

| Token | HEX | RGB | Uso |
| --- | --- | --- | --- |
| primary | #F5B942 | 245, 185, 66 | Acciones y marcadores |
| secondary | #232830 | 35, 40, 48 | Superficies secundarias |
| accent | #FFE0A0 | 255, 224, 160 | Luz cálida |
| ink | #14171B | 20, 23, 27 | Fondo y texto sobre ámbar |
| surface | #1D2229 | 29, 34, 41 | Tarjetas y paneles |
| muted | #BFC5CE | 191, 197, 206 | Texto secundario |
| border / car | #424A56 | 66, 74, 86 | Bordes y carrocería grafito |

Contrastes sRGB calculados según luminancia relativa: primary/ink **10,19:1**, muted/ink **10,35:1**, muted/surface **9,21:1**. Superan 4,5:1 para texto normal. El informe de migración registra además la revisión automatizada de las páginas.

No se hereda el turquesa anterior. Los estilos del visor se han recuperado del historial y adaptado a los tokens actuales. El acabado grafito mantiene los parámetros PBR de la recuperación, sin editar la geometría original.

## Recursos visuales

Inspección visual local: coche de respaldo y seis imágenes de categorías. No se apreciaron rótulos de la marca anterior en las imágenes de categorías; sí acentos turquesa. Las cinco imágenes usadas se procesan selectivamente en HSV con Sharp, cambiando zonas cian a ámbar y conservando luminancia y textura. Originales en `assets/legacy-public/categories`. La imagen de neumáticos se retira del sitio por tratarse de una familia sin confirmar.

Las composiciones de piezas son ilustrativas: no acreditan existencias, marcas distribuidas ni instalaciones reales. No se han creado fotografías ficticias de tiendas. Las imágenes de garaje, logos y OG heredados se archivan en `assets/legacy-public`; quedan fuera de `public` y del build.

Pendientes: logo original con derechos de uso, colores aprobados, tipografía y derechos de publicación del modelo GLB, sus texturas y las imágenes de categorías. La documentación previa del GLB no acredita licencia comercial.
