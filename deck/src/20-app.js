/* ============================================================================================
   app: one canvas. Each frame the current slide is drawn off screen on its own ground (paper or night), then composed
   onto the stage. The film is one take on one stage (F0b, 2026-11-06, Brock: "the flow between clips has to be extremely
   good ... the pacing also has to be amazing"):
   - Transitions never move the stage: both frames stay registered, so the 40 px grid and the footer hold still while the
     content changes over them. On the same ground the new frame fades in over the old, so what both share holds still
     (dissolve, 0.55 s); when the ground changes, paper to night or back, a soft slanted edge carries the new slide across
     from the left, so its header shows first (wipe, 0.7 s); a change of chapter, either way, is the flight across the
     film's one simplified mouse (F0c, Brock F40.2: "advanced motion transitions"): the old content recedes into the mouse
     where its chapter was, one camera carries it, turning between views, to the next chapter's part, and lands on the
     chapter card's own mouse (flight, 1.6 s; see THE CHAPTER FLIGHT below). A slide may ask for one: trans: 'dissolve' |
     'wipe' | 'flight' | 'chapter' (F0b's pass through black) | 'iris' | 'push' | 'cut'; 'iris' opens a circle round irisAt.
   - Autoplay: each slide plays to its settle, holds there as long as its text takes to read (holdOf: 2 to 6 s, Brock
     F40.1, or the slide's own `hold`), then the film moves on. Manual stepping works at any time; a panel open or a note
     being typed holds the slide. ?auto=0 turns it off.
   - Clips (?clip=<slide id>): that slide alone, once, from its first frame to its settled frame, no bar, no progress
     tick, no page counter, a small THESEUS mark; &vertical=1 lays it out 9:16 for phone feeds. tools/clip.js renders
     one to MP4 through the capture hook (?cap=1&s=<id>&t=<t>, and window.__seek(t) to step without reloading).
   ============================================================================================ */
const APP = { i: 0, t0: 0, tPause: 0, playing: true, dpr: 1, scale: 1, trStart: -1, trDur: 0.6, trans: 'dissolve', frozenT: null, reduced: false, lastT: 0,
  auto: true, hold: null, holdFor: null, blockT: 0, clip: null, vert: false };
const $ = id => document.getElementById(id);
const OFF = document.createElement('canvas'), SNAP = document.createElement('canvas'), BAND = document.createElement('canvas');

function slideT() {
  const t = APP.frozenT != null ? APP.frozenT : APP.playing ? Math.max(0, (performance.now() - APP.t0) / 1000) : APP.tPause;
  /* a clip ends on its settled frame */
  return APP.clip ? Math.min(t, (DECK.slides[APP.i] && DECK.slides[APP.i].settle) || 9) : t;
}
function themeOf(s) { return s.theme === 'paper' ? 1 : 0; }

/* the vertical clip (9:16, for phone feeds): the stage letterboxed full width at VERT.top, in frame units of 1080 × 1920 */
const VERT = { w: 1080, h: 1920, top: 600 };
function fit() {
  const cap = document.body.classList.contains('cap'), clean = document.body.classList.contains('clean');
  const cs = getComputedStyle($('app')), num = v => parseFloat(v) || 0, bar = $('bar');
  const bare = cap || !!APP.clip, padX = bare ? 0 : num(cs.paddingLeft) + num(cs.paddingRight), padY = bare ? 0 : num(cs.paddingTop) + num(cs.paddingBottom) + 10;
  APP.dpr = Math.min(2, window.devicePixelRatio || 1);
  if (APP.vert) {
    /* the frame is 9:16 and fills the window's height; the stage is its full width */
    const fw = Math.floor(Math.max(180, Math.min(window.innerWidth - padX, (window.innerHeight - padY) * 9 / 16))), fh = Math.round(fw * 16 / 9);
    const st = $('stage'); st.style.width = fw + 'px'; st.style.height = fh + 'px';
    APP.scale = fw / W;
    const fwp = Math.round(fw * APP.dpr), fhp = Math.round(fh * APP.dpr), sh = Math.round(fwp * 9 / 16);
    for (const [c, cw, ch] of [[$('fx'), fwp, fhp], [OFF, fwp, sh], [SNAP, fwp, sh]]) if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
    return;
  }
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
  APP.scale = w / W;
  const cw = Math.round(w * APP.dpr), ch = Math.round(h * APP.dpr);
  for (const c of [$('fx'), OFF, SNAP]) { if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; } }
}
/* ---------- the transitions ----------
   How long each takes (s). Quick enough to keep a viewer, long enough never to read as a cut. */
const TRN = { dissolve: 0.55, wipe: 0.7, chapter: 1.1, iris: 1.15, push: 0.6, cut: 0, reduced: 0.25, flight: 1.6, handoff: 1.0 };
/* when the new slide's clock starts, as a fraction of its transition: the chapter move holds it until the slide begins to
   come up out of the dark, so its first frame is the first thing seen (every other move starts it at once) */
const TRS = { chapter: 0.38, flight: 0.8 };   /* flight: onto a card its clock starts on landing (the plan's own, FLY.T.land / dur; tools: t=auto is exact) */
/** the new slide's time at k (0 → 1) through a transition of this kind and length */
const trClock = (kind, k, dur) => Math.max(0, (k - (TRS[kind] || 0)) * dur);
/** which transition takes the film from slide a to slide b: a slide's own `trans` first; a change of chapter, either way,
    the flight across the mouse (F40.2; `flight: false` on either slide opts out); a change of ground the wipe; the same
    ground the dissolve. 'chapter' (F0b's pass through black) stays available as a slide's own `trans` */
