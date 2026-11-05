import type { TechId } from './tech';

/**
 * Every project and role, with the facts used by the hero graph, the toolkit
 * matrix and the case studies. Numbers are taken from each repository's own
 * evaluation reports; dates and titles from the résumé.
 */

export type DisciplineId = 'llm' | 'ml' | 'cv' | 'data' | 'systems';

export const disciplines: Record<DisciplineId, { label: string }> = {
  llm: { label: 'LLMs & retrieval' },
  ml: { label: 'Machine learning' },
  cv: { label: 'Vision & reasoning' },
  data: { label: 'Data & analytics' },
  systems: { label: 'Systems & MLOps' },
};

export interface WorkItem {
  id: string;
  /** Short label for the graph and matrix. */
  label: string;
  kind: 'project' | 'role' | 'research';
  anchor: string;
  disciplines: DisciplineId[];
  /** Tools this work used, limited to Seif's own part in team projects. */
  stack: TechId[];
}

export const workItems: WorkItem[] = [
  {
    id: 'fpl',
    label: 'FPL FantasyTrivia',
    kind: 'project',
    anchor: '#fpl',
    disciplines: ['llm', 'ml', 'systems'],
    stack: [
      'python', 'typescript', 'cypher', 'xgboost', 'sklearn', 'evaluation', 'explain', 'milp', 'embeddings', 'llmapi',
      'spacy', 'pandas', 'numpy', 'matplotlib', 'neo4j', 'fastapi', 'react', 'docker', 'actions', 'azure', 'pytest',
    ],
  },
  {
    id: 'ransomware',
    label: 'Ransomware detection',
    kind: 'project',
    anchor: '#ransomware',
    disciplines: ['ml', 'data', 'systems'],
    stack: [
      'python', 'sql', 'sklearn', 'robuststats', 'evaluation', 'pandas', 'numpy', 'postgres', 'redis', 'flask',
      'docker', 'actions', 'observability', 'pytest', 'locust',
    ],
  },
  {
    id: 'xcv',
    label: 'X-CV',
    kind: 'project',
    anchor: '#xcv',
    disciplines: ['cv', 'ml'],
    stack: ['python', 'pytorch', 'evaluation', 'cnn', 'detection', 'fastapi'],
  },
  {
    id: 'arabic',
    label: 'Arabic QA (RAG)',
    kind: 'project',
    anchor: '#arabic',
    disciplines: ['llm', 'data'],
    stack: ['python', 'tensorflow', 'numpy', 'fastapi', 'langchain', 'chromadb', 'embeddings', 'llmapi', 'streamlit'],
  },
  {
    id: 'thesis',
    label: 'B.Sc. thesis',
    kind: 'research',
    anchor: '#thesis',
    disciplines: ['cv'],
    stack: ['python', 'yolo', 'opencv', 'sneps'],
  },
  {
    id: 'advansys',
    label: 'Advansys',
    kind: 'role',
    anchor: '#exp-advansys',
    disciplines: ['llm'],
    stack: [
      'python', 'langchain', 'chromadb', 'embeddings', 'openllm', 'evaluation', 'ocr', 'plotly', 'azure',
    ],
  },
  {
    id: 'enpal',
    label: 'Enpal',
    kind: 'role',
    anchor: '#exp-enpal',
    disciplines: ['data'],
    stack: ['sql', 'dax', 'powerbi', 'snowflake'],
  },
  {
    id: 'dawar',
    label: 'Dawar',
    kind: 'role',
    anchor: '#exp-dawar',
    disciplines: ['data', 'ml'],
    stack: ['python', 'pandas', 'matplotlib', 'timeseries', 'transformers'],
  },
];

export interface Link {
  label: string;
  href: string;
}

export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  tagline: string;
  role: string;
  period: string;
  status: string;
  links: Link[];
}

/** Three short, labeled statements that open a case study. */
export interface BriefItem {
  k: string;
  v: string;
}

