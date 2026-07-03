// data/experienceData.en.ts
export const experienceDataEn = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "Sole owner of Vision AI, edge infrastructure, and on-site LLM agents in a manufacturing domain.",
      highlights: [
        "AlignAI: replaced environment-sensitive rule-based OpenCV with U-Net (EfficientNet-B0) Segmentation — 100% detection · 91% pass rate · ~330ms CPU inference",
        "Supported 3 products from one repo via a ProductConfig registry; single-handedly built a GitHub-SSOT ML CI/CD pipeline (train→ONNX→GHCR→Argo CD) on a k3s edge cluster (edge cases recorded as ADRs)",
        "Edge AI LMR: Field→Cloud 4-tier + Cycle_ID Golden Key + 1D-CNN→LSTM→DQN 3-Stage chain for anomaly detection at AUROC 99.99%, with a solo-run React+TS HMI",
        "LLM agent roadmap (hand-built function calling & ReAct loop) · Agentic ERP automation turning days of manual work into 100%-integrity unattended runs · Focal Point for the Corning Varioptic (France) contract",
      ],
      tags: ["Vision AI", "Edge AI", "MLOps", "k3s", "PyTorch", "Agentic AI"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI Full Lifecycle Practicum",
      period: "2025",
      description: "1,000+ hours of end-to-end AI development, completing multiple team projects from planning to deployment.",
      highlights: [
        "Dotodo: LangChain·ChromaDB RAG + an LLM-as-a-Judge loop cutting latency and API cost by 60% each",
        "Sodam Diary: a BLIP→CLIP→LLM VLM 3-Stage pipeline cutting operating cost by 30% (Disability Hackathon finalist)",
        "Pictag: Attention embeddings lifting Re-ID by 50% · OpenVINO INT8 edge inference / Dorosee: multimodal UGV (Hackathon Grand Prize)",
        "KDLC: a SARIMA+LSTM+LightGBM 3-model weighted ensemble with 45+ engineered features",
      ],
      tags: ["LangChain", "RAG", "OpenVINO", "FastAPI", "PyTorch", "AWS"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "Led multi-billion KRW EPC projects through commissioning at a global combustion-equipment company.",
      highlights: [
        "Served as the communication hub reconciling technical conflicts across three countries (US, India, Korea)",
        "Translated ambiguous field requirements into technical specs and explained risks and trade-offs to non-technical decision-makers",
        "Exceeded the target margin by +4% through Q/C/D management and proactive risk response",
      ],
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
