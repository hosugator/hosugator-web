// data/resumeData.en.ts
// English counterpart of resumeData.ts. Same shape (ResumeData).
// Keep in sync with the Korean source when either changes.

import type { ResumeData } from './resumeData';

export const resumeDataEn: ResumeData = {
  name: 'Seungwan Hong',
  headline: 'AI Engineer · Solving business problems with code',
  summary: [
    "An AI engineer who starts from 'why' and can build a product end to end. A background as a global EPC project manager gives me a feel for long-running projects and a talent for translating layered stakeholder needs — grounded in their 'why' — into technical specifications.",
    'That curiosity grew into a full-stack AI engineer who understands every layer of a project: planning, data, ML, infra, backend, DB, UI/UX and operations. The payoff is knowing exactly where to invest resources to clear the current bottleneck.',
    'Today I work as an AI developer in manufacturing: automating cross-team workflows, validating vision-alignment and anomaly-detection models in production, and single-handedly building a GitOps pipeline. I also prototyped an agent that lets an LLM explain vision-detection results in field language and address issues proactively.',
    'I resist letting technology stay merely technical. Thinking about how to turn technology into a genuinely useful tool on the floor is something I believe every role, at any scale, should carry.',
  ],
  experience: [
    {
      company: 'DTK',
      role: 'AI Developer',
      period: 'Mar 2026 – Present',
      items: [
        {
          title: 'AlignAI: Vision-alignment automation + ML CI/CD + multi-product scaling',
          body: 'Replaced environment-sensitive OpenCV (Canny + manual thresholds) with a U-Net (EfficientNet-B0) segmentation model. Dice Loss, skip-connection tuning and an Albumentations pipeline reached Q-display 100% detection / 91% pass / ~330ms CPU inference and Q-edge 100% / 100%. Tamed the branch explosion from three products with a ProductConfig @dataclass registry (a new product = one config line). A three-file checkpoint split (latest.pth / best_vN.pth / best_vN.onnx) structurally removed the bad-state-on-resume bug. Single-handedly built the ML CI/CD pipeline (train → ONNX → image build → Harbor → Argo CD rolling update) with layer-fingerprint skip to avoid needless retraining. Documented the GITHUB_TOKEN downstream-trigger workaround (workflow_dispatch) and the Argo CD Job re-creation fix (resource.exclusions) as ADRs.',
        },
        {
          title: 'AlignAI: Edge-AI k3s cluster deployment infrastructure',
          body: 'Designed and locally validated an edge-AI deployment stack on a gateway PC (Linux + k3s) with GitHub as the single source of truth (GitOps). Split inference images (Deployment, always-on) from training images (Job, manual trigger) into independent CI pipelines (ci.yml / train.yml), with end-to-end automation from code change → GitHub Actions → GHCR → Argo CD diff → rolling deploy. Verified self-healing resilience (OOM / abnormal process exit) under a replica:1 setup via liveness/readiness probes and Argo CD self-heal. Excluded the Windows C-SDK equipment PC from the cluster — a deployment boundary matched to field reality.',
        },
        {
          title: 'LLM agent roadmap: field multimodal agent (in progress)',
          body: 'Building an LLM agent step by step toward the scenario of an operator asking "why did the anomaly happen?". Completed Stage 1 (text API) → 2 (multimodal) → 3 (tool use / function calling from scratch) → 4 (RAG, hands-on embeddings) → 5 (ReAct loop where the model itself decides when to stop). Internalized the structural difference between tool_calls (control flow in code) and the ReAct loop (model-driven control) at the code level. Stage 6 integrated prototype (screen + logs + code → judgment / anomaly explanation / action proposal) is planned.',
        },
        {
          title: 'Edge AI LMR: anomaly-detection system design',
          body: 'Designed a four-layer Field→Control→Edge→Cloud architecture for lens thermoforming. MQTT binary batching plus a tiered gRPC / SQLite-Parquet storage strategy guarantee lossless handling of 10ms high-frequency PLC data, with Cycle_ID as the Golden Key enabling a single-key join of multi-axis spatiotemporal sensor data across every layer. A three-stage AI chain (1D-CNN AE → LSTM+XGBoost → DQN) with Anomalib (PatchCore) reached AUROC 99.99%. Built GPU inference containers on k3s via NVIDIA Device Plugin / CDI and solely operate a React+TS HMI dashboard.',
        },
        {
          title: 'AOI (Sungkyunkwan Univ. collaboration): data-centric comparison',
          body: 'Ran a parallel comparison of three appearance-inspection approaches — PatchCore (few-shot normal-feature distance), SAM (pixel segmentation) and synthetic data. Found SAM technically precise but bottlenecked by operator re-labeling across sites/variants, and shared internally the deployment advantage of an image-level approach.',
        },
        {
          title: 'Agentic ERP automation',
          body: 'In week one, solved the backup bottleneck of tens of thousands of approval documents in the legacy K-System Ace ERP with a self-built Playwright web-migration engine. Chose Playwright over Selenium/AutoHotkey for the no-API, non-standard dynamic-popup environment, and structurally eliminated async popup race conditions with Promise.all concurrency. POM pattern, .env + .gitignore credential separation, and a full CSV audit log turned weeks of manual work into 100%-consistent unattended automation.',
        },
        {
          title: 'Corning Varioptic contract-negotiation focal point',
          body: 'Voluntarily served as focal point for the distributor contract with French optical-actuator firm Corning Varioptic — reviewing terms, running the technical/commercial negotiation channel with the overseas contact, closing the contract, then arranging the Korea visit, official introductions and first tech training. Independently exploring integration of their products with DTK’s core lens/optics systems.',
        },
      ],
    },
    {
      company: 'Zeeco Asia',
      role: 'Project Manager',
      period: 'Feb 2024 – Apr 2025',
      items: [
        {
          title: 'Leading global EPC projects and optimizing profitability',
          body: 'Led a multi-billion-KRW system-replacement project through commissioning at a global combustion-equipment firm. As the communication hub reconciling technical conflicts across three countries (US/India/Korea), I translated abstract field needs into specs, explained risk and trade-offs to non-technical decision-makers, and exceeded the target margin by 4% through Q/C/D management and proactive risk response.',
        },
      ],
    },
  ],
  projects: [
    {
      category: 'Generative AI & LLM Agent',
      name: 'Dotodo — personalized to-do LLM RAG service',
      body: "Voice-STT RAG recommendation agent. Split Backend/Model servers on AWS EC2 MSA for independent model upgrades. Mecab-ko morphological analysis + 768D ChromaDB vector search and a FastAPI asyncio pipeline cut LLM latency 60%. An 'LLM as a Judge' loop self-scores recommendations on relevance/usefulness and regenerates low scores; calling the judge only on the lowest-scoring items cut API cost 60%. Solved cold start by seeding popular tasks.",
    },
    {
      category: 'Generative AI & LLM Agent',
      name: 'Sodam Diary — VLM photo narration for the visually impaired',
      body: 'Designed a three-stage multimodal pipeline (BLIP → CLIP cosine Top-3 → LLM) to replace standalone GPT-4V (₩1.3M/mo, 30s). OpenVINO 4-bit quantization and asyncio parallelism cut cost 30% and response time 30s→20s. Rebuilt a synchronous Django ORM bottleneck on FastAPI + Docker. Finalist, 2025 Korea Disability Hackathon.',
    },
    {
      category: 'Generative AI & LLM Agent',
      name: 'Cureat — AI food curation and data governance',
      body: 'Collected fragmented unstructured food data and removed 20%+ of promotional content via Ko-BERT filtering. Implemented refined personalized recommendations through a two-stage hybrid search pipeline.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'AlignAI — vision-alignment automation + edge-AI infra (DTK)',
      body: 'Shifted rule-based OpenCV to U-Net (EfficientNet-B0) segmentation: encoder pretraining sped convergence 3×, Dice Loss overcame class imbalance (99% background vs 1% alignment line). Q-display 100% detection / 91% pass / ~330ms CPU; Q-edge 100%/100%. ProductConfig registry manages three products in one repo. GitHub-SSOT GitOps — separated inference/training image lifecycles, single-handed GHCR → Argo CD auto-deploy E2E, probe + self-heal OOM verification.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'Dorosee — multimodal AI platform for emergency detection',
      body: 'Grand Prize, 2025 UWC Hackathon. A UGV platform combining fine-tuned YOLOv8 with an LLM voice interface. Built a Unity 3D simulation to overcome hardware constraints and complete integrated AI-model testing.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'Pic-Tag — lightweight CCTV AI SaaS for small businesses',
      body: 'Decomposed the YOLO backbone to A/B three embedding methods (Linear, Pooling, Attention Head); Attention improved both Re-ID accuracy and training efficiency 50%↑ and was adopted. OpenVINO INT8 quantization enabled real-time inference on GPU-less edge devices. Four-thread independent-queue pipeline (Capture/Detection/Embedding/Re-ID) and a Django+WebSocket heatmap dashboard.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'KDLC — logistics demand forecasting (competition)',
      body: 'Engineered 45+ features (lag, rolling, sin/cos seasonality, holidays, promotions). Blocked data leakage structurally with TimeSeriesSplit and built a weighted 3-model ensemble (SARIMA, LSTM, LightGBM) with weights auto-derived from inverse validation RMSE. Demonstrated feature engineering matters more than model choice.',
    },
    {
      category: 'Cloud-Native & Infrastructure',
      name: 'Hosugator Web — TCO-optimized cloud infrastructure',
      body: 'Migrated AWS serverless (ALB+ECS) to a self-managed EC2/Nginx setup, cutting TCO 80%. Built passwordless CI/CD by pairing GitHub Actions with IAM OIDC for keyless, role-based temporary credentials. Finally moved to S3 static hosting to match the site’s static nature.',
    },
    {
      category: 'Cloud-Native & Infrastructure',
      name: 'ERP Backup — legacy ERP automation pipeline (DTK)',
      body: 'Solved the manual-extraction bottleneck of tens of thousands of approval documents in a no-API legacy web ERP with a single-built Playwright + Promise.all agentic pipeline. POM pattern, credential separation and a full CSV audit log turned days of manual work into 100%-consistent unattended automation.',
    },
    {
      category: 'Full-Stack AI Product Backend',
      name: 'go2fit — fitness social-app backend & DB design',
      body: 'Solely designed a three-axis PostgreSQL schema (User/Exercise/Community): User on a UUID PK (Kakao social, kakao_id UNIQUE), Exercise as a 5-layer FK chain (Session→Exercise→Video→Set→RepAnalysis), Community as Post+Like+Comment, with a cross-domain FK (Post.session_id→Session) wiring workouts into the social feed. Four-layer security: JWT + refresh-token rotation (only SHA-256 hashes in DB) + token blacklist + idempotency keys. MediaPipe per-exercise analyzers in a DDD structure, with an async video-analysis job queue (FSM) and a face-anonymization pipeline split out as separate services.',
    },
  ],
  insights: [
    {
      label: 'Automation',
      quote: 'Any bottleneck that repeats 3+ times must be automated.',
      body: 'In week one I turned manual extraction of tens of thousands of documents into 100%-consistent unattended automation via a Playwright agentic pipeline, under a no-API constraint. But I confirmed that in git-worktree multi-branch parallel work, the human limit on holding context is the real bottleneck — you must define the scope of automation first to avoid yak shaving.',
    },
    {
      label: 'System design',
      quote: 'Define the data’s golden key first and the rest of the system follows.',
      body: 'Facing multi-axis sensor data that timestamps alone couldn’t join, I set Cycle_ID as the Golden Key — enabling a single-key join across every layer and a reproduce-and-prescribe loop for anomaly windows. Confirmed the data model must precede infra design.',
    },
    {
      label: 'Evaluation design',
      quote: 'Whether a model is good is decided by how you design its evaluation.',
      body: 'With <1% anomaly rate on Edge AI LMR, 99% accuracy was meaningless — so I redefined AUROC as the core metric. On Dotodo an LLM-as-a-Judge loop validated quality without humans and cut API cost 60%. No deployment without evaluation.',
    },
    {
      label: 'Trade-offs',
      quote: 'The sweet spot between accuracy and latency is decided only by field data.',
      body: 'On AlignAI I chose CPU ONNX Runtime over TensorRT after measuring field inference frequency and hardware. Confirming ~330ms was ample against the process cycle, I kept the structure simple. The latest tech isn’t always the field optimum.',
    },
    {
      label: 'Business sense',
      quote: 'A technically better decision isn’t always better once relationship and business cost are counted.',
      body: 'As an EPC PM I chose a spec three countries could agree on over the technical optimum, and delivered. On AOI I shared the deployment advantage of an image-level approach over SAM’s precision, on the grounds of multi-site re-labeling bottlenecks. A technology choice is an operating cost.',
    },
    {
      label: 'Knowledge management',
      quote: 'Store the context and decisions AI can’t replace in a PKM.',
      body: 'To fix context loss when CLI AI sessions end, I built a workflow that vector-indexes notes with Obsidian Smart Connections (local embeddings) and links session context into a Zettelkasten — embedding RAG architecture into the learning tool itself.',
    },
    {
      label: 'ML pipeline design',
      quote: 'Checkpoints must separate the resume, best and deploy roles.',
      body: 'On hesung multi-class training, the intuitive "latest = copy of best" caused resume to regress when best was an early epoch. Splitting into latest.pth / best_vN.pth / best_vN.onnx structurally removed the role mixing. Mix two roles in one file and they will collide.',
    },
    {
      label: 'Agent design',
      quote: 'Who controls the loop is the fork between an LLM call and an agent.',
      body: 'Implementing tools.py (Stage 3) then react.py (Stage 5) in order, I derived the difference at the code level: tools.py branches on tool_calls in code as a one-shot; react.py provides the while-True in code but the model decides each turn whether to continue or stop. The more loop control moves to the model, the harder problems it solves — and the harder debugging and predictability become.',
    },
  ],
  education: [
    'Intel AI for Future Workforce — 1,000+ hours of hands-on full-lifecycle AI (LLM RAG, CV, VLM, time-series team projects)',
    'OPIc IH (English) · Engineer Information Processing (written pass) · Air Environment Engineer · B.S. Environmental Engineering, Kyung Hee University',
  ],
};