export const fpl = {
  id: 'fpl',
  index: '01',
  title: 'FPL FantasyTrivia',
  tagline: 'A Graph-RAG assistant for Fantasy Premier League, backed by a points model that has to beat honest baselines.',
  role: 'Lead contributor, 288 of 351 commits',
  period: 'Dec 2025 – present',
  status: 'Live',
  links: [
    { label: 'Live app', href: 'https://pitchme.polandcentral.cloudapp.azure.com' },
    { label: 'Source', href: 'https://github.com/youssef20031/ACL_M3' },
    { label: 'Evaluation report', href: 'https://github.com/youssef20031/ACL_M3/blob/main/docs/ml_evaluation/README.md' },
  ],
  brief: [
    { k: 'Goal', v: 'Answer Fantasy Premier League questions from seven seasons of real data, not from an LLM’s memory.' },
    {
      k: 'Approach',
      v: 'Rule-based intents and entity extraction choose one of 30+ parameterized Cypher queries over Neo4j; sentence embeddings add semantic matches; the LLM answers only from what came back, and the answer cards are built from the query rows, not from its text.',
    },
    {
      k: 'Result',
      v: 'Live and refreshed daily. On the test seasons, the v4 model’s top-20 picks score 15% more than the best simple baseline’s (95% CI 8–21%), and since gameweek 9 it has managed its own FPL team under the real rules.',
    },
  ] satisfies BriefItem[],
  screenshot: {
    src1440: '/work/pitchme-home-1440.webp',
    src960: '/work/pitchme-home-960.webp',
    width: 1440,
    height: 900,
    host: 'pitchme.polandcentral.cloudapp.azure.com',
    alt: 'The Pitch Me home page for gameweek 10: the model’s captain pick (Erling Haaland, 5.4 expected points), an “Ask the assistant” box with example questions, the gameweek’s fixtures and the league table.',
    caption: 'The live app, branded Pitch Me, as captured on 5 Nov 2026.',
  },
  appFeatures: [
    { k: 'Assistant', v: 'Plain-English questions answered from the graph, streamed with visual answer cards' },
    { k: 'Predictions', v: 'Next-gameweek expected points, each explained with SHAP and LIME' },
    { k: 'Team of the week', v: 'The best 15 within £100m, and how the model’s past picks actually scored' },
    { k: 'ML manager', v: 'A season-long FPL team the model runs under the real rules, from gameweek 9' },
    { k: 'Clubs and matches', v: 'Club pages, match pages with goal minutes, and news' },
    { k: 'Players and trivia', v: 'Typo-tolerant search, head-to-head comparisons and generated quiz questions' },
  ],
  graphSnapshot: {
    date: '5 Nov 2026',
    stats: [
      { value: '186,199', label: 'relationships' },
      { value: '5,249', label: 'nodes' },
      { value: '2,283', label: 'players' },
      { value: '7', label: 'seasons' },
    ],
  },
  modelStory: {
    before: 'The first points model looked excellent, with an R² of 0.72 to 0.87.',
    audit:
      'Auditing it showed an opponent-strength merge that multiplied rows 27×, and a “next match” target that mostly landed on a copy of the same match.',
    after:
      'The rebuilt model sees only what is known before the deadline. v4 adds bookmaker odds, team ratings, transfer trends and FPL’s availability flags, and follows players by their FPL code. Its R² is 0.34, about what knowing every player’s true season average would give, and it picks better players.',
  },
  ops: [
    {
      when: 'Daily',
      what: 'Fetch the current season from the FPL API, update the graph idempotently, write predictions and the model’s squad pick, plan the ML manager’s next move, reload the API. Extra runs catch bookmaker prices and late team news before each deadline, and a step that only logs a problem still fails the healthcheck.',
    },
    { when: 'Weekly', what: 'Retrain in a child process. A candidate replaces the live model only if its held-out top-20 beats every baseline and stays within 10% of the active model.' },
    {
      when: 'Before a change',
      what: 'Backtest workflows score each candidate feature or planner rule over four held-out seasons with several seeds and paired bootstrap CIs. Most ideas lose and are written down as not adopted.',
    },
    { when: 'On push', what: 'Every pull request runs the tests, lint and the frontend build; a push to main redeploys the Docker Compose stack (Caddy, FastAPI, Neo4j) on an Azure VM over SSH.' },
  ],
  facts: [
    { k: 'Training data', v: '168,302 player × fixture rows, six seasons plus the current one' },
    { k: 'Features', v: '96: form, team strength, bookmaker odds, transfer trends and FPL availability, all from before the deadline' },
    { k: 'Split', v: 'Train 2020–24 · early-stop 2024–25 · test 2025–26 + 2026–27 (46 gameweeks)' },
    { k: 'Served model', v: 'An average of 5 XGBoost models, each with half the early-stopped trees' },
    { k: 'Retrieval', v: 'Intent rules → 30+ parameterized Cypher queries, plus MiniLM / MPNet embeddings' },
    { k: 'Tests', v: '800+ automated tests, including property-based and leakage tests' },
  ],
  limits: [
    'The test seasons are no longer fully untouched: October’s team-strength features were chosen with a backtest whose folds include them, and v4’s backtest gain did not hold on the untouched 2022-23 fold. Fresh evidence comes from a ledger that scores v4 against the retired v3 on every new gameweek.',
    'The evaluation report scores a single model; the app serves a five-model average, adopted because a backtest showed it picked better squads and captains.',
    'FPL availability snapshots exist for only about a dozen gameweeks of 2025-26, and 60% of rows are players who did not play, still the largest error source.',
    'A squared-error objective on a zero-inflated target; a Tweedie or two-stage minutes × points model is the next step.',
  ],
} satisfies CaseStudy & Record<string, unknown>;

