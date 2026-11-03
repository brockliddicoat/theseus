/* ============================================================================================
   gl: a small WebGL2 renderer. Engineering-render look: a dark body, two lights, a rim, iso-parameter
   lines drawn on the surface (the grid wraps the object), a highlight tint for the part being discussed,
   a clipping plane for cutaways, and a floor whose squares are real 10 mm and 50 mm.
   ============================================================================================ */
const M4 = {
  id: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
  persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]; },
  look(e, c, u) {
    let z = norm(sub(e, c)), x = norm(cross(u, z)), y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1];
  },
  tr(x, y, z) { const m = M4.id(); m[12] = x; m[13] = y; m[14] = z; return m; },
  rx(a) { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; },
  ry(a) { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; },
  rz(a) { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; },
  sc(x, y, z) { return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]; },
  /** apply to a point */
  ap(m, p) { const x = p[0], y = p[1], z = p[2]; const w = m[3] * x + m[7] * y + m[11] * z + m[15]; return [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w, (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, (m[2] * x + m[6] * y + m[10] * z + m[14]) / w, w]; },
  /** normal matrix (rotation part; our transforms use uniform scale only) */
  nm(m) { return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]; }
};
function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function scl(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

const GLR = { gl: null, prog: null, floor: null, VP: M4.id(), P: null, V: null, eye: [0, 0, 1], scale: 1, ok: false };

const SURF_VS = `#version 300 es
in vec3 aP; in vec3 aN; in vec2 aU;
uniform mat4 uM, uVP; uniform mat3 uNM;
out vec3 vW; out vec3 vN; out vec2 vU;
void main(){ vec4 w = uM*vec4(aP,1.); vW=w.xyz; vN=uNM*aN; vU=aU; gl_Position=uVP*w; }`;
const SURF_FS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec2 vU;
uniform vec3 uCol, uCam, uHiCol, uIsoCol, uRimCol;
uniform float uAlpha, uHi, uIso, uRim, uSpec, uTexMode, uDim;
uniform vec2 uIsoN;
uniform vec4 uClip;
uniform sampler2D uTex;
out vec4 o;
void main(){
  if (dot(vec4(vW,1.), uClip) > 0.) discard;
  vec3 N = normalize(vN); bool front = gl_FrontFacing; if(!front) N = -N;
  vec3 V = normalize(uCam - vW);
  vec3 L1 = normalize(vec3(-0.45, 0.9, 0.42)), L2 = normalize(vec3(0.75, 0.3, -0.55));
  float d1 = max(dot(N,L1),0.), d2 = max(dot(N,L2),0.), hemi = 0.5+0.5*N.y;
  vec3 base = uCol;
  if (uTexMode > 0.5) { vec4 tx = texture(uTex, vU); if (uTexMode > 1.5) { if (tx.a < 0.5) discard; } else base = mix(base, tx.rgb, tx.a); }
  vec3 col = base*(0.22 + 0.95*d1 + 0.30*d2 + 0.25*hemi);
  float sp = pow(max(dot(reflect(-L1,N),V),0.), 18.)*uSpec + pow(max(dot(reflect(-L2,N),V),0.), 30.)*uSpec*0.5;
  float rim = pow(1.-max(dot(N,V),0.), 2.6)*uRim;
  col += vec3(sp) + uRimCol*rim;
  vec2 g = vU*uIsoN; vec2 f = abs(fract(g-0.5)-0.5)/max(fwidth(g), vec2(1e-5));
  float l = 1.-clamp(min(f.x,f.y), 0., 1.);
  col = mix(col, uIsoCol, l*uIso);
  vec3 hc = uHiCol*(0.30+0.70*d1+0.22*hemi) + uHiCol*rim*0.9;
  col = mix(col, hc, uHi);
  if(!front) col *= 0.32;
  col *= uDim;
  o = vec4(col*uAlpha, uAlpha);
}`;
const FLOOR_VS = `#version 300 es
in vec3 aP; uniform mat4 uVP; out vec3 vW;
void main(){ vW=aP; gl_Position=uVP*vec4(aP,1.); }`;
const FLOOR_FS = `#version 300 es
precision highp float;
in vec3 vW; uniform vec3 uCam, uC; uniform float uA, uR; uniform vec4 uSh; uniform float uShA;
out vec4 o;
float gridl(vec2 p, float s, float w){ vec2 g = p/s; vec2 f = abs(fract(g-0.5)-0.5)/max(fwidth(g),vec2(1e-5)); return 1.-clamp(min(f.x,f.y)/w,0.,1.); }
void main(){
  vec2 p = vW.xz;
  float d = length(p - uC.xz);
  float fade = exp(-pow(d/uR, 2.));
  float minor = gridl(p, 10., 1.)*0.06, major = gridl(p, 50., 1.2)*0.13;
  float g = max(minor, major)*fade*uA;
  vec2 q = (p - uSh.xy)/uSh.zw; float sh = exp(-dot(q,q)*1.6)*uShA;
  float a = clamp(g + sh*0.75, 0., 1.);
  vec3 col = mix(vec3(0.93,0.92,0.89), vec3(0.), sh/(g+sh+1e-4));
  o = vec4(col*a, a);
}`;
function compile(gl, vs, fs) {
  const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aP'); gl.bindAttribLocation(p, 1, 'aN'); gl.bindAttribLocation(p, 2, 'aU');
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
  return { p, u };
}
function glInit(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) return false;
  GLR.gl = gl;
  GLR.prog = compile(gl, SURF_VS, SURF_FS);
  GLR.floor = compile(gl, FLOOR_VS, FLOOR_FS);
  const S = 3000;
  GLR.floorMesh = mesh([-S, 0, -S, S, 0, -S, S, 0, S, -S, 0, S], null, null, [0, 1, 2, 0, 2, 3]);
  GLR.white = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, GLR.white);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
  GLR.ok = true;
  return true;
}
/** a mesh from flat arrays; normals and uvs optional */
function mesh(P, N, U, I) {
  const gl = GLR.gl, vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const nv = P.length / 3;
  const buf = (data, loc, size) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); };
  buf(P, 0, 3); buf(N || new Array(nv * 3).fill(0).map((_, i) => i % 3 === 1 ? 1 : 0), 1, 3); buf(U || new Array(nv * 2).fill(0), 2, 2);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  const big = nv > 65535; gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, big ? new Uint32Array(I) : new Uint16Array(I), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  return { vao, n: I.length, type: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
}
function texFromCanvas(cv, tex) {
  const gl = GLR.gl; tex = tex || gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}
/** camera pose -> view, projection; pose = {t:[x,y,z], yaw, pitch, dist, fov, sx, sy} (sx, sy: where the target sits, in NDC) */
function camSet(pose) {
  const c = Math.cos(pose.pitch), e = add(pose.t, [pose.dist * c * Math.sin(pose.yaw), pose.dist * Math.sin(pose.pitch), pose.dist * c * Math.cos(pose.yaw)]);
  const V = M4.look(e, pose.t, [0, 1, 0]);
  const P = M4.persp(pose.fov || 0.5, W / H, 5, 6000); P[8] = -(pose.sx || 0); P[9] = -(pose.sy || 0);
  GLR.V = V; GLR.P = P; GLR.VP = M4.mul(P, V); GLR.eye = e; GLR.pose = pose;
}
/** world point -> stage pixels [x, y, depth] */
function project(p) { const q = M4.ap(GLR.VP, p); return [(q[0] * 0.5 + 0.5) * W, (1 - (q[1] * 0.5 + 0.5)) * H, q[3]]; }
/** screen-space size in px of a world length L at point p (for scale bars) */
function pxPerMM(p) { const a = project(p), b = project(add(p, scl(norm(cross([0, 1, 0], sub(GLR.eye, p))), 1))); return Math.hypot(a[0] - b[0], a[1] - b[1]); }

function glBegin(w, h) {
  const gl = GLR.gl; gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
function glFloor(o) {
  const gl = GLR.gl, F = GLR.floor; gl.useProgram(F.p);
  gl.uniformMatrix4fv(F.u.uVP, false, GLR.VP); gl.uniform3fv(F.u.uCam, GLR.eye);
  gl.uniform3fv(F.u.uC, o.c || [0, 0, 0]); gl.uniform1f(F.u.uA, o.a == null ? 1 : o.a); gl.uniform1f(F.u.uR, o.r || 260);
  gl.uniform4fv(F.u.uSh, o.sh || [0, 0, 40, 70]); gl.uniform1f(F.u.uShA, o.shA == null ? 0.8 : o.shA);
  gl.depthMask(false); gl.disable(gl.CULL_FACE);
  gl.bindVertexArray(GLR.floorMesh.vao); gl.drawElements(gl.TRIANGLES, GLR.floorMesh.n, GLR.floorMesh.type, 0);
  gl.depthMask(true);
}
/** draw a mesh; o = {M, col, alpha, hi, hiCol, iso, isoN:[u,v], isoCol, rim, rimCol, spec, tex, texMode, clip, dim, cull} */
function glDraw(m, o) {
  const gl = GLR.gl, S = GLR.prog, u = S.u; gl.useProgram(S.p);
  const M = o.M || M4.id();
  gl.uniformMatrix4fv(u.uM, false, M); gl.uniformMatrix4fv(u.uVP, false, GLR.VP); gl.uniformMatrix3fv(u.uNM, false, M4.nm(M));
  gl.uniform3fv(u.uCam, GLR.eye); gl.uniform3fv(u.uCol, o.col || [0.1, 0.1, 0.11]);
  gl.uniform3fv(u.uHiCol, o.hiCol || RGB.gold); gl.uniform3fv(u.uIsoCol, o.isoCol || [0.40, 0.41, 0.43]); gl.uniform3fv(u.uRimCol, o.rimCol || [0.55, 0.58, 0.62]);
  gl.uniform1f(u.uAlpha, o.alpha == null ? 1 : o.alpha); gl.uniform1f(u.uHi, o.hi || 0); gl.uniform1f(u.uIso, o.iso || 0);
  gl.uniform1f(u.uRim, o.rim == null ? 0.5 : o.rim); gl.uniform1f(u.uSpec, o.spec == null ? 0.25 : o.spec); gl.uniform1f(u.uDim, o.dim == null ? 1 : o.dim);
  gl.uniform2fv(u.uIsoN, o.isoN || [20, 24]); gl.uniform4fv(u.uClip, o.clip || [0, 0, 0, -1e9]);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, o.tex || GLR.white); gl.uniform1i(u.uTex, 0); gl.uniform1f(u.uTexMode, o.tex ? (o.texMode || 1) : 0);
  gl.bindVertexArray(m.vao);
  const a = o.alpha == null ? 1 : o.alpha;
  if (a < 0.999) {
    gl.depthMask(false); gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT); gl.drawElements(gl.TRIANGLES, m.n, m.type, 0);
    gl.cullFace(gl.BACK); gl.drawElements(gl.TRIANGLES, m.n, m.type, 0);
    gl.disable(gl.CULL_FACE); gl.depthMask(true);
  } else {
    if (o.cull) { gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); } else gl.disable(gl.CULL_FACE);
    gl.drawElements(gl.TRIANGLES, m.n, m.type, 0);
    gl.disable(gl.CULL_FACE);
  }
}
