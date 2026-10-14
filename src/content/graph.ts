import { tech, type TechId } from './tech';
import { disciplines, workItems, type DisciplineId } from './work';

/**
 * The hero knowledge graph: tools → work → disciplines.
 * Laid out at build time as three columns, each ordered by the barycentre of
 * its neighbours to keep crossings low. Two layouts are produced: a wide one
 * with all three columns, and a narrow one (tools → work) for small screens,
 * where disciplines become the filter chips.
 */

export type NodeType = 'discipline' | 'project' | 'research' | 'role' | 'tech';

export interface GNode {
  id: string;
  label: string;
  type: NodeType;
  href?: string;
  x: number;
  y: number;
  /** Half-width of the pill, for work nodes. */
  hw: number;
}

export interface GEdge {
  source: string;
  target: string;
  rel: 'IN' | 'USES';
}

export interface Layout {
  w: number;
  h: number;
  nodes: GNode[];
  edges: GEdge[];
  columns: { label: string; x: number; anchor: 'start' | 'middle' | 'end' }[];
}

/** Short labels keep the tool column narrow. */
const SHORT: Partial<Record<TechId, string>> = {
  robuststats: 'Robust stats',
  evaluation: 'Evaluation',
  embeddings: 'Embeddings',
  yolo: 'YOLO',
  ocr: 'OCR',
  sneps: 'SNePS',
};

const r1 = (n: number) => Math.round(n * 10) / 10;

function pillHalfWidth(label: string, type: NodeType, scale = 1) {
  const per = type === 'role' ? 7.4 : 7.6;
  return r1(((label.length * per) / 2 + 12) * scale);
}

function spread(count: number, top: number, bottom: number) {
  if (count === 1) return [(top + bottom) / 2];
  const step = (bottom - top) / (count - 1);
  return Array.from({ length: count }, (_, i) => top + i * step);
}

function graphData() {
  const works = workItems;
  const edges: GEdge[] = [];
  const toolUsers = new Map<TechId, number[]>();
  const discUsers = new Map<DisciplineId, number[]>();

  // Work order is curated: LLM work at the top, data in the middle, vision last.
  const order = ['advansys', 'arabic', 'fpl', 'ransomware', 'dawar', 'enpal', 'xcv', 'thesis'];
  const ordered = order.map((id) => works.find((w) => w.id === id)!).filter(Boolean);

  ordered.forEach((w, i) => {
    for (const d of w.disciplines) {
      edges.push({ source: `w:${w.id}`, target: `d:${d}`, rel: 'IN' });
      discUsers.set(d, [...(discUsers.get(d) ?? []), i]);
    }
    for (const t of w.stack) {
      if (!(tech[t] as { graph?: boolean }).graph) continue;
      edges.push({ source: `t:${t}`, target: `w:${w.id}`, rel: 'USES' });
      toolUsers.set(t, [...(toolUsers.get(t) ?? []), i]);
    }
  });

  const bary = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const tools = [...toolUsers.entries()].sort((a, b) => bary(a[1]) - bary(b[1]) || a[0].localeCompare(b[0]));
  const discs = [...discUsers.entries()].sort((a, b) => bary(a[1]) - bary(b[1]));

  return { ordered, tools, discs, edges };
}

export function buildLayouts(): { wide: Layout; narrow: Layout } {
  const { ordered, tools, discs, edges } = graphData();

  // ---- Wide: three columns.
  const W = 650;
  const H = 560;
  const toolX = 116;
  const workX = 318;
  const discX = 498;
  const wide: GNode[] = [];
  spread(tools.length, 64, H - 22).forEach((y, i) => {
    const [t] = tools[i]!;
    wide.push({ id: `t:${t}`, label: SHORT[t] ?? tech[t].label, type: 'tech', x: toolX, y: r1(y), hw: 0 });
  });
  spread(ordered.length, 84, H - 44).forEach((y, i) => {
    const w = ordered[i]!;
    wide.push({
      id: `w:${w.id}`,
      label: w.label,
      type: w.kind,
      href: w.anchor,
      x: workX,
      y: r1(y),
      hw: pillHalfWidth(w.label, w.kind),
    });
  });
  spread(discs.length, 128, H - 92).forEach((y, i) => {
    const [d] = discs[i]!;
    wide.push({ id: `d:${d}`, label: disciplines[d].label, type: 'discipline', x: discX, y: r1(y), hw: 0 });
  });

  // ---- Narrow: tools → work only.
  const NW = 360;
  const NH = 570;
  const nToolX = 98;
  const nWorkX = 252;
  const narrow: GNode[] = [];
  spread(tools.length, 54, NH - 18).forEach((y, i) => {
    const [t] = tools[i]!;
    narrow.push({ id: `t:${t}`, label: SHORT[t] ?? tech[t].label, type: 'tech', x: nToolX, y: r1(y), hw: 0 });
  });
  spread(ordered.length, 76, NH - 40).forEach((y, i) => {
    const w = ordered[i]!;
    narrow.push({
      id: `w:${w.id}`,
      label: w.label,
      type: w.kind,
      href: w.anchor,
      x: nWorkX,
      y: r1(y),
      hw: Math.min(pillHalfWidth(w.label, w.kind, 0.96), NW - nWorkX - 4),
    });
  });

  return {
    wide: {
      w: W,
      h: H,
      nodes: wide,
      edges,
      columns: [
        { label: 'Tools', x: toolX, anchor: 'end' },
        { label: 'Work', x: workX, anchor: 'middle' },
        { label: 'Disciplines', x: discX, anchor: 'start' },
      ],
    },
    narrow: {
      w: NW,
      h: NH,
      nodes: narrow,
      edges: edges.filter((e) => e.rel === 'USES'),
      columns: [
        { label: 'Tools', x: nToolX, anchor: 'end' },
        { label: 'Work', x: nWorkX, anchor: 'middle' },
      ],
    },
  };
}

/** Horizontal S-curve between the right side of `a` and the left side of `b`. */
export function edgePath(a: GNode, b: GNode) {
  const x1 = a.type === 'tech' ? a.x + 4 : a.x + a.hw;
  const x2 = b.type === 'discipline' ? b.x - 6 : b.x - b.hw;
  const dx = (x2 - x1) * 0.55;
  return `M${r1(x1)} ${a.y} C${r1(x1 + dx)} ${a.y} ${r1(x2 - dx)} ${b.y} ${r1(x2)} ${b.y}`;
}

/** Everything the client needs to describe a node's neighbourhood. */
export function clientGraph() {
  const { ordered, tools, discs, edges } = graphData();
  const nodes = [
    ...tools.map(([t]) => ({ id: `t:${t}`, label: tech[t].label, type: 'tech' as NodeType })),
    ...ordered.map((w) => ({ id: `w:${w.id}`, label: w.label, type: w.kind as NodeType, href: w.anchor })),
    ...discs.map(([d]) => ({ id: `d:${d}`, label: disciplines[d].label, type: 'discipline' as NodeType })),
  ];
  return { nodes, edges };
}