export const ransomware = {
  id: 'ransomware',
  index: '02',
  title: 'Ransomware detection for backups',
  tagline: 'A multi-tenant service that flags backups that change the way an encryption attack would, and documents exactly where it is blind.',
  role: 'Solo project, 118 commits',
  period: 'Sep – Oct 2026',
  status: 'Prototype · private repository',
  links: [] as Link[],
  brief: [
    {
      k: 'Goal',
      v: 'Catch the backup that looks wrong after ransomware encrypts a file server: far more changed files, a different size.',
    },
    {
      k: 'Approach',
      v: 'Score each backup’s metadata with a modified z-score against a robust baseline per tenant and backup set. No labeled attacks needed, and flagged snapshots never enter the baseline.',
    },
    {
      k: 'Result',
      v: '100% recall on 10× spikes, 2× increases and 0.1× drops at low and medium noise across 740 synthetic runs, with the blind spots written down.',
    },
  ] satisfies BriefItem[],
  engineering: [
    { k: 'API', v: 'Flask app factory with one global auth gate: hashed tenant API keys, separate admin keys, per-IP and per-tenant rate limits.' },
    { k: 'Ingestion', v: 'Idempotent and race-safe: ON CONFLICT plus a unique constraint guarantee exactly one baseline update and one alert per snapshot.' },
    { k: 'Data', v: 'PostgreSQL with 10 versioned migrations. Tenant isolation is enforced in application code and covered route by route by tests.' },
    { k: 'Operations', v: 'Prometheus metrics, structured JSON logs, Grafana dashboards, Locust load tests, an OpenAPI spec checked against real responses.' },
    { k: 'Quality', v: '457 tests; CI fails on any skipped test. 63 numbered audit findings, each with a status and dated updates.' },
  ],
  origins:
    'It started as a comparison of anomaly-detection methods for time-series data. Isolation Forest on the SKAB pump benchmark reached 0.82 precision and 0.63 recall. A disk-I/O ransomware detector scored perfectly on simulated I/O, which says more about the simulation than about real attacks. The service uses robust statistics that need no training data and can explain every alert.',
  evaluation: {
    setup: '37 synthetic scenarios × 20 seeds = 740 runs, each series posted through the real ingest endpoint; later extended with slow drift, multiple backup sets, irregular intervals and a 365-day level shift.',
    strong: '10× spikes, 2× increases, 0.1× drops and 5× ramps: 100% recall at low and medium noise, detected on the first affected snapshot in nearly every run.',
    noise: 'False alerts on clean series: none at low noise, 0.14% at medium, 1.4% at high (about one per 70 daily backups).',
  },
  limits: [
    'A 1.3× rise in changed files alone is caught 24% of the time at medium noise, 7% at high.',
    'Weekly patterns cause weekend false alerts (29.2%). An opt-in day-of-week baseline cuts that to 0.2%, at a measured cost in recall.',
    'All evaluation is synthetic: real backup metadata has heavy tails, holidays and correlated features.',
  ],
} satisfies CaseStudy & Record<string, unknown>;

