import fs from 'node:fs/promises';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const document = await io.read('public/models/lamborghini-temerario.web.glb');
const root = document.getRoot();
const primitives = root.listMeshes().flatMap((m) => m.listPrimitives());
const data = {
  bytes: (await fs.stat('public/models/lamborghini-temerario.web.glb')).size,
  nodes: root.listNodes().length,
  meshes: root.listMeshes().length,
  primitives: primitives.length,
  materials: root.listMaterials().length,
  textures: root.listTextures().length,
  vertices: primitives.reduce((sum, p) => sum + (p.getAttribute('POSITION')?.getCount() || 0), 0),
  triangles: primitives.reduce(
    (sum, p) =>
      sum + (p.getIndices()?.getCount() || p.getAttribute('POSITION')?.getCount() || 0) / 3,
    0,
  ),
};
await fs.writeFile('docs/web-model-metrics.json', JSON.stringify(data, null, 2));
console.log(data);
