/**
 * Professional experience, education and recognition, from the latest résumé.
 * Dates are [year, month] with month 1–12; `end` is inclusive.
 */

export type YM = readonly [number, number];

export interface Role {
  id: string;
  company: string;
  companyNote?: string;
  url: string;
  title: string;
  location: string;
  start: YM;
  end: YM;
  readout: { value: string; label: string }[];
  points: string[];
  stack: string[];
}

export const roles: Role[] = [
  {
    id: 'enpal',
    company: 'Enpal',
    url: 'https://www.enpal.com/',
    title: 'Data Analyst Intern',
    location: 'New Cairo, Egypt',
    start: [2025, 8],
    end: [2026, 1],
    readout: [{ value: '95%', label: 'faster semantic-model refresh' }],
    points: [
      'Built automated reports with SQL and DAX in Power BI for cross-country teams.',
      'Created custom queried views in Snowflake that cut semantic-model refresh time by 95%.',
      'Helped onboard newly hired data analysts to Snowflake, Power BI and SQL.',
    ],
    stack: ['SQL', 'DAX', 'Power BI', 'Snowflake'],
  },
  {
    id: 'dawar',
    company: 'Dawar',
    companyNote: 'Environ Adapt',
    url: 'https://dawarapp.com/',
    title: 'Data Science Intern',
    location: 'Giza, Egypt',
    start: [2025, 7],
    end: [2025, 8],
    readout: [{ value: 'Hybrid', label: 'time-series regressors + DistilBERT sentiment' }],
    points: [
      'Prepared ML-ready datasets from rPET and commodity price logs (2020–2025), using Seaborn and Matplotlib to surface market correlations and trend anomalies.',
      'Designed a hybrid price-forecasting model that combines time-series regressors with DistilBERT sentiment analysis of socioeconomic indicators.',
    ],
    stack: ['Python', 'pandas', 'Seaborn', 'DistilBERT'],
  },
  {
    id: 'advansys',
    company: 'Advansys',
    url: 'https://advansys-esc.com/',
    title: 'AI Engineer Intern',
    location: 'Cairo, Egypt',
    start: [2024, 7],
    end: [2024, 9],
    readout: [
      { value: '96.5%', label: 'faithfulness' },
      { value: '94.6%', label: 'relevancy' },
    ],
    points: [
      'Engineered an agentic RAG system for financial analysis with LangChain, Zephyr-7B, Llama-3.1 and ChromaDB, fed by a multilingual OCR pipeline (Tesseract, Azure Cognitive OCR) for complex documents.',
      'Designed a custom evaluation framework for retrieval quality, reaching 96.5% faithfulness and 94.6% relevancy by tuning embeddings (all-mpnet-base-v2) and document chunking.',
      'Created a selective visualization tool that uses small LLMs and Plotly to turn unstructured financial data into analytical charts.',
    ],
    stack: ['LangChain', 'Llama 3.1', 'ChromaDB', 'Tesseract', 'Azure OCR', 'Plotly'],
  },
];

export const education = {
  school: 'German University in Cairo',
  degree: 'Bachelor of Computer Science Engineering',
  start: [2021, 10] as YM,
  end: [2026, 6] as YM,
  grade: 'Very Good',
  thesis: {
    title: 'Integrating KRR and CV: The case of YOLO and SNePS',
    grade: 'Excellent',
  },
};

export const recognition = [
  {
    when: 'Oct 2025',
    title: 'Top 5 teams, Henkel ThinkTech Hackathon',
    text: '',
  },
  {
    when: 'Mar 2022 – present',
    title: 'Lead, Computer Engineering Student Curriculum Committee',
    text: 'Selected by the Vice-Dean; represented a faculty major of 650 students in ACQUIN accreditation meetings.',
  },
];

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'C2' },
  { name: 'German', level: 'C1' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtYM([y, m]: YM): string {
  return `${MONTHS[m - 1]} ${y}`;
}

export function fmtRange(start: YM, end: YM): string {
  return start[0] === end[0]
    ? `${MONTHS[start[1] - 1]} – ${MONTHS[end[1] - 1]} ${end[0]}`
    : `${fmtYM(start)} – ${fmtYM(end)}`;
}

/** Inclusive month count. */
export function months(start: YM, end: YM): number {
  return (end[0] - start[0]) * 12 + (end[1] - start[1]) + 1;
}
