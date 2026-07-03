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
          글로벌 EPC PM으로 3국 이해관계자의 추상적 요구를 '왜'에 기반해 기술 명세로 번역하던 감각이,{' '}
          이제 <span className="text-slate-900 font-medium">제품의 시작과 끝을 이해하고 만드는 AI 엔지니어링</span>의 토대가 됩니다.
        </>
      )
    },
    {
      text: (
        <>
          이 호기심은 기획·데이터·ML·인프라·백엔드·DB·UI/UX·운영까지{' '}
          <span className="text-slate-900 font-medium">개발의 전 계층을 하나의 설계 철학으로 연결하는 풀스택 AI 개발자</span>로 이어졌습니다.{' '}
          그래서 지금 프로젝트의 병목이 어디이고, 어디에 자원을 투입해야 그 병목이 풀리는지 판단할 수 있습니다.
        </>
      )
    },
    {
      text: (
        <>
          현재 제조 도메인에서 타부서 업무 자동화, 비전 정렬·이상탐지 모델 실증,{' '}
          GitOps 파이프라인 단독 구축, 그리고 비전 탐지 결과를 LLM이 현장 언어로 설명하는 에이전트 프로토타입까지 배포했습니다.{' '}
          <span className="text-slate-900 font-medium">'반복되는 병목은 반드시 자동화한다'</span>는 원칙 아래,{' '}
          기술이 기술로만 남지 않고 현장의 유용한 도구가 되게 하는 데 집중합니다.
        </>
      )
    }
  ],
  stats: [
    { value: "99.99%", label: "AUROC · Edge AI LMR" },
    { value: "80%", label: "TCO 절감 · Hosugator" }
  ]
};
