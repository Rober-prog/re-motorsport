# Inspección del Lamborghini Temerario

Archivo original: `public/models/Lamborghini+Temerario.glb`. Conservado sin modificar.

SHA-256: `90473f33eba05cdf70cc94a8b738179318cd2c3d9a7cc90c8d8e351b4b85e8fd`

Generador: Khronos glTF Blender I/O v5.1.18. glTF 2.0.

## Medidas y jerarquía

827 nodos, 782 mallas, 80 materiales. Bounding box mundial: {"min":[-2.2602055370807648,-0.014761656522750854,-1.324627846479416],"max":[2.4461617171764374,1.2005540132522583,0.9217659533023834],"size":[4.706367254257202,1.2153156697750092,2.2463937997817993],"center":[0.0929780900478363,0.5928961783647537,-0.20143094658851624]}.

La jerarquía se reconstruye a partir de las transformaciones glTF y se recorre con scene.traverse(). El cargador de la aplicación vuelve a recorrer la escena real con scene.traverse(), calcula Box3, centros y puntos mundiales. Inventario completo: [model-inventory.json](model-inventory.json).

## Nodos relevantes observados

| Nodo                          | Índice | Centro de geometría mundial |
| ----------------------------- | -----: | --------------------------- |
| CTRL_Wheel_FL                 |     38 | Sin geometría propia        |
| MSC_WRimsTitanium_02.001      |     13 | -1.1004, 0.3342, 0.6910     |
| WHL_FL_BrakeDisc              |     18 | Sin geometría propia        |
| WHL_FL_BrakeDisc.001          |     19 | -1.0943, 0.3336, 0.6658     |
| WHL_FL_Tire                   |     36 | Sin geometría propia        |
| WHL_FL_Tire.001               |     37 | -1.0881, 0.3380, 0.6465     |
| CTRL_Wheel_FR                 |     64 | Sin geometría propia        |
| MSC_WRimsTitanium_02          |     49 | -1.0896, 0.3342, -1.1019    |
| WHL_FR_BrakeDisc              |     54 | -1.0895, 0.3336, -1.0759    |
| WHL_FR_Tire                   |     63 | -1.0881, 0.3380, -1.0557    |
| CTRL_Wheel_RL                 |    100 | Sin geometría propia        |
| MSC_WRimsBlackShiny_01        |     79 | 1.7183, 0.2374, 0.6240      |
| MSC_WRimsTitanium_01          |     80 | 1.5693, 0.3556, 0.6618      |
| WHL_RL_BrakeDisc              |     90 | 1.5693, 0.3550, 0.6393      |
| WHL_RL_Tire                   |     99 | 1.5708, 0.3473, 0.6172      |
| CTRL_Wheel_RR                 |    137 | Sin geometría propia        |
| WHL_RR_BrakeDisc              |    117 | Sin geometría propia        |
| WHL_RR_BrakeDisc.001          |    118 | 1.5693, 0.3550, -1.0485     |
| WHL_RR_Tire                   |    135 | Sin geometría propia        |
| WHL_RR_Tire.001               |    136 | 1.5708, 0.3473, -1.0264     |
| GRP_Body                      |    438 | Sin geometría propia        |
| DOOR_L_Mirror_01              |    152 | -0.2568, 1.0434, -0.2046    |
| DOOR_L_Mirror_02              |    153 | -0.4348, 0.8700, 0.8109     |
| DOOR_L_Primer_01              |    154 | -0.6715, 0.8788, 0.5802     |
| DOOR_R_Mirror_01              |    163 | -0.4334, 0.8709, -1.2156    |
| DOOR_R_Primer_01              |    164 | -0.6715, 0.8788, -0.9895    |
| EXT_CarbonTwillTRIMatt_01     |    274 | 0.6704, 1.1062, -0.8084     |
| EXT_CarbonTwillTRIMatt_02     |    275 | 0.6704, 1.1062, 0.3992      |
| EXT_CarbonTwillTRIMattInve_01 |    276 | -1.8544, 0.1660, -0.2045    |
| EXT_CarbonTwillTRIMattInve_02 |    277 | 0.7776, 0.9978, -0.8918     |
| EXT_CarbonTwillTRIMattInve_03 |    278 | 0.7776, 0.9978, 0.4826      |
| EXT_CarbonTwillTRIMattInve_04 |    279 | 2.1483, 0.3233, -0.2046     |
| EXT_ExhaustBlackMatt_01       |    315 | 2.3309, 0.8288, -0.0923     |
| EXT_ExhaustBlackMatt_02       |    316 | 2.3309, 0.8288, -0.3169     |
| EXT_ExhaustBlackMatt_03       |    317 | 2.3490, 0.8272, -0.1022     |
| EXT_ExhaustBlackMatt_04       |    318 | 2.3490, 0.8271, -0.3070     |
| EXT_Primer_01                 |    409 | -0.7421, 0.9557, -0.2046    |
| EXT_Primer_02                 |    410 | -0.7240, 0.9685, -0.2046    |
| EXT_Primer_03                 |    411 | -0.7126, 0.9746, -0.2047    |
| EXT_Primer_04                 |    412 | -0.4141, 1.1057, -0.2046    |
| EXT_Primer_05                 |    413 | -0.5260, 1.0709, -0.2046    |
| EXT_Primer_06                 |    414 | 0.7992, 0.9995, -0.2046     |
| EXT_Primer_07                 |    415 | 0.8004, 0.9954, -0.2046     |
| LGT_R_Light_01                |    436 | 1.8285, 0.6561, 0.7721      |
| INT_CarbonTwillTRIMatt_01     |    481 | -0.1875, 0.4038, -0.2046    |
| GRP_Lights_Front              |    806 | Sin geometría propia        |
| LGT_F_DaylightLedON_01        |    786 | -1.6270, 0.5874, -1.0052    |
| LGT_F_DaylightLedON_02        |    787 | -1.6273, 0.5874, 0.5958     |
| LGT_F_DaylightLedON_03        |    788 | -1.6481, 0.5654, -0.9125    |
| LGT_F_DaylightLedON_04        |    789 | -1.6481, 0.5654, 0.5032     |
| LGT_F_DaylightLedON_05        |    790 | -1.8934, 0.3539, -0.2046    |
| LGT_F_DaylightLedON_06        |    791 | -1.7584, 0.5571, 0.4461     |
| LGT_F_DaylightLedON_07        |    792 | -1.7585, 0.5571, -0.8553    |
| LGT_F_FrontlightGlass_01      |    793 | -1.8802, 0.3751, -0.2046    |
| LGT_F_Light_01                |    794 | -1.5139, 0.4313, -0.2038    |
| GRP_Lights_Rear               |    820 | Sin geometría propia        |
| LGT_R_FrontlightGlass_01      |    809 | 2.3614, 0.7051, -0.2046     |
| LGT_R_Light_02                |    810 | 1.8285, 0.6561, -1.1831     |
| LGT_R_RearlightGlassRed_01    |    813 | 2.0355, 0.4818, -0.9901     |
| LGT_R_RearlightGlassRed_02    |    814 | 2.0355, 0.4818, 0.5809      |
| LGT_R_RearlightGlassRed_03    |    815 | 2.3908, 0.3977, -0.2046     |
| LGT_R_RearlightGlassRed_04    |    816 | 2.3444, 0.3263, -0.2046     |
| LGT_R_RearlightGlassRed_05    |    817 | 2.1418, 0.8189, -0.8727     |
| LGT_R_RearlightGlassRed_06    |    818 | 2.1418, 0.8189, 0.4635      |
| LGT_R_RearlightGlassRed_07    |    819 | 2.3563, 0.9265, -0.2046     |
| MSC_WRimsBlackShiny_01.001    |    821 | 1.7183, 0.2374, -1.0332     |
| MSC_WRimsTitanium_01.001      |    822 | 1.5693, 0.3556, -1.0710     |

## Anclajes

Los nombres proceden del archivo, no de suposiciones. Se prefieren centros de mallas inspeccionadas para piezas exteriores y anclajes normalizados calibrables para sistemas internos no visibles. Los hotspots viven en el mismo grupo que el coche. El manifiesto explica los anclajes aproximados; no se afirma que una pieza interna esté modelada.

## Licencia y publicación

No se ha proporcionado documentación de licencia ni autoría. El generador no acredita derechos. Desarrollo local permitido por el encargo; publicación comercial del GLB bloqueada hasta aportar licencia que cubra modelo, texturas y uso público. No implica afiliación con Lamborghini.
