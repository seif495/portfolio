/**
 * Hero knowledge graph: highlight a node's neighbourhood in every rendered
 * layout, describe it as a Cypher query, and link results to case studies.
 */

type NodeType = 'discipline' | 'project' | 'research' | 'role' | 'tech';

interface CNode {
  id: string;
  label: string;
  type: NodeType;
  href?: string;
}

interface CEdge {
  source: string;
  target: string;
  rel: 'IN' | 'USES';
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const LABEL: Record<NodeType, string> = {
  discipline: 'Discipline',
  project: 'Project',
  research: 'Research',
  role: 'Role',
  tech: 'Tool',
};

interface View {
  svg: SVGSVGElement;
  nodes: Map<string, SVGGElement>;
  edges: SVGPathElement[];
  pulses: SVGGElement;
  order: string[];
  focusIdx: number;
}

export function initGraph(root: HTMLElement) {
  const json = root.querySelector<HTMLScriptElement>('[data-graph-json]');
  const queryEl = root.querySelector<HTMLElement>('[data-query]');
  const resultEl = root.querySelector<HTMLElement>('[data-result]');
  if (!json || !queryEl || !resultEl) return;

  const data = JSON.parse(json.textContent || '{}') as { nodes: CNode[]; edges: CEdge[] };
  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];

  const views: View[] = [...root.querySelectorAll<SVGSVGElement>('[data-graph-svg]')].map((svg) => {
    const nodes = new Map<string, SVGGElement>();
    svg.querySelectorAll<SVGGElement>('.node').forEach((g) => nodes.set(g.dataset.id!, g));
    return {
      svg,
      nodes,
      edges: [...svg.querySelectorAll<SVGPathElement>('.edge')],
      pulses: svg.querySelector<SVGGElement>('[data-pulses]')!,
      order: (svg.dataset.order ?? '').split(','),
      focusIdx: 0,
    };
  });

  const neighbours = new Map<string, { id: string; rel: CEdge['rel'] }[]>();
  for (const e of data.edges) {
    neighbours.set(e.source, [...(neighbours.get(e.source) ?? []), { id: e.target, rel: e.rel }]);
    neighbours.set(e.target, [...(neighbours.get(e.target) ?? []), { id: e.source, rel: e.rel }]);
  }

  const defaultQuery = queryEl.innerHTML;
  const defaultResult = resultEl.innerHTML;
  let pinned: string | null = null;
  let shown: string | null = null;

  const name = (n: CNode) => `<span class="str">"${esc(n.label)}"</span>`;
  const workLink = (n: CNode) =>
    n.href ? `<a class="link" href="${n.href}">${esc(n.label)}</a>` : `<span>${esc(n.label)}</span>`;
  const sep = '<span aria-hidden="true">·</span>';

  function describe(id: string) {
    const n = nodeById.get(id)!;
    const nb = (neighbours.get(id) ?? []).map((x) => ({ ...nodeById.get(x.id)!, rel: x.rel }));
    let q: string;
    let r: string;
    if (n.type === 'discipline') {
      q = `<span class="kw">MATCH</span> (w)-[:IN]->(:<span class="lb">Discipline</span> {name: ${name(n)}})\n<span class="kw">RETURN</span> w.name`;
      r = `<div class="res-row"><span class="res-key">${nb.length} rows</span>${nb.map(workLink).join(sep)}</div>`;
    } else if (n.type === 'tech') {
      q = `<span class="kw">MATCH</span> (:<span class="lb">Tool</span> {name: ${name(n)}})-[:USES]-(w)\n<span class="kw">RETURN</span> w.name`;
      r = `<div class="res-row"><span class="res-key">${nb.length} row${nb.length === 1 ? '' : 's'}</span>${nb.map(workLink).join(sep)}</div>`;
    } else {
      q = `<span class="kw">MATCH</span> (w:<span class="lb">${LABEL[n.type]}</span> {name: ${name(n)}})-[r]-(x)\n<span class="kw">RETURN</span> type(r), collect(x.name)`;
      const uses = nb.filter((x) => x.rel === 'USES');
      const ins = nb.filter((x) => x.rel === 'IN');
      r = `<div class="res-row"><span class="res-key">IN</span>${ins.map((x) => esc(x.label)).join(', ')}</div>`;
      if (uses.length)
        r += `<div class="res-row"><span class="res-key">USES</span>${uses.map((x) => esc(x.label)).join(', ')}</div>`;
      if (n.href) {
        const what = n.type === 'role' ? 'Read about the role' : 'Open the case study';
        r += `<a class="link res-go" href="${n.href}">${what} <span class="arrow" aria-hidden="true">↓</span></a>`;
      }
    }
    return { q, r };
  }

