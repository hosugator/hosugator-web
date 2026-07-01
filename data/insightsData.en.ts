// data/insightsData.en.ts
export const insightsDataEn = {
  topLabel: "Engineering Principles",
  title: "3 Engineering\nPrinciples.",
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
      title: "Systems Design",
      principle: "Define the data's Golden Key first — the rest of the system follows.",
      desc: "When multi-axis sensor data couldn't be joined by timestamp alone, I set Cycle_ID as the Golden Key — enabling single-key joins across every layer and an immediate anomaly reproduction loop. The data model must be defined before the infrastructure.",
      project: "Edge AI LMR",
    },
    {
      number: "03",
      title: "Agent Design",
      principle: "Who controls the loop is the dividing line between an LLM call and an agent.",
      desc: "I implemented tool_calls branching (code-controlled) and a ReAct loop (the model decides each turn whether to end while True) in sequence, internalizing the structural difference at the code level. As control shifts to the model, expressiveness and debugging difficulty rise together.",
      project: "AlignAI LLM Agent",
    },
  ],
};
