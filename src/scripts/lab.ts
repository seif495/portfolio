import {
  NARROW,
  N_DAYS,
  SCENARIO_START,
  WIDE,
  fmtNum,
  renderChart,
  simulate,
  xOf,
  type Geom,
  type LabResult,
  type LabState,
  type Noise,
  type Scenario,
} from '../lib/baseline-lab';

const NOTES: Record<Scenario, string> = {
  clean:
    'No attack, just everyday variation. In the project’s harness, clean series raised no false alerts at low noise, 0.14% at medium and 1.4% at high. Try high noise.',
  burst:
    'Changed files jump 10× for three backups, as when encryption rewrites a share. In the harness, 10× spikes were caught at 100% recall at low and medium noise, on the first affected backup.',
  subtle:
    'Changed files rise 1.3× for a week while size stays put. This is the blind spot: 24% recall at medium noise and 7% at high in the harness.',
  growth:
    'The data legitimately doubles. Flagged backups never enter the baseline, so without help every later backup alerts (59–63% false-positive rate in the harness). Turn on the operator re-baseline to see the fix.',
};

export function initLab(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>('[data-lab-svg]')!;
  const layer = root.querySelector<SVGGElement>('[data-lab-layer]')!;
  const cursor = root.querySelector<SVGGElement>('[data-lab-cursor]')!;
  const cursorLine = cursor.querySelector('line')!;
  const note = root.querySelector<HTMLElement>('[data-lab-note]')!;
  const stats = root.querySelector<HTMLElement>('[data-lab-stats]')!;
  const detail = root.querySelector<HTMLElement>('[data-lab-detail]')!;
  const range = root.querySelector<HTMLInputElement>('[data-lab-day]')!;
  const rebaseline = root.querySelector<HTMLInputElement>('[data-rebaseline]')!;
  const rebaselineWrap = root.querySelector<HTMLElement>('[data-rebaseline-wrap]')!;
  const scnBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-scenario]')];
  const noiseBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-noise]')];

  const state: LabState = { scenario: 'burst', noise: 'medium', seed: 3, rebaseline: false };
  let res: LabResult = simulate(state);
  let geom: Geom = WIDE;

  const pickGeom = () => (svg.getBoundingClientRect().width < 600 ? NARROW : WIDE);

  function render() {
    res = simulate(state);
    geom = pickGeom();
    svg.setAttribute('viewBox', `0 0 ${geom.w} ${geom.h}`);
    svg.classList.toggle('is-narrow', geom.narrow);
    layer.innerHTML = renderChart(res, geom);
    cursorLine.setAttribute('y1', String(geom.t));
    cursorLine.setAttribute('y2', String(geom.h - geom.b));

    scnBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scenario === state.scenario)));
    noiseBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.noise === state.noise)));
    rebaselineWrap.hidden = state.scenario !== 'growth';
    note.textContent = NOTES[state.scenario];

    const s = res.stats;
    const parts = [`<b>${s.scored}</b> backups scored`, `<b class="${s.flagged ? 'hit' : ''}">${s.flagged}</b> alerts`];
    if (res.attackStart !== null && state.scenario !== 'growth') {
      parts.push(`<b>${s.tp}</b> of ${s.tp + s.fn} attack backups caught`);
      parts.push(
        s.firstDelay === null
          ? 'attack <b class="hit">missed</b>'
          : s.firstDelay === 0
            ? 'first alert on the <b>first</b> affected backup'
            : `first alert after <b>${s.firstDelay}</b> backup${s.firstDelay === 1 ? '' : 's'}`,
      );
    }
    if (state.scenario === 'growth' || state.scenario === 'clean') parts.push(`<b>${s.fp}</b> false alerts`);
    stats.innerHTML = parts.join(' · ');
    inspect(Number(range.value) - 1);
  }

  function inspect(i: number) {
    const d = res.days[Math.max(0, Math.min(N_DAYS - 1, i))]!;
    const x = xOf(geom, d.i);
    cursor.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
    cursorLine.setAttribute('x1', '0');
    cursorLine.setAttribute('x2', '0');
    layer.querySelectorAll('.pt.is-inspected').forEach((p) => p.classList.remove('is-inspected'));
    layer.querySelector(`[data-day="${d.i}"]`)?.classList.add('is-inspected');

    const head = `Day ${d.i + 1}: ${fmtNum(d.changed)} changed files, ${d.sizeGiB.toFixed(1)} GiB`;
    if (d.status === 'calibrating') {
      detail.innerHTML = `${head}<br>Warming up: ${d.n} of 10 baseline backups, not scored yet.`;
      return;
    }
    const verdict = d.anomaly
      ? `<span class="flag">ALERT · ${d.severity}</span>`
      : d.positive
        ? '<span class="flag">attack backup, missed</span>'
        : 'normal';
    detail.innerHTML =
      `${head}<br>z(changed) ${d.zChanged.toFixed(2)} · z(size) ${d.zSize.toFixed(2)}` +
      ` · threshold ${d.threshold.toFixed(2)} (3.5 + 20/${d.n})<br>${verdict}`;
  }

  scnBtns.forEach((b) =>
    b.addEventListener('click', () => {
      state.scenario = b.dataset.scenario as Scenario;
      const start = SCENARIO_START[state.scenario];
      range.value = String((start ?? 100) + 1);
      render();
    }),
  );
  noiseBtns.forEach((b) =>
    b.addEventListener('click', () => {
      state.noise = b.dataset.noise as Noise;
      render();
    }),
  );
  rebaseline.addEventListener('change', () => {
    state.rebaseline = rebaseline.checked;
    render();
  });
  root.querySelector('[data-reseed]')!.addEventListener('click', () => {
    state.seed = (state.seed % 997) + 1 + Math.floor(Math.random() * 50);
    render();
  });
  range.addEventListener('input', () => inspect(Number(range.value) - 1));

  const fromPointer = (e: PointerEvent) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    const i = Math.round(((p.x - geom.l) / (geom.w - geom.l - geom.r)) * (N_DAYS - 1));
    if (i < 0 || i >= N_DAYS) return;
    range.value = String(i + 1);
    inspect(i);
  };
  svg.addEventListener('pointermove', fromPointer);
  svg.addEventListener('pointerdown', fromPointer);

  let lastNarrow = geom.narrow;
  new ResizeObserver(() => {
    const g = pickGeom();
    if (g.narrow !== lastNarrow) {
      lastNarrow = g.narrow;
      render();
    }
  }).observe(svg);

  render();
}
