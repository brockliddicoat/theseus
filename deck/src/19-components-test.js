/* component test page: every chart and card that no film slide uses yet, in both themes. Build: python3 tools/build.py comps → dist/components.html */
const DECK = { chapters: [{ key: 'intro', name: 'Intro' }, { key: 'elec', name: 'Electronics' }, { key: 'end', name: 'Close' }], slides: [] };
const S = o => (DECK.slides.push(o), o);
[['paper', 'p'], ['night', 'n']].forEach(([th, sfx]) => {
  S({ id: 'bars' + sfx, ch: 'elec', theme: th, title: 'Component test', settle: 8, draw: t => {
    header(t, 'Bars and lines');
    barChart(t, { x: LM + 90, y: 300, w: 760, h: 380, t0: 0.4, yr: [0, 0.6], ticks: [0, 0.2, 0.4, 0.6], fmt: v => v.toFixed(1), unit: 'ms', dec: 2, axis: 'Motion latency, {ms}',
      bars: [{ name: 'Viper V4 Pro', v: 0.34, ci: [0.31, 0.37], n: 200, samples: { n: 120, sd: 0.03, seed: 3 }, ref: true },
             { name: 'Beast X', v: 0.42, ci: [0.38, 0.46], n: 200, samples: { n: 120, sd: 0.04, seed: 5 } },
             { name: 'Theseus', sub: 'Target', v: 0.14, hero: true, ev: 'projected' }] });
    barChart(t, { x: 1240, y: 290, w: 520, h: 200, t0: 0.6, dir: 'h', yr: [0, 200], ticks: [0, 100, 200], unit: 'h', dec: 0,
      bars: [{ name: 'Viper V4 Pro', v: 180 }, { name: 'GPX2', v: 95 }, { name: 'Theseus', v: 146, hero: true }] });
    lineChart(t, { x: 1200, y: 620, w: 620, h: 170, t0: 0.8, xr: [0, 8], yr: [0, 60], xticks: [0, 4, 8], yticks: [0, 30, 60], xfmt: v => v + ' kHz', yfmt: v => v + ' mW',
      series: [{ name: 'V4 Pro', pts: [[1, 6.6], [2, 10], [4, 18], [8, 33]], ref: true, label: true }, { name: 'Theseus', pts: [[1, 4], [2, 6], [4, 11], [8, 21]], hero: true, label: true }],
      bands: [{ x0: 1, x1: 4, label: 'Most play here' }], markers: [{ x: 8, y: 21, label: '21 mW', hero: true }] });
  } });
  S({ id: 'cards' + sfx, ch: 'elec', theme: th, title: 'Component test', settle: 8, draw: t => {
    header(t, 'Stat cards');
    statCard(t, 0.4, LM, 300, 540, 240, { label: 'Battery at 1 kHz', ev: 'projected', value: '146', unit: 'h', body: 'From 0.96 Wh at 6.6 mW.', hero: true });
    statCard(t, 0.6, LM + 580, 300, 540, 240, { label: 'Fastest wireless', ev: 'measured', value: '0.34', unit: 'ms', body: 'Razer Viper V4 Pro, piaknow.' });
    statCard(t, 0.8, LM + 1160, 300, 600, 240, { label: 'Charge', ev: 'datasheet', pre: 'About', value: '2', mid: 'to', value2: '3', unit: 'h', body: 'At 0.5 C, the cell\'s limit.' });
    statCard(t, 1.0, LM, 600, 540, 170, { label: 'No body', ev: 'claim', value: '29', unit: 'g' });
    statCard(t, 1.2, LM + 580, 600, 540, 170, { label: 'Mono value', ev: 'derived', value: '0.96', unit: 'Wh', font: 'mono' });
  } });
});
