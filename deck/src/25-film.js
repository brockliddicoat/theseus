/* ============================================================================================
   THE FILM (V1, 2026-11-06: the v23 refinement). One manifest decides what plays and in what order, and the film's spine
   is drawn by the player's chrome from it.
   Brock (F63, 15:12, 15:15): "the whole side show needs to be grounded in interconnected themes"; "show the steps to level
   something up to where it becomes the best, it has to be a process"; "every slide should feel like it's pushing towards a
   compounding goal ... the concepts should visible and statically show how they build upon one another".
   The story (handoff/v23refine/PLAN.md): the giants each sell a flagship that wins one thing by giving up another; Theseus,
   the underdog, can't out-spend them, so it out-engineers them one move at a time, each move built on the ones before.
   - FILM.moves: the acts (moves 0 to 9), their names, what each builds on and unlocks.
   - FILM.edges: the build board's links, [from, to, what flows along it].
   - FILM.order: the film, move by move, as slide ids (v23's, the revamp's and this file's, mixed). At startup DECK.slides is
     rebuilt from it: anything unlisted is dropped and `replaces` is ignored (13-sort.js stands aside). ?film=0 turns the
     manifest off (the old chapter sort, every slide), for development.
   - The chrome (every slide): the build board docked small in the footer (the active move lit, its links), the move's
     name in the section label, and the slide's link to the chain (FILM.link: what it builds on or pushes toward).
   - Move cards (mv1 .. mv9): the board brought forward full size; the last move completes and hands on along its links,
     the new move lights; what it builds on, what it unlocks, and its figure (FILM.moves[n].stat).
   - The rule (end of move 0): the bar against the giants (the scoreboard), the underdog's rule, the plan (the whole board).
   Figures come from the deck's own constants and derivations (THESEUS, ntr_thsBox, ntr_budget, NTR_BAR_*, ntr_hours,
   ntr_dens); none is typed here.
   ============================================================================================ */
const FILM_Q = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
const FILM = {
  on: FILM_Q.get('film') !== '0',
  /* the moves. ch: the deck chapter whose slides make it (accent, icon, the player's bar); name: short (the board, the label);
     title: the card's; builds / unlocks: the card's two lines (successors: sharpen these as you pilot each move) */
  moves: [
    { n: 0, ch: 'intro', name: 'The bar', title: 'The bar, and the giants’ compromises',
      unlocks: 'The target: density, not size. Light for a full-size mouse, with nothing given up.' },
    { n: 1, ch: 'shape', name: 'The shape', title: 'The shape the hand wants',
      builds: 'Move 0’s bar: a mouse is light only for the volume it fills, so the volume stays full.',
      unlocks: 'A volume fixed by hands, not by weight: every later move must fill it without shrinking it.' },
    { n: 2, ch: 'shell', name: 'A light, stiff shell', title: 'A light, stiff shell',
      builds: 'Move 1’s shape, kept full: the volume to make light, and flat low sides to hold.',
      unlocks: 'Weight saved at the same stiffness, for every move after it.' },
    { n: 3, ch: 'shell', name: 'The weight you carry', title: 'Use the weight you already carry',
      builds: 'Move 2’s light, stiff shell: its ribs end on the board the mouse already carries.',
      unlocks: 'Stiffer again, for no added weight.' },
    /* V5: move 4 in six upgrades, each built on the one before; it fills no bar (the click bar is off, Brock 17:00), so its
       card says what it gains (stat, read from the slides' own figures: 30-b13-moves45.js) */
    { n: 4, ch: 'click', name: 'Clicks', title: 'Clicks the stiff shell makes possible',
      builds: 'The stiff top and flat board of moves 2 and 3: a top that doesn’t flex lets the press drive the switch head on.',
      unlocks: 'The same click wherever you press, counted the moment it starts, from switches that draw nothing until pressed.',
      stat: () => (typeof v5_cardStat === 'function' ? v5_cardStat(4) : null) },
    /* V5: move 5 in five upgrades; it earns the motion bar's first step (LO.cats: motion, earn [5, 6]) */
    { n: 5, ch: 'glide', name: 'Glide and tracking', title: 'Glide and tracking',
      builds: 'A shell that doesn’t flex (moves 2 and 3) keeps the lens at its height, on the board it is clipped to.',
      unlocks: 'Aim that goes where you put it: the lens held in focus, every frame sent as it comes.',
      stat: () => (typeof v5_cardStat === 'function' ? v5_cardStat(5) : null) },
    /* V4 (Brock, 17:08: "the battery should only need to be 300mah ... with the same size battery as it using much newer and
       optimized firmware and no opticals"; 17:10: the freed weight to a lighter mouse): the chain is move 4's switches ->
       the Viper V4 Pro's size of battery lasting longer -> 1.6 g off the mouse -> the best density of any mouse */
    /* V6: what it builds on names move 5's frames too (the board's 5 -> 6 'Every frame'); its own figure (stat) leaves the
       8 khz hours to the power slide, where their basis is said (30-b14-move6.js) */
    { n: 6, ch: 'elec', name: 'Power', title: 'More hours from the same battery',
      builds: 'Move 4’s switches draw nothing until pressed, so a battery the Viper V4 Pro’s size lasts longer; move 5’s frames, each sent as it comes, go out at 8 khz.',
      unlocks: 'Three bars past the line at once: more hours than the Viper, a motion target ahead of every wireless mouse measured, and a battery 1.6 g lighter that takes moves 2 and 3’s shell past every mouse’s density.',
      stat: () => (typeof v6_cardStat === 'function' ? v6_cardStat() : null) },
    { n: 7, ch: 'surface', name: 'The finish', title: 'A finish that weighs nothing',
      builds: 'Move 2’s shell: a film-thin coat on it, no tape.',
      unlocks: 'Grip that holds, for no weight.' },
    { n: 8, ch: 'own', name: 'Built to open', title: 'Built to be opened',
      builds: 'The inserts and screws that hold move 3’s structure.',
      unlocks: 'A mouse you can open and repair.' },
    { n: 9, ch: 'end', name: 'Zero compromises', title: 'Zero compromises',
      builds: 'Every move, at once.',
      unlocks: 'Every axis at or past the best flagship, at the same time.' }
  ],
  /* the build board's links: [from, to, what flows]. From the plan: 1 fixes the volume (density, from 0); 2 frees grams at the
     same stiffness; 3 builds on 2; 4 and 5 on 2 and 3; 7 on 2; 8 on 3; the close on every move. Move 6 (V4, Brock 17:08): its
     hours build on move 4 (no optical switches drawing power), and the 1.6 g its smaller battery saves finishes the density
     moves 2 and 3 began (within 3 % of the best with the old battery; past it with this one). No weight flows into it to
     buy battery any more */
  edges: [[0, 1, 'Density, not size'], [1, 2, 'The volume'], [2, 3, 'A stiff skin'], [2, 4, 'Stiffness'], [3, 4, 'Stiffness'],
    [2, 5, 'No flex'], [3, 5, 'No flex'], [2, 6, 'Density'], [3, 6, 'Density'], [4, 6, 'No opticals'], [2, 7, 'The skin'], [3, 8, 'Its screws'],
    /* V5: what move 5 hands on: every frame as it comes (the motion bar's first step; move 6 sends them at 8 khz). Move 4's
       hand-on to 6 is V4's 'No opticals' above (V5's 'Battery' said the same: merged, main 18:5x) */
    [5, 6, 'Every frame'],
    [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9]],
  /* the film. Moves 0 and 1 are the pilot (V1); moves 2 to 9 are v23's slides in the plan's order until each is piloted
     (v23's chapter cards give way to the move cards; elc_sheet2 and ownsheet1 out, Brock F27: "remove this slide",
     "feels redundant") */
  order: [
    [0, ['b01_cover', 'weightgap', 'ntr_sizewt', 'ntr_density', 'ntr_densrank', 'b01_battery', 'loadouts', 'targets', 'rule']],   /* V2: the giants' loadouts in b01_compromise's place */
    [1, ['mv1', 'b07_size', 'shp_newton', 'grooves', 'emg', 'b07_sides']],
    /* V3: move 2 as five upgrades, each built on the one before (FILM.steps): the problem (the giants' light-or-stiff), the
       material, the lattice, arches, fillets, the mould, then the shell they make (shellup). v23's peaks kept with his fixes
       (shlHotspot, shlWork, filletsize); where the revamp rebuilt a slide with his notes answered, its rebuild */
    [2, ['mv2', 'b05_fallacy', 'b05_material', 'b05_wall', 'shlHotspot', 'shlWork', 'b06_lattice', 'b06_light', 'b12_latopt',
      'b06_arches', 'b06_arch', 'filletsize', 'b06_mold', 'b12_ribs', 'shellup']],
    /* V3: move 3, the board the mouse already carries, tying move 2's ribs; then what that tie spares (parts, tolerances) and
       where it meets the shell (a pad); the battery placed */
    [3, ['mv3', 'b07_board', 'b07_arms', 'b07_tolerance', 'b07_poron', 'b07_balance']],
    /* V5: move 4 as six upgrades, each built on the one before (FILM.steps): the press driven head on (direct drive, on move 3's
       flat board), the bridge (where the stiff top bends), straight cutouts (square to the press), dual rails (one plane), a
       flat front (no wobble), the switch (counted at first contact); then all six on the side buttons, and the ladder
       (clickup). Where the revamp rebuilt a slide with his notes answered, its rebuild; v23's tensioner drawing kept in it */
    [4, ['mv4', 'b02_direct', 'b02_wedge', 'b02_tensioner', 'b02_stiff', 'b02_cutouts', 'b02_seams', 'b02_rails', 'b02_front', 'b02_flush',
      'b03_switch', 'b03_spdt', 'b03_timing', 'b03_debounce', 'b03_side', 'clickup']],
    /* V5: move 5 as five upgrades on one need, a lens held in focus: the problem (a camera), the window, dots at the lens, the
       snap-on lens (v23's gld_module, an 8, kept), the sensor and its frames (the motion bar's step), lift-off, set in the web software (Brock: "place near web software") */
    [5, ['mv5', 'b04_camera', 'b04_focus', 'b04_sag', 'b04_skates', 'gld_module', 'b04_sensor', 'b04_reports', 'b10_software']],
    /* V6: move 6 as four upgrades that spend what moves 2 to 5 handed on (FILM.steps): nothing lit but the sensor (move 4's
       switches, a magnetic wheel, no RGB: b10_lights, his elc_sheet2 note), the same battery for more hours (the battery bar),
       one chip for 8 khz, frames synced to the poll (the motion bar's second step, ranked), then the three bars past the line
       together (powerup). Cut: what adds no hours, density or 8 khz (the PMIC, charging and its guards, the radio module and
       antenna, the wireless penalty, Second Shot, the pouch per gram, the frontier); the wires, the coat and the one-sided
       board leave this move for moves 7 and 8 (V6-PROGRESS.md, merge notes) */
    [6, ['mv6', 'b10_lights', 'power', 'b09_chip', 'b09_sync', 'b09_latency', 'powerup']],
    [7, ['mv7', 'coating', 'srf_texture', 'srf_weight', 'srf_uv', 'grip', 'srf_gripmap', 'srf_tape', 'srf_twotone', 'wheel']],
    /* main (18:5x): row 6's 'software' left the film: b10_software (lift-off, the web software) ends move 5 (V5). The
       hot-swap switches (b03_hotswap, the revamp's rebuild of clk_hotswap) moved here from move 4, where they built on
       nothing the stiff shell gives: switches you can pull and replace belong to a mouse built to be opened (V5's question 2) */
    [8, ['mv8', 'repair', 'ownscrew', 'own_insert', 'own_life', 'ownbatt', 'b03_hotswap', 'ownboard', 'box', 'ownsheet2']],
    [9, ['mv9', 'close']]
  ],
  /* each slide's place in the chain, said in the footer beside the board: what it builds on, or what it pushes toward.
     The pilot's; successors add theirs as they pilot each move */
  link: {
    weightgap: { s: 'Every weight from here on is the scale\u2019s, not the box\u2019s' },
    ntr_sizewt: { s: 'The giants\u2019 shortcut: light by being less mouse. Move 1 keeps the mouse', to: [1] },
    ntr_density: { s: 'The bar every move answers to: weight per cm\u00B3 of a full-size box' },
    ntr_densrank: { s: 'Lighter for its size than any mouse, wired or not: moves 2, 3 and 6 earn it', to: [2, 3, 6] },
    b01_battery: { s: 'The trade move 6 refuses: the Viper\u2019s battery size, no optical switches', to: [4, 6] },
    loadouts: { s: 'Each giant fills a bar or two by giving others up. Theseus must fill every bar at once', to: [9] },
    targets: { s: 'The bar on speed: moves 4 to 6 must clear every row', to: [4, 5, 6] },
    b07_size: { s: 'Move 1 keeps the volume full: the volume moves 2 to 8 must make light', to: [2] },
    shp_newton: { s: 'The curve the finger rests on: the outline move 2\u2019s shell must hold', to: [2] },
    grooves: { s: 'The grip is in the shape: the skin move 7 coats keeps it', to: [7] },
    emg: { s: 'Measured on players before any weight is cut' },
    b07_sides: { s: 'What the shape asks of the shell: flat low sides that hold. Move 2 builds it', to: [2] },
    /* V3: move 2, each upgrade said as what it builds on */
    b05_fallacy: { s: 'The giants\u2019 trade, light or stiff. Heavier isn\u2019t stiffer: where the weight goes is' },
    b05_material: { s: 'Upgrade 1: the material every later upgrade is made of' },
    b05_wall: { s: 'A light resin buys a thicker wall for the weight: the skin the ribs will stand on' },
    shlHotspot: { s: 'Upgrade 2 builds on the skin: cut it into triangles and the force spreads' },
    shlWork: { s: 'The rule each later upgrade follows: put the weight where the force is', to: [3] },
    b06_lattice: { s: 'Which pattern: triangles stretch where hexagons bend, at the same weight' },
    b06_light: { s: 'The lighter the shell, the more triangles win: it compounds the material' },
    b12_latopt: { s: 'On the whole shell: two candidates, kagome and true triangles, a tie' },
    b06_arches: { s: 'Upgrade 3 builds on the lattice: its ribs run whole, as arches over the dome' },
    b06_arch: { s: 'An arch holds because its feet are held: move 3 ties them to the board', to: [3] },
    filletsize: { s: 'Upgrade 4: every node where the arches cross is a corner. Round it' },
    b06_mold: { s: 'Upgrade 5 builds on the fillets: one cutter fits every corner' },
    b12_ribs: { s: 'The mould sets the last size: ribs as deep as it fills, cut steel-safe first' },
    shellup: { s: 'The weight move 2 saves: move 3 ties the shell; with move 6\u2019s lighter battery, the best density', to: [3, 6] },
    /* V3: move 3 */
    b07_board: { s: 'Builds on move 2: the ribs\u2019 feet, tied by the board the mouse already carries' },
    b07_arms: { s: 'Tie every rib, not a few arms: the same board, nothing added' },
    b07_tolerance: { s: 'No added part, no added tolerance: one body where the giants stack four' },
    b07_poron: { s: 'Where the shell meets the board, a pad: the tie never creaks' },
    b07_balance: { s: 'The heaviest part, placed: the battery move 6 sizes sits low, at the grip', to: [6] },
    /* V5: move 4, each upgrade said as what it builds on */
    b02_direct: { s: 'Upgrade 1: a top that doesn’t flex (moves 2, 3) sends the press down the axis' },
    b02_wedge: { s: 'The angle without a second board: move 3’s board stays one flat piece' },
    b02_tensioner: { s: 'Upgrade 2: a stiff top still has to bend somewhere. The bridge says where' },
    b02_stiff: { s: 'Move 2’s resin keeps the body stiff; the bridge keeps the click light' },
    b02_cutouts: { s: 'Upgrade 3: the bridge cut square to the press, so the click weighs the same' },
    b02_seams: { s: 'The same cut, placed between your fingers: nothing under a fingertip to catch' },
    b02_rails: { s: 'Upgrade 4: square cuts stop the twist at the bridge, two posts at the switch' },
    b02_front: { s: 'Upgrade 5, on the rails: a front that lands flat wherever the finger is' },
    b02_flush: { s: 'Flat at the front, flush at the sides: no step under the finger at the click' },
    b03_switch: { s: 'Upgrade 6: the same press every time, into a switch that draws nothing idle', to: [6] },
    b03_spdt: { s: 'Two throws: the switch says when the press starts, not only when it ends' },
    b03_timing: { s: 'Counted as the pole leaves: the press the five upgrades deliver, read first' },
    b03_debounce: { s: 'No wait needed to count it, and the window yours to set' },
    b03_side: { s: 'All six again, on the side buttons: tied posts on full-size switches' },
    clickup: { s: 'What move 4 hands on: the switches’ saving goes to move 6’s battery', to: [6] },
    /* V5: move 5 */
    b04_camera: { s: 'The problem: a sensor is a camera, and a camera needs its lens at one height' },
    b04_focus: { s: 'Upgrade 1: a shell that doesn’t flex (moves 2, 3) holds the lens mid-window' },
    b04_sag: { s: 'Upgrade 2: two dots at the lens hold that height, for a fraction of the skate' },
    b04_skates: { s: 'The rest of the skates, placed where they count: no screw under one' },
    gld_module: { s: 'Upgrade 3 builds on the dots: a lens one dot wide carries its own two' },
    b04_sensor: { s: 'Upgrade 4: the sensor behind the held lens, planned after Razer’s exclusivity' },
    b04_reports: { s: 'Every frame as it comes: the motion bar’s first step. Move 6 sends them', to: [6] },
    b10_software: { s: 'Upgrade 5: the lens at a known height, so lift-off in 0.1 mm steps means it', to: [6] },
    /* V6: move 6, each upgrade said as what it spends */
    b10_lights: { s: 'Upgrade 1, on move 4’s switches: nothing draws power until used' },
    power: { s: 'Upgrade 2 spends that saving: the Viper’s size of battery, more hours' },
    b09_chip: { s: 'Upgrade 3: move 5’s frames out at 8 khz, by radio or cable, one chip' },
    b09_sync: { s: 'Upgrade 4: each frame taken as the poll asks, so none goes out stale' },
    b09_latency: { s: 'The motion bar’s second step: move 5’s frames at 8 khz, first of all' },
    powerup: { s: 'What move 6 hands on: three bars past the line, for move 9', to: [9] }
  },
  /* V3: move 2's five upgrades, each built on the one before: the label row names the upgrade a slide belongs to and a
     meter beside it fills, one segment an upgrade (filmChrome). of: slide id -> upgrade (0: the problem, before the first;
     names.length + 1: the shell they make, every segment full) */
  steps: {
    2: { names: ['the material', 'the lattice', 'arches', 'fillets', 'the mould'],
      of: { b05_fallacy: 0, b05_material: 1, b05_wall: 1, shlHotspot: 2, shlWork: 2, b06_lattice: 2, b06_light: 2, b12_latopt: 2,
        b06_arches: 3, b06_arch: 3, filletsize: 4, b06_mold: 5, b12_ribs: 5, shellup: 6 } },
    /* V5 */
    4: { names: ['direct drive', 'the bridge', 'straight cutouts', 'dual rails', 'a flat front', 'the switch'], done: 'six upgrades, one click',
      of: { b02_direct: 1, b02_wedge: 1, b02_tensioner: 2, b02_stiff: 2, b02_cutouts: 3, b02_seams: 3, b02_rails: 4, b02_front: 5, b02_flush: 5,
        b03_switch: 6, b03_spdt: 6, b03_timing: 6, b03_debounce: 6, b03_side: 7, clickup: 7 } },
    5: { names: ['the focus window', 'dots at the lens', 'a snap-on lens', 'the sensor', 'lift-off'],
      of: { b04_camera: 0, b04_focus: 1, b04_sag: 2, b04_skates: 2, gld_module: 3, b04_sensor: 4, b04_reports: 4, b10_software: 5 } },
    /* V6 */
    6: { names: ['nothing lit', 'the same battery', 'one chip, 8 khz', 'frame sync'], done: 'three bars past the line',
      of: { b10_lights: 1, power: 2, b09_chip: 3, b09_sync: 4, b09_latency: 4, powerup: 5 } }
  },
  /* V3: a slide drawn for another chapter, played in this move (its chapter's accent and icon, no chapter flight inside a move) */
  chOf: { b07_balance: 'shell', b02_wedge: 'click', b10_software: 'glide' },

  /* V1's scoreboard (FILM.score) became the loadout (V2): LO below, its categories, the flagships and the moves that fill
     each of Theseus's bars (LO.cats[].earn) */
};

