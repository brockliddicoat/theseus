import R3D from '../bridge.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
R3D.register('scan', async (studio, THREE, M) => {
  const geo = await new Promise((res, rej) => new PLYLoader().load('/refs/scan/sora-normalized.ply', res, undefined, rej));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, M.shell); mesh.castShadow = true;
  const root = new THREE.Group(); root.add(mesh); studio.scene.add(root);
  return { root, update(state, t) { root.rotation.y = (state.spin || 0) * t; } };
});
