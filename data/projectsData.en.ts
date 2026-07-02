// data/projectsData.en.ts
export const projectsDataEn = {
    topLabel: "Featured Projects",
    title: "Technical \nImplementations.",
    items: [
        {
            title: "Edge AI LMR: Intelligent Lens Thermoforming Process",
            tags: ["#Industrial-AI", "#Edge", "#PyTorch"],
            desc: "Anomaly detection at AUROC 99.99%. Built on a Field→Cloud 4-tier architecture with a 1D-CNN→LSTM→DQN 3-Stage AI chain; Cycle_ID Golden Key enables single-key joins across all layers and immediate anomaly reproduction. Docker edge deployment + k3s migration, React+TS real-time HMI in operation.",
            pdfLink: "/portfolio.pdf#page=2",
            demoLink: "#",
            video: "",
            image: "/projects/edge_ai_lmr_thumb.png"
        },
        {
            title: "AlignAI: Vision Alignment + MLOps + On-site LLM Agent",
            tags: ["#Industrial-AI", "#LLM-Agent", "#MLOps", "#k3s", "#React"],
            desc: "Replaced rule-based OpenCV with U-Net Segmentation (100% detection · 91% pass rate), then built GitOps ML CI/CD (GHCR→Argo CD) on a Docker·k3s edge cluster and integrated a React+TS HMI (UI/UX) with an LLM agent (function calling · ReAct) that explains field anomalies — an end-to-end industrial AI system.",
            pdfLink: "/portfolio.pdf",
            demoLink: "#",
            video: "",
            image: ""
        },
        {
            title: "ERP Backup: Legacy ERP Data Migration Automation",
            tags: ["#Automation", "#TypeScript", "#Playwright"],
            desc: "Days of manual work → fully unattended automation at 100% integrity. With no official API and non-standard dynamic popups, Playwright + Promise.all structurally eliminates async Race Conditions. Built solo in week 1: POM pattern, .env credential isolation, full CSV audit log.",
            pdfLink: "/portfolio.pdf#page=5",
            demoLink: "#",
            video: "",
            image: "/projects/erp_backup_thumb.png"
        },
        {
            title: "Dotodo: AI-Powered Personalized Task Recommendation with Voice Input",
            tags: ["#LangChain", "#RAG", "#FastAPI"],
            desc: "60%↓ LLM latency and 60%↓ API cost. LangChain·ChromaDB RAG + MSA (Backend/Model separation) for zero-downtime model upgrades. Mecab-ko morpheme analysis + 768D vector Top-K=3 retrieval, LLM as a Judge self-evaluation loop.",
            pdfLink: "/projects/dotodo_en.pdf",
            demoLink: "#",
            video: "/projects/dotodo_demo.mov",
            image: "/projects/dotodo_thumb.png"
        },
        {
            title: "Sodamdiary: Voice-Based Photo Description App for Visually Impaired",
            tags: ["#VLM", "#OpenVINO", "#FastAPI"],
            desc: "30%↓ operating cost, response 30s→20s. Replaced GPT-4V single-model (₩1.3M/mo) with a BLIP+CLIP+LLM 3-Stage pipeline, OpenVINO 4-bit quantization + asyncio parallelism. 2025 Korea Disability Hackathon finalist.",
            pdfLink: "/projects/sodamdiary_en.pdf",
            demoLink: "#",
            video: "/projects/sodamdiary_demo.mp4",
            image: "/projects/sodamdiary_thumb.png"
        },
        {
            title: "Pictag: Lightweight CCTV AI SaaS for Small Businesses",
            tags: ["#Re-ID", "#OpenVINO", "#WebSocket"],
            desc: "50%↑ Re-ID accuracy and training efficiency. A/B tested Linear / Pooling / Attention Head embeddings from a decomposed YOLO backbone → Attention Head adopted. OpenVINO INT8 enables real-time inference on CPU-only edge hardware. 4-Thread queue pipeline, Django+WebSocket heatmap dashboard.",
            pdfLink: "/projects/pictag_en.pdf",
            demoLink: "#",
            video: "/projects/pictag_demo.mp4",
            image: "/projects/pictag_thumb.png"
        },
        {
            title: "Hosugator: Cloud-Native Portfolio Architecture",
            tags: ["#Next.js", "#AWS", "#GitHub-Actions"],
            desc: "80%↓ TCO. Re-architected cost by migrating AWS serverless (ALB+ECS) to a self-managed EC2/Nginx setup, then converged on S3 static hosting to match the site's static nature. Zero-downtime CI/CD via GitHub Actions + IAM OIDC keyless auth (role-based temporary credentials, no access keys).",
            pdfLink: "/projects/hosugator_en.pdf",
            demoLink: "#",
            video: "",
            image: "/projects/hosugator_thumb_latest.png"
        },
        {
            title: "Cureat: AI Culinary Recommendation System",
            tags: ["#NLP", "#VectorDB", "#FastAPI"],
            desc: "AI culinary curation that removes 20%+ of ad-driven content. Collects fragmented unstructured data + Ko-BERT filtering, detects intent with Okt morpheme analysis, and delivers personalization via a 2-Stage hybrid search (Vector DB cosine similarity). FastAPI async pipeline.",
            pdfLink: "/projects/cureat_en.pdf",
            demoLink: "#",
            video: "/projects/cureat_demo.mov",
            image: "/projects/cureat_thumb.png"
        },
        {
            title: "Dorosee: CV/LLM Integrated Multimodal UGV Platform",
            tags: ["#CV", "#LLM", "#ROS"],
            desc: "2025 UWC Hackathon Grand Prize winner. A context-aware multimodal UGV (Unmanned Ground Vehicle) platform combining YOLOv8 fine-tuning with an LLM voice interface. A Unity 3D simulation environment overcame hardware constraints and completed integrated AI model testing.",
            pdfLink: "/projects/dorosee_en.pdf",
            demoLink: "#",
            video: "/projects/dorosee_demo.mp4",
            image: "/projects/dorosee_thumb.png"
        },
        {
            title: "KDLC: Logistics Demand Forecasting Competition",
            tags: ["#Time-Series", "#Ensemble", "#Feature-Engineering"],
            desc: "Feature engineering beats model selection — proven with 45+ features. Lag · Rolling · sin/cos cyclical encoding, SARIMA+LSTM+LightGBM 3-Model weighted ensemble, TimeSeriesSplit to structurally prevent Data Leakage.",
            pdfLink: "/portfolio.pdf#page=12",
            demoLink: "#",
            video: "",
            image: "/projects/kdlc_thumb.png"
        },
        {
            title: "go2fit: Fitness Social App Backend & DB Design",
            tags: ["#Backend", "#PostgreSQL", "#DDD"],
            desc: "Solo-designed a 3-axis (User·Exercise·Community) PostgreSQL schema. UUID PK (Kakao login) + 5-layer FK chain for workout-record integrity, and 4-layer security (JWT Access+Refresh rotation, TokenBlacklist, Idempotency Key). MediaPipe per-exercise pose analyzers (DDD), an async video job queue (FSM), and a face de-identification pipeline.",
            pdfLink: "/portfolio.pdf",
            demoLink: "#",
            video: "",
            image: ""
        },
    ]
};