function trKind(a, b, back) {
  if (b.trans && TRN[b.trans] != null) return b.trans;
  if (a.ch !== b.ch && a.flight !== false && b.flight !== false) return 'flight';
  /* within a chapter: the shared mouse handed from one slide to the next, when both say where it sits (S({ handoff })) */
  if (a.handoff && a.handoff.out && b.handoff && b.handoff.in) return 'handoff';
  return themeOf(a) !== themeOf(b) ? 'wipe' : 'dissolve';
}
function go(i, opts = {}) {
  i = clamp(i, 0, DECK.slides.length - 1);
  if (i === APP.i && !opts.force) return;
  try { rateFlush(); if (EDIT.on) editSave(); } catch (e) { }
  const now = performance.now(), prev = DECK.slides[APP.i], next = DECK.slides[i];
  APP.back = i < APP.i;
  /* while editing text there is no transition: the outlines would ride along on the old frame */
  const kind = opts.instant || !prev || EDIT.on ? 'cut' : APP.reduced ? 'dissolve' : (opts.kind || trKind(prev, next, APP.back));
  const tPrev = prev ? slideT() : 0;
  if (kind !== 'cut') {
    SNAP.getContext('2d').drawImage($('fx'), 0, 0);
    APP.trStart = now; APP.trans = kind; APP.trDur = APP.reduced ? TRN.reduced : TRN[kind];
    APP.irisAt = next.irisAt || null;
  } else APP.trStart = -1;
  /* the chapter flight and the hand-off: the old slide's content is drawn while it is still current, the new one once it
     is; a hand-off whose declared mice aren't where the slides draw them is a dissolve or a wipe after all */
  const fly = kind === 'flight' || kind === 'handoff', pa = fly ? flPlace(prev, 'out') : null, pb = fly ? flPlace(next, 'in') : null;
  if (fly) flBareA(prev, tPrev, pa);
  APP.i = i; APP.fl = fly ? flBegin(prev, tPrev, next, APP.back, kind, pa, pb) : null;
  if (APP.fl === false) { APP.fl = null; APP.trans = themeOf(prev) !== themeOf(next) ? 'wipe' : 'dissolve'; APP.trDur = TRN[APP.trans]; }
  if (APP.fl) APP.trDur = APP.fl.D;
  APP.t0 = now + (APP.fl ? APP.fl.tB0 * 1000 : kind !== 'cut' && !APP.reduced ? (TRS[kind] || 0) * APP.trDur * 1000 : 0); APP.tPause = 0; APP.lastT = 0; APP.hold = null; APP.holdFor = null;
  if (APP.reduced) { APP.t0 = now - (next.settle || 9) * 1000; APP.tPause = next.settle || 9; }
  if (EDIT.on) { editFreeze(next); EDIT.sel = null; requestAnimationFrame(() => requestAnimationFrame(() => editSync())); }
  if (APP.frozenT == null && !APP.clip) { try { history.replaceState(null, '', '#' + next.id); } catch (e) { } }
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
/* when a rating is archived (Brock, F26.13: "updating a slide should archive its old score"; and 05:05: "you need a solution
   to make sure archived feedback was fully taken into account and it wasn't just some small change that archived the
   feedback"). A score is archived only when the slide's `rev` goes up, and a builder raises it only once it has acted on
   every clause of his note there, listing what it did in the slide's `answers` ([his words, what changed] pairs). A
   wording sweep or a change to a helper archives nothing. The panel shows the archived note beside those answers, and
   "not done" brings the note back as current, at the new rev, recorded in the rating (`reopened`) for Claude to read. */
const slideRev = s => (s && +s.rev) || 0;
/* the rev a rating was made at: saved with it from v21 on; every rating saved before was made at rev 0 */
const ratedRev = r => (r && r.rev != null ? +r.rev : 0);
/* a slide's version, kept in each rating for the record (no longer what archives it) */
function slideVer(s) { return s.__ver || (s.__ver = fnv36(String(s.draw || s.card || '') + '|' + (s.title || '') + '|' + (s.rev || 0))); }
function rateCur(s) { const r = s && RATE.all[rateKey(s.id)]; if (!r) return null; return ratedRev(r) >= slideRev(s) ? r : null; }
function rateOld(s) { const r = s && RATE.all[rateKey(s.id)]; if (!r) return null; return ratedRev(r) < slideRev(s) ? r : null; }
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
    '<p class="slide"></p><div class="was" hidden><p class="wnote"></p><ol class="wans"></ol><div class="wrow"><span class="wq">Not fully done?</span><button class="pill" type="button" data-act="reopen">not done: bring my note back</button></div></div><div class="vals">' + Array.from({ length: 10 }, (_, i) => '<button type="button" data-v="' + (i + 1) + '" aria-label="Rate ' + (i + 1) + ' of 10">' + (i + 1) + '</button>').join('') + '</div>' +
    '<div class="row"><textarea rows="1" placeholder="What matters most here, or what could go (optional)"></textarea><button class="pill" type="button" data-act="next">next unrated</button></div>';
  p.title = 'The scores show which information is safest to condense, not which slides to cut';
  p.querySelectorAll('.vals button').forEach(b => b.onclick = e => { e.stopPropagation(); rateSave({ value: +b.dataset.v }); });
  /* a note belongs to the slide it was typed on (Brock, 01:13: "sometimes my notes from a past slide will carry over to
     the next one"): the box remembers that slide, and any slide change saves the note there first (rateFlush in go) */
  const ta = p.querySelector('textarea');
  ta.oninput = () => { if (RATE.taSlide == null) RATE.taSlide = APP.i; RATE.dirty = true; clearTimeout(RATE.tmr); RATE.tmr = setTimeout(rateFlush, 1200); };
  ta.onblur = () => rateFlush();
  p.querySelector('[data-act="reopen"]').onclick = e => { e.stopPropagation(); rateReopen(); };
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
  /* the revamp's slides replace old ones (s.replaces): his ratings and notes on those show here beside the new slide's
     answers, so he can check every note was taken into account (Brock, 05:05 and 07:10) */
  const prior = [].concat(s.replaces || []).map(id => RATE.all[rateKey(id)] || (typeof F27R !== 'undefined' && F27R[id]) || null).filter(x => x && (x.value || x.note));
  const was = p.querySelector('.was'), hasOld = !!(old && (old.value || old.note)) || prior.length > 0;
  was.hidden = !hasOld;
  if (hasOld) {
    const parts = [];
    if (old && (old.value || old.note)) parts.push('You rated it ' + (old.value || '–') + (old.note ? ': \u201c' + old.note + '\u201d' : ''));
    prior.forEach(x => parts.push('It replaces \u201c' + (x.title || x.id) + '\u201d, rated ' + (x.value || '–') + (x.note ? ': \u201c' + x.note + '\u201d' : '')));
    const cur = RATE.all[rateKey(s.id)], told = prior.length && cur && (cur.reopened || []).some(z => z.replaces);
    p.querySelector('.wnote').textContent = parts.join('. ') + '. What changed for ' + (prior.length ? 'them' : 'it') + ':' + (told ? ' (you marked this not done)' : '');
    const ol = p.querySelector('.wans'), ans = Array.isArray(s.answers) ? s.answers : [];
    ol.innerHTML = '';
    if (!ans.length) { const li = document.createElement('li'); li.textContent = 'No answers listed for this change yet.'; ol.appendChild(li); }
    ans.forEach(a => { const li = document.createElement('li'), q = document.createElement('q'), d = document.createElement('span'); q.textContent = a[0]; d.textContent = ' \u2192 ' + a[1]; li.appendChild(q); li.appendChild(d); ol.appendChild(li); });
    const rb = p.querySelector('[data-act="reopen"]'); rb.disabled = RATE.ro;
    rb.textContent = old && (old.value || old.note) ? 'not done: bring my note back' : 'not done';
  }
  p.querySelectorAll('.vals button').forEach(b => { b.classList.toggle('on', !!(r && +b.dataset.v === r.value)); b.disabled = RATE.ro; });
  const ta = p.querySelector('textarea'); ta.disabled = RATE.ro;
  if (RATE.taSlide !== APP.i) { rateFlush(); ta.value = (r && r.note) || ''; RATE.taSlide = APP.i; RATE.dirty = false; }
  else if (!RATE.dirty && document.activeElement !== ta) ta.value = (r && r.note) || '';
  p.querySelector('.state').textContent = RATE.note || (done + ' of ' + DECK.slides.length + ' rated');
}
/* "not done": the archived score and note come back as current at the slide's new rev, and the press is recorded */
function rateReopen() {
  if (!RATE.db || RATE.ro) return;
  const s = DECK.slides[APP.i], old = rateOld(s);
  const k = rateKey(s.id), rev = slideRev(s);
  if (!old) {
    /* a revamp slide: record that its answers don't cover his notes on the slides it replaces */
    if (!s.replaces) return;
    const cur = RATE.all[k] || {};
    const doc = Object.assign({ id: s.id, title: s.title || '', ch: s.ch || '', value: null, note: '', history: [] }, cur, { rev, ver: slideVer(s), n: APP.i + 1, of: DECK.slides.length, at: new Date().toISOString(),
      reopened: (cur.reopened || []).concat([{ at: new Date().toISOString(), replaces: [].concat(s.replaces), answers: (s.answers || []).length }]) });
    RATE.all[k] = doc; RATE.note = 'Marked not done: Claude will see it'; rateSync();
    rateWrite(k); return;
  }
  const doc = Object.assign({}, old, { rev, ver: slideVer(s), n: APP.i + 1, of: DECK.slides.length, at: new Date().toISOString(),
    reopened: (old.reopened || []).concat([{ at: new Date().toISOString(), fromRev: ratedRev(old), rev, answers: (s.answers || []).length }]) });
  RATE.all[k] = doc; RATE.taSlide = null; RATE.note = 'Your note is back on this slide'; rateSync();
  rateWrite(k);
}
function rateSave(patch, si) {
  if (!RATE.db || RATE.ro) return;
  const i = si == null ? APP.i : si, s = DECK.slides[i]; if (!s) return;
  const k = rateKey(s.id), prev = RATE.all[k] || {}, rev = slideRev(s), pr = ratedRev(prev.id ? prev : null), same = !prev.id || pr >= rev, old = same ? prev : {};
  const history = (prev.history || []).slice();
  if (!same && (prev.value || prev.note)) history.push({ rev: pr, ver: prev.ver || null, value: prev.value || null, note: prev.note || '', at: prev.at || null, title: prev.title || '', n: prev.n || null });
  const doc = { id: s.id, title: s.title || '', ch: s.ch || '', n: i + 1, of: DECK.slides.length, rev, ver: slideVer(s), value: old.value || null, note: old.note || '', history, reopened: prev.reopened || [] };
  Object.assign(doc, patch);
  if (same && doc.value === (old.value || null) && doc.note === (old.note || '')) return;
  doc.at = new Date().toISOString();
  RATE.all[k] = doc; RATE.note = ''; rateSync();
  rateWrite(k);
}
function rateWrite(k) {
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
/** the film's chrome is the stage's, not the slide's: it is drawn settled, so the rule and the footer hold perfectly still
    from one slide to the next (F0c: slideChrome drew its rule on from the left and faded its labels in at every slide's
    t = 0, so the footer dipped and redrew through every dissolve) */
const CHROME_T = 9;
/** a slide's grid strength at t (s.paper: a number, a function of t, or nothing for the full grid) */
const paperOf = (s, t) => (s.paper == null ? 1 : (typeof s.paper === 'function' ? s.paper(t) : s.paper));
/** the night stage's soft lens fall-off at the edges, at strength a (paper stays flat, like a printed sheet) */
function vignette(ctx, a = 1) {
  if (a <= 0.003) return;
  const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.62, W / 2, H * 0.5, H * 1.15);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.globalAlpha = a; ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
}
/** draw slide s at time t into a 2D context. o = { chrome: false (a clip draws its own mark), vignette: false, bare: true
    (the slide's own drawing only, on a clear canvas: no ground, grid, chrome or vignette; the chapter flight lays those
    on the stage itself, so they hold still while the slide's content recedes or emerges) } */
