/* ============================================================================================
   app: one canvas. Each frame the current slide is drawn off screen on its own ground (paper or night),
   then composed onto the stage; during a change the old frame and the new one meet in one of the film's
   transitions: iris (a disc of the accent opens, the new frame opens inside it a beat later), sweep (a slanted
   band of the accent crosses), push (the new frame slides in, the old one slides away slower and dims).
   ============================================================================================ */
const APP = { i: 0, t0: 0, tPause: 0, playing: true, dpr: 1, scale: 1, trStart: -1, TR: 0.95, trans: 'push', trAcc: '#F3F2EE', frozenT: null, reduced: false, lastT: 0 };
const $ = id => document.getElementById(id);
const OFF = document.createElement('canvas'), SNAP = document.createElement('canvas');

function slideT() { if (APP.frozenT != null) return APP.frozenT; return APP.playing ? (performance.now() - APP.t0) / 1000 : APP.tPause; }
function themeOf(s) { return s.theme === 'paper' ? 1 : 0; }

function fit() {
  const cap = document.body.classList.contains('cap'), clean = document.body.classList.contains('clean');
  const cs = getComputedStyle($('app')), num = v => parseFloat(v) || 0, bar = $('bar');
  const padX = cap ? 0 : num(cs.paddingLeft) + num(cs.paddingRight), padY = cap ? 0 : num(cs.paddingTop) + num(cs.paddingBottom) + 10;
  /* the bar wraps onto a second line when it is wider than the stage (Brock, on an iPhone 16 Pro Max): measure it at the
     stage's width and fit the stage again until the two agree */
  let bh = clean || cap ? 0 : 44, w = 200;
  for (let k = 0; k < 4; k++) {
    const vw = window.innerWidth - padX, vh = window.innerHeight - bh - padY;
    w = Math.floor(Math.max(200, Math.min(vw, vh * 16 / 9)));
    if (clean || cap) break;
    bar.style.width = w + 'px';
    const nb = bar.offsetHeight || bh;
    if (Math.abs(nb - bh) < 1) break;
    bh = nb;
  }
  const h = w * 9 / 16;
  document.documentElement.style.setProperty('--barH', bh + 'px');
  const st = $('stage'); st.style.width = w + 'px'; st.style.height = h + 'px';
  if (!(clean || cap)) bar.style.width = w + 'px';
  APP.dpr = Math.min(2, window.devicePixelRatio || 1); APP.scale = w / W;
  const cw = Math.round(w * APP.dpr), ch = Math.round(h * APP.dpr);
  for (const c of [$('fx'), OFF, SNAP]) { if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; } }
}
function go(i, opts = {}) {
  i = clamp(i, 0, DECK.slides.length - 1);
  if (i === APP.i && !opts.force) return;
  try { rateFlush(); if (EDIT.on) editSave(); } catch (e) { }
  const now = performance.now(), prev = DECK.slides[APP.i], next = DECK.slides[i];
  if (!opts.instant && !APP.reduced && prev) {
    SNAP.getContext('2d').drawImage($('fx'), 0, 0);
    APP.trStart = now;
    APP.trans = next.trans || (next.card ? 'iris' : themeOf(prev) !== themeOf(next) ? 'sweep' : 'push');
    APP.back = i < APP.i;
    TH = themeOf(next); APP.trAcc = next.card ? acc(next.ch) : (themeOf(next) ? '#111111' : '#F3F2EE');
    if (APP.trans === 'sweep') APP.trAcc = acc(next.ch) === C.ink ? C.hero : acc(next.ch);
  } else APP.trStart = -1;
  APP.i = i; APP.t0 = now; APP.tPause = 0; APP.lastT = 0;
  if (APP.reduced) { APP.t0 = now - (next.settle || 9) * 1000; APP.tPause = next.settle || 9; }
  if (EDIT.on) { editFreeze(next); EDIT.sel = null; requestAnimationFrame(() => requestAnimationFrame(() => editSync())); }
  if (APP.frozenT == null) { try { history.replaceState(null, '', '#' + next.id); } catch (e) { } }
  updateBar(); renderSources(); editSync();
  try { prepare3D(next); prepare3D(DECK.slides[i + 1]); } catch (e) { }
}
/* ---------- slide ratings (Brock, F16.2) ----------
   Brock scores each slide's value from 1 to 10 (10 = most valuable). The scores show which information is safest to
   condense or cut; they don't decide which slides go. They live in the artifact's db at ratings/<slide id>, which only
   the owner and editors can write, and Claude reads them back. Nothing shows where the db isn't served (a local file, a
   preview, a viewer who can't write). */
const RATE = { db: null, all: {}, ready: false, ro: false, note: '', pend: {}, again: {}, taSlide: null, dirty: false, tmr: null };
const rateKey = id => String(id).replace(/[^A-Za-z0-9_\-.~:@+]/g, '_');
/* a slide's version: its drawing code, its title, and a rev a builder bumps when only a helper changed (Brock, F26.13:
   "updating a slide should archive its old score"). A rating made on another version is archived: it moves into the
   rating's history, and the slide shows as unrated until it's rated again. */
function slideVer(s) { return s.__ver || (s.__ver = fnv36(String(s.draw || s.card || '') + '|' + (s.title || '') + '|' + (s.rev || 0))); }
/* the ratings made before versions were kept (to 2026-11-05 03:45) were made on v19 of the live link: these are its slides'
   versions, so a slide changed since then shows its old score as archived */