  function light(id: string | null) {
    if (id === shown) return;
    shown = id;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === id)));
    for (const v of views) {
      v.nodes.forEach((g) => g.classList.remove('is-lit', 'is-current'));
      v.edges.forEach((p) => p.classList.remove('is-lit'));
      v.svg.classList.toggle('is-focused', Boolean(id));
      v.pulses.replaceChildren();
    }
    if (!id) {
      queryEl!.innerHTML = defaultQuery;
      resultEl!.innerHTML = defaultResult;
      return;
    }
    const nbIds = new Set((neighbours.get(id) ?? []).map((x) => x.id));
    for (const v of views) {
      v.nodes.get(id)?.classList.add('is-lit', 'is-current');
      nbIds.forEach((x) => v.nodes.get(x)?.classList.add('is-lit'));
      const lit = v.edges.filter((p) => p.dataset.s === id || p.dataset.t === id);
      lit.forEach((p) => p.classList.add('is-lit'));
      // Narrow layout has no discipline nodes: show that discipline's work
      // together with the tools it uses.
      if (!v.nodes.has(id)) {
        for (const p of v.edges) {
          if (nbIds.has(p.dataset.t!)) {
            p.classList.add('is-lit');
            v.nodes.get(p.dataset.s!)?.classList.add('is-lit');
            lit.push(p);
          }
        }
      }
      pulse(v, lit);
    }
    const { q, r } = describe(id);
    queryEl!.innerHTML = q;
    resultEl!.innerHTML = r;
  }

  // A signal travels left to right along each lit edge, once per selection.
  let pulseRun = 0;
  function pulse(v: View, paths: SVGPathElement[]) {
    if (reduceMotion() || !paths.length || v.svg.getClientRects().length === 0) return;
    const run = ++pulseRun;
    const dots = paths.map((p) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '2.6');
      c.setAttribute('class', 'pulse');
      v.pulses.appendChild(c);
      return { c, p, len: p.getTotalLength() };
    });
    const t0 = performance.now();
    const dur = 700;
    const step = (now: number) => {
      if (run !== pulseRun) return;
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      for (const d of dots) {
        const pt = d.p.getPointAtLength(e * d.len);
        d.c.setAttribute('cx', pt.x.toFixed(1));
        d.c.setAttribute('cy', pt.y.toFixed(1));
        d.c.setAttribute('opacity', (1 - t * t).toFixed(2));
      }
      if (t < 1) requestAnimationFrame(step);
      else v.pulses.replaceChildren();
    };
    requestAnimationFrame(step);
  }

  function go(href: string) {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', href);
    const heading = target.querySelector<HTMLElement>('h2, h3');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  for (const v of views) {
    const { svg } = v;
    let lastPointer = 'mouse';
    svg.addEventListener('pointerdown', (e) => (lastPointer = e.pointerType));
    svg.addEventListener('pointerover', (e) => {
      if (e.pointerType !== 'mouse') return;
      const g = (e.target as Element).closest<SVGGElement>('.node');
      if (g) light(g.dataset.id!);
    });
    svg.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') light(pinned);
    });
    svg.addEventListener('click', (e) => {
      const g = (e.target as Element).closest<SVGGElement>('.node');
      if (!g) {
        pinned = null;
        light(null);
        return;
      }
      const id = g.dataset.id!;
      const n = nodeById.get(id)!;
      // Mouse: hover already previews, so a click opens. Touch: first tap pins.
      if (lastPointer === 'mouse' && n.href) return go(n.href);
      if (lastPointer !== 'mouse' && n.href && pinned === id) return go(n.href);
      pinned = pinned === id ? null : id;
      shown = null;
      light(pinned);
    });

    const focusAt = (i: number) => {
      const prev = v.nodes.get(v.order[v.focusIdx]!);
      if (prev) prev.tabIndex = -1;
      v.focusIdx = (i + v.order.length) % v.order.length;
      const g = v.nodes.get(v.order[v.focusIdx]!)!;
      g.tabIndex = 0;
      g.focus();
    };

    svg.addEventListener('focusin', (e) => {
      const g = (e.target as Element).closest<SVGGElement>('.node');
      if (!g) return;
      v.focusIdx = v.order.indexOf(g.dataset.id!);
      light(g.dataset.id!);
    });
    svg.addEventListener('focusout', (e) => {
      if (!svg.contains(e.relatedTarget as Node)) light(pinned);
    });
    svg.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') {
        e.preventDefault();
        focusAt(v.focusIdx + 1);
      } else if (k === 'ArrowUp' || k === 'ArrowLeft') {
        e.preventDefault();
        focusAt(v.focusIdx - 1);
      } else if (k === 'Home') {
        e.preventDefault();
        focusAt(0);
      } else if (k === 'End') {
        e.preventDefault();
        focusAt(v.order.length - 1);
      } else if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        const n = nodeById.get(v.order[v.focusIdx]!);
        if (n?.href) go(n.href);
      } else if (k === 'Escape') {
        pinned = null;
        (document.activeElement as HTMLElement | null)?.blur();
        light(null);
      }
    });
  }

  chips.forEach((c) =>
    c.addEventListener('click', () => {
      const id = c.dataset.filter!;
      pinned = pinned === id ? null : id;
      light(pinned);
    }),
  );
}
