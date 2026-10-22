# Rendimiento 3D

## Original medido

- Tamaño: 41.118.748 bytes.
- Vértices en primitivas: 531.062.
- Triángulos: 563.025.
- Primitivas: 782; es una estimación de draw calls de geometría, no una medición de GPU. Sombras y transmisión pueden multiplicar las pasadas.
- Materiales: 80.
- Imágenes embebidas: 28.

| Textura                                                    | Dimensiones |   Bytes |
| ---------------------------------------------------------- | ----------- | ------: |
| BadgeNormal                                                | 1024 × 1024 |  802433 |
| BadgeAlbedo                                                | 1024 × 1024 |  440707 |
| LamboCeramica.png                                          | 1080 × 1080 |   70859 |
| disk                                                       | 1080 × 1080 |  315802 |
| tire_Normal.png                                            | 2048 × 2048 | 6477500 |
| tire_BaseColor.png                                         | 2048 × 2048 | 1574576 |
| CarbonTwill_GLOSSY                                         | 256 × 256   |    1962 |
| CarbonTwill_GLOSSY                                         | 256 × 256   |    1956 |
| BluAirone_AO                                               | 1024 × 1024 |  924982 |
| frontGrid                                                  | 601 × 263   |   95976 |
| honey_pattern                                              | 1080 × 1080 |  516005 |
| lateralGridspng                                            | 1080 × 1080 |  859007 |
| topGrid                                                    | 1080 × 1080 |  658723 |
| topSideGrid                                                | 1080 × 1080 |  684025 |
| 3DS_LOG---_LamborghiniTemerarioBlack_alb                   | 1024 × 1024 |   37648 |
| 18 light                                                   | 2048 × 2048 |  338567 |
| Seatbelt_DIFFUSE_Dark_PNG                                  | 256 × 256   |   78141 |
| Seatbelt_GLOSSY                                            | 256 × 256   |   86948 |
| NeroAde1AO                                                 | 1024 × 1024 |  423734 |
| LB634_Kombi_StradaHybrid_P                                 | 1920 × 720  |  790672 |
| LB634_LIS_Strada                                           | 1200 × 1920 | 1564825 |
| LB634_Passenger_StradaHybrid_P                             | 1344 × 214  |  250171 |
| carpet_H_dark_PNG                                          | 1024 × 1024 | 1431408 |
| 634_Blu_BakeInterni2_CT_Floor_NeroAde.001_AmbientOcclusion | 1024 × 1024 |  113391 |
| icons_basecolor                                            | 2048 × 2048 |  157132 |
| LeatherTerraAO_02                                          | 1024 × 1024 |  512171 |
| AlcantaraForatoMarrone                                     | 1024 × 1024 |   80240 |
| LogoStitched_DIFFUSE                                       | 1024 × 1024 |  524433 |

## Estrategia

Se conserva el original. La versión web reduce texturas a un máximo de 1024 px, codifica WebP, deduplica recursos, suelda y simplifica geometría de forma conservadora y aplica Meshopt. Mantiene nombres y nodos para anclajes; no se eliminan componentes de forma arbitraria. No se usa KTX2 porque exigiría un transcodificador y pipeline adicional que debe medirse antes de incorporarlo.

DPR limitado, calidad seleccionable, render bajo demanda, recursos locales, carga diferida, progreso, captura estática del mismo vehículo y alternativa textual. Calidad ligera reduce sombras y DPR. No se publica el original de 41 MB en dist. La referencia de diseño tampoco se publica.

Las cifras de FPS, draw calls reales y Lighthouse deben medirse en navegador; no se deducen de la cantidad de geometría.

## Versión web generada

Ruta: `public/models/lamborghini-temerario.web.glb`. Tamaño: 10.288.880 bytes. Reducción frente al original: 75.0 %. Simplificación conservadora: objetivo 65 %, error máximo 0,0005. Los pequeños componentes pueden conservar más geometría para respetar el error.

## Comparación del archivo decodificado

| Recurso                | Original | Versión web |
| ---------------------- | -------: | ----------: |
| Nodos                  |      827 |         827 |
| Mallas / primitivas    |      782 |         782 |
| Vértices en primitivas |  531.062 |     444.280 |
| Triángulos             |  563.025 |     451.837 |
| Materiales             |       80 |          79 |
| Texturas               |       28 |          28 |

Métricas reproducibles en `web-model-metrics.json`, obtenidas leyendo y decodificando la versión web con glTF Transform y Meshopt. No se ha reducido el número de primitivas mediante unión de mallas; se mantiene la identificación de piezas.

En móvil, pantallas estrechas y ahorro de datos, la captura transparente de 70.514 bytes se muestra primero. La escena y su biblioteca 3D se descargan tras activación explícita; el contenedor de interacción inicial pesa aproximadamente 11,1 kB sin comprimir tras añadir el posicionamiento de tarjetas y ambos controles de giro. El fondo del garaje añade 198.778 bytes en WebP. El coste del modelo no se oculta en las métricas de activación: la auditoría Lighthouse documentada en `qa.md` corresponde al estado inicial móvil anterior a esta revisión visual. Escritorio conserva carga automática al entrar en la zona visible.

La corrección del apoyo incorpora cinco planos de oclusión con una textura procedimental RGBA de 64 × 64 y activa sombras de contacto en ambas calidades: resolución 256 en ligera y 512 en alta. Se recalculan al renderizar frames activos, sin convertir el renderer en un bucle continuo. Esto añade trabajo gráfico durante la entrada y el giro; no se ha medido su coste en GPU de dispositivos físicos.