const RATE_BASE = {"cover":"1c0u7nn","thesis":"1jaw5px","targets":"1dx6bq0","targets2":"1y3r74r","flagships":"10z11az","ntr_stats":"zxwfw4","zerograms":"14eueya","weightgap":"ohrc4v","ntr_density":"p65n0o","ntr_sizewt":"3u58r6","ntr_densrank":"83efoh","pricefront":"ckls6a","market":"1mky897","budget":"1347c8i","map":"1mit5i8","clicks":"9gn0re","arc":"10m54fq","clk_wedge":"gtg33l","clk_switch":"1ystf1l","clk_switch2":"4qfkgx","cutouts":"1w2433v","tensioner":"7ssnzd","clk_tenmat":"kptzkf","anchors":"1soxt08","clk_pomtune":"1ltcvj9","clk_front":"xd9ceo","clk_hotswap":"1de3kkx","clk_spdt":"1x1pvvq","latency":"r4w0v0","clk_debounce":"yeyxis","clk_wait":"19ka6b5","clk_methods":"ge4h2m","sidebuttons":"1l3s004","glide":"rsk0v8","gld_under":"1jtw07e","dots":"13tvchw","gld_camera":"1p4xic3","gld_corr":"6lf345","gld_blur":"p62txs","focus":"1gqtge5","gld_sag":"1gvzacy","gld_module":"1ias97k","sensor":"zjr0ib","gld_reports":"t93q3g","gld_position":"je8l9h","gld_soft":"j1hxar","gld_sheet":"1u1a0l2","shellcard":"14lqvun","materials":"o64pmg","shlSpecific":"1l9sz9h","thinwall":"z9ds44","shlScatter":"ww7f1n","shlPick":"ijjhnj","shlNoPick":"1e45x7u","shlHotspot":"1lch9ee","shlMargin":"18raj1f","shlWork":"1rx28ja","shlShell3d":"80q5fg","lattice":"mlqpqb","shlDeterminate":"1bqxnyt","shlThin":"1hy48m5","shlLattice3d":"1559brn","shbArches":"1loxf85","shbPress":"1c63v65","shbThrust":"z782nj","shbBend":"172nrzl","shbFibres":"1u3lbky","fillet":"11lgp2i","filletsize":"lnurv4","shbFlow":"12wibt8","shbGates":"1op14e5","shbWidth":"13wwoox","shbMill":"18tda1k","shbMillDirect":"vyx6rr","shbTol":"1fmjyie","shbSides":"1upg73i","shlPcbRib":"6ua7bv","shcCarry":"hdvg4d","shcArms":"1ewpj88","shlStructs":"1vm3dy7","tolerance":"kyzyzh","sealed":"1bu2o2j","shlGrams":"293y48","mass":"npv36y","grind":"me2bo4","shlsheet1":"1vkusbq","shlsheet2":"1seh9ov","pltPlate":"1mm0g1b","pltSim":"rr3n7r","pltOptions":"14ao8yo","surfacecard":"10tprvn","coating":"12xp4ak","srf_texture":"1fqv9in","srf_weight":"97v6ro","srf_uv":"eps9w3","grip":"vz36ju","srf_gripmap":"2ale5a","srf_tape":"ng95n0","srf_twotone":"cmq7uq","srf_marks":"ujk4ur","details":"1olxa0e","wheel":"lccs49","srf_encoder":"1evab6w","eleccard":"8m26qp","onechip":"1hifscr","elc_module":"cemxb2","antenna":"1d5pcpa","motion":"13xr6os","elc_rate":"cedf8o","framesync":"1kqz7lp","secondshot":"12pxuwy","power":"e2xlu6","elc_pmic":"4g8qd3","elc_charge":"1j807iu","elc_safe":"1v7r059","cells":"nds3h0","frontier":"q3m2gu","elc_oneside":"8jdhuh","elecsheet1":"10iguxg","elc_tear":"1xy8gna","elc_twist":"s7be4q","elc_lay":"14fua3c","elc_flex":"r1jxva","cable":"6z6965","software":"1whxkha","elc_sheet2":"17ccpqb","shapecard":"1w4i6dv","shp_newton":"b1qsv8","grooves":"1sut1j7","size":"1sqyq6r","emg":"18vt2ey","owncard":"8iee81","repair":"17659uq","ownscrew":"1dgt88h","own_insert":"15ax8cl","own_life":"1a377u5","ownbatt":"fcwm05","ownboard":"gndej8","box":"66qzjx","serial":"zurulc","ownsheet1":"11rm8m4","ownsheet2":"9pu545","close":"j4sd1e"};
const rateVer = (s, r) => (r && r.ver != null ? r.ver : RATE_BASE[s.id]);
function rateCur(s) { const r = s && RATE.all[rateKey(s.id)]; if (!r) return null; const v = rateVer(s, r); return v == null || v === slideVer(s) ? r : null; }
function rateOld(s) { const r = s && RATE.all[rateKey(s.id)]; if (!r) return null; const v = rateVer(s, r); return v != null && v !== slideVer(s) ? r : null; }
async function rateInit() {
  const cl = window.claude;
  if (!cl || typeof cl.use !== 'function') return;
  let db = null, user = null;
  try { db = await cl.use('db'); } catch (e) { db = null; }
  if (!db) return;
  try { editLoad(db); } catch (e) { }
  try { user = await cl.use('user'); } catch (e) { user = null; }
  if (user) { try { if (!(await user.canEdit())) { EDIT.db = null; return; } } catch (e) { } }
  RATE.db = db;
  $('rateBtn').hidden = false; $('editBtn').hidden = false; fit();
  const timer = setTimeout(() => { if (!RATE.ready) { RATE.note = 'Can’t reach the saved ratings yet'; rateSync(); } }, 10000);
  db.collection('ratings').onSnapshot(snap => {
    const all = {};
    snap.docs.forEach(d => { const v = d.data(); if (v) all[d.id] = v; });
    for (const k in RATE.pend) if (RATE.pend[k] && RATE.all[k]) all[k] = RATE.all[k];   /* keep our unsaved edit */
    RATE.all = all;
    if (!snap.metadata.fromCache) { RATE.ready = true; if (RATE.note.startsWith('Can')) RATE.note = ''; clearTimeout(timer); }
    rateSync();
  }, err => { clearTimeout(timer); RATE.ready = true; RATE.note = 'Ratings unavailable (' + (err && err.code) + ')'; rateSync(); });
}
function rateBuild(p) {
  p.innerHTML = '<div class="top"><h2>How valuable is this slide? <span class="hint">1 least, 10 most</span></h2><span class="state" aria-live="polite"></span></div>' +
    '<p class="slide"></p><div class="vals">' + Array.from({ length: 10 }, (_, i) => '<button type="button" data-v="' + (i + 1) + '" aria-label="Rate ' + (i + 1) + ' of 10">' + (i + 1) + '</button>').join('') + '</div>' +
    '<div class="row"><textarea rows="1" placeholder="What matters most here, or what could go (optional)"></textarea><button class="pill" type="button" data-act="next">next unrated</button></div>';
  p.title = 'The scores show which information is safest to condense, not which slides to cut';
  p.querySelectorAll('.vals button').forEach(b => b.onclick = e => { e.stopPropagation(); rateSave({ value: +b.dataset.v }); });
  /* a note belongs to the slide it was typed on (Brock, 01:13: "sometimes my notes from a past slide will carry over to
     the next one"): the box remembers that slide, and any slide change saves the note there first (rateFlush in go) */
  const ta = p.querySelector('textarea');
  ta.oninput = () => { if (RATE.taSlide == null) RATE.taSlide = APP.i; RATE.dirty = true; clearTimeout(RATE.tmr); RATE.tmr = setTimeout(rateFlush, 1200); };
  ta.onblur = () => rateFlush();
  p.querySelector('[data-act="next"]').onclick = e => {
    e.stopPropagation();
    const n = DECK.slides.length;
    for (let k = 1; k <= n; k++) { const j = (APP.i + k) % n; const r = rateCur(DECK.slides[j]); if (!r || !r.value) { go(j); return; } }
  };
  p.dataset.built = '1';
}
function rateFlush() {
  clearTimeout(RATE.tmr); RATE.tmr = null;
  const ta = $('rate') && $('rate').querySelector('textarea');
  if (!ta || !RATE.dirty || RATE.taSlide == null) return;
  RATE.dirty = false;
  rateSave({ note: ta.value.trim() }, RATE.taSlide);
}
function rateSync() {
  if (!RATE.db) return;
  const s = DECK.slides[APP.i]; if (!s) return;
  const r = rateCur(s), old = rateOld(s), done = DECK.slides.filter(x => { const v = rateCur(x); return v && v.value; }).length;
  $('rateBtn').textContent = r && r.value ? 'rated ' + r.value : 'rate';
  const p = $('rate'); if (p.hidden) return;
  if (!p.dataset.built) rateBuild(p);
  p.querySelector('.slide').textContent = (APP.i + 1) + '. ' + (s.title || s.id) + (old && old.value ? '   (rated ' + old.value + ' before it changed)' : '');
  p.querySelectorAll('.vals button').forEach(b => { b.classList.toggle('on', !!(r && +b.dataset.v === r.value)); b.disabled = RATE.ro; });
  const ta = p.querySelector('textarea'); ta.disabled = RATE.ro;
  if (RATE.taSlide !== APP.i) { rateFlush(); ta.value = (r && r.note) || ''; RATE.taSlide = APP.i; RATE.dirty = false; }
  else if (!RATE.dirty && document.activeElement !== ta) ta.value = (r && r.note) || '';
  p.querySelector('.state').textContent = RATE.note || (done + ' of ' + DECK.slides.length + ' rated');
}
function rateSave(patch, si) {
  if (!RATE.db || RATE.ro) return;
  const i = si == null ? APP.i : si, s = DECK.slides[i]; if (!s) return;
  const k = rateKey(s.id), prev = RATE.all[k] || {}, ver = slideVer(s), pv = rateVer(s, prev.id ? prev : null), same = !prev.id || pv == null || pv === ver, old = same ? prev : {};
  const history = (prev.history || []).slice();
  if (!same && (prev.value || prev.note)) history.push({ ver: pv, value: prev.value || null, note: prev.note || '', at: prev.at || null, title: prev.title || '', n: prev.n || null });
  const doc = { id: s.id, title: s.title || '', ch: s.ch || '', n: i + 1, of: DECK.slides.length, ver, value: old.value || null, note: old.note || '', history };
  Object.assign(doc, patch);
  if (same && doc.value === (old.value || null) && doc.note === (old.note || '')) return;
  doc.at = new Date().toISOString();
  RATE.all[k] = doc; RATE.note = ''; rateSync();
  /* one write at a time per document: a burst of clicks writes the latest state once the previous write lands */
  if (RATE.pend[k]) { RATE.again[k] = true; return; }
  RATE.pend[k] = true;
  (async () => {
    do {
      RATE.again[k] = false;
      try { await RATE.db.doc('ratings/' + k).set(RATE.all[k]); }
      catch (e) {
        if (e && e.code === 'invalid_argument') { RATE.ro = true; RATE.note = 'This view can’t save ratings'; }
        else RATE.note = 'Not saved (' + ((e && e.code) || 'error') + '), try again';
        break;
      }
    } while (RATE.again[k]);
    RATE.pend[k] = false; rateSync();
  })();
}
/* ---------- edit text (Brock, 2026-11-05: "a tool where i can tap a button then be able to select and directly edit any
   text a on a slide") ----------
   "edit text" freezes the slide at its settled frame and outlines every string; a tap picks the one under it and the
   panel takes the new words, shown on the slide as they're typed. Each edit replaces that string on that slide only
   (01-core.js edTxt) and is kept in the artifact's db at edits/<slide>--<hash>, { slide, title, n, from, to, at }, which
   editors write and everyone reads, so the deck shows it to all and Claude reads them back. */
