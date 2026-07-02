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
          I define every problem starting from <span className="text-slate-900 font-medium">'why.'</span>{' '}
          My global EPC PM background — translating ambiguous demands from three-country stakeholders into technical specs —{' '}
          now grounds how I design Edge AI systems and LLM agents on the manufacturing floor.{' '}
          Under the principle of{' '}
          <span className="text-slate-900 font-medium">'automate every recurring bottleneck,'</span>{' '}
          I turn engineering work into reusable assets through deliberate learning and Docs-as-Code.
        </>
      )
    },
    {
      text: (
        <>
          I'm a{' '}
          <span className="text-slate-900 font-medium">full-stack AI engineer who connects every layer</span>{' '}
          — planning, data, ML, infrastructure, backend, UI/UX, and operations — under a single design philosophy.{' '}
          That lets me pinpoint where a project's bottleneck lies and where resources will actually resolve it.{' '}
          I prove business impact through AI deployed on real production lines.
        </>
      )
    }
  ],
  stats: [
    { value: "99.99%", label: "AUROC · Edge AI LMR" },
    { value: "80%", label: "TCO Reduction · Hosugator" }
  ]
};
