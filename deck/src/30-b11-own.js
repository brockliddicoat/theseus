/* ============================================================================================
   B11 · OWNERSHIP: made to last, and to open (revamp v2, 2026-11-06).
   Slides, in film order: b11_card, b11_repair, b11_screws, b11_inserts, b11_wear, b11_battplug, b11_board, b11_box.
   They replace owncard, repair, ownscrew, own_insert, own_life, ownbatt, ownboard, box, ownsheet1 and ownsheet2.
   The old Ownership drawings stay in the build and are called, not copied (10-h2-own.js: the M2 joint, head and insert
   drawn from the 3D model's geometry; 10-h-own.js: the trifold). The motion kit is 06-motion.js.
   Every new top-level name starts with b11_ / B11_.
   ============================================================================================ */
Object.assign(SRC, {
  b11Gpw: { t: 'iFixit, Logitech G Pro Wireless side button switch replacement (guide 211265): Difficult, 40 to 50 minutes. Heat the base and lift the five skates, remove seven 4.4 mm Phillips #00 screws, release the ribbon locking tabs ("Do not pull on the ribbon cable itself"), release the clips and the board\'s adhesive, then "Desolder the switch pins". Tools: soldering iron kit, spudger, tweezers, Phillips #00; a heat gun (optional)', u: 'https://www.ifixit.com/Guide/Logitech+G+Pro+Wireless+Mouse+Side+Button+Switch+Replacement/211265' },
  b11GpxOpen: { t: 'iFixit, How to open your Logitech G Pro X Superlight (guide 170091): "The feet are secured to the bottom of the mouse with strong adhesive": heat them, peel them, replace any that are damaged; six screws; a ZIF ribbon cable between the shells; the battery connector', u: 'https://www.ifixit.com/Guide/How+to+Open+Your+Logitech+G+Pro+X+Superlight/170091' },
  b11GpxBatt: { t: 'iFixit, Logitech G Pro X Superlight battery replacement (guide 170154): "The battery is secured to the top shell with mild adhesive"; heat it and pry it off; the connector is pulled "straight up and out of its socket". Tools: spudger, Phillips driver, tweezers and angled tweezers, iOpener or hair dryer, isopropyl alcohol, double-sided tape', u: 'https://www.ifixit.com/Guide/Logitech+G+Pro+X+Superlight+Battery+Replacement/170154' },
  b11Mo2: { t: 'iFixit, Glorious Model O 2 Wireless battery replacement (guide 200287): remove the feet, two screws, four clips, two ribbon cables and a JST plug; the battery "is glued to the spongy material. This will rip"', u: 'https://www.ifixit.com/Guide/Glorious+Model+O+2+Wireless+Mouse+Battery+Replacement/200287' },
  b11TpuV3: { t: 'TechPowerUp, Razer Viper V3 Pro review, page 4: "Torx T6 screws are found beneath the front and rear skates"; two clips at the sides; a cable between the shells; "four screws are used to affix it [the main PCB] to the bottom shell"; the button boards on FFCs', u: 'https://www.techpowerup.com/review/razer-viper-v3-pro/4.html' },
  b11Fire: { t: 'iFixit battery warnings: "The battery can catch fire and/or explode if accidentally punctured" (Nintendo Switch battery guide); "Be careful not to damage the battery as it can leak toxic chemicals, catch fire, or explode" (G Pro Wireless guide)', u: 'https://www.ifixit.com/Guide/Nintendo+Switch+Battery+Replacement/139947' },
  b11Hakko: { t: 'Hakko knowledge base, tip temperature for lead-free solder: SAC305 melts at about 220 °C; the tip is set about 50 °C above that plus a reserve, about 340 to 370 °C', u: 'https://kb.hakkousa.com/ExportPDF10297.aspx' },
  b113m: { t: '3M, Designing adhesive joints for strength: design joints for "tensile, compression and shear loading, removing cleavage or peel"', u: 'https://www.3m.com/3M/en_US/bonding-and-assembly-us/resources/science-of-adhesion/adhesive-joints-strength/' },
  b11CamOut: { t: 'Stahlwille, The cam-out effect: the tapered flanks of a cross recess turn part of the torque into "an unwanted force along the axis of the screwdriver" that pushes the tool up and out; the recess is often stripped. Monroe Engineering: "When the screwdriver rises out of the recess, it will create friction that wears down the screw head."', u: 'https://stahlwille.com/en_us/news/cam-out-effect/43223940' },
  b11Vickers: { t: 'University of Utah, Materials Characterization Lab, Vickers hardness testing: a square pyramidal diamond pressed in at a set load; HV = 0.1891 F / d² (F in N, d the indent\'s diagonal in mm). At the same force the indent\'s area goes as 1 / HV', u: 'https://mcl.mse.utah.edu/vickers-hardness-testing/' },
  b11Archard: { t: 'Archard 1953, Contact and rubbing of flat surfaces, Journal of Applied Physics 24: 981-988: worn volume = K × load × sliding distance ÷ hardness (the wear law taught in tribology)', u: 'https://doi.org/10.1063/1.1721448' },
  b11Cumbicus: { t: 'Cumbicus, Estrems, Arizmendi & Jiménez 2023, Int. J. Adv. Manuf. Technol. 126: 5163-5178 (open copy: University of Navarra): 5 mm thread-forming screws in 30 % glass-fibre PEI, assembled ten times; the tightening torque lost, measured as the loosening torque at each release (Sec. 4.3, 5): PF-30 11.95 % by the 3rd assembly, 15.31 % by the 5th, 17.16 % by the 10th; DELTA PT 56.73 % by the 5th, 41.93 % by the 10th; the first disassembly negligible', u: 'https://dadun.unav.edu/handle/10171/67216' },
  b11Unitar: { t: 'UNITAR and ITU, Global E-waste Monitor 2024: 62 million tonnes of e-waste in 2022, 22.3 % documented as collected and recycled', u: 'https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling' },
  b11PsX3: { t: 'ProSettings, Logitech G Pro X3 SUPERSTRIKE review (6 Oct 2026): in the box: the mouse, grip tape, a USB receiver, a USB-C to A adapter, documentation, a POWERPLAY puck; "Replacement mouse feet feel like a bare minimum"', u: 'https://prosettings.net/reviews/logitech-g-pro-x3-superstrike/' },
  b11LogiX2Box: { t: 'Logitech, PRO X2 SUPERSTRIKE setup guide, package contents: mouse, optional grip tape, receiver in an extension adapter, USB charging and data cable, surface preparation cloth, optional POWERPLAY aperture door with foot. Logitech\'s X3 pages show an empty "In the box" list; the X3 keeps the X2 Superstrike\'s shape (Notebookcheck), so its cable is counted from this list', u: 'https://www.logitech.com/content/dam/support/g-mice/pro-x-superstrike/user-manual/pro-x2-superstrike-setup-guide-amr.pdf' },
  b11Jnd: { t: 'Datacolor (Techkon), A simple review of CIE ΔE colour difference equations: "The barely noticeable difference (JND) of dE is usually 1"', u: 'https://techkon.datacolor.com/a-simple-review-of-cie-de-color-difference-equations/' },
  b11TtV4: { t: 'TweakTown, Razer Viper V4 Pro review: in the box: the mouse, the dongle, a cable, grip tape, product information (no screwdriver, no spare skates; Profesional Review lists the same)', u: 'https://www.tweaktown.com/reviews/11398/razer-viper-v4-pro-wireless-gaming-mouse-built-for-competition/index.html' },
  b11Brock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse: #52 screws not under the skates ("prevent skate waste"); #54 the board\'s screws inserted from the bottom ("easier to access for disassembly"); #63 art on the board, constantly visible with no bottom plate; #71 the battery plug turned so owners do their own battery replacements; silicone bands, "adhesive usually gets ruined if you ever have to change the battery"; #72 an envelope with a trifold display that doubles as the manual; #73 a screwdriver in the box; #74 a laminated satin paper battery cover; #9 the combination drive; one screw size for everything; "with metal on plastic even the tiniest difference in the angle you screw it will turn the screw into a bore"', u: '', n: 'His own design: no tag.' }
});

/* ---------- numbers (each is sourced in SRC above, or is Brock's own) ---------- */
const B11 = {
  /* a G Pro Wireless switch swap, as iFixit lays it out (b11Gpw): the four tools it lists and the optional heat gun */
  gpw: { tools: ['heat', 'spudger', 'tweezers', 'driver', 'iron'], skates: 5, screws: 7, steps: 15, mins: '40 to 50' },
  ironC: 350,                         /* lead-free tip temperature, about (Hakko, 340 to 370 °C) */
  hv: { steel: 220, ti: 349 },        /* class 4.8 at most (ISO 898-1, ownIso898p); grade 5 (ASM, ownTi) */
  /* Cumbicus 2023: the torque to undo the joint at each release, as a share of the torque that tightened it, by assembly */
  pf30: [[1, 100], [3, 88.05], [5, 84.69], [10, 82.84]],
  dpt: [[1, 100], [5, 43.27], [10, 58.07]],
  brass20: 98.63,                     /* 3D People 2022: pull strength after 20 loads at 80 % of the failure force */
  pemN: 255                           /* PEM IUTF-M2 pull-out in ABS (ownPemM2) */
};

/* ============================== shared drawing helpers ============================== */
/** the deck's greys for drawn tools and props: a body, a darker part, an outline (mono, never a new colour, F34.6) */
function b11_tone() {
  return TH ? { body: '#E3E3E3', dark: '#3A3B40', mid: '#B8B8B8', steel: ['#F4F5F7', '#A9AFB7', '#DDE0E4'], edge: 'rgba(17,17,17,0.72)', hi: 'rgba(255,255,255,0.7)' }
    : { body: '#2E2F34', dark: '#151619', mid: '#545454', steel: ['#D9DCE0', '#7E858D', '#B9BEC4'], edge: 'rgba(235,235,235,0.55)', hi: 'rgba(255,255,255,0.18)' };
}
/** the heat colour of a hot tool or a heated part, 0..1 (functional colour: the deck's heat ramp, red at the top) */
function b11_hot(k) { return heatCol(0.45 + 0.55 * clamp(k)); }
/** a soft glow of heat at (x, y) in the current units, radius r, strength k (0..1) */
function b11_heatGlow(x, y, r, k) {
  if (k <= 0.01) return;
  const g = G.createRadialGradient(x, y, 0, x, y, r), c = b11_hot(k);
  g.addColorStop(0, rgba(c, 0.85 * k)); g.addColorStop(0.45, rgba(c, 0.35 * k)); g.addColorStop(1, rgba(c, 0));
  G.save(); G.globalAlpha = PA; G.fillStyle = g; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill(); G.restore();
}

/* ---------- the tools a repair takes, drawn side-on, tip to the right, in tool units (about mm). Each returns
   { tip: [x, y] stage px, len } so a slide can lead a line to it. o = { hot (0..1), t (for the hot air) } ---------- */
const B11_TOOL = {
  heat: { name: 'Heat gun', len: 54 }, spudger: { name: 'Spudger', len: 56 }, tweezers: { name: 'Tweezers', len: 52 },
  driver: { name: 'Phillips #00', len: 54 }, iron: { name: 'Soldering iron', len: 58 }, box: { name: 'The driver in the box', len: 54 }
};
function b11_toolMM(kind, o = {}) {
  const T = b11_tone(), ec = T.edge, w0 = lw(1.3), steel = (x0, x1) => { const g = G.createLinearGradient(0, -2, 0, 2); T.steel.forEach((c, i) => g.addColorStop(i / (T.steel.length - 1), c)); return g; };
  const outline = () => { G.strokeStyle = ec; G.lineWidth = w0; G.lineJoin = 'round'; G.stroke(); };
  const out = {};
  if (kind === 'heat') {
    /* a heat gun: barrel, a tapered nozzle, a pistol grip with its trigger */
    G.beginPath(); G.moveTo(2, -8.5); G.lineTo(36, -8.5); G.quadraticCurveTo(40, -8.5, 40, -5); G.lineTo(40, 5); G.quadraticCurveTo(40, 8.5, 36, 8.5);
    G.lineTo(22, 8.5); G.lineTo(19.5, 30); G.quadraticCurveTo(19, 33, 15.5, 33); G.lineTo(9.5, 33); G.quadraticCurveTo(6.5, 33, 7, 30); G.lineTo(9.5, 8.5);
    G.lineTo(2, 8.5); G.quadraticCurveTo(0, 8.5, 0, 6); G.lineTo(0, -6); G.quadraticCurveTo(0, -8.5, 2, -8.5); G.closePath();
    G.fillStyle = T.body; G.fill(); outline();
    G.beginPath(); G.moveTo(40, -5.5); G.lineTo(52, -4.2); G.lineTo(52, 4.2); G.lineTo(40, 5.5); G.closePath(); G.fillStyle = steel(); G.fill(); outline();
    G.beginPath(); G.rect(23, 10, 3, 7); G.fillStyle = T.dark; G.fill();
    for (const x of [4, 7, 10]) mmLine([[x, -5.5], [x, 5.5]], ec, 1.1);
    if (o.hot > 0.01) {
      b11_heatGlow(53, 0, 9 + 5 * o.hot, o.hot);
      /* hot air leaving the nozzle: arcs carried away from it (they move because the air does) */
      for (let i = 0; i < 4; i++) { const u = (((o.t || 0) * 1.6 + i / 4) % 1), x = 54 + u * 26, a = o.hot * (1 - u) * 0.9; if (a < 0.02) continue; G.save(); G.globalAlpha = PA * a; G.beginPath(); G.arc(x - 6, 0, 6 + u * 4, -0.7, 0.7); G.strokeStyle = b11_hot(o.hot); G.lineWidth = lw(2); G.stroke(); G.restore(); }
    }
    out.tip = SP(52, 0);
  } else if (kind === 'spudger') {
    G.beginPath(); G.moveTo(0, -2.2); G.lineTo(46, -2.2); G.lineTo(56, -0.3); G.lineTo(56, 0.3); G.lineTo(46, 2.2); G.lineTo(0, 2.2); G.quadraticCurveTo(-2, 0, 0, -2.2); G.closePath();
    G.fillStyle = T.dark; G.fill(); outline(); mmLine([[3, -1.1], [44, -1.1]], T.hi, 0.9); out.tip = SP(56, 0);
  } else if (kind === 'tweezers') {
    for (const s of [-1, 1]) { G.beginPath(); G.moveTo(0, s * 0.6); G.quadraticCurveTo(14, s * 3.4, 30, s * 3.1); G.lineTo(52, s * 0.35); G.lineTo(52, s * 0.05); G.lineTo(30, s * 1.9); G.quadraticCurveTo(14, s * 2.1, 0, s * 0.05); G.closePath(); G.fillStyle = steel(); G.fill(); outline(); }
    G.beginPath(); G.arc(0, 0, 1.1, Math.PI / 2, Math.PI * 1.5); G.fillStyle = T.mid; G.fill(); out.tip = SP(52, 0);
  } else if (kind === 'driver' || kind === 'box') {
    /* a precision screwdriver: a swivel cap, a knurled handle, the ferrule, a shaft, the cross tip */
    G.beginPath(); pathRR(0, -4.6, 4, 9.2, 1.6); G.fillStyle = T.mid; G.fill(); outline();
    G.beginPath(); pathRR(3.5, -4.4, 24, 8.8, 2.2); G.fillStyle = kind === 'box' ? (TH ? '#2B2C31' : '#D8D8D8') : T.body; G.fill(); outline();
    G.save(); G.beginPath(); pathRR(3.5, -4.4, 24, 8.8, 2.2); G.clip(); for (let x = 6; x < 27; x += 1.6) mmLine([[x, -4.4], [x, 4.4]], kind === 'box' ? (TH ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)') : ec, 0.7); G.restore();
    G.beginPath(); G.rect(27.5, -2.4, 3, 4.8); G.fillStyle = steel(); G.fill(); outline();
    G.beginPath(); G.moveTo(30.5, -1.1); G.lineTo(49, -1.1); G.lineTo(54, 0); G.lineTo(49, 1.1); G.lineTo(30.5, 1.1); G.closePath(); G.fillStyle = steel(); G.fill(); outline();
    mmLine([[49.6, 0], [53.6, 0]], ec, 0.8); out.tip = SP(54, 0);
  } else if (kind === 'iron') {
    /* a soldering iron: a ribbed grip, the guard, a stainless shaft and the tip, glowing when hot */
    G.beginPath(); pathRR(0, -5, 27, 10, 3); G.fillStyle = T.body; G.fill(); outline();
    for (let x = 6; x < 24; x += 3) mmLine([[x, -5], [x, 5]], ec, 0.8);
    G.beginPath(); G.moveTo(27, -6.2); G.lineTo(31, -6.2); G.lineTo(31, 6.2); G.lineTo(27, 6.2); G.closePath(); G.fillStyle = T.dark; G.fill(); outline();
    G.beginPath(); G.rect(31, -1.7, 18, 3.4); G.fillStyle = steel(); G.fill(); outline();
    G.beginPath(); G.moveTo(49, -1.7); G.lineTo(58, -0.35); G.lineTo(58, 0.35); G.lineTo(49, 1.7); G.closePath(); G.fillStyle = o.hot > 0.05 ? b11_hot(o.hot) : T.mid; G.fill(); outline();
    if (o.hot > 0.01) b11_heatGlow(56, 0, 6 + 4 * o.hot, o.hot);
    out.tip = SP(58, 0);
  }
  out.len = (B11_TOOL[kind] || {}).len || 50;
  return out;
}

/* ---------- the classroom version of hardness: Vickers' test. The same diamond pyramid, pressed with the same force into
   two metals; the softer takes the bigger dent (at one force the dent's area goes as 1 / HV, so its width as 1 / √HV).
   Drawn in section across two faces (the pyramid's faces meet at 136°, so each slopes 22° from flat).
   (x, y, w, h) = the panel's content box; k = the press, 0..1, then the indenter lifts as k goes 1 → 2; the dent stays ---------- */
function b11_vickers(t, t0, x, y, w, h, o = {}) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return {};
  const T = b11_tone(), k = kf(t, [[t0 + 0.5, 0], [t0 + 1.7, 1, E.io3], [t0 + 2.3, 1], [t0 + 2.9, 2, E.io3]]);
  const press = Math.min(1, k), lift = Math.max(0, k - 1);
  const cols = [{ hv: B11.hv.steel, name: 'Class 4.8 steel', sub: B11.hv.steel + ' HV', bad: true }, { hv: B11.hv.ti, name: 'Grade 5 titanium', sub: B11.hv.ti + ' HV', hero: true }];
  const cw = w / 2, blockY = y + h * 0.56, a0 = 68 * Math.sqrt(1 / B11.hv.steel) / Math.sqrt(1 / B11.hv.steel), slope = Math.tan(22 * Math.PI / 180), out = {};
  cols.forEach((c, i) => {
    const cx = x + cw * (i + 0.5), half = (a0 / 2) * Math.sqrt(B11.hv.steel / c.hv), depth = half * slope;
    /* the block, cut: hatched metal, the dent pressed into its top face */
    const bx0 = cx - cw * 0.38, bx1 = cx + cw * 0.38, by1 = y + h - 46, dpth = depth * press, hw = half * press;
    const top = () => { G.beginPath(); G.moveTo(bx0, by1); G.lineTo(bx0, blockY); G.lineTo(cx - hw, blockY); G.lineTo(cx, blockY + dpth); G.lineTo(cx + hw, blockY); G.lineTo(bx1, blockY); G.lineTo(bx1, by1); G.closePath(); };
    G.save(); G.globalAlpha = a; top(); const gm = G.createLinearGradient(0, blockY, 0, by1); T.steel.forEach((s2, j) => gm.addColorStop(j / (T.steel.length - 1), s2)); G.fillStyle = gm; G.fill();
    G.clip(); G.strokeStyle = TH ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.3)'; G.lineWidth = 1; G.beginPath(); for (let u = bx0 - (by1 - blockY); u < bx1; u += 9) { G.moveTo(u, by1); G.lineTo(u + (by1 - blockY), blockY); } G.stroke(); G.restore();
    G.save(); G.globalAlpha = a; top(); G.strokeStyle = T.edge; G.lineWidth = 1.5; G.stroke(); G.restore();
    /* the dent's edge, coloured by what it says: the steel's in red (the bigger dent), the titanium's in Theseus blue */
    if (press > 0.6) { const kd = clamp((press - 0.6) / 0.4); poly([[cx - hw, blockY], [cx, blockY + dpth], [cx + hw, blockY]], { color: c.hero ? C.hero : C.bad, w: 3, alpha: a * kd }); }
    /* the indenter: the 136° diamond on its holder, coming down with the same force on both */
    const iy = blockY + dpth - lift * 70 - (1 - Math.min(1, k * 4)) * 0;
    const tipY = press < 1 ? blockY + dpth : iy;
    const dh = 34, dw = dh / slope;
    G.save(); G.globalAlpha = a * (1 - clamp(lift * 1.4)); G.beginPath(); G.moveTo(cx, tipY); G.lineTo(cx - Math.min(dw, 70), tipY - Math.min(dw, 70) * slope); G.lineTo(cx - 16, tipY - 62); G.lineTo(cx + 16, tipY - 62); G.lineTo(cx + Math.min(dw, 70), tipY - Math.min(dw, 70) * slope); G.closePath();
    const gd = G.createLinearGradient(cx - 40, 0, cx + 40, 0); gd.addColorStop(0, TH ? '#FFFFFF' : '#C9CDD2'); gd.addColorStop(0.5, TH ? '#E3E7EC' : '#8E959D'); gd.addColorStop(1, TH ? '#C9D0D8' : '#5E646B'); G.fillStyle = gd; G.fill(); G.strokeStyle = T.edge; G.lineWidth = 1.5; G.stroke();
    G.fillStyle = TH ? T.dark : T.mid; G.fillRect(cx - 16, tipY - 104, 32, 42); G.restore();
    /* the same force on both */
    const fk = a * clamp(press * 3) * (1 - clamp(lift * 3));
    if (fk > 0.01) arrow(cx, tipY - 170, cx, tipY - 112, { color: C.ink2, w: 3, hs: 14, alpha: fk });
    if (i === 0 && fk > 0.01) text('Same force', cx + 22, tipY - 140, { role: 'label', size: 20, color: C.ink2, alpha: fk });
    text(c.name, cx, by1 + 30, { role: 'label', size: 20, color: c.hero ? C.heroText : C.ink, align: 'center', alpha: a });
    text(c.sub, cx, by1 + 54, { role: 'small', size: 22, weight: 700, color: C.mute, align: 'center', alpha: a });
    out[i ? 'ti' : 'steel'] = { cx, w: 2 * half, y: blockY };
  });
  /* the result, once the diamonds lift: the steel's dent 1.26× as wide, 1.59× the area */
  const kr = ep(t, t0 + 2.6, t0 + 3.1);
  if (kr > 0.01) {
    const s = out.steel, r = Math.sqrt(B11.hv.ti / B11.hv.steel);
    dim(t, t0 + 2.6, [s.cx - s.w / 2, s.y], [s.cx + s.w / 2, s.y], fmtN(r, 2) + '× as wide', -34, { tcolor: C.bad });
  }
  return out;
}

