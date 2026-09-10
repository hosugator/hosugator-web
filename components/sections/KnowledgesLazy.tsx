"use client";

// Knowledges(Blog)는 react-markdown·remark-gfm·Mermaid까지 물고 있는 무거운 클라이언트
// 컴포넌트라, 스크롤해서 도달하기 전까진 그 JS를 받지 않도록 동적 임포트로 분리한다.
// (히어로/프로젝트 초기 로드를 가볍게 유지하려는 것과 같은 원칙 — 자동재생 영상을
// hover에만 재생시킨 것과 동일한 이유.)
//
// WHY 이 파일이 따로 있나: `ssr: false` 옵션은 Server Component(app/page.tsx)
// 안에서 직접 next/dynamic에 줄 수 없다 — Client Component 경계 안에서만 허용된다.
// 그래서 이 얇은 "use client" 래퍼가 그 경계 역할을 한다.
import dynamic from "next/dynamic";

const Knowledges = dynamic(() => import("./Knowledges"), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center text-sm text-neutral-400">Loading…</div>
  ),
});

export default Knowledges;
