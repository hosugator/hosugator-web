// data/aboutData.tsx
import React from "react";

export const aboutData = {
  topLabel: "About Me",
  title: {
    main: "제조 현장의 Vision AI를",
    highlight: "프로덕션으로 만듭니다.",
  },
  content: [
    {
      text: (
        <>
          글로벌 EPC PM으로 다진{" "}
          <span className="text-slate-900 font-medium">
            '왜'에서 시작하는 설계 감각
          </span>
          을, 지금은 제조 현장의 Vision AI를 배포·운영하는 데 씁니다.
        </>
      ),
    },
    {
      text: (
        <>
          기획·데이터·ML·인프라·배포·운영까지{" "}
          <span className="text-slate-900 font-medium">전 계층을 연결</span>해,
          AI가 현장에서 실제로 작동하게 만듭니다.
        </>
      ),
    },
    {
      text: (
        <>
          제조 도메인에서{" "}
          <span className="text-slate-900 font-medium">
            타부서 업무 자동화, 비전 정렬·이상탐지 모델 실증, GitOps 파이프라인 단독 구축
          </span>
          까지 진행했습니다.
        </>
      ),
    },
    {
      text: (
        <>
          비전 탐지 결과를{" "}
          <span className="text-slate-900 font-medium">
            LLM이 현장 언어로 설명하는 에이전트 프로토타입
          </span>
          도 함께 배포했습니다.
        </>
      ),
    },
    {
      text: (
        <>
          <span className="text-slate-900 font-medium">
            '반복되는 병목은 반드시 자동화한다'
          </span>
          — 기술이 기술로만 남지 않게 하는 원칙입니다.
        </>
      ),
    },
  ],
};