export const xcv = {
  id: 'xcv',
  index: '03',
  title: 'X-CV',
  tagline: 'An X-ray analysis pipeline: check that the upload is an X-ray, find the body region, decide whether a bone is fractured, box the fracture, and explain it in plain language.',
  role: 'Team of 7 · mine: the fracture classifier, the X-ray check and the detector benchmark',
  period: 'Apr – May 2026; Oct – Nov 2026',
  status: 'Course project · demo backend offline',
  links: [
    { label: 'Demo', href: 'https://marosalah02.github.io/X-CV/' },
    { label: 'Source', href: 'https://github.com/MaroSalah02/X-CV' },
  ],
  stages: [
    { id: 'gate', label: 'X-ray check', note: 'EfficientNet-B0, stops non-X-ray uploads', mine: true },
    { id: 'region', label: 'Region classifier', note: 'Which body part is this?', mine: false },
    { id: 'fracture', label: 'Fracture classifier', note: 'DenseNet-121, fractured or not', mine: true },
    { id: 'boxes', label: 'Bounding boxes', note: 'RT-DETR, only if a fracture is found', mine: false },
    { id: 'llm', label: 'LLM summary', note: 'A short, readable report', mine: false },
  ],
  brief: [
    {
      k: 'Goal',
      v: 'Turn an uploaded X-ray into a body region, a fracture verdict, a box around the fracture and a readable summary, and turn away anything that is not an X-ray.',
    },
    {
      k: 'My part',
      v: 'The fracture classifier, a DenseNet-121 trained on Kaggle and wired into the FastAPI pipeline that streams each stage to the React UI. An audit showed the first version’s test split leaked into training, so in October I rebuilt its data pipeline (near-duplicate clustering, patient-level splits, dropping a dataset whose labels could be read from image style), retrained it on FracAtlas and GRAZPEDWRI-DX, and added the X-ray check, which rejects 99.87% of 10,800 held-out non-X-ray images. In November I benchmarked three box detectors on a leakage-free split.',
    },
    {
      k: 'Result',
      v: 'On clean test sets, ROC AUC 0.930 on 579 FracAtlas X‑rays and 0.982 on 1,951 GRAZPEDWRI-DX wrist X‑rays. For the boxes, on the same budget, Faster R-CNN reached 0.41 mAP@50 and the deployed RT-DETR 0.11; its old 0.71 came from a leaky split.',
    },
  ] satisfies BriefItem[],
  // FracAtlas test without surgical hardware, at the deployed threshold (0.241, Youden on FracAtlas val)
  confusion: { tn: 466, fp: 25, fn: 17, tp: 71 },
  auc: 0.93,
  caveat:
    'A course research prototype. Not a medical device, not clinically validated. Images with surgical hardware were kept out of training and score worse (AUC 0.80 on 69 wrist X-rays).',
} satisfies CaseStudy & Record<string, unknown>;