/* ---------- the screw head under a slipping bit (#9, F25.5): the old Ownership head (own_headTopMM / own_headSecMM, from the
   3D model's panhead.js) with what a slip does to it. A Phillips recess's walls slope, so torque also pushes the bit up and
   out (cam-out, Stahlwille); as it climbs out its edges scrape the top of the cross arms' driven faces. The metal scraped
   off goes as 1 / hardness (Archard), so a dent is drawn sized by dmg = slips × (220 / HV) / 2: two slips round a class 4.8
   steel cross (dmg 1), the same two leave a grade 5 titanium cross at 0.63. An illustration, sized by the ratio. ---------- */
/** the wear on the driven face of each arm, in the head's mm frame (top view, origin at the centre). dmg 0..1+ */
function b11_recessWear(dmg, col) {
  if (dmg <= 0.005) return;
  const D = OWN_HD, M = OWN_M2, m2 = D.m2, w2 = M.wing / 2, n2 = M.n / 2;
  ga(clamp(dmg * 2.5) * 0.92); G.fillStyle = col || C.bad;
  for (let k = 0; k < 4; k++) {
    xsave(); xturn(k * Math.PI / 2);
    /* the driven face of this arm: the slot's wall for the arms along x, the cross arm's wall for the arms along z */
    const f = k % 2 ? w2 : n2, depth = 0.24 * Math.min(dmg, 1.4), r0 = m2 * (0.62 - 0.3 * Math.min(dmg, 1));
    G.beginPath(); G.moveTo(r0, f); G.lineTo(m2 + 0.02, f); G.lineTo(m2 + 0.02 + depth * 0.4, f + depth); G.quadraticCurveTo((r0 + m2) / 2, f + depth * 0.9, r0, f); G.closePath(); G.fill();
    /* past half the wear the arm's outer corner rounds too */
    if (dmg > 0.5) { const rc = 0.2 * (Math.min(dmg, 1.4) - 0.5); G.beginPath(); G.arc(m2, f, rc, 0, TAU); G.fill(); }
    xrest();
  }
  ga(1);
}
/** the head from above with its wear and the bit's footprint turned by rot (rad). o = { dmg, rot, bitA, col } */
function b11_headTopMM(o = {}) {
  const r = own_headTopMM({});
  b11_recessWear(o.dmg || 0, o.col);
  if (o.bitA > 0.003) {
    /* the Phillips #0 bit's wings, seen from above through the head: a dashed cross, turned by the twist */
    xsave(); xturn(o.rot || 0); ga(o.bitA); G.setLineDash([lw(6), lw(5)]); G.strokeStyle = TH ? 'rgba(16,17,20,0.8)' : 'rgba(235,235,235,0.85)'; G.lineWidth = lw(1.8);
    const q = 0.17, L = 0.9; G.beginPath(); G.moveTo(-L, -q); G.lineTo(-q, -q); G.lineTo(-q, -L); G.lineTo(q, -L); G.lineTo(q, -q); G.lineTo(L, -q); G.lineTo(L, q); G.lineTo(q, q); G.lineTo(q, L); G.lineTo(-q, L); G.lineTo(-q, q); G.lineTo(-L, q); G.closePath(); G.stroke(); G.setLineDash([]); ga(1); xrest();
  }
  return r;
}
/** the head in section B-B with the bit riding up its ramp: lift (mm), turn (the flutes), a (alpha), dmg (burrs at the
   top of the arm, in the problem colour). Returns own_headSecMM's points plus the bit's tip */
function b11_headSecMM(o = {}) {
  const r = own_headSecMM({ cut: 'B', shank: o.shank || 1.3, bg: o.bg || C.panel, bit: { kind: 'ph', lift: o.lift || 0, dx: 0, turn: o.turn || 0, a: o.a == null ? 1 : o.a } });
  const dmg = o.dmg || 0;
  if (dmg > 0.01) {
    const D = OWN_HD, m2 = D.m2, y = -D.H0(m2), rr0 = 0.06 + 0.16 * Math.min(dmg, 1.3);
    ga(clamp(dmg * 2.5) * 0.92); G.fillStyle = o.col || C.bad;
    for (const s of [-1, 1]) { G.beginPath(); G.arc(s * m2, y + 0.02, rr0, 0, TAU); G.fill(); }
    ga(1);
  }
  return r;
}

/* ---------- a dial gauge, as on a dial torque wrench: the share of the first tightening torque a joint still takes.
   (x, y) = the centre; r = radius; v = 0..100; o = { col (the needle's arc), lost (draw what is lost in red), label, a } ---------- */
function b11_dial(x, y, r, v, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const A0 = Math.PI * 0.85, A1 = Math.PI * 2.15, ang = u => A0 + (A1 - A0) * clamp(u / 100);
  G.save(); G.globalAlpha = a; G.lineCap = 'round';
  G.beginPath(); G.arc(x, y, r, A0, A1); G.strokeStyle = C.track; G.lineWidth = 12; G.stroke();
  if (o.lost && v < 99.5) { G.beginPath(); G.arc(x, y, r, ang(v), A1); G.strokeStyle = rgba(C.bad, 0.85); G.lineWidth = 12; G.stroke(); }
  G.beginPath(); G.arc(x, y, r, A0, ang(v)); G.strokeStyle = o.col || C.comp; G.lineWidth = 12; G.stroke();
  for (const u of [0, 25, 50, 75, 100]) { const q = ang(u); line(x + Math.cos(q) * (r - 22), y + Math.sin(q) * (r - 22), x + Math.cos(q) * (r - 12), y + Math.sin(q) * (r - 12), { color: C.mute, w: 2, alpha: a }); }
  const q = ang(v); G.restore();
  line(x, y, x + Math.cos(q) * (r - 26), y + Math.sin(q) * (r - 26), { color: C.ink, w: 3.5, alpha: a, cap: 'round' });
  circle(x, y, 7, { fill: C.ink, alpha: a });
  if (o.label) text(o.label, x, y + r * 0.62 + 34, { role: 'label', size: 20, color: o.lcol || C.mute, align: 'center', alpha: a, maxW: r * 2.6 });
}

/* ---------- the plastic thread's flank, magnified, after n re-assemblies (b11_wear). A thread-forming screw (the old file's
   'tf' profile: 0.9 mm pitch) cut the first thread; each re-assembly comes back a little off the old phase and shaves a
   sliver off the flank it meets (Covestro: a re-assembled screw holds only if it finds its original thread, by hand).
   n = completed re-assemblies, k = how far the next one has gone (0..1); x along the axis, the plastic below its
   surface (y down). Returns stage points ---------- */
const B11_PH = [0.17, -0.12, 0.23, -0.2, 0.09, 0.27, -0.25, 0.14, -0.07, 0.21, -0.16];   /* each re-assembly's phase, in pitches */
function b11_flankN(n, k, o = {}) {
  const T = OWN_TH.tf, P = T.P, span = o.span || 1.25, x0 = -P * span, x1 = P * span, depth = T.rc - OWN_RP, bot = o.bot || 0.55, st = P / 240;
  const cut = (x, ph) => own_tooth((x - ph) / P, T.cw, T.rw) * depth;
  const phs = o.phs == null ? 1 : o.phs, passes = []; for (let i = 0; i < Math.min(n, B11_PH.length); i++) passes.push([B11_PH[i] * P * phs, 1]);
  if (k > 0 && n < B11_PH.length) passes.push([B11_PH[n] * P * phs, k]);
  const wall = x => { let m = cut(x, 0); for (const [ph, kk] of passes) m = Math.max(m, cut(x, ph) * kk); return m; };
  const mat = o.mat || OWN_MAT.cf;
  const surf = f => { G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += st) { const y = f(x); x === x0 ? G.moveTo(x, y) : G.lineTo(x, y); } };
  const body = () => { surf(wall); G.lineTo(x1, bot); G.lineTo(x0, bot); G.closePath(); };
  body(); G.fillStyle = grad(mat, x0, 0, x0, bot); G.fill();
  G.save(); body(); G.clip(); hatchBox([x0, -0.1, x1 - x0, bot + 0.2], Object.assign({ sp: 14 }, mat.hatch || {}), mat); G.restore();
  if (passes.length) {
    /* what the re-assemblies shaved off, in the problem colour; the first thread's surface dashed */
    surf(x => cut(x, 0)); for (let x = x1; x >= x0 - 1e-6; x -= st) G.lineTo(x, wall(x)); G.closePath();
    G.fillStyle = C.bad; ga(0.9); G.fill(); ga(1);
    G.setLineDash([lw(6), lw(5)]); surf(x => cut(x, 0)); G.strokeStyle = TH ? 'rgba(16,17,20,0.6)' : 'rgba(235,235,235,0.6)'; G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]);
  }
  surf(wall); G.strokeStyle = edgeCol(mat); G.lineWidth = lw(1.6); G.stroke();
  /* the screw's tooth, coming in on this re-assembly's phase (it sits in what it cut) */
  if (k > 0 && k < 1 && n < B11_PH.length) {
    const ph = B11_PH[n] * P * phs, dz = (1 - k) * -1.6 * P;
    G.save(); G.beginPath(); G.rect(x0, -1, x1 - x0, bot + 2); G.clip();
    G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += st) { const y = cut(x - dz, ph) * Math.min(1, k * 1.2); x === x0 ? G.moveTo(x, y) : G.lineTo(x, y); } G.lineTo(x1, -0.6); G.lineTo(x0, -0.6); G.closePath();
    G.fillStyle = own_finish('zinc', x0, x1); ga(0.85); G.fill(); ga(1); G.strokeStyle = OWN_EDGE; G.lineWidth = lw(1.1); G.stroke(); G.restore();
  }
  let lost = 0; for (let x = x0; x <= x1; x += st) lost += wall(x) - cut(x, 0);
  return { left: SP(x0, 0), right: SP(x1, 0), bottom: SP(0, bot), lost: lost * st };
}

/* ---------- the classroom version of peel and shear (3M): a strip of tape on a table. Pulled along the table it holds (the
   whole bond shares the load: shear); lifted at one end it comes away (the load sits on the line where it is lifting:
   peel). (x, y, w, h) = the panel's content box ---------- */
function b11_tape(t, t0, x, y, w, h, o = {}) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  const T = b11_tone(), ty = y + h * 0.6, xa = x + w * 0.1, xb = x + w * 0.74, L = xb - xa;
  const sh = ep(t, t0 + 0.5, t0 + 1.5, E.io3) * (1 - ep(t, t0 + 2.0, t0 + 2.3)), pe = ep(t, t0 + 2.4, t0 + 4.0, E.io3);
  /* the table */
  rect(x + 10, ty, w - 20, 3, { fill: T.edge, alpha: a * 0.55 });
  G.save(); G.globalAlpha = a * 0.08; G.fillStyle = C.ink; G.fillRect(x + 10, ty + 3, w - 20, h * 0.18); G.restore();
  /* the tape: stuck from the peel front to its end; the lifted part curls up to the hand */
  const front = xa + L * 0.62 * pe, tab = xb + 18 + 10 * sh;
  const tapeC = TH ? 'rgba(120,124,132,0.55)' : 'rgba(200,204,210,0.45)', edge = T.edge;
  G.save(); G.globalAlpha = a; G.fillStyle = tapeC; G.fillRect(front, ty - 6, xb - front, 6); G.strokeStyle = edge; G.lineWidth = 1.2; G.strokeRect(front, ty - 6, xb - front, 6);
  /* the free tab on the right, pulled along (shear) */
  G.fillRect(xb, ty - 6, tab - xb, 6); G.strokeRect(xb, ty - 6, tab - xb, 6);
  if (pe > 0.01) {
    /* the peeled part: from the front, up and back toward the hand */
    const hx = xa + L * 0.62 * pe - 40 - 60 * pe, hy = ty - 40 - 110 * pe;
    G.beginPath(); G.moveTo(front, ty - 3); G.quadraticCurveTo(front - 8, ty - 30 * pe, hx, hy); G.strokeStyle = tapeC; G.lineWidth = 6; G.stroke(); G.strokeStyle = edge; G.lineWidth = 1.2; G.stroke();
    arrow(hx + 4, hy + 30, hx - 4, hy - 12, { color: C.bad, w: 3, hs: 12, alpha: a * clamp(pe * 3) });
    circle(front, ty - 3, 7, { color: C.bad, w: 2.5, alpha: a * clamp(pe * 3) * (1 - clamp((pe - 0.95) * 20)) });
  }
  G.restore();
  if (sh > 0.01) arrow(tab + 6, ty - 3, tab + 26 + 50 * sh, ty - 3, { color: C.heroText, w: 3, hs: 12, alpha: a * sh });
  const k1 = ep(t, t0 + 1.2, t0 + 1.6) * (1 - ep(t, t0 + 2.0, t0 + 2.3) * 0.55), k2 = ep(t, t0 + 3.2, t0 + 3.6);
  const ly = ty + h * 0.18 + 30;
  text('Pulled along: it holds', x + w - 10, ly, { align: 'right', role: 'label', size: 20, color: C.heroText, alpha: a * k1 });
  text('Lifted: it peels', x + 10, ly, { role: 'label', size: 20, color: C.bad, alpha: a * k2 });
}

/* ---------- the battery plug in section at the board's edge (#71, F26.4), mm, the board's top face at y = 0, the tail (the
   battery) to the left. kind 'side': Theseus's side-entry JST SH header (4.25 × 3.0, the 3D part's size) turned to face the
   tail: a pull on the lead runs along the board and the plug slides out (shear on the pads). kind 'top': a top-entry header:
   the same pull on the lead levers plug and header about the far pad, and the near pad peels off the board.
   pull 0..1; o = { hole (the ground colour) }. Returns stage points ---------- */