/* ---------- the manifest applied: DECK.slides rebuilt from FILM.order (13-sort.js stands aside when FILM.on) ---------- */
function filmApply() {
  /* one slide per id: where a file rebuilt a slide under its own id (S({ id: 'mass', replaces: 'mass' })), the rebuild */
  const byId = new Map(); for (const s of DECK.slides) if (!byId.has(s.id) || [].concat(s.replaces || []).includes(s.id)) byId.set(s.id, s);
  const out = [], missing = [];
  for (const [n, ids] of FILM.order) for (const id of ids) {
    const s = byId.get(id); if (!s) { missing.push(id); continue; }
    s.move = n; if (FILM.chOf && FILM.chOf[id]) s.ch = FILM.chOf[id]; out.push(s);
  }
  if (missing.length) console.error('film: no slide', missing.join(', '));
  FILM.dropped = DECK.slides.filter(s => !out.includes(s)).map(s => s.id);
  DECK.slides.length = 0; out.forEach(s => DECK.slides.push(s));
  /* the player's bar: chapters in the film's order (each move's slides are one chapter's, so its segments stay in order) */
  const seen = []; for (const s of DECK.slides) if (!seen.includes(s.ch)) seen.push(s.ch);
  const chs = seen.map(k => DECK.chapters.find(c => c.key === k)).filter(Boolean);
  DECK.chapters.length = 0; chs.forEach(c => DECK.chapters.push(c));
  for (const c of DECK.chapters) { const ms = FILM.moves.filter(m => DECK.slides.some(s => s.ch === c.key && s.move === m.n)); if (ms.length) c.name = ms.map(m => 'Move ' + m.n + ': ' + m.name).join(', '); }
}
const filmMove = s => (s && s.move != null ? FILM.moves[s.move] : null);

/* ============================== the build board ==============================
   An arc diagram: the ten moves on one line in the film's order, each link an arc over it from the move that gives to the
   move that takes. Done moves are ink, the move in play blue (its links in: solid blue, what it builds on; its links out:
   dashed blue, what it unlocks), moves ahead hollow. By the close every arc runs into the last node.
   g: { x0, x1, y, r, h1, h9 } (stage px: the first and last node's x, the line's y, a node's radius, the arc height for a
   span of 1 and of 9). st: { act: the move in play (-1 none), k: { [edgeKey]: 0..1 drawn }, node: { [n]: 'done'|'act'|'ahead' },
   plan: 0..1 (the arcs ahead drawn faint, dashed), labels, names, a } */
