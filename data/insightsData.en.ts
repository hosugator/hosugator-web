// data/insightsData.en.ts
export const insightsDataEn = {
  topLabel: "Engineering Principles",
  title: "6 Engineering\nPrinciples.",
  items: [
    {
      number: "01",
      title: "Business Acumen",
      principle: "Reframing a business problem as an agentic problem is half the design work.",
      desc: "My EPC PM experience translating ambiguous demands from three-country stakeholders into technical specs transfers directly to AI design. The technically better choice isn't always best once relationship and operating costs are counted — technical choices are operational cost decisions.",
      project: "EPC PM → Edge AI LMR",
    },
    {
      number: "02",
      title: "Automation",
      principle: "Eliminate repetitive bottlenecks with code — but define the automation scope first to avoid yak shaving.",
      desc: "In my first week, with no official API available, I broke through a backlog of tens of thousands of approval documents using a Playwright + Promise.all Agentic pipeline — turning days of manual work into fully unattended automation with 100% data integrity.",
      project: "ERP Backup",
    },
    {
      number: "03",
      title: "Systems Design",
      principle: "Define the data's Golden Key first — the rest of the system follows.",
      desc: "When multi-axis sensor data couldn't be joined by timestamp alone, I set Cycle_ID as the Golden Key — enabling single-key joins across every layer and an immediate anomaly reproduction loop. The data model must be defined before the infrastructure.",
      project: "Edge AI LMR",
    },
    {
      number: "04",
      title: "Evaluation Design",
      principle: "Evaluation design decides whether a model is good — no deployment without evaluation.",
      desc: "With an anomaly rate below 1%, I redefined AUROC (not accuracy) as the core metric and reached 99.99%. On Dotodo, an LLM-as-a-Judge loop verified recommendation quality without humans and cut API cost by 60%.",
      project: "Edge AI LMR · Dotodo",
    },
    {
      number: "05",
      title: "Agent Design",
      principle: "Who controls the loop is the dividing line between an LLM call and an agent.",
      desc: "I implemented tool_calls branching (code-controlled) and a ReAct loop (the model decides each turn whether to end while True) in sequence, internalizing the structural difference at the code level. As control shifts to the model, expressiveness and debugging difficulty rise together.",
      project: "AlignAI LLM Agent",
    },
    {
      number: "06",
      title: "Knowledge Management",
      principle: "The context and decisions AI cannot replace are stored in PKM.",
      desc: "When CLI AI sessions dropped context on disconnect, I built a workflow using Obsidian Smart Connections (local embeddings) to vector-index notes and link session context into a Zettelkasten — internalizing RAG architecture into my own learning tools.",
      project: "PKM + Docs-as-Code",
    },
  ],
};