function b11_plugMM(kind, pull, o = {}) {
  const T = b11_tone(), nyl = TH ? '#FFFFFF' : '#D8D8D8', ne = 'rgba(16,17,20,0.6)', out = {};
  pcbSec(-16, 9, 0, kind === 'side' ? null : 1.0, kind === 'side' ? { brk: [1, 1] } : { brk: [1, 1], rival: true });   /* Theseus's board BOARD_T (0.6 mm, F47.4); a rival's its own */
  /* the pads' finish: Theseus's gold (ENIG), a rival's grey (M's board-colour rule, as pcbSec's rings) */
  const pad = (x0, x1, lift, bad) => { G.fillStyle = kind === 'side' ? '#d9b25a' : '#c9ccd1'; G.fillRect(x0, -0.05, x1 - x0, 0.05); solid(() => { G.beginPath(); G.moveTo(x0 - 0.15, 0); G.quadraticCurveTo(x0, -0.25 - lift, x0 + 0.25, -0.3 - lift); G.lineTo(x1 - 0.25, -0.3 - lift); G.quadraticCurveTo(x1, -0.25 - lift, x1 + 0.15, 0); G.closePath(); }, MT.tin, [x0, -0.4 - lift, x1 - x0, 0.4 + lift], { lw: 0.8 }); if (bad > 0.01) { ga(bad); G.fillStyle = C.bad; G.fillRect(x0 - 0.1, -0.12, x1 - x0 + 0.2, 0.16); ga(1); } };
  const wires = (x0, y0, dx, dy, len) => { OWN_WIRE.forEach((c, i) => { const oy = (i - 1) * 0.42; G.beginPath(); G.moveTo(x0, y0 + oy); G.bezierCurveTo(x0 + dx * len * 0.4, y0 + oy, x0 + dx * len * 0.7, y0 + oy + dy * len * 0.3, x0 + dx * len, y0 + oy + dy * len); G.strokeStyle = c; G.lineWidth = lw(5); G.lineCap = 'round'; G.stroke(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = lw(1); G.stroke(); }); };
  if (kind === 'side') {
    /* the header: shell with the plug opening toward the tail, a back wall, three contacts, legs soldered at the back */
    pad(0.15, 1.05, 0, 0);
    solid(() => { G.beginPath(); G.moveTo(-4.25, -3.0); G.lineTo(0, -3.0); G.lineTo(0, 0); G.lineTo(-4.25, 0); G.closePath(); }, { g: [nyl, nyl] }, [-4.25, -3, 4.25, 3], { ec: ne, lw: 1.1 });
    G.fillStyle = TH ? '#E8E8E8' : '#B8B8B8'; G.fillRect(-4.25, -2.7, 3.55, 2.4);
    G.strokeStyle = '#C9A15C'; G.lineWidth = lw(2.2); G.beginPath(); G.moveTo(-3.6, -1.5); G.lineTo(-0.4, -1.5); G.stroke();
    G.strokeStyle = '#A9AFB7'; G.lineWidth = lw(2); G.beginPath(); G.moveTo(-0.2, -1.5); G.lineTo(0.35, -1.5); G.lineTo(0.5, -0.3); G.lineTo(0.9, -0.25); G.stroke();
    /* the plug, sliding out along the board as the lead is pulled */
    const px = -pull * 6.2;
    xsave(); xmove(px, 0);
    solid(() => { G.beginPath(); G.moveTo(-4.95, -2.65); G.lineTo(-0.7, -2.65); G.lineTo(-0.7, -0.35); G.lineTo(-4.95, -0.35); G.closePath(); }, { g: [nyl, TH ? '#EBEBEB' : '#C5C5C5'] }, [-4.95, -2.65, 4.25, 2.3], { ec: ne, lw: 1.1 });
    G.fillStyle = '#C9A15C'; G.fillRect(-3.4, -1.75, 2.6, 0.5);
    wires(-4.95, -1.5, -1, 0, 9);
    out.grab = SP(-9, -1.5);
    xrest();
    out.pad = SP(0.6, 0); out.header = SP(-2.1, -3.0); out.plug = SP(-2.8 + px, -2.65); out.face = SP(-4.25, -1.5);
  } else {
    /* a top-entry header: the plug goes in from above; pulled back by its lead it levers about the far pad */
    const th = pull * 0.13, piv = [2.6, 0];
    pad(-2.95, -2.05, Math.sin(th) * 5.2, clamp(pull * 2 - 0.4)); pad(2.05, 2.95, 0, 0);
    xsave(); xabout(piv[0], piv[1], -th);
    solid(() => { G.beginPath(); G.moveTo(-2.6, -4.25); G.lineTo(2.6, -4.25); G.lineTo(2.6, 0); G.lineTo(-2.6, 0); G.closePath(); }, { g: [nyl, nyl] }, [-2.6, -4.25, 5.2, 4.25], { ec: ne, lw: 1.1 });
    G.fillStyle = TH ? '#E8E8E8' : '#B8B8B8'; G.fillRect(-2.1, -4.25, 4.2, 3.6);
    solid(() => { G.beginPath(); G.moveTo(-2.0, -5.4); G.lineTo(2.0, -5.4); G.lineTo(2.0, -0.7); G.lineTo(-2.0, -0.7); G.closePath(); }, { g: [nyl, TH ? '#EBEBEB' : '#C5C5C5'] }, [-2, -5.4, 4, 4.7], { ec: ne, lw: 1.1 });
    G.fillStyle = '#C9A15C'; G.fillRect(-0.25, -4.2, 0.5, 2.9);
    out.grab = SP(-8, -6.2);
    xrest();
    /* the lead leaves the top and is pulled back toward the tail */
    xsave(); xabout(piv[0], piv[1], -th); wires(0, -5.4, -1, -0.1, 8.5); xrest();
    out.pad = SP(-2.5, 0); out.header = SP(0, -4.25); out.plug = SP(0, -5.4);
  }
  return out;
}

/* ---------- the battery in the tail, side-on, mm (#71, Brock's bands, line 614). The shell's inner surface is above, the
   way you reach in is from below. kind 'glue': stuck to the shell on adhesive, as in the Superlight (iFixit): heat, then
   a spudger pries one end down and the pouch bends (in the problem colour where it bends: a punctured pouch can catch
   fire). kind 'bands': held up by two silicone bands, no adhesive: it slides out along its length.
   k 0..1 (the pry, or the slide); heat 0..1. The 502030-class pouch of the 3D part: 30 × 5 mm. Returns stage points ---------- */
function b11_battSecMM(kind, k, o = {}) {
  const T = b11_tone(), L = 30, th = 5.0, out = {}, sx0 = -19, sx1 = 19, heat = o.heat || 0;
  /* the shell, cut: carbon-filled, hatched, above the battery */
  solid(() => { G.beginPath(); G.moveTo(sx0, -1.3); G.lineTo(sx1, -1.3); brk(sx1, -1.3, 0, 0.3); G.lineTo(sx0, 0); brk(sx0, 0, -1.3, 0.3); G.closePath(); }, MT.shell, [sx0, -1.3, sx1 - sx0, 1.3], { hatch: true });
  if (heat > 0.01) { ga(heat * 0.55); const g = G.createLinearGradient(0, -1.3, 0, 0); g.addColorStop(0, rgba(b11_hot(heat), 0)); g.addColorStop(1, rgba(b11_hot(heat), 0.9)); G.fillStyle = g; G.fillRect(-L / 2, -1.3, L, 1.4); ga(1); }
  const pouchC = TH ? ['#D5D8DD', '#AEB3BA'] : ['#9BA1A9', '#6E747C'];
  if (kind === 'glue') {
    /* the adhesive: a dark film over most of the length */
    G.fillStyle = TH ? '#3A3B40' : '#1A1B1E'; G.fillRect(-L / 2 + 1.5, 0, L - 3, 0.35);
    /* the pouch, its left end pried down by k: the bend sits where the adhesive still holds */
    const bendX = -L / 2 + 2 + 9 * k, ang = 0.26 * k;
    const yAt = x => x >= bendX ? 0.35 : 0.35 + Math.tan(ang) * (bendX - x) + 0.4 * k * Math.pow(Math.max(0, bendX - x) / 9, 2);
    G.beginPath(); for (let x = L / 2; x >= -L / 2; x -= 0.25) G.lineTo(x, yAt(x)); for (let x = -L / 2; x <= L / 2; x += 0.25) G.lineTo(x, yAt(x) + th); G.closePath();
    const g = G.createLinearGradient(0, 0, 0, th); g.addColorStop(0, pouchC[0]); g.addColorStop(1, pouchC[1]); G.fillStyle = g; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(1.1); G.stroke();
    if (k > 0.15) { ga(clamp((k - 0.15) * 2) * 0.9); G.fillStyle = C.bad; G.beginPath(); G.ellipse(bendX - 0.6, yAt(bendX) + th / 2, 1.3, th / 2 + 0.2, 0, 0, TAU); G.fill(); ga(1); }
    /* the spudger's tip, between pouch and shell at the left end */
    out.pry = SP(-L / 2 - 0.5, yAt(-L / 2) - 0.1); out.bend = SP(bendX, yAt(bendX) + th);
  } else {
    /* two silicone bands hold the pouch up to the shell; it slides out to the left as k grows */
    const dx = -k * 34;
    G.save(); G.beginPath(); G.rect(sx0 - 40, -0.1, 80, 10); G.clip();
    G.beginPath(); pathRR(-L / 2 + dx, 0.15, L, th, 1.0); const g = G.createLinearGradient(0, 0, 0, th); g.addColorStop(0, pouchC[0]); g.addColorStop(1, pouchC[1]); G.fillStyle = g; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(1.1); G.stroke();
    G.restore();
    for (const bx of [-7.5, 7.5]) {
      G.beginPath(); G.moveTo(bx - 1.1, 0); G.lineTo(bx - 1.1, th + 0.35); G.quadraticCurveTo(bx - 1.1, th + 0.75, bx - 0.6, th + 0.75); G.lineTo(bx + 0.6, th + 0.75); G.quadraticCurveTo(bx + 1.1, th + 0.75, bx + 1.1, th + 0.35); G.lineTo(bx + 1.1, 0);
      G.strokeStyle = TH ? '#3A3B40' : '#C8C8C8'; G.lineWidth = lw(3.2); G.lineJoin = 'round'; G.stroke();
    }
    out.slide = SP(-L / 2 + dx - 0.5, th / 2); out.band = SP(7.5 + 1.1, th + 0.5);
  }
  return out;
}


/* ============================== the mouse, side-on, with what is inside (b11_card, b11_repair) ==============================
   Drawn in mouseSimple('left')'s frame (mm: nose left, x = −z, y = −height, the pad at y = 0), over the kit's outline, so
   it follows the shared outline and the hardware the kit reads (msLive: the board from the 3D twin; MS_BATTERY: the battery
   in the tail). Theseus: one shell, open below; the board hangs from its bosses on four M2 screws driven from below (#54);
   the battery in two bands behind it; dot skates on the rim's ledge, none over a screw (#52). Most mice: two shells,
   skates over the shell's screws, a ribbon between the shells, the board's switches soldered, the battery glued. Their
   layout is schematic (the screws' places are illustrative); what each job takes is iFixit's, for the G Pro Wireless. */
/** the top surface's height (mm) at z, from the kit's side outline */
function b11_topH(z) {
  const P = MS_SIDE; let best = 0;
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if ((z - a[0]) * (z - b[0]) <= 0 && a[0] !== b[0]) best = Math.max(best, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return best;
}
/* where things sit, mouse mm (z toward the nose, height up). The four board screws are plan 5's mirror pairs (MH1/MH2 at
   layout z 29.50, MH3/MH4 at −2.25; mouse z = layout z − 2.88): side-on, one of each pair shows. Theseus's board is the
   shared one: its top at BOARD_TOP (5.03 mm over the pad), BOARD_T thick (0.6 mm since F47.4: only its underside moved up,
   4.0 → 4.43); the rival's board keeps its own, the 1.05 mm slab it was drawn with (H3: a rival's board passes its own) */
const B11_SIDE = {
  screwsZ: [29.50 - 2.88, -2.25 - 2.88], boardTop: BOARD_TOP, boardBot: BOARD_TOP - BOARD_T, rivalTop: 5.05, rivalBot: 4.0,
  rivalSkates: [[37, 52], [-6, 6], [-52, -37]], rivalScrews: [44, 0, -44, 21, -23], rivalHidden: 3, parting: 9.3
};
function b11_board() { const b = msLive().board; return { z0: b[1], z1: b[3] }; }
function b11_batt() { const B = MS_BATTERY, P = KEY_PARTS.battery; return { z0: -(B[1] + B[3]), z1: -B[1], h0: P.yMid - P.t / 2, h1: P.yMid + P.t / 2 }; }   /* plan 5 (KEY_PARTS), as mouseSimple draws it */
/** a screw seen side-on (a fastener: not hatched): head at the bottom (y = hy, mm height of the head's bearing face), shank
   up, len mm; a quiet grey, titanium */
function b11_screwSide(x, hy, len, o = {}) {
  const T = b11_tone(), y0 = -hy;
  G.beginPath(); G.moveTo(x - 0.75, y0); G.lineTo(x - 0.75, y0 - len); G.lineTo(x + 0.75, y0 - len); G.lineTo(x + 0.75, y0); G.closePath();
  G.fillStyle = own_finish('titanium', x - 0.8, x + 0.8); G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.moveTo(x - 2, y0); G.lineTo(x + 2, y0); G.lineTo(x + 2, y0 + 0.7); G.quadraticCurveTo(x + 1.9, y0 + 1.6, x, y0 + 1.6); G.quadraticCurveTo(x - 1.9, y0 + 1.6, x - 2, y0 + 0.7); G.closePath();
  G.fillStyle = own_finish('titanium', x - 2, x + 2); G.fill(); G.stroke();
  if (o.hi) { G.strokeStyle = o.hi; G.lineWidth = lw(2.2); G.stroke(); }
}
/** Theseus inside, side-on. o = { drop (mm the board has come down), out (0..1 each screw backed out: [front, rear]),
   swOut (mm the front switch has come up off its claw sockets), batt (mm the battery has slid back out of its bands),
   battUnplug (0..1), hi: { board, screws, battery, switch, skates } colours, a } */
function b11_theseusInside(o = {}) {
  const T = b11_tone(), B = b11_board(), Bt = b11_batt(), drop = o.drop || 0, a = o.a == null ? 1 : o.a, hi = o.hi || {};
  ga(a);
  /* the bosses: posts from the shell's skin down to the board, hidden (dashed) */
  G.setLineDash([lw(4), lw(3)]); G.strokeStyle = inkA(0.38); G.lineWidth = lw(1.2);
  for (const z of B11_SIDE.screwsZ) { const top = b11_topH(z) - 1.4; G.strokeRect(-z - 2.2, -top, 4.4, top - B11_SIDE.boardTop); }
  G.setLineDash([]);
  /* the leads: battery to its plug, side buttons to theirs; they hang slack as the board comes down */
  const lead = (x0, y0, x1, y1, sag) => { G.beginPath(); G.moveTo(x0, y0); G.bezierCurveTo(x0 + (x1 - x0) * 0.3, y0 + sag, x0 + (x1 - x0) * 0.7, y1 + sag, x1, y1); G.strokeStyle = TH ? '#3A3B40' : '#999999'; G.lineWidth = lw(2.4); G.stroke(); };
  lead(-Bt.z1, -(Bt.h0 + Bt.h1) / 2, -(-1.5), -(B11_SIDE.boardTop + 1.2) + drop, 1 + drop * 0.25);
  lead(-10, -20.5, -0.8, -(B11_SIDE.boardTop + 1.0) + drop, 2 + drop * 0.3);
  /* the battery, in its bands, at board height in the tail */
  xsave(); xmove(o.batt || 0, 0);
  G.beginPath(); pathRR(-Bt.z1, -Bt.h1, Bt.z1 - Bt.z0, Bt.h1 - Bt.h0, 0.8); G.fillStyle = hi.battery ? mix(TH ? '#C9CDD3' : '#7E848C', hi.battery, 0.35) : (TH ? '#C9CDD3' : '#7E848C'); G.fill(); G.strokeStyle = hi.battery || T.edge; G.lineWidth = lw(hi.battery ? 2 : 1); G.stroke();
  xrest();
  for (const f of [0.28, 0.72]) { const x = -Bt.z1 + (Bt.z1 - Bt.z0) * f; G.beginPath(); G.moveTo(x - 1, -Bt.h1 - 0.6); G.lineTo(x - 1, -Bt.h0 + 0.5); G.lineTo(x + 1, -Bt.h0 + 0.5); G.lineTo(x + 1, -Bt.h1 - 0.6); G.strokeStyle = TH ? '#3A3B40' : '#C8C8C8'; G.lineWidth = lw(2.2); G.stroke(); }
  /* the board and everything on it comes down together */
  xsave(); xmove(0, drop);
  G.beginPath(); G.rect(-B.z1, -B11_SIDE.boardTop, B.z1 - B.z0, B11_SIDE.boardTop - B11_SIDE.boardBot);
  G.fillStyle = hi.board ? mix('#16171A', hi.board, 0.45) : '#16171A'; G.fill(); G.strokeStyle = hi.board || (TH ? 'rgba(17,17,17,0.8)' : 'rgba(235,235,235,0.5)'); G.lineWidth = lw(hi.board ? 2 : 1); G.stroke();
  /* the battery's plug at the board's back edge, facing the tail (F26.4) */
  G.beginPath(); G.rect(-0.2 - 4.25, -B11_SIDE.boardTop - 3, 4.25, 3); G.fillStyle = TH ? '#FFFFFF' : '#D8D8D8'; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(0.9); G.stroke();
  /* the main switch under the left trigger, standing on its claw sockets: the GT01 drawn as the click chapter draws it */
  const swZ = 37.6;
  xsave(); xmove(-swZ, -B11_SIDE.boardTop - (o.swOut || 0)); b11_flipX();
  if (typeof clk_gt01MM === 'function') clk_gt01MM({ press: 0, clear: false, board: false }); else { G.fillStyle = '#26272B'; G.fillRect(-6.4, -7, 12.8, 7); }
  if (hi.switch) { G.strokeStyle = hi.switch; G.lineWidth = lw(2.2); G.strokeRect(-7.2, -8.2, 14.4, 8.2); }
  /* its legs, seen once it comes up: straight pins, no solder on them */
  if ((o.swOut || 0) > 0.3) { G.strokeStyle = '#A9AFB7'; G.lineWidth = lw(1.6); G.beginPath(); for (const px of [-4.5, 0.5, 4.5]) { G.moveTo(px, 0); G.lineTo(px, Math.min(3.2, o.swOut)); } G.stroke(); }
  xrest();
  xrest();
  /* the four screws (one of each pair shows), coming down out of their bosses as they are undone; their heads under the
     board, never under a skate */
  B11_SIDE.screwsZ.forEach((z, i) => { const k = (o.out || [0, 0])[i] || 0, dy = drop + k * 6.5; b11_screwSide(-z, B11_SIDE.boardBot - dy, OWN_M2.len, { hi: hi.screws }); });
  ga(1);
}
/** most mice inside, side-on (schematic): two shells, the board on the bottom one, skates over the screws, a ribbon
   between the shells, a soldered switch, a glued battery. o = { lift (mm the top shell has come up), skatesOff (0..1),
   heat (0..1 at the skates), screwsOut (0..1), ribbon (0..1: its strain as the shell lifts; 1 = taut, red), unlatched (0..1),
   melt (0..1: the iron at the switch's pins), swOut (mm), a } */
function b11_rivalInside(o = {}) {
  const T = b11_tone(), B = b11_board(), Bt = b11_batt(), a = o.a == null ? 1 : o.a, lift = o.lift || 0, V = msView('left'), par = B11_SIDE.parting;
  ga(a);
  /* the shell: the kit's outline cut at the parting line; the top half lifts */
  G.save(); G.beginPath(); G.rect(-80, -par, 160, par + 2); G.clip(); G.fillStyle = TH ? '#FFFFFF' : '#1A1B1E'; G.fill(V.out); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2); G.stroke(V.out); G.restore();
  xsave(); xmove(0, -lift);
  G.save(); G.beginPath(); G.rect(-80, -60, 160, 60 - par); G.clip(); G.fillStyle = TH ? '#FFFFFF' : '#1A1B1E'; G.fill(V.out); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2); G.stroke(V.out);
  for (const l of V.lines || []) { G.strokeStyle = inkA(TH ? 0.42 : 0.4); G.lineWidth = lw(1.2); G.stroke(l); }
  G.restore();
  xrest();
  /* the parting line */
  const zs = MS_SIDE.filter(p => Math.abs(p[1] - par) < 1.0).map(p => p[0]), pz0 = Math.min(...zs), pz1 = Math.max(...zs);
  if (lift < 0.2) mmLine([[-pz1 + 0.6, -par], [-pz0 - 0.6, -par]], inkA(0.55), 1.3);
  /* the board on the bottom shell's posts (the rival's own thickness); the battery glued on a pad behind it */
  const rT = B11_SIDE.rivalTop, rB = B11_SIDE.rivalBot;
  G.fillStyle = C.comp; G.fillRect(-B.z1, -rT, B.z1 - B.z0, rT - rB);
  G.fillStyle = TH ? '#3A3B40' : '#141518'; G.fillRect(-Bt.z1 + 1, -Bt.h0, Bt.z1 - Bt.z0 - 2, 0.6);
  G.beginPath(); pathRR(-Bt.z1, -Bt.h1 - 0.6, Bt.z1 - Bt.z0, Bt.h1 - Bt.h0, 0.8); G.fillStyle = TH ? '#C9CDD3' : '#7E848C'; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(1); G.stroke();
  /* the switch on the board, its three pins soldered through it */
  const swZ = 37.6;
  xsave(); xmove(-swZ - 6.4, -rT - (o.swOut || 0));
  swMM({ press: 0 });
  xrest();
  for (const px of SWG.pins) {
    const x = -swZ - 6.4 + px, m = clamp(o.melt || 0);
    G.beginPath(); G.moveTo(x - 0.8, -rB); G.quadraticCurveTo(x - 0.3, -rB + 0.5 * (1 - m), x, -rB + 0.75 * (1 - m)); G.quadraticCurveTo(x + 0.3, -rB + 0.5 * (1 - m), x + 0.8, -rB); G.closePath();
    G.fillStyle = m > 0.05 ? mix('#C8CDD3', b11_hot(m), m) : '#C8CDD3'; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(0.8); G.stroke();
  }
  /* the ribbon: from the board's connector up to the top shell, stretched as the shell lifts */
  { const x0 = 0.5, y0 = -rT - 0.6, x1 = -9, y1 = -24 - lift, u = clamp(o.unlatched || 0), strain = clamp(o.ribbon || 0) * (1 - u);
    const slack = Math.max(0, 9 - lift * 0.8) * (1 - u) + u * 6;
    G.beginPath(); G.moveTo(x0, y0 - (u > 0 ? u * 3 : 0)); G.bezierCurveTo(x0 + slack, y0 - 6, x1 + slack, y1 + 6, x1, y1);
    G.strokeStyle = strain > 0.05 ? mix('#C98A4E', C.red, strain) : '#C98A4E'; G.lineWidth = lw(4.2); G.lineCap = 'butt'; G.stroke();
    G.fillStyle = TH ? '#FFFFFF' : '#D8D8D8'; G.fillRect(x0 - 1.6, y0 - 1.2, 3.2, 1.2); }
  /* the skates under the base, over the screws; heated, then peeled */
  const off = clamp(o.skatesOff || 0);
  B11_SIDE.rivalSkates.forEach(([z0, z1], i) => {
    const ki = clamp(off * 3 - i * 0.9), x0 = -z1, w = z1 - z0;
    if (ki >= 1) return;
    xsave(); xabout(x0 + w, 0, ki * 0.9); xmove(0, ki * 4);
    G.beginPath(); pathRR(x0, -0.2, w, 1.4, 0.5); G.fillStyle = o.heat > 0.02 ? mix(TH ? '#F0F0F0' : '#E6E6E6', b11_hot(o.heat), o.heat * 0.7) : (TH ? '#F0F0F0' : '#E6E6E6'); G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(1); G.stroke();
    xrest();
  });
  /* the screws, coming down out of the base as they are undone; three of them were under the skates */
  B11_SIDE.rivalScrews.forEach((z, i) => b11_screwSide(-z, 2.5 - clamp(o.screwsOut || 0) * 6.5, 4.4));
  ga(1);
}

/** mirror the current drawing left to right (inside xsave/xrest): the click chapter draws the GT01 with the nose to the
   right; the side views here have the nose on the left */
function b11_flipX() { G.scale(-1, 1); const m = XF.m; m[0] = -m[0]; m[1] = -m[1]; }
/** the part() placement that fits a kit view into a stage box: { x, y, s } */
function b11_fit(box, view, pad = 0.06) { const V = msView(view), c = camFit(V.box, box, pad); return { x: box[0] + box[2] / 2 - c.cx * c.s, y: box[1] + box[3] / 2 - c.cy * c.s, s: c.s }; }


/** the mouse from below, small, for "where the screws are": most mice (pads over the screws) or Theseus (the kit's dots,
   the four board screws between them). mm, the kit's 'bottom' frame. o = { rival, skatesOff (0..1), screwsOut (0..1),
   lit (0..1: the screws lit) } */