function filmGeo(g) {
  const n = FILM.moves.length, xs = FILM.moves.map((m, i) => lerp(g.x0, g.x1, i / (n - 1)));
  return Object.assign({}, g, { xs, h: span => lerp(g.h1, g.h9, (span - 1) / (n - 2)) });
}
const filmEk = e => e[0] + '>' + e[1];
/* a link into the close: drawn when the close is in play, or in the plan, not as every move's link out */
const filmToEnd = e => e[1] === FILM.moves.length - 1;
function filmArcPts(G0, e, p = 1) {
  const xa = G0.xs[e[0]], xb = G0.xs[e[1]], cx = (xa + xb) / 2, rx = (xb - xa) / 2, ry = G0.h(e[1] - e[0]), pts = [], N = 44;
  for (let i = 0; i <= N * p; i++) { const th = Math.PI + Math.PI * i / N; pts.push([cx + rx * Math.cos(th), G0.y + ry * Math.sin(th)]); }
  if (p < 1 && p > 0) { const th = Math.PI + Math.PI * p; pts.push([cx + rx * Math.cos(th), G0.y + ry * Math.sin(th)]); }
  return { pts, apex: [cx, G0.y - ry], cx, ry };
}
function filmStroke(pts, col, w, a, dash) {
  if (pts.length < 2 || a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = w; G.lineCap = 'round'; G.lineJoin = 'round'; if (dash) G.setLineDash(dash);
  G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.stroke(); G.restore();
}
/** the state of the board while move `act` is in play: every move before it done, its links among done moves drawn */
function filmState(act, o = {}) {
  const st = { act, k: {}, node: {}, plan: o.plan || 0, a: o.a == null ? 1 : o.a };
  FILM.moves.forEach(m => (st.node[m.n] = m.n < act ? 'done' : m.n === act ? 'act' : 'ahead'));
  for (const e of FILM.edges) { if (e[1] < act || (e[1] === act && e[0] < act)) st.k[filmEk(e)] = 1; else if (e[0] === act && !filmToEnd(e)) st.k[filmEk(e)] = o.out == null ? 1 : o.out; }
  return st;
}
function filmBoard(g, st, o = {}) {
  const G0 = filmGeo(g), A = st.a == null ? 1 : st.a, full = !!o.full, act = st.act;
  if (A <= 0.003) return G0;
  const ink = TH ? '17,17,17' : '243,243,245', col = { done: `rgba(${ink},${TH ? 0.34 : 0.3})`, plan: `rgba(${ink},0.2)` };
  const wv = full ? { done: 2, inn: 3.2, out: 2.4, plan: 1.5 } : { done: 1.2, inn: 1.8, out: 1.4, plan: 1 };
  const dash = full ? { out: [9, 7], plan: [4, 7] } : { out: [3, 3], plan: [2, 3] };
  /* the plan: every link not yet drawn, faint and dashed (the rule slide shows the whole board this way) */
  if (st.plan > 0) for (const e of FILM.edges) { const kk = st.k[filmEk(e)] || 0; if (kk >= 1) continue; const P = filmArcPts(G0, e, Math.min(1, st.plan * (st.planK ? st.planK(e) : 1))); filmStroke(P.pts, col.plan, wv.plan, A, dash.plan); }
  /* the links drawn: done (both ends behind the move in play), in (into the move in play: what it builds on), out (what it unlocks) */
  const labels = [];
  for (const e of FILM.edges) {
    const kk = st.k[filmEk(e)] || 0; if (kk <= 0) continue;
    const P = filmArcPts(G0, e, kk), into = e[1] === act && act >= 0, outof = e[0] === act && act >= 0;
    if (into) filmStroke(P.pts, C.heroText, wv.inn, A);
    else if (outof) filmStroke(P.pts, C.heroText, wv.out, A * 0.75, dash.out);
    else {
      filmStroke(P.pts, col.done, wv.done, A);
      const hot = st.hot && st.hot[filmEk(e)]; if (hot > 0) filmStroke(P.pts, C.heroText, lerp(wv.done, wv.inn, hot), A * hot);
    }
    if (full && e[2] && (into || outof) && kk >= 1 && o.edgeLabels !== false) labels.push([P, e, into]);
  }
  /* the nodes over the arcs' ends */
  FILM.moves.forEach((m, i) => {
    const x = G0.xs[i], y = G0.y, s = st.node[i], r = g.r * (s === 'act' && st.pop != null ? st.pop : 1);
    const fillA = s === 'act' ? (st.fill == null ? 1 : st.fill) : 1;
    G.save(); G.globalAlpha = A;
    G.beginPath(); G.arc(x, y, r + (full ? 3 : 1.5), 0, TAU); G.fillStyle = C.bg; G.fill();
    G.beginPath(); G.arc(x, y, r, 0, TAU);
    if (s === 'done') { G.fillStyle = TH ? '#3A3B3E' : '#C9CACD'; G.fill(); if (st.was && st.was.n === i && st.was.k > 0) { G.globalAlpha = A * st.was.k; G.fillStyle = C.hero; G.fill(); G.globalAlpha = A; } }
    else if (s === 'act') { G.fillStyle = C.bg; G.fill(); G.globalAlpha = A * fillA; G.fillStyle = C.hero; G.fill(); G.globalAlpha = A; G.strokeStyle = C.heroText; G.lineWidth = full ? 2.5 : 1.5; G.stroke(); if (!full) { G.beginPath(); G.arc(x, y, r + 3.2, 0, TAU); G.globalAlpha = A * 0.5; G.lineWidth = 1.2; G.stroke(); } }
    else { G.strokeStyle = `rgba(${ink},${TH ? 0.36 : 0.32})`; G.lineWidth = full ? 2 : 1.2; G.stroke(); }
    G.restore();
    if (full) {
      const nc = s === 'act' ? (fillA > 0.5 ? (HUE === 'yellow' ? '#111111' : '#FFFFFF') : C.heroText) : s === 'done' ? (TH ? '#FFFFFF' : '#111214') : C.mute;
      text(String(i), x, y + 7, { role: 'label', size: 20, weight: 800, color: nc, align: 'center', alpha: A * (o.numA == null ? 1 : o.numA), track: 0 });
      if (o.names !== false) {
        const na = (o.nameA ? o.nameA(i) : 1) * A, nm = m.name, sz = 21, mw = (G0.xs[1] - G0.xs[0]) - 14;
        const ls = wrap(sentence(nm), { role: 'small', size: sz, weight: 650 }, mw);
        ls.forEach((ln, j) => text(ln, x, y + r + 34 + j * 26, { role: 'small', size: sz, weight: s === 'act' ? 750 : 600, color: s === 'act' ? C.heroText : s === 'done' ? C.ink2 : C.mute, align: 'center', alpha: na, sentence: false }));
      }
    }
  });
  /* the labels of the move's own links, at each arc's top, on a scrap of ground so the arcs under them don't cut the words */
  for (const [P, e, into] of labels) {
    const s = e[2], w0 = tw(s, { role: 'small', size: 20, weight: 700 }) + 16, [ax, ay] = P.apex, la = A * (o.labelA ? o.labelA(e) : 1);
    if (la <= 0.003) continue;
    G.save(); G.globalAlpha = la; G.fillStyle = C.bg; G.fillRect(ax - w0 / 2, ay - 15, w0, 28); G.restore();
    text(s, ax, ay + 7, { role: 'small', size: 20, weight: 700, color: into ? C.heroText : C.mute, align: 'center', alpha: la, sentence: false });
  }
  return G0;
}
/* the dock: the board's place in the footer, beside the page count */
const FILM_DOCK = { x0: 1250, x1: 1690, y: 1040, r: 4.2, h1: 6, h9: 24 };
const FILM_FULL = { x0: 170, x1: 1750, y: 850, r: 17, h1: 60, h9: 285 };
const FILM_RULE = { x0: 170, x1: 1750, y: 900, r: 15, h1: 34, h9: 170 };   /* the rule slide's plan: move 1's card picks the board up from there */

/* ---------- a move's upgrades (V3; FILM.steps): the upgrade a slide belongs to, and the label row's words for it ---------- */
function filmStep(s) {
  const m = filmMove(s), S0 = m && FILM.steps && FILM.steps[m.n]; if (!S0 || !(s.id in S0.of)) return null;
  const i = S0.of[s.id], N = S0.names.length;
  const label = i === 0 ? 'Move ' + m.n + ': the problem' : i > N ? 'Move ' + m.n + ': ' + (S0.done || (['', 'one', 'two', 'three', 'four', 'five', 'six'][N] || N) + ' upgrades, one shell') : 'Move ' + m.n + ', upgrade ' + i + ' of ' + N + ': ' + S0.names[i - 1];
  return { i, N, label, names: S0.names };
}
/** the meter beside the label: one segment an upgrade, those landed ink, this slide's blue, those ahead a track */
function filmStepMeter(t, s) {
  const up = filmStep(s); if (!up) return;
  const a = ep(t, 0.45, 0.8); if (a <= 0.003) return;
  const x0 = LM + 36 + tw(up.label, { role: 'label', size: 22 }) + 26, y = LAY.labelY - 10, w = 30, h = 6, gap = 5;
  for (let j = 1; j <= up.N; j++) {
    const x = x0 + (j - 1) * (w + gap), col = j < up.i || up.i > up.N ? C.ink2 : j === up.i ? C.hero : C.track;
    rr(x, y, w, h, 2, col, null, 0, a);
  }
}
/* ---------- the chrome, when the film is on: the rule, THESEUS / MOVE n, the slide's link to the chain, the docked board,
   n / N. Drawn settled (it is the stage's) ---------- */
function filmChrome(t, s) {
  if (s.chrome === false) return;
  const i = DECK.slides.indexOf(s), N = DECK.slides.length, m = filmMove(s), y = LAY.footY;
  line(LM, LAY.ruleY, RM, LAY.ruleY, { color: C.hair, w: 1.5 });
  const px = LM + (RM - LM - 28) * (i / Math.max(1, N - 1));
  rect(px, LAY.ruleY - 1.5, 28, 3, { fill: C.ink2 });
  const r = rich([{ s: 'Theseus', role: 'foot', weight: 700, track: 0.24, caps: true, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 },
    { s: m ? 'Move ' + m.n : '', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, y);
  /* the link: what this slide builds on or pushes toward */
  const lk = FILM.link[s.id];
  if (lk) {
    const x0 = LM + r.w + 34, mw = FILM_DOCK.x0 - 60 - x0;
    text('→', x0, y, { role: 'foot', size: 20, weight: 700, color: C.heroText });
    text(lk.s, x0 + 27, y, { role: 'foot', size: 20, weight: 650, color: C.ink2, maxW: mw, sentence: false });
  }
  if (!s.filmCard && m) {
    const G0 = filmBoard(FILM_DOCK, filmState(m.n));
    /* the moves this slide pushes toward: a blue ring on each */
    for (const n of (lk && lk.to) || []) if (n !== m.n) { G.save(); G.beginPath(); G.arc(G0.xs[n], G0.y, FILM_DOCK.r + 3.4, 0, TAU); G.strokeStyle = C.heroText; G.lineWidth = 1.6; G.stroke(); G.restore(); }
  }
  text(`${pad2(i + 1)} / ${pad2(N)}`, RM, y, { role: 'foot', weight: 600, color: C.mute, align: 'right' });
  /* Theseus's loadout, docked top right on the label row (V2): its bars as the moves so far have filled them */
  if (lo_dockOn(s)) lo_dock(s.move);
  /* the move's upgrades, beside the label (V3) */
  filmStepMeter(t, s);
}

/* ============================== THE LOADOUT (V2, 2026-11-06): the film's persistent visual ==============================
   Brock, 15:57: "you know how when you look at guns in a game like call of duty and they have a bunch of different bars
   for their specs (recoil, handling, damage, fire rate etc)? but they're never fully filled in all the categories? i think
   we should visualize the different flagships like that ... and if makes thesesus having full bars much more impressive,
   but theseus should have bars that fill up throughout the presentation" / "and whenever theseus does something that is
   better than best in class, those bars overfill". 16:25: "one of the bars should start off as weight ... and then we show
   it switching to density later as much more accurate metric"; "the xa25 also needs to be in the density metrics". 16:30:
   "size of mouse should be shown in a bar too by volume"; "we can show density being calculated by dividing the weight bar
   by the size bar".
   - Categories: what a player reads that has a real figure, on one method, for the flagships shown (the deck's own data;
     nothing typed here). Weight (as weighed: RTINGS's, TechPowerUp's or XBAB's scale; the X2F has only Pulsar's listing,
     and says so), Size (its box's volume: not a score, drawn hollow, against the largest box here), Density (weight ÷
     size: the weight bar's successor, from the giants' slide on), Battery (hours at 1 khz, the makers' ratings: few rate
     8 khz), Motion latency (wireless at 8 khz, PIAKNOW'S rig). Click (press to PC, Finalmouse's rig) is built but off
     (?click=1): on that rig the magnetic Starlight X's 2.0 ms beats Theseus's derived "under 4.2 ms" (F54.4), so the bar
     could never fill. Brock's call.
   - A blank is said in words ("No rating", "Not measured", "Wired only") on a dashed track, never drawn as a short bar.
   - The scale, said once on the giants' slide: in each column the best of the six is the line (100 %); a lower-is-better
     figure is best ÷ figure. Only Theseus passes the line: its overflow drawn to scale to LO.max of the line, past that a
     break and the factor ("2.4×").
   - Theseus's bars fill a step with each move that earns them (cats[].earn), each step a share toward the line, and reach
     their figure with the last. The dock (top right, every slide after the giants') shows them as they stand.
   ============================== */
const LO = {
  max: 1.3,
  click: FILM_Q.get('click') === '1',
  cats: [
    { key: 'weight', name: 'Weight', mt: 'As weighed, g', metric: 'As weighed, g', ms: 'as weighed, g', better: 'lower', dec: 1, unit: 'g' },
    /* V4: density's last step is move 6, its smaller battery taking it past the XA25's line (moves 7 and 8 add no weight
       and take none off: they keep the bar where it is) */
    { key: 'density', name: 'Density', mt: 'Weight ÷ size, g/cm³', metric: 'Weight ÷ size, g/cm³', ms: 'weight ÷ size, g/cm³', better: 'lower', dec: 3, unit: 'g/cm³', earn: [2, 3, 6] },
    { key: 'size', name: 'Size', mt: 'Its box, cm³, not a score', mt5: 'Its box, not a score', metric: 'Volume of its box, cm³ (not a score)', ms: 'its box, cm³', size: true, dec: 1, unit: 'cm³', earn: [1] },
    { key: 'battery', name: 'Battery', mt: 'Hours at 1 khz, as rated', mt5: 'Hours at 1 khz, rated', metric: 'Hours at 1 khz, the maker’s rating', ms: 'hours at 1 khz', better: 'higher', dec: 0, unit: 'h', earn: [6] },
    { key: 'motion', name: 'Motion latency', short: 'Motion', mt: 'Wireless, 8 khz, PIAKNOW’S rig', mt5: 'Wireless, at 8 khz', metric: 'Wireless at 8 khz, ms, PIAKNOW’S rig', ms: 'wireless, 8 khz, ms', better: 'lower', dec: 2, unit: 'ms', earn: [5, 6] },
    { key: 'click', name: 'Click', mt: 'Press to PC, Finalmouse’s rig', mt5: 'Press to PC, Finalmouse’s', metric: 'Press to PC, ms, Finalmouse’s rig', ms: 'press to PC, ms', better: 'lower', dec: 1, unit: 'ms', earn: [4], opt: true }
  ],
  /* the seven flagships, heaviest first: the four with the fullest data, the X2F (its size is its trick), and the two that are
     lighter for their size than Theseus, each with how it gets there (Brock, 16:42: "punish their density scores for
     cheating"): the HTS Plus Pro 8K (no bottom rim, its maker's weight) and the XA25 (wired: no battery, no radio). tag: said
     on the lightness bar, in red; holes: TechPowerUp; bottom rims: Brock */
  mice: [
    { id: 'logitech-superstrike', brand: 'Logitech', name: 'G Pro X2 Superstrike', pk: 'Logitech G PRO X2 SUPERSTRIKE', fm: 'GPX2 Superstrike' },
    { id: 'razer-viper-v4-pro', brand: 'Razer', name: 'Viper V4 Pro', pk: 'Razer Viper V4 Pro', fm: 'Viper V4 Pro' },
    { id: 'finalmouse-slx', brand: 'Finalmouse', name: 'Starlight X', fm: 'Starlight X' },
    { id: 'gw-hts-ultra', brand: 'G-Wolves', name: 'HTS Ultra 8K', tag: 'holes, no rim' },
    { id: 'pulsar-x2f-crazylight', brand: 'Pulsar', name: 'X2F CrazyLight', x2f: true, tag: 'half a shell' },
    { id: 'gw-hts-plus-pro', brand: 'G-Wolves', name: 'HTS Plus Pro 8K', tag: 'no rim' },
    { id: 'xbab-xa25', brand: 'XBAB', name: 'XA25', wired: true, tag: 'wired' }
  ]
};
const lo_cat = k => LO.cats.find(c => c.key === k);
/** the columns: the lightness bar as weight (before the giants' division) or density (after it), then size, battery,
   motion, and click when it is on */
const lo_cols = post => [lo_cat(post ? 'density' : 'weight'), lo_cat('size'), lo_cat('battery'), lo_cat('motion')].concat(LO.click ? [lo_cat('click')] : []);
/** PIAKNOW'S wireless 8 khz figure for a mouse, by the name on the chart */
function lo_pk(name) { const rows = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []); const r = rows.find(q => q.mouse === name && q.connection === 'Wireless' && rv(q.ms_8000Hz) != null); return r ? rv(r.ms_8000Hz) : null; }
/** Finalmouse's press-to-PC figure (its own rig, PC Gamer, Sept 2026) */
function lo_fm(name) { const e = ((RD.latency || {}).click_latency_other || []).find(q => q && q.value && typeof q.value === 'object' && q.value['Starlight X'] != null); return e && e.value[name] != null ? e.value[name] : null; }
function lo_vals(M) {
  const m = (typeof b01_get === 'function' && b01_get(M.id)) || {}, o = {};
  const scale = m.gEv === 'measured';   /* a scale's: RTINGS, TechPowerUp, or Brock's (the XA25 and the X2F, exWeight) */
  o.weight = m.g != null ? { v: m.g, by: scale ? m.gBy : null, listed: !scale } : { none: 'Not weighed' };
  o.size = m.L && m.W && m.H ? { v: m.L * m.W * m.H / 1000 } : { none: 'No box' };
  o.density = o.weight.v != null && o.size.v != null ? { v: o.weight.v / o.size.v, listed: o.weight.listed } : { none: 'Not weighed' };
  o.battery = M.wired ? { none: 'Wired only', bad: true } : m.h1k != null ? { v: m.h1k } : { none: 'No rating' };
  const pk = M.pk ? lo_pk(M.pk) : null; o.motion = M.wired ? { none: 'Wired only', bad: true } : pk != null ? { v: pk } : { none: 'Not measured' };
  const fm = M.fm ? lo_fm(M.fm) : null; o.click = fm != null ? { v: fm } : { none: 'Not measured' };
  return o;
}
function lo_thsVals() {
  const sp = typeof NTR_BAR_SPEED !== 'undefined' ? NTR_BAR_SPEED : [], mo = sp.find(r => /Motion latency, wireless/.test(r.cat)) || {}, bx = ntr_thsBox();
  return { weight: { v: THESEUS.mass }, size: { v: bx.v }, density: { v: THESEUS.mass / bx.v }, battery: { v: THESEUS.hours }, motion: { v: mo.tv != null ? mo.tv : 0.14 },
    click: { v: typeof b01_pressTgt === 'function' ? b01_pressTgt() : 4.2, under: true } };
}
/** the table: each flagship's figures and fills, the best (the line) in each column, Theseus's figures and final fills */
function lo_table() {
  if (lo_table.v) return lo_table.v;
  const rows = LO.mice.map(M => Object.assign({ M }, lo_vals(M))), ths = lo_thsVals(), best = {};
  const sizeMax = Math.max(ths.size.v, ...rows.map(r => r.size.v || 0));
  for (const c of LO.cats) {
    if (c.size) { for (const x of rows.map(r => r.size).concat([ths.size])) if (x.v != null) x.f = x.v / sizeMax; best.size = { v: sizeMax }; continue; }
    const have = rows.filter(r => r[c.key].v != null); if (!have.length) continue;
    const b = c.better === 'lower' ? Math.min(...have.map(r => r[c.key].v)) : Math.max(...have.map(r => r[c.key].v));
    best[c.key] = { v: b, who: have.find(r => r[c.key].v === b).M };
    const fOf = v => c.better === 'lower' ? b / v : v / b;
    for (const r of have) { r[c.key].f = fOf(r[c.key].v); r[c.key].best = r[c.key].v === b; }
    ths[c.key].f = fOf(ths[c.key].v);
  }
  return (lo_table.v = { rows, ths, best });
}
/** a figure as shown: one precision per column; a blank's words */
const lo_fmt = (c, x) => x.none ? x.none : (x.under ? 'Under ' : '') + fmtN(x.v, c.dec) + ' ' + c.unit;
/** Theseus's bar for column c with move n landed and k of the way through move n's own step: { f, d (steps landed), N, F
   (its final fill), done }. A step a move, each its share toward the line; the last step takes the bar to its figure */
function lo_thsAt(c, n, k = 1) {
  const E0 = c.earn || [], N = Math.max(1, E0.length), F = lo_table().ths[c.key].f || 0;
  const d = E0.filter(m => m < n).length + (E0.includes(n) ? clamp(k) : 0);
  const f = d <= N - 1 ? d / N : lerp((N - 1) / N, F, d - (N - 1));
  return { f: c.size ? F * Math.min(1, d) : f, d, N, F, done: d >= N - 1e-6 };
}

/* ---------- one bar ----------
   x, y: top left; L: the line's length (100 %); h: its thickness. o = { f (fill; 1 = the line), ths (Theseus's), d, N
   (Theseus: steps landed of N), size (not a score: hollow, against the largest box, no line), best (holds the line), none
   (a blank: dashed track, no fill), gap (false: no red shortfall), tick (false: no line tick; the table draws one line per
   column), pulse (0..1, the overflow's one-shot ring), a } */
function lo_bar(x, y, L, h, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const r = Math.min(3, h / 2), f = Math.max(0, o.f || 0), ths = !!o.ths;
  G.save(); G.globalAlpha = a;
  if (o.size) {
    if (f > 0.003) { rrPath(x, y, Math.max(h, f * L), h, r); G.fillStyle = ths ? rgba(C.hero, 0.2) : inkA(TH ? 0.07 : 0.1); G.fill(); G.lineWidth = 1.6; G.strokeStyle = ths ? C.hero : inkA(TH ? 0.5 : 0.55); G.stroke(); }
    else { G.setLineDash([3, 4]); rrPath(x + 0.5, y + 0.5, L - 1, h - 1, r); G.lineWidth = 1.2; G.strokeStyle = ths ? rgba(C.hero, 0.5) : inkA(0.25); G.stroke(); G.setLineDash([]); }
    G.restore(); return;
  }
  if (o.none) { G.setLineDash([3, 4]); rrPath(x + 0.5, y + 0.5, L - 1, h - 1, r); G.lineWidth = 1.2; G.strokeStyle = inkA(0.28); G.stroke(); G.setLineDash([]); }
  else { rrPath(x, y, L, h, r); G.fillStyle = ths ? rgba(C.hero, TH ? 0.1 : 0.16) : C.track; G.fill(); }
  if (!o.none && f > 0.002) {
    if (!ths) {
      const w = Math.min(1, f) * L;
      rrPath(x, y, w, h, r); G.fillStyle = o.best ? C.ink2 : C.comp; G.fill();
      /* what it gives up: the shortfall to the line, faintly red */
      if (f < 0.995 && o.gap !== false) { G.fillStyle = rgba(C.red, TH ? 0.2 : 0.3); G.fillRect(x + w + 2, y, Math.max(0, L - w - 2), h); }
    } else lo_thsFill(x, y, L, h, r, f, o);
  }
  G.restore();
  if (o.tick !== false) line(x + L, y - 4, x + L, y + h + 4, { color: C.ink2, w: 2, alpha: a });
}
/** Theseus's fill: steps landed at half strength with a hairline between them; from its last step on, solid, and past the
   line the overflow, brighter, with a soft glow; capped at LO.max with a break and the factor */
function lo_thsFill(x, y, L, h, r, f, o) {
  const N = o.N || 1, d = o.d == null ? N : o.d, X = v => x + Math.min(v, LO.max) * L, blue = C.hero;
  if (d <= N - 1 + 1e-6) {
    const nd = Math.floor(d + 1e-6);
    for (let j = 0; j <= nd; j++) { const a0 = j / N, a1 = Math.min((j + 1) / N, f); if (a1 <= a0 + 1e-4) continue; rrPath(X(a0) + (j ? 1.5 : 0), y, X(a1) - X(a0) - (j ? 1.5 : 0), h, r); G.fillStyle = rgba(blue, 0.55); G.fill(); }
    return;
  }
  rrPath(x, y, Math.min(1, f) * L, h, r); G.fillStyle = blue; G.fill();
  if (f <= 1) return;
  const x0 = x + L, x1 = X(f), gr = G.createLinearGradient(x0, 0, x1 + 1, 0);
  gr.addColorStop(0, blue); gr.addColorStop(1, C.heroGrad[0]);
  G.save(); G.shadowColor = rgba(blue, 0.9); G.shadowBlur = Math.max(6, h * 1.1);
  rrPath(x0 - r, y, x1 - x0 + r, h, r); G.fillStyle = gr; G.fill(); G.restore();
  if (o.pulse > 0 && o.pulse < 1) { const p = E.out3(o.pulse), sp = 3 + 9 * p; G.save(); G.globalAlpha *= (1 - p) * 0.9; G.lineWidth = 2; G.strokeStyle = C.heroGrad[0]; rrPath(x0 - sp, y - sp, x1 - x0 + 2 * sp, h + 2 * sp, r + sp); G.stroke(); G.restore(); }
  if (f > LO.max + 1e-6) {
    /* the break: the bar runs on past the page; the factor says how far */
    const bx = x0 + (LO.max - 1) * L * 0.62;
    G.save(); G.strokeStyle = C.bg; G.lineWidth = Math.max(2.5, h * 0.3); G.beginPath();
    G.moveTo(bx - h * 0.35, y + h + 2); G.lineTo(bx + h * 0.35, y - 2); G.moveTo(bx + h * 0.45, y + h + 2); G.lineTo(bx + h * 1.15, y - 2); G.stroke(); G.restore();
  }
}
/** the factor printed past a capped bar ("2.4×"), and its width */
const lo_capTxt = f => fmtN(f, 1) + '×';

/* ============================== the silhouettes (V3; Brock, 17:04) ==============================
   "these use the wrong generic mouse silhouette, they should be using the same one as theseus" / "we need a separate
   silhouette of a half theseus to use for pure fingertip mice as well". Every rival is Theseus's own simplified mouse
   (mouseSimple), scaled to the rival's length and width (and height, seen from the side or the end), in a rival's grey;
   only Theseus is blue. A pure fingertip mouse is half a Theseus: the same outline with the back cut off where the mouse
   stops (the X2F at its 87.5 mm), the cut's corners rounded, its width scaled to the mouse's. Drawn inside part(), in mm,
   in mouseSimple's own frame (top: x across, nose at -y). */
/** the rival's grey: fill and outline (rvCols, the kit's) */
const film_rvCol = () => (typeof rvCols === 'function' ? rvCols('grey') : { out: C.comp, body: C.panel });
/** scale the frame by (sx, sy) about (px, py), keeping XF readable (lw() reads the x scale: rivals are within 10 % of 1) */
function film_xs(px, py, sx, sy) { xmove(px, py); G.scale(sx, sy); const m = XF.m; m[0] *= sx; m[1] *= sx; m[2] *= sy; m[3] *= sy; xmove(-px, -py); }
/** a full-size rival from above (or 'bottom'): Theseus's mouse at dims [L, W] mm, centred where Theseus's box centre is.
   o: mouseSimple's (lw, alpha, show), plus col ('grey' default; a colour for the one named rival). Returns { nose, sx, sy } */
function film_rival(view, dims, o = {}) {
  const V = msView(view), cx = V.box[0] + V.box[2] / 2, cy = V.box[1] + V.box[3] / 2, sx = dims[1] / V.box[2], sy = dims[0] / V.box[3];
  const rc = film_rvCol(), out = o.col && o.col !== 'grey' ? o.col : rc.out;
  xsave(); film_xs(cx, cy, sx, sy);
  mouseSimple(view, Object.assign({ fill: rc.body, line: out }, o, { col: undefined }));
  xrest();
  return { nose: cy + (V.box[1] - cy) * sy, sx, sy, cx, cy };
}
/** the half Theseus's outline from above, in mouseSimple's top frame: the outline kept from the nose to cut mm, the cut
   straight across with its corners rounded r mm. Cached by cut */
function film_halfTop(cut, r = 4) {
  film_halfTop.c = film_halfTop.c || {}; const key = cut + ':' + r; if (film_halfTop.c[key]) return film_halfTop.c[key];
  const V = msView('top'), yc = V.box[1] + cut, P = V.outPts, kept = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], ina = a[1] <= yc, inb = b[1] <= yc;
    if (ina) kept.push(a);
    if (ina !== inb) { const u = (yc - a[1]) / (b[1] - a[1]); kept.push([a[0] + (b[0] - a[0]) * u, yc]); }
  }
  /* the two corners on the cut: replaced by quarter-round arcs (a quadratic through the corner) */
  const pts = [], n = kept.length, onCut = q => Math.abs(q[1] - yc) < 1e-6;
  for (let i = 0; i < n; i++) {
    const q = kept[i], p0 = kept[(i - 1 + n) % n], p1 = kept[(i + 1) % n];
    if (onCut(q) && (onCut(p0) !== onCut(p1))) {
      const side = onCut(p0) ? p1 : p0, along = (u, to) => { const d = Math.hypot(to[0] - q[0], to[1] - q[1]) || 1; return [q[0] + (to[0] - q[0]) * Math.min(1, u / d), q[1] + (to[1] - q[1]) * Math.min(1, u / d)]; };
      const A = along(r, onCut(p0) ? p0 : side), B = along(r, onCut(p0) ? side : p1);
      for (let k = 0; k <= 8; k++) { const u = k / 8, w0 = (1 - u) * (1 - u), w1 = 2 * u * (1 - u), w2 = u * u; pts.push([w0 * A[0] + w1 * q[0] + w2 * B[0], w0 * A[1] + w1 * q[1] + w2 * B[1]]); }
    } else pts.push(q);
  }
  let w = 0; for (const q of pts) w = Math.max(w, Math.abs(q[0]));
  const path = new Path2D(); pts.forEach((q, i) => (i ? path.lineTo(q[0], q[1]) : path.moveTo(q[0], q[1]))); path.closePath();
  return (film_halfTop.c[key] = { pts, path, W: 2 * w, y0: V.box[1], y1: yc });
}
/** half a Theseus from above, for a pure fingertip mouse: dims [L, W] mm (the cut is at L), centred on (0, 0) of the
   frame. o: lw, alpha, col */
