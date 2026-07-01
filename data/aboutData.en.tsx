// data/aboutData.en.tsx
import React from 'react';

export const aboutDataEn = {
  topLabel: "About Me",
  title: {
    main: "Field Insight Meets",
    highlight: "System Design."
  },
  content: [
    {
      text: (
        <>
          My global EPC PM background — translating ambiguous field requirements from three-country stakeholders into technical specs —{' '}
          now directly informs how I design Edge AI systems and LLM agents.{' '}
          Under the principle of{' '}
          <span className="text-slate-900 font-medium">'automate every recurring bottleneck,'</span>{' '}
          I convert technical work into reusable assets through deliberate learning and Docs-as-Code.
        </>
      )
    },
    {
      text: (
        <>
          My core role is{' '}
          <span className="text-slate-900 font-medium">translating domain knowledge into the language of agentic systems.</span>{' '}
          By connecting every layer — from data schema to HMI — under a consistent design philosophy,{' '}
          I deliver verifiable business impact through AI deployed in production.
        </>
      )
    }
  ],
  stats: [
    { value: "99.99%", label: "AUROC · Edge AI LMR" },
    { value: "80%", label: "TCO Reduction · Hosugator" }
  ]
};