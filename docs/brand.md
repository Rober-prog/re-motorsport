# Logotipos aportados

Se utilizan los dos archivos facilitados por el propietario:

- `Logotipo RECANVIS martorell en transparencia.png`: logotipo horizontal negro y azul.
- `Logotipo circular minimalista con coche y RM.png`: emblema circular del coche y las iniciales RM.

Las copias originales se conservan en `assets/brand/originals/wordmark.png` y `assets/brand/originals/car-emblem.png`.

## Aplicación

- Cabecera y menú móvil: ambos logos juntos sobre una base clara. Todas las letras del logotipo horizontal, incluida la línea «martorell», utilizan el turquesa `#60BED2`. Un filtro SVG aplica el color exacto sobre la transparencia original y conserva las formas de las letras.
- Portada: emblema del coche pequeño en la esquina inferior derecha, blanco y con un halo de neón suave. Se adapta a tableta y móvil.
- Pie: ambos logos con el emblema del coche ampliado.
- Pestaña del navegador: favicon del emblema circular sobre fondo blanco.

Los archivos web son exportaciones WebP de 768 px de ancho, con transparencia y codificación sin pérdida tras el redimensionado: 45.258 bytes para el logotipo horizontal y 48.568 bytes para el emblema. El navegador reutiliza los mismos recursos entre cabecera, portada y pie.

Para regenerar las exportaciones desde las copias originales:

```sh
node scripts/prepare-brand.mjs
npm run build
```

Presentación: `src/styles/brand.css`. Componentes: `src/components/layout/Layout.tsx` y `src/pages/HomePage.tsx`. Captura del logotipo turquesa: [brand-turquoise.png](previews/brand-turquoise.png).
