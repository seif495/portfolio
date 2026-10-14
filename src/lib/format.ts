export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const KEYWORDS =
  'MATCH|OPTIONAL|WHERE|WITH|RETURN|ORDER|BY|LIMIT|AS|CASE|WHEN|THEN|ELSE|END|IN|DESC|ASC|AND|OR|NOT|IS|NULL|DISTINCT|UNWIND';
const FUNCS = 'SUM|sum|collect|size|coalesce|last|round|count|avg|toLower';

/** Minimal Cypher highlighter for display (escapes first, then wraps tokens). */
export function highlightCypher(src: string) {
  const re = new RegExp(
    `(\\$\\w+)|(:[A-Z][A-Za-z_]*)|\\b(${KEYWORDS})\\b|\\b(${FUNCS})(?=\\()|('[^']*'|"[^"]*")`,
    'g',
  );
  return esc(src).replace(re, (m, param, label, kw, fn, str) => {
    if (param) return `<span class="cy-param">${m}</span>`;
    if (label) return `<span class="cy-label">${m}</span>`;
    if (kw) return `<span class="cy-kw">${m}</span>`;
    if (fn) return `<span class="cy-fn">${m}</span>`;
    if (str) return `<span class="cy-str">${m}</span>`;
    return m;
  });
}

/**
 * Wrap numbers in an LLM answer that appear verbatim in the retrieved
 * context, so readers can see which claims are grounded. Season labels such
 * as 2023-24 are left alone.
 */
export function groundAnswer(answer: string, context: string) {
  const tokens = new Set(context.match(/\d+(?:\.\d+)?/g) ?? []);
  const season = /\d{4}[-‑–]\d{2}/g;
  const parts: string[] = [];
  let last = 0;
  for (const m of answer.matchAll(season)) {
    parts.push(mark(answer.slice(last, m.index), tokens));
    parts.push(esc(m[0]));
    last = m.index! + m[0].length;
  }
  parts.push(mark(answer.slice(last), tokens));
  return parts.join('');
}

function mark(text: string, tokens: Set<string>) {
  return esc(text).replace(/\d+(?:\.\d+)?/g, (n) =>
    tokens.has(n) ? `<mark class="grounded" title="Found in the retrieved context">${n}</mark>` : n,
  );
}

export const fmtInt = (n: number) => n.toLocaleString('en-US');
