/* 3D integration test page: each scene composited into the stage. Build: python3 tools/build.py three → dist/three.html */
const DECK = { chapters: [{ key: 'intro', name: 'Intro' }, { key: 'elec', name: 'Electronics' }], slides: [] };
const S = o => (DECK.slides.push(o), o);
S({ id: 'shell3d', ch: 'intro', theme: 'paper', title: '3D test', settle: 8, three: ['shell'], draw: t => {
  header(t, 'Shell, composited');
  view3D('shell', t, 120, 230, 1100, 700, { view: 'threeQuarter', yaw: 0.25 * Math.sin(t * 0.5) });
  view3D('shell', t, 1240, 230, 560, 340, { view: 'top', explode: 0 });
  view3D('shell', t, 1240, 590, 560, 340, { view: 'threeQuarter', explode: 0.8 });
} });
S({ id: 'pcb3d', ch: 'elec', theme: 'night', title: '3D test', settle: 8, three: ['pcb', 'gt01', 'wheel'], draw: t => {
  header(t, 'PCB and parts, composited');
  view3D('pcb', t, 100, 230, 1000, 700, { view: 'threeQuarter', explode: 0.0 });
  view3D('gt01', t, 1140, 230, 680, 330, { view: 'threeQuarter', cutaway: 1 });
  view3D('wheel', t, 1140, 600, 680, 330, { view: 'threeQuarter', scroll: t });
} });
