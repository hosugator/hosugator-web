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
          글로벌 EPC PM으로 3국 이해관계자의 요구를 기술 명세로 번역하던 현장 감각이,{' '}
          이제 Edge AI 시스템과 LLM 에이전트 설계의 밑거름이 됩니다.{' '}
          <span className="text-slate-900 font-medium">'반복되는 병목은 반드시 자동화한다'</span>는 원칙 아래,{' '}
          의도적 감속 학습과 Docs-as-Code로 기술을 자산화합니다.
        </>
      )
    },
    {
      text: (
        <>
          <span className="text-slate-900 font-medium">도메인을 고객의 언어로 번역해 에이전트를 정의하는 것</span>이 핵심 역할입니다.{' '}
          데이터 스키마부터 HMI까지 전 계층을 일관된 설계 철학으로 연결하며,{' '}
          실제 공정에 AI를 배포한 경험으로 비즈니스 임팩트를 증명합니다.
        </>
      )
    }
  ]
};