function drawSlide(ctx, s, t, o = {}) {
  G = ctx; TH = themeOf(s);
  EDIT.slide = s.id; EDIT.depth = 0; EDIT.rec = EDIT.on && ctx.canvas === OFF && !o.bare; if (EDIT.rec) EDIT.boxes.length = 0;
  const sc = APP.scale * APP.dpr;
  if (o.bare) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); }
  ctx.setTransform(sc, 0, 0, sc, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (!o.bare) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    try { stageLight(t, s.ch); } catch (e) { /* the light is decoration */ }
  }
  if (QA.on) { QA.text.length = 0; QA.boxes.length = 0; }
  const j = s.jolt ? s.jolt(t) : null; if (j) ctx.translate(j[0], j[1]);
  if (!o.bare) paper(paperOf(s, t));
  /* a bare draw is the chapter flight's: a card's kit mouse is then the flight's to draw (the kit's CARD2.hide) */
  const kitHide = typeof CARD2 !== 'undefined'; if (kitHide) { CARD2.hide = !!o.bare; CARD2.skip = o.bare && o.skip ? o.skip : null; }
  if (s.draw) { try { s.draw(t); } catch (e) { console.error(s.id, e); } }
  if (kitHide) { CARD2.hide = false; CARD2.skip = null; }
  ctx.setTransform(sc, 0, 0, sc, 0, 0); ctx.globalAlpha = 1;
  if (!o.bare) {
    /* the deck's chrome: the rule, THESEUS / chapter, n / N, settled (it is the stage's); a clip carries only its mark */
    if (APP.clip) { if (o.chrome !== false) { try { clipMark(t, s); } catch (e) { console.error(s.id, 'mark', e); } } }
    else if (o.chrome !== false) { try { slideChrome(CHROME_T, s); } catch (e) { console.error(s.id, 'chrome', e); } }
    if (!TH && o.vignette !== false) vignette(ctx);
  }
  EDIT.rec = false;
}
/* the easings of the moves: a wipe starts promptly and lands softly; the chapter's circle opens like a lens */
const TRE = { wipe: bezier(0.42, 0, 0.18, 1), iris: bezier(0.6, 0, 0.16, 1), out: bezier(0.3, 0, 0.6, 1) };
/** compose the stage: the new frame (OFF) over the old (SNAP), k = 0 → 1 through the transition */
function compose(k) {
  const fx = $('fx').getContext('2d'), w = $('fx').width, h = $('fx').height, sx = w / W;
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
  if (APP.vert) { composeVert(fx); return; }
  if (k >= 1 || APP.trStart < 0) { fx.drawImage(OFF, 0, 0); return; }
  const A = SNAP, B = OFF, dir = APP.back ? -1 : 1;
  if (APP.trans === 'dissolve') {
    /* the same ground: the new frame fades in over the old, so whatever is the same on both (the chapter's label, the
       footer, a part one slide hands to the next, M9) holds perfectly still while the rest changes; steeply eased, so
       the two frames share the stage only for a moment (20 to 80 % in under a tenth of a second) */
    fx.drawImage(A, 0, 0);
    fx.globalAlpha = E.io5(k); fx.drawImage(B, 0, 0); fx.globalAlpha = 1;
  } else if (APP.trans === 'wipe') {
    /* the ground changes: a soft, slightly slanted edge carries the new slide across over the old one, left to right
       (right to left going back), so its header is the first thing to show. Both frames stay where they are: the grid's
       lines run on across the edge, the light changes behind it. Behind the feather the new frame is drawn through a
       clip; only the feather's band, about an eighth of the stage, goes through a small canvas and a gradient mask */
    const e = TRE.wipe(k), F = 0.03 * w, s = Math.tan(10 * Math.PI / 180), n = Math.hypot(1, s);
    const xm = lerp(-h * s / 2, w + h * s / 2 + F * n, e);                   /* the edge's x at mid-height, going forward */
    /* the line d px behind the edge (along its normal), at the top and the bottom of the stage; X mirrors going back */
    const xt = d => xm + h * s / 2 - d * n, xb = d => xm - h * s / 2 - d * n, X = x => (dir > 0 ? x : w - x);
    fx.drawImage(A, 0, 0);
    const far = w + 2 * h * s + 2 * F * n;
    fx.save(); fx.beginPath(); fx.moveTo(X(xt(far)), 0); fx.lineTo(X(xt(F)), 0); fx.lineTo(X(xb(F)), h); fx.lineTo(X(xb(far)), h); fx.closePath(); fx.clip();
    fx.drawImage(B, 0, 0); fx.restore();
    /* the feather: B over the band from d = F (whole) to the edge (nothing), on a canvas just the band's size */
    const bw = Math.ceil(h * s + F * n) + 4, f0 = Math.floor(xb(F)) - 2, bx = dir > 0 ? f0 : Math.floor(w - f0 - bw);
    if (bx < w && bx + bw > 0) {
      if (BAND.width !== bw || BAND.height !== h) { BAND.width = bw; BAND.height = h; }
      const bc = BAND.getContext('2d'), cx = X(xm) - bx;
      bc.setTransform(1, 0, 0, 1, 0, 0); bc.globalAlpha = 1; bc.globalCompositeOperation = 'source-over';
      bc.clearRect(0, 0, bw, h); bc.drawImage(B, -bx, 0);
      const gr = bc.createLinearGradient(cx - dir * F / n, h / 2 - s * F / n, cx, h / 2);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      bc.globalCompositeOperation = 'destination-in'; bc.fillStyle = gr; bc.fillRect(0, 0, bw, h); bc.globalCompositeOperation = 'source-over';
      fx.drawImage(BAND, bx, 0);
    }
  } else if (APP.trans === 'chapter') {
    /* a new chapter, the film's one pass through the dark: the old slide recedes as it fades out, a breath of black, and
       the chapter comes up out of it, settling from a hair nearer */
    const ea = TRE.out(prog(k, 0, 0.48)), eb = E.out3(prog(k, 0.38, 1));
    fx.fillStyle = '#050506'; fx.fillRect(0, 0, w, h);
    if (ea < 1) { const sc = 1 - 0.045 * ea; fx.save(); fx.globalAlpha = 1 - ea; fx.translate(w / 2, h / 2); fx.scale(sc, sc); fx.translate(-w / 2, -h / 2); fx.drawImage(A, 0, 0); fx.restore(); }
    if (eb > 0) { const sc = 1.03 - 0.03 * eb; fx.save(); fx.globalAlpha = eb; fx.translate(w / 2, h / 2); fx.scale(sc, sc); fx.translate(-w / 2, -h / 2); fx.drawImage(B, 0, 0); fx.restore(); }
  } else if (APP.trans === 'iris') {
    /* the chapter opens in a circle (round its part when the card says where: irisAt), settling from a hair larger, as
       the old slide recedes into the dark; a quiet ring of light rides the circle's edge */
    const at = APP.irisAt || [W / 2, H / 2], x = at[0] * sx, y = at[1] * sx, R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 4;
    const ea = TRE.out(prog(k, 0, 0.55)), eb = TRE.iris(prog(k, 0.16, 1));
    fx.fillStyle = NIGHT; fx.fillRect(0, 0, w, h);
    if (ea < 1) {
      const sc = 1 - 0.06 * ea;
      fx.save(); fx.globalAlpha = 1 - ea; fx.translate(w / 2, h / 2); fx.scale(sc, sc); fx.translate(-w / 2, -h / 2); fx.drawImage(A, 0, 0); fx.restore();
    }
    const r = R * eb;
    if (r > 0.5) {
      const sc = 1.04 - 0.04 * eb;
      fx.save(); fx.beginPath(); fx.arc(x, y, r, 0, Math.PI * 2); fx.clip();
      fx.translate(x, y); fx.scale(sc, sc); fx.translate(-x, -y); fx.drawImage(B, 0, 0); fx.restore();
      if (eb < 1) { fx.strokeStyle = `rgba(243,242,238,${0.32 * Math.sin(Math.PI * Math.min(1, eb * 1.6))})`; fx.lineWidth = 1.5 * sx; fx.beginPath(); fx.arc(x, y, r, 0, Math.PI * 2); fx.stroke(); }
    }
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
  } else if ((APP.trans === 'flight' || APP.trans === 'handoff') && APP.fl) flCompose(fx, k);
  else { fx.drawImage(A, 0, 0); fx.globalAlpha = E.io3(k); fx.drawImage(B, 0, 0); fx.globalAlpha = 1; }
}

/* ============================================================================================
   THE CHAPTER FLIGHT (F0c; Brock, F40.2: "advanced motion transitions", not a pass through black).
   The film's one simplified mouse is the thread between chapters. At a chapter change the outgoing slide recedes into
   the mouse (only its content goes: the ground, the grid and the footer stay where they are), the mouse shows where the
   chapter was (its part lit in Theseus's blue), and one camera carries it to where the next chapter is, turning between
   views when the next part faces another way (top, side, below), and lands exactly where the chapter card draws its own
   mouse; the card's words land over it and the card lights its part. Stepping back plays the same move the other way:
   the card's words go, the camera flies back, the slide comes up out of the mouse.
   - Each end of the move is a card or a slide. A card is a slide whose kit mouse the player can see: chapterCard2's part,
     read through the kit's capture (CARD2), or a slide's own `flight: { view, box, pad }`. A card's mouse IS the flight's
     mouse at that end: the flight starts on it or lands on it exactly. A slide recedes into, or emerges out of, its
     chapter's station: the chapter's part, lit, framed large at the centre (FLY.st).
   - The turn: each view is a roll about the mouse's long axis and a turn in the plane (top 0°, side 90°, below 180°).
     Between two views the mouse is a loft of the kit's own outlines (the top's width, the side's heights, the front's
     section), so its silhouette and its lines (seams, skirt, wheel, buttons, skates, lens) turn as one solid; before and
     after the turn it is the kit's own drawing, so the hand-off to a card is exact.
   - Timeline, s (FLY.T): the slide recedes 0 to 0.42 as the mouse comes up; the camera moves 0.22 to 1.28 (E.cam),
     turning 0.58 to 1.18 when it must; the old part's light goes 0.3 to 0.56; a card's clock starts on landing (1.28)
     and its part comes up over the landed mouse until the flight's layer goes (1.6); a slide emerges 1.2 to 1.6 instead.
   ============================================================================================ */
const FLY = {
  dur: TRN.flight,
  /* rec: a slide recedes; up: the mouse comes up; words: a card's words go; theme: the ground changes (paper and night),
     after the slide has gone, while only the mouse moves; move: the camera; off: the old part's light goes; k2l, l2k: the
     kit's drawing hands over to the loft and back, around the turn; land: a card's clock starts; on: a slide's chapter
     part lights; emerge: a slide comes up; chrome: the footer's chapter changes hands (on one ground) */
  T: { rec: [0, 0.4], up: [0.03, 0.34], words: [0, 0.24], theme: [0.34, 0.66], move: [0.22, 1.28], off: [0.3, 0.56], k2l: [0.5, 0.58],
    turn: [0.58, 1.18], l2k: [1.18, 1.26], land: 1.28, on: [1.22, 1.44], emerge: [1.2, 1.6], chrome: [0.5, 0.9] },
  /* each chapter's station: its view, the part lit, and the large shot a slide recedes into or emerges from (focus: the
     mm point at the stage's centre, in the view's frame; s: px per mm). The parts are Brock's (F40.2): the triggers for
     clicks, the sensor and skates for glide, the shell and hump for shell, the sides for surface, the board for
     electronics, the side profile for shape, the base and screws for ownership; the intro's is the battery (its ledger
     line: light or long-lasting), the close's the whole shell */
  st: {
    intro: { view: 'top', hi: ['battery'], focus: [0, 0], s: 6.6 },    /* the intro's trade: weight against battery life */
    click: { view: 'top', hi: ['triggers'], focus: [0, -30], s: 8.6 },
    glide: { view: 'bottom', hi: ['sensor', 'skates'], focus: [0, -12], s: 8.0 },
    shell: { view: 'left', hi: ['shell', 'hump'], focus: [6, -22], s: 10.5 },
    surface: { view: 'left', hi: ['sides'], focus: [0, -19], s: 10.5 },
    elec: { view: 'top', hi: ['board'], show: ['battery'], focus: [0, -18], s: 8.0 },
    shape: { view: 'left', hi: ['shell'], focus: [0, -20], s: 12.2 },
    own: { view: 'bottom', hi: ['base', 'screws'], focus: [0, -11], s: 8.6 },
    end: { view: 'top', hi: ['shell'], focus: [0, 0], s: 6.6 }
  },
  ctr: [960, 540],
  cardBox: [1000, 200, 840, 500],              /* chapterCard2's part box */
  YM: 19.95,                                  /* the axis the mouse turns about: half its drawn height (MS_SIDE's 39.9 mm) */
  V: { top: [0, 0], left: [90, -90], side: [90, -90], bottom: [180, 0], right: [-90, 90] },   /* view: [roll, in-plane], degrees */
  loft: null
};
/* THE HAND-OFF (F0c; common.md M9): within a chapter, when a slide ends on the simplified mouse and the next one starts on
   it (both say where: S({ handoff: { out, in } })), the one mouse moves, and turns if it must, from the first place to the
   second while everything else changes round it: the old content goes in place 0 to 0.22 s, the camera moves 0.06 to
   0.86, the new content comes up 0.5 to 0.86 at its first frame, its clock starts on landing, done at 1.0 s. Only where
   the kit sees both mice drawn exactly where declared (CARD2.skip); otherwise the plain dissolve or wipe. */