const EDQ = {};
function fnv36(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
const edDocId = (slide, k) => rateKey(slide).slice(0, 80) + '--' + fnv36(String(k)) + '-' + String(k).length;
function editLoad(db) {
  EDIT.db = db;
  db.collection('edits').onSnapshot(snap => {
    const map = {};
    snap.docs.forEach(d => { const v = d.data(); if (v && v.slide != null && v.from != null && v.to != null) (map[v.slide] || (map[v.slide] = new Map())).set(String(v.from), String(v.to)); });
    /* our writes still in flight win over the snapshot */
    for (const id in EDQ) { const q = EDQ[id]; if (!q.busy || !q.key) continue; const m = map[q.key.slide] || (map[q.key.slide] = new Map()); if (q.last === null) m.delete(q.key.k); else if (q.last) m.set(q.key.k, q.last.to); }
    EDIT.map = map; editSync();
  }, err => { EDIT.note = 'Edits unavailable (' + ((err && err.code) || 'error') + ')'; editSync(); });
}
function editFreeze(s) {
  APP.playing = false; APP.tPause = (s && s.settle) || 9;
  $('playIcon').setAttribute('d', 'M7 5v14l11-7z'); $('play').setAttribute('aria-label', 'Play');
}
function editToggle(on) {
  if (!EDIT.db) return;
  EDIT.on = on == null ? !EDIT.on : !!on;
  document.body.classList.toggle('editing', EDIT.on);
  const b = $('editBtn'); b.setAttribute('aria-pressed', String(EDIT.on)); b.textContent = EDIT.on ? 'editing' : 'edit text';
  $('edit').hidden = !EDIT.on;
  if (EDIT.on) { editFreeze(DECK.slides[APP.i]); $('rate').hidden = true; $('rateBtn').setAttribute('aria-expanded', 'false'); $('src').hidden = true; }
  else { editSave(); EDIT.sel = null; EDIT.boxes.length = 0; }
  editSync(); requestAnimationFrame(() => requestAnimationFrame(() => editSync()));
}
function editBuild(p) {
  p.innerHTML = '<div class="top"><h2>Edit text</h2><span class="state" aria-live="polite"></span></div>' +
    '<p class="hint">Tap any text on the slide. What you type replaces it on this slide only, and saves as you go.</p>' +
    '<div class="caps" hidden><p class="was">The narration changes as the slide plays. Pick a line to edit:</p><div class="row"></div></div>' +
    '<div class="cur" hidden><p class="was">Was: <span></span></p><textarea rows="2" aria-label="New text" enterkeyhint="done"></textarea>' +
    '<div class="row"><button class="pill" type="button" data-act="undo">back to original</button><button class="pill" type="button" data-act="done">done</button>' +
    '<button class="pill" type="button" data-act="exit">stop editing</button></div></div>';
  const ta = p.querySelector('textarea'); let tmr = null;
  ta.oninput = () => { if (!EDIT.sel) return; EDIT.live[EDIT.sel.slide + '\u0001' + EDIT.sel.k] = ta.value; clearTimeout(tmr); tmr = setTimeout(editSave, 900); };
  ta.onblur = () => { clearTimeout(tmr); editSave(); };
  p.querySelector('[data-act="undo"]').onclick = e => { e.stopPropagation(); editUndo(); };
  p.querySelector('[data-act="done"]').onclick = e => { e.stopPropagation(); editSave(); EDIT.sel = null; editSync(); };
  p.querySelector('[data-act="exit"]').onclick = e => { e.stopPropagation(); editToggle(false); };
  p.dataset.built = '1';
}
function editSync(focus) {
  const p = $('edit'); if (!p || p.hidden || !EDIT.db) return;
  if (!p.dataset.built) editBuild(p);
  const s = DECK.slides[APP.i]; if (!s) return;
  const sel = EDIT.sel && EDIT.sel.slide === s.id ? EDIT.sel : null, m = EDIT.map[s.id];
  const n = m ? m.size : 0, all = Object.values(EDIT.map).reduce((a, mm) => a + mm.size, 0);
  p.querySelector('.state').textContent = EDIT.note || (n + ' edited here, ' + all + ' in all');
  p.querySelector('.hint').hidden = !!sel; p.querySelector('.cur').hidden = !sel;
  /* the narration's other lines aren't on screen at the settled frame: list them, and show the one picked */
  const cp = p.querySelector('.caps'), steps = EDIT.caps && EDIT.caps.slide === s.id ? EDIT.caps.steps : [];
  cp.hidden = !!sel || steps.length < 2;
  if (!cp.hidden && cp.dataset.slide !== s.id + '|' + steps.length) {
    const row = cp.querySelector('.row'); row.innerHTML = '';
    steps.forEach(([t0, str], i) => {
      const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'pill'; bt.style.textTransform = 'none'; bt.style.letterSpacing = '0';
      bt.textContent = (i + 1) + '. ' + (str.length > 34 ? str.slice(0, 33) + '…' : str);
      bt.onclick = e => { e.stopPropagation(); const nx = steps[i + 1]; APP.tPause = Math.min(t0 + Math.min(5, str.length / 70 + 0.6), nx ? nx[0] - 0.3 : Infinity); editSave(); EDIT.sel = { slide: s.id, k: str }; EDIT.note = ''; editSync(true); };
      row.appendChild(bt);
    });
    cp.dataset.slide = s.id + '|' + steps.length;
  }
  if (!sel) return;
  const ta = p.querySelector('textarea'), lk = s.id + '\u0001' + sel.k;
  p.querySelector('.was span').textContent = sel.k;
  if (focus || document.activeElement !== ta) ta.value = EDIT.live[lk] != null ? EDIT.live[lk] : (m && m.has(sel.k) ? m.get(sel.k) : sel.k);
  ta.disabled = !!EDIT.ro;
  p.querySelector('[data-act="undo"]').disabled = !(m && m.has(sel.k)) && EDIT.live[lk] == null;
  if (focus) { try { ta.focus({ preventScroll: true }); ta.setSelectionRange(0, ta.value.length); } catch (e) { } }
}
function editPick(e) {
  const st = $('stage'), r = st.getBoundingClientRect(), fx = $('fx');
  const px = (e.clientX - r.left) * fx.width / r.width, py = (e.clientY - r.top) * fx.height / r.height, pad = 6 * (APP.dpr || 1);
  let best = null, ba = Infinity;
  for (const b of EDIT.boxes) {
    if (px < b.x0 - pad || px > b.x1 + pad || py < b.y0 - pad || py > b.y1 + pad) continue;
    const ar = Math.max(1, (b.x1 - b.x0) * (b.y1 - b.y0)); if (ar <= ba) { best = b; ba = ar; }
  }
  if (!best) { EDIT.sel = null; EDIT.note = 'No text there: tap a word on the slide'; editSync(); setTimeout(() => { if (EDIT.note.startsWith('No text')) { EDIT.note = ''; editSync(); } }, 2500); return; }
  editSave();
  EDIT.sel = { slide: DECK.slides[APP.i].id, k: best.k }; EDIT.note = '';
  editSync(true);
}
function editSave() {
  const sel = EDIT.sel; if (!sel || !EDIT.db || EDIT.ro) return;
  const lk = sel.slide + '\u0001' + sel.k, v = EDIT.live[lk]; if (v == null) return;
  const m = EDIT.map[sel.slide] || (EDIT.map[sel.slide] = new Map());
  if (v === sel.k) { delete EDIT.live[lk]; if (m.has(sel.k)) { m.delete(sel.k); editWrite(sel, null); } editSync(); return; }
  delete EDIT.live[lk];
  if (m.get(sel.k) === v) return;
  m.set(sel.k, v);
  const s = DECK.slides.find(x => x.id === sel.slide) || {};
  editWrite(sel, { slide: sel.slide, title: s.title || '', n: DECK.slides.indexOf(s) + 1, from: sel.k.slice(0, 4000), to: v.slice(0, 4000), at: new Date().toISOString() });
  editSync();
}
function editUndo() {
  const sel = EDIT.sel; if (!sel) return;
  delete EDIT.live[sel.slide + '\u0001' + sel.k];
  const m = EDIT.map[sel.slide]; if (m) m.delete(sel.k);
  editWrite(sel, null); editSync(true);
}
/** one write at a time per document: a burst of typing writes the latest text once the previous write lands */
function editWrite(sel, doc) {
  if (!EDIT.db) return;
  const id = edDocId(sel.slide, sel.k), q = EDQ[id] || (EDQ[id] = { busy: false });
  q.key = { slide: sel.slide, k: sel.k }; q.last = doc; q.has = true;
  if (q.busy) return;
  q.busy = true;
  (async () => {
    while (q.has) {
      const d = q.last; q.has = false;
      try { if (d === null) await EDIT.db.doc('edits/' + id).delete(); else await EDIT.db.doc('edits/' + id).set(d); if (EDIT.note.startsWith('Not saved')) EDIT.note = ''; }
      catch (e) {
        if (e && (e.code === 'invalid_argument' || e.code === 'not_granted' || e.code === 'revoked')) { EDIT.ro = true; EDIT.note = 'This view can’t save edits'; }
        else EDIT.note = 'Not saved (' + ((e && e.code) || 'error') + '), try again';
        break;
      }
    }
    q.busy = false; editSync();
  })();
}
/** outline every string on the settled slide; the picked one solid, the edited ones in blue */
function editOverlay() {
  const fx = $('fx').getContext('2d'), dp = APP.dpr || 1, s = DECK.slides[APP.i];
  const sel = EDIT.sel && EDIT.sel.slide === s.id ? EDIT.sel.k : null, m = EDIT.map[s.id];
  fx.save(); fx.setTransform(1, 0, 0, 1, 0, 0); fx.lineWidth = 1.5 * dp;
  for (const b of EDIT.boxes) {
    const on = b.k === sel, ed = !!(m && m.has(b.k)), x = b.x0 - 3 * dp, y = b.y0 - 3 * dp, w = b.x1 - b.x0 + 6 * dp, h = b.y1 - b.y0 + 6 * dp;
    if (on) { fx.fillStyle = 'rgba(47,140,255,0.16)'; fx.fillRect(x, y, w, h); }
    fx.setLineDash(on || ed ? [] : [4 * dp, 3 * dp]);
    fx.strokeStyle = on ? '#2F8CFF' : ed ? 'rgba(47,140,255,0.8)' : 'rgba(128,128,128,0.5)';
    fx.strokeRect(x, y, w, h);
  }
  fx.restore();
}
function updateBar() {
  const s = DECK.slides[APP.i];
  $('count').textContent = (APP.i + 1) + ' / ' + DECK.slides.length;
  const ch = DECK.chapters.find(c => c.key === s.ch); $('chap').textContent = ch ? ch.name : '';
  document.querySelectorAll('.seg').forEach(b => b.classList.toggle('on', b.dataset.ch === s.ch));
  rateSync();
}
function buildBar() {
  const segs = $('segs'); segs.innerHTML = '';
  DECK.chapters.forEach(c => {
    const n = DECK.slides.filter(s => s.ch === c.key).length; if (!n) return;
    const b = document.createElement('button'); b.className = 'seg'; b.type = 'button'; b.dataset.ch = c.key; b.style.flexGrow = n; b.title = c.name; b.setAttribute('aria-label', 'Go to ' + c.name);
    b.appendChild(document.createElement('i'));
    b.onclick = e => { e.stopPropagation(); go(DECK.slides.findIndex(s => s.ch === c.key)); };
    segs.appendChild(b);
  });
}
function renderSources(all) {
  const box = $('src'); const s = DECK.slides[APP.i];
  const ids = all ? Object.keys(SRC) : (s.src || []);
  box.innerHTML = '';
  const h = document.createElement('h2'); h.textContent = all ? 'All sources' : 'Sources for this slide'; box.appendChild(h);
  const sub = document.createElement('p'); sub.className = 'sub'; sub.textContent = all ? ids.length + ' references' : (s.title || ''); box.appendChild(sub);
  if (!ids.length) { const p = document.createElement('p'); p.textContent = 'This slide is a design proposal, or a derivation shown on screen. It cites nothing outside the deck.'; p.style.cssText = 'margin:0;color:#c9c8c2;font-size:13px'; box.appendChild(p); }
  else {
    const ol = document.createElement('ol');
    for (const id of ids) { const r = SRC[id]; if (!r) continue; const li = document.createElement('li'); li.appendChild(document.createTextNode(r.t + ' ')); if (r.u) { const a = document.createElement('a'); a.href = r.u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = r.u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70); li.appendChild(a); } if (r.n) { const n = document.createElement('div'); n.textContent = r.n; n.style.cssText = 'color:#8b8d91;font-size:12px;margin-top:2px'; li.appendChild(n); } ol.appendChild(li); }
    box.appendChild(ol);
  }
  const row = document.createElement('div'); row.className = 'row';
  const b = document.createElement('button'); b.className = 'pill'; b.type = 'button'; b.textContent = all ? 'this slide' : 'all sources'; b.onclick = e => { e.stopPropagation(); renderSources(!all); };
  row.appendChild(b); box.appendChild(row);
}
function togglePlay() {
  if (APP.playing) { APP.tPause = slideT(); APP.playing = false; } else { APP.t0 = performance.now() - APP.tPause * 1000; APP.playing = true; }
  $('playIcon').setAttribute('d', APP.playing ? 'M6 5h4v14H6zM14 5h4v14h-4z' : 'M7 5v14l11-7z');
  $('play').setAttribute('aria-label', APP.playing ? 'Pause' : 'Play');
}
/** draw slide s at time t into a 2D context */
function drawSlide(ctx, s, t) {
  G = ctx; TH = themeOf(s);
  EDIT.slide = s.id; EDIT.depth = 0; EDIT.rec = EDIT.on && ctx.canvas === OFF; if (EDIT.rec) EDIT.boxes.length = 0;
  const sc = APP.scale * APP.dpr;
  ctx.setTransform(sc, 0, 0, sc, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  try { stageLight(t, s.ch); } catch (e) { /* the light is decoration */ }
  if (QA.on) { QA.text.length = 0; QA.boxes.length = 0; }
  const j = s.jolt ? s.jolt(t) : null; if (j) ctx.translate(j[0], j[1]);
  paper(s.paper == null ? 1 : (typeof s.paper === 'function' ? s.paper(t) : s.paper));
  if (s.draw) { try { s.draw(t); } catch (e) { console.error(s.id, e); } }
  ctx.setTransform(sc, 0, 0, sc, 0, 0); ctx.globalAlpha = 1;
  /* the deck's chrome: the rule, THESEUS / chapter, n / N */
  try { slideChrome(t, s); } catch (e) { console.error(s.id, 'chrome', e); }
  /* night gets a soft lens fall-off at the edges; paper stays flat, like a printed sheet */
  if (!TH) {
    const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.62, W / 2, H * 0.5, H * 1.15);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
  EDIT.rec = false;
}
function compose(k) {
  const fx = $('fx').getContext('2d'), w = $('fx').width, h = $('fx').height, sx = w / W;
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1;
  if (k >= 1 || APP.trStart < 0) { fx.drawImage(OFF, 0, 0); return; }
  const A = SNAP, B = OFF, accent = APP.trAcc, dir = APP.back ? -1 : 1;
  if (APP.trans === 'iris') {
    /* a soft iris: the new slide opens in a circle with a feathered ring of light in the chapter's colour, while the
       old one swells a little and dims behind it (no solid colour fills the screen) */
    const x = (APP.irisX || 300) * sx, y = (APP.irisY || 760) * sx, R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 8;
    const ea = E.io3(clamp(k / 0.9)), eb = E.cam(clamp((k - 0.05) / 0.95));
    fx.save(); fx.translate(x, y); fx.scale(1 + 0.06 * ea, 1 + 0.06 * ea); fx.translate(-x, -y); fx.drawImage(A, 0, 0); fx.restore();
    fx.fillStyle = `rgba(0,0,0,${0.35 * ea})`; fx.fillRect(0, 0, w, h);
    const rr0 = Math.max(0.01, R * eb);
    fx.save(); fx.beginPath(); fx.arc(x, y, rr0, 0, Math.PI * 2); fx.clip();
    fx.translate(x, y); fx.scale(1.06 - 0.06 * eb, 1.06 - 0.06 * eb); fx.translate(-x, -y); fx.drawImage(B, 0, 0); fx.restore();
    if (eb > 0 && eb < 1) { fx.strokeStyle = rgba(accent, 0.7 * (1 - eb)); fx.lineWidth = 2 * sx; fx.beginPath(); fx.arc(x, y, rr0, 0, Math.PI * 2); fx.stroke(); }
  } else if (APP.trans === 'sweep') {
    /* a wipe of light: a soft diagonal edge carries the new slide across, a thin glow on its leading edge; the old
       slide drifts back and dims (no band of solid colour) */
    const sl = 0.32 * h, x0 = -sl - 80 * sx, x1 = w + 80 * sx, e = E.cam(clamp(k));
    const xe = lerp(x0, x1, e);
    fx.save(); fx.translate(-50 * sx * e, 0); fx.drawImage(A, 0, 0); fx.restore();
    fx.fillStyle = `rgba(0,0,0,${0.3 * e})`; fx.fillRect(0, 0, w, h);
    const band = xx => { fx.beginPath(); fx.moveTo(-10, 0); fx.lineTo(xx + sl, 0); fx.lineTo(xx, h); fx.lineTo(-10, h); fx.closePath(); };
    fx.save(); band(xe); fx.clip(); fx.translate(40 * sx * (1 - e), 0); fx.drawImage(B, 0, 0); fx.restore();
    if (e > 0 && e < 1) { fx.strokeStyle = rgba(accent, 0.8 * Math.sin(e * Math.PI)); fx.lineWidth = 2 * sx; fx.beginPath(); fx.moveTo(xe + sl, 0); fx.lineTo(xe, h); fx.stroke(); }
  } else if (APP.trans === 'push') {
    const e = E.io5(k);
    fx.drawImage(A, -0.38 * w * e * dir, 0);
    fx.fillStyle = `rgba(0,0,0,${0.32 * e})`; fx.fillRect(0, 0, w, h);
    const bx = dir > 0 ? w * (1 - e) : -w * (1 - e);
    fx.drawImage(B, bx, 0);
    /* a soft shadow off the new slide's leading edge instead of a hard line */
    const lx = dir > 0 ? bx : bx + w, sw = 60 * sx, gsh = fx.createLinearGradient(lx, 0, lx - dir * sw, 0);
    gsh.addColorStop(0, `rgba(0,0,0,${0.35 * Math.sin(e * Math.PI)})`); gsh.addColorStop(1, 'rgba(0,0,0,0)');
    fx.fillStyle = gsh; fx.fillRect(dir > 0 ? lx - sw : lx, 0, sw, h);
  } else { fx.drawImage(A, 0, 0); fx.globalAlpha = E.io3(k); fx.drawImage(B, 0, 0); fx.globalAlpha = 1; }
}
function frame() {
  const s = DECK.slides[APP.i], t = slideT(), now = performance.now();
  V3.pending = 0;
  if (APP.frozenT == null) sfxRun(s, APP.lastT, t); APP.lastT = t;
  drawSlide(OFF.getContext('2d'), s, t);
  let k = APP.trStart > 0 ? prog((now - APP.trStart) / 1000, 0, APP.TR) : 1; if (k >= 1) APP.trStart = -1;
  compose(k);
  if (EDIT.on && k >= 1) editOverlay();
  /* progress inside the chapter segment */
  const segs = [...document.querySelectorAll('.seg')], si = segs.findIndex(b => b.dataset.ch === s.ch);
  segs.forEach((b, kk) => { if (kk < si) b.firstChild.style.width = '100%'; else if (kk > si) b.firstChild.style.width = '0%'; });
  if (segs[si]) { const list = DECK.slides.filter(x => x.ch === s.ch); segs[si].firstChild.style.width = ((list.indexOf(s) + clamp(t / (s.settle || 9))) / list.length * 100) + '%'; }
}
function loop() { frame(); if (typeof R3D !== 'undefined' && (APP.gcN = (APP.gcN || 0) + 1) % 120 === 0) R3D.gc(); if (APP.frozenT == null) requestAnimationFrame(loop); }
async function start() {
  const q = new URLSearchParams(location.search);
  APP.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (q.get('cap')) document.body.classList.add('cap', 'clean');
  fit(); window.addEventListener('resize', () => { fit(); if (APP.frozenT != null) frame(); });
  /* the fonts are embedded (00-head.html); canvas never asks for a font by itself, so load every face before the first frame */
  QA.on = !!q.get('qa');
  const faces = [];
  for (const w of [400, 500, 600, 700, 800, 900]) faces.push(`${w} 40px "Inter Display"`);
  for (const w of [400, 450, 500, 600, 700, 800]) faces.push(`${w} 28px "Inter"`);
  for (const w of [400, 500, 600, 700, 800]) faces.push(`${w} 22px "JetBrains Mono"`);
  try { await Promise.race([Promise.all(faces.map(f => document.fonts.load(f, 'THESEUS 0123456789 µs →'))).then(() => document.fonts.ready), new Promise(r => setTimeout(r, 8000))]); } catch (e) { }
  try { await Promise.race([Promise.all((window.IMGS || []).map(im => im.decode ? im.decode().catch(() => { }) : null)), new Promise(r => setTimeout(r, 3000))]); } catch (e) { }
  buildBar();
  let first = 0; const h0 = (q.get('s') || location.hash.slice(1)), h = /^(2d|3d)$/i.test(h0) ? '' : h0;
  if (h) { const n = DECK.slides.findIndex(s => s.id === h); first = n >= 0 ? n : (parseInt(h) || 0); }
  APP.i = -1; go(first, { instant: true, force: true });
  if (q.get('t') != null) {
    APP.frozenT = parseFloat(q.get('t')); frame();
    /* a 3D shot streams its geometry in: redraw until every scene on this slide has rendered (screenshots wait for it) */
    const t0w = performance.now();
    while (V3.pending > 0 && performance.now() - t0w < 120000) { await new Promise(r => setTimeout(r, 250)); frame(); }
    window.__qa = QA.on ? { text: QA.text.slice(), boxes: QA.boxes.slice() } : null; window.__ready = true; return;
  }
  $('prev').onclick = e => { e.stopPropagation(); go(APP.i - 1); };
  $('next').onclick = e => { e.stopPropagation(); go(APP.i + 1); };
  $('play').onclick = e => { e.stopPropagation(); togglePlay(); };
  $('fs').onclick = e => { e.stopPropagation(); const el = document.documentElement; const p = document.fullscreenElement ? document.exitFullscreen() : (el.requestFullscreen ? el.requestFullscreen() : null); if (p && p.catch) p.catch(() => { }); };
  $('rateBtn').onclick = e => { e.stopPropagation(); const b = $('rate'); b.hidden = !b.hidden; $('rateBtn').setAttribute('aria-expanded', String(!b.hidden)); if (!b.hidden && EDIT.on) editToggle(false); rateSync(); };
  $('editBtn').onclick = e => { e.stopPropagation(); editToggle(); };
  rateInit();
  $('srcBtn').onclick = e => { e.stopPropagation(); const b = $('src'); b.hidden = !b.hidden; $('srcBtn').setAttribute('aria-expanded', String(!b.hidden)); };
  $('sndBtn').onclick = e => { e.stopPropagation(); auInit(); AU.on = !AU.on; $('sndBtn').textContent = AU.on ? 'sound on' : 'sound off'; $('sndBtn').setAttribute('aria-pressed', String(AU.on)); if (AU.on) sfx('click'); };
  $('cleanBtn').onclick = e => { e.stopPropagation(); document.body.classList.toggle('clean'); fit(); };
  $('viewBtn').onclick = e => { e.stopPropagation(); setView2D(!V2D.on); };
  v2dButton();
  $('stage').addEventListener('click', e => { if (EDIT.on) { editPick(e); return; } const r = $('stage').getBoundingClientRect(); go(APP.i + ((e.clientX - r.left) < r.width * 0.3 ? -1 : 1)); });
  let tx = null; $('stage').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  $('stage').addEventListener('touchend', e => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(APP.i + (d < 0 ? 1 : -1)); tx = null; });
  window.addEventListener('keydown', e => {
    if (e.target && /^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName)) return;   /* typing a rating note */
    if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(APP.i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(APP.i - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(DECK.slides.length - 1);
    else if (k === 'h' || k === 'H') { document.body.classList.toggle('clean'); fit(); }
    else if (k === 'p' || k === 'P') togglePlay();
    else if (k === 'r' || k === 'R') go(APP.i, { force: true, instant: true });
    else if (k === 'f' || k === 'F') $('fs').click();
    else if (k === 's' || k === 'S') $('sndBtn').click();
    else if (k === 'd' || k === 'D') setView2D(!V2D.on);
    else if (k === '2') setView2D(true);
    else if (k === '3') setView2D(false);
    else if ((k === 'e' || k === 'E') && !$('editBtn').hidden) editToggle();
    else if (k === 'Escape') { $('src').hidden = true; $('rate').hidden = true; $('rateBtn').setAttribute('aria-expanded', 'false'); if (EDIT.on) editToggle(false); }
  });
  window.addEventListener('hashchange', () => {
    const hv = location.hash.slice(1);
    if (/^(2d|3d)$/i.test(hv)) { setView2D(hv.toLowerCase() === '2d'); try { history.replaceState(null, '', '#' + DECK.slides[APP.i].id); } catch (e) { } return; }
    const n = DECK.slides.findIndex(s => s.id === hv); if (n >= 0 && n !== APP.i) go(n);
  });
  requestAnimationFrame(loop);
}
window.addEventListener('DOMContentLoaded', start);