const B11_RIVAL_PADS = [[-16, -46, 14, 9], [16, -46, 14, 9], [-15, 45, 13, 10], [15, 45, 13, 10]];
const B11_RIVAL_SCREWS = [[-16, -46, 1], [16, -46, 1], [-15, 45, 1], [15, 45, 1], [0, 13, 1], [-19, -12, 0], [19, -12, 0]];
function b11_screwHead(x, y, r, col, a = 1) {
  ga(a); G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = own_finish('titanium', x - r, x + r); G.fill(); G.strokeStyle = col || b11_tone().edge; G.lineWidth = lw(col ? 2 : 1); G.stroke();
  G.strokeStyle = 'rgba(30,30,32,0.7)'; G.lineWidth = lw(1.2); G.beginPath(); G.moveTo(x - r * 0.55, y); G.lineTo(x + r * 0.55, y); G.moveTo(x, y - r * 0.55); G.lineTo(x, y + r * 0.55); G.stroke(); ga(1);
}
function b11_underMM(o = {}) {
  const V = msView('bottom'), T = b11_tone();
  if (!o.rival) {
    mouseSimple('bottom', { show: ['board'] });
    const k = clamp(o.lit || 0), out = clamp(o.screwsOut || 0);
    [[10.10, 26.62], [-10.10, 26.62], [14.59, -5.13], [-14.59, -5.13]].forEach(([X, Z], i) => {
      const oi = o.outs ? clamp(o.outs[i]) : out; if (oi >= 0.995) return;
      /* a screw coming out toward the viewer: it grows a little and fades, its hole left behind */
      if (oi > 0.02) { ga(oi); G.beginPath(); G.arc(X * MS_K.x, -Z * MS_K.y, 1.25, 0, TAU); G.fillStyle = TH ? '#2A2B2F' : '#0B0C0D'; G.fill(); ga(1); }
      xsave(); xmove(X * MS_K.x, -Z * MS_K.y); xscale(1 + 0.6 * oi); b11_screwHead(0, 0, 2, k > 0.05 ? mix(T.edge, C.hero, k) : null, 1 - oi); xrest();
    });
    return;
  }
  G.save(); G.globalAlpha = PA; G.fillStyle = TH ? '#E1E1E1' : '#2C2D31'; G.fill(V.out); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2); G.stroke(V.out);
  for (const l of V.lines || []) { G.strokeStyle = inkA(0.4); G.lineWidth = lw(1.2); G.stroke(l); }
  G.beginPath(); pathRR(-3.4, 4, 6.8, 13, 2.4); G.fillStyle = TH ? '#E8E8E8' : '#2A2B2F'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1.2); G.stroke(); G.restore();
  const off = clamp(o.skatesOff || 0), out = clamp(o.screwsOut || 0);
  B11_RIVAL_SCREWS.forEach(([x, y, hid]) => { const vis = hid ? off : 1; if (vis < 0.02) { ga(0.5); G.setLineDash([lw(3), lw(2.5)]); G.beginPath(); G.arc(x, y, 2, 0, TAU); G.strokeStyle = inkA(0.45); G.lineWidth = lw(1.1); G.stroke(); G.setLineDash([]); ga(1); } else b11_screwHead(x, y, 2, null, vis * (1 - 0.75 * out)); });
  /* the pads: heated, then lifted one after another */
  B11_RIVAL_PADS.concat([[0, 13, 0, 0]]).forEach(([x, y, w, h], i) => {
    const ki = clamp(off * 3.2 - i * 0.55); if (ki >= 1) return;
    ga(1 - ki); G.beginPath(); if (w) pathRR(x - w / 2, y - h / 2 - ki * 6, w, h, 3.5); else { G.arc(0, 10.5 - ki * 6, 9, 0, TAU); G.arc(0, 10.5 - ki * 6, 6.2, 0, TAU, true); }
    G.fillStyle = o.heat > 0.02 ? mix('#FFFFFF', b11_hot(o.heat), o.heat * 0.55) : '#FFFFFF'; G.fill('evenodd'); G.strokeStyle = o.heat > 0.02 ? mix(T.edge, b11_hot(1), o.heat) : T.edge; G.lineWidth = lw(1.4); G.stroke(); ga(1);
  });
}


/* ---------- step 3 of the job, close: the switch on its board ----------
   most mice: a switch soldered through the board (swMM, the deck's D2F-class switch), the iron melting its joints (melt
   0..1), then the switch lifted (up mm). Theseus: the GT01 (the click chapter's drawing) on three claw sockets (a Mill-Max
   3305-type receptacle in each hole), pulled straight up (up mm): its pins slide out, nothing to melt. Origin: the middle of
   the board's top face, y down */
function b11_switchSoldered(melt, up) {
  const T = b11_tone(); xsave(); xmove(-6.4, 0);
  pcbSec(-2.6, 15.4, 0.2, 1.2, { holes: SWG.pins, rival: true });
  xsave(); xmove(0, -up); swMM({ press: 0 }); xrest();
  const m = clamp(melt), gone = clamp(up / 1.2);
  for (const x of SWG.pins) {
    for (const [yb, dir] of [[1.4, 1], [0.2, -1]]) {
      const h = 0.55 * dir * (1 - 0.75 * m) * (1 - gone), w = 0.9 * (1 - 0.35 * m * (1 - gone));
      if (Math.abs(h) < 0.03) continue;
      G.beginPath(); G.moveTo(x - w, yb); G.quadraticCurveTo(x - 0.3, yb + h * 0.15, x - 0.27, yb + h); G.lineTo(x + 0.27, yb + h); G.quadraticCurveTo(x + 0.3, yb + h * 0.15, x + w, yb); G.closePath();
      G.fillStyle = m > 0.02 ? mix('#D4D8DE', b11_hot(m), Math.min(1, m * 1.3) * (1 - gone)) : '#D4D8DE'; G.fill(); G.strokeStyle = T.edge; G.lineWidth = lw(0.8); G.stroke();
    }
  }
  if (m > 0.02 && gone < 1) { const x = SWG.pins[1]; b11_heatGlow(x, 1.9, 2.4, m * (1 - gone)); }
  xrest();
}
function b11_switchClaws(up) {
  const holes = [-5.08, 0, 5.08];
  pcbSec(-9.4, 9.4, 0, null, { holes });   /* Theseus's board, BOARD_T (0.6 mm, F47.4; was drawn 1.2) */
  /* the sockets: a barrel pressed into each plated hole, a flange on the top face, six fingers inside (two seen); the barrel
     is the part's own length, so on the thinner board more of it shows below */
  for (const x of holes) {
    solid(() => { G.beginPath(); G.moveTo(x - 0.95, -0.18); G.lineTo(x + 0.95, -0.18); G.lineTo(x + 0.95, 0.05); G.lineTo(x + 0.7, 0.05); G.lineTo(x + 0.7, 1.95); G.lineTo(x + 0.45, 2.15); G.lineTo(x - 0.45, 2.15); G.lineTo(x - 0.7, 1.95); G.lineTo(x - 0.7, 0.05); G.lineTo(x - 0.95, 0.05); G.closePath(); }, MT.brass, [x - 0.95, -0.18, 1.9, 2.33], { lw: 0.8 });
    G.fillStyle = '#16171A'; G.fillRect(x - 0.42, -0.18, 0.84, 2.1);
    G.strokeStyle = '#C9A15C'; G.lineWidth = lw(1.4); G.beginPath(); G.moveTo(x - 0.42, 0.6); G.lineTo(x - 0.14, 1.25); G.moveTo(x + 0.42, 0.6); G.lineTo(x + 0.14, 1.25); G.stroke();
  }
  xsave(); xmove(0, -up); clk_gt01MM({ press: 0, clear: false, board: false }); xrest();
}
/** own_jointMM (10-h2-own.js: the M2 joint from the 3D model's geometry), copied here with one change, the board's colour
   (integrator, POLISH b11; M's board-colour rule): o.rival draws the board under a joint screwed straight into plastic as a
   rival's (grey mask and trim, pcbSec's rival); otherwise Theseus's black mask with gold pads (pcbSec's default). The rest is
   own_jointMM's, line for line, through its own helpers (own_wallTF, own_insHalf, own_screwMM, own_bitMM). Same options and
   returns as own_jointMM, plus rival */
const B11_RIVAL_BT = 1.0;   /* most mice's board under a joint screwed straight into plastic (its own; H3) */
function b11_jointMM(o = {}) {
  const kind = o.kind || 'insert', ins = kind === 'insert', T = OWN_TH[ins ? 'm2' : 'tf'], hole = o.hole || C.panel, out = {};
  const fw = 4.6, bossM = OWN_MAT[ins ? 'cf' : kind], rB = 2.65, hB = o.crop || 5.4, I = OWN_INS;
  const bT = o.rival ? B11_RIVAL_BT : BOARD_T, seat = OWN_M2.len - bT;   /* the board under the head, and how deep the M2 × 5 then reaches */
  const pass2 = o.pass === 2, ph = pass2 ? (o.ph2 || 0) : (ins ? 0.2 : 0), tip = o.tip == null ? seat : o.tip, zb = tip - OWN_M2.len;
  /* the boss, cut and hatched; it runs on down into the shell, so it ends in a break line */
  const bossPath = () => { G.beginPath(); G.moveTo(-rB, hB); G.lineTo(-rB, 0.25); G.arcTo(-rB, 0, -rB + 0.25, 0, 0.25); G.lineTo(rB - 0.25, 0); G.arcTo(rB, 0, rB, 0.25, 0.25); G.lineTo(rB, hB); G.bezierCurveTo(rB * 0.36, hB + 0.3, -rB * 0.36, hB - 0.3, -rB, hB); G.closePath(); };
  solid(bossPath, bossM, [-rB, 0, 2 * rB, hB], { hatch: Object.assign({ sp: 9 }, bossM.hatch || {}) });
  let W = null;
  if (ins) {
    /* under the insert: the clearance hole and its drill point */
    G.beginPath(); G.moveTo(-1.12, 3.0); G.lineTo(-1.12, 4.6); G.lineTo(-0.7, 4.95); G.lineTo(0.7, 4.95); G.lineTo(1.12, 4.6); G.lineTo(1.12, 3.0); G.closePath(); G.fillStyle = hole; G.fill();
    G.beginPath(); G.moveTo(-1.12, 3.02); G.lineTo(-1.12, 4.6); G.lineTo(-0.7, 4.95); G.lineTo(0.7, 4.95); G.lineTo(1.12, 4.6); G.lineTo(1.12, 3.02); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
    /* the bore inside the insert's thread */
    G.beginPath(); for (let z = 0; z <= I.L + 1e-6; z += 0.01) { const x = -own_insR(z, -1, 0.2); z ? G.lineTo(x, z) : G.moveTo(x, z); } for (let z = I.L; z >= 0; z -= 0.01) G.lineTo(own_insR(z, 1, 0.2), z); G.closePath(); G.fillStyle = hole; G.fill();
    /* the insert's two cut halves, hatched the other way from the boss */
    for (const sd of [-1, 1]) solid(() => own_insHalf(sd, 0.2), MT.brass, [-1.8, 0, 3.6, 3], { hatch: { dir: -1, sp: 6, color: 'rgba(80,55,10,0.34)' }, lw: 0.9 });
    out.insert = SP(I.R, 0.9); out.knurl = SP(-I.R, 0.7); out.groove = SP(I.rGroove, (I.gTop + I.gBot) / 2);
  } else {
    W = own_wallTF(o.reach1 || 0, o.reach2 || 0, o.tilt || 0, o.ph2 || 0);
    const N = W.N, poly2 = (L, R, open) => { G.beginPath(); G.moveTo(L[0], 0); for (let i = 1; i <= N; i++) G.lineTo(L[i], i * OWN_DY); G.lineTo(-0.45, OWN_HOLE + 0.3); G.lineTo(0.45, OWN_HOLE + 0.3); for (let i = N; i >= 0; i--) G.lineTo(R[i], i * OWN_DY); if (!open) G.closePath(); };
    poly2(W.L2, W.R2); G.fillStyle = hole; G.fill();
    /* the bore tinted in the problem colour where the screw reached: the screw covers its own thread, so what stays
       visible is the room the first thread left round it, loose */
    const rc = clamp(o.recut || 0);
    if (rc > 0.01) {
      const zr = Math.max(0, (o.reach2 || 0) - 0.12), n2 = Math.round(zr / OWN_DY);
      G.save(); ga(rc * 0.9); G.fillStyle = C.bad; G.beginPath(); G.moveTo(W.L2[0], 0); for (let i = 1; i <= n2; i++) G.lineTo(W.L2[i], i * OWN_DY); for (let i = n2; i >= 0; i--) G.lineTo(W.R2[i], i * OWN_DY); G.closePath(); G.fill(); G.restore(); ga(1);
    }
    poly2(W.L2, W.R2, true); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
  }
  /* the board, clamped: Theseus's black mask both faces with the gold pad under the head and the plated hole (ENIG); a
     rival's board grey, mask and trim (M's board-colour rule: the plastic joint is the rival's way). Theseus's BOARD_T thick
     (0.6 mm, F47.4, as own_jointMM); the rival's most mice's own 1.0 mm (H3: their boards are 1.0 to 1.6 mm) */
  const trim = o.rival ? '#c9ccd1' : '#d9b25a';
  for (const [x0, x1, b] of [[-fw, -1.15, [1, 0]], [1.15, fw, [0, 1]]]) pcbSec(x0, x1, -bT, bT, o.rival ? { brk: b, rival: true } : { brk: b });
  G.fillStyle = trim; G.fillRect(-2.25, -bT - 0.03, 1.1, 0.04); G.fillRect(1.15, -bT - 0.03, 1.1, 0.04); G.fillRect(-1.19, -bT, 0.04, bT); G.fillRect(1.15, -bT, 0.04, bT);
  /* the screw in view, and the bit in its head; the second drive comes in tilted about the boss's mouth */
  const a = pass2 ? (o.tilt || 0) : 0;
  xsave(); xturn(a);
  if (o.bit && o.bit.a > 0.003) own_bitMM('ph', zb - OWN_HD.yc, { a: o.bit.a, turn: o.bit.turn, bg: hole, fade: 4.2 });
  const s = own_screwMM(ins ? 'm2' : 'tf', zb, ph, {});
  xrest();
  Object.assign(out, s, { boss: SP(-rB, 2.6), plate: SP(fw - 0.6, -0.5), axisTop: SP(0, zb - OWN_M2.k), bossTop: SP(0, 0), bossR: SP(rB, 1.4), bossL: SP(-rB, 1.4) });
  if (W) { let best = 0, bi = 0; for (let i = 0; i <= W.N; i++) { const d = W.R2[i] - W.R1[i]; if (d > best) { best = d; bi = i; } } out.recutPt = SP(W.R2[bi], bi * OWN_DY); out.recutMax = best; out.mouth = SP(OWN_RP, 0.5); }
  return out;
}

/* ============================== b11_card: the chapter card (replaces owncard) ============================== */
/* The compromise most mice make here, "Glued, soldered, thrown away", in red; the answer lands in blue. The part: the mouse
   cut open side-on: most mice (the battery glued, the switch soldered, the skates over the screws, a ribbon between the
   shells) turning into Theseus's (the battery in bands, the switch in claw sockets, four screws from below). It picks up the
   battery from b07_balance. */
function b11_cardPart(t, box, kt) {
  const F = b11_fit([box[0] + 20, box[1] + 30, box[2] - 40, box[3] - 60], 'left', 0.05), k = ep(kt, 0, 1);
  if (k < 1) part(F.x, F.y, F.s, () => b11_rivalInside({ a: 1 - k, heat: 0, melt: 0 }), { alpha: 1 - k });
  if (k > 0) part(F.x, F.y, F.s, () => { mouseSimple('left', { show: [], alpha: k }); b11_theseusInside({ a: k, hi: { battery: C.hero, board: C.hero } }); }, { alpha: k });
  /* what each side is, named under the drawing */
  const y = F.y + 64;
  text('Glued battery, soldered switches, screws under the skates', box[0] + box[2] / 2, y, { role: 'small', size: 22, weight: 650, color: C.red, align: 'center', alpha: (1 - k) * ep(t, 0.6, 1.0), maxW: box[2] });
  text('A battery in bands, switches in sockets, four screws from below', box[0] + box[2] / 2, y, { role: 'small', size: 22, weight: 650, color: C.heroText, align: 'center', alpha: k, maxW: box[2] });
}
S({
  id: 'b11_card', ch: 'own', card: true, first: true, theme: 'night', title: 'Made to last, and to open', settle: 5.5, replaces: ['owncard'],
  /* the player's chapter flight lands exactly on the card's mouse: b11_cardPart fits the 'left' view into chapterCard2's
     part box less its 20 / 30 px margins (b11_fit, pad 0.05), and draws the rival's outline by hand, so the kit can't see it */
  flight: { view: 'left', box: [1020, 230, 800, 440], pad: 0.05 },
  answers: [
    ['owncard (not rated): the chapter card', 'Rebuilt in the kit\'s chapter-card family: the compromise most mice make here, "Glued, soldered, thrown away", in red, struck as "Made to last, and to open" lands in blue; the part is the mouse cut open side-on, most mice\'s insides (glued battery, soldered switch, screws under the skates) turning into Theseus\'s (battery in bands, switches in sockets, four screws from below); the seven slides listed.'],
    ['Brief: "glued, soldered, thrown away"', 'The card\'s red line, as the ledger has it.']
  ],
  draw: t => {
    chapterCard2(t, {
      ch: 'own', compromise: 'Glued, soldered, thrown away', answer: 'Made to last, and to open', turn: 2.1,
      list: [['repair', 'Made to be opened'], [9, 'Titanium screws'], [101, 'Brass inserts'], ['wear', 'Thread wear'], [71, 'A battery you can unplug'], [63, 'Art on the board'], [72, 'The driver in the box']],
      part: (tt, box, kt) => b11_cardPart(tt, box, kt)
    });
  }
});

/* ============================== b11_repair: made to be opened ============================== */
/* The job: swap a worn main switch, in three steps (open it, reach the board, free the switch), on most mice (top row, as
   iFixit lays it out for the Logitech G Pro Wireless, b11Gpw) and on Theseus (bottom row), each step in the same camera on
   both (M3). The rival's row runs first, then Theseus's; each tool appears where it works and stays in its cell. */
const B11R = {
  /* the rival's row */
  heat: [0.5, 1.6], spud: [0.9, 2.0], drv: [1.85, 2.35], lift1: [2.35, 2.8], tw: [2.75, 3.4], lift2: [3.3, 3.65], iron: [3.65, 4.75], sw: [4.4, 4.8],
  /* Theseus's row */
  tdrv: [5.15, 6.0], drop: 6.0, tsw: [6.75, 7.25], verdict: 7.35
};
/** one cell of the job sheet: a tile, its content clipped to it. Returns the content rect */
function b11_cell(t, t0, r, fn, o = {}) {
  demoWindow(r[0], r[1], r[2], r[3], ep(t, t0, t0 + 0.5), {});
  clipped(r[0], r[1], r[2], r[3], () => fn(r));
  /* a cell waiting its turn is dimmed (M7): the tile's own colour over it */
  if (o.dim > 0.003) { G.save(); G.globalAlpha = o.dim; rrPath(r[0], r[1], r[2], r[3], TILE.r); G.fillStyle = C.panel; G.fill(); G.restore(); }
  return r;
}
/** a tool at work in a cell: from t0 it is at `at` (stage px, angle ang, scale s); after t1 it settles into the cell's
   corner (park: [x, y]) small, so the cell keeps a record of what the step took */
