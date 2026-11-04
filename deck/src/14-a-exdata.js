/* ============================================================================================
   exemplars: the slides that prove the design system. Data comes from research/data/*.json, embedded at build
   time as RDATA (tools/build.py). Every number keeps the evidence label the research gave it:
   IM → measured, DS → datasheet, MC → maker claim, DV → derived, PR → proposal.
   ============================================================================================ */
const RD = typeof RDATA !== 'undefined' ? RDATA : {};
/** the value of a research field: {value} objects, lists of them, or plain values */
const rv = x => x == null ? null : Array.isArray(x) ? rv(x[0]) : (typeof x === 'object' && 'value' in x) ? x.value : x;
const EVMAP = { IM: 'measured', DS: 'datasheet', MC: 'claim', DV: 'derived', CA: 'claim', PR: 'proposal' };
const evOf = x => { const l = x && (Array.isArray(x) ? x[0] : x).label; return EVMAP[String(l || '').split('/')[0]] || 'derived'; };
function exMouse(id) { return ((RD.mice || {}).mice || []).find(m => m.id === id) || null; }
/** a mouse's weight: measured (RTINGS) when there is one, else the maker's figure. A maker weighing its own mouse (the XA25,
   XBAB's scale) is a claim, so the evidence follows the field's own label */
function exWeight(id) { const m = exMouse(id); if (!m) return null; const me = rv(m.weight_measured_g), cl = rv(m.weight_claimed_g); return me != null ? { g: me, ev: evOf(m.weight_measured_g) === 'measured' ? 'measured' : 'claim', name: m.name } : cl != null ? { g: cl, ev: 'claim', name: m.name } : null; }
const exShort = n => String(n).replace(/\s*\((?:[^()]*|\([^()]*\))*\)\s*$/, '').replace('Logitech G Pro X Superlight 2', 'Logitech GPX2').replace('Logitech G Pro X2 Superstrike', 'Logitech Superstrike').replace('Finalmouse UltralightX', 'Finalmouse ULX').replace('Finalmouse Starlight X', 'Finalmouse Starlight X');

Object.assign(SRC, {
  exXbabWeight: { t: 'XBAB Tech on X, 2026-07-14: XA25 weight breakdown, 9 parts, 24.94 g (the layout this deck borrows)', u: 'https://x.com/xbabtech/status/2076835183723245671' },
  exJauch: { t: 'Jauch LP502030JH lithium-polymer pack datasheet, Rev. 1.1: 250 mAh min, 7.5 g with PCM and leads, 0.5C max charge, 500 cycles', u: 'https://endrich.com/Datenbl%C3%A4tter/Akkus%20%20%26%20Batterien/Lithium%20Ionen%20Akkumulatoren/Lithium%20Polymer%20Batterien/lp502030jh.pdf' },
  exNcr: { t: 'Panasonic NCR18650B datasheet: 3350 mAh typ, 48.5 g max, 243 Wh/kg, 0.5C standard charge in 4.0 h', u: 'https://e2e.ti.com/cfs-file/__key/communityserver-discussions-components-files/196/Panasonic-NCR18650B-datasheet.pdf' },
  exE91: { t: 'Energizer E91 AA datasheet (EBC-1102Q): 23 g; 3.75 Wh at 25 mW, 0.92 Wh at 1 W (constant-power curve, digitised)', u: 'https://courses.egr.uh.edu/ECE/ECE2100/Archive/Spring%202024%20Honors/E91.pdf' },
  exEneloop: { t: 'Panasonic eneloop BK-3MCC datasheet: 1900 mAh min, 27 g; 57 min fast charge at 1C; 2100 cycles (maker claim)', u: 'https://www.panasonic-eneloop.eu/' },
  exL91: { t: 'Energizer L91 lithium AA datasheet: 15 g, about 3500 mAh at 25 mA', u: 'https://data.energizer.com/pdfs/l91.pdf' },
  exBu107: { t: 'Battery University BU-107, comparison table of secondary batteries (Li-ion 500 to 1000 cycles)', u: 'https://batteryuniversity.com/article/bu-107-comparison-table-of-secondary-batteries' },
  exBu409: { t: 'Battery University BU-409, charging lithium-ion: 0.5C to 1C, full in about 2 to 3 h', u: 'https://batteryuniversity.com/article/bu-409-charging-lithium-ion' },
  exZk: { t: 'Zaunkoenig, "Optimal weight of a gaming mouse", 29 Dec 2018: "The optimal weight of a gaming mouse therefore is zero grams.", from F = m · a', u: 'https://zaunkoenig.co/blog/optimal-weight-of-a-gaming-mouse' },
  exZkM1k: { t: 'Zaunkoenig, "M1K weight in review", 31 Aug 2020: 23.4 g mean of the first 333 units', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  exConroy: { t: 'Conroy, Toth & Campbell 2022, Applied Ergonomics 99:103637: n = 72 gamers; 50, 60 and 90 g mice 4% faster and 9% more accurate than 100 g', u: 'https://pure.ul.ie/en/publications/the-effect-of-computer-mouse-mass-on-target-acquisition-performan/' },
  exYan: { t: 'Yan et al. 2022, Proc. HFES 66(1): n = 12, six mice 40 to 140 g; the 40 g mouse had the highest error rate, 60 g most preferred', u: 'https://www.coeh.berkeley.edu/node/1708' },
  exWang: { t: 'Wang et al. 2023, Int. J. Industrial Ergonomics 97:103493: n = 16 professionals, 80 vs 87 g, no significant difference', u: 'https://www.coeh.berkeley.edu/node/1668' },
  exChen: { t: 'Chen, Lee & Cheng 2012, Eur. J. Applied Physiology 112(6): n = 25, office task, 70 to 190 g; wrist motion and muscle activity lowest at 130 g', u: 'https://scholars.lib.ntu.edu.tw/entities/publication/dce55077-b4b2-41a8-b4da-43130768a1f3' },
  exEloshapes: { t: 'EloShapes spec sheets (manufacturer weights, dimensions, sensors), via research/data/mice.json', u: 'https://www.eloshapes.com/' },
  exRtings: { t: 'RTINGS reviews, measured "Default Weight", via research/data/mice.json', u: 'https://www.rtings.com/mouse' },
  exPiaknow: { t: 'piaknow, "Motion Latency of Some Computer Mice 2026-09-15", read from the original chart (research/data/latency.json)', u: 'https://x.com/Tw1tterIsGood/status/2099778999849549856' },
  exNbcV4: { t: 'Notebookcheck, Razer Viper V4 Pro: 180 h at 1 kHz, 45 h at 8 kHz (maker claim); 1.184 Wh cell (TechPowerUp)', u: 'https://www.notebookcheck.com/Razer-enthuellt-Viper-V4-Pro-mit-180h-Laufzeit-und-8-000-Hz-Polling-im-49g-Gehaeuse.1257839.0.html' }
});

