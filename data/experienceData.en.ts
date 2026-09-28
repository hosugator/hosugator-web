// data/experienceData.en.ts
// Mirrors data/experienceData.ts (2026-09-28 rework) — PATH tells the flow; numbers live in Projects.
export const experienceDataEn = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "Moving manufacturing visual inspection from rules to deep learning — and setting the criteria that measure the models.",
      highlights: [
        "GV-001 — grid-structure recovery from detections, labeling and evaluation criteria",
        "AlignAI — U-Net migration, GitOps ML CI/CD, explanation-agent PoC",
        "V1-AOI — label-free contamination detection · Edge AI LMR (design) · ERP automation",
      ],
      tags: ["Vision AI", "Evaluation", "MLOps", "PatchCore", "LLM Agent (PoC)"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI Full Lifecycle Practicum",
      period: "2025",
      description: "1,000 hours of full-cycle AI — RAG, VLM, and CV team projects taken from planning to deployment.",
      highlights: [
        "Dorosee — multimodal emergency-detection UGV, 2025 UWC Hackathon Grand Prize",
        "Sodam Diary — VLM photo narration, Korea Disability Hackathon finalist",
        "Dotodo — voice RAG recommendations with an LLM-as-a-Judge evaluation loop",
      ],
      tags: ["RAG", "VLM", "YOLOv8", "FastAPI", "PyTorch"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "Led multi-billion KRW EPC projects through commissioning at a global combustion-equipment company.",
      highlights: [
        "Reconciled technical conflicts across US, India, and Korea",
        "Translated ambiguous field requirements into technical specs",
        "Exceeded the target margin by 4%",
      ],
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
