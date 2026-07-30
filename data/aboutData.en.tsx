// data/aboutData.en.tsx
import React from 'react';

export const aboutDataEn = {
  topLabel: "About Me",
  title: {
    main: "I take manufacturing Vision AI",
    highlight: "into production."
  },
  content: [
    {
      text: (
        <>
          The <span className="text-slate-900 font-medium">'why'-first design instinct</span>{' '}
          I built as a global EPC PM now drives how I ship and operate Vision AI on the factory floor.
        </>
      )
    },
    {
      text: (
        <>
          I connect <span className="text-slate-900 font-medium">every layer</span>{' '}
          — planning, data, ML, infrastructure, deployment, operations — so AI actually works on site.
        </>
      )
    },
    {
      text: (
        <>
          In manufacturing, I've shipped{' '}
          <span className="text-slate-900 font-medium">
            cross-team automation, vision-alignment and anomaly-detection models, and a solo-built GitOps pipeline
          </span>.
        </>
      )
    },
    {
      text: (
        <>
          I also deployed a{' '}
          <span className="text-slate-900 font-medium">
            prototype agent that has an LLM explain vision results in the operators' own language
          </span>.
        </>
      )
    },
    {
      text: (
        <>
          <span className="text-slate-900 font-medium">'Automate every recurring bottleneck'</span>{' '}
          — the principle behind making technology a genuinely useful tool, not tech for its own sake.
        </>
      )
    }
  ]
};
