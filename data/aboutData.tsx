// data/aboutData.tsx
import React from 'react';

export const aboutData = {
  topLabel: "About Me",
  title: {
    main: "현장 감각과",
    highlight: "시스템 설계."
  },
  content: [
    {
      text: (
        <>
          모든 문제를 <span className="text-slate-900 font-medium">'왜'</span>에서 정의합니다.{' '}
          글로벌 EPC PM으로 3국 이해관계자의 추상적 요구를 기술 명세로 번역하던 현장 감각이,{' '}
          이제 제조 현장의 Edge AI 시스템과 LLM 에이전트를 설계하는 밑거름이 됩니다.{' '}
          <span className="text-slate-900 font-medium">'반복되는 병목은 반드시 자동화한다'</span>는 원칙 아래,{' '}
          의도적 감속 학습과 Docs-as-Code로 기술을 자산화합니다.
        </>
      )
    },
    {
      text: (
        <>
          기획·데이터·ML·인프라·백엔드·UI/UX·운영까지{' '}
          <span className="text-slate-900 font-medium">전 계층을 하나의 설계 철학으로 연결하는 풀스택 AI 개발자</span>입니다.{' '}
          그래서 지금 프로젝트의 병목이 어디이고 어디에 자원을 투입해야 풀리는지 판단할 수 있습니다.{' '}
          실제 제조 공정에 AI를 배포한 경험으로 비즈니스 임팩트를 증명합니다.
        </>
      )
    }
  ],
  stats: [
    { value: "99.99%", label: "AUROC · Edge AI LMR" },
    { value: "80%", label: "TCO 절감 · Hosugator" }
  ]
};