function b11_cellTool(t, kind, o) {
  if (t < o.t0) return;
  const fly = ep(t, o.t1, o.t1 + 0.4, E.cam), a = ep(t, o.t0, o.t0 + 0.2), L = (B11_TOOL[kind] || {}).len || 50, ps = o.ps || 1.0;
  const p = [lerp(o.at[0], o.park[0] - L * ps, fly), lerp(o.at[1], o.park[1], fly)], sc = lerp(o.s || 2, ps, fly), ang = lerp(o.ang || 0, 0, fly);
  const hot = (o.hot || 0) * ep(t, o.t0 + 0.1, o.t0 + 0.35) * (1 - fly);
  part(p[0], p[1], sc, () => b11_toolMM(kind, { hot, t }), { alpha: a, rot: ang });
}
S({
  id: 'b11_repair', ch: 'own', theme: 'paper', title: 'Made to be opened', settle: 12, ideas: ['repair', 52, 54, 14],
  replaces: ['repair'], src: ['b11Gpw', 'b11TpuV3', 'b11GpxOpen', 'b11Hakko', 'b11Brock'],
  answers: [
    ['repair: rated 8, no note', 'Kept what earned the 8 (what wears out and what each fix takes, the driver in the box) and rebuilt it problem first as a demonstration: the same switch swap done on a Logitech G Pro Wireless as iFixit lays it out, then on Theseus, step by step, each step in the same camera on both.'],
    ['Brief: "What breaks, and what you need to fix it: a driver, no heat, no solder"', 'Top row: heat and five peeled skates, a ribbon between the shells, solder melted with an iron at 350 °C, the tools kept in their cells. Bottom row: four screws from below, the board down on its plugs, the switch pulled from its claw sockets, one driver. Verdict 4 → 1 (the four tools iFixit requires; its optional heat gun said, not counted), with iFixit\'s "Difficult, 40 to 50 minutes" beside it; "No heat, no solder, nothing peeled".'],
    ['Idea #52: screws not under the skates', 'Open it: the rival\'s skates are heated and peeled to reach the screws, and set aside in red (new ones to buy); Theseus\'s four screws sit between its skates, which stay on.'],
    ['Idea #54: the board\'s screws from below', 'Reach the board: once its four screws are out, Theseus\'s board comes down on its plugs; the shell is never split and there is no ribbon to tear.'],
    ['Idea #14: hot-swap claw sockets', 'Free the switch: the GT01 pulls straight out of three claw sockets (pointer). The sockets close up are the Clicks chapter\'s (b03_hotswap), so this slide does not repeat them.'],
    ['What moved or went', 'The old slide\'s claw-socket drawing is in Clicks (b03_hotswap). Its iFixit reader survey (93 %, 95 %, self-selected readers) and the IKEA-effect line are out: the slide now sells the fix itself.']
  ],
  draw: t => {
    const R = B11R;
    header(t, 'Made to be opened');
    captions(t, [[0.4, 'Most mice are built to be closed once: to swap a worn switch you heat off the skates, unlatch a ribbon and melt solder.'], [5.0, 'Theseus opens from below with the driver in the box: the board comes down on its plugs and the switch pulls straight out.']]);
    /* the sheet: three steps across, most mice above, Theseus below */
    const gx = 300, cw = 492, gap = 32, ry = [338, 572], rh = 214, col = i => gx + i * (cw + gap);
    ['Open it', 'Reach the board', 'Free the switch'].forEach((h, i) => rich([{ s: String(i + 1), role: 'label', size: 22, color: C.faint }, { s: h, role: 'label', size: 22, color: C.ink, gap: 14 }], col(i), 318, { alpha: ep(t, 0.15 + i * 0.08, 0.5 + i * 0.08) }));
    const kL = ep(t, 0.1, 0.4);
    text('Most mice', LM, ry[0] + 30, { role: 'label', size: 22, color: C.mute, alpha: kL });
    text('Logitech G Pro Wireless, by iFixit', LM, ry[0] + 64, { role: 'small', size: 23, weight: 650, color: C.secondText, alpha: kL, maxW: gx - LM - 20, lh: 1.25 });
    text('Theseus', LM, ry[1] + 30, { role: 'label', size: 22, color: C.heroText, alpha: kL });
    text('The same job', LM, ry[1] + 64, { role: 'small', size: 23, weight: 650, color: C.heroText, alpha: kL, maxW: gx - LM - 20 });
    /* ---- the rival's state through its row ---- */
    const heat = ep(t, R.heat[0] + 0.2, R.heat[0] + 0.6) * (1 - ep(t, R.spud[1] - 0.2, R.spud[1] + 0.3)), off = ep(t, R.spud[0] + 0.2, R.spud[1], E.io3), sOut = ep(t, R.drv[0] + 0.1, R.drv[1], E.io3);
    const lift = 5 * ep(t, R.lift1[0], R.lift1[1], E.io3) + 4 * ep(t, R.lift2[0], R.lift2[1], E.io3), strain = ep(t, R.lift1[0] + 0.15, R.lift1[1]), unl = ep(t, R.tw[0] + 0.3, R.tw[0] + 0.55);
    const melt = ep(t, R.iron[0] + 0.3, R.iron[0] + 0.7), swOut = 4.0 * ep(t, R.sw[0], R.sw[1], E.io3);
    /* ---- Theseus's ---- */
    const tOut = [0, 1, 2, 3].map(i => ep(t, R.tdrv[0] + 0.12 + i * 0.17, R.tdrv[0] + 0.32 + i * 0.17, E.io3)), drop = 9 * spring(t, R.drop, { f: 1.5, z: 0.8 }), tsw = 3.6 * ep(t, R.tsw[0], R.tsw[1], E.io3);
    const A = {};
    /* 1 · open it: the base, seen from below, nose to the left */
    const sb = 2.95, dh = 44;
    b11_cell(t, 0.05, [col(0), ry[0], cw, rh], r => part(r[0] + r[2] / 2 - 46, r[1] + (r[3] - dh) / 2 + 4, sb, () => { b11_underMM({ rival: true, skatesOff: off, screwsOut: sOut, heat }); A.pad = SP(15, 45); A.pad2 = SP(-16, -46); A.scr = SP(-19, -12); }, { rot: -Math.PI / 2 }));
    const kTh = lerp(0.45, 1, ep(t, R.tdrv[0] - 0.45, R.tdrv[0] - 0.05));
    b11_cell(t, 0.12, [col(0), ry[1], cw, rh], r => part(r[0] + r[2] / 2 - 46, r[1] + (r[3] - dh) / 2 + 4, sb, () => { b11_underMM({ lit: ep(t, R.tdrv[0], R.tdrv[0] + 0.25), outs: tOut }); A.tscr = SP(14.59, 5.13); A.dot = SP(17.2, 43.2); }, { rot: -Math.PI / 2 }), { dim: 1 - kTh });
    /* 2 · reach the board: the whole mouse side-on */
    const camB = { cx: 0, cy: -21.5, s: 3.2 }, inner = r => [r[0], r[1] + 4, r[2], r[3] - dh];
    b11_cell(t, 0.1, [col(1), ry[0], cw, rh], r => withCam(camB, inner(r), () => { b11_rivalInside({ lift, skatesOff: 1, heat: 0, screwsOut: 1, ribbon: strain, unlatched: unl, melt: 0, swOut: 0, fade: 1 }); A.rib = SP(-4, -14 - lift); A.latch = SP(0.5, -B11_SIDE.rivalTop - 1.2); }));
    b11_cell(t, 0.17, [col(1), ry[1], cw, rh], r => withCam(camB, inner(r), () => { mouseSimple('left', { show: ['skates'] }); b11_theseusInside({ drop, out: [Math.max(tOut[0], 0) > 0.99 ? 1 : tOut[0], tOut[2]], swOut: 0, noBoss: true }); A.brd = SP(-14, -B11_SIDE.boardBot + drop + 0.2); }), { dim: 1 - kTh });
    /* 3 · free the switch: the switch on its board, close */
    b11_cell(t, 0.15, [col(2), ry[0], cw, rh], r => part(r[0] + r[2] / 2 - 26, r[1] + (r[3] - dh) * 0.8 + 2, 10.5, () => { b11_switchSoldered(melt, swOut); A.joint = SP(SWG.pins[1] - 6.4, 1.75); }));
    b11_cell(t, 0.22, [col(2), ry[1], cw, rh], r => part(r[0] + r[2] / 2 - 26, r[1] + (r[3] - dh) * 0.86, 10.5, () => { b11_switchClaws(tsw); A.claw = SP(5.08, -0.4); }), { dim: 1 - kTh });
    /* the hand: the pointer lifts the shell off, then pulls each switch (F2.43, M2) */
    if (A.rib) {
      const sh = [col(1) + cw * 0.55, ry[0] + 64 - lift * camB.s], sw1 = [col(2) + cw / 2 - 26 - 0.6 * 10.5, ry[0] + (rh - dh) * 0.8 + 2 - (7.6 + swOut) * 10.5];
      const kp1 = ep(t, R.lift1[0] - 0.25, R.lift1[0]) * (1 - ep(t, R.lift2[1], R.lift2[1] + 0.25));
      if (kp1 > 0.01) cursorPtr(sh[0], sh[1], { a: kp1, grab: true });
      const kp2 = ep(t, R.sw[0] - 0.2, R.sw[0]) * (1 - ep(t, R.sw[1] + 0.1, R.sw[1] + 0.35));
      if (kp2 > 0.01) cursorPtr(sw1[0] + 30, sw1[1] + 6, { a: kp2, grab: true });
      const sw2 = [col(2) + cw / 2 - 26 + 10, ry[1] + (rh - dh) * 0.86 - (9.4 + tsw) * 10.5];
      const kp3 = ep(t, R.tsw[0] - 0.2, R.tsw[0]) * (1 - ep(t, R.tsw[1] + 0.15, R.tsw[1] + 0.4));
      if (kp3 > 0.01) cursorPtr(sw2[0] + 30, sw2[1] + 6, { a: kp3, grab: true });
    }
    /* where on the mouse the close-ups are (M4): a small locator on each switch cell */
    for (const row of [0, 1]) locator(t, 0.3 + row * 0.1, col(2) + 22, ry[row] + 20, 96, 'left', [-47, -14, 19, 15], {});
    /* the peeled skates, set aside: five of them, ruined */
    for (let i = 0; i < 5; i++) {
      const kd = clamp(off * 3.2 - i * 0.55); if (kd < 1) continue;
      const k2 = ep(t, R.spud[0] + 0.2 + (i * 0.55 + 1) / 3.2 * (R.spud[1] - R.spud[0] - 0.2), R.spud[0] + 0.5 + (i * 0.55 + 1) / 3.2 * (R.spud[1] - R.spud[0] - 0.2));
      const x = col(0) + cw - 74, y = ry[0] + 88 + i * 18;
      G.save(); G.globalAlpha = k2; G.beginPath(); G.moveTo(x, y + 4); G.quadraticCurveTo(x + 24, y - 6, x + 48, y + 2); G.lineTo(x + 48, y + 9); G.quadraticCurveTo(x + 24, y + 1, x, y + 11); G.closePath();
      G.fillStyle = '#FFFFFF'; G.fill(); G.strokeStyle = C.red; G.lineWidth = 1.6; G.stroke(); G.restore();
    }
    /* the tools: each where it works, then kept in its cell's corner */
    const park = (i, row, k) => [col(i) + cw - 18 - k * 74, ry[row] + 30];
    if (A.pad) {
      b11_cellTool(t, 'heat', { at: [A.pad[0] + 60, A.pad[1] - 66], ang: Math.PI - 0.6, s: 1.7, t0: R.heat[0], t1: R.heat[1], hot: 1, park: park(0, 0, 2), ps: 0.8 });
      b11_cellTool(t, 'spudger', { at: [A.pad2[0] - 112, A.pad2[1] + 8], ang: -0.12, s: 1.7, t0: R.spud[0], t1: R.spud[1], park: park(0, 0, 1), ps: 0.8 });
      b11_cellTool(t, 'driver', { at: [A.scr[0] - 90, A.scr[1] + 36], ang: -0.35, s: 1.7, t0: R.drv[0], t1: R.drv[1], park: park(0, 0, 0), ps: 0.8 });
      b11_cellTool(t, 'tweezers', { at: [A.latch[0] - 104, A.latch[1] + 2], ang: 0.05, s: 1.7, t0: R.tw[0], t1: R.tw[1], park: park(1, 0, 0), ps: 0.8 });
      b11_cellTool(t, 'iron', { at: [A.joint[0] - 116, A.joint[1] + 2], ang: -0.02, s: 1.7, t0: R.iron[0], t1: R.iron[1], hot: 1, park: park(2, 0, 0), ps: 0.8 });
      b11_cellTool(t, 'box', { at: [A.tscr[0] - 96, A.tscr[1] - 24], ang: 0.2, s: 1.7, t0: R.tdrv[0], t1: R.tdrv[1], park: park(0, 1, 0), ps: 0.8 });
    }
    /* what each step costs (red), and what Theseus does instead (blue): a line in the cell, a mark on the drawing */
    const note = (i, row, t0, s2, bad, p) => {
      const k = ep(t, t0, t0 + 0.3); if (k <= 0.003) return;
      text(s2, col(i) + 22, ry[row] + rh - 20, { role: 'small', size: 23, weight: 700, color: bad ? C.red : C.heroText, alpha: k, t, t0, cps: 90 });
      if (p) { circle(p[0], p[1], 5, { fill: bad ? C.red : C.hero, alpha: k }); circle(p[0], p[1], 11 + 3 * (1 - k), { color: bad ? C.red : C.hero, w: 1.6, alpha: 0.5 * k }); }
    };
    if (A.pad) {
      note(0, 0, R.spud[0] + 0.5, 'Five skates peeled: new ones to buy', true, null);
      note(1, 0, R.lift1[0] + 0.25, 'A ribbon ties the shells: easy to tear', true, A.rib);
      note(2, 0, R.iron[0] + 0.35, 'Soldered: an iron at ' + B11.ironC + ' °C', true, null);
      note(0, 1, R.tdrv[0] + 0.25, 'Four screws from below: skates stay on', false, null);
      note(1, 1, R.drop + 0.25, 'The board comes down on its plugs', false, null);
      /* the switch step is the Clicks chapter's mechanism (b03_hotswap): said as a callback, not a second demonstration (FILM F5) */
      note(2, 1, R.tsw[0] + 0.2, 'Claw sockets, as in Clicks', false, null);
    }
    verdict(t, R.verdict, 1120, 922, { from: 4, to: 1, label: 'Tools iFixit lists to swap a worn switch', better: 'lower', who: ['G Pro Wireless', 'Theseus'], net: false, size: 116, maxW: 720 });
    text('Rated Difficult by iFixit: 40 to 50 minutes, with the four tools and an optional heat gun for the skates.', 300, 846, { role: 'small', size: 24, weight: 650, color: C.ink2, maxW: 780, lh: 1.3, alpha: ep(t, R.verdict + 0.4, R.verdict + 0.8) });
    text('No heat, no solder, nothing peeled', 1330, 898, { role: 'small', size: 27, weight: 750, color: C.heroText, alpha: ep(t, R.verdict + 1.3, R.verdict + 1.7) });
    text('Swap it at your desk and keep the mouse', 1330, 934, { role: 'small', size: 24, weight: 650, color: C.ink2, alpha: ep(t, R.verdict + 1.6, R.verdict + 2.0) });
    source(t, 'G Pro Wireless, iFixit\'s switch guide: Difficult, 40 to 50 min; heat and lift five skates, seven screws, ribbon latches, desolder; it uses an iron, a spudger, tweezers, a #00 driver, and a heat gun for the skates (optional). Viper V3 Pro: screws beneath its skates (TechPowerUp).', { t0: 1.0, maxW: 960 });
  }
});

/* ============================== b11_screws: titanium screws (replaces ownscrew) ============================== */
/* Where (the four screw heads under the mouse), then the same twist and the same two slips on a class 4.8 steel head and on
   Theseus's grade 5 titanium head: the bit rides up the cross's sloped walls (cam-out) and its edges dent the arms. The dents
   are sized by hardness (at one force a dent's area goes as 1 / HV: 220 / 349 = 0.63): an illustration sized by the ratio.
   Then the classroom test that ratio comes from (Vickers), the verdict, the weight, and three plain lines. */
const B11S = { split: [1.45, 1.9], turn: [2.0, 4.0], slips: [[2.35, 2.75], [3.25, 3.65]], vick: 4.3, verdict: 7.4, mass: 8.1, lines: 8.6 };
const B11_SCREWS_BOTTOM = [[10.10, 26.62], [-10.10, 26.62], [14.59, -5.13], [-14.59, -5.13]];
S({
  id: 'b11_screws', ch: 'own', theme: 'night', title: 'Titanium screws: harder heads, lighter', settle: 12, ideas: [9, 54],
  replaces: ['ownscrew'], src: ['ownIso898p', 'ownTi', 'b11CamOut', 'b11Vickers', 'ownRecess', 'ownStrip', 'ownBrock'],
  answers: [
    ['Rated 7/10, no note', 'Kept the subject, rebuilt as a demonstration: the same twist and the same two slips on a class 4.8 steel head and a grade 5 titanium head, cut through and from above, after a push-in from the four screws under the mouse.'],
    ['Brief: harder heads that resist cam-out (220 → 349 HV against class 4.8, sourced, F25.5)', 'Cam-out drawn (the bit rides up the sloped walls, an arrow names it); the steel cross rounds, the titanium dent is 0.63× the size (sized by 220 / 349, said to be an illustration); Vickers\' test as the classroom panel (1.26× as wide); verdict 220 → 349 HV. Sources: ISO 898-1 (class 4.8: 130 to 220 HV, so 220 is the steel\'s best case), ASM grade 5 (36 HRC = 349 HV), Stahlwille (cam-out).'],
    ['Brief: lighter (F25.4: grade 5, 0.42 g for four)', 'Four screws: 0.75 g → 0.42 g, from the 3D model\'s 23.59 mm³ at 7.9 and 4.43 g/cm³.'],
    ['Brief: no magnetic pickup', 'Said plainly as the one thing given up: "Not magnetic: a magnetised driver won\'t hold it".'],
    ['Brief: thread stripping lives in the insert, said plainly (F25.5)', 'A plain line: "A thread strips in its softer half: the brass insert, never the screw." The hardness claim is kept to the recess, where the evidence is.'],
    ['F2.08: the screws "need a massive revamp to look proper"', 'Every head is the 3D model\'s ISO M2 pan head and combination recess (own_headTopMM / own_headSecMM), in section and from above.'],
    ['#9 combination drive', 'A plain line: "If a cross ever rounds, a flat blade still turns the slot" (the slot is drawn in every head).']
  ],
  draw: t => {
    const Q = B11S;
    header(t, 'Titanium screws: harder heads, lighter');
    captions(t, [[0.3, 'Four screws hold the board, all from below. Twist one and the bit can slip: the cross\'s sloped walls push it up and out.'], [Q.slips[1][1] + 0.3, 'Each slip, the bit\'s edges dent the cross. A harder head takes a smaller dent: titanium keeps its edges for longer.']]);
    const E0 = [LM, 290, 1060, 500];
    /* where: the mouse from below, the four heads; push in to one; then a dip to the two heads side by side */
    const kd = ep(t, 1.3, 1.55), kx = ep(t, 1.5, 1.85);
    if (kd < 1) {
      const X = B11_SCREWS_BOTTOM[0][0] * MS_K.x, Y = -B11_SCREWS_BOTTOM[0][1] * MS_K.y;
      establish(t, 0, E0, { view: 'bottom', focus: [X - 4.2, Y - 4.2, 8.4, 8.4], hold: 0.3, dur: 0.95, fade: 0.35, locator: 'tl', locW: 70,
        draw: () => B11_SCREWS_BOTTOM.forEach(([x, z]) => { xsave(); xmove(x * MS_K.x, -z * MS_K.y); own_headTopMM({}); xrest(); }) });
      if (kd > 0.003) rect(E0[0] - 10, E0[1] - 10, E0[2] + 20, E0[3] + 20, { fill: C.bg, alpha: kd });
    }
    /* the two heads: the same twist, the same two slips */
    const cols = [{ x: LM, w: 520, steel: true }, { x: LM + 540, w: 520, steel: false }];
    const slipK = sl => ep(t, sl[0], (sl[0] + sl[1]) / 2, E.io3) * (1 - ep(t, (sl[0] + sl[1]) / 2, sl[1], E.io3));
    const lift = Math.max(slipK(Q.slips[0]), slipK(Q.slips[1])) * 0.42;
    const nSl = ep(t, Q.slips[0][0] + 0.1, Q.slips[0][1]) + ep(t, Q.slips[1][0] + 0.1, Q.slips[1][1]);
    const turning = t > Q.turn[0] && t < Q.turn[1], rot = 0.22 * Math.sin(Math.max(0, t - Q.turn[0]) * 3.2) * ep(t, Q.turn[0], Q.turn[0] + 0.3);
    const ka = ep(t, Q.turn[0] - 0.3, Q.turn[0]) * (1 - ep(t, Q.turn[1], Q.turn[1] + 0.3));
    if (kx > 0.003) cols.forEach((c, i) => {
      const a = kx, y = E0[1], sx = c.x + 150, sy = y + 300, ss = 56, tx = c.x + 380, ty = y + 210;
      demoWindow(c.x, y, c.w, E0[3], a);
      ltag(c.x + 22, y + 32, c.steel ? 'Common steel' : 'Theseus', c.steel ? 'Class 4.8, 220 HV' : 'Grade 5 titanium, 349 HV', { size: 21, color: c.steel ? C.mute : C.heroText, vcolor: c.steel ? C.ink2 : C.heroText, a });
      const dmg = nSl * 0.5 * (c.steel ? 1 : B11.hv.steel / B11.hv.ti);
      /* cut through the head (B-B), the bit in its cross */
      G.save(); G.beginPath(); G.rect(c.x + 2, y + 58, c.w - 4, 330); G.clip();
      part(sx, sy, ss, () => b11_headSecMM({ lift, turn: turning ? t * 2 : 0, a: 1, dmg, col: c.steel ? C.bad : C.mute, shank: 1.2, bg: C.panel }), { alpha: a });   /* red is the steel's alone (R2-b11-1) */
      G.restore();
      text('Cut through', sx, y + 412, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: a });
      /* from above: the cross, the bit's wings dashed, the dents in red */
      part(tx, ty, 50, () => b11_headTopMM({ dmg, rot, bitA: 0.85 * ka, col: c.steel ? C.bad : C.mute }), { alpha: a });
      text('From above', tx, y + 412, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: a });
      /* the hand on the driver, turning; cam-out pushes the bit up */
      const bitY = sy - ss * (OWN_M2.k + lift), hy = y + 128 - ss * lift;
      if (ka > 0.01) { cursorPtr(sx + 22, hy + 6, { a: a * ka, grab: true }); G.save(); G.globalAlpha = a * ka; G.strokeStyle = C.mute; G.lineWidth = 2.5; G.beginPath(); G.ellipse(sx, hy + 34, 46, 11, 0, 0.35, Math.PI - 0.35); G.stroke(); G.restore(); }
      if (lift > 0.03) forceArrow(sx + 72, bitY - 30 - 90 * lift, -Math.PI / 2, 26 + 110 * lift, { k: 1, color: c.steel ? C.red : C.mute, w: 4, hs: 13, alpha: a });
      const kc = a * ep(t, Q.slips[0][0], Q.slips[0][0] + 0.25) * (1 - ep(t, Q.slips[1][1] + 0.4, Q.slips[1][1] + 0.7));
      if (i === 0 && kc > 0.01) text('Cam-out', sx + 86, y + 118, { role: 'small', size: 22, weight: 750, color: C.red, alpha: kc });
      /* what two slips leave */
      const kr = ep(t, Q.slips[1][1], Q.slips[1][1] + 0.3);
      text(c.steel ? 'Two slips: the cross rounds' : 'The same two slips: a dent 0.63× the size', c.x + 22, y + E0[3] - 26, { role: 'small', size: 22, weight: 700, color: c.steel ? C.red : C.heroText, alpha: a * kr, maxW: c.w - 40 });
    });
    /* right: the classroom test the ratio comes from, then the verdict and the weight */
    const rx = 1220, rw = RM - rx;
    const kv = ep(t, Q.vick, Q.vick + 0.4);
    if (kv > 0.003) { demoWindow(rx - 20, 290, rw + 20, 340, kv); text('The hardness test: one diamond, one force', rx, 322, { role: 'label', size: 20, color: C.mute, alpha: kv }); }
    b11_vickers(t, Q.vick, rx, 336, rw, 270);
    verdict(t, Q.verdict, rx, 800, { from: B11.hv.steel, to: B11.hv.ti, unit: ' HV', label: 'Head hardness', better: 'higher', who: ['Steel', 'Theseus'], net: false, size: 104, maxW: rw });
    rich([{ s: 'Four screws: ', role: 'small', size: 24, weight: 650, color: C.ink2 }, { s: '0.75 g', role: 'small', size: 24, weight: 650, color: C.mute }, { s: ' → ', role: 'small', size: 24, weight: 650, color: C.mute }, { s: '0.42 g', role: 'small', size: 24, weight: 800, color: C.heroText }], rx, 884, { alpha: ep(t, Q.mass, Q.mass + 0.4), align: 'left' });
    /* three plain lines, under the heads */
    const L3 = ['If a cross ever rounds, a flat blade still turns the slot.', 'A thread strips in its softer half: the brass insert, never the screw.', 'Not magnetic: a magnetised driver won\'t hold it.'];
    L3.forEach((s2, i) => text(s2, LM + i * 360, 836, { role: 'small', size: 22, weight: 650, color: i === 2 ? C.mute : C.ink2, alpha: ep(t, Q.lines + i * 0.35, Q.lines + i * 0.35 + 0.4), maxW: 330, lh: 1.25 }));
    source(t, 'Hardness: ISO 898-1, class 4.8 at 130 to 220 HV (220 is the steel\'s best case); grade 5 titanium, annealed, 36 HRC = 349 HV (ASM). Cam-out: a cross recess\'s sloped walls turn part of the torque into a push up and out (Stahlwille). The dents are drawn to scale with each other only: at one force a dent\'s area goes as 1 / HV (Vickers). Mass: 23.59 mm³ per screw (3D model) at 7.9 and 4.43 g/cm³.', { t0: 1.0, maxW: 1760 });
  }
});