function film_half(dims, o = {}) {
  const H = film_halfTop(dims[0]), sx = dims[1] / H.W, cy = (H.y0 + H.y1) / 2, rc = film_rvCol(), out = o.col && o.col !== 'grey' ? o.col : rc.out;
  xsave(); xmove(0, -cy); film_xs(0, cy, sx, 1);
  G.save(); G.clip(H.path);
  mouseSimple('top', Object.assign({ fill: rc.body }, o, { col: undefined, line: 'rgba(0,0,0,0)' }));
  G.restore();
  G.save(); G.globalAlpha = PA * (o.alpha == null ? 1 : o.alpha); G.lineJoin = 'round'; G.strokeStyle = out; G.lineWidth = lw(o.lw || 2); G.stroke(H.path); G.restore();
  xrest();
}
/** the half Theseus as points, for the box views (ntr_sizewt): top [l from the nose, w across], side [l, h], end [x, h];
   each scaled to the mouse's box dims [L, W, H] (the side's tallest point at H, the end at W × H) */
function film_halfPts(dims) {
  const [L, W, H] = dims, T = film_halfTop(L), sx = W / T.W;
  const top = T.pts.map(([x, y]) => [y - T.y0, x * sx]);
  /* the side: MS_SIDE (z, h; the nose at the largest z), cut L mm from the nose */
  const zs = MS_SIDE.map(q => q[0]), z1 = Math.max(...zs), zc = z1 - L, sp = [];
  for (let i = 0; i < MS_SIDE.length; i++) {
    const a = MS_SIDE[i], b = MS_SIDE[(i + 1) % MS_SIDE.length], ina = a[0] >= zc, inb = b[0] >= zc;
    if (ina) sp.push(a);
    if (ina !== inb) { const u = (zc - a[0]) / (b[0] - a[0]); sp.push([zc, a[1] + (b[1] - a[1]) * u]); }
  }
  const hMax = Math.max(...sp.map(q => q[1])), side = sp.map(([z, h]) => [z1 - z, h * H / hMax]);
  const fw = Math.max(...MS_FRONT.map(q => Math.abs(q[0]))) * 2, fh = Math.max(...MS_FRONT.map(q => q[1])), end = MS_FRONT.map(([x, h]) => [x * W / fw, h * H / fh]);
  return { top, side, end };
}

