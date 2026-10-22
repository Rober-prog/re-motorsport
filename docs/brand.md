# Logotipos aportados

Se utilizan los dos archivos facilitados por el propietario:

- `Logotipo RECANVIS martorell en transparencia.png`: logotipo horizontal negro y azul.
- `Logotipo circular minimalista con coche y RM.png`: emblema circular del coche y las iniciales RM.

Las copias originales se conservan en `assets/brand/originals/wordmark.png` y `assets/brand/originals/car-emblem.png`.

## Aplicación

- Cabecera y menú móvil: ambos logos juntos sobre una base clara que conserva el negro y el azul.
- Portada: emblema del coche de mayor tamaño en la zona superior derecha, con contraste blanco aplicado mediante CSS. Se adapta en tableta y móvil para dejar libre el titular y el vehículo.
- Pie: ambos logos con el emblema del coche ampliado.
- Pestaña del navegador: favicon del emblema circular sobre fondo blanco.

Los archivos web son exportaciones WebP de 768 px de ancho, con transparencia y codificación sin pérdida tras el redimensionado: 45.258 bytes para el logotipo horizontal y 48.568 bytes para el emblema. El navegador reutiliza los mismos recursos entre cabecera, portada y pie.

Para regenerar las exportaciones desde las copias originales:

```sh
node scripts/prepare-brand.mjs
npm run build
```

Presentación: `src/styles/brand.css`. Componentes: `src/components/layout/Layout.tsx` y `src/pages/HomePage.tsx`. Captura de la portada: [home-brand.png](previews/home-brand.png).
