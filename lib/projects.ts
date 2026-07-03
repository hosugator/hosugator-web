// lib/projects.ts — 프로젝트 슬러그·조회·아키텍처 플로우
import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';

export const shortNameOf = (title: string) => title.split(':')[0].trim();

export const slugify = (title: string) =>
  shortNameOf(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const projectSlugs = (): string[] => projectsData.items.map((p) => slugify(p.title));

export type ProjectItem = typeof projectsData.items[number];

export function getProject(slug: string, locale: 'ko' | 'en'): ProjectItem | null {
  const items = (locale === 'en' ? projectsDataEn : projectsData).items;
  return items.find((p) => slugify(p.title) === slug) || null;
}

// 관련 노트 기반 아키텍처 플로우 (기술 용어라 언어 중립)
export interface Flow {
  label: string;
  stages: string[];
}

// Flow(선형 단계)를 Mermaid flowchart 문자열로 변환
export function flowToMermaid(flow: Flow): string {
  const esc = (s: string) => s.replace(/"/g, "'");
  const lines: string[] = ['flowchart LR'];
  for (let i = 0; i < flow.stages.length - 1; i++) {
    lines.push(`  n${i}["${esc(flow.stages[i])}"] --> n${i + 1}["${esc(flow.stages[i + 1])}"]`);
  }
  return lines.join('\n');
}

// 리치 커스텀 Mermaid (있으면 flow 변환 대신 사용). 슬러그당 다이어그램 배열.
export const PROJECT_MERMAID: Record<string, string[]> = {
  'edge-ai-lmr': [
    `flowchart LR
  F["Field · PLC 10ms"] --> C["Control"] --> E["Edge"] --> Cl["Cloud"]`,
    `flowchart LR
  M1["M1 · 1D-CNN AE"] -->|Anomaly Score| M2["M2 · LSTM + XGBoost"] -->|Quality| M3["M3 · DQN 처방제어"]`,
  ],
  'alignai': [
    `flowchart LR
  I["공정 이미지"] --> P["전처리"] --> EN["Encoder · EfficientNet-B0"] --> DE["Decoder · Dice Loss"] --> M["Seg Mask"] --> A["중심선 → 액추에이터"]`,
    `flowchart LR
  G["GitHub push"] --> CI["ci.yml · build"] --> R["GHCR"] --> AR["Argo CD"] --> K["k3s"]`,
  ],
};

export const PROJECT_FLOWS: Record<string, Flow[]> = {
  'edge-ai-lmr': [
    { label: '4-Tier Architecture', stages: ['Field', 'Control', 'Edge', 'Cloud'] },
    { label: '3-Stage AI Chain', stages: ['1D-CNN AE', 'LSTM + XGBoost', 'DQN'] },
  ],
  'alignai': [
    { label: 'Vision', stages: ['OpenCV (rule-based)', 'U-Net Segmentation'] },
    { label: 'GitOps ML CI/CD', stages: ['Code', 'GitHub Actions', 'GHCR', 'Argo CD', 'k3s'] },
  ],
  'erp-backup': [
    { label: 'Automation Pipeline', stages: ['Legacy ERP', 'Playwright · Promise.all', 'CSV Audit Log'] },
  ],
  'hosugator': [
    { label: 'Keyless CI/CD', stages: ['GitHub', 'Actions · IAM OIDC', 'S3 + CloudFront'] },
  ],
  'dotodo': [
    { label: 'RAG Pipeline', stages: ['STT', 'RAG · ChromaDB', 'LLM', 'LLM-as-Judge'] },
  ],
  'sodamdiary': [
    { label: 'VLM 3-Stage', stages: ['BLIP', 'CLIP', 'LLM'] },
  ],
  'pictag': [
    { label: '4-Thread Pipeline', stages: ['Capture', 'Detection', 'Embedding', 'Re-ID'] },
  ],
  'kdlc': [
    { label: '3-Model Ensemble', stages: ['SARIMA', 'LSTM', 'LightGBM', 'Weighted Ensemble'] },
  ],
  'go2fit': [
    { label: 'Exercise FK Chain', stages: ['Session', 'Exercise', 'Set', 'RepAnalysis'] },
  ],
  'cureat': [
    { label: 'Curation Pipeline', stages: ['Collect', 'Ko-BERT Filter', 'Okt Intent', '2-Stage Search'] },
  ],
  'dorosee': [
    { label: 'Multimodal UGV', stages: ['YOLOv8', 'LLM Voice', 'UGV Control'] },
  ],
};
