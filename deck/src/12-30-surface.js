/* ============================================================================================
   idea sheets: surface and details, and shape (chapter code srf)
   ============================================================================================ */
/* lab slides for 3D framing: not part of the presentation, only built in with ?lab=1 */
(typeof location !== 'undefined' && /[?&]lab=1/.test(location.search) ? ['a', 'b'] : []).forEach(v => S({
  id: 'srf_lab' + v, ch: 'surface', theme: 'paper', title: 'lab', settle: 4, three: ['wheel', 'shell', 'shell-sora'],
  draw: t => {
    if (v === 'a') {
      view3D('shell', t, 40, 40, 900, 500, { view: [0, 1, -0.15], fov: 10, target: [-15.9, 31, 14.5], zoom: 5.5, colorway: 'black', xray: 0, explode: 0 });
      view3D('shell', t, 980, 40, 900, 500, { view: [0.75, 0.55, 0.85], fov: 16, target: [2, 16, 18], zoom: 1.5, colorway: 'black', xray: 0, explode: 0 });
      view3D('shell-sora', t, 40, 560, 900, 480, { view: [0.75, 0.55, 0.85], fov: 16, target: [2, 16, 18], zoom: 1.5, colorway: 'black', xray: 0, explode: 0 });
      view3D('wheel', t, 980, 560, 900, 480, { view: [0.55, 0.45, 0.9], zoom: 1.9, scroll: 0.6, xray: 0, explode: 0 });
    } else {
      view3D('shell', t, 40, 40, 900, 500, { view: [0.6, 0.5, 0.8], zoom: 1.5, colorway: 'forged', xray: 0, explode: 0, yaw: -0.4 });
      view3D('shell', t, 980, 40, 900, 500, { view: [0.6, 0.5, 0.8], zoom: 1.5, colorway: 'forged', xray: 0, explode: 0, yaw: 0.5 });
      view3D('shell', t, 40, 560, 900, 480, { view: [0, 1, -0.15], fov: 10, target: [0, 18, 26], zoom: 2.2, colorway: 'white', xray: 0, explode: 0 });
      view3D('shell', t, 980, 560, 900, 480, { view: 'right', fov: 10, target: [29, 11.6, 41], zoom: 5.2, colorway: 'black', xray: 0, explode: 0 });
    }
  }
}));