/* ---------- the loadout's silhouettes: Theseus's own for every flagship at its own length and width, half a Theseus for
   the fingertip X2F (Brock, 17:04), Theseus blue. Nose left ---------- */
function lo_sil(M, cx, cy, s, a) {
  if (a <= 0.003) return;
  if (!M) { part(cx, cy, s, () => mouseSimple('top', { lw: 1.6, col: 'hero', hi: ['shell'], lit: 0.5 }), { rot: -Math.PI / 2, alpha: a }); return; }
  const m = typeof b01_get === 'function' ? b01_get(M.id) : null, dims = m && m.L ? [m.L, m.W, m.H] : [THESEUS.dims[0], THESEUS.dims[1], THESEUS.dims[2]];
  if (M.x2f) { part(cx, cy, s, () => film_half(dims, { lw: 1.6 }), { rot: -Math.PI / 2, alpha: a }); return; }
  part(cx, cy, s, () => {
    const R = film_rival('top', dims, { lw: 1.6 });
    /* the XA25's cable, out of its nose: it is wired */
    if (M.wired) { const y = R.nose; G.save(); G.globalAlpha = PA; G.strokeStyle = C.red; G.lineWidth = lw(2.2); G.lineCap = 'round'; G.beginPath(); G.moveTo(0, y); G.bezierCurveTo(0, y - 8, 4, y - 10, 3, y - 18); G.stroke(); G.restore(); }
  }, { rot: -Math.PI / 2, alpha: a });
}

/* ---------- the dock: Theseus's bars on every slide after the giants', top right on the label row ---------- */
const LO_DOCK = { y: 79, h: 8, L: 92, gap: 30, labY: 68 };
const LO_DLAB = { role: 'foot', size: 19, weight: 700, caps: true, track: 0.1 }, LO_DFIG = { role: 'foot', size: 19, weight: 750, tnum: true };
/** the cells, right-aligned at RM: { c, x, w, L, y, h }. Space for every final figure is kept, so nothing moves as bars fill */
function lo_dockGeo() {
  if (lo_dockGeo.v && lo_dockGeo.th === TH) return lo_dockGeo.v;
  const D = LO_DOCK, T = lo_table(), out = []; let xr = RM;
  for (const c of lo_cols(true).slice().reverse()) {
    const fin = T.ths[c.key], cap = !c.size && fin.f > LO.max ? tw(lo_capTxt(fin.f), LO_DFIG) + 10 : 0;
    const lab = tw(c.short || c.name, LO_DLAB), fig = tw(lo_fmt(c, fin), LO_DFIG);
    const w = Math.ceil(Math.max(D.L * (c.size ? 1 : LO.max) + cap, lab + 10 + fig));
    out.unshift({ c, x: xr - w, w, L: D.L, y: D.y, h: D.h }); xr -= w + D.gap;
  }
  lo_dockGeo.th = TH; return (lo_dockGeo.v = out);
}
/** the dock with move n landed (k: how far move n's own steps are, for a slide that animates it). o = { a, cells (from a
   flight: per-cell overrides { x, y, L, h, la (label alpha) }) } */
function lo_dock(n, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  lo_dockGeo().forEach((g, i) => {
    const c = g.c, st = lo_thsAt(c, n, o.k == null ? 1 : o.k), ov = o.cells ? o.cells[i] : null, x = ov ? ov.x : g.x, y = ov ? ov.y : g.y, L = ov ? ov.L : g.L, h = ov ? ov.h : g.h, la = (ov && ov.la != null ? ov.la : 1) * a;
    text(c.short || c.name, g.x, LO_DOCK.labY, Object.assign({ color: C.ink2, alpha: la }, LO_DLAB));
    if (st.done && st.d > 0) text(lo_fmt(c, lo_table().ths[c.key]), g.x + g.w, LO_DOCK.labY, Object.assign({ color: C.heroText, align: 'right', alpha: la }, LO_DFIG));
    lo_bar(x, y, L, h, { f: st.f, ths: true, d: st.d, N: st.N, size: c.size, a, tick: !c.size });
    if (!c.size && st.done && st.f > LO.max) text(lo_capTxt(st.f), x + L * LO.max + 6, y + h + 1, Object.assign({ color: C.heroText, alpha: a }, LO_DFIG));
  });
}
/** the dock is on from the slide after the giants' slide, on every slide with chrome that isn't a move card */
function lo_dockOn(s) {
  if (!FILM.on || !s || s.filmCard || s.chrome === false || s.loSelf) return false;
  const i = DECK.slides.indexOf(s), iG = DECK.slides.findIndex(x => x.id === 'loadouts');
  return iG >= 0 && i > iG;
}

/* ---------- Theseus's loadout at full size (the move cards, the rule): a row a column, label and metric, the figure at
   the right when its bar is done, the bar, and under it the moves that fill it ---------- */
/** x, y: top left; w wide; n: the move landed, k: how far move n's own steps are; o = { rh, plan (the rule: no fills, the
   moves that fill each bar and who holds the line), pulse (t of this move's overflow ring, or a function of the column), a,
   head } */
function lo_panel(t, x, y, w, n, o = {}) {
  const a0 = o.a == null ? 1 : o.a; if (a0 <= 0.003) return;
  const T = lo_table(), cols = lo_cols(true), rh = o.rh || 70, capW = 54, L = Math.floor((w - capW) / LO.max), bh = o.bh || 14;
  if (o.head !== false) {
    text(o.head || 'Theseus’s loadout', x, y, { role: 'label', size: 19, color: C.heroText, alpha: a0 });
    const lx = x + w - tw('The line: the best flagship', { role: 'label', size: 19 });
    line(lx - 14, y - 15, lx - 14, y + 3, { color: C.ink2, w: 2, alpha: a0 });
    text('The line: the best flagship', x + w, y, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: a0 });
  }
  cols.forEach((c, i) => {
    const yy = y + 26 + i * rh, st = o.plan ? { f: 0, d: 0, N: (c.earn || []).length || 1, done: false } : lo_thsAt(c, n, o.k == null ? 1 : o.k), fin = T.ths[c.key];
    rich([{ s: c.name, role: 'label', size: 20, color: C.ink2 }, { s: c.ms, role: 'foot', size: 19, weight: 600, color: C.faint, gap: 12, sentence: false }], x, yy + 20, { alpha: a0 });
    const by = yy + 30;
    if (o.plan) {
      const mv = (c.earn || []), ms = (mv.length > 1 ? 'Moves ' : 'Move ') + mv.join(', ');
      text(ms, x + w, yy + 20, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: a0 });
      const b = T.best[c.key];
      if (b && !c.size) text('The line: ' + b.who.brand + ' ' + b.who.name + ', ' + lo_fmt(c, b) + (b.who.tag && (c.key === 'density' || c.key === 'weight') ? ', ' + b.who.tag : ''), x + L, by + bh + 24, { role: 'foot', size: 19, weight: 600, color: C.mute, align: 'right', alpha: a0, sentence: false });
      else if (c.size) text('Not a score: the volume Theseus keeps, against the largest box', x, by + bh + 24, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: a0, sentence: false });
    } else if (st.done && st.d > 0) {
      text(lo_fmt(c, fin), x + w, yy + 20, { role: 'num', size: 24, weight: 800, color: C.heroText, align: 'right', alpha: a0 });
    }
    const pulse = typeof o.pulse === 'function' ? o.pulse(c) : 0;
    lo_bar(x, by, L, bh, { f: st.f, ths: true, d: st.d, N: st.N, size: c.size, a: a0, pulse });
    if (!o.plan && !c.size && st.done && st.f > LO.max) text(lo_capTxt(st.f), x + L * LO.max + 8, by + bh, { role: 'num', size: 22, weight: 800, color: C.heroText, alpha: a0 });
    /* where it came from: the move under each step */
    if (!o.plan && (c.earn || []).length && st.d > 0) {
      const N = st.N, X = v => x + Math.min(v, LO.max) * L;
      c.earn.forEach((m, j) => {
        if (j + 1 > Math.ceil(st.d - 1e-6)) return;
        const a1 = j === N - 1 ? Math.min(st.f, LO.max) : (j + 1) / N, cxm = (X(j / N) + X(a1)) / 2;
        text(String(m), c.size ? x + 12 : cxm, by + bh + (rh < 70 ? 16 : 19), { role: 'foot', size: 19, weight: 700, color: m === n ? C.heroText : C.faint, align: c.size ? 'left' : 'center', alpha: a0 });
      });
    }
  });
  return { h: 26 + cols.length * rh };
}

