import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Box3, Vector3, Object3D } from 'three';
import sharp from 'sharp';

const input = 'public/models/Lamborghini+Temerario.glb';
const buffer = await fs.readFile(input);
const length = buffer.readUInt32LE(12);
const gltf = JSON.parse(buffer.subarray(20, 20 + length).toString());
const bin = buffer.subarray(28 + length);
const objects = gltf.nodes.map((n) => {
  const object = new Object3D();
  object.name = n.name || '';
  if (n.matrix) {
    object.matrix.fromArray(n.matrix);
    object.matrix.decompose(object.position, object.quaternion, object.scale);
  }
  if (n.translation) object.position.fromArray(n.translation);
  if (n.rotation) object.quaternion.fromArray(n.rotation);
  if (n.scale) object.scale.fromArray(n.scale);
  return object;
});
gltf.nodes.forEach((n, i) => n.children?.forEach((child) => objects[i].add(objects[child])));
const root = new Object3D();
gltf.scenes[gltf.scene || 0].nodes.forEach((i) => root.add(objects[i]));
root.updateMatrixWorld(true);
const bounds = new Box3();
const inventory = [];
root.traverse((object) => {
  const index = objects.indexOf(object);
  if (index < 0) return;
  const node = gltf.nodes[index];
  const box = new Box3();
  if (node.mesh !== undefined) {
    for (const p of gltf.meshes[node.mesh].primitives) {
      const accessor = gltf.accessors[p.attributes.POSITION];
      if (accessor.min && accessor.max)
        box.union(
          new Box3(new Vector3(...accessor.min), new Vector3(...accessor.max)).applyMatrix4(
            object.matrixWorld,
          ),
        );
    }
    bounds.union(box);
  }
  inventory.push({
    index,
    name: object.name,
    mesh: node.mesh ?? null,
    parent: object.parent?.name,
    worldPosition: object.getWorldPosition(new Vector3()).toArray(),
    bounds: box.isEmpty()
      ? null
      : {
          min: box.min.toArray(),
          max: box.max.toArray(),
          center: box.getCenter(new Vector3()).toArray(),
        },
  });
});
const primitives = gltf.meshes.flatMap((m) => m.primitives);
const vertices = primitives.reduce((n, p) => n + gltf.accessors[p.attributes.POSITION].count, 0);
const triangles = primitives.reduce(
  (n, p) =>
    n +
    (p.indices === undefined
      ? gltf.accessors[p.attributes.POSITION].count
      : gltf.accessors[p.indices].count) /
      3,
  0,
);
const textures = await Promise.all(
  gltf.images.map(async (img) => {
    const view = gltf.bufferViews[img.bufferView];
    const bytes = bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
    const metadata = await sharp(bytes).metadata();
    return {
      name: img.name,
      mime: img.mimeType,
      bytes: bytes.length,
      width: metadata.width,
      height: metadata.height,
    };
  }),
);
const report = {
  input,
  bytes: buffer.length,
  sha256: createHash('sha256').update(buffer).digest('hex'),
  asset: gltf.asset,
  bounds: {
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
    size: bounds.getSize(new Vector3()).toArray(),
    center: bounds.getCenter(new Vector3()).toArray(),
  },
  nodes: objects.length,
  meshes: gltf.meshes.length,
  primitives: primitives.length,
  vertices,
  triangles,
  materials: gltf.materials.map((m) => m.name),
  textures,
  inventory,
};
await fs.mkdir('docs', { recursive: true });
await fs.writeFile('docs/model-inventory.json', JSON.stringify(report, null, 2));
const relevant = inventory.filter((n) =>
  /wheel|tire|tyre|brake|mirror|light|body|exhaust|caliper|rim/i.test(n.name),
);
await fs.writeFile(
  'docs/model-inspection.md',
  `# Inspección del Lamborghini Temerario\n\nArchivo original: \`${input}\`. Conservado sin modificar.\n\nSHA-256: \`${report.sha256}\`\n\nGenerador: ${gltf.asset.generator}. glTF ${gltf.asset.version}.\n\n## Medidas y jerarquía\n\n${objects.length} nodos, ${gltf.meshes.length} mallas, ${gltf.materials.length} materiales. Bounding box mundial: ${JSON.stringify(report.bounds)}.\n\nLa jerarquía se reconstruye a partir de las transformaciones glTF y se recorre con scene.traverse(). El cargador de la aplicación vuelve a recorrer la escena real con scene.traverse(), calcula Box3, centros y puntos mundiales. Inventario completo: [model-inventory.json](model-inventory.json).\n\n## Nodos relevantes observados\n\n| Nodo | Índice | Centro de geometría mundial |\n|---|---:|---|\n${relevant.map((n) => `| ${n.name} | ${n.index} | ${n.bounds ? n.bounds.center.map((v) => v.toFixed(4)).join(', ') : 'Sin geometría propia'} |`).join('\n')}\n\n## Anclajes\n\nLos nombres proceden del archivo, no de suposiciones. Se prefieren centros de mallas inspeccionadas para piezas exteriores y anclajes normalizados calibrables para sistemas internos no visibles. Los hotspots viven en el mismo grupo que el coche. El manifiesto explica los anclajes aproximados; no se afirma que una pieza interna esté modelada.\n\n## Licencia y publicación\n\nNo se ha proporcionado documentación de licencia ni autoría. El generador no acredita derechos. Desarrollo local permitido por el encargo; publicación comercial del GLB bloqueada hasta aportar licencia que cubra modelo, texturas y uso público. No implica afiliación con Lamborghini.\n`,
);
await fs.writeFile(
  'docs/3d-performance.md',
  `# Rendimiento 3D\n\n## Original medido\n\n- Tamaño: ${buffer.length.toLocaleString('es-ES')} bytes.\n- Vértices en primitivas: ${vertices.toLocaleString('es-ES')}.\n- Triángulos: ${triangles.toLocaleString('es-ES')}.\n- Primitivas: ${primitives.length}; es una estimación de draw calls de geometría, no una medición de GPU. Sombras y transmisión pueden multiplicar las pasadas.\n- Materiales: ${gltf.materials.length}.\n- Imágenes embebidas: ${textures.length}.\n\n| Textura | Dimensiones | Bytes |\n|---|---|---:|\n${textures.map((t) => `| ${t.name} | ${t.width} × ${t.height} | ${t.bytes} |`).join('\n')}\n\n## Estrategia\n\nSe conserva el original. La versión web reduce texturas a un máximo de 1024 px, codifica WebP, deduplica recursos, suelda y simplifica geometría de forma conservadora y aplica Meshopt. Mantiene nombres y nodos para anclajes; no se eliminan componentes de forma arbitraria. No se usa KTX2 porque exigiría un transcodificador y pipeline adicional que debe medirse antes de incorporarlo.\n\nDPR limitado, calidad seleccionable, render bajo demanda, recursos locales, carga diferida, progreso, captura estática del mismo vehículo y alternativa textual. Calidad ligera reduce sombras y DPR. No se publica el original de 41 MB en dist. La referencia de diseño tampoco se publica.\n\nLas cifras de FPS, draw calls reales y Lighthouse deben medirse en navegador; no se deducen de la cantidad de geometría.\n`,
);
console.log(
  JSON.stringify(
    {
      ...report,
      inventory: undefined,
      materials: report.materials.length,
      textures: report.textures.length,
    },
    null,
    2,
  ),
);
console.log(
  'Nodos seleccionados:',
  JSON.stringify(
    relevant
      .filter((n) => n.bounds)
      .map((n) => ({ name: n.name, center: n.bounds.center }))
      .slice(0, 45),
    null,
    2,
  ),
);
