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
      'python', 'typescript', 'cypher', 'xgboost', 'sklearn', 'evaluation', 'embeddings', 'llmapi',
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
    stack: ['python', 'pytorch', 'evaluation', 'cnn', 'fastapi'],
  },
  {
    id: 'arabic',
    label: 'Arabic QA (RAG)',
    kind: 'project',
    anchor: '#arabic',
    disciplines: ['llm', 'data'],
    stack: ['python', 'tensorflow', 'langchain', 'chromadb', 'embeddings', 'llmapi', 'streamlit'],
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
  role: 'Lead contributor, 185 of 218 commits',
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
      v: 'Rule-based intents and entity extraction choose one of 20+ parameterized Cypher queries over Neo4j; sentence embeddings add semantic matches; the LLM answers only from what came back.',
    },
    {
      k: 'Result',
      v: 'Live and refreshed daily. On seasons it never saw, the XGBoost model’s top-20 picks score 11% more than the best simple baseline’s.',
    },
  ] satisfies BriefItem[],
  screenshot: {
    src1440: '/work/pitchme-home-1440.webp',
    src960: '/work/pitchme-home-960.webp',
    width: 1440,
    height: 900,
    host: 'pitchme.polandcentral.cloudapp.azure.com',
    alt: 'The Pitch Me home page: the gameweek 7 deadline countdown, an “Ask the assistant” box with example questions, the week’s fixtures and the league table.',
    caption: 'The live app, branded Pitch Me, as captured on 14 Oct 2026.',
  },
  appFeatures: [
    { k: 'Assistant', v: 'Plain-English questions answered from the graph' },
    { k: 'Predictions', v: 'Next-gameweek expected points from the XGBoost model' },
    { k: 'Team of the week', v: 'A 15-player squad chosen by an optimizer within the £100m budget' },
    { k: 'Players', v: 'Typo-tolerant search and head-to-head comparisons' },
    { k: 'Trivia', v: 'Generated quiz questions on seven seasons of data' },
  ],
  graphSnapshot: {
    date: '14 Oct 2026',
    stats: [
      { value: '184,185', label: 'relationships' },
      { value: '5,248', label: 'nodes' },
      { value: '2,282', label: 'players' },
      { value: '7', label: 'seasons' },
    ],
  },
  modelStory: {
    before: 'The first points model looked excellent, with an R² of 0.72 to 0.87.',
    audit:
      'Auditing it showed an opponent-strength merge that multiplied rows 27×, and a “next match” target that mostly landed on a copy of the same match.',
    after:
      'The rebuilt v3 model sees only what is known before the deadline. Its R² is 0.32, about what knowing every player’s true season average would give, and it picks better players.',
  },
  ops: [
    { when: 'Daily', what: 'Fetch the current season from the FPL API, update the graph idempotently, write next-gameweek predictions, reload the API.' },
    { when: 'Weekly', what: 'Retrain in a child process. A candidate replaces the live model only if its held-out top-20 beats every baseline and stays within 10% of the active model.' },
    { when: 'On push', what: 'GitHub Actions redeploys the Docker Compose stack (Caddy, FastAPI, Neo4j) on an Azure VM over SSH, and rebuilds the embeddings when the data or embedding code changes.' },
  ],
  facts: [
    { k: 'Training data', v: '166,298 player × fixture rows, six seasons plus the current one' },
    { k: 'Split', v: 'Train 2020–24 · early-stop 2024–25 · test 2025–26 + 2026–27 (43 gameweeks)' },
    { k: 'Retrieval', v: 'Intent rules → 20+ parameterized Cypher queries, plus MiniLM / MPNet embeddings' },
    { k: 'Tests', v: '256 automated tests, including property-based and leakage tests' },
  ],
  limits: [
    'No historical injury or rotation data: 60% of rows are players who did not play, and that is the largest error source.',
    'Player identity is a name string, so a player spelt differently across seasons loses his history.',
    'A squared-error objective on a zero-inflated target; a two-stage minutes × points model is the next step.',
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
  tagline: 'An X-ray analysis pipeline: find the body region, decide whether a bone is fractured, box the fracture, and explain it in plain language.',
  role: 'Team of 7 · I built the fracture-classification module',
  period: 'Apr – May 2026',
  status: 'Course project · demo online',
  links: [
    { label: 'Demo', href: 'https://marosalah02.github.io/X-CV/' },
    { label: 'Source', href: 'https://github.com/MaroSalah02/X-CV' },
  ],
  stages: [
    { id: 'region', label: 'Region classifier', note: 'Which body part is this?', mine: false },
    { id: 'fracture', label: 'Fracture classifier', note: 'DenseNet-121, fractured or not', mine: true },
    { id: 'boxes', label: 'Bounding boxes', note: 'RT-DETR, only if a fracture is found', mine: false },
    { id: 'llm', label: 'LLM summary', note: 'A short, readable report', mine: false },
  ],
  brief: [
    {
      k: 'Goal',
      v: 'Turn an uploaded X-ray into a body region, a fracture verdict, a box around the fracture and a readable summary.',
    },
    {
      k: 'My part',
      v: 'The fracture classifier: MD5 de-duplication across 3,196 images, augmentation, a DenseNet-121 trained on Kaggle with tuned confidence handling, then integration into the FastAPI pipeline that streams each stage to the React UI.',
    },
    { k: 'Result', v: '89.0% accuracy and 0.959 ROC AUC on 874 held-out X‑rays.' },
  ] satisfies BriefItem[],
  confusion: { tn: 470, fp: 55, fn: 41, tp: 308 },
  auc: 0.959,
  caveat: 'A course research prototype. Not a medical device, not clinically validated.',
} satisfies CaseStudy & Record<string, unknown>;