/* ============================== b11_inserts: brass inserts, the same fit every time (F2.01, F21.5, F21.12) ==============================
   Where: the board's front screw boss on the mouse (establish, M4). Then the view splits: most mice's joint, a
   thread-forming screw straight into the plastic boss, beside Theseus's, the same M2 in a brass heat-set insert. The same
   hand drives both, backs them out, and drives them again 2° off and a fifth of a pitch out of phase: the plastic takes a
   second thread beside the first (own_wallTF), the brass can only be followed. The chance the joint then feels different is
   Brock's estimate (F2.01, F21.5): ABS 90 %, carbon-filled 70 %, brass 0 %. The first fit stays in words (F21.12). */
const B11I = { d1: [2.05, 3.35], out: [3.5, 4.35], d2: [4.6, 6.5], split: [1.55, 2.05], tilt: 2 * Math.PI / 180, ph2: 0.18, verdict: 6.55 };
/* how far aside the plastic joint's second drive lands at its tip: the screw's reach into the boss on most mice's 1.0 mm
   board (4.0 mm) × sin 2° = 0.1396 mm, shown 0.14 (two decimals, nearest) */
B11I.aside = Math.round((OWN_M2.len - B11_RIVAL_BT) * Math.sin(B11I.tilt) * 100) / 100;
function b11_inPose(t, d = OWN_SEAT) {   /* d: how deep the screw seats (Theseus's OWN_SEAT, 4.4 mm on the 0.6 mm board; the
     rival's 4.0 on its 1.0 mm board): one pose, each joint at its own depth */
  const P = B11I;
  if (t < P.out[0]) { const k = ep(t, P.d1[0], P.d1[1], E.io3); return { pass: 1, tip: d * k, reach1: d * k, reach2: 0, dir: t > P.d1[0] && t < P.d1[1] ? 1 : 0, step: 0 }; }
  if (t < P.d2[0]) { const k = ep(t, P.out[0], P.out[1], E.io3); return { pass: 1, tip: d * (1 - k), reach1: d, reach2: 0, dir: t < P.out[1] ? -1 : 0, step: 1 }; }
  const k = ep(t, P.d2[0], P.d2[1], E.io3); return { pass: 2, tip: d * k, reach1: d, reach2: d * k, dir: t < P.d2[1] ? 1 : 0, step: 2 };
}
/** the board's bosses side-on, in the mouseSimple('left') frame: posts from the shell down to the board, a screw head under
   each (the insert at the bottom of each post) */
function b11_bossesSide(a = 1, hiFront) {
  ga(a);
  for (const z of B11_SIDE.screwsZ) {
    const top = b11_topH(z) - 1.4, front = z === B11_SIDE.screwsZ[0];
    G.setLineDash([lw(4), lw(3)]); G.strokeStyle = front && hiFront ? hiFront : inkA(0.45); G.lineWidth = lw(front && hiFront ? 2 : 1.2); G.strokeRect(-z - 2.65, -top, 5.3, top - B11_SIDE.boardTop); G.setLineDash([]);
    b11_screwSide(-z, B11_SIDE.boardBot, OWN_M2.len, { hi: front && hiFront ? hiFront : null });   /* the M2 × 5, its head under the board */
  }
  ga(1);
}
S({
  id: 'b11_inserts', ch: 'own', theme: 'paper', title: 'Brass inserts: the same fit every time', settle: 11, ideas: [101, 9],
  replaces: ['own_insert'], src: ['ownBrock', 'ownCovestro', 'b11Brock'],
  answers: [
    ['Brief: the second drive in plastic cuts a new thread; in brass it follows the same one', 'One pointer drives both joints in, backs them out and drives them in again 2° off (' + B11I.aside.toFixed(2) + ' mm at the plastic joint\'s tip, about two hairs: ' + (OWN_M2.len - B11_RIVAL_BT).toFixed(1) + ' mm of thread × sin 2°): the carbon-filled boss is left with a second, red thread beside the first; the screw in the brass insert runs down the same thread.'],
    ['Brief and F21.5: 70 % → 0 % chance the joint feels different', 'The verdict counts 70 % down to 0 %; the bars under it give ABS 90 %, carbon-filled 70 %, brass 0 % (brass 0 % from Brock\'s experience, F21.3).'],
    ['F2.01: "how metal threaded inserts increase longevity"', 'Longevity is the next slide, b11_wear, as two measured results side by side: a brass insert keeps 98.6 % of its pull strength after 20 heavy pulls; screws straight into plastic keep 82.9 % (and 43.3 %) of their undo torque after re-assembly.'],
    ['F2.01: "increase chances of tolerances be correct when assembled the first time, show chances of getting tolerances right"; F21.12: first assembly in words', 'In words, no number until it is simulated (F21.12): "Right the first time, too: the thread is finished in brass before the screw ever meets it, so no hand can start it crooked."'],
    ['F2.01: "chances of it feeling different after unscrewing it (it should be like a 90% chance for abs plastic, and slightly lower for carbon filled plastic, which be the other material you\'re comparing to)"', 'Bars: ABS 90 %, carbon-filled 70 %, brass 0 %. The joint drawn beside brass is the carbon-filled one, named on its panel, and the verdict compares those two.'],
    ['F2.08: the screws "need a massive revamp to look proper"', 'Both joints are drawn from the 3D model\'s exact M2 head, combination recess, thread and knurled insert, in section, at the board\'s front boss.']
  ],
  draw: t => {
    const Q = B11I, P = b11_inPose(t);
    header(t, 'Brass inserts: the same fit every time');
    captions(t, [[0.5, 'Screwed straight into plastic, a screw cuts its own thread. Driven in again a hair off, it cuts a second one beside the first.'], [4.6, 'A brass insert brings its thread finished, so the screw can only follow it: the joint closes the same way every time.']]);
    /* where: Theseus's front board boss on the simplified mouse; the push-in; then most mice's joint slides in beside it */
    const kS = ep(t, Q.split[0], Q.split[1], E.cam), y0 = 286, h0 = 640;
    const boxTh = [lerp(80, 650, kS), y0, lerp(1100, 530, kS), h0], boxRv = [80, y0, lerp(0, 530, kS), h0];
    const fz = B11_SIDE.screwsZ[0], focus = [-fz - 6, -13.2, 12, 20.4];
    const kj = ep(t, 0.95, 1.45);
    const est = establish(t, 0, boxTh, { view: 'left', hi: { board: 'ink' }, focus, hold: 0.45, dur: 1.0, fade: 0.25, dimFill: 0.6, locator: 'tr', locW: 150,
      draw: () => b11_bossesSide(1 - kj, C.ink) });
    const c = est.cam, bit = ep(t, Q.d1[0] - 0.4, Q.d1[0]), turn = t * 1.1;
    const joint = (kind, box) => { let o = {}; const Pk = b11_inPose(t, kind === 'insert' ? OWN_SEAT : OWN_M2.len - B11_RIVAL_BT); withCam(c, box, () => { o = part(-fz, -B11_SIDE.boardTop, 1, () => b11_jointMM({ kind, rival: kind !== 'insert', tip: Pk.tip, pass: Pk.pass, reach1: Pk.reach1, reach2: Pk.reach2, tilt: Q.tilt, ph2: Q.ph2, recut: kind === 'cf' ? ep(t, Q.d2[0] + 0.9, Q.d2[1] + 0.2) : 0, bit: { a: bit, turn: P.dir ? turn * P.dir : 0 }, hole: C.bg, crop: 5.4 }), { rot: Math.PI, alpha: kj }) || {}; }); return o; };
    const Rj = joint('insert', boxTh), L = kS > 0.001 ? joint('cf', boxRv) : {};
    /* the panels, named at the top, the divider between */
    const kl = ep(t, Q.split[1] - 0.25, Q.split[1] + 0.15);
    if (kS > 0.01) {
      line(boxTh[0] - 20, y0, boxTh[0] - 20, y0 + h0 * kS, { color: C.hair, w: 1.5 });
      ltag(boxRv[0] + 20, y0 + 30, 'Straight in', 'Carbon-filled plastic', { a: kl, size: 22, color: C.mute, vcolor: C.secondText });
      ltag(boxTh[0] + 20, y0 + 30, 'Theseus', 'A brass insert', { a: kl, size: 22, color: C.heroText, vcolor: C.heroText });
    }
    /* the hand on each driver: the pointer at the bit, turning it in, out, and in again */
    const handAt = (o, dx) => o.axisTop ? [o.axisTop[0] + dx, o.axisTop[1] + 112] : null;
    const ka = ep(t, Q.d1[0] - 0.35, Q.d1[0] - 0.05) * (1 - ep(t, Q.d2[1] + 0.2, Q.d2[1] + 0.5));
    for (const o of [L, Rj]) { const p = handAt(o, 26); if (p && ka > 0.01) { cursorPtr(p[0], p[1], { a: ka, grab: true }); if (P.dir) { const cx = p[0] - 26, cy = p[1] - 26; G.save(); G.globalAlpha = ka; G.strokeStyle = C.mute; G.lineWidth = 2.5; G.beginPath(); G.ellipse(cx, cy, 44, 11, 0, P.dir > 0 ? 0.35 : Math.PI - 0.35, P.dir > 0 ? Math.PI - 0.35 : 0.35, P.dir < 0); G.stroke(); G.restore(); } } }
    /* the step in play, under the panels' names */
    const sx = 100, sy = y0 + 72, step = P.step;
    if (step === 0 && kS > 0.5) text('Closed: the screw drives in', sx, sy, { role: 'small', size: 25, weight: 700, color: C.ink2, alpha: ep(t, Q.d1[0], Q.d1[0] + 0.3) * (1 - ep(t, Q.out[0] - 0.2, Q.out[0])) });
    if (step === 1) text('Opened: it backs out', sx, sy, { role: 'small', size: 25, weight: 700, color: C.ink2, alpha: ep(t, Q.out[0], Q.out[0] + 0.3) * (1 - ep(t, Q.d2[0] - 0.2, Q.d2[0])) });
    if (step === 2) text('Closed again, 2° off', sx, sy, { role: 'small', size: 25, weight: 700, color: C.red, alpha: ep(t, Q.d2[0], Q.d2[0] + 0.3) });
    scaleNote(sx, sy + 36, B11I.aside.toFixed(2) + ' mm aside, about two hairs', { lead: 'At the tip:', t, t0: Q.d2[0] + 0.3, size: 23 });
    /* what each joint is left with: a line at the foot of each panel, a mark on the thread */
    const k2 = ep(t, Q.d2[0] + 1.0, Q.d2[0] + 1.3), k3 = ep(t, Q.d2[0] + 1.2, Q.d2[0] + 1.5);
    if (L.recutPt && k2 > 0) { circle(L.recutPt[0], L.recutPt[1], 5, { fill: C.red, alpha: k2 }); circle(L.recutPt[0], L.recutPt[1], 12, { color: C.red, w: 1.6, alpha: 0.5 * k2 });
      text('A second thread: a new tension', boxRv[0] + 20, y0 + h0 - 22, { role: 'small', size: 23, weight: 700, color: C.red, alpha: k2, t, t0: Q.d2[0] + 1.0, cps: 90 }); }
    if (Rj.insert && k3 > 0) { circle(Rj.insert[0], Rj.insert[1], 5, { fill: C.hero, alpha: k3 }); circle(Rj.insert[0], Rj.insert[1], 12, { color: C.hero, w: 1.6, alpha: 0.5 * k3 });
      text('The same thread, the same joint', boxTh[0] + 20, y0 + h0 - 22, { role: 'small', size: 23, weight: 700, color: C.heroText, alpha: k3, t, t0: Q.d2[0] + 1.2, cps: 90 }); }
    /* the right: the verdict, the three joints, the first fit in words */
    const cx = 1240;
    verdict(t, Q.verdict, cx, 470, { from: 70, to: 0, unit: '%', label: 'Chance the joint feels different after a re-screw', better: 'lower', who: ['Straight into carbon-filled', 'Theseus'], net: false, size: 150, maxW: 600 });
    own_bars(t, Q.verdict + 1.4, cx, 600, RM - cx, [
      { label: 'Straight into ABS', v: OWN_FEEL.abs, s: OWN_FEEL.abs + ' %', kind: 'comp' },
      { label: 'Straight into carbon-filled', v: OWN_FEEL.cf, s: OWN_FEEL.cf + ' %', kind: 'second' },
      { label: 'Brass heat-set insert', v: OWN_FEEL.insert, s: OWN_FEEL.insert + ' %', kind: 'hero' }
    ], { max: 100, title: 'After one re-screw', better: 'Lower is better', rh: 74 });
    text('Right the first time, too: the thread is finished in brass before the screw ever meets it, so no hand can start it crooked.', cx, 880, { role: 'small', size: 25, weight: 650, color: C.ink2, maxW: RM - cx, lh: 1.3, t, t0: Q.verdict + 2.2, cps: 90 });
    source(t, 'Brock\'s estimates: a joint screwed straight into ABS feels different after one re-screw 90 % of the time, carbon-filled plastic 70 %; in brass a machine screw can only follow its thread. Covestro: a re-assembled plastic joint holds only if the screw finds its original thread, by hand.', { t0: 1.0, maxW: 1100 });
  }
});

/* ============================== b11_wear: thread wear (replaces own_life) ============================== */
/* Two joints, one row each, read left to right: where the joint is, what happens to its thread, the number. Plastic is
   re-assembled ten times (each pass shaves the flank; the dial follows Cumbicus 2023's measured points); the brass insert is
   pulled twenty times to 80 % of what breaks it, then measured (3D People 2022). Different tests: each is named on its row. */
const B11W = { a0: 0.6, aDur: 0.4, p0: 4.95, pDur: 0.1, meas: 7.0, verdict: 7.45, bars: 8.1, human: 8.9 };
/* the two results as shown: each rounded against Theseus (higher is better: the plastic's up, the brass's down) */
const B11W_SHOW = { pf30: Math.ceil(B11.pf30[3][1] * 10 - 1e-9) / 10, dpt5: Math.ceil(B11.dpt[1][1] * 10 - 1e-9) / 10, brass: Math.floor(B11.brass20 * 10 + 1e-9) / 10 };
/** a plain measured result, no before → after (two different tests can't share an arrow: M-b11-3, POLISH b11_wear): who and
   what over it, the figure, what it measures under it. Theseus's in its gradient, the other in ink. o = { who, what, v
   (number), size, hero, sub, maxW } */