const HAND = { dur: TRN.handoff,
  T: { words: [0, 0.22], up: [0, 0], theme: [0.2, 0.5], move: [0.06, 0.86], off: [99, 99], k2l: [0.14, 0.2], turn: [0.2, 0.76],
    l2k: [0.76, 0.82], land: 0.86, on: [0.86, 0.86], emerge: [0.5, 0.86], chrome: [0.3, 0.7], rec: [0, 0] } };
/** where a slide says its simplified mouse sits, as the kit would place it: S({ handoff: { in: d, out: d } }) for a hand-off
    (in: at its first frame; out: at its end), S({ flight: d }) for both. d = { view, box: [x, y, w, h] stage px, pad (as
    given to mouseFit: 0.06; establish's first frame: 0.08), focus (a part name or [x, y, w, h] mm: a closer frame, as
    establish's push lands; fpad 0.06) }. Only a mouse drawn whole inside its box (a clipped one can't be taken over) */
function flPlace(s, which) {
  const d = s.handoff && s.handoff[which] || (s.flight && s.flight.view ? s.flight : null);
  if (!d || !d.view || !d.box) return null;
  const v = d.view === 'side' ? 'left' : d.view; if (!FLY.V[v]) return null;
  const b = d.box, r = Array.isArray(d.focus) ? d.focus : typeof d.focus === 'string' ? msBox(v, d.focus) : msBox(v);
  const c = camFit(r, b, d.focus ? (d.fpad == null ? 0.06 : d.fpad) : d.pad == null ? 0.06 : d.pad);
  const m = [c.s, 0, 0, c.s, b[0] + b[2] / 2 - c.cx * c.s, b[1] + b[3] / 2 - c.cy * c.s], P = msView(v).outPts;
  const xs = P.map(q => m[0] * q[0] + m[4]), ys = P.map(q => m[3] * q[1] + m[5]);
  if (Math.min(...xs) < b[0] - 2 || Math.max(...xs) > b[0] + b[2] + 2 || Math.min(...ys) < b[1] - 2 || Math.max(...ys) > b[1] + b[3] + 2) return null;
  return { view: v, m, skip: { view: v, m, hit: null } };
}
const BAREA = document.createElement('canvas'), SCR = document.createElement('canvas'), CHR = document.createElement('canvas');
/** a view's turning centre (the mouse's axis, X = 0, Y = YM, Z = 0) in that view's mm frame */
function flMv(view) { return view === 'left' || view === 'side' || view === 'right' ? [0, -FLY.YM] : [0, 0]; }
/** the camera for a kit placement: view and transform matrix m (stage px per mm, no rotation) → { view, phi, psi, P, s } */
function flCamOf(view, m) {
  const v = view === 'side' ? 'left' : view, a = FLY.V[v], Mv = flMv(v);
  return { view: v, phi: a[0], psi: a[1], s: m[0], P: [m[0] * Mv[0] + m[2] * Mv[1] + m[4], m[1] * Mv[0] + m[3] * Mv[1] + m[5]] };
}
/** one end of the flight: a card (its kit mouse seen, so the flight's mouse is exactly it there) or a slide (its chapter's
    station). t: the slide's time at that end; hint: a card's capture from its settled frame, when its first shows no mouse */
function flEnd(s, t, hint, place) {
  const st = FLY.st[s.ch] || FLY.st.intro;
  let view = null, m = null, o = null;
  /* a mouse the slide declared, and really drew there (the kit's skip saw it): exact, as a card's */
  if (place && place.skip && place.skip.hit) return { card: true, view: place.view, cam: flCamOf(place.view, place.m), o: place.skip.hit.o, skip: place.skip, st, s };
  {
    const rec = typeof CARD2 !== 'undefined' && CARD2.rec ? CARD2.rec[s.id] : null;
    const cs = rec && rec.caps ? rec.caps.filter(c => FLY.V[c.view] && Math.abs(c.m[1]) + Math.abs(c.m[2]) < 1e-6) : [];
    if (cs.length) { const c = cs.reduce((a, b) => (b.m[0] > a.m[0] ? b : a)); view = c.view; m = c.m; o = c.o; }
  }
  if (view && FLY.V[view]) return { card: true, view: view === 'side' ? 'left' : view, cam: flCamOf(view, m), o, st, s };
  const v = st.view, Mv = flMv(v), a = FLY.V[v];
  /* a card whose part the player can't see (drawn without the kit's mouse): the flight still lands where a card's part
     sits, in its chapter's view, and hands over softly there */
  if (s.card && s.flight !== false) {
    const hc = hint && hint.caps ? hint.caps.filter(c => FLY.V[c.view] && Math.abs(c.m[1]) + Math.abs(c.m[2]) < 1e-6) : [];
    if (hc.length) { const c = hc.reduce((x, y) => (y.m[0] > x.m[0] ? y : x)), hv = c.view === 'side' ? 'left' : c.view; return { card: true, soft: true, view: hv, cam: flCamOf(hv, c.m), o: { hi: [], show: c.o.show, lit: 0, col: 'ink' }, st, s }; }
    /* no kit mouse at all (b02's switch, b08's swatch): the flight lands in the card's part box and lights the chapter's
       part itself as the card's words begin, then gives the box to the card's own drawing */
    const b = FLY.cardBox, c = camFit(msBox(v), b, 0.04);
    return { card: true, soft: true, bare: true, view: v, cam: flCamOf(v, [c.s, 0, 0, c.s, b[0] + b[2] / 2 - c.cx * c.s, b[1] + b[3] / 2 - c.cy * c.s]), o: { hi: st.hi, show: st.show, lit: 0, col: 'ink' }, st, s };
  }
  return { card: false, view: v, cam: { view: v, phi: a[0], psi: a[1], s: st.s, P: [FLY.ctr[0] + st.s * (Mv[0] - st.focus[0]), FLY.ctr[1] + st.s * (Mv[1] - st.focus[1])] }, st, s };
}
/** the flight from slide A (at its time tA) to slide B, going back or not. B must already have been drawn once (so a
    card's mouse has been seen); A was the slide on screen */
function flPlan(A, B, tA, back, hint, kind, pa, pb) {
  const ho = kind === 'handoff', T = ho ? HAND.T : FLY.T, a = flEnd(A, tA, null, pa), b = flEnd(B, 0, hint, pb);
  /* landing on a card whose part is no mouse at all, the mouse stays a beat longer, lit, before it gives way */
  const D = ho ? HAND.dur : FLY.dur + (b.bare ? 0.25 : 0);
  let p0 = a.cam.phi, p1 = b.cam.phi;
  if (p1 - p0 > 180) p1 -= 360; else if (p0 - p1 > 180) p1 += 360;
  const turn = a.view !== b.view;
  return { kind: ho ? 'handoff' : 'flight', T, A, B, tA, back, a, b, D, turn, p0, p1, thA: themeOf(A), thB: themeOf(B),
    tB0: b.card ? T.land : D, gA: paperOf(A, tA), gB: paperOf(B, 0), bSkip: pb ? [pb.skip] : null };
}
/** the camera at flight time u (s): its scale moves geometrically and its point about the one fixed point a zoom has,
    so the move reads as one push or pull; the roll and the in-plane turn ease through the turn's window */
function flCam(pl, u) {
  const T = pl.T, A = pl.a.cam, B = pl.b.cam, e = E.cam(prog(u, T.move[0], T.move[1]));
  const s = A.s * Math.pow(B.s / A.s, e);
  let P;
  if (Math.abs(B.s - A.s) > 1e-3 * Math.max(A.s, B.s)) {
    const Q = [(B.P[0] * A.s - A.P[0] * B.s) / (A.s - B.s), (B.P[1] * A.s - A.P[1] * B.s) / (A.s - B.s)];
    P = [Q[0] + (A.P[0] - Q[0]) * s / A.s, Q[1] + (A.P[1] - Q[1]) * s / A.s];
  } else P = [lerp(A.P[0], B.P[0], e), lerp(A.P[1], B.P[1], e)];
  const r = pl.turn ? E.io3(prog(u, T.turn[0], T.turn[1])) : 0;
  return { s, P, phi: lerp(pl.p0, pl.p1, r), psi: lerp(A.psi, B.psi, r), r };
}
/** the kit's own drawing of a view under the flight's camera (exact when the camera sits on that view) */
function flKit(view, cam, o) {
  const Mv = flMv(view);
  if (!XF.st.length) XF.m = [1, 0, 0, 1, 0, 0];
  const pa = PA; PA = 1; xsave();
  try { xmove(cam.P[0] - cam.s * Mv[0], cam.P[1] - cam.s * Mv[1]); xscale(cam.s); mouseSimple(view, o); }
  finally { xrest(); PA = pa; }
}
/** the lit state at one end, at flight time u: a card's own (its capture), or the station's part */
function flLit(pl, end, u, src) {
  const T = pl.T;
  if (end.card) {
    /* a card's own state as it was last drawn (its capture, or a declared mouse's skip), else as planned */
    const rec = !end.soft && !end.skip && typeof CARD2 !== 'undefined' && CARD2.rec ? CARD2.rec[end.s.id] : null;
    const cs = rec && rec.caps ? rec.caps.filter(c => c.view === end.view) : [];
    const o = Object.assign({}, end.skip && end.skip.hit ? end.skip.hit.o : cs.length ? cs.reduce((a, b) => (b.m[0] > a.m[0] ? b : a)).o : end.o || {});
    if (src) o.lit = (o.lit == null ? 1 : o.lit) * (1 - E.io3(prog(u, T.off[0], T.off[1])));
    else if (end.bare) o.lit = E.io3(prog(u, T.on[0] - 0.12, T.on[1] - 0.12));
    return o;
  }
  const k = src ? 1 - E.io3(prog(u, T.off[0], T.off[1])) : E.io3(prog(u, T.on[0], T.on[1]));
  return { hi: end.st.hi, show: end.st.show, lit: k, col: src || pl.back ? 'hero' : 'ink' };
}
/** the mouse at flight time u, in the current theme, at alpha al: the kit's drawing at either end, the loft in a turn */
function flMouse(pl, u, al) {
  if (al <= 0.003) return;
  const T = pl.T, cam = flCam(pl, u), B = pl.b, A = pl.a;
  /* the light changes hands between the two ends' drawings: the old part goes before the camera leaves it, the new one
     comes once it has landed */
  const useB = pl.turn ? u >= T.turn[1] : u >= (B.bare ? T.on[0] - 0.12 : T.on[0]);
  const end = useB ? B : A, ok = flLit(pl, end, u, !useB);
  if (!pl.turn) { flKit(end.view, cam, Object.assign(ok, { alpha: al })); return; }
  /* a turn: the kit's drawing hands over to the loft before it, the loft turns, and hands back after it */
  const xIn = E.io3(prog(u, T.k2l[0], T.k2l[1])), xOut = 1 - E.io3(prog(u, T.l2k[0], T.l2k[1])), x = Math.min(xIn, xOut);
  const kitCam = Object.assign({}, cam, { phi: useB ? pl.p1 : pl.p0 });
  if (x <= 0.001) { flKit(end.view, kitCam, Object.assign(ok, { alpha: al })); return; }
  flLoftDraw(cam, al, { body: true });
  if (x < 0.999) flKit(end.view, kitCam, Object.assign(ok, { alpha: al * (1 - x), fill: 'rgba(0,0,0,0)' }));
  flLoftDraw(cam, al * x, { body: false });
}