export const arabic = {
  id: 'arabic',
  index: '04',
  title: 'Code-switched Arabic QA',
  tagline: 'Retrieval-augmented question answering over Egyptian-dialect transcripts that move between dialect, Modern Standard Arabic and English mid-sentence.',
  role: 'Team project · repo owner; ingestion, profiling, RAG system and the live site',
  period: 'Mar – May 2026; live site Oct 2026',
  status: 'Live',
  links: [
    { label: 'Live app', href: 'https://arabizy.vercel.app/' },
    { label: 'Source', href: 'https://github.com/seif495/arabic-nlp-qa-rag' },
    { label: 'Model selection', href: 'https://github.com/seif495/arabic-nlp-qa-rag/blob/main/docs/reports/ms3_web_model_selection.md' },
  ],
  brief: [
    {
      k: 'Goal',
      v: 'Answer questions about 13 episodes of ElDa7ee7, a popular-science show told in Egyptian dialect, using only what the transcripts say.',
    },
    {
      k: 'Approach',
      v: 'Rewrite the question into Arabic, retrieve transcript chunks with BM25, optionally re-rank them with the team’s own from-scratch model, and let a hosted LLM answer from those chunks or refuse.',
    },
    {
      k: 'Result',
      v: 'Live on Vercel as one Python function. The team’s TensorFlow models run as NumPy ports whose float16 weights reproduce the TensorFlow dev scores exactly.',
    },
  ] satisfies BriefItem[],
  screenshot: {
    src1440: '/work/arabizy-chat-1440.webp',
    src960: '/work/arabizy-chat-960.webp',
    width: 1440,
    height: 900,
    host: 'arabizy.vercel.app',
    alt: 'The chatbot answering “How does the octopus see colors?” in Arabic. The open retrieval log shows the question rewritten into Egyptian Arabic, the Groq model used, per-step timings and the retrieved octopus-episode chunks with their BM25 and MS2 scores.',
    caption: 'The live site on 5 Nov 2026: an English question answered in Arabic from the octopus episode, with the retrieval log open.',
  },
  appFeatures: [
    { k: 'Generation modes', v: 'LLM only, MS2 model only, or both side by side' },
    { k: 'Re-ranking', v: '30 BM25 candidates re-ordered by a 50/50 blend with the MS2 model’s similarity score' },
    { k: 'Memory', v: 'Four context-window strategies; the history lives in the browser' },
    { k: 'Prompts', v: 'Four strategies: Arabic or English, guided or minimal' },
    { k: 'Logs', v: 'Rewritten query, chunks, scores and timings for every answer' },
  ],
  bakeoff: {
    rows: [
      { model: 'Model A', arch: 'Tri-encoder RNN + FiLM decoder', params: '2.42M', em: '0.068', f1: '0.100', site: 'Default' },
      { model: 'Model B', arch: 'RoPE Transformer', params: '2.28M', em: '0.058', f1: '0.097', site: 'Selectable' },
      { model: 'Vanilla', arch: 'Sinusoidal Transformer', params: '4.10M', em: '0.046', f1: '0.087', site: 'Selectable' },
      { model: 'RNN variant', arch: 'Config-driven RNN', params: '3.72M', em: '0.019', f1: '0.068', site: 'Not shipped' },
    ],
    finding:
      'All four were trained with one recipe and ranked on decoded answers, not loss: the vanilla Transformer had the lowest dev loss and still came third. Trained from scratch on 3.5k pairs, none is good enough to answer alone, so the site labels their answers experimental and shows them next to the LLM’s.',
  },
  steps: [
    { k: 'Corpus', v: '13 ElDa7ee7 Season 8 transcripts and 3,900 extractive QA pairs' },
    { k: 'Normalize', v: 'No stemming or lemmatization; punctuation and English tokens kept, so the dialect survives' },
    { k: 'Chunk', v: '594 chunks of 1,000 characters with 200 overlap' },
    {
      k: 'Retrieve',
      v: 'The question is rewritten into Arabic, then BM25 ranks light-stemmed tokens. The course build used multilingual MiniLM embeddings in ChromaDB; PyTorch does not fit in a Vercel function',
    },
    { k: 'Re-rank', v: 'Optional: the MS2 model’s question and chunk encodings re-order the top 30 by cosine similarity, blended with BM25' },
    {
      k: 'Generate',
      v: 'GPT-OSS 120B on Groq, switching automatically when Groq retires a model; Gemini 2.5 Flash as fallback; a strict OUT_OF_DOMAIN guardrail',
    },
    {
      k: 'Serve',
      v: 'FastAPI on Vercel. The team’s TensorFlow models run as NumPy ports, parity-tested against TensorFlow layer by layer',
    },
  ],
  lesson: {
    query: 'من الذي بنى تاج محل ولماذا؟',
    queryGloss: 'Who built the Taj Mahal, and why? (formal MSA)',
    passage: 'هيبنيلها اعظم صرح',
    passageGloss: '“He’ll build her the greatest edifice” (Egyptian dialect, inside a joke about Romeo and Juliet)',
    finding:
      'In the course build, the small multilingual encoder did not connect formal بنى (“built”) with colloquial هيبنيلها. Chunks that merely repeated “Taj Mahal” outranked the one holding the answer, it fell out of the top 4, and the guardrail correctly refused to guess.',
    rewrite: 'مين اللي بنى تاج محل وإيه السبب؟',
    found: 'Shah Jahan built it “for her memory, not his glory”',
    after:
      'The live site gets there by a different route: it never matched the joke, it found a plainer chunk. Lexical retrieval still misses paraphrases that share no words, so an Arabic-specific encoder such as MARBERT is the next step.',
    checked: '5 Nov 2026',
  },
} satisfies CaseStudy & Record<string, unknown>;

