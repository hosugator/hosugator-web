// data/projectsData.en.ts
export const projectsDataEn = {
    topLabel: "Featured Projects",
    title: "Technical \nImplementations.",
    items: [
        {
            // Slug "gv-001". Ratios and metrics only — no absolute counts, canvas sizes, or equipment names (decided 2026-09-28).
            title: "GV-001: Lens Array Visual Inspection — Structure Recovery and Evaluation Criteria",
            tags: ["#Industrial-AI", "#Evaluation", "#Labeling", "#PatchCore"],
            desc: "Recovered the array structure by assigning each detected lens an absolute grid position (row, col), and set the labeling and evaluation criteria before pushing the model. Three labelers × three rounds of 4-level ordinal labeling raised inter-rater ordinal α from 0.59 to 0.72; models were compared by overkill at a 5% miss rate instead of AUROC, cutting overkill from 21% to 11%.",
            pdfLink: "#",
            demoLink: "#",
            video: "",
            image: "",
        },
        {
            title: "Edge AI LMR: Intelligent Lens Thermoforming Process (Design)",
            tags: ["#Industrial-AI", "#Edge", "#Architecture"],
            desc: "A design-stage project. Designed a 4-tier architecture that joins 10ms PLC data across every layer on a per-cycle key (Cycle_ID) and routes data by temperature (MQTT · gRPC · Parquet), plus an anomaly → quality → prescription chain, and requested on-site review. It was deprioritized before implementation; the process knowledge and data-design judgments from it were reused in AlignAI and GV-001.",
            pdfLink: "/portfolio.pdf#page=2",
            demoLink: "#",
            video: "",
            image: "/projects/edge_ai_lmr_thumb.png"
        },
        {
            // Slug derives from the part before ':' → "v1-aoi". Must match the KO entry,
            // otherwise the EN locale loses the detail page and the demo button.
            title: "V1-AOI: PatchCore-based Lens Surface Contamination Detection",
            tags: ["#Industrial-AI", "#AnomalyDetection", "#PatchCore", "#ONNX"],
            desc: "Image AUROC 0.9906 · F1 0.9879 on contamination verdicts — achieved without training on a single defective image. Training on 267 normal samples only, PatchCore (WideResNet50, 10% coreset) builds the memory bank, removing the labeling bottleneck; circle-crop preprocessing eliminated background false responses. ONNX export opens a PyTorch-free edge CPU inference path (254.9ms/frame).",
            pdfLink: "#",
            demoLink: "#",
            video: "",
            image: ""
        },
        {
            title: "AlignAI: Vision Alignment + MLOps + On-site LLM Agent (PoC)",
            tags: ["#Industrial-AI", "#LLM-Agent", "#MLOps", "#k3s", "#React"],
            desc: "Replaced rule-based OpenCV with U-Net Segmentation (100% detection · 91% pass rate), then built GitOps ML CI/CD (GHCR→Argo CD) with Docker·k3s edge deployment, verified as a local PoC, and connected a React+TS HMI (UI/UX) and an LLM agent PoC (function calling · ReAct) that explains inference results in shop-floor language — an end-to-end industrial AI system.",
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
            // Correction (2026-09-28): a team project where I had a supporting role — an experienced teammate owned the ML.
            title: "Pictag: Lightweight CCTV AI SaaS for Small Businesses (Team · Supporting Role)",
            tags: ["#Re-ID", "#OpenVINO", "#WebSocket"],
            desc: "A team project where I owned the front end of the model pipeline — detecting people with YOLO and handing results downstream (Re-ID) through an agreed interface, later developed into buffered delivery for stability. An experienced teammate owned the Re-ID model; working alongside, I learned how the backbone was decomposed to compare embedding methods and how computational complexity (Big-O) settled the edge architecture. The team reached 50%↑ Re-ID training efficiency with Attention embeddings and real-time GPU-less edge inference with OpenVINO INT8. I later used that perspective as a design resource in other projects.",

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
            video: "/projects/dorosee_demo_anonymize.mp4",
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