/* ---------- the loft: the kit's outlines as one solid, for the turns ----------
   Scene mm: X the user's left, Y up from the pad, Z toward the nose. Stations along Z: the top view's half-width w (the
   key plan's outline, as mouseSimple draws it), the side view's lowest and highest points (MS_SIDE), and the front
   view's outline (MS_FRONT) as the section, scaled to them. Under a roll the stations stay flat to the screen, so the
   silhouette is each station's extent: exact for the loft and cheap. The features are the kit's own lines, placed on it. */
function flLoft() {
  if (FLY.loft) return FLY.loft;
  const SP = MS_SIDE, FP = MS_FRONT, fy0 = Math.min(...FP.map(p => p[1])), fy1 = Math.max(...FP.map(p => p[1]));
  const fx1 = Math.max(...FP.map(p => Math.abs(p[0]))), fh = fy1 - fy0, YM = FLY.YM;
  /* the side outline crossed at z: its lowest and highest points */
  const env = z => { let lo = Infinity, hi = -Infinity; for (let i = 0; i < SP.length; i++) { const a = SP[i], b = SP[(i + 1) % SP.length]; if ((z - a[0]) * (z - b[0]) <= 0 && a[0] !== b[0]) { const y = a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0]); lo = Math.min(lo, y); hi = Math.max(hi, y); } } return lo <= hi ? [lo, hi] : null; };
  /* the front outline crossed at height y: the outermost point each side, with the outline's outward normal there */
  const front = y => { let L = null, R = null; for (let i = 0; i < FP.length; i++) { const a = FP[i], b = FP[(i + 1) % FP.length]; if ((y - a[1]) * (y - b[1]) <= 0 && a[1] !== b[1]) { const x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); let nx = b[1] - a[1], ny = a[0] - b[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; if (nx * x < 0) { nx = -nx; ny = -ny; } if (!L || x > L.x) L = { x, n: [nx, ny] }; if (!R || x < R.x) R = { x, n: [nx, ny] }; } } return { L, R }; };
  /* the section: the front outline normalised (u -1..1 across, v 0..1 up); its convex hull carries the silhouette */
  const nrm = FP.map(([x, y]) => [x / fx1, (y - fy0) / fh]).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of nrm) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = nrm.length - 1; i >= 0; i--) { const p = nrm[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  const hull = lo.slice(0, -1).concat(up.slice(0, -1));
  /* the stations: denser at the nose and the tail, where the outlines turn fastest */
  const zs0 = Math.min(...SP.map(p => p[0])), zs1 = Math.max(...SP.map(p => p[0])), zt1 = -KEY.nose * MS_K.y, zt0 = -KEY.tail * MS_K.y;
  const z0 = Math.min(zs0, zt0), z1 = Math.max(zs1, zt1), N = 150, st = [];
  for (let i = 0; i <= N; i++) {
    const z = z0 + (z1 - z0) * (1 - Math.cos(Math.PI * i / N)) / 2, w = z > zt0 && z < zt1 ? msHalfW(-z) : 0;
    let e = env(z); if (!e) { const ee = env(clamp(z, zs0 + 0.01, zs1 - 0.01)) || [10, 10], mid = (ee[0] + ee[1]) / 2; e = [mid, mid]; }
    st.push({ z, w, yb: e[0], yt: e[1] });
  }
  const at = z => { let i = 1; while (i < st.length - 1 && st[i].z < z) i++; const a = st[i - 1], b = st[i], k = clamp((z - a.z) / ((b.z - a.z) || 1)); return { z, w: lerp(a.w, b.w, k), yb: lerp(a.yb, b.yb, k), yt: lerp(a.yt, b.yt, k) }; };
  /* a point on the wall at station z, height y (side 1: the user's left, -1 the right), with its outward normal */
  const wall = (z, y, side, proud = 0) => {
    const q = at(z), h = q.yt - q.yb; if (q.w < 0.05 || h < 0.05 || y < q.yb || y > q.yt) return null;
    const f = front(fy0 + (y - q.yb) / h * fh), c = side > 0 ? f.L : f.R; if (!c) return null;
    const sx = q.w / fx1, sy = h / fh; let nx = c.n[0] / sx, ny = c.n[1] / sy; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    return { p: [c.x * sx + nx * proud, y + ny * proud, z], n: [nx, ny] };
  };
  const F = [];   /* features: { pts: [[X, Y, Z]], ns: [[nX, nY]] (per point), close, kind: 'line' | 'solid', side } */
  const line = (pts, ns, o = {}) => { if (pts.length > 1) F.push(Object.assign({ pts, ns, kind: 'line' }, o)); };
  /* the skirt: the base chamfer's top edge, 9.3 mm up, both walls */
  for (const side of [1, -1]) { const P = [], Nn = []; for (const q of st) { const r = wall(q.z, MS_SKIRT, side); if (r) { P.push(r.p); Nn.push(r.n); } } line(P, Nn, { w: 1.3 }); }
  /* the triggers' edges down each wall to the nose (the side view's seam line) */
  for (const side of [1, -1]) { const P = [], Nn = []; for (const [z, y] of MS_SIDE_SEAM[0]) { const r = wall(z, y, side, 0.05); if (r) { P.push(r.p); Nn.push(r.n); } } line(P, Nn, { w: 1.3 }); }
  /* the centre split on top, broken where the wheel sits, and the straight rear cutout across the top */
  const top = (za, zb) => { const P = [], Nn = []; for (let i = 0; i <= 40; i++) { const z = lerp(za, zb, i / 40), q = at(z); P.push([0, q.yt + 0.05, z]); Nn.push([0, 1]); } return [P, Nn]; };
  const zN = -KEY.nose * MS_K.y - 0.6, zW1 = 46.4 * MS_K.y, zW0 = 28.4 * MS_K.y, zC = -KEY.seam * MS_K.y;
  line(...top(zN, zW1), { w: 1.3 }); line(...top(zW0, zC), { w: 1.3 });
  { const q = at(zC), h = q.yt - q.yb, P = [], Nn = [];
    /* the cutout runs over the top from where the triggers' edges meet it on each wall */
    const yA = Math.min(q.yt - 0.5, MS_SIDE_SEAM[0][MS_SIDE_SEAM[0].length - 1][1] - 6);
    const arc = FP.filter(([x, y]) => (y - fy0) / fh * h + q.yb >= yA).sort((p, r) => r[0] - p[0]);
    for (const [x, y] of arc) { const X = x / fx1 * q.w, Y = q.yb + (y - fy0) / fh * h, d = Math.hypot(X / (q.w || 1), (Y - (q.yb + h * 0.35)) / (h || 1)) || 1; P.push([X, Y + 0.05, zC]); Nn.push([X / (q.w || 1) / d, (Y - (q.yb + h * 0.35)) / (h || 1) / d]); }
    line(P, Nn, { w: 1.3 }); }
  /* the base plate's edge, 2.6 mm in from the widest outline, on the base */
  { const Pb = msInset(KEY_PTS.map(([x, y]) => [x * MS_K.x, y * MS_K.y]), 2.6), P = [], Nn = [];
    for (const [x, y] of Pb) { const z = -y, q = at(z); P.push([-x, q.yb - 0.05, z]); Nn.push([0, -1]); }
    line(P, Nn, { w: 1.3, close: true }); }
  /* the wheel: its cap above the shell (the side view's wheel), at both faces 7 mm apart */
  F.push({ kind: 'hull', pts: MS_SIDE_WHEEL.flatMap(([z, y]) => [[3.5, y, z], [-3.5, y, z]]), n: [0, 1], proud: true });
  /* the side buttons, just proud of the left wall */
  for (const b of MS_SIDE_BTN) { const P = [], Nn = []; for (const [z, y] of b) { const r = wall(z, y, 1, 0.45); if (r) { P.push(r.p); Nn.push(r.n); } } if (P.length > 3) F.push({ kind: 'solid', pts: P, ns: Nn }); }
  /* under it: the lens window, the lens, the skates (dots 0.74 mm proud of the base) */
  { const L = msLive(), ln = L.lens, R = 1.6, P = [];
    const rr = (x0, z0, x1, z1) => { const out = []; for (const [cx, cz, a0] of [[x1 - R, z1 - R, 0], [x0 + R, z1 - R, 90], [x0 + R, z0 + R, 180], [x1 - R, z0 + R, 270]]) for (let k = 0; k <= 6; k++) { const a = (a0 + k * 15) * Math.PI / 180; out.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); } return out; };
    for (const [x, z] of rr(ln[0], ln[2] * MS_K.y, ln[3], ln[5] * MS_K.y)) P.push([x, at(z).yb - 0.05, z]);
    F.push({ kind: 'solid', pts: P, ns: P.map(() => [0, -1]), under: true });
    const zc = (ln[2] + ln[5]) / 2 * MS_K.y, C2 = []; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; C2.push([1.8 * Math.cos(a), at(zc).yb - 0.06, zc + 1.8 * Math.sin(a)]); }
    line(C2, C2.map(() => [0, -1]), { w: 1.3, close: true });
    for (const [X, Z] of L.corner.map(([x, z]) => [x * MS_K.x, z * MS_K.y]).concat(L.lensDots.map(([x, z]) => [x, z * MS_K.y]))) {
      const pts = []; for (let k = 0; k < 20; k++) { const a = k / 20 * TAU; pts.push([X + 3.25 * Math.cos(a), 0, Z + 3.25 * Math.sin(a)], [X + 3.25 * Math.cos(a), 0.74, Z + 3.25 * Math.sin(a)]); }
      F.push({ kind: 'hull', pts, n: [0, -1], proud: true });
    }
  }
  const sup = (dx, dy) => { let mn = Infinity, mx = -Infinity; for (const p of hull) { const d = dx * p[0] + dy * p[1]; if (d < mn) mn = d; if (d > mx) mx = d; } return [mn, mx]; };
  return (FLY.loft = { st, F, sup, YM });
}
/** the loft drawn under the flight's camera at alpha al: o.body draws the body only (its fill), otherwise everything but
    the fill (the hidden protruding parts, the lines and solids by how far they face the camera, the outline) */