/* ---------- the giants' loadouts (move 0's hero slide, in b01_compromise's place) ----------
   A loadout screen: six flagships, a row each, the generic silhouette at its own size, its bars in five columns (weight,
   size, battery, motion latency). Then the weight bar is divided by the size bar and becomes density (Brock, 16:30): the
   X2F, light because it is small, falls; the wired XA25 holds the line. Theseus's row arrives empty, and its bars dock top
   right, where they fill through the film. */
const LO_G = { hy: 318, y0: 386, rh: 64, yT: 862, x0: 520, silX: 128, sil: 0.66, nameX: 196 };
const LO_T = { bars: 0.45, row: 0.4, div: 4.7, ths: 7.4, dock: 9.2, dockD: 1.1 };
function lo_giants(t) {
  header(t, 'No flagship fills every bar');
  const nW = ['five', 'six', 'seven', 'eight'][LO.mice.length - 5] || String(LO.mice.length);
  captions(t, [[0.3, 'Each flagship’s specs as bars, the way a game shows a loadout. The line in each column is the best of these ' + nW + '.'],
    [LO_T.div - 0.3, 'Weight flatters a small mouse. Divide each weight by its size and the bar becomes density: the X2F falls, and the wired XA25 leads.'],
    [LO_T.ths - 0.2, 'None fills every bar: each wins one or two and gives others up. Theseus starts with every bar to fill.']]);
  /* the columns: the lightness column wider (its figures carry how each got light), every bar on one length */
  const T = lo_table(), G0 = LO_G, pre = lo_cols(false), post = lo_cols(true), nC = pre.length, wts = pre.map((c, i) => (i === 0 ? 1.35 : c.key === 'motion' ? 1.0 : 0.9)), sw = wts.reduce((a, b) => a + b, 0);
  const cws = wts.map(w => (RM - G0.x0) * w / sw), xs = cws.map((w, i) => G0.x0 + cws.slice(0, i).reduce((a, b) => a + b, 0));
  const L = Math.floor((Math.min(...cws) - 40) / LO.max), bh = 13, cx = i => xs[i], mt = c => (nC > 4 && c.mt5) || c.mt;
  const t1 = LO_T.div, kG = ep(t, t1 + 0.1, t1 + 0.8, E.io3), kDiv = ep(t, t1 + 0.7, t1 + 1.5, E.io3), kDivTxt = ep(t, t1 + 1.0, t1 + 1.4);
  const lastY = G0.y0 + (T.rows.length - 1) * G0.rh;
  /* the column heads: name, metric; the first turns from weight into density */
  pre.forEach((c, i) => {
    const x = cx(i), a = ep(t, -1, 0);
    if (i === 0) {
      const d = post[0];
      text(c.name, x, G0.hy, { role: 'label', size: 21, color: C.ink, alpha: a * (1 - kDivTxt) });
      text(mt(c), x, G0.hy + 26, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: a * (1 - kDivTxt), sentence: false });
      text(d.name, x, G0.hy, { role: 'label', size: 21, color: C.ink, alpha: kDivTxt });
      text(mt(d), x, G0.hy + 26, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: kDivTxt, sentence: false });
    } else {
      text(c.name, x, G0.hy, { role: 'label', size: 21, color: C.ink, alpha: a });
      text(mt(c), x, G0.hy + 26, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: a, sentence: false });
    }
    /* the line: one per score column, through every row */
    if (!c.size) line(x + L, G0.y0 - 22, x + L, lastY + G0.rh - 30, { color: C.ink2, w: 1.6, alpha: 0.55 * a });
  });
  /* the division: weight ÷ size, said in the heads, then each size bar slides onto its weight bar and the bar becomes density */
  { const kd = env(t, t1, t1 + 0.35, t1 + 1.3, t1 + 1.7); if (kd > 0.003) text('÷', cx(1) - 22, G0.hy + 4, { font: 'disp', size: 40, weight: 700, color: C.ink, align: 'center', alpha: kd }); }
  /* the rows */
  T.rows.forEach((r, j) => {
    const y = G0.y0 + j * G0.rh, ta = ep(t, -1, 0), M = r.M;
    lo_sil(M, G0.silX, y + 6, G0.sil, ta);
    text(M.brand, G0.nameX, y - 6, { role: 'label', size: 19, color: C.mute, alpha: ta });
    text(M.name, G0.nameX, y + 24, { role: 'h3', size: 25, weight: 750, color: C.ink, alpha: ta, sentence: false, maxW: G0.x0 - G0.nameX - 20 });
    pre.forEach((c, i) => {
      const x = cx(i), tb = LO_T.bars + j * LO_T.row + i * 0.07, kb = ep(t, tb, tb + 0.5, E.snap), kf = ep(t, tb + 0.15, tb + 0.45);
      let v = r[c.key], f = v.f || 0, txt = lo_fmt(c, v), best = !!v.best;
      if (i === 0) {
        const d = r.density, fd = d.f || 0;
        f = lerp(f, fd, kDiv); best = kDiv < 0.5 ? best : !!d.best;
        /* the figure rolls from weight to density; a listed weight says so, and how a mouse gets light is said in red */
        const fig = (s0, b0, a) => rich([{ s: s0, role: 'num', size: 22, weight: 700, color: b0 ? C.ink : C.ink2 }, v.listed ? { s: 'listed', role: 'foot', size: 19, weight: 650, color: C.mute, gap: 8 } : null,
          M.tag ? { s: M.tag, role: 'foot', size: 19, weight: 700, color: C.red, gap: 8 } : null], x, y - 2, { alpha: a });
        fig(txt, !!v.best, kf * (1 - kDivTxt)); if (kDivTxt > 0) fig(lo_fmt(post[0], d), !!d.best, kf * kDivTxt);
        txt = null;
      }
      if (txt != null) text(txt, x, y - 2, { role: 'num', size: 22, weight: 700, color: v.none ? (v.bad ? C.red : C.faint) : best ? C.ink : C.ink2, alpha: kf });
      lo_bar(x, y + 8, L, bh, { f: f * kb, best, none: v.none, size: c.size, tick: false, gap: kb > 0.99 });
    });
    /* the size bar's copy slides onto the weight bar: weight ÷ size */
    if (kG > 0.003 && kG < 0.999 && r.size.v != null) {
      const gx = lerp(cx(1), cx(0), kG), ga = Math.sin(Math.PI * kG);
      lo_bar(gx, y + 8, L, bh, { f: r.size.f, size: true, a: ga * 0.9, tick: false });
    }
  });
  /* the scale, said once */
  text('The line: the best of these ' + (['five', 'six', 'seven', 'eight'][LO.mice.length - 5] || LO.mice.length) + '. Lower is better: best ÷ figure. Size is not a score.', RM, G0.hy - 44, { role: 'foot', size: 19, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 0.8, 1.3), sentence: false });
  /* Theseus's row: empty, every bar to fill */
  { const y = G0.yT, ka = ep(t, LO_T.ths, LO_T.ths + 0.5), rise = (1 - E.out3(ka)) * 16;
    if (ka > 0.003) {
      rr(LM - 16, y - 40 + rise, RM - LM + 32, G0.rh + 4, 6, rgba(C.hero, TH ? 0.07 : 0.12), null, 0, ka);
      lo_sil(null, G0.silX, y + 6 + rise, G0.sil, ka);
      text('Nitrite Labs', G0.nameX, y - 6 + rise, { role: 'label', size: 19, color: C.heroText, alpha: ka });
      text('Theseus', G0.nameX, y + 24 + rise, { role: 'h3', size: 27, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: ka, sentence: false });
      post.forEach((c, i) => {
        const x = cx(i);
        text(c.earn ? ((c.earn.length > 1 ? 'Moves ' : 'Move ') + c.earn.join(', ')) : '', x, y - 2 + rise, { role: 'foot', size: 19, weight: 700, color: C.heroText, alpha: ka * ep(t, LO_T.ths + 0.5, LO_T.ths + 0.9) });
        lo_bar(x, y + 8 + rise, L, bh, { f: 0, ths: true, size: c.size, a: ka, tick: !c.size });
      });
    }
    /* the dock: a copy of the row's bars flies top right, where they will fill */
    const kF = i => ep(t, LO_T.dock + i * 0.06, LO_T.dock + LO_T.dockD + i * 0.06, E.cam);
    if (t >= LO_T.dock) {
      const geo = lo_dockGeo(), cells = geo.map((g, i) => { const k = kF(i); return { x: lerp(cx(i), g.x, k), y: lerp(y + 8, g.y, k), L: lerp(L, g.L, k), h: lerp(bh, g.h, k), la: ep(t, LO_T.dock + LO_T.dockD - 0.3, LO_T.dock + LO_T.dockD + 0.1) }; });
      lo_dock(0, { cells });
    }
  }
  source(t, 'Weights: RTINGS’s scale (Superstrike, Viper V4 Pro, Starlight X), TechPowerUp’s (HTS Ultra 8K, ± 1 g), Brock’s (XA25 25.37 g, X2F 29.5 g; listed 25 ± 1 and 29 ± 2); the HTS Plus Pro 8K only lists 28 g. Size: the makers’ L × W × H. Battery: makers’ hours at 1 khz; Finalmouse, Pulsar and the Plus Pro rate none. Motion: PIAKNOW’S rig. Holes: TechPowerUp; rims: Brock. Theseus: targets.', { t0: 1.0 });
}
S({ id: 'loadouts', ch: 'intro', theme: 'night', title: 'No flagship fills every bar', settle: 11, loSelf: true,
  src: ['exRtings', 'b01TpuHtsU', 'b01GwHtsU', 'b01GwPlusPro', 'brockWeighed', 'xbabSite', 'b01X2f', 'exEloshapes', 'exNbcV4', 'logiSuperstrike', 'b01SlxBatt', 'exPiaknow', 'ntrEemb', 'b01Optical', 'kunai'].concat(LO.click ? ['b01FmClick'] : []),
  draw: t => lo_giants(t) });

/* ============================== the weight ledger ==============================
   Grams saved and grams spent, against the lightest flagship weighed part by part (the XA25, on XBAB's scale), from the
   deck's own budget (ntr_budget, 14-b-intro-ex.js). Each move puts its line on it; the running total ends at THESEUS.mass
   with a battery the XA25 doesn't carry. The pilot shows move 2's goal on its card; successors add their moves' lines.
   Move 6 (V4): the battery, EEMB's 300 mAh at about 6.40 g where a 370 mAh pack weighs 8 g (Jauch, Endrich's rounded
   listing): the saving is that difference, approximate both ways, and it comes off the total, not the shell */
function filmLedger() {
  if (typeof ntr_budget !== 'function') return null;
  const B = ntr_budget(); if (!B || !B.ok) return null;
  return { B, lines: [
    { move: 2, name: 'Shell and skates', was: B.xa.shell, now: B.shell, why: 'the goal: lighter than the lightest flagship’s, at full size' },
    { move: 3, name: 'The board as a tie', was: 0, now: 0, tie: true, why: 'stiffer again for no added weight: the board is carried anyway' },
    { move: 6, name: 'Battery, ' + B.cell.mAh + ' mAh', was: ntr_oldPack().g, now: B.cell.g, battery: true, old: ntr_oldPack(), why: 'the Viper V4 Pro\u2019s size, not a bigger pack: ' + fmtN(ntr_oldPack().g - B.cell.g, 1) + ' g off the whole mouse' }
  ] };
}

/* ============================== the move cards ==============================
   The board comes forward from the dock (0 to 0.9 s); the move before completes and hands on along its links (to 1.6 s);
   what this move builds on lights blue and the move fills (1.6 to 2.6 s); what it unlocks draws out, dashed (2.8 to 3.9 s).
   Frame one carries the label and the title (the thumbnail); the lines type with their motion. */
