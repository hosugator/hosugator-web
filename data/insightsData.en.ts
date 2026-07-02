// data/insightsData.en.ts
export const insightsDataEn = {
  topLabel: "Engineering Principles",
  title: "3 Engineering\nPrinciples.",
  items: [
    {
      number: "01",
      title: "End-to-End Ownership",
      principle: "AI works in the field only when you own the whole cycle — from defining the business problem to deploying and operating the product.",
      desc: "Managing the full lifecycle of long EPC projects as a global PM now translates into full-stack execution across planning, data, ML, infrastructure, deployment, and operations. I proved business impact by deploying and operating AI on real production lines via GitOps and k3s.",
      project: "EPC PM → AlignAI deploy/ops",
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