function flLoftDraw(cam, al, o = {}) {
  if (al <= 0.003) return;
  const L = flLoft(), YM = L.YM, ph = cam.phi * Math.PI / 180, ps = cam.psi * Math.PI / 180;
  const cp = Math.cos(ph), sp = Math.sin(ph), cq = Math.cos(ps), sq = Math.sin(ps), s = cam.s, [px, py] = cam.P;
  const PJ = (X, Y, Z) => { const a = -X * cp + (Y - YM) * sp, b = -Z; return [px + s * (a * cq - b * sq), py + s * (a * sq + b * cq)]; };
  const vis = n => n[0] * sp + n[1] * cp, va = v => clamp((v - 0.03) / 0.25);
  const ink = TH ? '17,17,17' : '243,242,238', bodyF = TH ? '#FFFFFF' : '#1A1B1E', solidF = TH ? '#E9E8E3' : '#2A2B2F';
  G.save(); G.lineJoin = 'round'; G.lineCap = 'round';
  /* the silhouette: each station's extent across the screen */
  const sil = new Path2D(), side = [];
  for (const q of L.st) { const [mn, mx] = L.sup(-q.w * cp, (q.yt - q.yb) * sp), b = (q.yb - YM) * sp; side.push([b + mn, b + mx, -q.z]); }
  const S2 = (a, b) => [px + s * (a * cq - b * sq), py + s * (a * sq + b * cq)];
  side.forEach((q, i) => { const p = S2(q[1], q[2]); i ? sil.lineTo(p[0], p[1]) : sil.moveTo(p[0], p[1]); });
  for (let i = side.length - 1; i >= 0; i--) { const p = S2(side[i][0], side[i][2]); sil.lineTo(p[0], p[1]); }
  sil.closePath();
  const hullOf = pts => { const Q = pts.map(p => PJ(...p)).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o2, a, b) => (a[0] - o2[0]) * (b[1] - o2[1]) - (a[1] - o2[1]) * (b[0] - o2[0]), lo = [], up = [];
    for (const p of Q) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = Q.length - 1; i >= 0; i--) { const p = Q[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    const h = lo.slice(0, -1).concat(up.slice(0, -1)), pa = new Path2D(); h.forEach((p, i) => (i ? pa.lineTo(p[0], p[1]) : pa.moveTo(p[0], p[1]))); pa.closePath(); return pa; };
  const solid = (path, a) => { if (a <= 0.003) return; G.globalAlpha = al * a; G.fillStyle = solidF; G.fill(path); G.strokeStyle = `rgba(${ink},${TH ? 0.55 : 0.5})`; G.lineWidth = 1.2; G.stroke(path); };
  if (o.body) { G.globalAlpha = al; G.fillStyle = bodyF; G.fill(sil); G.restore(); return; }
  /* parts standing proud of the body that face away: drawn first, so the body hides them except where they stick out */
  const proud = L.F.filter(f => f.kind === 'hull'), behind = f => vis(f.n) < 0;
  for (const f of proud) if (behind(f)) solid(hullOf(f.pts), 1);
  G.globalAlpha = al; G.fillStyle = bodyF; G.fill(sil);
  /* the lines on the body, each segment as far as it faces the camera */
  G.strokeStyle = `rgba(${ink},${TH ? 0.5 : 0.46})`;
  for (const f of L.F) {
    if (f.kind !== 'line') continue;
    G.lineWidth = f.w || 1.3;
    const P = f.pts.map(p => PJ(...p)), n = f.pts.length, m = f.close ? n : n - 1;
    for (let i = 0; i < m; i++) { const j = (i + 1) % n, a = va((vis(f.ns[i]) + vis(f.ns[j])) / 2); if (a <= 0.003) continue; G.globalAlpha = al * a; G.beginPath(); G.moveTo(P[i][0], P[i][1]); G.lineTo(P[j][0], P[j][1]); G.stroke(); }
  }
  /* solids on the body (buttons, the lens window) and the proud parts that face the camera */
  for (const f of L.F) {
    if (f.kind !== 'solid') continue;
    const nm = f.ns.reduce((a, q) => [a[0] + q[0], a[1] + q[1]], [0, 0]), a = va(vis(nm.map(x => x / f.ns.length)));
    if (a <= 0.003) continue;
    const pa = new Path2D(); f.pts.forEach((p, i) => { const q = PJ(...p); i ? pa.lineTo(q[0], q[1]) : pa.moveTo(q[0], q[1]); }); pa.closePath(); solid(pa, a);
  }
  for (const f of proud) if (!behind(f)) solid(hullOf(f.pts), 1);
  /* the outline */
  G.globalAlpha = al; G.strokeStyle = `rgba(${ink},${TH ? 0.78 : 0.7})`; G.lineWidth = 2; G.stroke(sil);
  G.restore();
}

/** the stage under the flight at time u, in theme th: the ground and grid, the footer (A's handing over to B's), and
    the mouse at alpha mA */
function flStage(g, pl, u, th, mA, chromeK) {
  G = g; TH = th;
  const sc = APP.scale * APP.dpr; g.setTransform(sc, 0, 0, sc, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  paper(lerp(pl.gA, pl.gB, prog(u, pl.T.theme[0], pl.T.theme[1])));
  /* the footer: the same rule and name on both; only the chapter and the count change hands */
  if (chromeK <= 0.001 || chromeK >= 0.999) { try { slideChrome(CHROME_T, chromeK < 0.5 ? pl.A : pl.B); } catch (e) { } }
  else {
    const y0 = LAY.ruleY - 12, hh = H - y0, cw = Math.ceil(W * sc), chh = Math.ceil(hh * sc);
    if (CHR.width !== cw || CHR.height !== chh) { CHR.width = cw; CHR.height = chh; }
    const cg = CHR.getContext('2d');
    for (const [s, a] of [[pl.A, 1 - chromeK], [pl.B, chromeK]]) {
      G = cg; cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, cw, chh); cg.setTransform(sc, 0, 0, sc, 0, -y0 * sc);
      try { slideChrome(CHROME_T, s); } catch (e) { }
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.drawImage(CHR, 0, Math.round(y0 * sc)); g.restore();
    }
    G = g;
  }
  g.setTransform(sc, 0, 0, sc, 0, 0);
  flMouse(pl, u, mA);
  g.setTransform(sc, 0, 0, sc, 0, 0); g.globalAlpha = 1;
}
/** compose the flight at k (0 → 1): the stage (blended across the two grounds when they differ), the old slide's content
    receding or its words going, the new slide's content landing or emerging, and the night's fall-off on top */
function flCompose(fx, k) {
  const pl = APP.fl, T = pl.T, u = k * pl.D, w = $('fx').width, h = $('fx').height;
  if (SCR.width !== w || SCR.height !== h) { SCR.width = w; SCR.height = h; }
  /* the mouse: up as a slide recedes, there at once on a card it leaves from, crossing with a card's part it can't see;
     away as a slide emerges, under a card's own mouse to the end, or crossing with a card's part it can't see */
  const mA = (pl.a.soft ? E.io3(prog(u, T.words[0], T.words[1])) : pl.a.card ? 1 : E.out3(prog(u, T.up[0], T.up[1])))
    * (pl.b.soft ? 1 - E.io3(prog(u, T.land + (pl.b.bare ? 0.12 : 0), pl.D)) : pl.b.card ? 1 : 1 - E.io3(prog(u, T.emerge[0] + 0.05, T.emerge[1])));
  const g = pl.thA === pl.thB ? (u < T.theme[0] ? 0 : 1) : E.io3(prog(u, T.theme[0], T.theme[1]));
  const chromeK = pl.thA === pl.thB ? E.io3(prog(u, T.chrome[0], T.chrome[1])) : g;
  if (g <= 0.001) flStage(fx, pl, u, pl.thA, mA, chromeK);
  else if (g >= 0.999) flStage(fx, pl, u, pl.thB, mA, chromeK);
  else {
    flStage(fx, pl, u, pl.thA, mA, 0);
    const sg = SCR.getContext('2d'); flStage(sg, pl, u, pl.thB, mA, 1);
    fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = g; fx.drawImage(SCR, 0, 0); fx.globalAlpha = 1;
  }
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1;
  /* the old slide: a card's words go in place (its mouse is the flight's now); a slide recedes, a hair smaller, into the mouse */
  const lay = (cv, a, sc) => { if (a <= 0.003) return; fx.save(); fx.globalAlpha = a; if (sc !== 1) { fx.translate(w / 2, h / 2); fx.scale(sc, sc); fx.translate(-w / 2, -h / 2); } fx.drawImage(cv, 0, 0); fx.restore(); };
  if (pl.kind === 'handoff') {
    /* the hand-off: the one mouse stays and moves; the old slide's other content goes in place, the new one's comes up
       round it at its first frame, and its clock starts as the mouse lands */
    lay(BAREA, 1 - E.io3(prog(u, T.words[0], T.words[1])), 1);
    if (u >= T.emerge[0]) lay(OFF, E.io3(prog(u, T.emerge[0], T.emerge[1])), 1);
    const sc0 = APP.scale * APP.dpr; fx.setTransform(sc0, 0, 0, sc0, 0, 0);
    vignette(fx, (pl.thA ? 0 : 1 - g) + (pl.thB ? 0 : g));
    fx.setTransform(1, 0, 0, 1, 0, 0);
    return;
  }
  if (pl.a.card) lay(BAREA, 1 - E.io3(prog(u, T.words[0], T.words[1])), 1);
  else { const e = prog(u, T.rec[0], T.rec[1]); lay(BAREA, 1 - E.io3(prog(u, T.rec[0] + 0.02, T.rec[1])), 1 - 0.035 * E.out3(e)); }
  /* the new slide: a card plays over the landed mouse from the landing; a slide emerges, from a hair smaller, at its first frame */
  if (pl.b.card) { if (u >= pl.tB0) lay(OFF, pl.b.soft ? E.io3(prog(u, pl.tB0, pl.tB0 + 0.3)) : 1, 1); }
  else if (u >= T.emerge[0]) { const e = prog(u, T.emerge[0], T.emerge[1]); lay(OFF, E.io3(e), 1 - 0.035 * (1 - E.out3(e))); }
  /* the night's fall-off, over everything, as the grounds blend */
  const sc = APP.scale * APP.dpr; fx.setTransform(sc, 0, 0, sc, 0, 0);
  vignette(fx, (pl.thA ? 0 : 1 - g) + (pl.thB ? 0 : g));
  fx.setTransform(1, 0, 0, 1, 0, 0);
}
/** does the flight need slide B drawn at flight time u (a card from its landing, a slide from its emergence) */
function flNeedsB(pl, u) { return u >= (pl.kind === 'handoff' || !pl.b.card ? pl.T.emerge[0] : pl.tB0); }
/** a flight's first step, while the old slide is still the current one (so its own calls to curSlide() see it): its
    content, drawn once at its time without its ground, recedes over the stage's own */