/** the move's own figure, one line under the loadout on its card (the volume it keeps, the shell's weight goal, why a move
   fills no bar) */
function filmCardStat(n) {
  if (n === 1 && typeof ntr_thsBox === 'function') { const b = ntr_thsBox(); return 'The box it keeps: ' + fmtN(b.L, 1) + ' \u00D7 ' + fmtN(b.W, 1) + ' \u00D7 ' + fmtN(b.H, 1) + ' mm, ' + fmtN(b.v, 1) + ' cm\u00B3, a full-size mouse every later move must fill.'; }
  if (FILM.moves[n].stat) { const s0 = FILM.moves[n].stat(); if (s0) return s0; }   /* V5: moves 4 and 5 say what they gain */
  if (n === 4 && !LO.click) { const ft = typeof b01_pressTgt === 'function' ? b01_pressTgt() : 4.2; return 'Clicks fill no bar: on Finalmouse\u2019s rig, its press to PC (under ' + fmtN(ft, 1) + ' ms, derived) beats every mechanical switch timed there, not the magnetic Starlight X (2.0 ms).'; }
  if (n === 3 && typeof THESEUS !== 'undefined') return 'The tie adds 0 g: the board, ' + fmtN(THESEUS.pcb, 2) + ' g, is in the mouse anyway, and move 2\u2019s ribs end on its edge.';
  const L = filmLedger(), ln = L && L.lines.find(l => l.move === n);
  /* V4: the battery's saving, said plainly against what it is measured from (EEMB's approximate 6.4 g, Jauch's rounded 8 g) */
  if (ln && ln.battery) { const H = ntr_hours(), o = ln.old, c = L.B.cell;
    return c.mAh + ' mAh, about ' + fmtN(c.g, 1) + ' g (' + c.maker + '\u2019s figure), not a ' + o.mAh + ' mAh pack at ' + fmtN(o.g, 0) + ' g (' + o.maker + ', rounded to the gram): about ' + fmtN(o.g - c.g, 1) + ' g off, ' + THS.massG + ' in all. ' + THESEUS.hours + ' h at 1 khz and ' + Math.floor(H.h8 + 1e-9) + ' at 8 khz, derived, before any firmware gains.'; }
  if (ln && ln.was) return 'The shell\u2019s goal: ' + fmtN(ln.was - ln.now, 2) + ' g under the XA25\u2019s ' + fmtN(ln.was, 2) + ' g on XBAB\u2019s scale, the lightest flagship weighed part by part. Derived.';
  return null;
}
function filmCard(t, n) {
  const m = FILM.moves[n], prev = n - 1, kFly = ep(t, 0, 0.9, E.cam);
  /* the label row and the title: set at frame one */
  chapterIcon(m.ch, LM, LAY.labelY - 19, 22, C.ink2, 1);
  rich([{ s: 'Move ' + pad2(n), role: 'label', size: 22, color: C.ink2 }, { s: '/ ' + pad2(FILM.moves.length - 1), role: 'label', size: 22, color: C.faint, gap: 12 }], LM + 36, LAY.labelY);
  const ttl = caps(m.title), size = Math.min(112, Math.floor(1700 / Math.max(1, tw(ttl, { role: 'd2', size: 1, weight: 900, caps: false }))));
  text(ttl, LM - size * 0.04, 236, { role: 'd2', size, weight: 900, color: C.ink, caps: false });
  /* the two lines: what it builds on, what it unlocks */
  const stat = filmCardStat(n), tx = LM, tw0 = 1020;
  if (m.builds) rich([{ s: 'Builds on', role: 'label', size: 20, color: C.heroText }], tx, 318, { alpha: ep(t, 0.9, 1.2) });
  if (m.builds) text(m.builds, tx, 356, { role: 'lead', size: 30, color: C.ink2, t, t0: 1.0, cps: 75, maxW: tw0, lh: 1.3 });
  const yU = 356 + (m.builds ? wrap(sentence(m.builds), { role: 'lead', size: 30 }, tw0).length * 39 + 34 : 0);
  rich([{ s: 'Unlocks', role: 'label', size: 20, color: C.mute }], tx, yU, { alpha: ep(t, 2.6, 2.9) });
  text(m.unlocks, tx, yU + 38, { role: 'lead', size: 30, color: C.ink2, t, t0: 2.7, cps: 75, maxW: tw0, lh: 1.3 });
  /* Theseus's loadout, at the right (V2): as it stood, then this move's steps land with the move's node (2.1 to 3.0 s), an
     overflow ringing once as its bar passes the line (the close rings every one); under it, the move's own figure */
  const close = n === FILM.moves.length - 1, kS = ep(t, 2.1, 3.0, E.io3), cols = lo_cols(true);
  const pulse = c => { const E0 = c.earn || [], F = lo_table().ths[c.key].f; if (c.size || !(F > 1)) return 0; const j = cols.indexOf(c);
    return close ? prog(t, 2.4 + 0.3 * j, 3.3 + 0.3 * j) : E0[E0.length - 1] === n ? prog(t, 2.85, 3.75) : 0; };
  const P = lo_panel(t, 1200, 292, RM - 1200, n, { k: kS, pulse, rh: cols.length > 4 ? 62 : 72 });
  if (stat) text(stat, 1200, 292 + P.h + 24, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: RM - 1200, lh: 1.3, alpha: ep(t, 3.2, 3.6) });
  /* the board, from the dock to full size */
  const from = n === 1 ? FILM_RULE : FILM_DOCK, g = {}; for (const k of Object.keys(FILM_FULL)) g[k] = lerp(from[k], FILM_FULL[k], kFly);
  /* before 0.95 s the board is as the last slide's dock had it (the move before in play); then that move completes (its
     node to ink, its links in fade from blue), this move's links in draw solid blue, it fills, and its links out draw dashed */
  const kDone = ep(t, 0.95, 1.4), kIn = ep(t, 1.3, 2.3, E.io3), kFill = ep(t, 2.0, 2.5), kOut = ep(t, 2.9, 3.9, E.io3);
  const st = filmState(prev, { out: 1 });
  if (kDone > 0) {
    st.act = n; st.node[prev] = 'done'; st.was = { n: prev, k: 1 - kDone }; st.hot = {};
    for (const e of FILM.edges) {
      const key = filmEk(e);
      if (e[1] === prev) st.hot[key] = 1 - kDone;                               /* the links into the move before: blue to ink */
      if (e[0] === prev && e[1] !== n) st.k[key] = 0;                            /* its other links out wait for their own moves */
      if (e[1] === n) st.k[key] = e[0] === prev ? 1 : kIn;                      /* what this move builds on */
      if (e[0] === n && !filmToEnd(e)) st.k[key] = kOut;                         /* what it unlocks */
    }
    st.node[n] = 'act'; st.fill = kFill; st.pop = 1 + 0.18 * Math.sin(Math.PI * kFill);
  }
  filmBoard(g, st, { full: true, numA: clamp((g.r - 10) / 6), nameA: () => ep(t, 0.6, 1.0), labelA: e => e[1] === n ? ep(t, 1.6, 2.0) : ep(t, 3.4, 3.8) });
}
for (let n = 1; n < FILM.moves.length; n++) {
  const m = FILM.moves[n];
  S({ id: 'mv' + n, ch: m.ch, card: true, filmCard: true, flight: false, theme: 'night', title: 'Move ' + n + ': ' + m.title, settle: 5.6,
    src: n === 1 ? ['ntrScan'] : n === 2 ? ['exXbabWeight'] : n === 6 ? ['ntrEemb', 'ntrJauch', 'b01Optical', 'ntrTpuV4'] : [],
    draw: t => filmCard(t, n) });
}

/* ============================== the underdog's rule (move 0's last slide) ==============================
   The bar against the giants (each row held by a flagship that gives another up; Theseus's column open), the rule, and the
   plan: the whole board, faint, with move 0 done and its link to move 1 lit. */
S({ id: 'rule', ch: 'intro', theme: 'night', title: 'The underdog’s rule', settle: 9.6, src: ['exPiaknow', 'exRtings', 'exEloshapes', 'exXbabWeight', 'exNbcV4', 'ntrEemb'],
  draw: t => {
    header(t, 'The underdog’s rule');
    captions(t, [[0.4, 'Each giant fills a bar or two by giving others up. Theseus has no factory and no budget to out-spend them.'],
      [3.6, 'So it never trades. Each move is built so its gain pays for the next, and the gains compound.']]);
    /* Theseus's loadout, empty: each bar names the moves that fill it and the flagship that holds its line (V2) */
    lo_panel(t, LM, 300, 960, 0, { plan: true, rh: 82, a: ep(t, 0.9, 1.4), head: 'Theseus\u2019s loadout: the moves that fill each bar' });
    /* the rule */
    const rx = 1180, kR = ep(t, 3.4, 3.9);
    text('Never trade.', rx - 4, 410, { role: 'd2', size: 96, weight: 900, color: C.heroText, grad: C.heroGrad, caps: false, alpha: kR, rise: [3.4, 0.6], t });
    text('Make each gain pay for the next.', rx, 470, { role: 'h3', size: 34, weight: 700, color: C.ink, alpha: ep(t, 3.9, 4.4), maxW: RM - rx });
    text('Ten moves, each built on the ones before it.', rx, 528, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 4.6, 5.0), maxW: RM - rx });
    /* the plan: the whole board, faint; the nodes arrive along the line, the arcs draw by the move they feed; then move 0
       lights and hands its bar to move 1 */
    const g = FILM_RULE, kN = i => ep(t, 4.4 + i * 0.12, 4.8 + i * 0.12, E.snap);
    const kP = ep(t, 5.4, 7.2, E.io3), k0 = ep(t, 7.5, 7.9), k01 = ep(t, 7.7, 8.5, E.io3);
    const st = filmState(-1, { plan: 1 });
    st.planK = e => clamp(kP * 1.4 - (e[1] - 1) * 0.05);
    FILM.moves.forEach(m => (st.node[m.n] = 'ahead'));
    if (k0 > 0) { st.node[0] = 'act'; st.fill = k0; st.act = 0; st.k['0>1'] = k01; st.pop = 1 + 0.18 * Math.sin(Math.PI * k0); }
    text('The plan: what each move builds on', LM, 704, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 4.4, 4.8) });
    /* the nodes arrive along the line: the board drawn clipped to what has arrived */
    G.save(); const xr = lerp(g.x0 - 40, W, ep(t, 4.4, 5.8, E.io3));
    G.beginPath(); G.rect(0, 712, xr, 290); G.clip();
    filmBoard(g, st, { full: true, nameA: i => kN(i), labelA: () => ep(t, 8.3, 8.7) });
    G.restore();
  }
});

/* ============================== five upgrades, one shell (V3: move 2's last slide) ==============================
   Brock (15:12, 15:15): "show the steps to level something up to where it becomes the best"; "the concepts should visible
   and statically show how they build upon one another and combine". Move 2's five upgrades as a ladder, bottom up, each
   rung what it builds on and the figure its own slide proved (read from those slides' data, nothing typed here); then the
   shell they make, weighed against the lightest flagship's (the ledger, ntr_budget), and what that weight unlocks. */
