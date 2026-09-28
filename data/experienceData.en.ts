// data/experienceData.en.ts
export const experienceDataEn = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "Sole owner of Vision AI and edge infrastructure in a manufacturing domain, including the labeling and evaluation criteria that measure models and an agent PoC that explains inference results in shop-floor language.",
      highlights: [
        "AlignAI: replaced environment-sensitive rule-based OpenCV with U-Net (EfficientNet-B0) Segmentation — 100% detection · 91% pass rate · ~330ms CPU inference",
        "Supported 3 products from one repo via a ProductConfig registry; single-handedly built a GitHub-SSOT ML CI/CD pipeline (train→ONNX→GHCR→Argo CD) with k3s edge deployment, verified as a local PoC (edge cases recorded as ADRs)",
        "GV-001: recovered array structure by assigning absolute grid positions to detected lenses, and designed the criteria that measure models — 3 labelers × 3 rounds of ordinal labeling (α 0.59 → 0.72) and operating-point evaluation (overkill 21% → 11% at a 5% miss rate)",
        "Edge AI LMR (design): designed a Cycle_ID golden key and a data-temperature 3-tier architecture and requested on-site review — the process knowledge and data-design judgments were reused in AlignAI and GV-001",
        "LLM agent PoC (hand-built function calling & ReAct loop) · Agentic ERP automation turning days of manual work into 100%-integrity unattended runs · Focal Point for the Corning Varioptic (France) contract",
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
        "Pictag (team · supporting role): learned architecture decomposition and computational-complexity review from an experienced teammate / Dorosee: multimodal UGV (Hackathon Grand Prize)",
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
