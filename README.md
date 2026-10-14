# Seif Moheb · Portfolio

Personal site of Seif Moheb, AI & data engineer. Static, built with [Astro](https://astro.build), no client framework, no
trackers. Interactive panels are hand-written TypeScript and SVG.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # astro check (types) + static build into dist/
npm run preview    # serve dist/
```

Node 22.12 or newer.

## Where things live

| Path | What it holds |
|---|---|
| `src/content/profile.ts` | Name, links, headline, intro |
| `src/content/work.ts` | Every project and role: graph/matrix metadata (`workItems`) and case-study copy |
| `src/content/experience.ts` | Roles, education, recognition, languages |
| `src/content/tech.ts` | Tool registry; `graph: true` puts a tool in the hero graph |
| `src/content/graph.ts` | Builds the hero graph and its two layouts at build time |
| `src/data/fpl-traces.json` | Three `/api/query` responses recorded from the live FPL app on 14 Oct 2026 |
| `src/data/fpl-eval.ts` | Pick-quality numbers from the FPL evaluation report |
| `src/lib/baseline-lab.ts` | Re-implementation of the ransomware detector's scoring rule, used by the baseline lab |
| `src/components/` | Page sections; `work/` holds one component per case study |
| `src/scripts/` | Client behaviour for the graph, trace tabs, lab and scroll reveals |
| `src/styles/global.css` | Design tokens and shared primitives |
| `public/` | Résumé PDF, social image, favicons, robots and sitemap; `work/` holds the Pitch Me screenshot |

Content and presentation are separate: to change a fact, edit `src/content/` or `src/data/`; the hero graph and the
toolkit are derived from `workItems[].stack`, so a tool added there appears in both.

## Where the numbers come from

Every figure on the page is traceable:

- **FPL FantasyTrivia** (`youssef20031/ACL_M3`): `docs/ml_evaluation/README.md` (generated 2026-10-12, git `207fc74`) for
  model results; the app's `/health` endpoint (14 Oct 2026) for graph size; GitHub contributor stats for commit counts.
- **Ransomware detection** (private repo `seif495/ransomware-detection-tsdb`): `docs/FINDINGS.md` (Task 9, Findings
  41–43) for evaluation results; `src/detection/baseline.py` and `config.py` for the scoring rule and defaults.
- **X-CV** (`MaroSalah02/X-CV`): test-set classification report in
  `Model Fine-tuning/Models Workspaces/X-Ray Fracture Detection/module2_notebook.ipynb`.
- **Arabic QA** (`seif495/arabic-nlp-qa-rag`): `README.md` and `docs/reports/ms3_report.md`.
- **Experience, education, recognition**: the October 2026 résumé.
- **FPL screenshot** (`public/work/pitchme-home-*.webp`): the live app's home page, captured 14 Oct 2026 at
  1440×900 (and 960×600). Recapture it when the app's design changes, and update the caption in `src/content/work.ts`.

When a project changes, update the numbers at the source above and then here. To refresh the recorded traces, re-run
the three questions in `src/data/fpl-traces.json` against `POST /api/query` and replace the file.

## Deploy

The repo is ready for Vercel (`vercel.json` sets the build, output directory and long-lived caching for hashed assets).
Any static host works: deploy the `dist/` folder. If the production URL changes, update `site` in `astro.config.mjs`,
`public/robots.txt` and `public/sitemap.xml`.

## Accessibility and motion

- Every interactive panel works with a keyboard: the hero graph is a single tab stop (arrow keys move between nodes,
  Enter opens a project), tabs follow the WAI-ARIA tabs pattern, and the lab has a slider in place of hover.
- `prefers-reduced-motion` turns off the graph's draw-in, pulses, scroll reveals and transitions.
- Content renders without JavaScript; scripts only add interaction.