function film_upRungs() {
  if (film_upRungs.v) return film_upRungs.v;
  const out = [];
  const M = typeof B05_M !== 'undefined' ? B05_M : null;
  out.push({ name: 'The material', on: 'Carbon-filled PP, against the resin most mice use', icon: 'strip',
    fig: M ? '−' + b05_dn((1 - M.gMatch / M.gA) * 100) + ' %' : '', figL: 'weight, same stiffness' });
  const B = typeof B12 !== 'undefined' && B12 ? B12 : null, gain = B ? 1 - B.win.worst / B.base.worst : 0;
  out.push({ name: 'The lattice', on: 'Built on the skin: ribs in triangles, not hexagons', icon: 'tri',
    fig: B ? '−' + b12_dn(gain * 100) + ' %' : '', figL: 'flex, same weight' });
  let kA = null; try { const rF = shbArch('flat'), rA = shbArch('para'); kA = b06_flex(rF) / b06_flex(rA); } catch (e) { kA = null; }
  out.push({ name: 'Arches', on: 'Built on the lattice: its ribs run whole, feet held', icon: 'arch',
    fig: kA ? fmtN(kA, 0) + '×' : '', figL: 'stiffer than a flat strip' });
  const R = FILLET.rs, P = FILLET.scfM, iP = R.indexOf(0.75) >= 0 ? R.indexOf(0.75) : P.indexOf(Math.min(...P));
  out.push({ name: 'Fillets', on: 'Built on the arches: every node they cross, rounded', icon: 'fillet',
    fig: fmtN(P[0], 1) + '× → ' + fmtN(P[iP], 1) + '×', figL: 'peak at a node, same weight' });
  let loose = null; try { const rP = 0.6, Bs = b06_tolBand(R[0]), Bf = b06_tolBand(rP); loose = Math.min(rP - Bf.lo, Bf.hi - rP) / Bs.up; } catch (e) { loose = null; }
  out.push({ name: 'The mould', on: 'Built on the fillets: one cutter fits every corner', icon: 'mould',
    fig: loose ? b06_dn(loose, 0) + '×' : '', figL: 'looser corner tolerance' });
  return (film_upRungs.v = out);
}
/** a rung's picture, in a box (cx, cy, s: half its size), drawn in col */
function film_upIcon(kind, cx, cy, s, col, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.fillStyle = col; G.lineWidth = 2.6; G.lineCap = 'round'; G.lineJoin = 'round';
  const L = (pts, close) => { G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(cx + q[0] * s, cy + q[1] * s) : G.moveTo(cx + q[0] * s, cy + q[1] * s))); if (close) G.closePath(); G.stroke(); };
  if (kind === 'strip') {          /* a strip on two supports, sagging a little */
    G.beginPath(); G.moveTo(cx - s * 0.9, cy - s * 0.12); G.quadraticCurveTo(cx, cy + s * 0.18, cx + s * 0.9, cy - s * 0.12); G.lineTo(cx + s * 0.9, cy + s * 0.04); G.quadraticCurveTo(cx, cy + s * 0.34, cx - s * 0.9, cy + s * 0.04); G.closePath(); G.fill();
    L([[-0.9, 0.2], [-0.78, 0.42], [-1.02, 0.42]], true); L([[0.9, 0.2], [0.78, 0.42], [1.02, 0.42]], true);
  } else if (kind === 'tri') {     /* a strip of triangles */
    L([[-0.95, 0.4], [0.95, 0.4]]); L([[-0.95, -0.4], [0.95, -0.4]]);
    L([[-0.95, 0.4], [-0.57, -0.4], [-0.19, 0.4], [0.19, -0.4], [0.57, 0.4], [0.95, -0.4]]);
  } else if (kind === 'arch') {    /* an arch, its feet held */
    G.beginPath(); G.moveTo(cx - s * 0.85, cy + s * 0.45); G.quadraticCurveTo(cx, cy - s * 1.15, cx + s * 0.85, cy + s * 0.45); G.stroke();
    G.fillRect(cx - s * 1.05, cy + s * 0.45, s * 0.42, s * 0.16); G.fillRect(cx + s * 0.63, cy + s * 0.45, s * 0.42, s * 0.16);
  } else if (kind === 'fillet') {  /* three ribs crossing, the corners between them rounded */
    for (let k = 0; k < 3; k++) { const th = k * Math.PI / 3; L([[-Math.cos(th) * 0.95, -Math.sin(th) * 0.95], [Math.cos(th) * 0.95, Math.sin(th) * 0.95]]); }
    G.beginPath(); G.arc(cx, cy, s * 0.26, 0, TAU); G.fill();
  } else if (kind === 'tie') {     /* an arch whose feet stand on the board, which holds them together */
    G.beginPath(); G.moveTo(cx - s * 0.8, cy + s * 0.3); G.quadraticCurveTo(cx, cy - s * 1.2, cx + s * 0.8, cy + s * 0.3); G.stroke();
    G.fillRect(cx - s * 1.0, cy + s * 0.32, s * 2.0, s * 0.2); L([[-0.8, 0.3], [-0.8, 0.32]]); L([[0.8, 0.3], [0.8, 0.32]]);
  } else if (kind === 'mould') {   /* the mould's two halves, a rib's slot in one, the cutter over it */
    G.strokeRect(cx - s * 0.95, cy - s * 0.1, s * 1.9, s * 0.62); L([[-0.12, -0.1], [-0.12, 0.3], [0.12, 0.3], [0.12, -0.1]]);
    G.beginPath(); G.arc(cx, cy - s * 0.55, s * 0.22, 0, TAU); G.stroke(); L([[0, -0.77], [0, -1.0]]);
  }
  G.restore();
}
const FILM_UP_T = { r0: 0.6, per: 1.0, res: 5.7, unl: 7.4 };
S({ id: 'shellup', ch: 'shell', theme: 'night', title: 'Five upgrades, one shell', settle: 9.6,
  src: ['exXbabWeight', 'b12Study', 'filletFE', 'shbModel', 'shlPyrofil'],
  draw: t => {
    header(t, 'Five upgrades, one shell');
    const T = FILM_UP_T, rungs = film_upRungs(), N = rungs.length, Bd = typeof ntr_budget === 'function' ? ntr_budget() : null;
    captions(t, [[0.3, 'The giants buy stiffness with weight. Theseus stacks five upgrades instead, each built on the one before it.'],
      [T.res - 0.2, 'Together they make a full-size shell lighter than the lightest flagship’s, and stiffer than a plain wall of its weight.']]);
    /* the ladder, bottom up: the first upgrade at the foot. Frame one shows every rung, waiting; each lands in turn */
    const x = LM, w = 1060, rh = 104, gap = 20, yTop = 290, yOf = i => yTop + (N - 1 - i) * (rh + gap);
    rungs.forEach((r, i) => {
      const y = yOf(i), t0 = T.r0 + i * T.per, k = ep(t, t0, t0 + 0.45, E.snap), kf = ep(t, t0 + 0.25, t0 + 0.7), lit = k > 0.5;
      rr(x, y, w, rh, 6, lit ? rgba(C.hero, TH ? 0.08 : 0.13) : C.panel, null, 0, 1);
      if (k > 0.003) { G.save(); G.globalAlpha = k; G.strokeStyle = rgba(C.hero, 0.7); G.lineWidth = 1.6; rrPath(x + 0.8, y + 0.8, w - 1.6, rh - 1.6, 6); G.stroke(); G.restore(); }
      /* its number and picture */
      text(String(i + 1), x + 34, y + rh / 2 + 12, { font: 'disp', size: 34, weight: 800, color: lit ? C.heroText : C.faint, align: 'center' });
      film_upIcon(r.icon, x + 112, y + rh / 2, 26, lit ? C.heroText : C.faint, 1);
      text(r.name, x + 170, y + 44, { role: 'h3', size: 30, weight: 750, color: lit ? C.ink : C.mute, sentence: false });
      text(r.on, x + 170, y + 80, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: lit ? 1 : 0.6, maxW: 560, sentence: false });
      /* the figure its own slide proved */
      if (r.fig) { text(r.fig, x + w - 28, y + 54, { font: 'disp', size: 42, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', alpha: kf, tnum: true });
        text(r.figL, x + w - 28, y + 84, { role: 'small', size: 19, weight: 600, color: C.ink2, align: 'right', alpha: kf, maxW: 300, sentence: false }); }
      /* built on the rung below: an arrow up from it as this one lands */
      if (i > 0) { const kb = ep(t, t0 - 0.1, t0 + 0.4, E.io3), ya = yOf(i - 1) - 3, yb = y + rh + 3; if (kb > 0.003) arrow(x + 34, ya, x + 34, lerp(ya, yb, kb), { color: C.hero, w: 2.5, hs: 9, p: 1, alpha: 1 }); }
    });
    /* the shell they make: weighed against the lightest flagship's, part by part (the ledger) */
    const rx = 1220, rw = RM - rx, kR = ep(t, T.res, T.res + 0.4);
    if (Bd && Bd.ok) {
      text('The shell they make', rx, 330, { role: 'label', size: 20, color: C.heroText, alpha: kR });
      verdict(t, T.res + 0.1, rx, 470, { from: Bd.xa.shell, to: Bd.shell, unit: 'g', dec: 2, label: 'Shell and skates', better: 'lower', who: ['XA25', 'Theseus'], rivalCol: 'grey', net: '−' + fmtN(Bd.cut, 2) + ' g', netWord: 'at full size', size: 92, maxW: rw });
      const ks = ep(t, T.res + 1.4, T.res + 1.8), d = THESEUS.dims;
      text('Against the XA25, the lightest flagship weighed part by part (XBAB). Theseus’s box: ' + fmtN(d[0], 1) + ' × ' + fmtN(d[1], 1) + ' × ' + fmtN(d[2], 1) + ' mm.', rx, 588, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: ks, maxW: rw, lh: 1.3 });
    }
    /* what it unlocks: the moves it feeds, on the board's own terms */
    const ku = ep(t, T.unl, T.unl + 0.4);
    text('Unlocks', rx, 700, { role: 'label', size: 20, color: C.mute, alpha: ku });
    [[3, 'The ribs’ feet, tied to the board the mouse already carries'], [6, 'With its lighter battery, the best density of any mouse']].forEach(([n, s0], j) => {
      const y = 748 + j * 74, kj = ep(t, T.unl + 0.2 + j * 0.35, T.unl + 0.6 + j * 0.35);
      circle(rx + 16, y - 8, 15, { color: C.heroText, w: 2, alpha: kj });
      text(String(n), rx + 16, y - 1, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: kj });
      text('Move ' + n + ': ' + FILM.moves[n].name, rx + 48, y - 1, { role: 'small', size: 22, weight: 750, color: C.ink, alpha: kj, sentence: false });
      text(s0, rx + 48, y + 27, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kj, maxW: rw - 48, sentence: false });
    });
    source(t, 'Each figure is its own slide’s: the strip (Pyrofil’s datasheet), the 3D shell study at 9.35 g, the 2D arch frames, the fillet study at equal mass, its tolerance band. Weights: XBAB’s part-by-part XA25; Theseus’s budget, derived.', { t0: 1.0, maxW: 1060 });
  }
});

/* ---------- testing pairs (Brock, ~17:42: "show them side by side just for treating and i'll pick soon") ----------
   For five of his 7-rated v23 slides, v23's original (A) plays just before its rebuild (B), each footer saying which is
   which, until he picks. To end the test, empty FILM_AB (or drop the losers from it). */
const FILM_AB = [['lattice', 'b06_lattice'], ['shlThin', 'b06_light'], ['shbArches', 'b06_arches'], ['tolerance', 'b07_tolerance'], ['grind', 'b07_poron']];
(function () {
  for (const [a, b] of FILM_AB) for (const row of FILM.order) { const ids = row[1], k = ids.indexOf(b); if (k >= 0 && !ids.includes(a)) ids.splice(k, 0, a); }
  for (const [a, b] of FILM_AB) {
    FILM.link[a] = { s: 'Testing, A: v23’s version, as you rated it. B, the rebuild with your note done, plays next' };
    FILM.link[b] = { s: 'Testing, B: the rebuild, your note done. A, v23’s version, played just before', to: (FILM.link[b] || {}).to };
  }
})();

/* ---------- V4: Theseus's typed figures against the deck's own derivation (05-data.js says how); a drift is an error ---------- */
(function () {
  try {
    const H = ntr_hours(), h = Math.floor(H.h1 + 1e-9), B = ntr_budget(), oldMass = 29.31, oldShell = oldMass - ntr_oldPack().g - THESEUS.pcb - B.ref - B.wheel - B.ins - B.screws - B.wires;
    if (h !== THESEUS.hours) console.error('theseus: THESEUS.hours is ' + THESEUS.hours + ' h, the derivation gives ' + h + ' h (ntr_hours)');
    if (THS.hours !== THESEUS.hours + ' h' || THS.mass !== fmtN(THESEUS.mass, 2)) console.error('theseus: THS strings disagree with THESEUS');
    if (Math.abs(B.shell - oldShell) > 1e-6) console.error('theseus: the shell allowance moved (' + fmtN(oldShell, 2) + ' -> ' + fmtN(B.shell, 2) + ' g): the battery saving must come off the total');
  } catch (e) { console.error('theseus: figure check failed: ' + e.message); }
})();

/* ---------- switch the film on ---------- */
if (FILM.on) {
  filmApply();
  chapterInfo = function (s) {
    const m = filmMove(s), list = DECK.slides.filter(x => x.move === s.move && !x.card), up = filmStep(s);
    if (up) return { name: up.label, n: 0, of: 0, num: m.n };
    return { name: m ? 'Move ' + m.n + ': ' + m.name : '', n: list.indexOf(s) + 1, of: list.length, num: m ? m.n : 0 };
  };
  slideChrome = filmChrome;
  /* the dock takes the label row's right end: the idea tags there step aside on the slides that carry it (V2) */
  const chips0 = chips; chips = function (...a) { return lo_dockOn(curSlide()) ? 0 : chips0(...a); };
  updateBar = function () {
    const s = DECK.slides[APP.i], m = filmMove(s);
    $('count').textContent = (APP.i + 1) + ' / ' + DECK.slides.length;
    $('chap').textContent = m ? 'Move ' + m.n + ': ' + m.name : '';
    document.querySelectorAll('.seg').forEach(b => b.classList.toggle('on', b.dataset.ch === s.ch));
    rateSync();
  };
}