function b11_result(t, t0, x, y, o) {
  const a = ep(t, t0, t0 + 0.45); if (a <= 0.003) return;
  const z = o.size || 100, hero = !!o.hero, dy = (1 - E.out3(clamp((t - t0) / 0.45))) * 12;
  G.save(); G.translate(0, dy);
  ltag(x, y - Math.round(z * 0.78) - 26, o.who, o.what, { size: 21, color: hero ? C.heroText : C.mute, vcolor: hero ? C.heroText : C.secondText, a });
  rich([{ s: o.v.toFixed(1), role: 'd1', size: z, weight: 800, track: -0.03, color: hero ? C.heroText : C.ink2, grad: hero ? C.heroGrad : null, tnum: true },
    { s: '%', font: 'disp', size: Math.round(z * 0.55), weight: 700, color: hero ? C.heroText : C.mute, grad: hero ? C.heroGrad : null, gap: Math.round(z * 0.16), caps: false }], x, y, { alpha: a });   /* a space before %, as the kit's verdict */
  if (o.sub) text(o.sub, x, y + 42, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: a, maxW: o.maxW || 600, lh: 1.25 });
  G.restore();
}
function b11_pf30(i) {   /* torque to undo the joint, % of the torque that closed it, at assembly i (1..10), PF-30 */
  const P = B11.pf30; if (i <= P[0][0]) return P[0][1];
  for (let j = 1; j < P.length; j++) if (i <= P[j][0]) return lerp(P[j - 1][1], P[j][1], (i - P[j - 1][0]) / (P[j][0] - P[j - 1][0]));
  return P[P.length - 1][1];
}
S({
  id: 'b11_wear', ch: 'own', theme: 'night', title: 'Thread wear: brass keeps its hold', settle: 11, ideas: [101],
  replaces: ['own_life'], src: ['b11Cumbicus', 'own3dp', 'ownPemM2'],
  answers: [
    ['Brief: brass keeps 98.6 % of its hold after 20 heavy loads; screws straight into plastic keep 82.8 % and 43.3 % after re-assembly: both tests, labelled (F21.12 "Keep both")', 'Two rows, each named with its own test: plastic re-assembled ten times (the dial follows Cumbicus 2023: ' + B11W_SHOW.pf30.toFixed(1) + ' % for the better screw by the 10th, 82.84 rounded up, never in Theseus\'s favour), the brass insert pulled 20 times to 80 % of its failure force, then measured: ' + B11W_SHOW.brass.toFixed(1) + ' %. On the right the two results stand side by side, each with its test, under "Hold kept, two different tests (higher is better)": no arrow joins them (they are different measures); the other screw\'s ' + B11W_SHOW.dpt5.toFixed(1) + ' % by the 5th is said under the plastic\'s, and its 58.1 % by the 10th is in the source.'],
    ['F2.01: "how metal threaded inserts increase longevity"', 'Each plastic re-assembly visibly shaves the thread\'s flank (red slivers pile up, magnified) while the dial drops; the brass thread is never re-cut and the insert\'s grip survives the pulls. The payoff: two measured results, each named (plastic ' + B11W_SHOW.pf30.toFixed(1) + ' % of its undo torque after 10 re-assemblies; brass ' + B11W_SHOW.brass.toFixed(1) + ' % of its pull strength after 20 heavy pulls), Theseus\'s the larger.'],
    ['F2.08: the screws "need a massive revamp to look proper"', 'Both joints are the 3D model\'s M2 joints in section (as on b11_inserts); the magnified flank is the thread-forming profile, the brass side the ISO thread.'],
    ['What moved from own_life', 'The insert\'s half-section with its dimensions and knurl callouts is out: the insert is drawn in every joint now, and its pull strength is what the brass row tests. New: the human scale (one M2 insert holds 255 N in ABS, a 26 kg suitcase, PEM) and the hand-off to the battery.']
  ],
  draw: t => {
    const W = B11W;
    header(t, 'Thread wear: brass keeps its hold');
    captions(t, [[0.4, 'Each re-assembly into plastic comes back a little off the old thread and shaves its flank: the joint holds less every time.'], [W.p0 - 0.1, 'In brass the screw only follows its thread, and the insert\'s grip in the plastic outlasts 20 pulls to 80 % of what breaks it.']]);
    const rows = [{ y: 284, kind: 'cf' }, { y: 606, kind: 'insert' }], rh = 300, x0 = LM, x1 = 1140;
    /* which assembly / pull we are on */
    const ai = clamp(Math.floor((t - W.a0) / W.aDur) + 1, 0, 10), ak = ai >= 1 ? ep(t, W.a0 + (ai - 1) * W.aDur, W.a0 + (ai - 1) * W.aDur + W.aDur * 0.75, E.io3) : 0;
    const pEnd = W.p0 + 20 * W.pDur, pj = clamp(Math.floor((t - W.p0) / W.pDur) + 1, 0, 20), pk = pj >= 1 && t < pEnd ? Math.sin(Math.PI * clamp((t - W.p0 - (pj - 1) * W.pDur) / W.pDur)) : 0;
    const act0 = 1 - 0.5 * ep(t, W.p0 - 0.3, W.p0), act1 = 0.5 + 0.5 * ep(t, W.p0 - 0.3, W.p0);
    rows.forEach(R => {
      const plast = R.kind === 'cf', A = plast ? act0 : act1, y = R.y, col = plast ? C.secondText : C.heroText;
      demoWindow(x0, y, x1 - x0, rh, 1);
      ltag(x0 + 24, y + 34, plast ? 'Straight in' : 'Theseus', plast ? 'Glass-filled PEI, re-assembled 10 times' : 'Brass insert, pulled 20 times to 80 % of failure', { size: 21, color: plast ? C.mute : C.heroText, vcolor: col, a: A });
      /* where: the joint at the board's boss, in section, as on the slide before */
      G.save(); G.beginPath(); G.rect(x0 + 2, y + 52, 300, rh - 54); G.clip();
      const J = part(x0 + 160, y + (plast ? 216 : 178), 30, () => b11_jointMM({ kind: R.kind, rival: R.kind !== 'insert', tip: plast ? OWN_M2.len - B11_RIVAL_BT : OWN_SEAT, pass: 1, reach1: plast ? OWN_M2.len - B11_RIVAL_BT : OWN_SEAT, reach2: 0, tilt: 0, ph2: 0, recut: 0, bit: { a: 0 }, hole: C.panel, crop: 5.4 }), { rot: Math.PI, alpha: A }) || {};
      G.restore();
      /* the loupe: a ring on the thread, a line to the magnified flank */
      const ring = plast ? J.recutPt || J.mouth : J.insert;
      const mx = x0 + 330, mw = 470, my = y + 60, mh = 196;
      if (ring) { circle(ring[0], ring[1], 15, { color: col, w: 2, alpha: A }); line(ring[0] + 15, ring[1], mx, my + mh / 2, { color: col, w: 1.5, alpha: 0.6 * A, dash: [5, 5] }); }
      rr(mx, my, mw, mh, 6, C.bg, col, 1.5, A);
      G.save(); G.beginPath(); G.rect(mx + 1, my + 1, mw - 2, mh - 2); G.clip();
      if (plast) {
        const n = ai >= 2 ? ai - 2 : 0, k = ai >= 2 ? ak : 0;
        part(mx + mw / 2, my + mh * 0.5, 180, () => b11_flankN(k >= 1 ? n + 1 : n, k >= 1 ? 0 : k, { phs: 0.5 }), { alpha: A });
      } else part(mx + mw / 2, my + mh * 0.5, 230, () => own_isoMM({ n: 4.6 }), { alpha: A });
      G.restore();
      text(plast ? 'Magnified: shaved slivers in red' : 'Magnified: titanium on brass, never re-cut', mx, my + mh + 26, { role: 'label', size: 20, color: C.mute, alpha: A });
      /* the pull: the screw pulled down, out of the boss */
      if (!plast && J.axisTop && pk > 0.01) forceArrow(J.axisTop[0], Math.min(y + rh - 8, J.axisTop[1] + 30 + 34 * pk), Math.PI / 2, 22 + 34 * pk, { k: 1, color: C.ink, w: 5, hs: 15, alpha: A });
      /* the number: the count, a dial, what it reads */
      const dx = x0 + 930, dy = y + 150;
      if (plast) {
        const v = ai < 1 ? 100 : ai < 2 ? 100 : lerp(b11_pf30(ai - 1), b11_pf30(ai), ak);
        text(ai >= 1 ? 'Assembly ' + ai + ' of 10' : 'First assembly', dx, y + 34, { role: 'small', size: 22, weight: 700, color: ai >= 2 ? C.red : C.ink2, align: 'center', alpha: A });
        b11_dial(dx, dy, 76, v, { col: C.second, lost: true, a: A });
        /* the plastic's hold, rounded up (a rival's higher-is-better figure: never rounded in Theseus's favour) */
        text((Math.ceil(v * 10 - 1e-9) / 10).toFixed(1) + ' %', dx, dy + 62, { role: 'num', size: 34, weight: 760, color: C.ink, align: 'center', alpha: A });
        text('Torque to undo it, of what closed it', dx, dy + 110, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: A, maxW: 236, lh: 1.15 });
      } else {
        const kM = ep(t, W.meas, W.meas + 0.6, E.io3), v = lerp(100, B11.brass20, kM), done = t >= W.meas;
        text(pj >= 1 ? 'Pull ' + pj + ' of 20' : 'Then: 20 heavy pulls', dx, y + 34, { role: 'small', size: 22, weight: 700, color: pj >= 1 ? C.heroText : C.ink2, align: 'center', alpha: A });
        b11_dial(dx, dy, 76, v, { col: C.hero, lost: done, a: A * (done ? 1 : 0.45) });
        text(done ? v.toFixed(1) + ' %' : 'after pull 20', dx, dy + 62, { role: done ? 'num' : 'small', size: done ? 34 : 20, weight: done ? 760 : 650, color: done ? C.heroText : C.mute, align: 'center', alpha: A });
        text('Pull strength kept', dx, dy + 110, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: A, maxW: 236 });
      }
    });
    /* right: the two results, each named with its own test, side by side in one column (two measures, so no before → after
       arrow and nothing struck: M-b11-3, POLISH b11_wear); Theseus's the larger; then the human scale */
    const cx = 1220, cw = RM - cx, SW = B11W_SHOW;
    text('Hold kept, two different tests (higher is better)', cx, 330, { role: 'label', size: 22, color: C.mute, alpha: ep(t, W.verdict, W.verdict + 0.4), maxW: cw });
    b11_result(t, W.verdict, cx, 470, { who: 'Straight in', what: 'Screw in glass-filled PEI', v: SW.pf30, size: 76, maxW: cw,
      sub: 'Torque to undo it, after 10 re-assemblies (the better of two screws; the other kept ' + SW.dpt5.toFixed(1) + ' % by the 5th)' });
    b11_result(t, W.verdict + 0.4, cx, 712, { who: 'Theseus', what: 'Brass insert', v: SW.brass, size: 120, hero: true, maxW: cw,
      sub: 'Pull strength, after 20 pulls to 80 % of what breaks it' });
    scaleNote(cx, 846, 'holds 255 N in ABS, a 26 kg suitcase', { lead: 'One M2 insert', t, t0: W.human, size: 22 });
    text('Open it as often as you need: first, the battery.', cx, 892, { role: 'small', size: 23, weight: 700, color: C.ink2, alpha: ep(t, W.human + 0.6, W.human + 1.0), maxW: cw });
    source(t, 'Plastic: Cumbicus et al. 2023, 5 mm thread-forming screws in 30 % glass-fibre PEI, assembled ten times; the torque to undo each joint against the torque that closed it, lost: PF-30 11.95 % by the 3rd, 15.31 % by the 5th, 17.16 % by the 10th; DELTA PT 56.73 % by the 5th, 41.93 % by the 10th (kept figures on screen rounded against Theseus). Brass: 3D People 2022, M2 to M5 inserts in four printed plastics, 20 loads to 80 % of the failure force, then pulled to failure: 1.37 % weaker on average. PEM: IUTF-M2 in ABS, 255 N.', { t0: 1.0, maxW: 1760 });
  }
});

/* ============================== b11_battplug: a battery you can unplug (replaces ownbatt; F26.4) ============================== */
/* A 2 × 2 job: the battery (glued and pried, or held in two bands) and its plug (a top-entry plug pulled by its wires
   levers its header off its pads; Theseus's side-entry plug, turned to face the back, slides straight out along the
   board). The tape panel is the classroom version of why the direction matters (3M: peel vs shear). */
const B11B = { heat: [0.5, 1.4], pry: [1.3, 2.9], slide: [3.2, 4.3], tug: [4.6, 6.0], pull: [6.3, 7.1], tape: 4.4, verdict: 7.6, eu: 8.4 };
/** a header seen from above (F26.4): the old one faced the left side wall, the new one faces the back; k turns it 90° */
function b11_headerTop(x, y, s, k, a = 1) {
  G.save(); G.globalAlpha = a; G.translate(x, y);
  /* the board's rear corner and the tail, as a frame */
  G.strokeStyle = inkA(0.35); G.lineWidth = 1.5; G.setLineDash([5, 4]); G.beginPath(); G.moveTo(-3.2 * s, -2.6 * s); G.lineTo(3.2 * s, -2.6 * s); G.stroke(); G.setLineDash([]);
  text('Tail', 0, -2.95 * s, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: a });
  G.rotate(-Math.PI / 2 * (1 - k));
  /* the housing (4.25 × 3 mm), its open face (where the plug goes in) toward the tail when k = 1 */
  G.fillStyle = TH ? '#FFFFFF' : '#D8D8D8'; G.strokeStyle = 'rgba(16,17,20,0.6)'; G.lineWidth = 1.2;
  G.beginPath(); G.rect(-2.125 * s, -1.5 * s, 4.25 * s, 3 * s); G.fill(); G.stroke();
  G.fillStyle = TH ? '#C8C8C8' : '#8A8A8A'; G.fillRect(-1.8 * s, -1.5 * s, 3.6 * s, 0.7 * s);
  G.restore();
}
S({
  id: 'b11_battplug', ch: 'own', theme: 'paper', title: 'A battery you can unplug', settle: 11, ideas: [71, 74],
  replaces: ['ownbatt'], src: ['b11GpxBatt', 'b11Mo2', 'b11Fire', 'b113m', 'ownEuBatt', 'ownJstSh', 'b11Brock'],
  answers: [
    ['Brief: the side-entry battery plug, turned to face the back so it can be pulled out properly (F26.4): no tools, no heat', 'Plug row: Theseus\'s side-entry plug faces the back (a top view turns it 90° from the side wall) and a pull along the board slides it straight out; the rival\'s top-entry plug, pulled by its wires, levers its header and lifts a pad (red). Battery row: no heat, no prying: it slides out of two silicone bands.'],
    ['F26.4: "it\'s hard to access it when it faces towards the left instead of the back"', 'Shown as the turn itself (old: facing the side wall, dashed; new: facing the tail) before the pull.'],
    ['#71: the JST connector turned so customers can replace the battery themselves; line 614: silicone bands ("adhesive usually gets ruined")', 'The bands hold the pouch; the glued pouch beside it is heated and pried, and bends where a puncture can start a fire (iFixit).'],
    ['What moved from ownbatt', 'The paper battery cover (#74) moves to b11_board, where the underside is shown; the EU removability rule stays here as one line.']
  ],
  draw: t => {
    const Q = B11B;
    header(t, 'A battery you can unplug');
    captions(t, [[0.3, 'Logitech glues the G Pro X Superlight\'s battery in: heat it, pry it off, and try not to bend the pouch. The plug is pulled out by its wires.'], [Q.slide[0] - 0.1, 'Theseus holds its battery in two silicone bands, and its plug faces the back: pull it straight out, slide the battery free.']]);
    const cw = 520, gx = [LM, LM + 540], ry = [286, 606], rh = [300, 280];
    const cells = [[0, 0, 'G Pro X Superlight', 'Glued to the shell'], [1, 0, 'Theseus', 'Held in two bands'], [0, 1, 'G Pro X Superlight', 'Pulled by its wires'], [1, 1, 'Theseus', 'A plug that faces the back']];   /* named, from iFixit's guide (R2-b11-2) */
    cells.forEach(([c, r, l, v]) => { demoWindow(gx[c], ry[r], cw, rh[r], 1); ltag(gx[c] + 22, ry[r] + 32, l, v, { size: 21, color: c ? C.heroText : C.mute, vcolor: c ? C.heroText : C.ink2 }); });
    /* where: a small locator on Theseus's battery cell */
    locator(t, 0, gx[1] + cw - 118, ry[0] + 22, 96, 'left', msBox('left', 'battery'), { hi: { battery: 'hero' } });
    /* ---- the battery row ---- */
    const heat = ep(t, Q.heat[0], Q.heat[1]) * (1 - ep(t, Q.pry[1], Q.pry[1] + 0.6)), pry = ep(t, Q.pry[0], Q.pry[1], E.io3), sl = ep(t, Q.slide[0], Q.slide[1], E.io3);
    const bs = 12.5, bxL = gx[0] + cw / 2 + 40, bxR = gx[1] + cw / 2 + 50, by = ry[0] + 130;
    let gl = {}, bd = {};
    G.save(); G.beginPath(); G.rect(gx[0] + 2, ry[0] + 50, cw - 4, rh[0] - 52); G.clip();
    gl = part(bxL, by, bs, () => b11_battSecMM('glue', pry, { heat })) || {};
    G.restore();
    G.save(); G.beginPath(); G.rect(gx[1] + 2, ry[0] + 50, cw - 4, rh[0] - 52); G.clip();
    bd = part(bxR, by, bs, () => b11_battSecMM('bands', sl * 0.75)) || {};
    G.restore();
    /* the heat gun, then the spudger at the pouch's end */
    if (t > Q.heat[0] - 0.2 && t < Q.pry[1] + 0.6) { const ka = ep(t, Q.heat[0] - 0.2, Q.heat[0]) * (1 - ep(t, Q.pry[0], Q.pry[0] + 0.3)); if (ka > 0.01) part(bxL - 120, by - 150, 2.1, () => b11_toolMM('heat', { hot: heat, t }), { alpha: ka, rot: 0.55 }); }
    if (gl.pry && t > Q.pry[0] - 0.3) { const ka = ep(t, Q.pry[0] - 0.3, Q.pry[0]) * (1 - ep(t, Q.pry[1] + 0.8, Q.pry[1] + 1.1)), ang = -0.35 - 0.25 * pry, L = B11_TOOL.spudger.len * 2.2; if (ka > 0.01) part(gl.pry[0] - L * Math.cos(ang), gl.pry[1] - L * Math.sin(ang), 2.2, () => b11_toolMM('spudger', { t }), { alpha: ka, rot: ang }); }
    const kb = ep(t, Q.pry[1] - 0.4, Q.pry[1]);
    text('Heat, then pry: a bent pouch can catch fire', gx[0] + 22, ry[0] + rh[0] - 26, { role: 'small', size: 22, weight: 700, color: C.red, alpha: kb, maxW: cw - 40 });
    /* Theseus: the pointer draws the battery out along its length */
    if (bd.slide && t > Q.slide[0] - 0.4 && t < Q.slide[1] + 0.5) cursorPtr(bd.slide[0] + 8, bd.slide[1] + 10, { a: ep(t, Q.slide[0] - 0.4, Q.slide[0] - 0.1) * (1 - ep(t, Q.slide[1], Q.slide[1] + 0.4)), grab: t > Q.slide[0] });
    text('No glue: it slides out of its bands', gx[1] + 22, ry[0] + rh[0] - 26, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ep(t, Q.slide[1] - 0.3, Q.slide[1]), maxW: cw - 40 });
    /* ---- the plug row ---- */
    const tug = ep(t, Q.tug[0], Q.tug[1], E.io3), pl = ep(t, Q.pull[0], Q.pull[1], E.io3);
    const ps = 17, pyL = ry[1] + 196, pyR = ry[1] + 196;
    let pR = {}, pT = {};
    G.save(); G.beginPath(); G.rect(gx[0] + 2, ry[1] + 50, cw - 4, rh[1] - 52); G.clip();
    pR = part(gx[0] + 330, pyL, ps, () => b11_plugMM('top', tug)) || {};
    G.restore();
    G.save(); G.beginPath(); G.rect(gx[1] + 2, ry[1] + 50, cw - 4, rh[1] - 52); G.clip();
    pT = part(gx[1] + 370, pyR, ps, () => b11_plugMM('side', pl)) || {};
    G.restore();
    if (pR.grab && t > Q.tug[0] - 0.4 && t < Q.tug[1] + 0.6) cursorPtr(pR.grab[0], pR.grab[1], { a: ep(t, Q.tug[0] - 0.4, Q.tug[0] - 0.1) * (1 - ep(t, Q.tug[1] + 0.2, Q.tug[1] + 0.6)), grab: t > Q.tug[0] });
    if (pR.pad) faultTag(t, Q.tug[0] + 0.9, pR.pad, 'The pad peels up', { to: [pR.pad[0] - 24, pR.pad[1] + 44], side: 'l', maxW: 280 });
    if (pT.grab && t > Q.pull[0] - 0.4 && t < Q.pull[1] + 0.6) cursorPtr(pT.grab[0], pT.grab[1], { a: ep(t, Q.pull[0] - 0.4, Q.pull[0] - 0.1) * (1 - ep(t, Q.pull[1] + 0.2, Q.pull[1] + 0.6)), grab: t > Q.pull[0] });
    /* F26.4: the header turned 90°, from the side wall to the back, before the pull */
    const kt = ep(t, Q.tug[1] - 0.2, Q.pull[0] - 0.1, E.io3);
    b11_headerTop(gx[1] + 70, ry[1] + 104, 11, kt, ep(t, Q.tug[0], Q.tug[0] + 0.4));
    text(kt < 0.5 ? 'Seen from above: it faced the side wall' : 'Turned 90°: it faces the back', gx[1] + 120, ry[1] + 110, { role: 'label', size: 20, color: kt < 0.5 ? C.mute : C.heroText, alpha: ep(t, Q.tug[0], Q.tug[0] + 0.4), maxW: 380 });
    text('Pulled straight back, along the board', gx[1] + 22, ry[1] + rh[1] - 26, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ep(t, Q.pull[1] - 0.3, Q.pull[1]), maxW: cw - 40 });
    /* right: why the direction matters (tape), the verdict, the rule */
    const rx = 1220, rw = RM - rx, kt2 = ep(t, Q.tape, Q.tape + 0.4);
    if (kt2 > 0.003) { demoWindow(rx - 20, 286, rw + 20, 300, kt2); text('Why the direction matters: a strip of tape', rx, 318, { role: 'label', size: 20, color: C.mute, alpha: kt2 }); }
    b11_tape(t, Q.tape, rx, 330, rw, 250);
    verdict(t, Q.verdict, rx, 736, { from: 7, to: 1, label: 'Tools and supplies to change the battery', better: 'lower', who: ['Superlight', 'Theseus'], net: false, size: 110, maxW: rw });
    text('The one tool is the driver in the box. No heat, no solvent: what the EU asks of every portable battery from 18 February 2027.', rx, 824, { role: 'small', size: 22, weight: 650, color: C.ink2, maxW: rw, lh: 1.3, alpha: ep(t, Q.eu, Q.eu + 0.4) });
    source(t, 'G Pro X Superlight: iFixit\'s battery guide (adhesive: heat it and pry; the plug pulled "straight up"; tools: spudger, Phillips driver, tweezers, angled tweezers, iOpener or hair dryer, isopropyl alcohol, double-sided tape); Glorious Model O 2 Wireless (glued, "this will rip"); a punctured battery can catch fire (iFixit). Peel and shear: 3M. EU Regulation 2023/1542 Art. 11.', { t0: 1.0, maxW: 1760 });
  }
});

/* ============================== b11_board: screws from below, art on the board (replaces ownboard; F30.15) ============================== */
/* The mouse from below: the four screws back out with the driver, the board comes down, and its underside, the face you see
   with no bottom plate, turns out to be designed: the old board's artwork adapted to plan 5's outline (F30.15). */
