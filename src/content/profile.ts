/**
 * Identity, links and top-level copy.
 * Source of truth: résumé (Oct 2026 version) and the GitHub profile seif495.
 */
export const profile = {
  name: 'Seif Moheb',
  fullName: 'Seifeldin Moheb',
  role: 'AI & Data Engineer',
  location: 'Cairo, Egypt',
  degree: 'B.Sc. Computer Science Engineering',
  school: 'German University in Cairo',
  gradYear: 2026,
  email: 'seifmoh495@gmail.com',
  links: {
    github: 'https://github.com/seif495',
    linkedin: 'https://www.linkedin.com/in/seif-moheb-392198220/',
    resume: '/Seif_Moheb_Resume.pdf',
  },
  /** Plain-text version, used for <meta> descriptions. */
  summary:
    'Seif Moheb is an AI & data engineer in Cairo building Graph-RAG assistants, anomaly detection services and ML pipelines, and shipping them with the evaluation to back them up.',
  headline: {
    lead: 'I build data and AI systems,',
    turn: 'then try to prove them wrong.',
  },
  intro:
    'I work across RAG assistants, anomaly detection and ML pipelines, and ship them with the evidence: held-out tests, confidence intervals, leakage audits and a written list of what still fails.',
} as const;

export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#toolkit', label: 'Toolkit' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;
