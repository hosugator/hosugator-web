// data/aboutData.tsx
//
// 2026-09-28 개편 — 제목을 「병목을 해결하는 E2E 엔지니어」에서 바꿨다. 딥오토 지원서에서 가장 잘
// 먹힌 축(모델 결과를 현장이 읽을 수 있게 만든다 · 모델을 재는 기준을 먼저 세운다)으로 정체성을 옮겼다.
// 본문은 셋: 지금 하는 일 → 일하는 방식 → 출발점. 수치는 stats 와 Projects 에만 둔다.
import React from "react";

export const aboutData = {
  topLabel: "About Me",
  title: {
    main: "현장이 읽을 수 있는",
    highlight: "AI를 만드는 엔지니어.",
  },
  content: [
    {
      text: (
        <>
          제조 현장의 비전 검사를 규칙 기반에서 딥러닝으로 옮기고,{" "}
          <span className="text-slate-900 font-medium">
            모델을 재는 라벨 · 평가 기준
          </span>
          과 모델 결과를 현장 언어로 해설하는 에이전트 PoC 까지 만들었습니다.
        </>
      ),
    },
    {
      text: (
        <>
          규칙이 풀 수 있는 것은 규칙으로, 모델이 필요한 곳만 모델로 둡니다. 성능은
          한 점수가 아니라{" "}
          <span className="text-slate-900 font-medium">
            「미탐을 이만큼 묶으면 과탐은 얼마」
          </span>
          라는 현장의 언어로 말합니다.
        </>
      ),
    },
    {
      text: (
        <>
          출발은 글로벌 EPC PM 이었습니다. 3국 이해관계자의 추상적 요구를{" "}
          <span className="text-slate-900 font-medium">기술 명세로 옮기던 일</span>
          이, 지금은 모델과 현장 사이를 잇는 데 같은 방식으로 쓰입니다.
        </>
      ),
    },
  ],
  stats: [
    // 정정(2026-09-28): Edge AI LMR 은 구현 전이라 AUROC 99.99% 를 내렸다.
    { value: "21→11%", label: "과탐률 · 미탐 5% 운영점 · GV-001" },
    { value: "80%", label: "TCO 절감 · Hosugator" },
  ],
};
