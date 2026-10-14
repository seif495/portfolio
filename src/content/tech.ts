/**
 * Technology registry. Each entry appears in the toolkit matrix; `graph: true`
 * also places it in the hero knowledge graph. Which work item used which tool
 * is declared once, in `work.ts` (`stack`), and verified against the repos.
 */
export const techCategories = [
  'Languages',
  'Modeling & evaluation',
  'LLMs & retrieval',
  'Vision & reasoning',
  'Data & analytics',
  'Databases',
  'Services & interfaces',
  'Infrastructure & quality',
] as const;

export type TechCategory = (typeof techCategories)[number];

interface TechDef {
  label: string;
  cat: TechCategory;
  graph?: boolean;
}

export const tech = {
  python: { label: 'Python', cat: 'Languages' },
  sql: { label: 'SQL', cat: 'Languages' },
  typescript: { label: 'TypeScript', cat: 'Languages' },
  cypher: { label: 'Cypher', cat: 'Languages' },
  dax: { label: 'DAX', cat: 'Languages' },

  xgboost: { label: 'XGBoost', cat: 'Modeling & evaluation', graph: true },
  sklearn: { label: 'scikit-learn', cat: 'Modeling & evaluation' },
  pytorch: { label: 'PyTorch', cat: 'Modeling & evaluation', graph: true },
  tensorflow: { label: 'TensorFlow', cat: 'Modeling & evaluation', graph: true },
  transformers: { label: 'Hugging Face Transformers', cat: 'Modeling & evaluation' },
  timeseries: { label: 'Time-series regression', cat: 'Modeling & evaluation' },
  robuststats: { label: 'Robust statistics (median/MAD)', cat: 'Modeling & evaluation', graph: true },
  evaluation: { label: 'Evaluation design', cat: 'Modeling & evaluation', graph: true },

  langchain: { label: 'LangChain', cat: 'LLMs & retrieval', graph: true },
  chromadb: { label: 'ChromaDB', cat: 'LLMs & retrieval', graph: true },
  embeddings: { label: 'Sentence embeddings (Hugging Face)', cat: 'LLMs & retrieval', graph: true },
  llmapi: { label: 'Hosted LLMs (Groq, Gemini)', cat: 'LLMs & retrieval' },
  openllm: { label: 'Open-weight LLMs (Llama 3.1, Zephyr)', cat: 'LLMs & retrieval' },
  spacy: { label: 'spaCy', cat: 'LLMs & retrieval' },

  cnn: { label: 'CNN classifiers (DenseNet-121)', cat: 'Vision & reasoning' },
  yolo: { label: 'YOLO segmentation', cat: 'Vision & reasoning', graph: true },
  opencv: { label: 'OpenCV', cat: 'Vision & reasoning' },
  ocr: { label: 'OCR (Tesseract, Azure)', cat: 'Vision & reasoning', graph: true },
  sneps: { label: 'SNePS / SNePSLOG', cat: 'Vision & reasoning', graph: true },

  pandas: { label: 'pandas', cat: 'Data & analytics' },
  numpy: { label: 'NumPy', cat: 'Data & analytics' },
  matplotlib: { label: 'Matplotlib / Seaborn', cat: 'Data & analytics' },
  plotly: { label: 'Plotly', cat: 'Data & analytics' },
  powerbi: { label: 'Power BI', cat: 'Data & analytics', graph: true },
  snowflake: { label: 'Snowflake', cat: 'Data & analytics', graph: true },

  neo4j: { label: 'Neo4j', cat: 'Databases', graph: true },
  postgres: { label: 'PostgreSQL', cat: 'Databases', graph: true },
  redis: { label: 'Redis', cat: 'Databases' },

  fastapi: { label: 'FastAPI', cat: 'Services & interfaces', graph: true },
  flask: { label: 'Flask', cat: 'Services & interfaces' },
  react: { label: 'React', cat: 'Services & interfaces', graph: true },
  streamlit: { label: 'Streamlit', cat: 'Services & interfaces' },

  docker: { label: 'Docker', cat: 'Infrastructure & quality', graph: true },
  actions: { label: 'GitHub Actions', cat: 'Infrastructure & quality' },
  azure: { label: 'Azure', cat: 'Infrastructure & quality' },
  observability: { label: 'Prometheus & Grafana', cat: 'Infrastructure & quality' },
  pytest: { label: 'pytest', cat: 'Infrastructure & quality' },
  locust: { label: 'Locust load tests', cat: 'Infrastructure & quality' },
} satisfies Record<string, TechDef>;

export type TechId = keyof typeof tech;

/** On the résumé, but not tied to a featured project on this page. */
export const alsoUsed = ['Java', 'MongoDB', 'Firebase', 'Git', 'Jupyter'];