function flBareA(prev, tA, pa) {
  const w = $('fx').width, h = $('fx').height;
  if (BAREA.width !== w || BAREA.height !== h) { BAREA.width = w; BAREA.height = h; }
  drawSlide(BAREA.getContext('2d'), prev, tA, { bare: true, skip: pa ? [pa.skip] : null });
}
/** its second, once the new slide is current: drawn once (so a card's mouse is seen through the kit's capture), then the
    plan. A card that shows no kit mouse at its first frame (b11's opens on a rival drawn by hand) is drawn once more, at
    its settle, out of sight: where its mouse sits then is where the flight lands, softly */
function flBegin(prev, tA, next, back, kind, pa, pb) {
  drawSlide(OFF.getContext('2d'), next, 0, { bare: true, skip: pb ? [pb.skip] : null });
  /* a hand-off only where both slides really draw their mouse where they say: otherwise the plain move (false) */
  if (kind === 'handoff' && !(pa && pa.skip.hit && pb && pb.skip.hit)) return false;
  let hint = null;
  const has = () => { const r = typeof CARD2 !== 'undefined' && CARD2.rec ? CARD2.rec[next.id] : null; return r && r.caps && r.caps.length ? r : null; };
  if (next.card && !next.flight && typeof CARD2 !== 'undefined' && !has()) {
    const w = $('fx').width, h = $('fx').height, r0 = CARD2.rec[next.id];
    if (SCR.width !== w || SCR.height !== h) { SCR.width = w; SCR.height = h; }
    drawSlide(SCR.getContext('2d'), next, next.settle || 9, { bare: true });
    hint = has(); CARD2.rec[next.id] = r0;
  }
  return flPlan(prev, next, tA, back, hint, kind, pa, pb);
}
/* ---------- autoplay: play to settle, hold for the reading, move on ----------
   The hold scales with the text the settled frame shows: reading text (24 px and up) counts in full, small labels and
   ticks a third (they are scanned, not read), the chrome and anything faint not at all; HOLD.cps characters a second on
   top of HOLD.base, between HOLD.min and HOLD.max. Most of a slide is read while it builds; the hold is the last look.
   Brock (F40.1, 2026-11-06): "Longer, 2–6 s". Calibrated on the settled frames (F0c): the revamp's slides weigh 300 to
   570 characters (median about 400; a chapter card 360 to 460), the old idea sheets up to 950. 250 maps to 2 s and 850 to
   6 s, so a typical slide holds about 3 s, a card about 3, a dense sheet the full 6. */
const HOLD = { base: 1 / 3, cps: 150, small: 0.3, min: 2, max: 6, guess: 3 };
function holdOf(s, list) {
  if (s.hold != null) return +s.hold;
  let read = 0, small = 0; const seen = new Set();
  for (const q of list || []) {
    if (q.a < 0.25 || q.y0 > LAY.ruleY - 8 || q.x1 < 0 || q.x0 > W || q.y1 < 0 || q.y0 > H) continue;
    const str = q.s.trim(); if (!str) continue;
    const key = str + '|' + Math.round(q.x0) + '|' + Math.round(q.y0); if (seen.has(key)) continue; seen.add(key);
    const n = (q.s.length >= 60 ? Math.max(q.s.length, (q.x1 - q.x0) / (0.56 * q.px)) : str.length) + 1;
    if (q.px >= 24) read += n; else small += n;
  }
  return clamp(HOLD.base + (read + HOLD.small * small) / HOLD.cps, HOLD.min, HOLD.max);
}
/** the slide's hold, once its settled frame has been seen (the first frame past settle is measured) */
function holdNow(s) { return APP.holdFor === s.id && APP.hold != null ? APP.hold : (s.hold != null ? +s.hold : null); }
/** a panel open, a note being typed, or edit mode: the slide stays */
function autoBlocked() {
  const ae = document.activeElement;
  return EDIT.on || !$('rate').hidden || !$('src').hidden || !$('edit').hidden || (ae && /^(TEXTAREA|INPUT|SELECT)$/.test(ae.tagName));
}
function autoStep(s, t, now) {
  if (!APP.auto || APP.clip || APP.frozenT != null || !APP.playing || APP.i >= DECK.slides.length - 1) return;
  if (autoBlocked()) { APP.blockT = now; return; }
  const hold = holdNow(s); if (hold == null || t < (s.settle || 9) + hold) return;
  if (now - APP.blockT < 1500) return;                     /* a panel just closed: a beat before the film moves on */
  go(APP.i + 1);
}
function frame() {
  const s = DECK.slides[APP.i], t = slideT(), now = performance.now();
  V3.pending = 0;
  if (APP.frozenT == null && !APP.clip) sfxRun(s, APP.lastT, t); APP.lastT = t;
  /* the first frame past settle is the settled frame on screen: count its text for the hold */
  const qa0 = QA.on, measure = APP.auto && !APP.clip && APP.frozenT == null && APP.holdFor !== s.id && t >= (s.settle || 9);
  if (measure) QA.on = true;
  let k = APP.trStart > 0 ? prog((now - APP.trStart) / 1000, 0, APP.trDur) : 1;
  /* in a flight the new slide is drawn without its ground, and only once the flight shows it */
  if (APP.fl && APP.trStart > 0 && k < 1) { if (flNeedsB(APP.fl, k * APP.fl.D)) drawSlide(OFF.getContext('2d'), s, t, { bare: true, skip: APP.fl.bSkip }); }
  else drawSlide(OFF.getContext('2d'), s, t, APP.vert ? { chrome: false, vignette: false } : {});
  if (measure) { APP.hold = holdOf(s, QA.text); APP.holdFor = s.id; QA.on = qa0; if (!qa0) { QA.text.length = 0; QA.boxes.length = 0; } }
  if (k >= 1) { APP.trStart = -1; APP.fl = null; }
  compose(k);
  if (EDIT.on && k >= 1) editOverlay();
  /* progress inside the chapter segment, counting each slide's hold */
  const segs = [...document.querySelectorAll('.seg')], si = segs.findIndex(b => b.dataset.ch === s.ch);
  segs.forEach((b, kk) => { if (kk < si) b.firstChild.style.width = '100%'; else if (kk > si) b.firstChild.style.width = '0%'; });
  if (segs[si]) {
    const list = DECK.slides.filter(x => x.ch === s.ch), hd = APP.auto ? (holdNow(s) != null ? holdNow(s) : HOLD.guess) : 0;
    segs[si].firstChild.style.width = ((list.indexOf(s) + clamp(t / ((s.settle || 9) + hd))) / list.length * 100) + '%';
  }
  autoStep(s, t, now);
}
function loop() { frame(); if (typeof R3D !== 'undefined' && (APP.gcN = (APP.gcN || 0) + 1) % 120 === 0) R3D.gc(); if (APP.frozenT == null) requestAnimationFrame(loop); }

/* ---------- clips ----------
   ?clip=<slide id>: the slide alone, once, from its first frame to its settled frame, where it stays (a tap plays it
   again). No bar, no progress tick, no page counter, no chapter count; a small THESEUS mark where the footer's name sits,
   so a clip carries the brand when shared. &vertical=1: 9:16 for phone feeds, the stage letterboxed full width with the
   chapter and the title set large above it (the stage's own type is too small there) and the mark below. */
/** the clip's mark: the footer's rule and the name, larger than the footer's, nothing else */
function clipMark(t, s) {
  line(LM, LAY.ruleY, RM, LAY.ruleY, { color: C.hair, w: 1.5 });
  text('Theseus', LM, LAY.footY + 2, { font: 'disp', size: 26, weight: 800, track: 0.3, caps: true, color: C.ink2 });
}
/** the vertical frame: the ground and grid run on above and below the stage; the chapter and title over it, large; the mark under it */
function composeVert(fx) {
  const s = DECK.slides[APP.i], fw = $('fx').width, k = fw / VERT.w, ks = VERT.w / W, top = VERT.top;
  TH = themeOf(s); G = fx;
  fx.setTransform(k, 0, 0, k, 0, 0);
  fx.fillStyle = C.bg; fx.fillRect(0, 0, VERT.w, VERT.h);
  /* the stage's grid, continued: 40 stage px a cell, a + on every fourth crossing, registered to the stage */
  fx.save(); fx.translate(0, top); fx.scale(ks, ks);
  const y0 = -Math.ceil(top / ks / 160) * 160, y1 = Math.ceil((VERT.h - top) / ks / 160) * 160;
  fx.lineWidth = 1; fx.strokeStyle = inkA(TH ? 0.042 : 0.03); fx.beginPath();
  for (let x = 0; x <= W; x += 40) { fx.moveTo(x + 0.5, y0); fx.lineTo(x + 0.5, y1); }
  for (let y = y0; y <= y1; y += 40) { fx.moveTo(0, y + 0.5); fx.lineTo(W, y + 0.5); }
  fx.stroke();
  fx.strokeStyle = inkA(TH ? 0.26 : 0.2); fx.lineWidth = 1.5; fx.beginPath();
  for (let x = 0; x <= W; x += 160) for (let y = y0; y <= y1; y += 160) { fx.moveTo(x - 7, y); fx.lineTo(x + 7, y); fx.moveTo(x, y - 7); fx.lineTo(x, y + 7); }
  fx.stroke(); fx.restore();
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.drawImage(OFF, 0, Math.round(top * k));
  fx.setTransform(k, 0, 0, k, 0, 0);
  /* the header, large: the chapter on a label row, the title under it, bottom-aligned a little above the stage */
  const mx = LM * ks, maxW = VERT.w - 2 * mx, ch = DECK.chapters.find(c => c.key === s.ch);
  const tl = caps(edTxt(s.title || '')), nl = z => wrap(tl, { role: 'h1', size: z }, maxW).length;
  let size = 84; while (size > 64 && nl(size) > 3) size -= 4;
  const lines = nl(size), yb = top - 60, y1t = yb - (lines - 1) * size;
  text(s.title || '', mx - 2, y1t, { role: 'h1', size, color: C.ink, maxW, lh: 1.0 });
  if (ch) { chapterIcon(s.ch, mx, y1t - size - 40 - 27, 30, acc(s.ch), 1); text(ch.name, mx + 46, y1t - size - 40, { role: 'label', size: 30, color: acc(s.ch) }); }
  /* the mark under the stage */
  text('Theseus', mx, top + H * ks + 104, { font: 'disp', size: 36, weight: 800, track: 0.3, caps: true, color: C.ink2 });
  fx.setTransform(1, 0, 0, 1, 0, 0);
}
function clipRestart() { APP.t0 = performance.now(); APP.tPause = 0; APP.playing = true; APP.lastT = 0; }
/** a frozen frame for the capture hook: slide i at time t, or a transition into it (from = [slide index, its time],
    k = how far through, kind = which; the old frame is drawn and composed as the film would have shown it). In a
    transition t may be NaN: then it is the new slide's own clock at k, as the film runs it (trClock, or the flight's plan) */
