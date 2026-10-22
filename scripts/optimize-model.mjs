import fs from 'node:fs/promises';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, simplify, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read('public/models/Lamborghini+Temerario.glb');
await doc.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.65, error: 0.0005 }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 82 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
const target = 'public/models/lamborghini-temerario.web.glb';
await io.write(target, doc);
const stat = await fs.stat(target);
await fs.appendFile(
  'docs/3d-performance.md',
  `\n## Versión web generada\n\nRuta: \`${target}\`. Tamaño: ${stat.size.toLocaleString('es-ES')} bytes. Reducción frente al original: ${(100 - (stat.size / 41118748) * 100).toFixed(1)} %. Simplificación conservadora: objetivo 65 %, error máximo 0,0005. Los pequeños componentes pueden conservar más geometría para respetar el error.\n`,
);
console.log(`Modelo web: ${stat.size} bytes`);
