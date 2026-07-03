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
          I define every problem from <span className="text-slate-900 font-medium">'why.'</span>{' '}
          The instinct I built as a global EPC PM — translating three-country stakeholders' ambiguous demands into technical specs, grounded in 'why' —{' '}
          now underpins <span className="text-slate-900 font-medium">AI engineering that understands a product end to end</span>.
        </>
      )
    },
    {
      text: (
        <>
          That curiosity made me a{' '}
          <span className="text-slate-900 font-medium">full-stack AI engineer who connects every layer</span>{' '}
          — planning, data, ML, infrastructure, backend, DB, UI/UX, and operations — under one design philosophy.{' '}
          So I can tell where a project's bottleneck actually is, and where resources will resolve it.
        </>
      )
    },
    {
      text: (
        <>
          In a manufacturing domain today, I've shipped cross-team automation, vision-alignment and anomaly-detection models,{' '}
          a solo-built GitOps pipeline, and a prototype agent that has an LLM explain vision results in the operators' own language.{' '}
          Under the principle of <span className="text-slate-900 font-medium">'automate every recurring bottleneck,'</span>{' '}
          I focus on making technology a genuinely useful tool on the floor — never technology for its own sake.
        </>
      )
    }
  ],
  stats: [
    { value: "99.99%", label: "AUROC · Edge AI LMR" },
    { value: "80%", label: "TCO Reduction · Hosugator" }
  ]
};
