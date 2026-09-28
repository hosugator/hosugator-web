// data/aboutData.en.tsx
// Mirrors data/aboutData.tsx (2026-09-28 rework): what I do now → how I work → where I started.
import React from 'react';

export const aboutDataEn = {
  topLabel: "About Me",
  title: {
    main: "Building AI the Floor",
    highlight: "Can Actually Read."
  },
  content: [
    {
      text: (
        <>
          I move manufacturing visual inspection from rules to deep learning, and I have built{' '}
          <span className="text-slate-900 font-medium">the labeling and evaluation criteria that measure the models</span>{' '}
          along with an agent PoC that explains model results in the operators’ own language.
        </>
      )
    },
    {
      text: (
        <>
          Rules solve what rules can solve; models go only where a model is needed. I report performance not as one score but in the floor’s terms —{' '}
          <span className="text-slate-900 font-medium">“hold misses to this, and overkill is that.”</span>
        </>
      )
    },
    {
      text: (
        <>
          I started as a global EPC project manager, translating three countries’ ambiguous requirements{' '}
          <span className="text-slate-900 font-medium">into technical specs</span>{' '}
          — the same work I now do between models and the shop floor.
        </>
      )
    }
  ],
  stats: [
    // Correction (2026-09-28): Edge AI LMR was never implemented, so AUROC 99.99% was removed.
    { value: "21→11%", label: "Overkill at 5% miss · GV-001" },
    { value: "80%", label: "TCO Reduction · Hosugator" }
  ]
};