async function capFrame(t, tr) {
  window.__ready = false;
  if (tr) {
    const i1 = APP.i, A = DECK.slides[tr.from[0]], B = DECK.slides[i1], k = clamp(tr.k);
    APP.i = tr.from[0]; APP.frozenT = tr.from[1]; APP.trStart = -1; APP.fl = null; frame();
    SNAP.getContext('2d').drawImage($('fx'), 0, 0);
    APP.back = tr.from[0] > i1; APP.trans = tr.kind || trKind(A, B, APP.back); APP.irisAt = B.irisAt || null;
    const fly = APP.trans === 'flight' || APP.trans === 'handoff', pa = fly ? flPlace(A, 'out') : null, pb = fly ? flPlace(B, 'in') : null;
    if (fly) flBareA(A, tr.from[1], pa);
    APP.i = i1; APP.fl = fly ? flBegin(A, tr.from[1], B, APP.back, APP.trans, pa, pb) : null;
    if (APP.fl === false) { APP.fl = null; APP.trans = themeOf(A) !== themeOf(B) ? 'wipe' : 'dissolve'; }
    if (!(t >= 0)) t = APP.fl ? Math.max(0, k * APP.fl.D - APP.fl.tB0) : trClock(APP.trans, k, TRN[APP.trans] || 1);
    APP.frozenT = t; APP.trStart = 1; APP.trDur = APP.fl ? APP.fl.D : 1;
    const s = DECK.slides[APP.i]; V3.pending = 0;
    if (APP.fl && k < 1) { if (flNeedsB(APP.fl, k * APP.fl.D)) drawSlide(OFF.getContext('2d'), s, t, { bare: true, skip: APP.fl.bSkip }); }
    else drawSlide(OFF.getContext('2d'), s, t);
    compose(k); APP.trStart = -1; APP.fl = null;
  } else { APP.frozenT = t; frame(); }
  /* a 3D shot streams its geometry in (development pages only): redraw until every scene on this slide has rendered */
  const t0w = performance.now();
  while (V3.pending > 0 && performance.now() - t0w < 120000) { await new Promise(r => setTimeout(r, 250)); frame(); }
  window.__qa = QA.on ? { text: QA.text.slice(), boxes: QA.boxes.slice() } : null; window.__ready = true;
  return true;
}
async function start() {
  const q = new URLSearchParams(location.search);
  APP.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (q.get('cap')) document.body.classList.add('cap', 'clean');
  /* a clip: one slide, once, no bar (?clip=<id>, &vertical=1 for 9:16) */
  if (q.get('clip') != null) {
    const c = q.get('clip'), n = DECK.slides.findIndex(s => s.id === c), ci = n >= 0 ? n : clamp(parseInt(c) || 0, 0, DECK.slides.length - 1);
    if (n < 0 && !/^\d+$/.test(c)) console.error('clip: no slide', c);
    APP.clip = DECK.slides[ci].id; APP.vert = /^(1|true|on|yes)$/i.test(q.get('vertical') || '');
    document.body.classList.add('clean', 'clip');
    /* a clip stands alone: the section label drops its "03 / 12" chapter count (chapterInfo feeds only that label) */
    const ci0 = chapterInfo; chapterInfo = s => Object.assign(ci0(s), { n: 0 });
  }
  if (/^(0|false|off|no)$/i.test(q.get('auto') || '')) APP.auto = false;
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
  let first = 0; const h0 = APP.clip || q.get('s') || location.hash.slice(1), h = /^(2d|3d)$/i.test(h0) ? '' : h0;
  if (h) { const n = DECK.slides.findIndex(s => s.id === h); first = n >= 0 ? n : (parseInt(h) || 0); }
  APP.i = -1; go(first, { instant: true, force: true });
  if (q.get('t') != null) {
    /* the capture hook: ?cap=1&s=<id>&t=<seconds> is that frame, frozen (screenshots, qa, tools/clip.js), and with
       &from=<id>&ft=<seconds>&k=<0..1>[&kind=dissolve|wipe|flight|chapter|push] a moment of the transition into it
       (t=auto: the new slide's clock as the film runs it at k). window.__seek(t[, { from: [id or index, t], k, kind }])
       draws another frame without reloading (t null: auto); __ready says done */
    const tr = (from, ft, k, kind) => {
      const fi = typeof from === 'number' ? from : DECK.slides.findIndex(s => s.id === from);
      if (fi < 0 || fi >= DECK.slides.length) { if (from != null) console.error('capture: no slide', from); return null; }
      return { from: [fi, ft != null && ft !== '' ? +ft : (DECK.slides[fi].settle || 9)], k: k == null || k === '' ? 0.5 : +k, kind: kind || null };
    };
    window.__seek = (t, o) => capFrame(t == null ? NaN : +t, o && o.from ? tr(o.from[0], o.from[1], o.k, o.kind) : null);
    const f0 = q.get('from');
    await capFrame(parseFloat(q.get('t')), f0 != null ? tr(f0, q.get('ft'), q.get('k'), q.get('kind')) : null);
    return;
  }
  $('prev').onclick = e => { e.stopPropagation(); go(APP.i - 1); };
  $('next').onclick = e => { e.stopPropagation(); go(APP.i + 1); };
  $('play').onclick = e => { e.stopPropagation(); togglePlay(); };
  $('fs').onclick = e => { e.stopPropagation(); const el = document.documentElement; const p = document.fullscreenElement ? document.exitFullscreen() : (el.requestFullscreen ? el.requestFullscreen() : null); if (p && p.catch) p.catch(() => { }); };
  $('rateBtn').onclick = e => { e.stopPropagation(); const b = $('rate'); b.hidden = !b.hidden; $('rateBtn').setAttribute('aria-expanded', String(!b.hidden)); if (!b.hidden && EDIT.on) editToggle(false); rateSync(); };
  $('editBtn').onclick = e => { e.stopPropagation(); editToggle(); };
  if (!APP.clip) rateInit();
  $('srcBtn').onclick = e => { e.stopPropagation(); const b = $('src'); b.hidden = !b.hidden; $('srcBtn').setAttribute('aria-expanded', String(!b.hidden)); };
  $('sndBtn').onclick = e => { e.stopPropagation(); auInit(); AU.on = !AU.on; $('sndBtn').textContent = AU.on ? 'sound on' : 'sound off'; $('sndBtn').setAttribute('aria-pressed', String(AU.on)); if (AU.on) sfx('click'); };
  $('cleanBtn').onclick = e => { e.stopPropagation(); document.body.classList.toggle('clean'); fit(); };
  /* a clip plays again on a tap; the film steps (the left third of the stage goes back) */
  $('stage').addEventListener('click', e => { if (APP.clip) { clipRestart(); return; } if (EDIT.on) { editPick(e); return; } const r = $('stage').getBoundingClientRect(); go(APP.i + ((e.clientX - r.left) < r.width * 0.3 ? -1 : 1)); });
  let tx = null; $('stage').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  $('stage').addEventListener('touchend', e => { if (tx == null || APP.clip) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(APP.i + (d < 0 ? 1 : -1)); tx = null; });
  window.addEventListener('keydown', e => {
    if (e.target && /^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName)) return;   /* typing a rating note */
    if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    const k = e.key;
    if (APP.clip) { if (k === ' ' || k === 'r' || k === 'R' || k === 'Enter') { e.preventDefault(); clipRestart(); } else if (k === 'f' || k === 'F') $('fs').click(); return; }
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(APP.i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(APP.i - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(DECK.slides.length - 1);
    else if (k === 'h' || k === 'H') { document.body.classList.toggle('clean'); fit(); }
    else if (k === 'p' || k === 'P') togglePlay();
    else if (k === 'r' || k === 'R') go(APP.i, { force: true, instant: true });
    else if (k === 'f' || k === 'F') $('fs').click();
    else if (k === 's' || k === 'S') $('sndBtn').click();
    else if ((k === 'e' || k === 'E') && !$('editBtn').hidden) editToggle();
    else if (k === 'Escape') { $('src').hidden = true; $('rate').hidden = true; $('rateBtn').setAttribute('aria-expanded', 'false'); if (EDIT.on) editToggle(false); }
  });
  /* the film doesn't run on while nobody watches: a hidden tab pauses it where it is, and it plays on when seen again */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (APP.playing && APP.frozenT == null) { APP.tPause = slideT(); APP.playing = false; APP.hidPaused = true; } }
    else if (APP.hidPaused) { APP.hidPaused = false; APP.t0 = performance.now() - APP.tPause * 1000; APP.playing = true; }
  });
  if (!APP.clip) window.addEventListener('hashchange', () => {
    const hv = location.hash.slice(1), n = DECK.slides.findIndex(s => s.id === hv); if (n >= 0 && n !== APP.i) go(n);
  });
  /* the chapter flight's solid is built once, while nothing else is happening, so the first turn never waits for it */
  if (!APP.clip) { const pre = () => { try { flLoft(); } catch (e) { } }; if (window.requestIdleCallback) requestIdleCallback(pre, { timeout: 4000 }); else setTimeout(pre, 1500); }
  requestAnimationFrame(loop);
}
window.addEventListener('DOMContentLoaded', start);