/** One line per case study for the index at the top of the Work section. */
export const caseIndex = [
  { id: 'fpl', index: '01', title: 'FPL FantasyTrivia', area: 'Graph-RAG · ML · MLOps', result: '+15% top-20 pick quality over the best baseline', status: 'Live' },
  { id: 'ransomware', index: '02', title: 'Ransomware detection', area: 'Anomaly detection · backend', result: '740 synthetic evaluation runs; blind spots documented', status: 'Prototype' },
  { id: 'xcv', index: '03', title: 'X-CV', area: 'Computer vision', result: '0.930 ROC AUC on clean FracAtlas test X‑rays', status: 'Team of 7' },
  { id: 'arabic', index: '04', title: 'Code-switched Arabic QA', area: 'NLP · RAG', result: 'Live chatbot over 13 dialect-heavy transcripts', status: 'Live' },
];

export const moreWork = [
  {
    id: 'thesis',
    title: 'Integrating KRR and CV: the case of YOLO and SNePS',
    kind: 'B.Sc. thesis · grade Excellent',
    text: 'Neuro-symbolic scene understanding: YOLO instance segmentation finds objects, spatial relations (left of, above, in front of, behind) are derived from the masks, and the scene is written out as SNePSLOG assertions a symbolic reasoner can query.',
    links: [
      { label: 'Thesis PDF', href: 'https://drive.google.com/file/d/1rafu573XdRuhE3Buvb3GnBUoXpTjerW5/view?usp=sharing' },
      { label: 'Code', href: 'https://github.com/seif495/YOLO-KRR' },
    ],
  },
  {
    id: 'marketplace',
    title: 'Freelance marketplace microservices',
    kind: 'Team of 16 · contract service',
    text: 'Spring Boot services with service-owned data, RabbitMQ domain events and a compensating payment saga. I worked on the contract service’s saga consumer and event listeners.',
    links: [{ label: 'Source', href: 'https://github.com/Sherlemious/26-Oceans15-Freelance' }],
  },
];