const B11D = { lit: [0.3, 0.7], outs: [1.0, 1.45, 1.9, 2.35], out: 0.42, cross: [2.85, 3.45], tags: 3.8, rival: 0.4, verdict: 6.6, hand: 8.0 };
const B11_ART = { box: [LM, 286, 1060, 640] };
S({
  id: 'b11_board', ch: 'own', theme: 'night', title: 'Screws from below, art on the board', settle: 11, ideas: [54, 63, 74, 100],
  replaces: ['ownboard'], src: ['b11TpuV3', 'b11Brock', 'ownBrock'],
  answers: [
    ['Brief: the board comes out from below', 'The mouse from below: the four screws back out one by one with the driver (no skate touched), the board comes down; the rival column says what many mice ask first (Viper V3 Pro: skates, screws, clips, a cable, then the board\'s own screws inside), its first step drawn: the skates peel off its underside. Verdict: board screws you can reach from outside 0 → 4.'],
    ['Brief and F30.15: its underside artwork, the old design\'s, adapted ("i really liked the old designs artwork, you should try the match/adapt")', 'The board\'s underside as plan 5 draws it (H1: the old dark triangles, filleted, the gold clusters, the wordmark, the labels and the QR, fitted to the new outline), named part by part.'],
    ['#63 art on the PCB bottom; #100 ON/OFF; #74 the paper battery cover (moved here from ownbatt and ownsheet2)', 'Callouts: the gold triangles (#63), ON and OFF at the switch (#100), the QR to the web software; the laminated satin paper cover over the battery drawn and named on the mouse from below (#74: "battery exposed makes a mouse look like a prototype").'],
    ['F26.11: serials and engravings stay hidden', 'No serial and no shell engraving on screen; the board\'s silkscreen art is the board\'s own (F30.15).']
  ],
  draw: t => {
    const Q = B11D, Bx = B11_ART.box;
    header(t, 'Screws from below, art on the board');
    captions(t, [[0.3, 'Theseus has no bottom plate: four screws from below hold the board, and the driver reaches every one without lifting a skate.'], [Q.cross[1] + 0.1, 'So the underside of the board is the face you see, and it is drawn like one: the old board\'s artwork, fitted to the new outline.']]);
    /* the mouse from below, nose up, lit screws backing out, the paper cover over the battery */
    const kX = ep(t, Q.cross[0], Q.cross[1]);
    const outs = Q.outs.map(t0 => ep(t, t0, t0 + Q.out, E.io3));
    /* the push-in: the mouse grows until its board sits where the board's own drawing comes in (8.68 px/mm, centred) */
    const kZ = ep(t, Q.cross[0] - 0.25, Q.cross[1], E.cam), sArt = 8.68, bcx = 330 + 300, bcy = Bx[1] + 330, byK = -19.04 * MS_K.y;
    const sM = lerp(4.9, sArt, kZ), mx = lerp(Bx[0] + Bx[2] / 2, bcx, kZ), my = lerp(Bx[1] + Bx[3] / 2 + 6, bcy - byK * sArt, kZ);
    let P = {};
    if (kX < 1) {
      G.save(); G.beginPath(); G.rect(Bx[0], Bx[1] - 6, Bx[2], Bx[3] + 12); G.clip();
      part(mx, my, sM, () => {
        b11_underMM({ lit: ep(t, Q.lit[0], Q.lit[1]), outs });
        /* #74: laminated satin paper over the battery, behind the board */
        const B = MS_BATTERY; ga(1 - kX); G.beginPath(); pathRR(-(B[0] + B[2]) * MS_K.x, B[1] * MS_K.y, B[2] * MS_K.x, B[3] * MS_K.y, 2.2); G.fillStyle = '#E8E8E8'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = lw(1); G.stroke();
        G.save(); G.clip(); G.strokeStyle = 'rgba(255,255,255,0.7)'; G.lineWidth = lw(5); G.beginPath(); G.moveTo(-14, B[1] * MS_K.y + 30); G.lineTo(10, B[1] * MS_K.y - 2); G.stroke(); G.restore(); ga(1);
        P.cover = SP(-(B[0] + B[2] / 2) * MS_K.x, (B[1] + B[3] * 0.7) * MS_K.y);
        P.scr = B11_SCREWS_BOTTOM.map(([X, Z]) => SP(X * MS_K.x, -Z * MS_K.y));
      }, { alpha: 1 - kX });
      G.restore();
      /* the driver's pointer goes from screw to screw */
      if (P.scr) { const i = clamp(Math.floor((t - Q.outs[0] + 0.25) / 0.45), 0, 3), ka = ep(t, Q.outs[0] - 0.4, Q.outs[0] - 0.1) * (1 - ep(t, Q.outs[3] + Q.out, Q.outs[3] + Q.out + 0.3)); if (ka > 0.01) cursorPtr(P.scr[i][0] + 6, P.scr[i][1] + 8, { a: ka * (1 - kX), grab: true }); }
      const kPre = 1 - ep(t, Q.cross[0] - 0.55, Q.cross[0] - 0.2);
      if (P.cover && kPre > 0.01) callout(t, 0.9, P.cover, 'Laminated satin paper over the battery (#74)', { to: [P.cover[0] + 230, P.cover[1] + 40], side: 'r', color: C.mute, tcolor: C.ink2, maxW: 300, alpha: kPre });
      if (P.scr) text('Four turns each, skates untouched', P.scr[0][0] + 150, P.scr[0][1] - 40, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ep(t, Q.outs[3], Q.outs[3] + 0.3) * kPre });
    }
    /* the board, down and turned to the light: its underside, the old artwork on plan 5's outline */
    if (kX > 0.003) {
      const bw = 600, bh = Bx[3], bx0 = 330, by0 = Bx[1];
      G.save(); G.globalAlpha = kX; view3D('pcb', t, bx0, by0, bw, bh, { view: 'bottom', view2d: 'bottom', zoom: 1.45 }); G.restore();
      const A = B11_ART, ap = (fx, fy) => [bx0 + bw * fx, by0 + bh * fy];
      /* measured on the drawing (box fractions, re-measured 11:4x on the 10:20 plan-5 twin, R3-b11-1; and by P5 13:3x on H3's
         12:33 regen of the 0.6 mm two-layer board, from the settle frame's pixels): the mosaic (the dark triangles above the
         right-hand screws; the old point now sat beside the new bus routes), the QR (its right edge), the wordmark (its right
         end), ON/OFF, a gold triangle in the cluster (the nearest gold one; the old point fell between them). The QR's label
         above the wordmark's, so the two leaders don't cross */
      const tags = [
        [ap(0.683, 0.319), 'Dark triangles, filleted: the old board\'s art on plan 5\'s outline', [bx0 + 500, by0 + 200], 'r'],
        [ap(0.69, 0.685), 'QR: scan it for the web software', [bx0 + 500, by0 + 372], 'r'],
        [ap(0.60, 0.78), 'The wordmark', [bx0 + 500, by0 + 520], 'r'],
        [ap(0.342, 0.555), 'ON and OFF at the switch (#100)', [bx0 + 100, by0 + 300], 'l'],
        [ap(0.3245, 0.7941), 'Gold triangles (#63)', [bx0 + 100, by0 + 470], 'l']
      ];
      tags.forEach(([pt, lab, to, sd], i) => callout(t, Q.tags + i * 0.4, pt, lab, { to, side: sd, color: C.mute, tcolor: C.ink, maxW: sd === 'r' ? 300 : 260, size: 22 }));
    }
    /* right: what most mice ask first, the verdict, the hand-off */
    const rx = 1220 + 0, rw = RM - rx, kr = ep(t, Q.rival, Q.rival + 0.4);
    demoWindow(rx - 20, 286, rw + 20, 300, kr);
    ltag(rx, 318, 'Many mice', 'Razer Viper V3 Pro', { size: 21, color: C.mute, vcolor: C.secondText, a: kr });
    ['Peel the front and rear skates', 'Undo the screws beneath them', 'Pop two side clips, free a cable', 'Then the board\'s four screws, inside'].forEach((s2, i) => {
      const k = ep(t, Q.rival + 0.3 + i * 0.25, Q.rival + 0.6 + i * 0.25);
      text((i + 1) + '', rx, 372 + i * 50, { role: 'small', size: 22, weight: 800, color: C.mute, alpha: k });
      text(s2, rx + 32, 372 + i * 50, { role: 'small', size: 22, weight: 650, color: i === 3 ? C.red : C.ink2, alpha: k, maxW: 420 });
    });
    /* its first step, drawn in the same view as Theseus's (R2-b11-3): the rival from below, its skates peeling off to reach
       the screws (TechPowerUp: Torx T6 beneath the front and rear skates); the count isn't given, so no screws are drawn */
    { const kp = ep(t, Q.rival + 0.6, Q.rival + 1.5, E.io3), sR = 1.8, cxm = rx + rw - 64, cym = 436;
      part(cxm, cym, sR, () => {
        mouseRival('bottom', { hide: ['skates'], alpha: kr });
        const V = rvView('bottom'), sk = V.parts.skates && V.parts.skates.solid, cs = rvCols();
        if (sk) [[-1, -51.3], [1, 51.3]].forEach(([sg, y0]) => {
          G.save(); G.globalAlpha = kr; G.beginPath(); G.rect(-45, sg < 0 ? -75 : 0, 90, 75); G.clip();
          /* the bare bed it leaves, in the fault's red */
          G.save(); G.setLineDash([lw(4), lw(3)]); G.strokeStyle = C.red; G.lineWidth = lw(1.4); G.globalAlpha = kr * kp; G.stroke(sk); G.restore();
          /* the skate, peeled out and turned off its bed */
          G.translate(7 * kp, y0 + sg * 9 * kp); G.rotate(sg * 0.2 * kp); G.translate(0, -y0);
          G.fillStyle = cs.solid; G.fill(sk); G.strokeStyle = cs.line; G.lineWidth = lw(1.3); G.stroke(sk);
          G.restore();
        });
      });
      text('New skates every time', rx + rw - 8, 578, { role: 'label', size: 19, color: C.red, align: 'right', alpha: kr * kp }); }
    verdict(t, Q.verdict, rx, 760, { from: 0, to: 4, label: 'Board screws you can reach from outside', better: 'higher', who: ['Viper V3 Pro', 'Theseus'], net: false, size: 110, maxW: rw });
    text('Back in with the same four turns.', rx, 858, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: ep(t, Q.hand, Q.hand + 0.4), maxW: rw, lh: 1.3 });
    source(t, 'Viper V3 Pro: TechPowerUp\'s review (Torx T6 screws beneath the front and rear skates, two clips at the sides, a cable between the shells, four screws hold the board to the bottom shell). Theseus: Brock\'s doc #54 (the board\'s screws inserted from the bottom), #63 (art on the board\'s underside), #74 (the paper cover); the art and outline: plan 5 (H1).', { t0: 1.0, maxW: 1760 });
  }
});

/* ============================== b11_box: in the box (replaces box, ownsheet1, ownsheet2) ============================== */
/* The envelope opens and the trifold stands up (own_trifold, the old drawing, started 1.2 s in so frame one already shows the
   envelope): setup, spares, repair; the driver slides out beside it; then the skate file and the colourways. On the right,
   what each flagship's box lists, against Theseus's. */
const B11X = { tri: 1.2, drv: [3.2, 3.8], dxf: 4.4, col: 5.2, table: 0.3, verdict: 6.6, hand: 8.4 };
const B11_BOXROWS = [
  { name: 'Viper V4 Pro', v: [1, 1, 1, 0, 0, 0] },
  { name: 'G Pro X Superlight 2', v: [1, 1, 1, 0, 0, 0] },
  /* the X3 (FILLS INT-b11_box): ProSettings' X3 list (receiver and adapter, grip tape, a POWERPLAY puck with a foot: no spare
     skates); Logitech publishes no X3 list (its X3 pages show an empty "In the box"), so the cable is counted from Logitech's
     own list for the X2 Superstrike rather than left out (never undercount a rival) */
  { name: 'Pro X3 Superstrike', v: [1, 1, 1, 0, 0, 0] },
  { name: 'Starlight X', v: [1, 1, 0, 0, 0, 0] },
  { name: 'Sora V3', v: [1, 1, 0, 1, 0, 0] },
  { name: 'X2 CrazyLight', v: [1, 1, 0, 1, 0, 0] },
  { name: 'OP1 8K (wired)', v: [-1, -1, 0, 1, 1, 0] },
  /* no grip tape (F52.2, Brock: "Drop it from the box"): its grip is etched into the surface (b08_grip, b08_tape), so its cell
     says so in words, not a tick, and every count below leaves the tape column out */
  { name: 'Theseus', v: [1, 1, 'etched', 1, 1, 1], hero: true }
];
/** what a new owner needs, tape aside: the five other items a row's box lists (n/a, a wired mouse's receiver and cable, not
   counted); the next best is the best wireless row, so the wired OP1 8K (two n/a) is compared on what applies to it */
const B11_BOXTAPE = 2;
function b11_boxCount(m) { return m.v.filter((v, j) => j !== B11_BOXTAPE && v === 1).length; }
function b11_boxBest() { return Math.max(...B11_BOXROWS.filter(m => !m.hero && m.v[0] !== -1).map(b11_boxCount)); }
S({
  id: 'b11_box', ch: 'own', theme: 'paper', title: 'In the box: the driver, and a manual that stands up', settle: 11, ideas: [72, 73, 13],
  replaces: ['box', 'ownsheet1', 'ownsheet2'], src: ['ownPsV4', 'b11TtV4', 'ownLogiBox', 'b11PsX3', 'b11LogiX2Box', 'ownB2gSlx', 'ownSoraBox', 'ownX2Box', 'ownTrOp1Box', 'ownPcgSkates', 'ownRazerWarranty', 'b11Jnd', 'b11Brock'],
  answers: [
    ['box (not rated): trifold box with driver (#72, #73)', 'The envelope opens and the trifold stands up (setup with its QR, spare skates, repair steps); the driver slides out beside it, one size for every screw, cross or slot. Table: what seven flagships\' boxes list (the Pro X3 Superstrike added from ProSettings\' list, its cable from Logitech\'s own X2 Superstrike list); the verdict counts the five items other than tape: the next best wireless box lists 3 of 5 (Sora V3, X2 CrazyLight), Theseus\'s plan 5 of 5; only the wired OP1 8K adds a driver (its receiver and cable n/a, so it is not set against the count).'],
    ['F52.2 (Brock, on FILM F35): grip tape in the box: "Drop it from the box"', 'Theseus\'s box ships no tape: its tape cell reads "Etched" (the grip is etched into the surface, the Surface chapter\'s answer), the trifold\'s spares panel shows skates only, and the verdict counts the other five items for every row, "tape aside". The rivals\' tape ticks stay on the table, so no rival is undercounted.'],
    ['ownsheet1, rated 2/10: "feels redundant, most of this should be moved to other slides"', 'Each point moved and said where: wire leads against a ribbon (#51) → b10_wires; twisted pairs (#69) → b10_twist; the skate file (DXF) stays here, as one line beside the spares, with why it matters: Razer at first refused a reviewer\'s Viper V4 Pro warranty claim because its feet had been changed (PC Gamer, May 2026).'],
    ['ownsheet2: keep the colourways and the paper cover', 'Colourways stay here (#13: matched to GMK keycap sets, the colour difference published, a ΔE target of 1.0, about the smallest difference an eye can see). The paper battery cover (#74) moved to b11_board, where the underside is shown. The 9-ending serials are out: serials and engravings stay hidden (F26.11); the 9-ending price is b01\'s.']
  ],
  draw: t => {
    const Q = B11X;
    header(t, 'In the box: the driver, and a manual that stands up');
    captions(t, [[0.3, 'An envelope, and in it a trifold: opened, it stands up with setup, spare skates and the repair steps printed on it.'], [Q.drv[0], 'Beside it, the driver: one size fits every screw in the mouse, cross or slot. Most flagships ship none.']]);
    /* left: the envelope and the trifold, then the driver */
    const lx = LM, ly = 286, lw0 = 760, lh0 = 640;
    demoWindow(lx, ly, lw0, lh0, 1);
    ltag(lx + 24, ly + 34, 'Theseus', 'An envelope and a trifold (#72)', { size: 21, color: C.heroText, vcolor: C.heroText });
    own_trifold(t + Q.tri, lx, ly + 100, lw0, 470);
    const kd = ep(t, Q.drv[0], Q.drv[1], E.cam);
    if (kd > 0.003) {
      const dx = lx + 60, dy = ly + 470 + 100 * kd;
      part(dx, dy, 3.0, () => b11_toolMM('box', { t }), { alpha: kd });
      text('The driver (#73): every screw, cross or slot', dx + 186, dy + 7, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ep(t, Q.drv[1] - 0.2, Q.drv[1] + 0.2), maxW: lw0 - 220 });
    }
    /* right: the verdict, then what each box lists, then the skate file and the colourways */
    const rx = 900, rw = RM - rx;
    const nOf = 5, best = b11_boxBest(), ours = b11_boxCount(B11_BOXROWS.find(m => m.hero));
    verdict(t, Q.verdict, rx, 396, { from: best, to: ours, unit: ' of ' + nOf, label: 'What a new owner needs in the box, tape aside', better: 'higher', who: ['Next best wireless', 'Theseus'], net: false, size: 100, maxW: rw });
    const items = ['Receiver', 'Cable', 'Grip tape', 'Spare skates', 'Driver', 'Repair steps'], nw = 300, cw = (rw - nw) / items.length, ty = 470, rh = 36;
    const gx = j => rx + nw + cw * (j + 0.5);
    items.forEach((it, j) => text(it, gx(j), ty - 8, { role: 'label', size: 20, color: it === 'Driver' ? C.ink : C.mute, align: 'center', alpha: ep(t, Q.table, Q.table + 0.4), maxW: cw - 6 }));
    B11_BOXROWS.forEach((m, i) => {
      const y = ty + 40 + i * rh, a = ep(t, Q.table + 0.2 + i * 0.12, Q.table + 0.6 + i * 0.12);
      if (i) line(rx, y - rh / 2 - 1, RM, y - rh / 2 - 1, { color: C.hair, w: 1, alpha: a });
      if (m.hero) rect(rx - 8, y - rh / 2 + 1, rw + 16, rh - 3, { fill: C.heroSoft, alpha: ep(t, Q.verdict - 0.6, Q.verdict - 0.2) });
      text(m.name + (m.hero ? ' (the plan)' : ''), rx, y + 7, { role: 'small', size: 21, weight: m.hero ? 800 : 600, color: m.hero ? C.heroText : C.ink, alpha: a, maxW: nw - 10 });
      m.v.forEach((v, j) => { const X = gx(j), kk = ep(t, Q.table + 0.5 + i * 0.12 + j * 0.04, Q.table + 0.9 + i * 0.12 + j * 0.04); if (v === 1) own_tick(X, y, 20, m.hero ? C.hero : C.ink2, kk); else if (v === 0) own_dash(X, y, 20, C.faint, kk); else if (v === 'etched') text('Etched', X, y + 6, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: kk, maxW: cw - 6 }); else text('n/a', X, y + 6, { role: 'label', size: 20, color: C.faint, align: 'center', alpha: kk }); });
    });
    const yb = ty + 40 + B11_BOXROWS.length * rh + 6;
    /* the skate file, and why it matters: changing a flagship's feet can cost its warranty (G2, a real case) */
    const dx2 = text('The skate file (DXF) is published: cut your own, keep the warranty. Razer at first refused a reviewer\'s V4 Pro claim over changed feet (PC Gamer, May 2026).', rx, yb + 10, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: ep(t, Q.dxf, Q.dxf + 0.4), maxW: rw, lh: 1.25 });
    const yc = yb + 10 + Math.max(1, (dx2 && dx2.lines ? dx2.lines.length : 2)) * 27.5;
    const kc = ep(t, Q.col, Q.col + 0.4);
    if (kc > 0.003) {
      const sw = [['#E8C8C8', '#E7C6C7'], ['#2F4A3A', '#304A3B'], ['#D9D2C0', '#DAD3C1']];
      sw.forEach(([m, k], i) => { const x = rx + i * 76; rr(x, yc, 32, 32, 6, m, inkA(0.25), 1.2, kc); rr(x + 34, yc, 32, 32, 6, k, inkA(0.25), 1.2, kc); });
      text('Colourways matched to GMK keycap sets (#13): shell beside keycap within ΔE 1.0, about the least an eye can tell', rx + 240, yc + 14, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kc, maxW: rw - 240, lh: 1.25 });
    }
    source(t, 'Box lists (a dash: not listed): ProSettings and TweakTown (Viper V4 Pro: "I do miss a set of replacement mouse feet"), Logitech, ProSettings for the X3 (its cable from Logitech\'s X2 Superstrike list; Logitech lists none for the X3), Back2Gaming, AusModShop, TechRadar (OP1 8K: "A small screwdriver is included"). Warranty: PC Gamer, May 2026. ΔE 1.0: the usual just-noticeable difference (Datacolor). Theseus\'s box: Brock\'s plan (#72, #73), with no grip tape: its grip is etched.', { t0: 1.0, maxW: 1760 });
  }
});
