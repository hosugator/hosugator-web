// data/insightsData.en.ts
export const insightsDataEn = {
  topLabel: "Engineering Principles",
  title: "6 Engineering\nPrinciples.",
  items: [
    {
      number: "01",
      title: "Business Acumen",
      principle: "Reframing a business problem as an agentic problem is half the design work.",
      desc: "My EPC PM experience translating ambiguous field demands from three-country stakeholders into technical specs transfers directly to AI system design. Technical choices are operational cost decisions.",
      project: "EPC PM → Edge AI LMR",
    },
    {
      number: "02",
      title: "Automation",
      principle: "Eliminate repetitive bottlenecks with code — but define the automation scope first to avoid yak shaving.",
      desc: "ERP Backup: no official API, non-standard popups → Playwright + Promise.all. Days of manual work → fully unattended automation, 100% data integrity.",
      project: "ERP Backup",
    },
    {
      number: "03",
      title: "Systems Design",
      principle: "Define the data's Golden Key first — the rest of the system follows.",
      desc: "When multi-axis sensor data couldn't be joined by timestamp alone, I set Cycle_ID as the Golden Key for Edge AI LMR — enabling single-key joins across all layers and immediate anomaly reproduction loops.",
      project: "Edge AI LMR",
    },
    {
      number: "04",
      title: "Knowledge Management",
      principle: "The context and decisions that AI cannot replace are stored in PKM.",
      desc: "I built a workflow using Obsidian Smart Connections to vector-index notes and link session context into a Zettelkasten — internalizing RAG architecture into my own learning tools.",
      project: "PKM + DaC",
    },
    {
      number: "05",
      title: "Troubleshooting",
      principle: "Narrow down root causes through log analysis — then document to prevent recurrence.",
      desc: "GPU driver conflicts caused non-deterministic busy race mode. I parsed dmesg·journalctl logs to identify the contention window, then recorded the resolution as an ADR to prevent recurrence.",
      project: "AlignAI · Linux",
    },
    {
      number: "06",
      title: "Tool Usage",
      principle: "Tools exist for a purpose — first ask whether this tool serves the goal at hand.",
      desc: "I combine LLMs, CLIs, PKM, and automation scripts — but always verify that a given tool is actually serving the current objective. Tool mastery should never substitute for goal clarity.",
      project: "All Projects",
    },
  ],
};
