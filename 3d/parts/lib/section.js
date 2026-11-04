// Section / cutaway planes for the small parts, without a stencil buffer.
//
// Each registered mesh gets the plane as a local clipping plane, plus a BACK-FACE twin drawn with
// the same look but with its normal forced to face out of the cut. For a closed (manifold) mesh the
// only back faces you can see are the ones exposed by the cut, so the twin reads as a solid cap.
// The plane is defined in the root's local frame and follows the root wherever it is placed.
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const CAP_NORMAL_GLSL = /* glsl */`
float faceDirection = 1.0;
vec3 normal = normalize( - clippingPlanes[ 0 ].xyz );
vec3 nonPerturbedNormal = normal;
`;

export class SectionPlane {
  /**
   * @param root   THREE.Object3D the plane is attached to (its local frame)
   * @param o.normal  local normal pointing to the KEPT side
   * @param o.from    local signed offset along normal where nothing is cut yet (k = 0)
   * @param o.to      local offset at k = 1 (usually through the part's axis)
   */
  constructor(root, o = {}) {
    this.root = root;
    this.n = new THREE.Vector3(...(o.normal || [1, 0, 0])).normalize();
    this.from = o.from ?? -10; this.to = o.to ?? 0;
    this.local = new THREE.Plane(this.n.clone(), -this.from);
    this.plane = new THREE.Plane();          // world space, shared by every registered material
    this.items = [];
    this.owned = [];
    this.k = 0;
    // updater: renders first each frame, keeps the world plane in step with the root
    const up = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ visible: false }));
    up.frustumCulled = false; up.renderOrder = -1e9; up.name = 'sectionUpdater';
    up.onBeforeRender = (renderer) => { renderer.localClippingEnabled = true; this.update(); };
    root.add(up);
    this.updater = up;
    this.owned.push(up.geometry, up.material);
  }
  /** Clip `mesh` and give it a cap. o.cap = false: clip only. o.capMaterial overrides the cap look. */
  add(mesh, o = {}) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      m.clippingPlanes = [this.plane, ...(m.clippingPlanes || []).filter(p => p !== this.plane)];
      m.clipShadows = true;
      m.needsUpdate = true;
    }
    if (o.cap === false) return;
    const src = o.capMaterial || mats[0];
    const key = src.uuid + '|' + (o.capColor ?? '') + '|' + (o.capRoughness ?? '');
    let cm = this._capCache?.get(key);
    if (!cm) {
      cm = src.clone();
      cm.side = THREE.BackSide;
      if ('transmission' in cm) { cm.transmission = 0; cm.thickness = 0; }
      cm.transparent = false; cm.opacity = 1; cm.depthWrite = true;
      if ('anisotropy' in cm) cm.anisotropy = 0;
      cm.normalMap = null; cm.bumpMap = null;
      cm.vertexColors = false;                                  // a cap is one flat colour, whatever the part's baked shading
      if ('clearcoatNormalMap' in cm) cm.clearcoatNormalMap = null;
      if (o.capColor !== undefined) cm.color = new THREE.Color(o.capColor);
      if (o.capRoughness !== undefined) cm.roughness = o.capRoughness;
      cm.clippingPlanes = [this.plane];
      cm.onBeforeCompile = (sh) => {
        sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', CAP_NORMAL_GLSL);
      };
      cm.customProgramCacheKey = () => 'sectionCap';
      (this._capCache ||= new Map()).set(key, cm);
      this.owned.push(cm);
    }
    const cap = new THREE.Mesh(mesh.geometry, cm);
    cap.name = (mesh.name || 'mesh') + ':cap';
    cap.castShadow = false; cap.receiveShadow = false;   // shadows would be sampled at the hidden back faces
    cap.raycast = () => {};
    mesh.add(cap);
    this.items.push({ mesh, cap });
    return cap;
  }
  /** k ∈ [0,1]: offset from `from` to `to`. */
  set(k) {
    this.k = Math.min(1, Math.max(0, k));
    const d = this.from + (this.to - this.from) * this.k;
    this.local.set(this.n, -d);
    for (const it of this.items) it.cap.visible = this.k > 0;
    this.update();
  }
  update() {
    this.root.updateWorldMatrix(true, false);
    this.plane.copy(this.local).applyMatrix4(this.root.matrixWorld);
  }
  dispose() { for (const o of this.owned) o.dispose(); }
}

/** Screen-space edge overlay for x-ray views (fat lines, width in CSS px). Returns {lines, material}. */
export function addEdges(mesh, o = {}) {
  const eg = new THREE.EdgesGeometry(mesh.geometry, o.threshold ?? 28);
  const g = new LineSegmentsGeometry().setPositions(eg.attributes.position.array);
  eg.dispose();
  const mat = new LineMaterial({ color: o.color ?? 0x38d6c4, linewidth: o.width ?? 1.6, transparent: true, opacity: 0, depthWrite: false });
  if (o.clippingPlanes) mat.clippingPlanes = o.clippingPlanes;
  // pull the lines a fixed distance (mm, view space) toward the camera so the surface they lie on does not
  // hide them; independent of near/far, unlike a clip-space bias
  const bias = o.depthBias ?? 0.03;
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );',
      'vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );\n\t\t\tstart.xyz -= normalize( start.xyz ) * ' + bias.toFixed(4) + ';\n\t\t\tend.xyz -= normalize( end.xyz ) * ' + bias.toFixed(4) + ';');
  };
  mat.customProgramCacheKey = () => 'edgeBiasVS' + bias;
  const ls = new LineSegments2(g, mat);
  ls.name = (mesh.name || 'mesh') + ':edges';
  ls.raycast = () => {};
  ls.renderOrder = 5;
  const v = new THREE.Vector2();
  ls.onBeforeRender = (renderer) => { renderer.getDrawingBufferSize(v); mat.resolution.set(v.x / renderer.getPixelRatio(), v.y / renderer.getPixelRatio()); };
  mesh.add(ls);
  return { lines: ls, material: mat };
}