export const arabic = {
  id: 'arabic',
  index: '04',
  title: 'Code-switched Arabic QA',
  tagline: 'Retrieval-augmented question answering over Egyptian-dialect transcripts that move between dialect, Modern Standard Arabic and English mid-sentence.',
  role: 'Team project · repo owner; ingestion, profiling, RAG system and app',
  period: 'Mar – May 2026',
  status: 'Course project',
  links: [
    { label: 'Source', href: 'https://github.com/seif495/arabic-nlp-qa-rag' },
    { label: 'Streamlit app', href: 'https://arabizi.streamlit.app/' },
  ],
  steps: [
    { k: 'Corpus', v: '13 ElDa7ee7 transcripts and 3,900 extractive QA pairs' },
    { k: 'Normalize', v: 'No stemming or lemmatization; punctuation and English tokens kept, so the dialect survives' },
    { k: 'Index', v: '1,000-character chunks, 200 overlap, multilingual MiniLM embeddings in ChromaDB' },
    { k: 'Generate', v: 'Llama 3.3 70B on Groq, automatic fallback to Gemini, a strict OUT_OF_DOMAIN guardrail' },
    { k: 'Converse', v: 'Sliding-window, truncated and summarized memory; semantic cache; team-built RNN and Transformer models (TensorFlow, from scratch) for re-ranking' },
  ],
  lesson: {
    query: 'من الذي بنى تاج محل ولماذا؟',
    queryGloss: 'Who built the Taj Mahal, and why? (formal MSA)',
    passage: 'هيبنيلها اعظم صرح',
    passageGloss: '“He’ll build her the greatest edifice” (Egyptian dialect, inside a joke about Romeo and Juliet)',
    finding:
      'The small multilingual encoder did not connect formal بنى (“built”) with colloquial هيبنيلها. Chunks that merely repeated “Taj Mahal” outranked the one holding the answer, it fell out of the top 4, and the guardrail correctly refused to guess.',
    fix: 'Next step: hybrid BM25 + dense retrieval, or an Arabic-specific encoder such as MARBERT.',
  },
} satisfies CaseStudy & Record<string, unknown>;

/** One line per case study for the index at the top of the Work section. */
export const caseIndex = [
  { id: 'fpl', index: '01', title: 'FPL FantasyTrivia', area: 'Graph-RAG · ML · MLOps', result: '+11% top-20 pick quality over the best baseline', status: 'Live' },
  { id: 'ransomware', index: '02', title: 'Ransomware detection', area: 'Anomaly detection · backend', result: '740 synthetic evaluation runs; blind spots documented', status: 'Prototype' },
  { id: 'xcv', index: '03', title: 'X-CV', area: 'Computer vision', result: '0.959 ROC AUC on 874 held-out X‑rays', status: 'Team of 7' },
  { id: 'arabic', index: '04', title: 'Code-switched Arabic QA', area: 'NLP · RAG', result: '3,900 QA pairs over dialect-heavy transcripts', status: 'Team project' },
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
