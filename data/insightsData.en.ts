// data/insightsData.en.ts
// Mirrors data/insightsData.ts (2026-09-28 rework). See that file for the reasoning.
export const insightsDataEn = {
  topLabel: "Engineering Principles",
  title: "Engineering\nPrinciples.",
  items: [
    {
      number: "01",
      title: "Rules vs. Models",
      principle: "Let rules solve what rules can solve, and put models only where a model is needed.",
      desc: "I confirmed that most visual-inspection items could be computed with classical vision, narrowing the part that truly needs a model to surface defects. Finding lenses is left to a model, but assigning each found lens its position is solved with grid arithmetic. AlignAI is the opposite case — rule-based alignment that broke under lighting changes was replaced with U-Net. The boundary sits wherever rules stop holding.",
      project: "GV-001 · AlignAI",
    },
    {
      number: "02",
      title: "Data Provenance",
      principle: "Take data only from ground truth. Data that passed through inference fails silently on edge cases.",
      desc: "Every rule I wrote to infer wafer identity from capture signals failed on some edge case — not because the rules were bad, but because the information was never in the signal. So identity comes only from user input, and the side on which an array is cut off is never inferred: in a real capture the left side was cut, yet the empty slots appeared at the right end.",
      project: "GV-001",
    },
    {
      number: "03",
      title: "Evaluation Design",
      principle: "AUROC picks the model; the operating point is what convinces the floor.",
      desc: "One preprocessing change raised AUROC while worsening overkill at every threshold — AUROC looks at the whole ranking, an operating point looks at one spot. So I fix an operating constraint first, such as \"overkill at a 5% miss rate\", and compare there. Growing the normal bank barely moved AUROC, yet cut overkill from 21% to 11%.",
      project: "GV-001",
    },
    {
      number: "04",
      title: "Trusting a Measurement",
      principle: "First compare a number with the system's natural variation; if that doesn't settle it, decompose it.",
      desc: "A 0.2-second gain from three training micro-optimizations was rejected against 0.5 seconds of run-to-run variation under identical conditions. A \"-48% sharpness\" figure used as evidence for two months turned out to lump signal loss and noise reduction into one number; separating them gave the opposite conclusion — high-frequency SNR was actually higher.",
      project: "GV-001",
    },
    {
      number: "05",
      title: "System Design",
      principle: "Define the data's golden key first — the rest of the system follows.",
      desc: "Where multi-axis sensor data could not be grouped into one cycle by timestamp alone, I designed an architecture that first defines Cycle_ID — identifying one process cycle — as the golden key (Edge AI LMR, not implemented). In GV-001's storage design, folder names likewise use only immutable facts such as capture time, with everything else moved into metadata alongside its provenance. The data model comes before the infrastructure.",
      project: "Edge AI LMR (design) · GV-001",
    },
    {
      number: "06",
      title: "Keeping the Line Sharp",
      principle: "Never blur the line between what I have done and what I have not.",
      desc: "I count something as \"known for sure\" only when I have a record of being wrong about it and paying for that in numbers. A PoC is written as a PoC and a design as a design, and in applications I mark each required skill as ○ done · △ adjacent · × not yet. The ○ marks are believable only because the × marks are not hidden.",
      project: "Resume · Portfolio",
    },
  ],
};
